const crypto = require("crypto");

/* FAKE STORE */

/* users */
class UsersStore {
    static data = [{ id: "1" }];
}

/* contacts */
class ContactsStore {
    static data = [{ id: "1", user_id: "1", contact: "6281935155404", type: "whatsapp" }];

    static async get({ contact, type } = {}) {
        const contactItem = this.data.find((item) => item.contact === contact && item.type == type);
        if (!contactItem) {
            return null;
        }

        return UserGroupsStore.data.find((item) => item.user_id === contactItem.user_id);
    }

    static async post({ contact, type } = {}) {
        const userItem = { id: crypto.randomUUID() };
        UsersStore.data.push(userItem);

        const contactItem = {
            id: crypto.randomUUID(),
            user_id: userItem.id,
            contact,
            type,
        };
        ContactsStore.data.push(contactItem);

        const userGroupItem = {
            id: crypto.randomUUID(),
            user_id: userItem.id,
            group_id: "1",
        };
        UserGroupsStore.data.push(userGroupItem);
        return userGroupItem;
    }
}

/* groups */
class GroupsStore {
    static data = [{ id: "1", name: "admin" }];
}

/* user_groups */
class UserGroupsStore {
    static data = [{ id: "1", user_id: "1", group_id: "1" }];
}

/* permissions */
class PermissionsStore {
    static data = [
        { id: "1", group_id: "", path: "/api/auth/request-otp", method: "POST", type: "", access: "own" },
        { id: "2", group_id: "", path: "/api/auth/send-otp", method: "POST", type: "", access: "own" },
        { id: "3", group_id: "", path: "/api/auth/verify-otp", method: "POST", type: "", access: "own" },

        { id: "4", group_id: "1", path: "/api/auth/refresh-token", method: "POST", type: "refresh_token", access: "own" },
        { id: "5", group_id: "1", path: "/api/auth/revoke-token", method: "POST", type: "access_token,refresh_token", access: "own" },
    ];

    static matchPath(oldValue, value) {
        return new RegExp(
            "^" +
                oldValue
                    .replace(/:(\w+)/g, "([^/]+)")
                    .replace(/\*/g, "(?:.*)")
                    .replace(/\/?$/, "(?:/?$)"),
            "i",
        ).test(value);
    }

    static matchMethod(oldValue, value) {
        return oldValue.split(",").includes(value);
    }

    static matchType(oldValue, value) {
        return oldValue.split(",").includes(value);
    }

    static async get({ group_id, path, method, type }) {
        return this.data.find(
            (item) =>
                this.matchMethod(item.method, method) && //
                this.matchPath(item.path, path) && //
                this.matchType(item.type, type) && //
                item.group_id === group_id, //
        );
    }
}

module.exports = {
    UsersStore,
    ContactsStore,
    GroupsStore,
    UserGroupsStore,
    PermissionsStore,
};
