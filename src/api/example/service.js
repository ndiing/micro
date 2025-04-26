const fetch = require("../../lib/fetch");

class Service {
    constructor({ store = { cookieStore: {} } } = {}) {
        this.store = store;
    }

    fetch(input, init = {}) {
        init = {
            store: this.store,
            ...init,
        };
        return fetch(input, init);
    }

    async post(req = { params: {}, query: {}, body: {} }) {
        try {
            const res = await this.fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(req.body),
            });
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    }

    async getAll(req = { params: {}, query: {}, body: {} }) {
        try {
            const res = await this.fetch("https://jsonplaceholder.typicode.com/posts");
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    }

    async get(req = { params: {}, query: {}, body: {} }) {
        try {
            const res = await this.fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`);
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    }

    async patch(req = { params: {}, query: {}, body: {} }) {
        try {
            const res = await this.fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(req.body),
            });
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    }

    async delete(req = { params: {}, query: {}, body: {} }) {
        try {
            const res = await this.fetch(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            return json;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Service;
