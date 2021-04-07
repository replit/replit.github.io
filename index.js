// ***********************************
// * Open README.md for instructions *
// ***********************************

const express = require('express');
const marked = require('marked');
const fs = require('fs').promises;
const path = require('path');

require('ejs');

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  },
});

const app = express();

const getTree = async () =>
	JSON.parse((await fs.readFile('./sidebar.json', 'utf8')));

const render = async (res, category, slug) => {
  res.set('Cache-Control', 'public, max-age=600, stale-if-error=60, stale-while-revalidate=60')
	res.locals.rendered = await renderMarkdown(
		path.join(__dirname, category, slug) + '.md',
	);
	const t = await getTree();
	res.locals.sidebar = t;
	res.locals.active = category + '/' + slug;

	const cobj = t.find(c => c.slug === category);
	const dobj = cobj.contents.find(d => d.slug === slug)

  if (category === 'repls' && slug === 'intro') {
    // landing page gets a short title for search engine visibility
    res.locals.title = 'Replit Docs';
  } else {
	  res.locals.title = `Replit Docs - ${ dobj? dobj.name : slug }`;
  }
	res.render('index.ejs');
}

app.use((req, res, next) => {
	console.log(req.method, req.path)
	return next()
})

app.get('/', (req, res) => {
	render(res, 'repls', 'intro');
});

app.use(express.static('static'))

const renderMarkdown = async (path) => {
	const raw = await fs.readFile(path, 'utf8')
	return marked(raw);
}

app.get('/:category/:slug', async (req, res) => {
	const { category, slug } = req.params;
	render(res, category, slug)
		.catch(err => {
			res.send(`
      <h1>Something went wrong!</h1 >
      <p>maybe you can <a href="https://replit.com/@turbio/replit-docs">help fix it</a></p>
`);
		});
});

app.listen(3000, () => {
	console.log('docs are running');
});
