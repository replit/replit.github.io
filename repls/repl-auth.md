# Authenticating users with Repl Auth

*This tutorial is an expansion of [this one](https://replit.com/talk/learn/Authenticating-users-with-Replit-Auth/23460) written by [Mat](https://replit.com/@mat1)*

To help you authenticate users hassle-free, we have created Repl Auth. This allows you to authenticate users without having to write your own authentication logic or work with databases. You can simply authenticate a user with their Replit account without the need to store secure passwords. It's also faster to set up than something like Google authentication.

In this tutorial, we'll build a basic Flask web application where Replit users can be authenticated with Repl Auth. To show that a user is authenticated, we will display some of their Replit account information back to them.

The main components for this tutorial are:
- [Python](https://www.python.org/doc/) for serverside code.
- [Flask](https://flask.palletsprojects.com/en/1.1.x/) and [Jinja2](https://jinja.palletsprojects.com/) for rendering a basic web page where the user can authenticate.
- [HTML](https://www.w3schools.com/html/html_intro.asp) for the web page layout. 

## Setup

You'll need a Replit account for this tutorial so if you haven't already, head over to the [signup page](https://replit.com/signup) to create an account. If this is your first time using Replit, check out the [Quick Start Guide](https://docs.replit.com/repls/quick-start) before continuing with this tutorial.

Create a new Python repl and give it a name. 

![Creating a new repl](/images/repls/repl-auth/create-repl.png)

## Creating the Basic Flask App

Let's build a basic Flask app that will render a simple HTML page where we will add the authentication button and display the user's account details later.

In the `main.py` file, add the following code: 

```python
from flask import Flask, render_template, request

app = Flask('app')

@app.route('/')
def home():
  return render_template('index.html')

app.run(host='0.0.0.0', port=8080)
```

Above, we have a basic Flask app that will render the `index.html` page which we will add next.

By default, Flask will check for HTML pages to render within a directory called `templates`. Create a new folder in the root directory and name it `templates`. Now create a new file within the `templates` directory and name it `index.html`.

Let's add some basic HTML to display `Hello, Repl.it!` on the landing page.

Copy the following HTML to the `index.html` file:

```html
<!doctype html>
<html>
<head>
	<title>Repl Auth</title>
</head>
<body>
	Hello, Replit!
</body>
</html>
```

That's it for the Flask app. Run the code and you should see the browser window display 'Hello, Replit!'.

![Hello Repl.it](/images/repls/repl-auth/hello-replit.png)

## The Authentication Script 

To add authentication to our Flask app, add the following within the **body** of the `index.html` page:

```html
<div>
	<script authed="location.reload()" src="https://auth.turbio.repl.co/script.js"></script>
</div>
```

This script can be placed anywhere in the document **body** and will create an iframe within its parent element. Additionally, any JavaScript placed in the `authed` attribute will be executed when the user finishes authenticating. Currently, our app will just reload once the user authenticates. 

If we run our application now, we'll see a `Login with Repl.it` button. 

![Login button](/images/repls/repl-auth/login-button.png)

If you click the button, an authorization window will pop up with **Let (your site url) know who you are?**, a profile summary and an `Authorize` button. Clicking the button doesn't do anything at this stage; we'll add some functionality next. 

![Repl.it authentication window](/images/repls/repl-auth/authentication-window.png)

## Retrieving Information from the Authenticated Account

We can retrieve the user's data by requesting information from the Repl.it specific headers and extracting data from them. The headers we want for this tutorial are `X-Replit-User-Id`, `X-Replit-User-Name` and `X-Replit-User-Roles`.

Let's get these from the header and pass them to our HTML template. 

In the `main.py` file change the `home()` function to look as follows:

```python
@app.route('/')
def hello_world():
	return render_template(
		'index.html',
		user_id=request.headers['X-Replit-User-Id'],
		user_name=request.headers['X-Replit-User-Name'],
		user_roles=request.headers['X-Replit-User-Roles']
	)
```

Above, we use `request` to get the Repl.it headers and place them into variables.

Next we should update our `index.html` page to use the headers passed to it and display them back to the user if they are authenticated. 

Open the `index.html` file and replace the body with the following:

```html
<body>
	{% if user_id %}
	<h1>Hello, {{ user_name }}!</h1>
	<p>Your user id is {{ user_id }}.</p>
	{% else %}
	Hello! Please log in.
	<div>
		<script authed="location.reload()" src="https://auth.turbio.repl.co/script.js"></script>
	</div>
	{% endif %}
</body>
```

Above, we check if the user is already authenticated and display their account details. If not, they are asked to "Please log in".

Run the application and you should see `Hello, <username>! Your user id is <user_id>`

![Hello user_name](/images/repls/repl-auth/hello-username.png)

## Warning 

Be aware that if you're going to use an acccounts system, **PLEASE** do all the specific logic for checking users on the **BACK END**, *do not* do it with JavaScript in your HTML.

## Closing Notes

If you followed along, you'll have your own repl to expand. If not, you can [fork our repl](https://repl.it/@ritza/replit-auth) or test it out below.

<iframe height="400px" width="100%" src="https://repl.it/@ritza/replit-auth?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

