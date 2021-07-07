import 'regenerator-runtime/runtime'
import Fuse from "fuse.js";

const initSearch = async () => {
    let closing = null;
    const response = await fetch("/search.json");
    const data = await response.json();

    const fuse = new Fuse(data, {
        threshold: 0.3,
        findAllMatches: true,
        keys: [
        {
            name: "name",
            weight: 0.3,
        },
        {
            name: "category",
            weight: 0.2,
        },
        {
            name: "heading",
            weight: 0.1,
        },
        ],
    });

    const search = document.querySelector('[data-search]')
    const source = document.querySelector('[data-search="source"]')
    const output = document.querySelector('[data-search="output"]')
    source.disabled = false;

    const removeResults = () => {
        closing = setTimeout(
            () => output.classList.remove('search_preview__open'),
            500,
        )
    };

    const createResults = (value) => {
        if (closing) clearTimeout(closing)

        output.classList.add('search_preview__open')
        const results = fuse.search(value);

        if (!results || results.length < 1) {
            output.innerHTML = `No results`
            return
        }

        const groups = results.slice(0, 8).reduce((result, { item: { category, ...rest } } ) => ({
            ...result,
            [category]: [
            ...(result[category] || []),
            rest,
        ]
        }), {})

        const html = `
            ${Object.keys(groups).map(key => `
                <div class="search_category">${key.replace(new RegExp(value, 'gi'), (innerValue) => `<em class="search_highlight">${innerValue}</em>`)}</div>

                ${groups[key].map(({ name, heading, slug }) => {
                if (!name || !heading) return '';

                return `
                    <a href="${slug}" class="search_item" data-search="link"> 
                        <div class="search_page">${name.replace(new RegExp(value, 'gi'), (innerValue) => `<em class="search_highlight">${innerValue}</em>`)}</div>
                        <div class="search_heading">${heading.replace(new RegExp(value, 'gi'), (innerValue) => `<em class="search_highlight">${innerValue}</em>`)}</div>
                    </a>
                `
                }).join('')}
            `).join('')}
        `

        output.innerHTML = html;
    }

    source.addEventListener('blur', removeResults)
    output.addEventListener('click', console.log)

    source.addEventListener('input', ({ target: { value }}) => {
        if (value.length < 2) return removeResults();
        createResults(value);
    })

    source.addEventListener('focus', ({ target: { value }}) => {
        if (value.length < 2) return removeResults();
        createResults(value);
    })
};

const initMenu = () => {
    const menuButton = document.querySelector('[data-menu="button"]')
    const menuContent = document.querySelector('[data-menu="content"]')
    const menuClose = document.querySelector('[data-menu="close"]')

    const elements = [
        [document.body, 'no-scroll'],
        [menuContent, 'menu__content_open'],
        [menuClose, 'menu__close_open'],
    ]

    const toggleMenu = () => elements.forEach(([node, className]) => node.classList.toggle(className))
    menuButton.addEventListener('click', toggleMenu)
    menuClose.addEventListener('click', toggleMenu)
}

initMenu();
initSearch();
