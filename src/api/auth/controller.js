const otp = require("../../lib/otp");
const jwt = require("../../lib/jwt");
const validator = require("../../lib/validator.js");

const secret = "your-256-bit-secret";

// const expires_in = 5*60*1000;
// const access_token = jwt.encode({ exp: expires_in,aud:'1',type:'access_token' }, secret);
// const refresh_token = jwt.encode({ exp: 30*60*1000,aud:'1',type:'refresh_token' }, secret);
// console.log({
//     access_token,
//     token_type: "Bearer",
//     expires_in,
//     refresh_token,
// });

// {
//     access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIxMDEwODQsImdyb3VwX2lkIjoiMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4ifQ.Gja30OEeWCNWiXVxdBzL7xHRDnvrKahvUokDoiYXdUk',
//     token_type: 'Bearer',
//     expires_in: 300000,
//     refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM2MDEwODQsImdyb3VwX2lkIjoiMSIsInR5cGUiOiJyZWZyZXNoX3Rva2VuIn0.YvbxtOLEiHMYyP2O4Dtd5_3w8PcyHAKE9XNzCIyPq3E'
//   }

// console.log(jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDIxMDQ2NzIsImdyb3VwX2lkIjoiMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4ifQ.MaPu-FuUnmNeWIznJbLcHjl0_O-6S3hzJywZ3AybA1c',secret))

// const users=[
//     {id:'1'},
// ]
// const contacts=[
//     {id:'1',user_id:'1',contact:'6281935155404',type:'whatsapp'},
// ]
// const groups=[
//     {id:'1',name:'admin'},
// ]
// const user_groups=[
//     {id:'1',user_id:'1',group_id:'1'},
// ]
// const permissions=[
//     {id:'1',group_id:'1',path:'/',method:'POST,GET,PATCH,DELETE',type:'access_token',access:'any'},
// ]

// function matchPath(oldValue,value){
//     return new RegExp('^'+
//     oldValue.replace(/:(\w+)/g,'([^/]+)')
//     .replace(/\*/g,'(?:.*)')
//     .replace(/\/?$/,'(?:\/?$)'),'i').test(value)
// }
// function matchMethod(oldValue,value){
//     return oldValue.split(',').includes(value)
// }

// const contact = (contacts.find(contact => contact.contact==='6281935155404'&&contact.type=='whatsapp'))
// const user_group = (user_groups.find(user_group => user_group.user_id===contact.user_id))
// const permission = (permissions.find(permission => 
//     permission.group_id===user_group.group_id
//     &&matchPath(permission.path,'/')
//     &&matchMethod(permission.method,'POST')
//     &&permission.type==='access_token'
// ))

// console.log(permission)

class Controller {}

module.exports = Controller;
