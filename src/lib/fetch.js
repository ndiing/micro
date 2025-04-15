const { setGlobalDispatcher, ProxyAgent } = require("undici");

const globalFetch = global.fetch;

/**
 * Custom fetch function that supports proxies, query parameters, and cookie management.
 * @param {string} [input=""] - The request URL or resource.
 * @param {Object} [init={}] - Additional fetch configuration options.
 * @param {string} [init.base] - The base URL used to resolve relative paths.
 * @param {Object.<string, string>} [init.query] - Query parameters to append to the URL.
 * @param {Object} [init.headers] - Request headers.
 * @param {Object} [init.store] - An optional cookie store object for managing cookies.
 * @returns {Promise<Response>} A promise that resolves with the fetch response.
 */
const fetch = async (input = "", init = {}) => {
    if (process.env.HTTP_PROXY) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    init = {
        ...init,
        ...(process.env.HTTP_PROXY && { dispatcher: new ProxyAgent(process.env.HTTP_PROXY) }),
        headers: {
            ...init.headers,
        },
    };

    if(/^http\:/.test((init.base||input))){
        init.dispatcher=undefined
    }   

    if(typeof init.params==='object'&&Object.keys(init.params).length){
        input=input.replace(/\:(\w+)/g,($,$1) => init.params[$1])
    }

    const url = new URL(input, init.base);

    if(typeof init.query==='object'&&Object.keys(init.query).length){
        for (const name in init.query) {
            const value = init.query[name];
            if (value === undefined || value === null) {
                continue;
            }
    
            url.searchParams.set(name, value);
        }
    }


    if (init.store) {
        const cookie = init.store.cookieStore.cookie;
        if (cookie) {
            init.headers.Cookie = cookie;
        }
    }
    const response = await globalFetch(url.toString(), init);
    const setCookie = response.headers.getSetCookie();
    if (setCookie.length && init.store) {
        init.store.cookieStore.cookie = setCookie;
    }
    return response;
};

module.exports = fetch;
