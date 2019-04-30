import { DOMParser } from 'xmldom';

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
    const idURL = entry.getElementsByTagName('id')[0].childNodes[0].nodeValue;
    const updated = new Date(entry.getElementsByTagName('updated')[0].childNodes[0].nodeValue);
    const published = new Date(entry.getElementsByTagName('published')[0].childNodes[0].nodeValue);
    const title = entry.getElementsByTagName('title')[0].childNodes[0].nodeValue.replace(/[\n\r]/g, ' ').trim();
    const summary = entry.getElementsByTagName('summary')[0].childNodes[0].nodeValue.replace(/[\n\r]/g, ' ').trim();
    const commentNode = entry.getElementsByTagName('arxiv:comment');
    const comment = (commentNode && commentNode[0]) ? commentNode[0].childNodes[0].nodeValue : '';
    const category = entry.getElementsByTagName('category')[0].getAttribute('term');

    const authorList = Array.from(entry.getElementsByTagName('author'));
    const authors = authorList.reduce((acc, node) => { acc.push(node.getElementsByTagName('name')[0].childNodes[0].nodeValue); return acc; }, []);

    const id = idURL.match(/http:\/\/arxiv.org\/abs\/(.*)/)[1];

    return { id, updated, published, title, summary, comment, category, authors };
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
    const papers = items.map(item => parseAtomEntry(item));

    return papers;
}

const categories = ArxivCategories.map(sect => (
    {
        title: sect.section,
        data: sect.categories.map(cat => ({ text: `${cat.name} [${cat.category}]`, category: cat.category, name: cat.name })),
    }
));

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

    static fetchPapersById(ids) {
        if (ids && ids.length > 0) {
            const url = `https://export.arxiv.org/api/query?id_list=${ids.join(',')}&start=0&max_results=${ids.length}`;
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
}
