// eslint-disable-next-line import/prefer-default-export
export function groupBy(xs, key) {
    return xs.reduce((rv, x) => {
        const v = key instanceof Function ? key(x) : x[key];
        // eslint-disable-next-line no-param-reassign
        (rv[v] = rv[v] || []).push(x);
        return rv;
    }, {});
}
