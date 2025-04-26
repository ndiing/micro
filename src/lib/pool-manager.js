// pool-manager.js
const mssql = require("mssql/msnodesqlv8");

class PoolManager {
    static pools = new Map();

    static async get(name, config) {
        if (!this.pools.has(name)) {
            if (!config) {
                throw new Error("Pool does not exist");
            }
            const pool = new mssql.ConnectionPool(config);

            // Automatically remove the pool from the cache if `pool.close()` is called
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
