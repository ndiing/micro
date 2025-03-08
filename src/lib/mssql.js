const mssql = require("mssql/msnodesqlv8");
const pools = new Map();

function get(name, config) {
    if (!pools.has(name)) {
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
            pools.delete(name);
            return close(...args);
        };
        pools.set(name, pool.connect());
    }
    return pools.get(name);
}

function closeAll() {
    return Promise.all(
        Array.from(pools.values()).map((connect) => {
            return connect.then((pool) => pool.close());
        }),
    );
}

module.exports = {
    pools,
    get,
    closeAll,
};
