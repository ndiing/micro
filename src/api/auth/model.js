class Model {
    static permissions = [
        { role: "admin", method: "POST", path: "/api/auth/refresh", access: "own" },
        { role: "admin", method: "POST", path: "/api/auth/revoke", access: "own" },

        { role: "user", method: "POST", path: "/api/auth/refresh", access: "own" },
        { role: "user", method: "POST", path: "/api/auth/revoke", access: "own" },
    ];
}

module.exports = Model;
