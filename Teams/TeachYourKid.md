# Teaching your kid to code with Repl.it

If you're a parent who wants to teach your child how to code from scratch, this guide is for you. We've put together some examples that are easy to get started with, don't require any setup, and are fun from the start.

<hr>

**A note on privacy:** Especially if your child is young, you're probably worried about privacy and data protection. In many countries, storing and processing personal data of minors is treated differently. In the USA, there are regulations concerning anyone under the age of 13. You can use our Teams for Education package from [repl.it teams](https://repl.it/teams) which includes an anonymous invite feature. This allows you to invite your child to create a fully anonymous account. You can find more information on invitations and the privacy invite links [here](https://docs.repl.it/Teams/Invitations).
<hr>

## The benefits of teaching children to code

Although coding is generally only introduced in secondary school, there is nothing stopping younger children from learning. Like learning a new language, or studying maths, learning to code provides not only useful skills but also a great way to stimulate and develop the brain in general.

So-called "visual languages" like [Scratch](https://scratch.mit.edu/) are developed specifically to teach children the concepts of coding without their having to memorize syntax. However, these are usually pretty limited and can be frustrating to work with, so we recommend teaching 'real' coding from the start.

Start with showing them how coding can be **fun** and how they can **create** things using it. While it's definitely beneficial for children to be exposed to concepts like logic, data types and algorithms, the primary focus should be on how enjoyable coding can be. 

## Getting started

In this guide, we'll show some basic examples focused on graphical programming. We'll show you how to use different libraries for basic game development, including standard libraries and some custom Repl.it ones. We'll look at examples using:

* Python Turtle
* PyGame
* Python Play
* Basic

It's likely that you'll introduce your child to just one or two of these to start, but each has different strengths. Python Turtle is the easiest to get started with, but is fairly limited. PyGame is too complicated for complete beginners, but you can build far more sophisticated games. 

We built Python Play on top of PyGame as a compromise in the simplicity/power tradeoff. Basic borrows syntax from older programming paradigms: using things like `GOTO` is rare in modern programming languages, but it can make it easier for beginners to understand what's happening "under the hood" in terms of program flow, compared to more modern constructions like function definitions.

Each of the examples is a starting point for you and your child to play with and develop your own unique extensions.

If you do not have a Repl.it Teams account yet, read this [introduction to Teams](https://docs.repl.it/Teams/Intro) and sign up. The free account will be sufficient to follow along, but you may choose a premium option for more powerful repls and heightened privacy.

## Drawing with Python Turtle

We'll start with Python Turtle, as it is uses high-level commands like `forward()` to move a turtle character around the screen. This makes it really easy for your child to understand the basics of how it works and modify it to move the turtle differently or draw different shapes.

We are going to build a simple turtle game with two characters. One (controlled by you) will draw a maze and the other (controlled by your child's code) will attempt to navigate through it.

![](/images/teamsForEducation/teach-your-kid/turtle-example.gif)

You can draw the maze and explain to your child how you did it and ask them to write the code to allow their turtle to navigate through it.

The idea is that you (the parent) draw the maze showing the kid how you do it and then allow them to look at your code and write code that will make their turtle navigate the maze and "escape".

Create a new Python repl or [fork ours](https://repl.it/@ritza/coding-for-kids-turtle#main.py) and start by adding the following code to the `main.py` file.

```python
import turtle

parent = turtle.Turtle()
kid = turtle.Turtle()

kid.shape('turtle')
```

The above code imports the Turtle library, defines two turtles, one for the parent and one for the kid. The last line changes the shape of your kid's turtle to represent a turtle.

Now write the code that makes the parent turtle draw a maze - in this example we draw a simple line with a gap. We'll start out with a very simple maze but you can use your creativity to draw more difficult ones once your child has learned the basics.

Add the code below to the same file.

```python
parent.up()
parent.setx(100)
parent.sety(200)
parent.down()

parent.color('red')

parent.right(90)
parent.forward(300)
parent.up()
parent.forward(50)
parent.down()
parent.forward(50)
```

The first block of code lifts the pen and moves it to the (x,y) coordinates (100,200) then puts the pen down again. (By default, the pens will draw as they move so this moves to a new starting location without making a line.)

The second block changes the parent turtle to draw with red ink. 

The last block of code changes direction (90 degrees to the right) and draws a line (down, as that's the way the turtle is now facing) that is 300 pixels long. Then it lifts the pen and moves another 50 pixels to create a gap, and finally lowers the pen to complete the line.

You can explain to your child how this code works line by line so that they can try it with their turtle next.

Now your child can take the driver's seat and you can help them as much or as little as needed to write code similar to the following (directly below your existing code).

```python
kid.right(90)
kid.forward(120)
kid.left(90)
kid.forward(200)
```

With the above code the black turtle will turn right (facing down), move to the same level as the gap in the red line, turn left and move forward through the gap.

If your child likes solving these mazes and you get tired of creating them, you can use Python's `random` module to help with drawing random mazes.

## Building interactive games with Python Play

[Python Play](https://github.com/replit/play) is an abstraction layer built on top of PyGame that makes it easy to build a more advanced game than with Turtle, but without needing to understand all of the concepts required for PyGame.

If you want something almost as simple as Turtle, but with more advanced options, like easy handling of input through your mouse or keyboard, this is a good option to introduce before something more advanced such as PyGame.

![](/images/teamsForEducation/teach-your-kid/python-play-example.gif)

Fork [this repl](https://repl.it/@ritza/coding-for-kids-python-play) which is a simple game that shows how to process mouse input. 

The cat moves randomly around the screen, and the player has to click on the cat within 15 flashes to win.

You could show your child how to:

#### Change the characters that make up the cat

By modifying the line 
```python
cat = play.new_text('=^.^=', font_size=70)
```

#### Make the game easier or harder

Especially if you are using a computer with a trackpad or otherwise find that your mouse is not sensitive enough, you can make the game easier in a few different ways:

By modifying the number of seconds the cat is shown for in the following code.

```python
cat.show()
cats_shown += 1
await play.timer(seconds=0.6)
```

Or by increasing/decreasing the number of flashes allowed before the game ends by modifying the following code.

```python
if cats_shown >= 15:
    cat.words = 'Game over!'
```

Or by making the font size larger in the initial definition of the cat.

#### Build an entirely new game

Once you're both comfortable with the Python Play syntax that makes up this game, take a look at all the building blocks available in [the documentation](https://github.com/replit/play) and build something fun!

## Building more advanced games with PyGame

PyGame is more complicated than Python Play, but it also has a larger community and many [pre-built examples](https://www.pygame.org/docs/ref/examples.html) that you can use as a starting point.

It's likely that your child will benefit from starting out with some easier libraries and moving up to Python Play over time. But if you want to jump in the deep end, we also have a [detailed tutorial](https://docs.repl.it/tutorials/07-building-a-game-with-pygame) on how to build a juggling game in PyGame.

## Drawing on a blank canvas with Basic

Programming used to look pretty different. Older languages like BASIC relied heavily on `GOTO` statements and other constructs that are rarely seen in more modern languages.

However, these constructs are also "closer to the metal" and they can help beginners understand how things like program flow actually work under the hood.

[Classic Basic on Repl.it](https://docs.repl.it/misc/basic) combines the syntax of BASIC with some more modern features for the best of both worlds.

At its simplest, it can be used like Microsoft Paint: to draw pixel by pixel on a canvas, but using code instead of your mouse.

![](/images/teamsForEducation/teach-your-kid/basic-example.png)

Here's a starter example showing how to draw a dog pixel by pixel and then add a line using a `for` loop.

Fork this [repl](https://repl.it/@ritza/coding-for-kids-basic) so that you and your child can draw together using code.

Basic is definitely not limited to only drawing static pictures. For more inspiration, take a look at this repl of a [full snake game](https://repl.it/@ritza/BASIC-Kids-SnakeGame#program.bas).

## Where next?

Once your child understands the basics of programming they can move on to work through [our tutorials](https://docs.repl.it/tutorials/00-overview). 

While games are often a good way to get children hooked on programming, many children also prefer building non-game programs. See whether they are most interested in games, web application development or even something like data visualisation and then double down on finding more examples that match their interests.

It is also a good time to introduce kids to 'computational thinking'. [CS Unplugged](https://csunplugged.org/en/) is  a good resource for teaching beginners the foundations of computer science without a computer.
