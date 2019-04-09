export function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        const v = key instanceof Function ? key(x) : x[key];
        (rv[v] = rv[v] || []).push(x); return rv;
    }, {});
}

