const { ContactsStore, UserGroupsStore, PermissionsStore, UsersStore, GroupsStore } = require("./store");
const OTP = require("../../lib/otp");
const JWT = require("../../lib/jwt");
const I18n = require("../../lib/i18n.js");

class Service {
    static temp = new Map();

    static login({ contact, type } = {}) {
        const expires_in = 5 * 60;
        const secret = OTP.generateSecret("sha1");
        const counter = Math.floor(Date.now() / 1000) + expires_in;

        if (this.temp.has(contact)) {
            const temp = this.temp.get(contact);
            const now = Math.floor(Date.now() / 1000);
            const remaining = temp.counter - now;

            if (remaining > 0) {
                return {
                    message: I18n.getMessage("Kode OTP sudah dikirim ke ${contact}. Silakan tunggu ${remaining} menit sebelum melakukan permintaan kembali.", {
                        contact,
                        remaining: Math.ceil(remaining / 60),
                    }),
                };
            }
        }

        this.temp.set(contact, { secret, counter });

        const otp = OTP.hotp({ key: secret, counter });

        console.log({
            message: I18n.getMessage("Kode OTP Anda adalah ${otp}. Berlaku selama ${expires_in} menit.", {
                otp,
                expires_in: Math.ceil(expires_in / 60),
            }),
        });

        return {
            message: I18n.getMessage("Masukkan kode OTP yang telah dikirim ke ${contact}.", { contact }),
        };
    }

    static verify({ contact, type, otp } = {}) {
        if (!this.temp.has(contact)) {
            return { message: I18n.getMessage("Tidak ditemukan permintaan login. Silakan coba login terlebih dahulu.") };
        }

        const temp = this.temp.get(contact);
        const now = Math.floor(Date.now() / 1000);

        if (now >= temp.counter) {
            this.temp.delete(contact);
            return { message: I18n.getMessage("Kode OTP telah kedaluwarsa. Silakan minta kode baru.") };
        }

        if (otp !== OTP.hotp({ key: temp.secret, counter: temp.counter })) {
            return { message: I18n.getMessage("Kode OTP tidak valid. Pastikan Anda memasukkan kode yang benar.") };
        }

        let contactResult = ContactsStore.getByContactType({ contact, type });

        if (!contactResult) {
            contactResult = ContactsStore.post({ contact, type });
        }

        const userGroupResult = UserGroupsStore.getByUserId({ user_id: contactResult.user_id });

        const expires_in = 5 * 60;
        const secretKey = process.env.SECRET;

        const access_token = JWT.encode(
            {
                exp: Math.floor(Date.now() / 1000) + expires_in,
                group_id: userGroupResult.group_id,
                user_id: userGroupResult.user_id,
                type: "access_token",
            },
            secretKey,
        );

        const refresh_token = JWT.encode(
            {
                exp: Math.floor(Date.now() / 1000) + 30 * 60,
                group_id: userGroupResult.group_id,
                user_id: userGroupResult.user_id,
                type: "refresh_token",
            },
            secretKey,
        );

        this.temp.delete(contact);

        return {
            access_token,
            token_type: "Bearer",
            expires_in,
            refresh_token,
        };
    }

    static check({ token, path, method } = {}) {
        const secretKey = process.env.SECRET;

        try {
            const decoded = JWT.decode(token, secretKey);
            const { group_id, type } = decoded;

            const permissionResult = PermissionsStore.getBy({ group_id, path, method, type });
            return !!permissionResult;
        } catch (error) {
            return false;
        }
    }
}

module.exports = Service;

// console.log(
//     Service.login({
//         contact: "6281935155405",
//         type: "whatsapp",
//     }),
// );
// console.log(
//     Service.verify({
//         contact: "6281935155405",
//         type: "whatsapp",
//         otp: "357275",
//     }),
// );
// console.log(
//     Service.check({
//         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDIwNDc5MzUsImV4cCI6MTc0MjA0ODIzNSwiYXVkIjoiMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4ifQ.2BRfjTR66jpamPBDpukxSu0VUUmbD8XeDz588lefr7U",
//         // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDIwNDY3ODQsImV4cCI6MTc0MjA0ODU4NCwiYXVkIjoiMSIsInR5cGUiOiJyZWZyZXNoX3Rva2VuIn0.vslsxFMZKr0mjNdIzJXTgmghXc4QVNyXOMTVMrv67NY",
//         path: "/",
//         method: "POST",
//     }),
// );
