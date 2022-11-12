import { DOMParser } from '@xmldom/xmldom';

import ArxivCategories from '../data/Categories.json';

function compareCategories(mainCategory, category) {
    const regex = new RegExp(`^${mainCategory}(\\.[a-zA-Z-]+)?$`);
    return regex.test(category);
}

function parseRSSItemId(item, mainCategory) {
    const title = item.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const regexp = /\(arXiv:([^ ]*) \[([^\]]*)\] ?([A-Z]*)/;

    const matches = title.match(regexp);
    if (matches) {
        const id = matches[1];
        const category = matches[2];
        const info = matches[3];
        let section = '';
        if (info === 'UPDATED') {
            section = 'updated';
        } else if (compareCategories(mainCategory, category)) {
            section = 'new';
        } else {
            section = 'crossListed';
        }
        return { id, section, mainCategory, category };
    } else {
        return {};
    }
}

function parseAtomEntry(entry) {
    if (entry.getElementsByTagName('id').length > 0) {
        const title = entry.getElementsByTagName('title')[0].childNodes[0].nodeValue.replace(/[\n\r]/g, ' ').trim();

        if (title === 'Error') {
            return null;
        }

        const idURL = entry.getElementsByTagName('id')[0].childNodes[0].nodeValue;
        const updated = entry.getElementsByTagName('updated')[0].childNodes[0].nodeValue;
        const published = entry.getElementsByTagName('published')[0].childNodes[0].nodeValue;
        const summary = entry.getElementsByTagName('summary')[0].childNodes[0].nodeValue.replace(/[\n\r]/g, ' ').trim();
        const commentNode = entry.getElementsByTagName('arxiv:comment');
        const comment = (commentNode && commentNode[0]) ? commentNode[0].childNodes[0].nodeValue.replace(/[\n\r ]+/g, ' ').trim() : '';
        const category = entry.getElementsByTagName('category')[0].getAttribute('term');

        const authorList = Array.from(entry.getElementsByTagName('author'));
        const authors = authorList.reduce((acc, node) => { acc.push(node.getElementsByTagName('name')[0].childNodes[0].nodeValue); return acc; }, []);

        const id = idURL.match(/http:\/\/arxiv.org\/abs\/(.*)/)[1];

        return { id, updated, published, title, summary, comment, category, authors };
    } else {
        return null;
    }
}

function parseRSS(text, category) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');

    const items = Array.from(xml.getElementsByTagName('item'));

    const ids = items.map(item => parseRSSItemId(item, category));
    return ids;
}

function parseAtom(response) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response, 'text/xml');

    const items = Array.from(xml.getElementsByTagName('entry'));
    const papers = items.map(item => parseAtomEntry(item)).filter(paper => paper !== null);

    return papers;
}

const categories = ArxivCategories.map(sect => (
    {
        title: sect.section,
        data: sect.categories.map(cat => ({ text: `${cat.name} [${cat.category}]`, category: cat.category, name: cat.name })),
    }
));

function isValidIdv1(str) {
    const regexp = /^[a-zA-Z-]+(\.[a-zA-Z]+)?\/([0-9]{2})([0-9]{2})[0-9]{3}$/;

    const match = str.match(regexp);
    if (!match) return false;

    const year = parseInt(match[2], 10);
    const month = parseInt(match[3], 10);

    if (month < 1 || month > 12) return false;
    if (year > 7 && year < 97) return false;

    return regexp.test(str);
}

function isValidIdv2(str) {
    const regexp = /^[0-9]{4}\.[0-9]{4}$/;
    return regexp.test(str);
}

function isValidIdv3(str) {
    const regexp = /^[0-9]{4}\.[0-9]{5}$/;
    return regexp.test(str);
}

export default class Arxiv {
    static get categories() {
        return categories;
    }

    static fetchNew(category) {
        const url = `http://export.arxiv.org/rss/${category}`;
        return fetch(url)
            .then(response => response.text())
            .then(response => parseRSS(response, category))
            .catch((error) => {
                console.error(error);
            });
    }

    static fetchRecent(category, start = 0, max = 25) {
        const query = `search_query=${category}&sortBy=submittedDate&sortOrder=descending&max_results=${max}&start=${start}`;
        const url = `https://export.arxiv.org/api/query?${query}`;
        return fetch(url)
            .then(response => response.text())
            .then(response => parseAtom(response))
            .catch((error) => {
                console.error(error);
            });
    }

    static fetchPapersById(ids, start = 0, max = null) {
        if (ids && ids.length > 0) {
            const url = `https://export.arxiv.org/api/query?id_list=${ids.join(',')}&start=${start}&max_results=${max || ids.length}`;
            console.log(url);
            return fetch(url)
                .then(response => response.text())
                .then(response => parseAtom(response))
                .catch((error) => {
                    console.error(error);
                });
        } else {
            return Promise.resolve([]);
        }
    }

    static fetchPapersBySearchQuery(query, start = 0, max = 25) {
        let queryString = '';

        if (query.ids) {
            const ids = query.ids.split(/[\s,]/).filter(s => s.length > 0).map(Arxiv.makeCanonicalId);
            queryString += `&id_list=${ids.map(encodeURIComponent).join(',')}`;
        }

        const searchStrings = [];

        if (query.authors) {
            searchStrings.push(`au:${encodeURIComponent(query.authors)}`);
        }

        if (query.titles) {
            searchStrings.push(`ti:${encodeURIComponent(query.titles)}`);
        }

        if (query.all) {
            searchStrings.push(`all:${encodeURIComponent(query.all)}`);
        }

        if (searchStrings.length > 0) {
            queryString += `&search_query=${searchStrings.join('+AND+')}`;
        }

        if (queryString.length > 0) {
            const url = `https://export.arxiv.org/api/query?start=${start}&max_results=${max}${queryString}`;
            console.log(url);
            return fetch(url)
                .then(response => response.text())
                .then(response => parseAtom(response))
                .catch((error) => {
                    console.error(error);
                });
        } else {
            return Promise.resolve([]);
        }
    }

    static baseId(id) {
        const regexp = /(.*)v[0-9]+/;
        const matches = id.match(regexp);

        if (matches) {
            return matches[1];
        } else {
            return id;
        }
    }

    static isValidId(id) {
        return isValidIdv1(id) || isValidIdv2(id) || isValidIdv3(id);
    }


    static makeCanonicalId(id) {
        if (isValidIdv2(id) || isValidIdv3(id)) return id;

        if (isValidIdv1(id)) {
            const regexp = /^([a-zA-Z-]+)(\.[a-zA-Z]+)?\/([0-9]{2})([0-9]{2})([0-9]{3})$/;
            const match = id.match(regexp);

            return `${match[1].toLowerCase()}/${match[3]}${match[4]}${match[5]}`;
        }

        return '';
    }
}
