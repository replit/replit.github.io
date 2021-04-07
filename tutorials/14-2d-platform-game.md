# Build a 2D Platform Game with PyGame and Repl.it

In a [previous tutorial](./07-building-a-game-with-pygame) we introduced graphical game development with PyGame, covering how to develop a 2D game with animated sprites and user interaction. In this tutorial, we'll go a step further and create a 2D platformer, where you can have an alien walk and jump around a room full of boxes. The previous PyGame tutorial is not a prerequisite for trying this one.

We're going to focus on basic animation and movement to create a solid base from which you can continue on to build an entire platform game, complete with enemies, power-ups and multiple levels.

## Getting Started

Create a new repl and select "PyGame" from the language dropdown.

![](/images/tutorials/14-2d-platform-game/14-01-new-pygame-repl.png)

You'll see "Python3 with PyGame" displayed in the default console and a separate pane in the Repl.it IDE where you will be able to see and interact with the game you will create.

Before we start writing code, we're going to need a few sprites, which we've made available [here](/tutorial-files/2d-platform-game/2d-platform-game-sprites.zip). Extract this ZIP file and add the files inside to your repl using the `upload file` function. You can select multiple files to upload at once. Your repl's file pane should now look like this:

<img src="/images/tutorials/14-2d-platform-game/14-02-repl-files.png" style="width:60%; height:60%">

In this tutorial, we will be gradually building up the `main.py` file, adding code in different parts of the file as we go along. Each code snippets will contain some existing code to give you an idea of where in the file the new additions should be placed. The line `# ...` will be used to represent existing code that has been left out for brevity.

### Setting up the scaffolding

We will start with the following code in `main.py`, which draws a black screen:

```python
import pygame

WIDTH = 400
HEIGHT = 300
BACKGROUND = (0, 0, 0)

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()

    while True:
        screen.fill(BACKGROUND)
        pygame.display.flip()

        clock.tick(60)

if __name__ == "__main__":
    main()
```

At the top of the file, we import `pygame`. Following that, we set the width and height of the screen in pixels, and the background color. This last value is an [RGB](https://www.google.com/search?q=rgb+color+picker) tuple, and will make our background black. To use a white background instead, we would write `(255, 255, 255)`.

Then, in the `main` method, we initiate PyGame, create both the screen and the clock, and start the **game loop**, which is this code:

```python
    while True:
        screen.fill(BACKGROUND)
        pygame.display.flip()

        clock.tick(60)
```

The game loop is where everything happens. Because our game runs in real time, our code needs to constantly poll for the user's keystrokes and mouse movements, and constantly redraw the screen in response to those keystrokes and mouse movements, and to other [events](https://www.pygame.org/docs/ref/event.html) in the game. We achieve this with an infinite while loop. PyGame uses the final `clock.tick(60)` line in this loop to adjust the game's framerate in line with how long each iteration of the loop takes, in order to keep the game running smoothly.

Now let's draw something on this black screen. Our game is going to have two sprites: an alien, which will be the player, and a box. To avoid code duplication, let's create a `Sprite` parent class before we create either of those. This class will inherit from the `pygame.sprite.Sprite` class, which gives us useful methods for collision detection – this will become important later on.

```python
class Sprite(pygame.sprite.Sprite):
    def __init__(self, image, startx, starty):
        super().__init__()

        self.image = pygame.image.load(image)
        self.rect = self.image.get_rect()

        self.rect.center = [startx, starty]

    def update(self):
        pass

    def draw(self, screen):
        screen.blit(self.image, self.rect)

def main():
```

As this class will be the parent for all other objects in our game, we're keeping it quite simple. It has three methods:

* `__init__`, which will create the sprite with a given image and a [PyGame rectangle](https://www.pygame.org/docs/ref/rect.html) based on that image. This rectangle will initially be placed at the position specified by `startx` and `starty`. The sprite's rectangle is what PyGame will use for sprite movement and collision detection.
* `update`, which we'll use in child classes to handle events, such as key presses, gravity and collisions.
* `draw`, which we use to draw the sprite. We do this by [blitting](https://en.wikipedia.org/wiki/Bit_blit) it onto the screen.

Now we can create our `Player` and `Box` objects as child classes of `Sprite`:

```python
class Sprite(pygame.sprite.Sprite):
    # ...
class Player(Sprite):
    def __init__(self, startx, starty):
        super().__init__("p1_front.png", startx, starty)

class Box(Sprite):
    def __init__(self, startx, starty):
        super().__init__("boxAlt.png", startx, starty)

def main():
```

We'll add more code to the player later, but first let's draw these sprites on the screen.

### Drawing the sprites

Let's go back to our `main` function and create our sprites. We'll start with the player:

```python
def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()

    player = Player(100, 200)
```

Then we need to put boxes under the player's feet. As we will be placing multiple sprites, we'll create a PyGame [sprite group](https://www.pygame.org/docs/ref/sprite.html#pygame.sprite.Group) to put them in.

```python
    player = Player(100, 200)

    boxes = pygame.sprite.Group()
```

Our box sprites are 70 pixels wide, and we need to span over the screen width of 400 pixels. We can do this in a `for` loop using Python's [`range`](https://docs.python.org/3/library/functions.html#func-range):

```python
    player = Player(100, 200)

    boxes = pygame.sprite.Group()
    for bx in range(0,400,70):
        boxes.add(Box(bx,300))

```

Now we need to go back to the game loop and add some code to make things happen. First, we'll have PyGame put new events on the event queue, and then we'll call the player's `update` function. This function will handle the [events](https://www.pygame.org/docs/ref/event.html) generated by `pygame.event.pump()`.

```python
    while True:
        pygame.event.pump()
        player.update()
        # ...
```

For a more complex game, we would want to loop through a number of sprites and call each one's `update` method, but for now just doing this with the player is sufficient. Our boxes won't have any dynamic behavior, so there's no need to call their `update` methods.

In contrast to `update`, we need all our sprites to draw themselves. After drawing the background, we'll add a call to the player's draw method. To draw the boxes, we can call  PyGame's [`Group.draw`](https://www.pygame.org/docs/ref/sprite.html#pygame.sprite.Group.draw) on our `boxes` group.

```python
    while True:
        pygame.event.pump()
        player.update()

        # Draw loop
        screen.fill(BACKGROUND)
        player.draw(screen)
        boxes.draw(screen)
        pygame.display.flip()

        clock.tick(60)
```

Our game loop is now set up to update and draw every sprite in the game in each cycle of the game loop. If you run the game now, you should see both the player and the line of boxes on the screen.

![](/images/tutorials/14-2d-platform-game/14-03-platform-game-1.png)

Next, we're going to add some user interaction.

## Making the Player Walk

Let's return to the `Player` object and make it mobile. We'll move the player using `pygame.Rect.move_ip`, which moves a given rectangle by a given vector. This will be wrapped in a `move` method, to simplify our code. Create this method now:

```python
class Player(Sprite):
    # ...
    def move(self, x, y):
        self.rect.move_ip([x,y])
```

Now that we have a way to move the player, it's time to add an `update` method so that this movement can be triggered by key presses. Add an empty `update` method now:

```python
class Player(Sprite):
    def __init__(self, startx, starty):
        super().__init__("p1_front.png", startx, starty)

    def update(self):
        pass

    def move(self, x, y):
        self.rect.move_ip([x,y])
```

PyGame provides a couple of different ways to check the state of the keyboard. By default, its event queue collects `KEY_DOWN` and `KEY_UP` events when particular keys are pressed and released. Using a `KEY_DOWN` event to move the player seems like the logical thing to do, but because the event is only triggered in same update loop in which the key is first pressed, this would force us to rapidly tap an arrow key to keep moving in a single direction.

We need a way to move the player whenever an arrow key is held down, not just after it's pressed. So instead of relying on events, we will query the current status of all keyboard keys with `pygame.key.get_pressed()`:

```python
    def update(self):
        # check keys
        key = pygame.key.get_pressed()
```

This method returns a tuple of 0s and 1s showing the pressed status of each key on the keyboard. We can thus detect whether the left or right arrow key is currently pressed by indexing the tuple with PyGame's [keyboard constants](https://www.pygame.org/docs/ref/key.html), like so:

```python
    def update(self):
        # check keys
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT]:
            self.move(-1,0)
        elif key[pygame.K_RIGHT]:
            self.move(1,0)
```

Run the game. You should now be able to move the player left and right, albeit very slowly. Let's speed things up and reduce our code's reliance on magic numbers at the same time by giving the player a `speed` variable.

```python
class Player(Sprite):
    def __init__(self, startx, starty):
        super().__init__("p1_front.png", startx, starty)

        self.speed = 4

    def update(self):
        # check keys
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT]:
            self.move(-self.speed,0)
        elif key[pygame.K_RIGHT]:
            self.move(self.speed,0)
```

Right now the player glides from side to side, but we have already uploaded images for a [walk cycle](https://en.wikipedia.org/wiki/Walk_cycle) animation, so let's implement that now. First, we'll add some image loading code to our player's `__init__` method:

```python
    def __init__(self, startx, starty):
        super().__init__("p1_front.png", startx, starty)
        self.stand_image = self.image

        self.walk_cycle = [pygame.image.load(f"p1_walk{i:0>2}.png") for i in range(1,12)]
        self.animation_index = 0
        self.facing_left = False

        self.speed = 4
```

In this code, we first designate our initial alien image as `stand_image`. This will allow us to use it for the player when he's standing still. We then load our walking images into a list called `walk_cycle`, using Python's [string formatting](https://docs.python.org/3/library/string.html#string-formatting) to get the correct filename format (`p1_walk01.png` -> `p1_walk11.png`). We then create `self.animation_index`, which will record which frame of the walk cycle the player is on, and `self.facing_left` which will help us to flip the right-facing walking images when the player is walking left.

Now let's implement the actual animation. Create a new method called `walk_animation`:

```python
class Player(Sprite):
    # ...
    def walk_animation(self):
        self.image = self.walk_cycle[self.animation_index]
        if self.facing_left:
            self.image = pygame.transform.flip(self.image, True, False)

        if self.animation_index < len(self.walk_cycle)-1:
            self.animation_index += 1
        else:
            self.animation_index = 0
```

Here we're setting the player's current image to the frame of the walk cycle we're currently on. If the player is facing left, we use `pygame.transform.flip` to horizontally flip his sprite (the last two arguments are for horizontal and vertical flipping, respectively). Then we animate the player by incrementing the `animation_index`, unless the animation is in its penultimate frame, in which case we return to the start of the animation. 

Let's add this to our `update` method now:

```python
    def update(self):
        # ...
        # check keys
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT]:
            self.facing_left = True
            self.walk_animation()
            self.move(-self.speed,0)
        elif key[pygame.K_RIGHT]:
            self.facing_left = False
            self.walk_animation()
            self.move(self.speed,0)
        else:
            self.image = self.stand_image
```

If we're moving left or right, we set `self.facing_left` appropriately and call `self.walk_animation`. Otherwise, we set the player's image to `self.stand_image`.

Run the game now to see the player's walk cycle in motion. After that, it's time to make him jump.

## Making the Player Jump

For our player to be able to jump, we need to implement four things:

1. Upward motion triggered by the up arrow key.
2. Gravity, to bring the player back down after reaching the top of his jump.
3. Collision detection, so the player doesn't fall through the ground.
4. A jumping animation.

### Triggering the jump

To simply make the player move up, we can just add another `elif`, like so:

```python
    def update(self):
        # ...
        if key[pygame.K_LEFT]:
            self.facing_left = True
            self.walk_animation()
            self.move(-self.speed,0)
        elif key[pygame.K_RIGHT]:
            self.facing_left = False
            self.walk_animation()
            self.move(self.speed,0)
        elif key[pygame.K_UP]:
            self.move(0,-self.speed)
        else:
            self.image = self.stand_image
```

If you try the game now, you should notice a couple of problems with this approach. Besides the lack of gravity, we can only jump straight up, and must release the left and right arrow keys before we may do so. Much of the gameplay in platformers is reliant on the player's ability to jump to the left or right, so this won't do. To fix this, we'll change our last `elif` to a separate `if` statement:

```python
        if key[pygame.K_LEFT]:
            self.facing_left = True
            self.walk_animation()
            self.move(-self.speed,0)
        elif key[pygame.K_RIGHT]:
            self.facing_left = False
            self.walk_animation()
            self.move(self.speed,0)
        else:
            self.image = self.stand_image

        if key[pygame.K_UP]:
            self.move(0,-self.speed)
```

We also probably want to be able to jump at a different speed to our walking pace, so let's define another variable and use it.

```python
    def __init__(self, startx, starty):
        # ...
        self.speed = 4
        self.jumpspeed = 20

    def update(self):
        # ...
        if key[pygame.K_UP]:
            self.move(0,-self.jumpspeed)
```

That's better, but now we really need some gravity!

### Adding gravity

Up until now, we've had only a single operation manipulating our horizontal or vertical speed per update loop. With the addition of gravity, this will change, so we need to restructure our code to calculate our net horizontal and vertical movement before calling `move`. Let's change the `update` function like so:

```python
    def update(self):
        hsp = 0 # horizontal speed
        vsp = 0 # vertical speed

        # check keys
        key = pygame.key.get_pressed()
        if key[pygame.K_LEFT]:
            self.facing_left = True
            self.walk_animation()
            hsp = -self.speed
        elif key[pygame.K_RIGHT]:
            self.facing_left = False
            self.walk_animation()
            hsp = self.speed
        else:
            self.image = self.stand_image

        if key[pygame.K_UP]:
            vsp = -self.jumpspeed

        # movement
        self.move(hsp,vsp)
```

We've added two variables, `hsp` and `vsp`, to represent our horizontal speed and vertical speed. Instead of calling `move` when each key is pressed, we work with these variables throughout the `update` method and then pass their final values into a single `move` call at the end.

But wait! It makes sense for horizontal speed to be set to 0 at the start of every update loop, because it is directly controlled by the player's key presses. When the left arrow is held down, the player moves left at a speed of 4 pixels per loop; when the left arrow is released, the player instantly stops. Vertical speed will be less controllable – while pressing the up arrow will initiate a jump, releasing it should not stop the player in mid-air. Therefore, vertical speed must persist between loops.

We can accomplish this by moving the `vsp` definition into `__init__` and making it an instance variable.

```python
    def __init__(self, startx, starty)
        # ...
        self.vsp = 0 # vertical speed

    def update(self):
        hsp = 0 # horizontal speed
        # ...
        if key[pygame.K_UP]:
            self.vsp = -self.jumpspeed

        # movement
        self.move(hsp,self.vsp)
```

Now we can implement gravity. We'll do this by adding a small constant to the player's vertical speed (`vsp`) until it reaches [terminal velocity](https://en.wikipedia.org/wiki/Terminal_velocity).

```python

    def __init__(self, startx, starty)
        # ...
        self.gravity = 1

    def update(self):
        # ...
        if key[pygame.K_UP]:
            self.vsp = -self.jumpspeed

        # gravity
        if self.vsp < 10: # 9.8 rounded up
            self.vsp += self.gravity

        # movement
        self.move(hsp,self.vsp)
```

Start up the game now, and the player will fall straight down, through the ground and off the screen. Gravity's working, but we need somewhere for the player to land.

### Adding collision detection

Collision detection is a key element of most graphical games. In PyGame, the bulk of collision detection involves checking whether rectangles intersect with each other. Luckily, PyGame provides a number of useful built-ins for doing this, so we won't have to think too much about the internal workings of collisions.

Let's add some collision detection now, near the top of our `update` method. We'll create a variable called `onground` and set it to the result of `pygame.sprite.spritecollideany()`.

```python
    def update(self):
        hsp = 0 # horizontal speed
        onground = pygame.sprite.spritecollideany(self, boxes)
```

This PyGame method takes two arguments: a single sprite and a group of sprites. It returns whether the sprite given as the first argument, i.e. the player, has a collision with any of the sprites in the group given as the second argument, i.e. the boxes. So we'll know that the player is on a box when it returns `True`.

We can pass the `boxes` group into the player's `update` method by making a couple of code changes:

```python
    def update(self, boxes):
        hsp = 0 # horizontal speed
        onground = pygame.sprite.spritecollideany(self, boxes)
        # ...
        
def main():
    # ...
    while True:
        pygame.event.pump()
        player.update(boxes)
```

Now that we can tell whether the player is on the ground, we can prevent jumping in mid-air by adding a condition to our jump code:

```python
    def update(self, boxes):
        # ...
        if key[pygame.K_UP] and onground:
            self.vsp = -self.jumpspeed
```

To stop the player from falling through the ground, we'll add the following code to our gravity implementation:

```python
    def update(self, boxes):
        # ...
        # gravity
        if self.vsp < 10 and not onground: # 9.8: rounded up
            self.vsp += self.gravity

        # stop falling when the ground is reached
        if self.vsp > 0 and onground:
            self.vsp = 0
```

### Adding a jumping animation

Lastly, we'll use our last alien image (`p1_jump.png`) to give our player a jumping animation. First create `self.jump_image` in `__init__`:

```python
    def __init__(self, startx, starty):
        super().__init__("p1_front.png", startx, starty)
        self.stand_image = self.image
        self.jump_image = pygame.image.load("p1_jump.png")
        # ...
```

Then create the following `Player` method:

```python
    def jump_animation(self):
        self.image = self.jump_image
        if self.facing_left:
            self.image = pygame.transform.flip(self.image, True, False)
```

Our jump animation only has one frame, so the code is much simpler than what we used for our walking animation. To trigger this method when the player is in the air, alter the gravity implementation like so:

```python
    def update(self, boxes):
        # ...
        # gravity
        if self.vsp < 10 and not onground: # 9.8 rounded up
            self.jump_animation()
            self.vsp += self.gravity
```

Run the game, and you should be able to run and jump! Be careful not to fall off the edge.

## Refining the Game

At this point, we have our game working on a basic level, but it could use some refinements. First, the jumping is quite unresponsive to user input: pressing the up arrow for any length of time results in the same size jump. Second, our collision detection will only prevent the player from falling through the floor, not walking through walls or jumping through the ceiling.

We're going to iterate on our code to fix both of these shortcomings.

### Making jumps variable

It would be nice if the player could control the height of their jump by holding the jump key down for different lengths of time. This is fairly simple to implement – we just need a way to reduce the speed of a jump if the player releases the jump key while the player is still moving up. Add the following code to the player's `__init__` method.

```python
class Player(Sprite):
    def __init__(self, startx, starty):
        # ...
        self.min_jumpspeed = 3
        self.prev_key = pygame.key.get_pressed()
```

Here we've added a `prev_key` instance variable that will track the state of the keyboard in the previous update loop, and a `min_jumpspeed` variable, which will be the smallest jump we'll allow the player to do, by just tapping the jump key.

Now let's add variable jumping to the `update` method, between the code that handles the up arrow key and the code that handles gravity:

```python
    def update(self, boxes)
        # ...
        if key[pygame.K_UP] and onground:
            self.vsp = -self.jumpspeed

        # variable height jumping
        if self.prev_key[pygame.K_UP] and not key[pygame.K_UP]:
            if self.vsp < -self.min_jumpspeed:
                self.vsp = -self.min_jumpspeed

        self.prev_key = key

        # gravity
        if self.vsp < 10: # 9.8 rounded up
            self.vsp += self.gravity
```

The `if` statement we've just added will evaluate to `True` if the up arrow key was pressed in the previous loop but is not longer pressed, i.e. it has been released. When that happens, we cut off the player's jump by reducing its speed to the `min_jumpspeed`. We then set `self.prev_key` to the current keyboard state in preparation for the next loop.

Try the game now, and you should notice a different height of jump when lightly tap the up arrow key versus when you hold it down. Play around with the value of `min_jumpspeed` and see what difference it makes.

### Refining collision detection 

As mentioned above, the only collision detection we've implemented applies to the ground beneath the player's feet, so he will be able to walk through walls and jump through ceilings. See this for yourself by adding some boxes above and next to the player in the `main` method.

```python
def main():
    # ...
    boxes = pygame.sprite.group()
    for bx in range(0,400,70):
        boxes.add(Box(bx,300))

    boxes.add(Box(330,230))
    boxes.add(Box(100,70))
```

![](/images/tutorials/14-2d-platform-game/14-04-platform-game-2.png)

Another issue that you may have already noticed is that the player sinks into the ground after some jumps – this results from the imprecision of our collision detection.

We're going to fix these problems by making a subtle change to how we deal with collisions with boxes. Rather than deciding that we're on the ground when the player sprite is in collision with a box, we'll check whether the player is 1 pixel above a collision with a box. We'll then apply the same principle for left, right and up, stopping the player just before a collision.

First, let's give the player a `check_collision` method to make these checks:

```python
class Player(Sprite):
    # ...
    def check_collision(self, x, y, boxes):
        self.rect.move_ip([x,y])
        collide = pygame.sprite.spritecollideany(self, boxes)
        self.rect.move_ip([-x,-y])
        return collide
```

Here, we're moving the player by a specified amount, checking for a collision, and then moving the player back. This back and forth movement happens before the player is drawn to the screen, so the user won't notice anything.

Let's change our `onground` check to use this method:

```python
    def update(self, boxes):
        hsp = 0 
        onground = self.check_collision(0, 1, boxes)
```

Run the game now, and you may be able to notice a very slight difference in how the player stands on the ground from before.

This doesn't yet solve our horizontal and upward collisions problems, though. For that, we'll need to implement our new `check_collision` method directly into the player's `move` method. The first thing we'll need to do is prepare the `x` and `y` parameters for additional processing:

```python
    def move(self, x, y):
        dx = x
        dy = y
        self.rect.move_ip([dx,dy])
```

Then we're going to check for collisions, so we need to start passing `boxes` into `move`. We're going to do this for `x` and `y` separately, starting with `y`. We'll check for a collision after moving `dy` pixels vertically, decrementing `dy` until we no longer collide with a box:

```python
    def update(self, boxes):
        # ...
        # movement
        self.move(hsp, self.vsp, boxes)

    def move(self, x, y, boxes):
        dx = x
        dy = y

        while self.check_collision(0, dy, boxes):
            dy -= 1

        self.rect.move_ip([dx,dy])
```

But wait! This code will only work as intended if we're moving down and `dy` is positive. If `dy` is negative, this will just move us further into a collision, not away from it. To fix this, we'll need to import `numpy` at the top of our file, so we can use `numpy.sign`.

```python
import pygame, numpy
# ...
```

`numpy.sign` takes an integer and returns 1 if it's positive, -1 if it's negative, and 0 if it's 0. This is exactly the functionality we need!

```python
    def move(self, x, y, boxes):
        dx = x
        dy = y

        while self.check_collision(0, dy, boxes):
            dy -= numpy.sign(dy)

        self.rect.move_ip([dx,dy])
```

Now do the same for `dx`. As we've already figured out the appropriate `dy` for our movement, we'll include that in the collision check.

```python
    def move(self, x, y, boxes):
        dx = x
        dy = y

        while self.check_collision(0, dy, boxes):
            dy -= numpy.sign(dy)

        while self.check_collision(dx, dy, boxes):
            dx -= numpy.sign(dx)

        self.rect.move_ip([dx,dy])
```

Run the game. The player should now stop when he runs into a wall or jumps into a ceiling.
	
![](/images/tutorials/14-2d-platform-game/14-05-platform-game-final.png)

## Where Next?

If you'd like to continue working on this game, you can find a large number of matching art assets [here](https://www.kenney.nl/assets/platformer-art-pixel-redux). Try implementing some of these features:

* More jump refinements, such as [jump grace time and input buffering](https://www.gamasutra.com/blogs/LisaBrown/20171005/307063/GameMaker_Platformer_Jumping_Tips.php).
* Moving platforms.
* Slopes.
* Water and swimming mechanics.
* Hazards like spike pits and enemies who are also subject to gravity.
* [Double jumping](https://en.wikipedia.org/wiki/Glossary_of_video_game_terms#Double_jump).

You can find our game repl below:

<iframe height="800px" width="100%" src="https://repl.it/@ritza/2D-platform-game?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
