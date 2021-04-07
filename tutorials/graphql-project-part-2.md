# GraphQL Project: Part 2

[Part 1](./graphql-project-part-1) of this project showed us how to set up the initial GraphQL endpoint and create our queries. The remaining step is to transform the data into a fully functional website.

We will do this by completing the following steps:

  - [Understanding the App Shell Model](#understanding-the-app-shell)
  - [Adding Some Global Configurations](#adding-some-global-configurations)
    - [Adding routing](#adding-routing)
    - [Adding styling](#adding-styling)
    - [Making our web app responsive](#making-our-web-app-responsive)
  - [Creating Reusable Blocks](#creating-reusable-blocks)
    - [Adding a hero image](#adding-a-hero-image)
    - [Adding a grid of cards](#adding-a-grid-of-cards)
    - [Adding some details](#adding-some-details)
    - [Adding a divider to separate sections](#adding-a-divider-to-separate-sections)
    - [Adding a loader](#adding-a-loader)
  - [Adding Some Final Touches](#adding-some-final-touches)
    - [Doing date conversion](#doing-date-conversion)
    - [Adding reusable block functions](#adding-reusable-block-functions)
    - [Adding page-level functions](#adding-page-level-functions)

## Understanding the App Shell Model

![](/images/tutorials/graphql-project/graphql-project-11.png)

We'll structure our website based on the [App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell). This approach is useful for [single-page applications](https://en.wikipedia.org/wiki/Single-page_application), websites or applications that rely almost exclusively on JavaScript for their logic and routing. By using an app shell pattern, we ensure that users never see a blank screen as they move between different states and pages. [Addy Osmani](https://addyosmani.com/), a well known senior engineer at [Google](http://google.com/), describes an app shell as follows:

> _"Put another way, the app shell is similar to the bundle of code that you’d publish to an app store when building a native app. It is the skeleton of your UI and the core components necessary to get your app off the ground, but likely does not contain the data. [...] An application shell architecture makes the most sense for apps and sites with relatively unchanging navigation but changing content."_

— Addy Osmani: [_The App Shell Model_](https://developers.google.com/web/fundamentals/architecture/app-shell)

## Adding Some Global Configurations

Before diving into our app shell architecture, we'll add some site-wide configurations. We can keep the structure of our `index.html` file mostly unchanged, except for a few changes:

- Change the default `<title>` value.
- Add the "Roboto" Google Font via a `<link>` tag.
- Add the "Markdown It" JavaScript library via a `<script>` tag.
- Add a `<main>` element that has an ID attribute of `"app"` .

This means that our HTML should look like this:

```html
<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>GraphQL FM</title>
    <link href="style.css" rel="stylesheet" type="text/css" />
    <link
      href="//fonts.googleapis.com/css2?family=Roboto:wght@400;900&amp;display=swap"
      rel="stylesheet"
    />
  </head>

  <body>
    <main id="app"></main>
    <script src="//cdnjs.cloudflare.com/ajax/libs/markdown-it/12.0.4/markdown-it.min.js"></script>
    <script src="script.js"></script>
  </body>
</html>

```

Now we add the following CSS to our `style.css` file:

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0 0 20rem 0;

  overflow-x: hidden;
  overflow-y: scroll;

  background: #262626;
  color: white;
  font-family: "Roboto", sans-serif;
  text-rendering: optimizeLegibility;
}
```

With this code, we are:
* Overriding the default browser margins and padding applied to the `<body>` element.
* Using overflow properties to prevent content from overflowing horizontally.
* Forcing a scroll bar, regardless of whether vertical content overflows. This prevents interface elements from jumping around as the scroll bar appears and disappears. 
* Adding some background and foreground colours.

### Adding routing

At the end of [part 1](./graphql-project-part-1), we loaded all our data at once. While this was helpful to validate that we can retrieve the data required, it doesn't provide the best user experience. We'll split the loading of data into specific pages or views as required. 

Routing is usually done by means of URL paths that correspond to specific HTML files located on a server. Alternatively, the server can also intercept [HTTP requests](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) and send back generated HTML to the browser. In our case, we want all routing to happen directly in the browser without sending new HTTP requests as pages change.

To accomplish this, we'll use [hash routing](https://itnext.io/why-using-hash-based-urls-in-your-react-spa-will-save-you-more-time-than-you-think-a21e2c560879). By placing a hash (`#` ) in our URL, we convert everything (including any URL paths) after the hash into a single string. Hashing functionality was originally added to URLs in order to have links scroll to specific positions on pages. For example, you can go directly to this section in the guide by following the [#adding-routing](https://www.notion.so/routing-c8e9bc6cd4734fcc9a30c0ae7df2d7d7) link. Hashes are also super useful for emulating traditional routing in single-page applications. Nowadays, it is included under the hood in several routing libraries like [React Router](https://reactrouter.com/) and the official [Vue Router](https://router.vuejs.org/).

Before creating our routing function, let's first find and store our `<main>` HTML node using the `"app"` ID. This element will serve as the content area of our website (the area that is wrapped by the app shell and changes when the route changes).

```js
const appNode = document.querySelector('#app');
```

Then we need to create a JavaScript object that maps the relationship between specific routes and the functions that create their HTML. For now, we will simply display the name of the page on the screen. Our map will end up looking something like this:

```js
const routesMap = {
  episodes: () => "<div>episodes</div>",
  topics: () => "<div>topics</div>",
  guests: () => "<div>guests</div>",
  resources: () => "<div>resources</div>",
  sponsors: () => "<div>sponsors</div>",
  id: (id) => `<div>single episode: ${id}</div>`,
};
```

Then we get to the real task at hand; the routing function itself (called `handleRouting`):

1. Extract the URL hash directly from the `window.location` object.
2. Use a [regular expression](https://en.wikipedia.org/wiki/Regular_expression) to remove the trailing characters at the start and the end of the hash string. For example, if we have `#/id/21w67g2fi/` it will be converted into ``id/21w67g2fi`. 
3. Split the value into an array based on all forward-slash characters (`/`). This means that our example would be split into `['id', '21w67g2fi']`.

Once we've [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) the page name (the first "folder" in the path) and the optional trailing id value (the second "folder" in the path), we then retrieve the function that corresponds to that page. We proceed by calling it and passing an id value (if present). If no page value is supplied, the episodes page will be shown (which serves as the homepage and general fallback page). Furthermore, if you have a hash with no ID – for example, `#/guests` – then `null` will simply be passed to the specific route function as the ID.

After the above, our function should look something like this:

```js
const handleRouting = async () => {
  const { hash } = window.location;
  const [page, id] = hash.replace(/^#\//, "").replace(/\/$/, "").split("/");

  const routeFn = ROUTES_MAP[page || "episodes"];
  appNode.innerText = routeFn(id || null);
};
```

But our JavaScript doesn't do anything just yet. We need to manually call the routing function once the website loads. We also need to configure an event listener to fire the `handleRouting` function each time the URL hash changes. This will look like:

```js
handleRouting();
window.addEventListener("hashchange", handleRouting);
```

With the above functionality set up, we now need some way to trigger the page changes. We can add a simple header with links as below. Note that the header is part of the app shell and therefore goes above the `<main id="app"></main>` element:

```html
<header>
  <nav>
    <ul>
      <li>
        <a href="#/episodes">Episodes</a>
      </li>

      <li>
        <a href="#/topics">Topics</a>
      </li>

      <li>
        <a href="#/guests">Guests</a>
      </li>

      <li>
        <a href="#/resources">Resources</a>
      </li>

      <li>
        <a href="#/sponsors">Sponsors</a>
      </li>
    </ul>
  </nav>
</header>

<main id="app"></main>
```

When running your code, you will see the following:

![](/images/tutorials/graphql-project/graphql-project-12.gif)

Note how the name of the route is both shown inside the `<main id="app"></main>` element and updated in the URL as a user navigates to a new hash-based route.

### Adding styling

While the above works, it isn't the most pleasing user experience. To this end, let's add some basic CSS class names.

I'm using the [BEM naming convention](https://en.bem.info/methodology/naming-convention/) in my HTML class names. If you are unfamiliar with BEM and want to learn more, visit the BEM documentation at [https://bem.info](https://bem.info/). For now, all you need to know about BEM is that it provides us with a systematic way of naming our CSS classes to manage them more easily. Within a static web project, BEM might be a bit overkill, but whenever you are working with an considerable amount of interactivity, BEM really helps to keep your CSS organized.

```html
<header class="header">
  <div class="header__content">
    <h1 class="header__logo">

    <a class="header__link" href="#">
        <span class="header__large">GraphQL</span>
      <span>FM</span></h1>
    </a>

    <nav class="header__menu" id="menu">
      <a class="header__button header__button_disabled" href="#/episodes">
        Episodes
      </a>

      <a class="header__button header__button_disabled" href="#/topics">
        Topics
      </a>

      <a class="header__button header__button_disabled" href="#/guests">
        Guests
      </a>

      <a class="header__button header__button_disabled" href="#/resources">
        Resources
      </a>

      <a class="header__button header__button_disabled" href="#/sponsors">
        Sponsors
      </a>
    </nav>
  </div>
</header>

<main id="app"></main>
```

We can then apply the following CSS styling to our `style.css` file:

```css
.header {
  background: white;
  position: relative;
}

.header__logo {
  font-size: 1.5rem;
  font-weight: 900;
  font-style: italic;
  user-select: none;
}

.header__link {
  text-decoration: none;
  color: #c0a;
}

.header__link:hover {
  color: #95067d;
}

.header__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  justify-content: space-between;
}

.header__menu {
  background: white;
  top: 100%;
  left: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 1;
  transform-origin: top;
}

.header__large {
  font-size: 3rem;
  letter-spacing: -2px;
}

.header__button {
  text-align: center;
  transition: background 0.3s;
  background: none;
  border: none;
  font-size: 1rem;
  padding: 2.5rem 1rem;
  margin: 0;
  font-family: "Roboto", sans-serif;
  text-rendering: optimizeLegibility;
  color: black;
  text-decoration: none;
  display: block;
  width: 100%;
}

.header__button_disabled {
  opacity: 0.25;
  cursor: default;
}

.header__button:not(.header__button_disabled):hover {
  background: #eee;
  cursor: pointer;
}
```

The above should provide us with a nicely designed app shell:

![](/images/tutorials/graphql-project/graphql-project-13.png)

### Making our web app responsive

As you resize your browser, you might notice that the above isn't fully responsive.

Unfortunately, accommodating the above on mobile viewports will be a bit challenging due to restricted space. Luckily, we can add a "Navigate" button between the logo and the menu items. This button will open and close a vertically aligned list of pages when clicked, and will hide the list when clicked again. This is called [progressive disclosure](https://en.wikipedia.org/wiki/Progressive_disclosure) within the world of user experience.

```html
<button class="header__navigate" id="navigate">Navigate</button>
```

Let's adjust some of our existing CSS in order to make it a bit more usable on mobile:

```css
.header__logo {
  font-size: 1.5rem;
  font-weight: 900;
  font-style: italic;
  user-select: none;
  display: none;
}

.header__content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  justify-content: center;
}

.header__menu {
  background: white;
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  transition: transform 0.3s;
  transform: scaleY(0);
  z-index: 1;
  transform-origin: top;
  border-top: 1px solid #ccc;
}

.header__menu_active {
  transform: scaleY(1);
}
```

We'll also need to add some additional CSS for the HTML elements we just added. Further, we must add some media queries in order to transition between the above full-screen functionality and the mobile approach. Also note that we are using pseudo-elements to control the arrow in the button:

```css
.header__navigate {
  display: flex;
  align-items: center;
  background: #c0a;
  color: white;
  font-weight: 900;
  font-family: "Roboto", sans-serif;
  text-rendering: optimizeLegibility;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  border-radius: 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  margin: 1rem;
}

.header__navigate::after {
  content: "";
  margin-left: 1rem;
  display: block;
  width: 0;
  height: 0;
  border: 0.5rem solid transparent;
  border-top-color: white;
  transition: transform 0.3s;
  transform: rotate(0deg) translateY(0.25rem);
}

.header__navigate_active::after {
  transform: rotate(180deg) translateY(0.4rem);
}

@media (min-width: 500px) {
  .header__logo {
    display: block;
  }
}

@media (min-width: 500px) {
  .header__content {
    justify-content: space-between;
  }
}

@media (min-width: 900px) {
  .header__menu {
    border-top: none;
    transform: scaleY(1);
    flex-direction: row;
    position: static;
    width: auto;
  }
}

@media (min-width: 900px) {
  .header__navigate {
    display: none;
  }
}
```

By adding the above, our app shell will now work as follows on different screen sizes:

![](/images/tutorials/graphql-project/graphql-project-14.gif)

We're now controlling our routing exclusively through JavaScript instead of the default browser behaviour of loading a new HTML file. This means we need to toggle the CSS styling that indicates what page you are viewing. We'll do this using JavaScript in our routing function as follows:

```js
const appNode = document.querySelector('#app');
const navigateNode = document.querySelector('#navigate');
const menuApp = document.querySelector('#menu');

let navigating = false;

const toggleNavigate = (state) => {
  navigateNode.classList.toggle('header__navigate_active')
  menuApp.classList.toggle('header__menu_active')
  navigate = state === undefined ? !navigate : state;
}

const handleRouting = async () => {
  const { hash } = window.location
  appNode.innerHTML = 'Loading...'

  const [page, id] = hash
    .replace(/^#\//, '')
    .replace(/\/$/, '')
    .split('/')

  menuApp 
    .querySelectorAll('a')
    .forEach(node => {
      const value = node.innerText.toLowerCase();
    
      if (value === page || (!hash && value === 'episodes')) {
        node.classList.add('header__button_disabled')
      } else {
        node.classList.remove('header__button_disabled')
      }
  })

    const routesMap = {
    episodes: () => "<div>episodes</div>",
    topics: () => "<div>topics</div>",
    guests: () => "<div>guests</div>",
    resources: () => "<div>resources</div>",
    sponsors: () => "<div>sponsors</div>",
    id: (id) => `<div>single episode: ${id}</div>`,
    };

	const routeFn = routesMap[page || 'episodes'];
	appNode.innerHTML = await routeFn(id || null);

  if (menuApp.classList.contains('header__menu_active')) {
    toggleNavigate(false)
  }
}

navigateNode.addEventListener('click', toggleNavigate)
```

The above retrieves all HTML elements with the class of `header__button` and then loops over them, converting their text value to lowercase and comparing it against the current route. If it matches the current route, then it is disabled since you can't go to the current page if you are already on it. However, this also serves as a (commonly used) visual cue to which page you are on at the moment. Furthermore, if the user is on mobile and the navigation list is open, then it is automatically closed upon loading the new page. Lastly, we are also adding a event listener to toggle the menu on mobile when a user clicks the navigate button.

## Creating Reusable Blocks

![](/images/tutorials/graphql-project/graphql-project-15.png)

Now that we have a working app shell, it's time to create the actual page content. A common approach is to create basic reusable HTML blocks to render your interface. This keeps our code[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Luckily, BEM already provides us with a mental model to scope areas of HTML and CSS to specific reusable blocks.

By consulting the information architecture we created in [part 1](./graphql-project-part-1), we can split our interface into the following reusable blocks:

- A hero section at the top of each page that contains either a title or the latest episode.
- A grid of card-like components that can be used to present a list of items as independent units.
- A details section that contains extra textual information about a specific subject.
- A divider component that we'll be using to divide different sections.

### Adding a hero image

Let's start with the top-most block on our pages, often called a [hero](https://en.wikipedia.org/wiki/Hero_image) in web and print design. Starting out, we can create a simple implementation that merely displays the name of a page. We will also add an image in order to create a strong visual anchor.

We can add the following HTML:

```html
<div class="hero">
  <div class="hero__content">
    <img
      class="hero__image"
      src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1"
    />
    <h2 class="hero__title">Example Title</h2>
  </div>
</div>

```

With the following CSS:

```css
.hero {
  position: relative;
}

.hero__image {
  z-index: -1;
  position: absolute;
  object-fit: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.hero__content {
  padding: 8rem 0rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero__title {
  font-size: 3rem;
  color: white;
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0;
}
```

We are using `postion: relative` and `z-index: -1` to position the image underneath the hero component. While you are able to achieve the same result by using `background-image`, we want to earmark the image as semantically meaningful. This means that accessibility devices and search engines will recognize the above as an image.

The above should now look like this.

![](/images/tutorials/graphql-project/graphql-project-16.png)

However, we want to include another variant of our hero block (to be used on the homepage and on single episode pages). This variant will embed a specific audio file and call to actions as required. To do this, we can modify our hero HTML code from above as follows:

```html
<div class="hero">
  <img
    class="hero__image"
    src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1"
  />
  <div class="hero__content">
    <h2 class="hero__subtitle">Example Title</h2>
    <div class="hero__title">Audio Title</div>

    <audio class="hero__player" controls="controls">
      <source src="#" type="audio/mp3" />
    </audio>

    <div class="hero__buttons-area">
      <a class="hero__button" href="#">Click me!</a>
    </div>
  </div>
</div>
```

We also need to add the following CSS to our `style.css` file:

```css
.hero__subtitle {
  opacity: 0.5;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
  font-weight: 400;
  margin: 0;
}

.hero__player {
  margin: 2rem 0 3rem;
  width: 100%;
}

.hero__buttons-area {
  display: flex;
  justify-content: center;
}

.hero__button {
  text-decoration: none;
  background: #c0a;
  color: white;
  font-weight: 900;
  font-family: "Roboto", sans-serif;
  text-rendering: optimizeLegibility;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1rem;
  border-radius: 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: transform 0.3s, background 0.3s;
  transform: scale(1);
}

.hero__button_disabled {
  opacity: 0.25;
  background: grey;
}

.hero__button:not(.hero__button_disabled):hover {
  background: #95067d;
  cursor: pointer;
  transform: scale(1.1);
}
```

By making the above changes, we are able to use the hero as follows as well:

![](/images/tutorials/graphql-project/graphql-project-17.png)

### Adding a grid of cards

Next, we'll look at ways of displaying items on the screen in a grid-like format. We will create a basic column-like structure. The key goal here is that the number of columns should change depending on the size of the screen:

```html
<ul class="cards">
  <li class="cards__wrap">This is a Card</li>
  <li class="cards__wrap">This is a Card</li>
  <li class="cards__wrap">This is a Card</li>
  <li class="cards__wrap">This is a Card</li>
</ul>
```

By adding the following CSS, we can set our grid to alternate between a single column, two or even three columns (depending on the available space):

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 0;
  max-width: 1200px;
  list-style: none;
  align-items: center;
}

.cards__wrap {
  padding: 1rem;
  width: 100%;
}

@media (min-width: 40rem) {
  .cards__wrap {
    width: 50%;
  }
}

@media (min-width: 60rem) {
  .cards__wrap {
    width: 33.33333333333333%;
  }
}
```

After adding the above, we should see the following behavior in our HTML:

![](/images/tutorials/graphql-project/graphql-project-18.png)

However, we still need to populate the columns with card components. We can create a single card with the code below. This element will then be repeated within the grid cells:

```html
<section class="cards__item">
  <img
    class="cards__image"
    src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1"
  >
  
  <div class="cards__content">
    <span class="card__subtitle">Example Subtitle</span>
    <h3 class="cards__title">Example Title</h3>
    <a class="cards__button" href="#">Click me!</a>
  </div>
</section>
```

Let's add the following styling for our card components:

```css
.cards__item {
  color: rgba(0, 0, 0, 0.87);
  background: white;
  border-radius: 6px;
  overflow: hidden;
}

.cards__content {
  padding: 1rem;
}

.cards__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.cards__subtitle {
  color: rgba(0, 0, 0, 0.54);
  font-size: 0.75rem;
  text-transform: uppercase;
  line-height: 1;
  margin: 0.25rem 0;
}

.cards__title {
  font-size: 1.5rem;
  margin: 0.25rem 0;
  line-height: 1;
  word-break: break-all;
}

.cards__button {
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  margin: 2rem 0 1rem;
  border: 1px #c0a solid;
  text-transform: uppercase;
  color: #c0a;
  background: none;
  border-radius: 32px;
  font-weight: 900;
  font-family: "Roboto", sans-serif;
  text-rendering: optimizeLegibility;
  transition: transform 0.3s, background 0.3s;
  transform: scale(1);
}

.cards__button:hover {
  background: #cc00aa24;
  transform: scale(1.1);
}
```

The above should create a single card element as follows:

![](/images/tutorials/graphql-project/graphql-project-19.png)

### Adding some details

A lot of the content returned from our endpoint will be in [markdown format](https://en.wikipedia.org/wiki/Markdown). We've included the [Markdown It](https://github.com/markdown-it/markdown-it) library in our HTML app shell. However, we are pushing up against the limits of the BEM methodology here (which is not uncommon) because we aren't able to assign CSS class names directly to the HTML elements created by Markdown It.

To that end, we will wrap all the element tag selectors (which is not allowed by BEM), inside a block called "details". We'll do it as follows:

```css
.details {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1200px;
  list-style: none;
  color: white;
  flex-direction: column;
}

.details a {
  color: white;
}

.details a:hover {
  margin: -0.5rem -0.25rem;
  padding: 0.5rem 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

.details ul {
  padding-left: 1rem;
}

.details li {
  line-height: 1.75;
}
```

We can then add the following HTML in order to test the above approach:

```html
<div class="details">
  <div class="details__description">
    <p>Hello World!</p>
    <a href="#">Click me!</a>

    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </div>
</div>
```

This should render the following within our interface:

![](/images/tutorials/graphql-project/graphql-project-21.png)

### Adding a divider to separate sections

Next, we'll add an HTML block that allows us to separate different sections on a page.

![](/images/tutorials/graphql-project/graphql-project-22.png)

```js
<div class="divider">
  <div class="diver__content">
    <h2 class="divider__title">Example Title</h2>
    <img
      class="divider__image"
      src="https://images.unsplash.com/photo-1581368135153-a506cf13b1e1"
    />
  </div>
</div>
```

```css
.divider {
  color: white;
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1rem 0.5rem;
}

.diver__content {
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px grey solid;
  display: flex;
  padding-bottom: 0.5rem;
}

.divider__title {
  margin: 0;
}

.divider__image {
  margin-top: 1rem;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;
  object-fit: cover;
}
```

### Adding a loader

Lastly, we'll want to display some type of animated loader to users when data is being loaded from the endpoint.

```html
<span class="loader"></span>
```

```css
@keyframes spin {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

.loader {
  animation: spin 0.6s linear 0s infinite;
	display: block;
  border: 6px solid grey;
  border-top: 6px solid white;
  border-radius: 50%;
  width: 8rem;
  height: 8rem;
  margin: 8rem auto;
}
```

![](/images/tutorials/graphql-project/graphql-project-23.png)

Up to now, we've been showing users a "Loading..." piece of text. To have our website start off as loading we need to add the loader into our `<main>` element in the HTML. We also want to replace the current app node with a loader when a user changes the current page. You can achieve this with:

```js
appNode.innerHTML = '<span class="loader"></span>'
```

## Adding Some Final Touches
Most of the preparatory work is done and we can get down to actually linking our GraphQL endpoint to our routes. We will do this by creating a date-specific conversion utility function and then creating functions that return our reusable HTML blocks (based on data passed to the function). Lastly, we will tie all of the above together by creating an asynchronous function for each route.

### Doing date conversion

All date-specific data is stored on GraphCMS as [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) strings. This means that we need to run the following function on dates in order to convert them into a more human readable format (for example: "20 October 2015"):

```js
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const convertToPrettyDate = (dateString) => {
  const dateObj = new Date(dateString)
  const day = dateObj.getDate();
  const month = MONTHS[dateObj.getMonth() - 1];
  const year = dateObj.getFullYear()

  return `${day} ${month} ${year}`;
}
```

### Adding reusable block functions

Given that we've already created all our lower-level reusable HTML blocks, we can create the following four functions that create them programmatically:

```js
const createHeroBlock = (props) => {
  const { imageUrl, title, subtitle, file, mime, buttons = [] } = props;

  if (!imageUrl || !title) {
    throw new Error('No "imageUrl" and/or "title" values supplied');
  }

  const audioHtml = !(file || mime)
    ? ""
    : `
    <audio class="hero__player" controls="controls"> 
      <source src="${encodeURI(file)}" type="${mime}"/>
    </audio>
  `;

  const subtitleHtml = !subtitle
    ? ""
    : `
    <span class="hero__subtitle">
      ${subtitle}
    </span>
  `;

  const buttonsHtml =
    buttons.length < 1
      ? ""
      : `
    <div class="hero__buttons-area">
      ${buttons
        .map(
          ({ label, link = "", disabled }) => `
            <${disabled ? "span" : "a"} 
              class="hero__button ${disabled ? "hero__button_disabled" : ""}" 
              href="${encodeURI(link)}"
            >
              ${label}
            </${disabled ? "span" : "a"}>
          `
        )
        .join("")}
    </div>
  `;

  return `
    <div class="hero">
      <img 
        class="hero__image" 
        src="${encodeURI(imageUrl)}"
      >

      <div class="hero__content">
        ${subtitleHtml}
        <h2 class="hero__title">${title.replace(/\# /i, "")}</h2>
        ${audioHtml}
        ${buttonsHtml}
      </div>
    </div>
  `;
};

const createCardsGridBlock = (props) => {
  const { cards } = props;

  if (!cards || cards.length < 1) {
    throw new Error("No cards supplied");
  }

  return `
    <ul class="cards">
      ${cards
        .map(({ title, subtitle, imageUrl, linkLabel, linkUrl }) => {
          if (!title) {
            throw new Error('No "title" value supplied');
          }

          const linkHtml = !(linkLabel || linkUrl)
            ? ""
            : `<a class="cards__button" href="${linkUrl}">${linkLabel}</a>`;

          const subtitleHtml = !subtitle
            ? ""
            : `<span class="cards__subtitle">${subtitle}</span>`;

          const imageHtml = !imageUrl
            ? ""
            : `<img class="cards__image" src="${imageUrl}">`;

          return `
            <li class="cards__wrap">
              <section class="cards__item">
                 ${imageHtml}
                <div class="cards__content">
                   ${subtitleHtml}
                  <h3 class="cards__title">${title}</h3>
                  ${linkHtml}
                </div>
              </section>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
};

const createDetailsBlock = (props) => {
  const { markdown, list = [] } = props;

  if (list.length > 0) {
    return `
        <ul class="details">
          ${list.map((item) => `<li>${item}<li>`).join("")}
        </ul>
    `;
  }

  return `
      <div class="details">
        ${markdownit({ html: true }).render(markdown)}
      </div>
  `;
};

const createDividerBlock = (props) => {
  const { title, imageUrl } = props;

  const imageHtml = !imageUrl
    ? ""
    : `<img class="divider__image" src="${imageUrl}"/>`;

  return `
    <div class="divider">
      <div class="diver__content"> 
        <h2 class="divider__title">${title}</h2>
        ${imageHtml}
      </div>
    </div>
  `;
};

```

### Adding page-level functions

With all our HTML block functions in place, we can start co-configuring them into specific pages and pass all required data straight from each page's GraphQL response into the respective HTML blocks.

```js
const createEpisodesPage = async () => {
  const {
    first: [latest],
    previous,
  } = await gqlQuery(EPISODES_PAGE_QUERY);

  const dividerHtml = createDividerBlock({ title: "Previous Episodes" });

  const heroHtml = createHeroBlock({
    imageUrl: latest.image.url,
    title: latest.title.replace(/\# /i, ""),
    subtitle: "Latest Episode",
    file: latest.audio.url,
    mime: latest.audio.mime,
    buttons: [
      {
        link: `#/id/${latest.id}`,
        label: "View Episode",
      },
    ],
  });

  const cardsHtml = createCardsGridBlock({
    cards: previous.map((item) => ({
      title: item.title.replace(/\# /i, ""),
      subtitle: convertToPrettyDate(item.date),
      imageUrl: item.image.url,
      linkLabel: "View Episode",
      linkUrl: `#/id/${item.id}`,
    })),
  });

  return `
    ${heroHtml}
    ${dividerHtml}
    ${cardsHtml}
  `;
};

const createGuestsPage = async () => {
  const { peoples } = await gqlQuery(GUESTS_PAGE_QUERY);

  const heroHtml = createHeroBlock({
    title: "Guests",
    imageUrl: "https://images.unsplash.com/photo-1460058418905-d61a1b4a55fe",
  });

  const guestHtml = peoples
    .filter(({ episodes: { length } }) => length > 0)
    .map(({ fullName, episodes, photo: { url: imgageUrl } }) => {
      const dividerHtml = createDividerBlock({ title: fullName, imgageUrl });

      const cardHtml = createCardsGridBlock({
        cards: episodes.map((item) => ({
          title: item.title.replace(/\# /i, ""),
          subtitle: convertToPrettyDate(item.date),
          imageUrl: item.image.url,
          linkLabel: "View Episode",
          linkUrl: `#/id/${item.id}`,
        })),
      });

      return `
        ${dividerHtml}
        ${cardHtml}
      `;
    })
    .join("");

  return `
    ${heroHtml}
    ${guestHtml}
  `;
};

const createTopicsPage = async () => {
  const { tags } = await gqlQuery(TOPICS_PAGE_QUERY);

  const heroHtml = createHeroBlock({
    title: "Topics",
    imageUrl: "https://images.unsplash.com/photo-1460058418905-d61a1b4a55fe",
  });

  const topicsHtml = tags
    .map(({ name, episodes }) => {
      const dividerHtml = createDividerBlock({ title: name });

      const cardsHtml = createCardsGridBlock({
        cards: episodes.map((item) => ({
          title: item.title.replace(/\# /i, ""),
          imageUrl: item.image.url,
          subtitle: convertToPrettyDate(item.date),
          linkLabel: "View Episode",
          linkUrl: `#/id/${item.id}`,
        })),
      });

      return `
        ${dividerHtml}
        ${cardsHtml}
      `;
    })
    .join("");

  return `
    ${heroHtml}
    ${topicsHtml}
  `;
};

const createResourcesPage = async () => {
  const { assets } = await gqlQuery(RESOURCES_PAGE_QUERY);
  const dividerHtml = createDividerBlock({ title: "Files" });

  const heroHtml = createHeroBlock({
    title: "Resources",
    imageUrl: "https://images.unsplash.com/photo-1460058418905-d61a1b4a55fe",
  });

  const cardsHtml = createCardsGridBlock({
    cards: assets.map((item) => ({
      title: item.fileName,
      subtitle: item.mimeType,
      linkLabel: "View File",
      linkUrl: item.url,
    })),
  });

  return `
    ${heroHtml}
    ${dividerHtml}
    ${cardsHtml}
  `;
};

const createSponsorsPage = async () => {
  const { sponsorships } = await gqlQuery(SPONSORS_PAGE_QUERY);

  const heroHtml = createHeroBlock({
    title: "Sponsors",
    imageUrl: "https://images.unsplash.com/photo-1460058418905-d61a1b4a55fe",
  });

  const sponsorsHtml = sponsorships
    .map(({ company: { name }, episodes }) => {
      const dividerHtml = createDividerBlock({ title: name });

      const cardsHtml = createCardsGridBlock({
        cards: episodes.map((item) => ({
          title: item.title.replace(/\# /i, ""),
          imageUrl: item.image.url,
          subtitle: convertToPrettyDate(item.date),
          linkLabel: "View Episode",
          linkUrl: `#/id/${item.id}`,
        })),
      });

      return `
          ${dividerHtml}
          ${cardsHtml}
      `;
    })
    .join("");

  return `
      ${heroHtml}
      ${sponsorsHtml}
    `;
};

const createSingleEpisodePage = async (value) => {
  const {
    episode: {
      title,
      date,
      description,
      number,
      notes,
      guests = [],
      tags = [],
      sponsors = [],
      audio: { url, mime },
      image: { url: imageUrl },
    },
  } = await gqlQuery(SINGLE_EPISODE_PAGE_QUERY, { id: value });

  const { previous, next } = await gqlQuery(SINGLE_EPISODE_NEIGHBORS_QUERY, {
    previous: number + 1,
    next: number - 1,
  });

  const heroHtml = createHeroBlock({
    imageUrl: imageUrl,
    title: title.replace(/\# /i, ""),
    subtitle: convertToPrettyDate(date),
    file: url,
    mime: mime,
    buttons: [previous, next].map((button, index) => ({
      label: index === 0 ? "◄ Previous Episode" : " Next Episode ►",
      link: !button ? "" : `#/id/${button.id}`,
      disabled: !button,
    })),
  });

  const guestHtml =
    guests.length < 1
      ? ""
      : createCardsGridBlock({
          cards: guests.map((item) => ({
            title: item.fullName,
            imageUrl: item.photo.url,
          })),
        });

  const descriptionHtml = !description
    ? ""
    : `
      ${createDividerBlock({ title: "Description" })}
      ${createDetailsBlock({ markdown: markdownit().render(description) })}
     `;

  const topicsHtml =
    tags.length < 1
      ? ""
      : `
        ${createDividerBlock({ title: "Topics" })}
        ${createDetailsBlock({ list: tags.map(({ name }) => name) })}
      `;

  const sponsorsHtml =
    sponsors.length < 1
      ? ""
      : `
        ${createDividerBlock({ title: "Sponsors" })}
        ${createDetailsBlock({
          list: sponsors.map(({ company }) => company.name),
        })}
      `;

  const notesHtml = !description
    ? ""
    : `
      ${createDividerBlock({ title: "Show Notes" })}
      ${createDetailsBlock({ markdown: markdownit().render(notes) })}
    `;

  return `
    ${heroHtml}
    ${descriptionHtml}
    ${createDividerBlock({ title: "Guests" })}
    ${guestHtml}
    ${topicsHtml}
    ${sponsorsHtml}
    ${notesHtml}
    `;
};
```

## Where Next?

We've touched on many GraphQL concepts in this tutorial. However, we've barely scratched the surface. For a deeper understanding of GraphQL, consult the [official GraphQL documentation](https://graphql.org/learn/) or follow along to the completely free [How To GraphQL Resources](https://www.howtographql.com).

If you followed along, you can keep adding features to your version. If you want to start from ours, you can find it below.

<iframe height="800px" width="100%" src="https://repl.it/@ritza/GraphQL-FM?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>