# Autograding Assignments

In [Repl.it Classroom](/site/classroom) you can automatically correct
and grade your student's assignment submissions by implementing
**Unit tests** or **Input/output matching tests**.

![](https://replit.github.io/media/autograding/correction.png)

## Input/Output Matching

### What is I/O Matching?

One of the first things to learn about programming computers is how to provide programs
with input. Command-line programs typically read text from the standard
input interface (stdin) and display text on the standard output interface (stdout) -- both are
part of the [standard streams](https://en.wikipedia.org/wiki/Standard_streams).

Nearly every programming language has a way for interacting with standard
streams. You can find documentation for this by simply googling the language
name with "stdin" and/or "stdout". In this tutorial we'll use Python as our language.

Many of the teachers using repl.it like to ask their students to write programs
that takes input from the user and do something with it. That could be anything
from a text-based games, to calculators. Let's take a simple example: a program
that takes two numbers, multiplies them, and prints the result.

```python
str_a = input('Please enter a number:')
str_b = input('Please enter a number to multiple with ' + str_a + ':')
print('{0} * {1} = {2}'.format(str_a, str_b, int(str_a) * int(str_b)))
```

This program will run then stop to wait for the first number. The user then
inputs the number in the console followed by the enter key. This is repeated for
the second number. Then the program will print the formatted result. You can see
it running live [on repl.it](https://repl.it/Cl6j).

Now if you have a class of, say, thirty students it becomes labor-intensive
to run every student program to check that it's takes the right input, does the
right computation and prints the right output. So this is where the input/output
matching feature comes in.

### How to use I/O Matching

After you've selected it as your preferred correction method, you can then click
'create test case' to open the test creation form:

![](https://replit.github.io/media/autograding/create_test.png)

* Name: you want to give your test a descriptive name, something that would hint
  at what went wrong if the student fails this test. In this case we're
  calling it "Multiply 2 and 3".
* Input: this is the input that will be automatically sent the student's program
  when they hit 'submit'. Each line means a single input. In this case numbers
  that we want to multiply (2 and 3) are on seperate lines.
* Matching type:
    * Strict: If you want to match against your student's program character by
      character (including strict whitespace and special character matching).
    * Flexible: If you want to match against your student's program while
      ignoring whitespace, case, and special character difference .
    * Regexp: Gives you the full power of [Regular
      Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
      to match against your student's output.


In this case we went with regexp to check
against the expected number output (6 in this case) because we don't really care what other
things the program is printing.

![](https://replit.github.io/media/autograding/tests.png)

After creating a couple of tests (`2 * 3 = 6` and `-5 * 3 = -15`) we're going to
test this on the student end (using the "student preview" button) to see how the
experience looks like:

![](https://replit.github.io/media/autograding/test_failed.png)

You'll see here that the user failed the test because they added instead of
multiplying (resulting in 2 + 3 = 5).

And after fixing to correctly multiply we'll pass all the tests:

![](https://replit.github.io/media/autograding/tests_passed.png)

## Unit Tests

You can also grade assignments automatically using unit tests.  Unit tests offer greater flexibility 
in grading, allowing you to test classes, server requests, and more.

Since it requires more infrastructure work, it is only supported for select languages. 
We plan on adding more unit tests in the future.

### Languages Supported

* Python: the built-in [unittests](https://docs.python.org/2/library/unittest.html) library
* Python3: the built-in [unittests](https://docs.python.org/3/library/unittest.html) library
* Java: [JUnit](http://junit.org/)
* JavaScript: [Jasmine](http://jasmine.github.io/)
* JavaScript ES6+: [Jasmine](http://jasmine.github.io/)
* HTML/CSS/JavaScript: [Jasmine](http://jasmine.github.io/) with [Jasmine DOM Matchers](https://github.com/charleshansen/jasmine_dom_matchers#matchers)
* Ruby: [RSpec](http://rspec.info/)
