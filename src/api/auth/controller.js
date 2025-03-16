const Service = require("./service.js");

class Controller {
    static async requestOTP(req,res,next){
        try {
            // contact,type
            const data = req.body
            const result = await Service.requestOTP(data)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    static async sendOTP(req,res,next){
        try {
            // contact,type
            const data = req.body
            const result = await Service.sendOTP(data)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    static async verifyOTP(req,res,next){
        try {
            // contact,type,otp
            const data = req.body
            const result = await Service.verifyOTP(data)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    static async refreshToken(req,res,next){
        try {
            const data = {token:res.locals.token}
            const result = await Service.refreshToken(data)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    static async revokeToken(req,res,next){
        try {
            const data = {token:res.locals.token}
            const result = await Service.revokeToken(data)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
    static async checkPermission(req,res,next){
        try {
            const [,token]=(req.headers?.['authorization']||'').split(' ')
            const data = {method:req.method,path:req.url,token}
            const {payload,permission} = await Service.checkPermission(data)
            res.locals.token=token
            res.locals.payload=payload
            res.locals.permission=permission
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller;
