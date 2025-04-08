const CookieStore = require("../src/lib/cookie-store.js");

{
    const cookieStore = new CookieStore();

    cookieStore.cookie = "sessionId=38afes7a8";
    cookieStore.cookie = "id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT";
    cookieStore.cookie = "id=a3fWa; Max-Age=2592000";
    cookieStore.cookie = "qwerty=219ffwef9w0f; Domain=some-company.co.uk";
    cookieStore.cookie = "sessionId=e8bb43229de9; Domain=foo.example.com";
    cookieStore.cookie = "__Secure-ID=123; Secure; Domain=example.com";
    cookieStore.cookie = "__Host-ID=123; Secure; Path=/";
    cookieStore.cookie = "__Secure-id=1";
    cookieStore.cookie = "__Host-id=1; Secure";
    cookieStore.cookie = "__Host-id=1; Secure; Path=/; Domain=example.com";
    cookieStore.cookie = "__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;";

    console.log(cookieStore);
    console.log(cookieStore.cookie);
}

{
    const cookieStore = new CookieStore();

    cookieStore.cookie = ["sessionId=38afes7a8", "id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT", "id=a3fWa; Max-Age=2592000", "qwerty=219ffwef9w0f; Domain=some-company.co.uk", "sessionId=e8bb43229de9; Domain=foo.example.com", "__Secure-ID=123; Secure; Domain=example.com", "__Host-ID=123; Secure; Path=/", "__Secure-id=1", "__Host-id=1; Secure", "__Host-id=1; Secure; Path=/; Domain=example.com", "__Host-example=34d8g; SameSite=None; Secure; Path=/; Partitioned;"];

    console.log(cookieStore);
    console.log(cookieStore.cookie);
}

{
    const cookieStore = new CookieStore({
        sessionId: { name: "sessionId", value: "e8bb43229de9" },
        id: { name: "id", value: "a3fWa" },
        qwerty: { name: "qwerty", value: "219ffwef9w0f" },
        "__Host-ID": { name: "__Host-ID", value: "123" },
        "__Host-id": { name: "__Host-id", value: "1" },
        "__Host-example": { name: "__Host-example", value: "34d8g" },
    });

    console.log(cookieStore);
    console.log(cookieStore.cookie);
}
