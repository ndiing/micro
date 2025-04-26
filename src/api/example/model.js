const sql = require('mssql/msnodesqlv8');
const PoolManager = require('../../lib/pool-manager.js');

class Model {
    static async init(pool) {
        await pool.request().query(`
            IF OBJECT_ID('tempdb..#example') IS NULL
            CREATE TABLE #example (
                id INT PRIMARY KEY,
                title NVARCHAR(255),
                body NVARCHAR(MAX),
                userId INT
            );
        `);
    }

    static async post(data = {}) {
        try {
            const pool = await PoolManager.get('default', global.env.sqlConfig);
            await this.init(pool);

            const request = pool.request();
            request.input('id', sql.Int, data.id);
            request.input('title', sql.NVarChar(255), data.title || '');
            request.input('body', sql.NVarChar(sql.MAX), data.body || '');
            request.input('userId', sql.Int, data.userId);

            const result = await request.query(`
                INSERT INTO #example (id, title, body, userId)
                VALUES (@id, @title, @body, @userId);
                SELECT @id AS id;
            `);

            return result.recordset[0]; // { id: 101 }
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {
            const pool = await PoolManager.get('default', global.env.sqlConfig);
            await this.init(pool);

            const result = await pool.request().query(`
                SELECT * FROM #example ORDER BY id;
            `);

            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    static async get(data = {}) {
        try {
            const pool = await PoolManager.get('default', global.env.sqlConfig);
            await this.init(pool);

            const request = pool.request();
            request.input('id', sql.Int, data.id);

            const result = await request.query(`
                SELECT * FROM #example WHERE id = @id;
            `);

            return result.recordset[0] || null;
        } catch (error) {
            throw error;
        }
    }

    static async patch(data = {}) {
        try {
            const pool = await PoolManager.get('default', global.env.sqlConfig);
            await this.init(pool);

            const request = pool.request();
            request.input('id', sql.Int, data.id);
            request.input('title', sql.NVarChar(255), data.title);
            request.input('body', sql.NVarChar(sql.MAX), data.body);
            request.input('userId', sql.Int, data.userId);

            const result = await request.query(`
                UPDATE #example
                SET 
                    title = ISNULL(@title, title),
                    body = ISNULL(@body, body),
                    userId = ISNULL(@userId, userId)
                WHERE id = @id;

                SELECT @@ROWCOUNT AS affected;
            `);

            return result.recordset[0]; // { affected: 1 }
        } catch (error) {
            throw error;
        }
    }

    static async delete(data = {}) {
        try {
            const pool = await PoolManager.get('default', global.env.sqlConfig);
            await this.init(pool);

            const request = pool.request();
            request.input('id', sql.Int, data.id);

            const result = await request.query(`
                DELETE FROM #example WHERE id = @id;
                SELECT @@ROWCOUNT AS affected;
            `);

            return result.recordset[0]; // { affected: 1 }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Model;

