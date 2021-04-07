# How to create a good enrichment coding assignment using Repl.it

The best way to learn to code is by coding. If you're teaching a programming class, you've no doubt noticed that there are some students who are champing at the bit, wanting to be challenged.

Setting extended homework, optional projects, or enrichment assignments is a great way to allow these students to do more without disadvantaging the ones who are battling to keep up with the standard syllabus.

But setting an appropriate project can be challenging for teachers. In this guide, we'll take a look at what makes a good enrichment homework assignment with some practical examples of how to set and grade these.

## What makes a great extended homework assignment?

A good enrichment assignment should be:
* **Motivating:** The student should be inspired to build something fun or useful. Multiple choice questions or work that closely matches the format of the normal homework is often not a good fit.
* **Practical:** The student should be able to use or play with what they've built, and show it off to friends and family.
* **Difficult to plagiarise:** Especially if there are bonus grades on offer, students shouldn't be able to easily copy from each other or from online code samples and submit it as their own work.

Finally, extended homework needs to find a delicate balance between between freedom and constraints. Students should have enough freedom to explore and learn related concepts on their own, while having some constraints so that you can fairly compare the work done by different students and to provide enough guidance as to not be overwhelming.

## Example topics that work well for enrichment assignments

It's more inspiring for students if they can build something that seems real. Therefore the following topic areas often work great for enrichment assignments:

* Game development
* Web application development 
* Data science and visualisation
* Command line interface tooling development

Different students are likely to find different topics more inspiring: some people just want to build games, while others will find 'serious' projects more interesting, so it's great to rotate through different topics.

## Example: Build a memory game with PyGame

An example of a simple game that is a great starting point for students who are interested in game development is the well-known memory game. In this game, we have a set of cards with two of each kind of color. The cards are placed face down and the player is allowed to turn over any two cards. If the cards match, the cards are removed. If not, the cards are turned face down again.

At the start, players turn over cards at random, trying to remember what cards they see and remembering where the matches are. 

This is a good project for beginners as it is fairly simple, not requiring moving objects or physics simulations, while also being very extensible. Ambitious students can add many features such as scoring, animations, automatic card flipping, or more combinations of shapes and colour combinations for the cards.

To set this project as a homework assignment, you should give the student enough code to get started that they can immediately interact with the program and see how the basics of PyGame works, but not so much starter code that they are overwhelmed and confused by how it works. Giving them around 50 lines of code to start is usually a good ballpark for something that is useful but can also be understood easily.

We've created an example starter Repl that you can fork (and adapt if necessary before giving to your students) [here](https://repl.it/@ritza/memory-game-starter-project). It demonstrates how to lay out the cards using random colours, and how to detect which card a user clicked on.

![](https://i.ritzastatic.com/712083f34fd24286b370091de159d07e/memory-starter.png)

## Example instructions for a student

Here's an example of how you could introduce your students to this project. These instructions are also in the [accompanying repl](https://repl.it/@ritza/memory-game-starter-project#instructions.md) in Markdown format so you can easily edit them as required and the student can easily read the formatted version.

<hr/>

### Enrichment assignment: PyGame

This week your enrichment task is to build a memory game in Python using PyGame. 

#### Game background
Your game consists of a set of cards which have different colours on the front but have the same backs. The player has to find matching pairs of cards by turning them over.

You start with 16 cards of 8 colors: 2 cards of each color.

Start the game by laying out the 16 cards in a 4x4 grid, all front side down.

Each turn, the player may turn over two cards. If the cards match (have the same color on the front), then the cards should be removed from the game. If not, the cards should be turned upside down again and the player can try again.

#### Starter code

The code in [`main.py`](https://repl.it/@ritza/memory-game-starter-project#main.py) includes a basic PyGame example which lays out the cards face up. When the player clicks on the cards, they are turned face down.

#### Instructions

The starter code shows you how to set up a basic GUI using PyGame and draw objects. It also hints at how you can interact with the user: it shows how you find out where the user clicked and modify the screen accordingly. However, it is missing most of the features of the game, which you still need to build. 

Specifically you need to:

* Start the game by laying the cards face down instead of face up.
* Keep track of which cards are which colour.
* Track how many cards the player has turned over (don't allow the player to turn over more than 2 cards at once).
* Implement logic to check if the player has chosen matching cards.
* Implement logic to remove these cards from the game (to simulate removal you can simply change the card color to white which is not used for the front or backs of the cards).

### Optional extra features

Feel free to implement any extra features that you think would be fun! Some ideas are:
* Automatically turn the cards back upside down after a given time period instead of making the player manually return the cards upside down
* Turn it into a multi player game and keep track of the score for each player (each match the player gets to 'keep' the removed cards and they are added to that player's score)
* Make the board size dyanmic: allow the player to choose to play on a bigger board (you'll need to add more colours for this or allow for multiple possible matches of each colour)
* Add gaps between the cards to make it easier to differentiate them when two cards of the same colour are next to each other.

Good luck!

<hr />


## What to look for in a solution

Apart from checking that the basic and optional features that your students have implemented work as expected, there are some othe things you can look out for to assign a grade and give feedback to your students.

### Plagiarism

It is likely that your students will be able to find similar projects online, so as always plagiarism is likely to be a problem. A good example of this game with all of the features implemented is at [InventWithPython's memory game](https://inventwithpython.com/pygame/chapter3.html) whic you can run on Repl.it from [this repl](https://repl.it/@ritza/memorypuzzle-iwp).

![](https://i.ritzastatic.com/06106c5cfa97444aa1f67f743b94a022/iwp-advancedsolution.png)

It should be easy to spot if your students borrowed too heavily from that example without understanding what they were doing, as it is significantly different from the starter code provided here. If you are concerned about plagiarism, copying a few 10-40 character snippets of your students' code into Google in double quotation marks usually brings up their source fairly quickly.

For example, the Google search shown below shows many sources that use exactly the same code:

![](https://i.ritzastatic.com/0ba14ad01e64430bb64137b89d21e9fd/plagiarism.png)
### Reusable code

Games like this one are a great example to introduce your students to the idea of DRY (don't repeat yourself) in software engineering. Because the entire screen has to be completely redrawn even when only one card is changed, it's likely that your students will be tempted to copy-paste the same code into different places (for example, to set up the board, and to update it after a click).

If your students have already learned to use small functions or Object Oriented Programming, make sure that they are following these good practices. Especially with a solution that relies on classes like `Board`, `Card`, `Player`, `Game`, etc, it can be quite tricky to decide what functionality belongs where. Should `Card` objects keep track of their own coordinates or is that the job of the `Board`? 

While there are many different ways to implement this solution, and in the end the 'best' solution might come down to personal taste, try to check that your students have thought about these issues (and hopefully left comments explaining their choices). 

### User Experience

Games are also a good way to introduce concepts from User Experience (UX) to your students. Did they provide instructions to the player on how to use the game, either in comments or in the game interface itself? Does the game start up and exit cleanly? Is it easy to configure any options that they exposed like number of cards?

## Finishing off

We went through an enrichment example using PyGame in this guide. PyGame is a great library for beginners as it gives them enough features to easily build advanced features (e.g. an easy way to draw a UI and track user events), but it is still low level enough for the student to have to understand fundamental concepts like the game loop and drawing objects based on pixel coordinates.

For more PyGame inspiration, take a look at our basic [Juggling Game](https://docs.repl.it/tutorials/07-building-a-game-with-pygame) which includes an example of how to animate objects too.

As we mentioned, data science and web application development are also good topics to set for enrichment homework. Take a look at our collection of [Python projects for beginners](https://www.codewithrepl.it/python-projects-for-beginners.html) for more ideas.

