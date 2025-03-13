class Controller {
    static async post(req, res, next) {
        try {
            res.json({ message: "post from main" });
        } catch (error) {
            next(error);
        }
    }

    static async get(req, res, next) {
        try {
            res.json({ message: "get from main" });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            res.json({ message: "getAll from main" });
        } catch (error) {
            next(error);
        }
    }

    static async patch(req, res, next) {
        try {
            res.json({ message: "patch from main" });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            res.json({ message: "delete from main" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
