// require('../src/lib/env')

const fetch = require("../src/lib/fetch");
const Store = require("../src/lib/store");

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
