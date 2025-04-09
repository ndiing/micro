const { setGlobalDispatcher, ProxyAgent } = require("undici");

const globalFetch = global.fetch;

/**
 * Custom fetch function that supports proxies and cookie management.
 * @param {string} [input=""] - The request URL or resource.
 * @param {Object} [init={}] - Additional fetch configuration options.
 * @param {Object} [init.headers] - Request headers.
 * @param {Object} [init.store] - An optional cookie store object for managing cookies.
 * @returns {Promise<Response>} A promise that resolves with the fetch response.
 */
const fetch = async (input = "", init = {}) => {
    if (process.env.HTTP_PROXY) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    init = {
        ...(process.env.HTTP_PROXY && { dispatcher: new ProxyAgent(process.env.HTTP_PROXY) }),
        ...init,
        headers: {
            ...init.headers,
        },
    };
    const { store, base = "", query = {} } = init;

    const url = new URL(input, base);
    for (const name in query) {
        const value = query[name];
        if (value === undefined || value === null) {
            continue;
        }

        url.searchParams.set(name, value);
    }

    if (store) {
        const cookie = store.cookieStore.cookie;
        if (cookie) {
            init.headers.Cookie = cookie;
        }
    }
    const response = await globalFetch(url.toString(), init);
    const setCookie = response.headers.getSetCookie();
    if (setCookie.length && store) {
        store.cookieStore.cookie = setCookie;
    }
    return response;
};

module.exports = fetch;
