## Classic Basic on Repl.it (in beta)

- Simple syntax based on Classic Basic
- A 50x50 pixel display for graphics and games
- A console for input/output

[Start here](https://repl.it/languages/basic).

![basic environment](/images/basic.png)

## Syntax

Every line starts with a command. 
Every line starts with a line number followed by a command.

```
PRINT "Hello world"
```

Line numbers are optional and allow us to do control flow like subroutines and goto statements (more on this later). 

```
10 PRINT "hello"
GOTO 10
```

Each basic command has its own syntax. 

### Commands

#### REM

`REM` allows us to add comments to our programs. Comments are for you or other people to read. Computers ignore them.

Example: `REM this is a comment`

#### PRINT

`PRINT` puts variables, strings, or numbers on the console. The console is the input/output area of Basic, where the program shows you useful information and asks you for input.

#### LET (optional)

`LET` lets us declare variables. Variables are single letters that hold values. Values could be either strings or numbers. Note that `LET` is optional and can be left out of an assignement expression.

Example using a number:
```
10 LET X = 10
20 PRINT X
```

Example using a string:
```
10 LET X = "hello"
20 PRINT X
```

Example without `LET`:
```
10 X = "hello"
20 PRINT X
```

#### ARRAY

`ARRAY` also lets us declare an array. Arrays can be thought of as lists of values. 

Example:
```
10 ARRAY a
20 a[0] = "car"
30 a[1] = "bus"
40 a[2] = "bike"
50 print a
```

If we want to create a multi-dimensional array, which is an array of arrays, we can declare the array with a dimension:
```
10 ARRAY a, 2

15 REM the first array is ground transportation
20 a[0][0] = "car"
30 a[0][1] = "bus"
40 a[0][2] = "bike"

45 REM the second array aerial transportation
50 a[1][0] = "plane"
60 a[1][1] = "helicopter"
70 a[1][2] = "jetpack"

80 print a
```

#### INPUT

`INPUT` lets you communicate with the program by typing into the console. Whatever you typed will be stored into a variable that you can then use in your program. 

Example:

```
10 INPUT "type your name: "; A
20 PRINT "Hello " + A
```

#### END

`END` ends the program. 

Example:
```
10 END
20 PRINT "We never reach this statement"
```

#### GOTO

`GOTO` tells which line number is executed next. Normally, lines are executed from the lowest to the highest number, but `GOTO` allows us to "jump" to a specific line.

Example:
```
10 GOTO 30
20 PRINT "this line never executes"
30 PRINT "Jumped here from 10"
```

`GOTO` can be used to create a loop. Loops are when programs repeatedly execute a set of lines. 

The following examples prints "hello" for ever:
```
10 PRINT "hello"
20 GOTO 10
```

#### IF...THEN

`IF...THEN` is like `GOTO` in that it allows to influence the execution of the program but it's different in that it all happens on the same line. If the mathematical or relational test is true we execute the command that comes after `THEN`. If it's untrue, we simply proceed to the next line.

```
10 IF X > Y THEN PRINT "X is larger than Y"
```

#### IF...THEN...ELSE 

This is the same as `IF...THEN` except we execute the command following the `ELSE` command.

```
10 IF X > 0 THEN PRINT "X is positive" ELSE PRINT "X is negative"
```

#### FOR...TO...STEP...NEXT

It's often useful to repeatedly execute a number of lines. This is called "looping," and `FOR` statements allows to create loops between ranges of numbers. 

For example, we can print numbers from 1 to 10:
```
10 FOR I = 1 TO 10
20 PRINT I
30 NEXT I
```

Output:
```
1
2
3
4
5
6
7
8
9
10
```

But what if we only want to print even numbers between 1 and 10? This is where `STEP` steps in. `STEPS` tells the computer how much to add to the variable (in this case `I`) with each loop. 

```
10 FOR I = 2 TO 30 STEP 2
20 PRINT I
30 NEXT I
```

Output:
```
2
4
6
8
10
```

Remember to call `NEXT` with the variable name after the last line of the loop. 

#### GOSUB...RETURN

A subroutine is a group of statements that you wish to use repeatedly in a program. They're similar to loops in that they can be executed repeatedly, but you have to use `GOSUB` to call (move the program to) the subroutine's first line number. After the subroutine finishes executing you can use `RETURN` to go back to where you used `GOSUB`.

Example:
```
10 GOSUB 40
20 PRINT "This is the end of the program"
30 END
40 PRINT "this is the start of the subroutine"
50 PRINT "we can easily call it as many times"
60 PRINT "as we'd like"
70 RETURN
```

#### PLOT

`PLOT` lights a pixel with an x,y coordinates on the display with a certain color. 

Example:
```
10 PLOT 0, 0, "red"
```

Colors can be any of the these [colors](https://www.w3schools.com/cssref/css_colors.asp).

#### DISPLAY

`DISPLAY` changes the display size (rows, columns) and lets us turn off pixel borders. 

Example:
```
DISPLAY 100, 100, FALSE
```

`DISPLAY` will affect the values of the constants `ROWS` and `COLUMNS`.

Example:
```
DISPLAY 50, 100, FALSE
PRINT ROWS
PRINT COLUMNS
```

OUTPUT:
```
50
100
```

#### DRAW

`DRAW` is like `PLOT` excepts it lights up multiple pixels on the display. It takes a two-dimensional array of colors.

Example:
```
10 ARRAY a, 2
20 a[0][0] = "red"
30 a[25][25] = "yellow"
40 DRAW a
```

#### TEXT

`TEXT` draws text on the display at an x,y coordinates. Optional text size and color parameters can be passed in.

Example:
```
10 TEXT 0, 0, "hello world", 25, "red"
```

Colors can be any of the these [colors](https://www.w3schools.com/cssref/css_colors.asp).

#### PAUSE

`PAUSE` pauses the program for a number of milliseconds. Milliseconds are 1/1000 of a second.

Example:
```
10 PRINT "pause for a second"
20 PAUSE 1000
30 PRINT "end"
```

#### CLS

`CLS` clears the console and the display.

Example:
```
10 CLS
```

#### CLT

`CLT` clears the console.

Example:
```
10 CLT
```

#### CLC

`CLC` clears the display.

Example:
```
10 CLC
```

#### SOUND

`SOUND` lets us play a frequency for a duration in seconds.

Example:
```
10 SOUND 400, 4
```

Duration is optional and will default to 1 second.

#### PLAY

`PLAY` lets us play a note in an octave for a duration in seconds.

Example:
```
10 PLAY "C", 4, 5
```

- Octave is optional and will default to `2`
- Duration is optional and will default to `1`
- Notes can be one of: `C C# D D# E F F# G G# A A# B`

### Functions

You can think of functions as builtin subroutines you can call. It's important to differentiate between functions and commands. Lines should start with commands, while functions can be used as part of other commands but not on their own. 

#### ABS

`ABS` returns the absolute value of a number. The sign of the number will always be positive after this function is executed. 

```
10 PRINT ABS(-11)
20 PRINT ABS(11)
```

Output:
```
11
11
```

#### COS

`COS` returns the trigonometric cosine of a number.

Example:
```
10 PRINT COS(1)
```

Output:
```
0.5403023058681398
```

#### SIN

`SIN` returns the trigonometric sine of a number.

Example:
```
10 PRINT SIN(1)
```

Output:
```
0.8414709848078965
```

#### TAN

`TAN` returns the trigonometric tangent of a number.

Example:
```
10 PRINT TAN(1)
```

Output:
```
1.5574077246549023
```

#### ATAN

`ATAN` returns the trigonometric arctangent of a number.

Example:
```
10 PRINT ATAN(1)
```

Output:
```
0.7853981633974483
```

#### EXP

`EXP` returns Euler's number (e) raised to the power of a number.

Example:
```
10 PRINT EXP(2)
```

Output:
```
7.38905609893065
```

#### INT

`INT` returns the lowest closest integer of a number.

Example:
```
10 PRINT INT(2.6)
```

Output:
```
2
```

Alias: `FLOOR`

#### ROUND

`ROUND` rounds a number to the closest integer.

Example:
```
10 PRINT ROUND(2.6)
```

Output:
```
3
```

#### LOG

`LOG` returns the natural logarithm of a number.

Example:
```
10 PRINT LOG(5)
```

Output:
```
1.6094379124341003
```

#### SGN

`SGN` returns the sign of a number. The sign is +1 if the number is positive, 0 if the number is 0, and -1 if the number is negative.

Example:
```
10 PRINT SGN(-23)
```

Output:
```
-1
```
#### SQR

`SQR` returns the square root of a number.

Example:
```
10 PRINT SQR(25)
```

Output:
```
5
```

#### VAL

`VAL` converts a string to a number, and `0` if it cannot be converted. 

Example:
```
10 PRINT VAL("33")
```

Output:
```
33
```

#### RND

`RND` returns a random number between 0 and 1.

Example:
```
10 PRINT RND()
```

Output:
```
0.54232
```

If passed a number between parenthesis then it will return a random bumber between 1 and that number. ht 

Example:
```
10 PRINT RND(10)
```

Output:
```
7
```

#### ASC

`ASC` returns the ASCII representation of a letter. 

Example:
```
10 PRINT "s"
```

Output:
```
115
```

#### LEFT

`LEFT` returns the first `n` number of letters from a string. 

Example:
```
10 PRINT LEFT("basic", 2)
```

Output:
```
ba
```

#### MID

`MID` returns a substring as defined by a starting and ending position in the string. 

Example:
```
10 PRINT MID("basic", 1, 2)
```

Output
```
as
```

#### RIGHT

`RIGHT` returns the last `n` number of letters from a string. 

Example:
```
10 PRINT RIGHT("basic", 2)
```

Output:
```
ic
```

#### CHR

`CHR` returns the ASCII letter from a number.

Example:
```
10 PRINT CHR(115)
```

Output:
```
s
```

Aliases: `STR`

#### LEN

`LEN` returns the length of a string.

Example:
```
10 PRINT LEN("basic")
```

Output:
```
5
```

#### SPC

`SPC` returns a number of spaces.

Example:
```
10 PRINT "hello" + SPC(5) + "world"
```

Output:
```
hello     world
```

#### UPPERCASE

`UPPERCASE` returns the uppercase string.

Example: 
```
10 PRINT UPPERCASE("basic")
```

Output:
```
BASIC
```

#### LOWERCASE

`LOWERCASE` returns the lowercase string.

Example: 
```
10 PRINT LOWERCASE("BASIC")
```

Output:
```
basic
```

#### COLOR

`COLOR` returns the color of a pixel at an x, y coordinates.

Example:
```
10 PLOT 1,1,"red"
20 PRINT COLOR(1, 1)
```

Output:
```
red
```

#### GETCHAR

`GETCHAR` returns a single character of user input. The program maintains a first-in-first-put queue of user inputs. If there are no user inputs in the queue, it will return an empty string `""`. 

Example:
```
10 LET I = GETCHAR()
20 IF I = "" THEN PRINT "no input" else PRINT "input: " + I
```

#### GETCLICK

`GETCLICK` returns an array of x, y coordinates of user mouse clicks. The program maintains a queue of clicks. If there are no user clicks in the queue, it will return an empty string `""`.

Example:
```
PRINT GETCLICK()
```

#### TIME

`TIME` returns the current milliseconds elapsed since the UNIX epoch.

Example:
```
10 PRINT TIME()
```

Output:
```
1587345235623
```
