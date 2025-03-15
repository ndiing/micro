const Service = require("./service.js");

class Controller {
    static async login(req, res, next) {
        try {
            const { contact, type } = req.body;
            const result = Service.login({ contact, type });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async verify(req, res, next) {
        try {
            const { contact, type, otp } = req.body;
            const result = Service.verify({ contact, type, otp });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async check(req, res, next) {
        try {
            const result = Service.check({ token, path, method });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
