const fs = require('fs/promises');
const { kebabCase, flatten } = require('lodash')

const updateSearch = async () => {
    const sidebarAsString = await fs.readFile('./sidebar.json', 'utf-8')
    const sidebar = JSON.parse(sidebarAsString)

    const promisesArray = sidebar.reduce((result, category) => {
        const pagesPromises = category.contents.map(async ({ name, slug }) => {
            const contentsAsString = await fs.readFile(`./${category.slug}/${slug}.md`, 'utf-8')
            const headingsArray = (contentsAsString.match(/^#.+$/mg) || [])
                .map(match => match.replace(/#\s?/g, ''))
                .map(heading => heading.replace(/\[/, ''))
                .map(heading => heading.replace(/\].+/, ''))
                .map(heading => heading.replace(/\*/g, ''))
                .map(heading => heading.replace(/_/g, ''))

            return [
                {
                    category: category.name,
                    name,
                    heading: null,
                    slug: `${category.slug}/${slug}`,
                },
                ...headingsArray.map(heading => ({
                    category: category.name,
                    name,
                    heading,
                    slug: `/${category.slug}/${slug}#${kebabCase(heading)}`,
                }))
            ]
        })
        
        return [
            ...result,
            ...pagesPromises,
        ]
    }, [])

    const pagesArray = await Promise.all(promisesArray);
    await fs.writeFile('./static/search.json', JSON.stringify(flatten(pagesArray), null, 2), 'utf-8')
}

updateSearch();