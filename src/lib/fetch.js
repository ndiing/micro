const { setGlobalDispatcher, ProxyAgent } = require("undici");

const globalFetch = global.fetch;

const fetch = async (input = "", init = {}) => {
    if (process.env.HTTP_PROXY) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    init = {
        headers: {
            ...init.headers,
        },
        ...(process.env.HTTP_PROXY && { dispatcher: new ProxyAgent(process.env.HTTP_PROXY) }),
        ...init,
    };
    const { store } = init;
    if (store) {
        const cookie = store.cookieStore.cookie;
        if (cookie) {
            init.headers.Cookie = cookie;
        }
    }
    const response = await globalFetch(input, init);
    const setCookie = response.headers.getSetCookie();
    if (setCookie.length && store) {
        store.cookieStore.cookie = setCookie;
    }
    return response;
};

module.exports = fetch;
