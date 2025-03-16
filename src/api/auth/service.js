const { ContactsStore, UserGroupsStore, PermissionsStore, UsersStore, GroupsStore } = require("./store");
const OTP = require("../../lib/otp");
const JWT = require("../../lib/jwt");
const I18n = require("../../lib/i18n.js");
const crypto = require("crypto");

const OTPCache = new Map();
const TokenCache = new Map();

class Service {
    static async requestOTP({ contact, type } = {}) {
        let otpData = OTPCache.get(contact);
        const now = Math.floor(Date.now() / 1000);
        const expires_in = 60 * 5; // 5m
        if (otpData) {
            const remaining = otpData.counter - now;
            if (remaining > 0) {
                return {
                    message: I18n.getMessage("Kode OTP sudah dikirim sebelumnya. Silakan coba lagi dalam ${remaining} menit.", { remaining: Math.ceil(remaining / 60) }),
                };
            }
        }
        otpData = {
            secret: OTP.generateSecret("sha1"),
            counter: now + expires_in,
            resendCounter: 0,
        };
        // console.log(otpData)
        // otpData={ secret: 'N5QXPNHZPIN3RCRB', counter: 1742144217 }

        OTPCache.set(contact, otpData);

        return this.sendOTP({ contact, type });
    }
    static async sendOTP({ contact, type } = {}) {
        const otpData = OTPCache.get(contact);

        if (!otpData) {
            return {
                message: I18n.getMessage("Tidak ditemukan permintaan kode OTP. Silakan lakukan permintaan terlebih dahulu.", {}),
            };
        }

        if (otpData.resendCounter >= 3) {
            const now = Math.floor(Date.now() / 1000);
            const remaining = otpData.counter - now;
            return {
                message: I18n.getMessage("Batas pengiriman ulang kode OTP telah tercapai (${resendCounter}x). Silakan tunggu ${remaining} menit sebelum mencoba lagi.", { remaining: Math.ceil(remaining / 60), resendCounter: otpData.resendCounter }),
            };
        }

        ++otpData.resendCounter;
        OTPCache.set(contact, otpData);

        const otp = OTP.hotp({ key: otpData.secret, counter: otpData.counter });
        console.log({
            message: I18n.getMessage("Kode OTP Anda: ${otp}", { otp }),
        });

        return {
            message: I18n.getMessage("Masukkan kode OTP yang dikirim ke ${contact}", { contact }),
        };
    }
    static async verifyOTP({ contact, type, otp } = {}) {
        const otpData = OTPCache.get(contact);

        if (!otpData) {
            return {
                message: I18n.getMessage("Tidak ditemukan permintaan kode OTP. Silakan lakukan permintaan terlebih dahulu.", {}),
            };
        }

        const now = Math.floor(Date.now() / 1000);

        if (now >= otpData.counter) {
            OTPCache.delete(contact);

            return {
                message: I18n.getMessage("Kode OTP telah kedaluwarsa. Silakan minta kode baru.", {}),
            };
        }

        if (otp !== OTP.hotp({ key: otpData.secret, counter: otpData.counter })) {
            return {
                message: I18n.getMessage("Kode OTP yang Anda masukkan salah. Silakan coba lagi.", {}),
            };
        }

        let contactItem = await ContactsStore.get({ contact, type });
        if (!contactItem) {
            contactItem = await ContactsStore.post({ contact, type });
        }

        OTPCache.delete(contact);

        return this.createToken({ group_id: contactItem.group_id, user_id: contactItem.user_id });
    }

    static async createToken({ group_id, user_id } = {}) {
        const now = Math.floor(Date.now() / 1000);
        const expires_in = 60 * 60; //1h
        const access_token = JWT.sign({ iat: now, exp: now + expires_in, group_id, user_id, type: "access_token" }, process.env.SECRET);
        const refresh_token = JWT.sign({ iat: now, exp: now + 60 * 60 * 24, group_id, user_id, type: "refresh_token" }, process.env.SECRET);
        return {
            access_token,
            token_type: "Bearer",
            expires_in,
            refresh_token,
        };
    }
    static async refreshToken({ token } = {}) {
        const decoded = JWT.decode(token, process.env.SECRET);
        TokenCache.set(token, 1);
        return this.createToken({ group_id: decoded.payload.group_id, user_id: decoded.payload.user_id });
    }
    static async revokeToken({ token } = {}) {
        TokenCache.set(token, 1);
        return { message: I18n.getMessage("Token telah dicabut.") };
    }

    static async checkPermission({ method, path, token } = {}) {
        let payload = { group_id: "", user_id: "", type: "" };

        if (token) {
            if (TokenCache.has(token)) {
                const error = new Error("The access token provided is revoked");
                error.code = "invalid_token";
                error.status = 401;
                throw new Error(error);
            }
            payload = JWT.verify(token, process.env.SECRET);
        }

        const permissionItem = await PermissionsStore.get({ method, path, group_id: payload.group_id, type: payload.type });

        if (!permissionItem) {
            const error = new Error("The request requires higher privileges than provided by the access token");
            error.code = "insufficient_scope";
            error.status = 403;
            throw new Error(error);
        }

        return { payload, permission: permissionItem };
    }
}

module.exports = Service;
