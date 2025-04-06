const CacheMap = require("../src/lib/cache-map");

{
    const cache = new CacheMap();
    cache.set(1, "a");
    cache.set(2, "b");
    cache.set(3, "c");
    cache.set(4, "d");

    console.log(cache.get(3));
    console.log(cache.has(1));

    cache.set(5, "e");
    cache.set(6, "f");

    console.log(cache.entries());

    cache.clearMem();

    console.log(cache.entries());
}
