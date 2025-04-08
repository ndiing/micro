const OTP = require("../../lib/otp.js");
const JWT = require("../../lib/jwt.js");
const CacheMap = require("../../lib/cache-map.js");

const requestCacheMap = new CacheMap();

class Controller {
    static request(req, res, next) {
        try {
            // username=whatsapp|sms|email

            if (!requestCacheMap.has(req.body.username)) {
                const secret = OTP.randomKey({ algorithm: "sha1" });
                const counter = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);
                requestCacheMap.set(req.body.username, { secret, counter });
            }

            const item = requestCacheMap.get(req.body.username);
            console.log(OTP.hotp({ key: item.secret, counter: item.counter }));

            res.json({ message: "auth request" });
        } catch (error) {
            next(error);
        }
    }

    static token() {
        const expires_in = 1 * 60 * 60;

        const access_token = JWT.sign({ alg: "HS256", typ: "JWT" }, { role: "admin", type: "access_token", exp: Math.floor((Date.now() + expires_in * 1000) / 1000) }, process.env.SECRET_TOKEN);
        const refresh_token = JWT.sign({ alg: "HS256", typ: "JWT" }, { role: "admin", type: "refresh_token", exp: Math.floor((Date.now() + 12 * 60 * 60 * 1000) / 1000) }, process.env.SECRET_TOKEN);
        return { access_token, expires_in, refresh_token };
    }

    static verify(req, res, next) {
        try {
            // username
            // password=otp

            const item = requestCacheMap.get(req.body.username);
            console.log(OTP.hotp({ key: item.secret, counter: item.counter }) == req.body.password);

            const { access_token, expires_in, refresh_token } = Controller.token();

            res.json({ access_token, token_type: "Bearer", expires_in, refresh_token });
        } catch (error) {
            next(error);
        }
    }

    static refresh(req, res, next) {
        try {
            const { access_token, expires_in, refresh_token } = Controller.token();

            res.json({ access_token, token_type: "Bearer", expires_in, refresh_token });
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
