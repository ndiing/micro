const Service = require("./service.js");
const Model = require("./model.js");
const Handler = require("./handler.js");
const CacheMap = require("../../lib/cache-map.js");
const Store = require("../../lib/store.js");

class Controller {
    static services = new CacheMap();

    static async init(req, res, next) {
        try {
            const { _id = "default" } = req.query;

            res.locals.store = Store.get(`./data/example/${_id}.json`);

            if (!Controller.services.has(_id)) {
                const service = new Service({ store: res.locals.store });
                Controller.services.set(_id, service);
            }

            res.locals.service = Controller.services.get(_id);
            next();
        } catch (error) {
            next(error);
        }
    }

    static async post(req, res, next) {
        try {
            const response = await res.locals.service.post(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const response = await res.locals.service.getAll(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async get(req, res, next) {
        try {
            const response = await res.locals.service.get(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            const response = await res.locals.service.patch(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const response = await res.locals.service.delete(req);
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
