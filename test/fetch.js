// require('../src/lib/env.js')

const fetch = require("../src/lib/fetch.js");
const Store = require("../src/lib/store.js");

{
    const store = Store.get("./data/session.json.gz");
    fetch("http://google.com", {
        store,
    })
        // .then(res=>res.text())
        .then(console.log)
        .catch(console.error);
}

{
    const store = Store.get("./data/tokopedia.json.gz");
    fetch("https://mitra.tokopedia.com/", {
        store,
    })
        // .then(res=>res.text())
        .then(console.log)
        .catch(console.error);
}
