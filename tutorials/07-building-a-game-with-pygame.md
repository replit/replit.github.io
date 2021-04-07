# Building a game with PyGame and Repl.it

![](/images/tutorials/07-pygame/07-01-heading.png)

So far, we've mainly seen how to write text-based programs, or those with a basic web front end. In this tutorial, we'll instead build a 2D game using PyGame. You'll use animated sprites and learn how to:

* Make these sprites move 
* Recognise when a sprite is clicked with the mouse.

The basic premise of the game is as follows. You're a juggler, learning to juggle. Balls will fall down from the top of the screen, and you'll need to click them to 'throw' them up again. After several successful throws without dropping any balls, more balls will be added to make the game harder.

## Creating a PyGame repl

Although [PyGame](https://en.wikipedia.org/wiki/Pygame) is a standard Python library, Repl.it provides it installed as a separate language. Create a new repl and select PyGame from the language dropdown.

![**Image 2:** *Choosing PyGame from the `Create New Repl` screen.*](/images/tutorials/07-pygame/07-02-new-pygame-repl.png)

You'll see "Python3 with PyGame" displayed in the default console and a separate pane in the Repl.it IDE where you will be able to see and interact with the game you will create.

The first thing we need is a so-called "sprite", which is a basic image file that we will use in our game. Download the tennis ball file available [here](https://raw.githubusercontent.com/ritza-co/public-images/master/small_tennis.png) and save it to your local machine.

Now upload it to your repl using the `upload file` button and you should be able to see a preview of the image by clicking on it in the files pane.

![**Image 3:** *Viewing our sprite after uploading it.*](/images/tutorials/07-pygame/07-03-upload-png-sprite.png)

## Displaying the sprite using PyGame

Our first goal is to display the tennis ball in a game environment using PyGame. To do this, go back to the `main.py` file and add the following code.

```python
import pygame

WIDTH = 800
HEIGHT = 600
BACKGROUND = (0, 0, 0)

class Ball:
    def __init__(self):
        self.image = pygame.image.load("small_tennis.png")
        self.rect = self.image.get_rect()

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    ball = Ball()

    while True:
        screen.fill(BACKGROUND)
        screen.blit(ball.image, ball.rect)
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
```

This code looks a bit more complicated than it needs to be because in addition to drawing the ball to the screen, it also sets up a game loop. While basic 2D games appear to move objects around the screen, they usually actually simulate this effect by redrawing the entire screen many times per second. To account for this we need to run our logic in a `while True:` loop. 

We start by importing PyGame and setting up some global variables: the size of our screen and the background color (black). We then define our `Ball`, setting up an object that knows where to find the image for the ball and how to get the default coordinates of where the image should be drawn.

We then set up PyGame by calling `init()` and starting the screen as well as a clock. The clock is necessary because each loop might take a different amount of time, based on how much logic needs to run to calculate the new screen. PyGame has built-in logic to calculate how much time elapses between calls to `clock.tick()` to draw frames faster or slower as necessary to keep the game experience smooth.

We start the game loop and call `blit` on our ball. [Blitting](https://en.wikipedia.org/wiki/Bit_blit) refers to moving all of the pixels from our sprite file (the tennis ball) to our game environment. The `flip()` function updates our screen and the `tick(60)` call means that our game will redraw the screen around 60 times per second.

If you run this code, you should see the ball pop up in the top right pane, as shown below.

![**Image 4:** *Drawing the tennis ball in our PyGame environment.*](/images/tutorials/07-pygame/07-04-insert-run-ball.png)

## Making our tennis ball move with each frame

Although PyGame has a lot of built-in logic for handling common game operations, you still need to get your hands dirty with calculating some of the basic movements. For every loop, we need to tell our game the new X and Y coordinates to draw the ball. As we want our ball to move at a constant speed, we'll move the X and Y coordinates each loop.

Add two methods to your `Ball` class: `update` and `move`, and add a speed attribute. The new code for your `Ball` class should look as follows.

```python
class Ball:
    def __init__(self):
        self.image = pygame.image.load("small_tennis.png")
        self.speed = [0, 1]
        self.rect = self.image.get_rect()

    def update(self):
        self.move()

    def move(self):
        self.rect = self.rect.move(self.speed)
```

Now modify your game loop to include a call to the new `update()` method. The loop should look as follows.

```python
    while True:
        screen.fill(BACKGROUND)
        screen.blit(ball.image, ball.rect)
        ball.update()
        pygame.display.flip()
        clock.tick(60)
```

The `(0, 1)` tuple causes the ball to move its Y coordinate by 1 each loop and keep a constant X coordinate. This has the effect of making the ball drop slowly down the screen. Run your code again to check that this works.

![**Image 5:** *The ball falling at a constant rate.*](/images/tutorials/07-pygame/07-05-GIF-falling-ball.gif)

When the ball gets to the bottom of the screen, it'll just keep falling but that's OK for now. Let's see how we can add click detection.

## Processing events: Detecting mouse clicks

PyGame records all "events", including mouse clicks, and makes these available through `pygame.event.get:()`. We need to check what events happened in each game loop and see if any of them were important. 

If the user clicks on an empty space, that will still be recorded but we will simply ignore it. If the user clicks on a falling ball, we want it to change direction.

Right after the `while True` loop, add the following lines of code.

```python
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                if ball.rect.collidepoint(pygame.mouse.get_pos()):
                    ball.speed = [0,-1]
```

With this code, we loop through all events and check for left click (`MOUSEBUTTONDOWN`) events. If we find one, we check if the click happened on top of the ball (using `collidepoint()` which checks for overlapping coordinates), and in this case we reverse the direction of the ball (still no x-axis or horizontal movement, but we make the ball move negatively on the y-axis, which is up.)

If you run this code again, you should now be able to click on the ball (let it fall for a while first) and see it change direction until it goes off the top of the screen.

## Making the ball bounce off the edges and move randomly

To simulate juggling, we want the ball to bounce of the "roof" (top edge of the screen) and "walls" (left and right edge). If the ball touches the "floor" (bottom edge) we want to kill it and remove it from the game as a dropped ball. 

To achieve this, we'll add logic to our `update()` method (this is why we kept it separate from our `move()` method before). Add two lines of code to `update()` to make it look as follows. 

```python
    def update(self):
        if self.rect.top < 0:
            self.speed = [0, 1]
        self.move()
```

This checks to see if the top of the ball is above the top of the screen. If it is, we set the speed back to `(0, 1)` (moving down).

![**Image 6:** *Now we can bounce the ball off the ceiling.*](/images/tutorials/07-pygame/07-06-GIF-bounce-off-roof.gif)

So far, we have restricted the ball to moving vertically, but we can apply the same principles and move it horizontally or diagonally too. Let's also add some randomness into the mix so that it's less predictable (and harder for the player to press). The ball will randomly change its horizontal movement when it bounces off the ceiling and each time we throw it.

Import the `random` module at the top of your file and use the `random.randrange()` function to specify the range of acceptable horizontal movement. Also modify the `update()` function to detect if the ball is falling off the left or right edges and reverse its horizontal movement in this case.

Finally, modify the collision detection section to add randomness there too. 

Your full code should now look as follows.

```python
import pygame
import random

WIDTH = 800
HEIGHT = 600
BACKGROUND = (0, 0, 0)

class Ball:
    def __init__(self):
        self.image = pygame.image.load("small_tennis.png")
        self.speed = [random.uniform(-4,4), 2]
        self.rect = self.image.get_rect()

    def update(self):
        if self.rect.top < 0:
            self.speed[1] = -self.speed[1]
            self.speed[0] = random.uniform(-4, 4)
        elif self.rect.left < 0 or self.rect.right > WIDTH:
            self.speed[0] = -self.speed[0]
        self.move()

    def move(self):
        self.rect = self.rect.move(self.speed)

def main():
    clock = pygame.time.Clock()
    ball = Ball()
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))

    while True:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                if ball.rect.collidepoint(pygame.mouse.get_pos()):
                    ball.speed[0] = random.uniform(-4, 4)
                    ball.speed[1] = -2
        screen.fill(BACKGROUND)
        screen.blit(ball.image, ball.rect)
        ball.update()
        pygame.display.flip()
        clock.tick(60)

if __name__ == "__main__":
    main()
```

If you run your code again, you should be able to juggle the ball around by clicking on it and watch it randomly bounce off the ceiling and walls.

## Adding more balls

Juggling with one ball is no fun, so let's add some more. Because we used Object Oriented Programming (OOP), we can create more balls by instantiating more `Ball()` objects. We'll need to keep track of these so we'll add them to an array. For each iteration of the game loop, we'll need to update the position of each ball, so we'll need one more loop to account for this.

We also want to start keeping track of which of our balls is "alive" (that is, hasn't hit the ground), so add an attribute for this to the `Ball` class too, in the `__init__` function.

```python
        self.alive = True
```

In the `main()` function, directly before the `while True:` line, add the following code.

```python
    ball1 = Ball()
    ball2 = Ball()
    ball3 = Ball()

    balls = [ball1, ball2, ball3]
```

Now remove the `ball=Ball()`, `ball.update()` and `screen.blit(...)` lines and replace them with a loop that updates all of the balls and removes the dead ones (even though we haven't written the logic yet to stop the balls from ever being alive.)

```python
        for i, ball in enumerate(balls):
            if ball.alive:
                screen.blit(ball.image, ball.rect)
                ball.update()
                if not ball.alive:
                    del balls[i]
```

You'll also need to account for multiple balls in the the event detection loop. For each event, loop through all of the balls and check if the mouse click collided with any of them.

At this point, the full `main()` function should look as follows.

```python
def main():
    clock = pygame.time.Clock()
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))

    ball1 = Ball()
    ball2 = Ball()
    ball3 = Ball()

    balls = [ball1, ball2, ball3]

    while True:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                for ball in balls:
                    if ball.rect.collidepoint(pygame.mouse.get_pos()):
                        ball.speed[0] = random.randrange(-4, 4)
                        ball.speed[1] = -2
                        break
        screen.fill(BACKGROUND)
        for i, ball in enumerate(balls):
            if ball.alive:
                screen.blit(ball.image, ball.rect)
                ball.update()
                if not ball.alive:
                    del balls[i]
        pygame.display.flip()
        clock.tick(60)
```

To kill balls when they fall through the floor, we can add another check to the `update()` function as follows.

```python
        elif self.rect.bottom > HEIGHT:
            self.alive = False
```

Run the code again and you should be able to juggle three balls. See how long you can keep them in the air.

![**Image 7:** *Juggling three balls.*](/images/tutorials/07-pygame/07-07-GIF-three-balls.gif)

If you want a harder version, add a counter to keep track of how many successful throws the player has achieved and add a new ball for every three successful throws.

![**Image 8:** *Adding more balls.*](/images/tutorials/07-pygame/07-08-multiple-balls.png)

Now the game is to see how many balls you can juggle with. If it's too easy, modify the speeds and angles of the balls. 

## Make it your own

If you followed along, you'll already have your own version of the repl to extend. If not, start from ours. Fork it from the embed below.

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/cwr-07-juggling-with-pygame?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Where next?

You've learned how to make 2D games using PyGame. If you want to make more games but are stuck for ideas, check out [PyGame's extensive collection of examples](https://www.pygame.org/docs/ref/examples.html). 

You could also extend the juggling game more. For example, make the balls accelerate as they fall, or increase the speed of all balls over time.
