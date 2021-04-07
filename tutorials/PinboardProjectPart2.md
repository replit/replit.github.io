<!-- omit in toc -->
# Pinboard Project: Part 2

[Part 1](./PinboardProjectPart1) of this project showed us how to create the basic structure and styling of our pinboard, but static HTML and CSS can only get us so far. The last step in creating a fully functional pinboard is to add interactivity with JavaScript. Here is what we will cover now:

- [Updating HTML and CSS](#updating-html-and-css)
- [JavaScript Code](#javascript-code)
- [Handling Data](#handling-data)
  - [Local Storage](#local-storage)
  - [HTML DOM Nodes](#html-dom-nodes)
- [Functions](#functions)
  - [Updating Displayed HTML](#updating-displayed-html)
  - [Updating Saved Pins](#updating-saved-pins)
  - [Filtering Displayed Pins](#filtering-displayed-pins)
- [Event Specific Functions](#event-specific-functions)
  - [Handling Input Events](#handling-input-events)
  - [Handling Click Events](#handling-click-events)
  - [Handling Submit Events](#handling-submit-events)
- [Executing Code](#executing-code)
- [Further Reading](#further-reading)

## Updating HTML and CSS

We'll be using JavaScript to control and create dynamic content, so we can remove our hardcoded elements from our basic structure.

We added a `defer` attribute to our `script` tag in our HTML. Since we are no longer hardcoding our pins in the HTML, we have to wait for the HTML to be created before our JavaScript runs. This means that there might be a brief delay before JavaScript loads the dynamic content. While we wait, we will only be able to see the HTML and CSS. We might want to display a loading animation so users know the content is still loading, so let's add the following CSS to our `style.css` file:  

```css
@keyframes spin {
  0% { transform: rotate(0deg) } 
  100% { transform: rotate(360deg) }
}

.loader {
  animation: spin 0.6s linear 0s infinite;
	display: block;
  border: 8px solid #80008030;
  border-top: 8px solid purple;
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  margin: 6rem auto;
}
```

The "strange" syntax in the snippet above is a way of declaring animations in CSS. The declared animation (via `@keyframes`) is telling our styling that our animated element should start a 0 degrees rotation and continue all the way to 360 degrees rotation. We are also binding the animation to our `.loader` class using the `animation` property. Our `animation` property describes behaviour in this order:

- We want to use the `spin` animation declared by means of the `@keyframe` at-rule.
- Each cycle of the animation (from `0%` to `100%` ) should last `0.6` seconds.
- The animation should be `linear`, meaning it moves at the  same speed, continually.
- The animation should have no delay; it should wait `0` seconds before starting.
- The animation should repeat the cycle indefinitely (`infinite`).

The HTML element with the `loader` class will be an exact square, with a `height` and `width` of `6rem`. When we apply a `border-radius` of `50%`, the element gets turned into a circle. This circle should not have a background colour but should have a light-pink border but where one edge is dark purple (by overriding with `border-top`). By spinning this circle on its own axis (as per the `animation`), we create our loading effect.

Once the loader is added, we can replace our placeholder pins with the HTML below. You should replace the entire original `<main>` element and its content in your HTML:

```js
<main>
  <div class="list" id="pins-list">
    <span class="loader"></span>
  </div>
</main>
```

This means you will see this while our JavaScript loads (you don't have any JavaScript now, so it should be in this state indefinitely):

![Page loading animation](/images/teamsForEducation/pinboard-project/image-7.png)

However, there are still some other left-overs from our hardcoded HTML in part 1. If we enter a value into the filter field (top-left), we will still get autocompleted recommendations from our previous pins (even though we have no pins or tags on the page at the moment). To fix this, we must clear the contents of our `<datalist>` HTML element (since we'll be managing these via JavaScript): 

You should change the current `<datalist>` element to:

```js
<datalist id="existing-tags"></datalist>
```

## JavaScript Code

Now we are ready to add our JavaScript code. Similar to what we did in part 1, we will add the JavaScript in its entirety and then walk through it step by step. Let's start by placing the entire snippet below in our `script.js` file:

```js
let pins = [];

const defaultPins = [
  {
    id: "122203215486581930752615279550",
    image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600",
    tags: ["engineering"],
  },
  {
    id: "144685389103194178251333634000",
    image: "https://images.unsplash.com/photo-1572932491814-4833690788ad?w=600",
    tags: ["headphones", "ocean", "wellness"],
  },
  {
    id: "159279541173033634211014623228",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215?w=600",
    tags: ["office", "coding", "desk"],
  },
  {
    id: "75261220651273643680893699100",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600",
    tags: ["boxing", "wellness"],
  },
  {
    id: "161051747537834597427464147310",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600",
    tags: ["lab", "engineering"],
  },
];

const savedPins= localStorage.getItem('savedPins');

if (savedPins) {
  pins = JSON.parse(savedPins)
} else {
  pins = defaultPins;
}


const existingTagsNode = document.querySelector('#existing-tags');
const filterInputNode = document.querySelector('#filter-input');
const pinsListNode = document.querySelector('#pins-list');

const dialogNode = document.querySelector('#dialog');
const dialogStartNode = document.querySelector('#dialog-start');
const dialogFormNode = document.querySelector('#dialog-form');
const dialogImageNode = document.querySelector('#dialog-image');
const dialogTagsNode = document.querySelector('#dialog-tags');
const dialogSubmitNode = document.querySelector('#dialog-submit');


function updateHTML (providedPins) {
  pinsListNode.innerHTML = (providedPins || pins).map(
    ({ id, image, tags }) => (`
      <section class="pin">
        <img class="image" src="${image}">

        <ul class="info">
          ${tags.map(
            (tag) => (`
            <li class="tag-wrap">
              <button class="tag">${tag}</button>
            </li>
          `)
          ).join('')}
        </ul>
        <button class="remove" aria-label="remove" value="${id}">
          &#10005;
        </button>
      </section>
    `)
  ).join('');
}


function updatePins (newPins) {
	if (newPins) pins = newPins;
  localStorage.setItem('savedPins', JSON.stringify(pins))
  existingTagsNode.innerHTML = pins.reduce(
    (result, { tags }) => {
      const newTags = tags.filter(tag => !result.includes(tag));
      return [...result, ...newTags]
    }, 
    []
  ).map(
    (tag) => `<option>${tag[0].toUpperCase()}${tag.slice(1)}</option>`
  ).join('')
  updateHTML();
}


function applyFilter (filter) {
  if (filter.trim() === '') return updateHTML();
  const array = filter
    .split(',')
    .map(text => text.trim())
    .map(text => text.toLowerCase());
  const filteredPins = pins.filter(({ tags }) => {
    const matchedTags = tags.filter(tag => array.includes(tag));
    return matchedTags.length >= array.length;
    }
  )
  updateHTML(filteredPins);
}


function handleInput (event) {
  if (event.target === filterInputNode) {
    applyFilter(escape(event.target.value))
  } else if (event.target === dialogImageNode || event.target === dialogTagsNode) {
    if (dialogImageNode.value.trim() !== '' && dialogTagsNode.value.trim() !== '') {
      dialogSubmitNode.disabled = false;
    } else {
      dialogSubmitNode.disabled = true;
    }
  }
}


function handleClick (event) {
  if (event.target === dialogStartNode || event.target === dialogNode) { 
    dialogNode.classList.toggle('hidden')
    dialogNode.open = !dialogNode.open;
  } else if (event.target.classList.contains('remove')) {
    updatePins(pins.filter(({ id }) => id !== event.target.value));
    applyFilter(filterInputNode.value)
  }	else if (event.target.classList.contains('tag')) {
    filterInputNode.value = event.target.innerText;
    applyFilter(filterInputNode.value)
  }
}


function handleSubmit (event) {
  event.preventDefault();
  const time = new Date()
    .getTime()
	const id = `${time}${Math.random() * 100000000000000000}`;
  const image = encodeURI(dialogImageNode.value.trim());
  const tags = dialogTagsNode.value
    .split(',')
    .map(tag => tag.trim())
    .map(tag => tag.toLowerCase())
    .map(tag => escape(tag));
  updatePins([ ...pins, { id, image, tags } ]);
  applyFilter(filterInputNode.value)
  dialogNode.classList.add("hidden");
	dialogNode.open = false;
  dialogImageNode.value = '';
  dialogTagsNode.value = '';
  dialogSubmitNode.disabled = true;
}


document.body.addEventListener('input', handleInput)
document.body.addEventListener('click', handleClick)
document.body.addEventListener('submit', handleSubmit)
updatePins();
```

## Handling Data

Before executing any logic, we need to set up some basic data structures. First, instead of hardcoding our pins in the HTML as before, we will now keep track of them using an array with objects in our JavaScript. Each object will contain an `id`, `image` and an array of `tags`. However, if a user visits our page for the first time, their pins will start as an empty array (`[]`). This won't look very appealing, so we also add a `defaultPins` array that we can add to our active `pins` array if this is the first time a user is visiting our page. The `defaultPins` contains all the values that we hardcoded in part 1, but you can replace them with your own default values.

### Local Storage

All the above JavaScript will stop running once we close the page, so any data stored in the `pins` variable (whether added by a user or the default pins) will be lost. This means that the array will be created again from scratch when the user returns to their pinboard - not helpful. 

Fortunately, all modern browsers allow us to persist data even after we close our pinboard. We can use the `localStorage.setItem` method to save data locally to our device, and then use `localStorage.getItem` to retrieve the data again when the page loads. While `localStorage` is super powerful, there are a couple of things to keep in mind:

- It does not persist between different browsers.
- It won't sync between devices.
- If you clear your browser history, it might delete your `localStorage` data too.
- You can only save strings (a single line of text data) in `localStorage`.
- Each string needs to be assigned to a unique name in `localStorage`.

The last two points are important since it means that we are unable to store arrays or objects to `localStorage`. A common way around this is to turn our data structures into strings (via `JSON.stringify`) before saving it to `localStorage`, and then turn it back into an array or object (via `JSON.parse`) after retrieving it from `localStorage`.

For example, by running `JSON.stringify` on our array, we are able to save a string resembling the following in `localStorage`: 

```jsx
"[{id:\"1222032154865\",image:\"https:\/\/images.unsplash.com\/photo-1580983218765-f663bec07b37?w=600\",tags:[\"engineering\"],},{id:\"1446853891031\",image:\"https:\/\/images.unsplash.com\/photo-1572932491814-4833690788ad?w=600\",tags:[\"headphones\",\"ocean\",\"wellness\"],},{id:\"1592795411730\",image:\"https:\/\/images.unsplash.com\/photo-1580894908361-967195033215?w=600\",tags:[\"office\",\"coding\",\"desk\"],},{id:\"752612206512\",image:\"https:\/\/images.unsplash.com\/photo-1584464491033-06628f3a6b7b?w=600\",tags:[\"boxing\",\"wellness\"],},{id:\"1610517475378\",image:\"https:\/\/images.unsplash.com\/photo-1581094271901-8022df4466f9?w=600\",tags:[\"lab\",\"engineering\"],},]"
```

This is how we use `localStorage` in our JavaScript code:

1. We check if there is a string called `savedPins` saved in our `localStorage`.
2. If there is a string assigned, we run `JSON.parse` on it to turn it into an array.
3. We then set our active `pins` variable to the returned array. (If no such `savedPins` value exists in `localStorage`, we know that this is the first time a user is visiting our page.)
4. We populate the `pins` variable with the default pins:

```js
let pins = [];

const defaultPins = [
  {
    id: "1222032154865",
    image: "https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600",
    tags: ["engineering"],
  },
  {
    id: "1446853891031",
    image: "https://images.unsplash.com/photo-1572932491814-4833690788ad?w=600",
    tags: ["headphones", "ocean", "wellness"],
  },
  {
    id: "1592795411730",
    image: "https://images.unsplash.com/photo-1580894908361-967195033215?w=600",
    tags: ["office", "coding", "desk"],
  },
  {
    id: "752612206512",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600",
    tags: ["boxing", "wellness"],
  },
  {
    id: "1610517475378",
    image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600",
    tags: ["lab", "engineering"],
  },
];

const savedPins= localStorage.getItem('savedPins');

if (savedPins) {
  pins = JSON.parse(savedPins)
} else {
  pins = defaultPins;
}
```

### HTML DOM Nodes

In addition to keeping all our active pins in a `pins` variable, it's also helpful to declare all the HTML elements that we will be using upfront. This means that when returning, you'll see all the IDs used by JavaScript grouped together. All of these HTML elements are selected by means of the `document.querySelector` method. The query we use is similar to selectors in CSS, for example, `#existing-tags` means that JavaScript needs to look for an HTML tag with an `id` attribute of `existing-tags`.

In part one, we created a couple of `id` attributes in our HTML that we can use to find the required elements:

```js
const existingTagsNode = document.querySelector('#existing-tags')
const filterInputNode = document.querySelector('#filter-input');
const pinsListNode = document.querySelector('#pins-list')

const dialogNode = document.querySelector('#dialog')
const dialogStartNode = document.querySelector('#dialog-start')
const dialogFormNode = document.querySelector('#dialog-form')
const dialogImageNode = document.querySelector('#dialog-image')
const dialogTagsNode = document.querySelector('#dialog-tags')
const dialogSubmitNode = document.querySelector('#dialog-submit');
```

## Functions

Now that we've created our basic data structures, we'll be declaring some JavaScript functions that we can run when specific conditions are met. All of these snippets just create the functions and don't do anything until the functions are called later in our code.

### Updating Displayed HTML

Any type of interactivity on the web is only possible by directly modifying the HTML or CSS that is displayed by the user. This is done by
1. Loading a new page (using server-side rendering), or 
2. Directly manipulating the former with JavaScript. 

Let's go with option 2. We will create a low-level function that we can run each time our `pins` array changes. By running this function, our HTML will be re-rendered to reflect the current state of our `pins` array.

We start by referencing the `pinsListNode` variable, which holds the `div` HTML tag that wraps all our displayed pins. Because we made changes, it only contains a `<span class="loader"></span>` HTML at the moment. Once we run our `updateHTML` function, the HTML inside the `div` will be overridden by a new HTML string created by the following logic:

- When the `updateHTML` function is called, an optional `providedPins` array can be passed directly to it as an argument.
- Within the function, we start with `(providedPins || pins)` which tells JavaScript to use the `providedPins` argument if it is passed to the function, otherwise it should fall back to the default `pins` variable declared at the top of the file.
- Next, we start by running the `.map` method, the array that was selected in the last step. The `.map` method accepts a function as an argument, which we immediately pass as an [arrow function.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) This function will be executed on every single item in our array (a pin object in our case), and will then return a new array populated with the results of each execution.
- Each object in our starting array should have an `id`, `image` and `tags` property (which we decided when we created the `pins` variable above). This means that we can directly [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) them into the arrow function that we pass.
- Each time the arrow function executes, it returns a string of HTML created by a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) (wrapped in back-tick characters). Template literals are super useful because they allow us to insert dynamic values straight into the string. Dynamic values should be wrapped in the following syntax: `${ }`. This is called [interpolation](https://en.wikipedia.org/wiki/String_interpolation).
- The first variable we interpolate is the `image` property retrieved directly from the object by destructuring. However, the next interpolation is an actual JavaScript expression (in this case, the result of the expression will be placed in our string where the interpolation is defined).
- In this interpolated expression, we do another `.map`, this time over the tags array inside each pin object. We're again using interpolation to add the value dynamically to the returned HTML string.
- Our interpolation expression should have an array of HTML strings once it finishes, for example: `["<li class="tag-wrap"><button class="tag">engineering</button></li>", <li class="tag-wrap"><button class="tag">Wellness</button></li>", <li class="tag-wrap"><button class="tag">Coding</button></li>"]`
- At the end of the interpolated expression, we are running a `.join('')` method. The `.join` method combines all values of an array into a single string. The argument that we pass to `.join` determines how the items will be divided in the final string. Since we don't want any dividers between our lines of HTML strings above, we simply pass an empty string as an argument (`''`). For example, `[1,2,3].join('-')` will create the string: `"1-2-3"`. Likewise `[1,2,3].join('')` will create `"123"`
- Finally, you'll see that we do the exact same thing on the first `.map` that provides the final value to `pinsListNode.innerHTML`.

```js
function updateHTML (providedPins) {
  pinsListNode.innerHTML = (providedPins || pins).map(
    ({ id, image, tags }) => (`
      <section class="pin">
        <img class="image" src="${image}">

        <ul class="info">
          ${tags.map(
            (tag) => (`
            <li class="tag-wrap">
              <button class="tag">${tag}</button>
            </li>
          `)
          ).join('')}
        </ul>
        <button class="remove" aria-label="remove" value="${id}">
          &#10005;
        </button>
      </section>
    `)
  ).join('');
}

```

The above should create a string that looks something like the below, and is assigned as the HTML inside `pinListNode`:

```js
pinsListNode.innerHTML = `
<section class="pin">
  <img 
    class="image" 
    src="https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600"
  >

  <ul class="info">
    <li class="tag-wrap">
      <button class="tag">engineering</button>
    </li>
  </ul>

  <button class="remove"aria-label="remove" value="1222032154865">
  &#10005;
  </button>
</section>

<section class="pin">
  <img
    class="image"
    src="https://images.unsplash.com/photo-1572932491814-4833690788ad?w=600"
  >

  <ul class="info">
    <li class="tag-wrap">
      <button class="tag">headphones</button>
    </li>

    <li class="tag-wrap">
      <button class="tag">ocean</button>
    </li>

    <li class="tag-wrap">
      <button class="tag">wellness</button>
    </li>
  </ul>

  <button class="remove"aria-label="remove" value="1446853891031">
  &#10005;
  </button>
</section >`;
```

### Updating Saved Pins

It's not enough to just update our HTML. We need to perform some higher-level tasks, too. For example, we need to save the current `pins` variable to `localStorage` and update our `datalist` HTML (so that we get the most up-to-date autocomplete recommendations). We do this using the following function:

```js
function updatePins (newPins) {
	if (newPins) pins = newPins;
  localStorage.setItem('savedPins', JSON.stringify(pins))
  existingTagsNode.innerHTML = pins.reduce(
    (result, { tags }) => {
      const newTags = tags.filter(tag => !result.includes(tag));
      return [...result, ...newTags]
    }, 
    []
  ).map(
    (tag) => `<option>${tag[0].toUpperCase()}${tag.slice(1)}</option>`
  ).join('')
  updateHTML();
}
```

Similar to our `updateHTML` function, we are able to pass a value called `newPins` to this function. If a `newPins` array is passed to the function, then the current `pins` variable (declared at the top of the file) will be overridden with `newPins`. This is a quality of life feature, because in most cases where we run `newPins`, we also want to update the `pins` variable.

First, the function runs `JSON.stringify` on our `pins` array and then overrides (or creates) the current `savedPins` value in `localStorage` with the string from `JSON.stringify`. We then retrieve the `existingTagsNode` variable (which has the element for our `datalist` in the HTML) and we replace its inner HTML with the result of this logic:

- We get the current `pins` array and run the `.reduce()` method on it. To recap, `.reduce()` is similar to `.map()`, and also runs a function (passed as an arrow function to reduce) on each item in the original array. However, instead of providing the item itself as the argument of the arrow function, `.reduce()` provides two arguments. The first `result` contains the last value returned. The next argument (which we restructure as `{ tags }`) is the current array item that it is looping over. This allows us to do some powerful things in JavaScript. For example, we can add all the values in an array: `[1,2,3,4,5,6,7,8].reduce((result, number) => result + number), 0);` which will return `36`.
- In our case, we are destructuring only the `tags` array from each object in our array (although the other properties still exist on the object).
- We then use the `filter` method to create a new array that contains only the tag items that are not already in the existing `result`. The `.filter()` method works similar to `.map()` and `.reduce()` as it returns a new array, but items from the original array are only copied over if the arrow function executed on the particular item returns `true`. For example `[21, 9, 40, 0, 3, 11].filter(number => number < 10)` will return `[9, 0, 3]`.
- In our function, we use the `includes()` method to determine if a tag already exists in `results`. If it does, it will return `true`; if not, `false`.
- We then modify the `result` of our `.reduce()` method by combining the newly created array with the existing `result` values. If the newly created array is empty (if it has no tags or all its tags are already present in `result`), then an empty array will be added to `result` (ie keeping `result` as is).
- In addition to the arrow function that we pass to `.reduce()`, we also need to pass a second argument. This second argument determines the `result` value when the `reduce()` method starts. In our case, we want it be an empty array (`[]`).
- Now, since we're only getting the string value of the tags themselves in the `result` of `.reduce()`, we still need to wrap them in actual HTML. We do this by passing the results to a `.map()` method that simply wraps them in an `<options>` HTML element.
- Then we pass another expression into the interpolation of this template literal. In this case, the expression simply capitalizes the first character of the tag value by means of selecting it and running `.toUpperCase()` on it and then interpolating the rest of the value after it. `.slice(1)` extracts all characters after the first one. For example, `engineering` will be converted to `Engineering`.
- Lastly, we run `.join('')` on the final array to turn it into one big HTML string.

The above should replace the inner HTML inside `existingTagsNode` with something like:

```js
existingTagsNode.innerHTML = `
  <option>Engineering</option>
  <option>Headphones</option>
  <option>Wellness</option>
  <option>Ocean</option>
  <option>Office</option>
  <option>Coding </option>
  <option>Desk</option>
  <option>Boxing</option>
  <option>Lab</option>
`
```

At the end, we automatically trigger the `updateHTML` function to make sure that we are showing the correct pins.

### Filtering Displayed Pins

Let's create our last core function before we move on to event handlers. This function updates the HTML being displayed to the user based on a single text value (passed directly to the function). This value will correspond to the input of the filter field in our HTML:

```js
function applyFilter (filter) {
  if (filter.trim() === '') return updateHTML();
  const array = filter
    .split(',')
    .map(text => text.trim())
    .map(text => text.toLowerCase());
  const filteredPins = pins.filter(({ tags }) => {
    const matchedTags = tags.filter(tag => array.includes(tag));
    return matchedTags.length >= array.length;
    }
  )
  updateHTML(filteredPins);
}
```

Before we do anything, we want to check if the `filter` argument passed to the function is `''`. If nothing is passed to the filter, we should call the `updateHTML` function without passing any arguments. This means that the function will replace the current HTML using the full default `pins` array (instead of a custom filtered object). This will override any currently filtered HTML (since we are essentially saying that no filters should be applied) and display all pins. We also run `.trim()` on the values passed, using `filter`. This is to account for empty spaced values like `"         "` (which should still be considered empty).

However, if the string passed by means of `filter` is not empty, we start by turning it into a variable called `array` that can be looped over when comparing tags. We do this to allow users to pass chained filters into a single string by means of separating them by commas (`,`), for example `"Engineering, Office, Lab"`. To transform this into a useable `array` value, we will:

- Run `split` on the string. This breaks the string into an array, with the argument passed being used as the point of division (essentially the opposite of `.join()`). This means that our example above will be transformed into the following array: `["Engineering", " Office", " Lab"]`
- The last two items in the array have spaces before them, so they won't match any of our tags –`" Office"` is not the same as `"Office"` according to JavaScript. We use `.map()` and the `trim()` method again to remove any whitespace around our tags. This should also get rid of random spaces added by users.
- We also don't want our filtering to be case sensitive, so we run `.map()` over the array and covert all tags to lowercase (since we are keeping everything as lowercase in our JavaScript).

In addition to the above, we have created another array. This array, titled `filteredPins` is a duplicate of the default `pins` array, but we have removed all the objects that do not have tags that match any items in `array`. To create this array, we:

- Run the `filter()` method on our `pins` array and pass an arrow function that automatically destructures the `tags` array from each object in `pins`.
- Run a second nested filter inside the arrow function on the `tags` property from the pin object.
- Within this nested arrow function, we loop over each tag assigned to an object and use `.includes()` to see if it matches one of the values created in our initial `array` variable above (based on the filter string that was passed to the function).
- The nested `filter()` will only return tags that actually match the filter `array`, so we can say that if it returns `0` items (checked with `.length`) then none of the tags in the object match any items in our reference `array` variable. This object should not be added to our new `filteredPins` array.
- On the other hand, if there is at least one item in the `matchingTags` array, we can say that at least one tag matches our original filter `array`. This means that the object should be copied to the new `filteredPins` array.
- After only the objects that have matching tags are copied to `filteredPins`, we run `updateHTML` passing `filteredPins` as the array to use (uing the `providePins` parameter created in the `updateHTMl` function). This means that the default `pins` variable won't be used, replaced by the filtered pins array that we pass.

Here, the distinction between `updatePins` and the lower-level `updateHTML` becomes important. The `updatePins` functions also runs the `updateHTML` function after it performs its own tasks, such as overriding `savedPins` in `localStorage` and updating the `datalist` HTML. You might have wondered why we didn't just embed the `updateHTML` logic directly in the `updatePins` functions. Here, we see the value of being able to call `updateHTML` directly (without `updatePins`), since this means that we can side-step all the latter logic that changes the actual `pins` data. The filters are only visual in nature, so we only want to update the HTML show to the user, while keeping our `pins` data untouched. Filtering pins should not actually remove any objects from the `pins` array or remove any recommendations from our `datalist`. If we used `updatePins` instead, then this would accidentally change the pins that were added.

Taking this approach also means that we can simply run the default `updateHTML` function (without passing an argument) if the filter value changes to empty, essentially syncing up the displayed HTML with the full `pins` array again.

## Event Specific Functions

We created three modular, low-level tasks by means of functions. These can be reused throughout our JavaScript logic and abstract away common tasks. However, at this point, we've only declared these functions so nothing will happen if we run our JavaScript up until this point. To actually use the above functions, we need to trigger them in response to actions performed by users.

This is commonly done by adding [event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventListener) directly to HTML nodes. For example in the case of our *"Add New Image"* button, we want to remove the `hidden` CSS class from our dialog element. We can do the following: 

```js
dialogStartNode.addEventListener(
  'click',
	() => {
	  dialogNode.classList.remove('hidden')
		dialogNode.open = true;
	}
)
```

This is a common approach to handling user-triggered events, but it becomes tricky if we relinquish the creation of our HTML to JavaScript itself. This is because when we recreate HTML via JavaScript (as we do with `updateHTML`), we need to manually re-add each individual event listener. We also need to manually remove all previous event listeners (via `removeEventListener` ) before swapping out the HTML. Otherwise, [as outlined by Nolan Lawson](https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/), we can cause unexpected memory leaks. This is not a problem with our example because the `dialogStartNode`never gets replaced. However, when we do replace HTML, this approach introduces large amounts of overhead. 

Luckily, the HTML DOM itself gives us a way around this. Most modern browsers do [event propagation](https://www.freecodecamp.org/news/a-simplified-explanation-of-event-propagation-in-javascript-f9de7961a06e/). This means that if an event is fired, it ripples up the entire HTML tree until it is captured or reaches the top-level `<body>` element.

This means we can get around placing event listeners directly on our HTML elements by rather adding them to the highest level parent the HTML `<body>` element. However, since all events in our HTML will set off the event listener added to the  `<body>` element, we need to be able to distinguish between events. This is easy and only requires us to look at the `target` property of an event's dispatched object.

With this approach, we can create three separate functions that handle all our `click`, `input` and `submit` events on the page. Note these functions are not the event listeners themselves, but are used to respond to the event listeners by being passed as a callback to, for example, `document.body.addEventListener('input', handleInput)`.

### Handling Input Events

Let's start with a piece of interaction that seems like it might require a fair bit of complexity: `input`. Because things need to update real-time as our input events fire, the associated logic might be heavily nested. In fact, both cases of where we listen to `input` events are actually pretty trivial because we have already done most of the work with our previous core functions. However, we need to take into account [character escaping](https://en.wikipedia.org/wiki/Escape_character). 

We allow users to enter values into our inputs without restriction, so we should prevent them from entering anything that might be harmful or break the functionality of our pinboard. For example, if a user enters `console.log('You've been hacked!')` into the input, we want to prevent this value from accidentally getting executed by JavaScript as code (thereby logging "You've been hacked" to the browser console). 

Going back to one of our examples at the very top where we discussed how an array can be changed into a string with `JSON.stringify` (in order to save it into `localStorage`), we looked at the following example:

```jsx
"[{id:\"1222032154865\",image:\"https:\/\/images.unsplash.com\/photo-1580983218765-f663bec07b37?w=600\",tags:[\"engineering\"],},{id:\"1446853891031\",image:\"https:\/\/images.unsplash.com\/photo-1572932491814-4833690788ad?w=600\",tags:[\"headphones\",\"ocean\",\"wellness\"],},{id:\"1592795411730\",image:\"https:\/\/images.unsplash.com\/photo-1580894908361-967195033215?w=600\",tags:[\"office\",\"coding\",\"desk\"],},{id:\"752612206512\",image:\"https:\/\/images.unsplash.com\/photo-1584464491033-06628f3a6b7b?w=600\",tags:[\"boxing\",\"wellness\"],},{id:\"1610517475378\",image:\"https:\/\/images.unsplash.com\/photo-1581094271901-8022df4466f9?w=600\",tags:[\"lab\",\"engineering\"],},]"
```

You'll see that all our double quotation marks (`"`) have backslashes (`\`) before them. This tells JavaScript that the double quote symbol should be treated as the string character `"` and not as an actual JavaScript syntax symbol. If we didn't escape the quotes, JavaScript would actually close the above string prematurely, since the `"` symbol is used in JavaScript to end string declarations.

This means that JavaScript would end the string when it reaches the double quote as follows:

```jsx
"[{id:"
```

We will be escaping some of the data provided by users, so it's important to understand exactly why we are doing this. Let's look at the function itself:

```js
function handleInput (event) {
  if (event.target === filterInputNode) {
    applyFilter(escape(event.target.value))
  } else if (event.target === dialogImageNode || event.target === dialogTagsNode) {
    if (dialogImageNode.value.trim() !== '' && dialogTagsNode.value.trim() !== '') {
      dialogSubmitNode.disabled = false;
    } else {
      dialogSubmitNode.disabled = true;
    }
  }
}
```

We can see that there are two types of event listeners that we are interested in:

- Where the `target` is the same as the `filterInputNode` input.
- Where the `target` is either the `dialogImageNode` or `dialogTagsNode` inputs.

The `input` event is different from the `change` event as that `change` only fires when a user changes the value inside input and then clicks outside it. `input` is triggered even when a single character changes in our input. This means that if we type `Hello!`, it would fire the `input` event six times, and then when we remove the exclamation mark (`!`), changing the value to `Hello`, it would fire again. Whereas `change` would only fire once we click away from the `input`.

The actual card filtering event is simple; we check if it was the `filterInputNode` that triggered `input` and if so, we pass the value of the input to the `applyFilter` function. However, we want to add another piece of functionality to this behaviour. Because the fields used in our dialog are empty when our page loads, we also want to set the button to add the values as a pin to `disabled`. However, having a button that is indefinitely disabled is useless, so we want to check the values whenever either the image URL or entered tags change. Only once both of these are full do we enable the button. We do this by:

- Removing all surrounding whitespace from the both input field values by means of `.trim()`.
- If neither of these values are empty (i.e. they do not trim to `''` ), we set the disabled state of the submit button to `false` (allowing it to be clicked).
- If either of the latter return `''` when trimmed, we will either keep the button disabled or set it back to disabled.

### Handling Click Events

A `click` event listener is one of the most common event listeners on the web. It is triggered whenever a user presses anything in our HTML (this includes touch events on mobile). Currently, there are four types of click events that we are interested in:

- A user clicks on the `Add New Image"` button.
- A user clicks outside of the dialog form.
- A user clicks on the remove button (`x`) on top of a pinned image.
- A user clicks on one of the tag buttons on top of a pinned image.

We can cover all of these with the following function:

```js
function handleClick (event) {
  if (event.target === dialogStartNode || event.target === dialogNode) { 
    dialogNode.classList.toggle('hidden')
    dialogNode.open = !dialogNode.open;
  } else if (event.target.classList.contains('remove')) {
    updatePins(pins.filter(({ id }) => id !== event.target.value));
    applyFilter(filterInputNode.value)
  }	else if (event.target.classList.contains('tag')) {
    filterInputNode.value = event.target.innerText;
    applyFilter(filterInputNode.value)
  }
}
```

Let's go through this function step by step:

The first two events in our list require the exact same thing: the toggling of hidden and open states of the dialog. We check if the `event.target` is either `dialogStartNode` or the `dialogNode` itself. If so, we can simply toggle the `hidden` class and set the `open` attribute to the exact opposite of what it currently is (by means of a [logical not operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)). While the last attribute has no effect on what is shown to users, it is helpful for search engines and accessibility devices.

Then, if our `target` is neither of the above, we check if the `target` value contains the `remove` CSS class. Since we are using the `remove` class to style our deletion buttons, we can assume that the event came from one of these buttons. But how do we see which pin it came from? You may remember that we added a `value` attribute to each of these buttons in our HTML. This `value` attribute contains the unique `id` of the object corresponding to a specific pin.

This means that we can once again use the `.filter()` method and tell it to create a new array that only contains objects that do not match the supplied ID (using the `value` attribute). We then pass this new array directly to `updatePins` and the pin is removed from the HTML and our `pins` array. After updating the pins, we also re-apply the current filter value (if there is one) so the HTML update that removed the pin does not break any current filtering condition.

Lastly, if our event is neither of these, then we can check if the target has a class of `tag`. If so, then we know that we are dealing with one of the tags buttons overlaid on top of a pin (when a user hovers over a pin). This means that we can use its inner text to check the name of the tag that was clicked on, and override the current filtering input with this value. However, since we are doing this programmatically (and it is not triggered by the user), we need to manually trigger the `input` event.

### Handling Submit Events

Lastly, we have the `submit` event function. This is fired whenever a form is submitted on our page. Because we only have one form on our page, we don't need to check where the event came from. We just execute the following logic:

```js
function handleSubmit (event) {
  event.preventDefault();
  const id = new Date()
    .getTime()
    .toString();
  const image = encodeURI(dialogImageNode.value.trim());
  const tags = dialogTagsNode.value
    .split(',')
    .map(tag => tag.trim())
    .map(tag => escape(tag));
  updatePins([ ...pins, { id, image, tags } ]);
  applyFilter(filterInputNode.value)
  dialogNode.classList.add("hidden");
	dialogNode.open = false;
  dialogImageNode.value = '';
  dialogTagsNode.value = '';
  dialogSubmitNode.disabled = true;
}
```

- By default, when a form is submitted on a web page the page automatically refreshes (assuming that the data will be handled by the server). However, since we are using JavaScript to handle our logic (and not a server), we want to override this behaviour. Luckily, the submit event object includes a method (`preventDefault`) that we can run on the event itself to prevent this from happening.
- We then need to create a unique `id` value to identify this new pin added to the `pins` array. We generate a unique `id` value by using the current date and time. We simply get the current date and time with `new Date()` and then run `getTime()` on it. The latter turns the created date object into a number of milliseconds that have passed since midnight 1 January 1970 (called the [unix epoch](https://en.wikipedia.org/wiki/Unix_time) in programming).
- The implication here is that unless a user presses the submit button twice at the exact same millisecond, each of their pins will have a different unique value (based on when it was created).
- To be technically correct, we should save our ID as a string, not a number, by running the `.toString()` method on our millisecond number. Although an amount of milliseconds looks like a number, when we use it as a unique ID it technically isn't a number anymore.
- Then we retrieve the URL value provided and run `encodeURI()` on it. Not only does `encodeURI()` escape characters (eg. turning `;,/?:@&=+$#` into `%3B%2C%2F%3F%3A%40%26%3D%2B%24%23`), it also does this in a way that still makes it useable as a URL.
- We then create the tags that were entered. This very closely resembles the logic we use in our `applyFilter` function, with the exception that we loop over the items afterwards and manually run the native JavaScript `escape` function on each item.
- Next, we create a new array by destructuring the current `pins` array and adding an object to it that uses the values we created above.
- We manually trigger `applyFilter` to not break any filtering that is currently applied.
- We close the dialog by making direct use of the `dialog` HTML element.
- We reset all HTML elements inside the dialog to empty and disabled.

## Executing Code

We've created all the logic required by our pinboard, but if we run our JavaScript up to this point, nothing will happen. This is because we only created the required data structures and functions that will be used by JavaScript. We need to action them. We do this using four lines of code:

```js
document.body.addEventListener('input', handleInput)
document.body.addEventListener('click', handleClick)
document.body.addEventListener('submit', handleSubmit)
updatePins();
```

Each line is responsible for actioning a different function:

- We attach an event listener to the HTML body element and tell it to fire `handleInput` when users input values into any input field.
- We attach an event listener to the HTML body element and tell it to fire `handleClick` when a user clicks on anything in our HTML.
- We attach an event listener to the HTML body element and tell it to fire `handleSubmit` when a user submits a form created in our HTML.
- We manually trigger `updatePins` in order to create the HTML for the pins that have been loaded by JavaScript.

## Where next

We've touched on many concepts and native functionality of JavaScript itself. We've explained each concept as we went. 

If you want a deeper understanding of something, take a look at the [Mozilla Developer Network Glossary](https://developer.mozilla.org/en-US/docs/Glossary) page. 

You can extend the project by starting from our example repl below. For example, you can add more advanced tagging functionality to allow the user to specify multiple tags and say whether they want to show cards that match all tags (an "AND" search) or any cards (an "OR" search).

If you want to add back-end functionality, you can add a database and use sign-up so that people can view their pins from any device, instead of only the one where they originally saved them.

<iframe height="400px" width="100%" src="https://repl.it/@ritza/Pinboard-Project?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
