const mssql = require("mssql/msnodesqlv8");

class PoolManager {
    static pools = new Map();

    static async get(name, config) {
        if (!this.pools.has(name)) {
            if (!config) {
                throw new Error("Pool does not exist");
            }

            config.beforeConnect = (conn) => {
                conn.conn_str = conn.conn_str.replace(/Driver=.*?;/, "Driver=ODBC Driver 17 for SQL Server;");

                return conn;
            };

            const pool = new mssql.ConnectionPool(config);

            const close = pool.close.bind(pool);
            pool.close = (...args) => {
                this.pools.delete(name);
                return close(...args);
            };

            this.pools.set(name, pool.connect());
        }
        return this.pools.get(name);
    }

    static async closeAll() {
        return Promise.all(Array.from(this.pools.values()).map((connect) => connect.then((pool) => pool.close())));
    }
}

module.exports = PoolManager;
