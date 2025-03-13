/* users */
class UsersStore {
    static data = [{ id: "1" }];
}
/* contacts */
class ContactsStore {
    static data = [{ id: "1", user_id: "1", contact: "6281935155404", type: "whatsapp" }];

    static getByContactType({ contact, type } = {}) {
        return this.data.find((item) => item.contact === contact && item.type == type);
    }
}
/* groups */
class GroupsStore {
    static data = [{ id: "1", name: "admin" }];
}
/* user_groups */
class UserGroupsStore {
    static data = [{ id: "1", user_id: "1", group_id: "1" }];

    static getByUserId({ user_id } = {}) {
        return this.data.find((item) => item.user_id === user_id);
    }
}
/* permissions */
class PermissionsStore {
    static data = [{ id: "1", group_id: "1", path: "/", method: "POST,GET,PATCH,DELETE", type: "access_token", access: "any" }];

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
    static getBy({ group_id, path, method, type }) {
        return this.data.find((item) => item.group_id === group_id && this.matchPath(item.path, path) && this.matchMethod(item.method, method) && item.type === type);
    }
}

module.exports = {
    UsersStore,
    ContactsStore,
    GroupsStore,
    UserGroupsStore,
    PermissionsStore,
};
