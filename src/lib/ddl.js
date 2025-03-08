const fs = require("fs");
const path = require("path");
const { get } = require("./mssql");

class DDL {
    constructor(databaseName, config) {
        this.databaseName = databaseName;
        this.tables = {};
        this.config = config;
    }

    table(tableName = "", columns = {}, constraints = []) {
        const newColumns = {};
        const newConstraints = {};

        for (const columnName in columns) {
            const column = columns[columnName];
            newColumns[columnName] = {
                type: column.type,
                notNull: column.notNull,
                ai: column.ai,
            };

            if (column.unique !== undefined) {
                newConstraints[`uq_${tableName}_${columnName}`] = { unique: column.unique, columns: [columnName] };
            }

            if (column.pk !== undefined) {
                newConstraints[`pk_${tableName}_${columnName}`] = { pk: column.pk, columns: [columnName] };
            }

            if (column.fk !== undefined) {
                newConstraints[`fk_${tableName}_${columnName}`] = { fk: column.fk, columns: [columnName] };
            }

            if (column.check !== undefined) {
                newConstraints[`ck_${tableName}_${columnName}`] = { check: column.check, columns: [columnName] };
            }

            if (column.def !== undefined) {
                newConstraints[`df_${tableName}_${columnName}`] = { def: column.def, columns: [columnName] };
            }

            if (column.index !== undefined) {
                newConstraints[`ix_${tableName}_${columnName}`] = { index: column.index, columns: [columnName] };
            }
        }

        for (const constraint of constraints) {
            if (constraint.unique !== undefined) {
                newConstraints[`uq_${tableName}_${constraint.columns.join("_")}`] = { unique: constraint.unique, columns: constraint.columns };
            }

            if (constraint.pk !== undefined) {
                newConstraints[`pk_${tableName}_${constraint.columns.join("_")}`] = { pk: constraint.pk, columns: constraint.columns };
            }

            if (constraint.fk !== undefined) {
                newConstraints[`fk_${tableName}_${constraint.columns.join("_")}`] = { fk: constraint.fk, columns: constraint.columns };
            }

            if (constraint.check !== undefined) {
                newConstraints[`ck_${tableName}_${constraint.columns.join("_")}`] = { check: constraint.check, columns: constraint.columns };
            }

            if (constraint.def !== undefined) {
                newConstraints[`df_${tableName}_${constraint.columns.join("_")}`] = { def: constraint.def, columns: constraint.columns };
            }

            if (constraint.index !== undefined) {
                newConstraints[`ix_${tableName}_${constraint.columns.join("_")}`] = { index: constraint.index, columns: constraint.columns };
            }
        }
        this.tables[tableName] = {
            columns: newColumns,
            constraints: newConstraints,
        };
    }

    read(filename) {
        let data = {};
        try {
            data = fs.readFileSync(filename, {
                encoding: "utf8",
            });
            data = JSON.parse(data);
        } catch (error) {}

        return data;
    }

    write(filename, data = {}) {
        const dirname = path.dirname(filename);

        try {
            fs.readdirSync(dirname);
        } catch (error) {
            fs.mkdirSync(dirname, {
                recursive: true,
            });
        }

        data = JSON.stringify(data);
        fs.writeFileSync(filename, data);
    }

    build(oldDb, newDb) {
        const dbQuery = [];
        const tablesQuery = [];

        if (false) {
            oldDb = {};
            dbQuery.push([`USE master;\r\n`, `ALTER DATABASE ${newDb.databaseName} SET SINGLE_USER WITH ROLLBACK IMMEDIATE;\r\n`, `DROP DATABASE ${newDb.databaseName};\r\n`].join("\r\n"));
        }

        if (oldDb.databaseName === undefined) {
            dbQuery.push([`USE master;\r\n`, `CREATE DATABASE ${newDb.databaseName};\r\n`].join("\r\n"));
        }

        for (const tableName in newDb.tables) {
            const oldTable = oldDb?.tables?.[tableName];
            const table = newDb.tables[tableName];
            const columnsQuery = [];
            const columnsChangedQuery = [];
            const constraintsQuery = [];
            const constraintsChangedQuery = [];

            for (const columnName in table.columns) {
                const oldColumn = oldTable?.columns?.[columnName];
                const column = table.columns[columnName];
                const columnQuery = [];
                const columnChanged = oldColumn?.type !== column.type || oldColumn?.notNull !== column.notNull;

                if (columnChanged) {
                    columnQuery.push(columnName);
                    columnQuery.push(column.type);

                    if (column.notNull !== undefined) {
                        columnQuery.push(column.notNull ? "NOT NULL" : "NULL");
                    }

                    if (column.ai !== undefined) {
                        columnQuery.push("IDENTITY(1,1)");
                    }

                    if (oldColumn === undefined) {
                        columnsQuery.push(columnQuery.join(" "));
                    } else {
                        columnsChangedQuery.push(columnQuery.join(" "));
                    }
                }
            }

            for (const constraintName in table.constraints) {
                const oldConstraint = oldTable?.constraints?.[constraintName];
                const constraint = table.constraints[constraintName];

                if (oldConstraint?.unique !== constraint.unique && constraint.unique !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                    }
                    constraintsQuery.push([`ALTER TABLE ${tableName}`, `ADD CONSTRAINT ${constraintName} UNIQUE (${constraint.columns});\r\n`].join("\r\n"));
                }

                if (oldConstraint?.pk !== constraint.pk && constraint.pk !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                    }
                    constraintsQuery.push([`ALTER TABLE ${tableName}`, `ADD CONSTRAINT ${constraintName} PRIMARY KEY (${constraint.columns});\r\n`].join("\r\n"));
                }

                if (oldConstraint?.fk !== constraint.fk && constraint.fk !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                    }
                    const ref = constraint.fk.split(".");
                    constraintsQuery.push([`ALTER TABLE ${tableName}`, `ADD CONSTRAINT ${constraintName}`, `FOREIGN KEY (${constraint.columns}) REFERENCES ${ref[0]} (${ref[1]});\r\n`].join("\r\n"));
                }

                if (oldConstraint?.check !== constraint.check && constraint.check !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                    }
                    constraintsQuery.push([`ALTER TABLE ${tableName}`, `ADD CONSTRAINT ${constraintName} CHECK (${constraint.check});\r\n`].join("\r\n"));
                }

                if (oldConstraint?.def !== constraint.def && constraint.def !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                    }
                    constraintsQuery.push([`ALTER TABLE ${tableName}`, `ADD CONSTRAINT ${constraintName}`, `DEFAULT ${constraint.def} FOR ${constraint.columns};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.index !== constraint.index && constraint.index !== undefined) {
                    if (oldConstraint !== undefined) {
                        constraintsChangedQuery.push([`DROP INDEX ${tableName}.${constraintName};\r\n`].join("\r\n"));
                    }
                    constraintsQuery.push([`CREATE INDEX ${constraintName}`, `ON ${tableName} (${constraint.columns});\r\n`].join("\r\n"));
                }
            }

            if (oldTable === undefined) {
                tablesQuery.push([`USE ${newDb.databaseName};\r\n`, `CREATE TABLE ${tableName} (`, columnsQuery.join(",\r\n").replace(/^/gm, " ".repeat(4)), `);\r\n`].join("\r\n"));

                if (constraintsQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(constraintsQuery).join("\r\n"));
                }
            } else {
                if (constraintsChangedQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(constraintsChangedQuery).join("\r\n"));
                }

                if (columnsChangedQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(columnsChangedQuery.map((column) => [`ALTER TABLE ${tableName}`, `ALTER COLUMN ${column};\r\n`].join("\r\n"))).join("\r\n"));
                }

                if (columnsQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(columnsQuery.map((column) => [`ALTER TABLE ${tableName}`, `ADD ${column};\r\n`].join("\r\n"))).join("\r\n"));
                }

                if (constraintsQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(constraintsQuery).join("\r\n"));
                }
            }
        }

        for (const tableName in oldDb.tables) {
            const oldTable = newDb?.tables?.[tableName];
            const table = oldDb.tables[tableName];
            const columnsChangedQuery = [];
            const constraintsChangedQuery = [];

            for (const columnName in table.columns) {
                const oldColumn = oldTable?.columns?.[columnName];

                if (oldColumn === undefined) {
                    columnsChangedQuery.push(columnName);
                }
            }

            for (const constraintName in table.constraints) {
                const oldConstraint = oldTable?.constraints?.[constraintName];
                const constraint = table?.constraints?.[constraintName];

                if (oldConstraint?.unique === undefined && constraint.unique !== undefined) {
                    constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.pk === undefined && constraint.pk !== undefined) {
                    constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.fk === undefined && constraint.fk !== undefined) {
                    constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.check === undefined && constraint.check !== undefined) {
                    constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.def === undefined && constraint.def !== undefined) {
                    constraintsChangedQuery.push([`ALTER TABLE ${tableName}`, `DROP CONSTRAINT ${constraintName};\r\n`].join("\r\n"));
                }

                if (oldConstraint?.index === undefined && constraint.index !== undefined) {
                    constraintsChangedQuery.push([`DROP INDEX ${tableName}.${constraintName};\r\n`].join("\r\n"));
                }
            }

            if (constraintsChangedQuery.length) {
                tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(constraintsChangedQuery).join("\r\n"));
            }

            if (oldTable === undefined) {
                tablesQuery.push([`USE ${newDb.databaseName};\r\n`, `DROP TABLE ${tableName};\r\n`].join("\r\n"));
            } else {
                if (columnsChangedQuery.length) {
                    tablesQuery.push([`USE ${newDb.databaseName};\r\n`].concat(columnsChangedQuery.map((column) => [`ALTER TABLE ${tableName}`, `DROP COLUMN ${column};\r\n`].join("\r\n"))).join("\r\n"));
                }
            }
        }

        return dbQuery.concat(tablesQuery);
    }

    async sync() {
        const filename = `./migrations/test.json`;
        const oldDb = this.read(filename);
        const newDb = {
            databaseName: this.databaseName,
            tables: this.tables,
        };
        const queries = this.build(oldDb, newDb);

        if (queries.length) {
            const pool = await get("default", config);
            const request = pool.request();

            for (const query of queries) {
                const result = await request.query(query);
            }

            this.write(filename, newDb);
        }
    }
}

module.exports = DDL;
// const config = {
//     server: "localhost",
//     options: {
//         trustedConnection: true,
//         trustServerCertificate: true,
//     },
// };
// const ddl = new DDL("my_erp", config);
// ddl.table("pengguna", {
//     id: { type: "int", notNull: true, pk: true, ai: true },
//     nama: { type: "varchar(255)", notNull: true },
// });
// ddl.table(
//     "kontak",
//     {
//         id: { type: "int", notNull: true, pk: true, ai: true },
//         id_pengguna: { type: "int", notNull: true, fk: "pengguna.id" },
//         kontak: { type: "varchar(255)", notNull: true },
//         tipe: { type: "varchar(255)", notNull: true, check: "tipe IN ('email','whatsapp','sms')" },
//     },
//     [{ unique: true, columns: ["kontak", "tipe"] }],
// );
// ddl.table("akun", {
//     id: { type: "varchar(255)", notNull: true, pk: true },
//     nama: { type: "varchar(255)", notNull: true, index: true },
// });
// ddl.table("jurnal", {
//     id: { type: "varchar(255)", notNull: true, pk: true },
//     tanggal: { type: "datetime", notNull: true },
//     keterangan: { type: "varchar(255)", notNull: true },
// });
// ddl.table("detail_jurnal", {
//     id: { type: "varchar(255)", notNull: true, pk: true },
//     id_jurnal: { type: "varchar(255)", notNull: true, fk: "jurnal.id", index: true },
//     id_akun: { type: "varchar(255)", notNull: true, fk: "akun.id", index: true },
//     debit: { type: "decimal(38,18)", notNull: true, def: 0 },
//     kredit: { type: "decimal(38,17)", notNull: true, def: 0 },
// });
// ddl.sync();
