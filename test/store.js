const Store = require("../src/lib/store.js");

{
    const store = new Store({}, console.log);
    store.user = "name";
    store.pass = "word";
    store.cookieStore = {};
    store.cookieStore.name = { name: "name", value: "value" };
}
