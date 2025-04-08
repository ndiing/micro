const { read, write } = require("../src/lib/file");
const Store = require("../src/lib/store");

{
    const data = read("./data/session.json");
    write("./data/session.json", data || {});

    console.log(data);
}

{
    const data = read("./data/session.json.gz");

    const store = new Store(data || {}, (data) => {
        write("./data/session.json.gz", data || {});
    });

    // store.user='name'
    // store.pass='word'

    console.log(store);
}
