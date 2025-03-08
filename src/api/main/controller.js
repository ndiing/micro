class Controller {
    static async init(req, res, next) {
        try {
            next();
        } catch (error) {
            next(error);
        }
    }

    static async post(req, res, next) {
        try {
            res.json({ message: "post" });
        } catch (error) {
            next(error);
        }
    }

    static async get(req, res, next) {
        try {
            res.json({ message: "get" });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            res.json({ message: "getAll" });
        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            res.json({ message: "patch" });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            res.json({ message: "delete" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
