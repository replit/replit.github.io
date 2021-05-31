# Build Your Online Store's Checkout Process with Stripe on Replit

Are you looking for an integrated solution for your site’s checkout process, without having to resort to plugins? Here’s a step-by-step approach to integrating Stripe with [Replit](https://replit.com)!

In this tutorial, we'll create an online store (which sells bricks) and integrate it with Stripe's checkout process. Both the frontend and stripe checkout server will be hosted on [Replit](https://replit.com). In part 1, we will start our Replit Stripe server. In part 2, we will set up our repl frontend. Finally, in part 3, we will tie it all together. 

![Checkout process](/images/tutorials/20-online-checkout/checkout_functionality.gif)

## Requirements

To follow along in this tutorial, you will need:
- A [Replit account](https://replit.com/signup). 
- A [Stripe account](https://stripe.com/). 

## Part 1: Start Your Replit Stripe Server

Sign in to Replit and create a new repl by clicking the "+" button in the top right. 
Choose Node.js as your language and name it whatever makes sense to you. 

![Picking a repl](/images/tutorials/20-online-checkout/1.png)

Next, pick the Express server template as a starting point. It’ll provide the framework to integrate with Stripe from a server. 

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

Giving it a run generates the following:

![Running the repl](/images/tutorials/20-online-checkout/2.png)

Terrific! We’re already “hosting” our server with [Replit](https://replit.com).

Next, we need to install the Stripe SDK. We can do this by running:
 
`npm install --save stripe ` in your repl shell.

Next, log into Stripe and head on over to the [integration walkthrough](https://stripe.com/docs/checkout/integration-builder). 

Now copy-paste the walkthrough code into `index.js`:

```javascript
const stripe = require('stripe')('sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N');
const express = require('express');
const app = express();
app.use(express.static('.'));
const YOUR_DOMAIN = 'http://localhost:4242';
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json({ id: session.id });
});
app.listen(4242, () => console.log('Running on port 4242'));
```

### A brief explanation:
This is the shell of the endpoint we'll be sending a `POST` request to, from the frontend:

```javascript
app.post('/create-checkout-session', async (req, res) => {
	//.......
});
```
Inside this request, we'll create the Checkout Session with Stripe, and return the Session id, which the frontend will use to redirect to Stripe's checkout page:

```javascript
const session = await stripe.checkout.sessions.create({
    //......
 });
 res.json({ id: session.id });
```

We'll go over the contents of this request in **Part 3** of this tutorial.

You may have noticed that the integration builder has hardcoded our API key. This isn’t great.

Luckily, Replit supports environment variables, and these are stored under secrets on the repl. [Check out the Replit .env tutorial here](https://docs.repl.it/tutorials/08-storing-secrets-and-history).

To create an environment variable for the API key, click on the lock icon on the left side panel of the repl. Set the key as `STRIPE_KEY` and enter the value for your Stripe key. It will be something like:

```bash
sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N
``` 

![Our .env](/images/tutorials/20-online-checkout/5.png)

We can then reference the environment variable in code using `process.env.STRIPE_KEY`. Change this line:

```javascript
const stripe = require('stripe')('sk_test_51IKlwdAhJUZ4ZUqHFBRpOTbbNVakSMbHbouhVH89YPszHcOftinFd6Vi5oOOaY1HZ1PDNmOfiKEEdR03vOqeaHWU00TnpDSj8N');
```

to:

```javascript
const stripe = require('stripe')(process.env.STRIPE_KEY);
```

Before we continue, there are a couple of extra config elements we'll need to enable to make sure our frontend and server-side can communicate. These are:

**1**. Adding body parsing

This will allow us to pass the request body from the frontend to the server-side. Just add the following lines after `const app = express();`

```javascript
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

**2**. Enabling CORS

This will allow us to accept body content on the server-side. We need to add the CORS dependency. Import the package by typing the following in the repl shell:

```bash
npm install --save cors
```

Now import `cors` at the top of `index.js`:

```javascript
const cors = require('cors');
```

Next, add the following line after the two lines we added in step **1**.

```javascript
app.use(cors());
```

The full code now looks like this:

```javascript
const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const YOUR_DOMAIN = 'http://localhost:4242';
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json({ id: session.id });
});
app.listen(4242, () => console.log('Running on port 4242'));
```

You’ll notice the Stripe code requires a `YOUR_DOMAIN` variable, that’s currently set to https://localhost:4242. In order to link this up with our site, we need to create one. Continue to **Part 2** – Buying bricks with a repl frontend!


## Part 2: Buying Bricks With a Repl Frontend

In this section, we will make a site that’ll act as the online store where we can buy our bricks. We will connect the site to our Stripe integration we created in **Part 1**.

To do this, we’ll start off with a new repl, using the “HTML,CSS, JS” option and call it "BrickSite". 

![Creating a new repl](/images/tutorials/20-online-checkout/new-frontend.png)

We’ll create a one-page application with minimal functionality: a static list of bricks that a user can buy. Each brick has a price, a name, a description and an image. A "Buy this brick" button will allow the user to purchase a brick.


### 1. Making BrickSite
Our first step is to add the Bulma styling library. It’s a great way to style BrickSite with little effort. We’ll include the CDN by replacing the default `rel=”stylesheet”` with the Bulma CDN.

*Nifty-tip!* Searching “bulma” in the packages tab in our Replit IDE means we can insert it automatically. See here:

![Auto adding Bulma](/images/tutorials/20-online-checkout/adding_bulma.gif)

This inserts the following into our `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css"></script>
```
Change this to the code below and paste it in the `<head>` tag:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css"/>
```

Now, we want to create a list of bricks a user can buy. Each brick has its own name, description, predefined styles, price and image. We paste this in our `script.js`:

```javascript
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
  }
];
```

In order to display these bricks, we want to add some basic HTML that we can dynamically add content to on render. We define the following `<body>` after the closing `</head>` tag and within the `<html>` tags of our `index.html`:

```html
  <body>
    <div class="section">
      <div class ="container">
        <div class="title"> My Site to Buy Bricks </div>
        <div id="bricks" class="tile is-ancestor">
        </div>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
```

We'll be dynamically adding our array of bricks to the `id=bricks` div tag.

The full code for `index.html` is:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>BrickSite</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css" />
  </head>
  <body>
    <div class="section">
      <div class ="container">
        <div class="title"> My Site to Buy Bricks </div>
        <div id="bricks" class="tile is-ancestor">
        </div>
      </div>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

Now, going back to our `script.js`, we want to add dynamic vanilla JS elements to the content on the page. For every brick in the `BRICKS` array, we'll create a div element, add its own name, styling, content and button, and then add it to the DOM.

We add the following content in order:

For each brick in our predefined list:

```javascript
for (var i = 0; i < BRICKS.length; i++) {

```

Add a new `div` to the DOM and give it some styling (predefined by Bulma, so we don't need to do the css ourselves):

```javascript
 let newBrick = document.createElement('div');
 newBrick.className = "tile is-parent";
```

Add an `article` element on the document and give it some styling. Each brick has its own style defined in the `BRICKS` array, so use this in the class definitions:

```javascript
 let newBrickArticle = document.createElement('article');
 newBrickArticle.className = "tile is-child notification " + BRICKS[i].style;
```

Create a new `p` element on the document, give it title styling and make the text (`innerHTML`) the name of the brick:

```javascript
 let newBrickTitle = document.createElement('p');
 newBrickTitle.className = "title";
 newBrickTitle.innerHTML = BRICKS[i].name;
```

Do the same with the brick's description:

```javascript
 let newBrickDesc = document.createElement('p');
 newBrickDesc.className = "subtitle";
 newBrickDesc.innerHTML = BRICKS[i].desc;
```

And show the brick's price by adding a new `div` with the price in a little description:

```javascript
 let newBrickCost = document.createElement('div');
 newBrickCost.className = "box";
 newBrickCost.innerHTML = "This brick costs: $" + BRICKS[i].cost;
```

Lastly, add the `a` element for purchasing the brick with some styling and text. Also, give it an id that's the number of the brick, so we know what content to pass to the method when the button is clicked. We'll create the `onclick` method and functionality for this a little later:

```javascript
  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
  newBrickButton.className = "button is-dark";
  newBrickButton.innerHTML = "Buy this brick"
```

Now add the new title, description, cost and button elements to the `article` element:

```javascript
 newBrickArticle.appendChild(newBrickTitle);
 newBrickArticle.appendChild(newBrickDesc);
 newBrickArticle.appendChild(newBrickCost);
 newBrickArticle.appendChild(newBrickButton);
```

And, finally, add the `article` to the parent brick `div` and append it as a child to the `div` we defined as `id="bricks"` in our `index.html`; and close the for loop:

```javascript
 newBrick.appendChild(newBrickArticle);
 document.getElementById("bricks").appendChild(newBrick);   
}
 ```

Altogether, our `script.js` now looks like:

```javascript
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
  }
];

for (var i = 0; i < BRICKS.length; i++) {
  let newBrick = document.createElement('div');
  newBrick.className = "tile is-parent";

  let newBrickArticle = document.createElement('article');
  newBrickArticle.className = "tile is-child notification " + BRICKS[i].style;

  let newBrickTitle = document.createElement('p');
  newBrickTitle.className = "title";
  newBrickTitle.innerHTML = BRICKS[i].name;

  let newBrickDesc = document.createElement('p');
  newBrickDesc.className = "subtitle";
  newBrickDesc.innerHTML = BRICKS[i].desc;

  let newBrickCost = document.createElement('div');
  newBrickCost.className = "box";
  newBrickCost.innerHTML = "This brick costs: $" + BRICKS[i].cost;

  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
  newBrickButton.className = "button is-dark";
  newBrickButton.innerHTML = "Buy this brick"

  newBrickArticle.appendChild(newBrickTitle);
  newBrickArticle.appendChild(newBrickDesc);
  newBrickArticle.appendChild(newBrickCost);
  newBrickArticle.appendChild(newBrickButton);

  newBrick.appendChild(newBrickArticle);
  document.getElementById("bricks").appendChild(newBrick);    
}
```

Referring back to the server's endpoint code that we got from the Stripe walkthrough, you will notice it requires both a `success.html` and a `cancel.html`. Let’s make new files for these in the root of our repl.

Place the code below in the `success.html` file:

```html
<!DOCTYPE html>
<html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">
   <title>MySite - Success</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css" />
 </head>
 <body>
   <div class="section">
     <div class ="container">
       <article class="message is-large is-success">
         <div class="message-header">
           <p>Congratulations!</p>
         </div>
         <div class="message-body">
           You have purchased a brick. We hope you build great big things with your brick and come back to buy more bricks from us. May the bricks be ever in your favour and the bricklaying be bountiful and swift.
         </div>
       </article>
   <script src="script.js"></script>
 </body>
</html>
```

We can test this page by adding the file name as the button's href inside the `script.js`:

 ```javascript
 newBrickButton.href = "success.html"
 ```

Here’s how the success page will look - `success.html`:

![Success page](/images/tutorials/20-online-checkout/9.png)

Place the code below in the `cancel.html` file:

```html
<!DOCTYPE html>
<html>
 <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width">
   <title>MySite- Cancel</title>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.2/css/bulma.min.css" />
 </head>
 <body>
   <div class="section">
     <div class ="container">
       <article class="message is-large is-danger">
         <div class="message-header">
           <p>Failed!</p>
         </div>
         <div class="message-body">
           You have failed to purchase a brick. Please come back and try again when you are ready to purchase a brick.
         </div>
       </article>
   <script src="script.js"></script>
 </body>
</html>
```

We can test this page by adding the file name as the button's href inside the `script.js`:

 ```javascript
 newBrickButton.href = "cancel.html"
 ```

And here’s how the cancel page will look:

![Failure page](/images/tutorials/20-online-checkout/10.png)

 
Alright, now that we have the groundwork on the frontend, this brings us to **Part 3** – connecting the parts!
 

## Part 3: Connecting the Parts
Going back to our server repl, we’ll notice the `YOUR_DOMAIN` constant. Set that with the value of your repl “frontend” URL.

e.g. My frontend URL is: `https://bricksite-stripe-checkout.ritza.repl.co` as you can see below:

![URL](/images/tutorials/20-online-checkout/11.png)

Replace `YOUR_DOMAIN` with the frontend URL:

```javascript
const YOUR_DOMAIN = 'https://bricksite-stripe-checkout.ritza.repl.co';
```

Now, within the `create-checkout-session` post request, we need to do a couple of things. The first is to define the payment methods available:

```javascript
   payment_method_types: ['card'],
```

Next is to define the `line_items`. We want to add our own content here that would get passed from the frontend Replit, so we define the product inventory information based on what is sent through to the frontend:

```javascript
  line_items: [
    {
      name: req.body.name,
      images: req.body.images,
      description: req.body.desc,
      amount: req.body.price,
      currency: 'usd',
      quantity: 1,
    },
  ],
```

Next, we need to define the mode. There are three options supported by Stripe: `payment`, `subscription` or `setup`. One-time purchases use the `payment` mode.    

```javascript
mode: 'payment'
```

Lastly, we need to define the success and cancel pages; the same pages we created earlier on the frontend.

```javascript
  success_url: `${YOUR_DOMAIN}/success.html`,
  cancel_url: `${YOUR_DOMAIN}/cancel.html`,
```

Altogether, the `index.js` of the server-side repl now looks as follows (I've also added a `console.log` line inside our request so that we can confirm the incoming request body):

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
var cors = require('cors')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const YOUR_DOMAIN = 'https://bricksite-stripe-checkout.ritza.repl.co';


app.post('/create-checkout-session', async (req, res) => {
  console.log("REQUEST", req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: req.body.name,
        images: req.body.images,
        description: req.body.desc,
        amount: req.body.price,
        currency: 'usd',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });
  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Running on port 4242'));
```

### Back to BrickSite

First, we need to add Stripe as a CDN dependency to our site. To do this, paste the following code between the `<head> ... </head>` tags of your `index.js`.

```html
   <script src="https://js.stripe.com/v3/"></script>
```


Now, going back to `script.js`, we want to define a new instance of Stripe with your publishable API key (you will find this in the Load Stripe.js section of the [Integration Builder walkthrough](https://stripe.com/docs/checkout/integration-builder)):

```javascript
 var stripe = Stripe(YOUR_API_KEY);
```

Next, we want to create `onclick` event listeners to our button definitions so that we can initiate the purchase when the button is clicked.

Underneath the button definitions in `script.js`, add the following:

```javascript
  newBrickButton.onclick = buttonClick;
```

Now, at the bottom of the page, we want to define the function `buttonClick` as the function that will execute when the button is clicked.

```javascript
async function buttonClick(event) {

}
```

Inside `buttonClick`, we paste in the prebuilt checkout page’s HTML script content from the "Fetch a Checkout Session" section of the [Integration builder walkthrough](https://stripe.com/docs/checkout/integration-builder):

```javascript
async function buttonClick(event) {
  fetch("/create-checkout-session", {
    method: "POST",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (session) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    })
    .then(function (result) {
      // If redirectToCheckout fails due to a browser or network
      // error, you should display the localized error message to your
      // customer using error.message.
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}
```

This way, each button will trigger a call to our server endpoint `/create-checkout-session` when clicked.

We need to add a couple more things to allow fetch to function:

At the very top of the `buttonClick` method, add the following to enable registering the window event of 'clicking':

```javascript
event = event || window.event;
var target = event.target || event.srcElement;
```

Next we want to reference the brick that we clicked on. Each brick has an `id` that we can reference it by, that corresponds with its index in the `BRICKS` array. We get and parse the id as follows:

```javascript
var id = target.id;
let i = parseInt(id);
```

At the moment, the code is dispatching a POST request to `/create-checkout-session`, which isn't exactly right. We want it to be to `SERVER_URL/create-checkout-session`. Let's create a constant that's the URL and change the request destination as follows:

```javascript
const API_URL = "https://stripe-checkout-server.ritza.repl.co";
  
return fetch(API_URL + "/create-checkout-session", {
  ...
```

Inside the `fetch` request declaration and underneath `method: "POST"`, we want to add the following to enable CORS and allow json content to be sent:

```javascript
mode: 'cors',
headers: {
  'Content-Type': 'application/json'
},
```

Underneath this, we now want to send our body content. This will allow us to send the brick details to Stripe on the server-side, so that it can display it on the checkout page:

```javascript
body: JSON.stringify({
  name: BRICKS[i].name,
  images: BRICKS[i].images,
  desc: BRICKS[i].desc,
  price: BRICKS[i].cost * 100
})
```

(We need to multiply the price by 100 because Stripe uses cents definition for pricing, so `price: 100` equals $1.)

Altogether, the content of `script.js` now looks like:

```javascript
const BRICKS = [
  {
    "name": "Brickson Brick",
    "desc": "this is a plain brick",
    "style": "is-info",
    "cost": 1,
    "images": ["https://www.kulucrete.co.za/website/wp-content/uploads/2016/11/smooth-brick.jpg"]
  },
  {
    "name": "Bricketty Brick",
    "desc": "this is a cooler brick",
    "style": "is-warning",
    "cost": 5,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJc_W56qiCUiHHECVkar1jKQSrTniYAaqL_g&usqp=CAU"]
  },
    {
    "name": "MyBrickerty McBrickson",
    "desc": "this is the best brick",
    "style": "is-success",
    "cost": 100,
    "images": ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LWKwpEFAfNXgPT6Ot5xdjHbqoKYa6ktG0g&usqp=CAU"]
  }
];

 var stripe = Stripe("pk_test_51IKlwdAhJUZ4ZUqHO9ukmofCvmpp4ttlqsSpupeTYwiDJTYOVnh2n0xNYhYzP9Tkw3ddNXGe5LZliOGu3f8sxX6N001zb0122M");


for (var i = 0; i < BRICKS.length; i++) {
  let newBrick = document.createElement('div');
  newBrick.className = "tile is-parent";

  let newBrickArticle = document.createElement('article');
  newBrickArticle.className = "tile is-child notification " + BRICKS[i].style;

  let newBrickTitle = document.createElement('p');
  newBrickTitle.className = "title";
  newBrickTitle.innerHTML = BRICKS[i].name;

  let newBrickDesc = document.createElement('p');
  newBrickDesc.className = "subtitle";
  newBrickDesc.innerHTML = BRICKS[i].desc;

  let newBrickCost = document.createElement('div');
  newBrickCost.className = "box";
  newBrickCost.innerHTML = "This brick costs: $" + BRICKS[i].cost;

  let newBrickButton = document.createElement('a');
  newBrickButton.id = i;
  newBrickButton.className = "button is-dark";
  newBrickButton.innerHTML = "Buy this brick"
  newBrickButton.onclick = buttonClick;

  newBrickArticle.appendChild(newBrickTitle);
  newBrickArticle.appendChild(newBrickDesc);
  newBrickArticle.appendChild(newBrickCost);
  newBrickArticle.appendChild(newBrickButton);

  newBrick.appendChild(newBrickArticle);
  document.getElementById("bricks").appendChild(newBrick);    
}

async function buttonClick(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    var id = target.id;
    let i = parseInt(id);

    const API_URL = "https://stripe-checkout-server.ritza.repl.co";
      
    return fetch(API_URL + "/create-checkout-session", {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: BRICKS[i].name,
        images: BRICKS[i].images,
        desc: BRICKS[i].desc,
        price: BRICKS[i].cost * 100
      })
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        // If redirectToCheckout fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using error.message.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
}
```

## Let's Get Testing!

To test, make sure the server-side is running. You can confirm this by making sure you see the "Stop" button at the top:

![New tab icon](/images/tutorials/20-online-checkout/18.png)

Now go back to the frontend, and press "Run" there too. Unlike the server-side, it won't continue to say "Stop", but it is running. Now we are ready to attempt to buy a brick by clicking on a brick's "Buy this brick" button.

### Debugging
On running the request, you may get the error:

```bash
UnhandledPromiseRejectionWarning: Error: In order to use Checkout, you must set an account or business name at https://dashboard.stripe.com/account.
```

To fix this, follow the link and add a company name on your Stripe dashboard.

You may also get the error, "Does not have permission to redirect" after clicking on "Buy this brick" using the Replit browser preview mode. In order to avoid this, open the frontend in a new tab by clicking on the "Open in new tab" icon:

![New tab icon](/images/tutorials/20-online-checkout/14.png)

### Buying a Brick

Clicking on "Buy this brick" on any of the bricks redirects to the Stripe session checkout page thanks to our server-side creating the session and sending the session id back to the frontend. I've chosen to buy a Bricketty Brick:

![Checkout page](/images/tutorials/20-online-checkout/16.png)

Now test the purchase process by entering the Stripe test payment card details:

```
Card number: 4242 4242 4242 4242 
```

Email address, expiry date, CVV and name on card can be anything. Pressing "Pay $5.00" should redirect to our `success.html` page:

![Success](/images/tutorials/20-online-checkout/17.png)

We've successfully made a purchase with Stripe!

## Stripe Server
<iframe height="400px" width="100%" src="https://replit.com/@ritza/stripe-checkout-server?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## BrickSite
<iframe height="400px" width="100%" src="https://replit.com/@ritza/bricksite-stripe-checkout?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
