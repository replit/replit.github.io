# Quick Start Guide

Welcome to Replit! This platform aims to show you a new workflow that can change the way you write code. This guide should give you a quick overview of the many features of our platform.

Don't worry if you are new to programming; we have tutorials to help you. To get you started, we have created these guides to get you coding in Python:

1. [Creating a New Python 3 Repl](#creating-a-new-python-3-repl)
2. [Renaming and Describing your Repl](#renaming-and-describing-your-repl)
3. [The Repl Environment](#the-repl-environment)
4. [Hello World!](#hello-world)
5. [Creating a Simple Input Program](#creating-a-simple-input-program)
6. [Adding Packages](#adding-packages)
7. [Creating Python Plots](#creating-python-plots)
8. [Starting a Web Server](#starting-a-web-server)
9. [Adding Secret Keys](#adding-secret-keys)
10. [Sharing Your Repl](#sharing-your-repl)
11. [Sample Repls](#sample-repls)
12. [More from our Community](#more-from-our-community)
13. [Moving Forward](#moving-forward)

## Creating a New Python 3 Repl

From your ["My Repls" dashboard](/repls/dashboard), you can create a new repl by clicking on the "+ New Repl" button at the top of your sidebar, or the blue "+" button in the top right corner of the page. This will bring you to a dialog box where you can specify your preferred language from a drop-down menu, and name your repl.

1. Select Python as your language.
2. Name your repl whatever you'd like. 
3. Click "create repl". 

This will bring you to your workspace.

## Renaming and Describing your Repl

The right repl name and discription will help with organizing your repls, and make it easier to find your desired repl later. Once you have created your repl, you can edit its name and description:

1. Navigate to the "My Repls" dashboard. 
2. Click the three-dot icon native to that repl. 
3. Click "edit" from the drop-down menu. 
4. Edit the text fields to change the name and add a description. 
5. Once you are satisifed, click "save". 

![Renaming repls](/images/repls/quickstart/renaming_repl.gif)

## The Repl Environment

There are three main parts to a repl:

1. The left-hand **Sidebar**, where you can find a variety of panes for files, the package manager, settings, and so on.
2. The middle pane **Editor**, where you write code.
3. The right-hand **Console**, where you can interact with your code or evaluate it line-by-line.

## Hello, World!

Now that you have your repl sorted, it's time to start coding. In the **Console**, type the following and hit enter:

```python
print("Hello World!")
```

Here, you can evaluate code line by line and interact with its results.  Now let's try entering the following:

```python
x = "hey"
```

Then type:

```python
x * 3
```

Variables declared in the console persist, so you can continue to interact with variables there.

## Creating a Simple Input Program

Now let's move over to the **Editor** in the middle. Type in the following code:

```python
name = input("What's your name?")

print("Hello", name)
```

To run it, click on the big "Run" button at the top of the screen, or hit CTRL+Enter (Windows/Chromebook) or CMD+Enter (Mac).

You'll see the code run on the right hand side of the screen. Since the program is asking for input, go ahead and type your name in the console and hit enter. It should then greet you!

![Simple input program](/images/repls/quickstart/simple_repl.gif)


## Adding Packages

To demonstrate how to add packages, we are going to make a simple plot. Clear the code you have created up to now, and let's find a package. Packages are essentially directories which help us organize code without starting from scratch. We'll be using the `matplotlib` package:

1. Click on the packages icon on your sidebar (the cube).
2. Enter `matplotlib` to search for the package. 
3. Select the first one.
4. Click on the `+` button to add it to your packages.

This will create new files, `pyproject.toml` and `poetry.lock`, which contains all the package information for your repl, including the version number.  It will also start installing on the right.

Now select `main.py` to return to your program.

![Install package](/images/repls/quickstart/install_package.gif)

[Learn more about packages](/repls/packages).

## Creating Python Plots

Let's enter the following code:

```python
import matplotlib as mpl
import matplotlib.pyplot as plt

plt.plot([1, 2, 4, 8, 16])

plt.savefig('plot.png')
```

Run the code. You'll see that the newly generated image, `plot.png`, shows up in the filetree. Clicking on it will show you the image in  the editor! We hope you love this feature as much as we do.  

![Generate plot](/images/repls/quickstart/generate_plot.gif)

[Learn more about plotting in Python](/repls/python-plots).

## Starting a Web Server

Let's create a new Python3 repl. (Save time and use [this shortcut](https://repl.it/languages/python3)). Let's call this one "python flask server".

Our first step is to add the `flask` package. Go through the [steps above]((#adding-packages)) except this time, choose the package called `flask`.

![Starting a server](/images/repls/quickstart/flask_server.gif)

Once finished, go back to `main.py` and enter the following code:

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_repler():
  return 'Hello, Repler!'

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
```

Hit run, and you'll see that a new pane has appeared with the URL for your repl's hosted site, along with a preview of what it looks like.  You can share this link with your friends to show them the simple app that you made.

![Flask run](/images/repls/quickstart/flask_run_result.png)

[Learn more about web servers](/repls/http-servers).

## Adding Secret Keys

So far, your repl is public to everyone (unless you have a paid plan) and they can see the code that you put here. If you need to add some private information, such as an API key or a database password, you can use `.env` files.

Create a new file by clicking on the "Add file" icon in your filetree. Name it `.env`.

`.env` files contain key-value pairs like the following. In the concole, type:

```
PASSWORD=pass1234
```

This `.env` file is special because it is only visible to you.  Anyone who is visiting your repl won't be able to see the contents of this file.

Now let's edit `main.py` to include the following in the console:

```python
from flask import Flask, request, redirect
import os
app = Flask(__name__)

@app.route('/')
def hello_world():
  return redirect('/secret_route?secret=pass1234')

@app.route('/secret_route')
def secret_route():
  password = request.args.get('secret')
  if (password == os.environ['PASSWORD']):
    return 'You found the secret!'
  else:
    return 'Wrong password!'

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
```

We're creating a new page where we look for a query parameter `secret` and we check to see if it matches our `.env` secret. The gif below demonstrates the results.

![Secret keys](/images/repls/quickstart/secret_keys.gif)

Note that this isn't a very secure way of handling secret tokens, since the URL including the query parameter can be cached. This is just a simple demonstration.

[Learn more about .env files](/repls/secret-keys)

## Sharing Your Repl

Now that you've created your first repl, feel free to share it with our community! Here's how:

1. Head on over to [Repl Talk](https://replit.com/talk/all).
2. Click on "+ add a post". 
3. From the drop-down menu, you can choose from _Share, Ask, Tutorials,_ and _Templates_. Select "Share".
4. Choose the repl from the list (or type the name to search). 
5. Add a title and a description.
6. Click "Submit".

![Share your repl](/images/repls/quickstart/sharing_repl.gif)

Feel free to join our Discord Community as well! Join with [this invite link](https://discord.gg/346Tapr).

## Sample Repls

If you're interested in exploring more and seeing what you can do with Replit, take a look at the following repls:

* [OneShot](https://repl.it/@IbraheemRodrigues/OneShot?ref=quickstart) by [@IbraheemRodrigues](https://repl.it/@IbraheemRodrigues?ref=quickstart) – an online multiplayer mobile-friendly space shooter game using Express.js and Socket.io.
* [Quantum Programming Tutorial](https://repl.it/@quantum_jim/QuantumProgrammingTutorial?ref=quickstart) by [@quantum_jim](https://repl.it/@quantum_jim?ref=quickstart) – an interactive CLI program to teach you quantum programming.
* [CartPole](https://repl.it/@MikeShi42/CartPole?ref=quickstart) by [@mikeshi42](https://repl.it/@MikeShi42?ref=quickstart) – utilizing machine learning via OpenAI Gym to solve the classic cartpole game.
* [Game of Life](https://repl.it/@AlephZero/GameOfLife?ref=quickstart) by [@AlephZero](https://repl.it/@AlephZero?ref=quickstart) – the classic cellular automaton written in vanilla JavaScript.
* [Language Translator](https://repl.it/@panniu/Language-Translator?ref=quickstart) by [@panniu](https://repl.it/@panniu?ref=quickstart) – a simple translator CLI app in Python in less than 30 lines of code.
* [Nodejs Discord Bot](https://repl.it/@GarethDwyer1/discord-bot-node?ref=quickstart) by [@GarethDwyer1](https://repl.it/@GarethDwyer1?ref=quickstart) – a simple discord bot written in Node.js.
* [Neural Network](https://repl.it/@shamdasani/Enlight-Neural-Network?ref=quickstart) by [@shamdasani](https://repl.it/@shamdasani?ref=quickstart) – a neural network written from scratch using Python.

## More from our Community

You can find tutorials created by members of our community [here](https://repl.it/talk/learn). There are tutorials for creating single player and multiplayer games, web apps, Discord bots, and AI programs. Be sure to give the post an upvote if you enjoyed it!

If you want to check out other cool repls that people have shared, you can find them on [Share](https://repl.it/talk/share).

If you have a question about programming or need help debugging something, be sure to post on [Ask](https://repl.it/talk/ask).  Someone will help you if they can!

## Moving Forward

Enjoy being a Repler! We would love to hear more from you about how you use Replit, how you found out about Replit, and if there's anything we can do to improve. Feel free to contact us through any of the following avenues:

* [Discord](https://discord.gg/346Tapr)
* [contact@replit.com](mailto:contact@replit.com)
* [Repl Talk Ask](https://repl.it/talk/ask)
* [Feedback](https://repl.it/feedback) / [Bug Reports](https://repl.it/bugs) / [Language Requests](https://repl.it/language-requests)
