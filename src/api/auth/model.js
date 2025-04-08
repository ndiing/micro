const permissions = [
    { role: "admin", type: "refresh_token", method: "POST", path: "/api/auth/refresh", access: "own" },
    { role: "admin", type: "refresh_token", method: "POST", path: "/api/auth/revoke", access: "own" },

    { role: "user", type: "refresh_token", method: "POST", path: "/api/auth/refresh", access: "own" },
    { role: "user", type: "refresh_token", method: "POST", path: "/api/auth/revoke", access: "own" },
];

module.exports = { permissions };
