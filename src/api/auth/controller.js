// authentication
class Controller {
    static request(req, res, next) {
        try {
            res.json({ message: "auth request" });
        } catch (error) {
            next(error);
        }
    }

    static verify(req, res, next) {
        try {
            res.json({ message: "auth verify" });
        } catch (error) {
            next(error);
        }
    }

    static refresh(req, res, next) {
        try {
            res.json({ message: "auth refresh" });
        } catch (error) {
            next(error);
        }
    }

    static revoke(req, res, next) {
        try {
            res.json({ message: "auth revoke" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
