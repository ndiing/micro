const fs = require('fs');

(() => {
    const data=JSON.parse(fs.readFileSync('./env.json',{
        encoding:'utf8'
    }))
    
    for(const name in data){
        const value=data[name]
        process.env[name]=value
    }
})()