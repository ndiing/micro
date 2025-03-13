const { ContactsStore, UserGroupsStore, PermissionsStore } = require("./store");
const OTP = require("../../lib/otp");
const JWT = require("../../lib/jwt");
const I18n = require("../../lib/i18n.js");

class Service {
    static temp = new Map();

    static login({ contact, type } = {}) {
        const expires_in = 5 * 60 * 1000;
        // const secret = OTP.generateSecret("sha1");
        // const counter = Math.floor((Date.now() + expires_in) / 1000);

        const { secret, counter } = { secret: "YIPV3A7SOAHTWR5U", counter: 1741881319 };

        this.temp.set(contact, { secret, counter });

        const otp = OTP.hotp({ key: secret, counter });
        console.log({ to: contact, type, message: `Kode OTP ${otp} berlaku hingga ${expires_in / 1000 / 60} menit.` });

        return { message: `Konfirmasi kode OTP yang anda terima di ${contact}.` };
    }

    static verify({ contact, type, otp } = {}) {
        const temp = this.temp.get(contact);
        if (!temp) {
            return { message: "Tidak ada permintaan login, silahkan login terlebih dahulu." };
        }

        const { secret, counter } = temp;
        if (otp !== OTP.hotp({ key: secret, counter })) {
            return { message: "Kode OTP yang anda kirimkan salah." };
        }

        const contactResult = ContactsStore.getByContactType({ contact, type });

        if (!contactResult) {
            // Register automatically
        }

        const userGroupResult = UserGroupsStore.getByUserId({ user_id: contactResult.user_id });

        const expires_in = 5 * 60 * 1000;
        const access_token = JWT.encode({ exp: expires_in, aud: userGroupResult.group_id, type: "access_token" }, process.env.SECRET);
        const refresh_token = JWT.encode({ exp: 30 * 60 * 1000, aud: userGroupResult.group_id, type: "refresh_token" }, process.env.SECRET);

        this.temp.delete(contact);

        return {
            access_token,
            token_type: "Bearer",
            expires_in,
            refresh_token,
        };
    }

    static check({ token, path, method } = {}) {
        const decoded = JWT.decode(token, process.env.SECRET);
        const { aud: group_id, type } = decoded;

        const permissionResult = PermissionsStore.getBy({ group_id, path, method, type });
        return !!permissionResult;
    }
}

// console.log(Service.login({ contact: "6281935155404", type: "whatsapp" }));
// console.log(Service.verify({ contact: "6281935155404", type: "whatsapp", otp: "663847" }));
// console.log(Service.check({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDE4Nzg3MjMsImV4cCI6MTc0MjE3ODcyMywiYXVkIjoiMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4ifQ.5EkM-BPl0CvMP6fDW5xKXkBw0bzojV6ZIHJM3ASvXEk", path: "/", method: "POST" }));
