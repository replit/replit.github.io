# An introduction to `pytest` and doing test-driven development with Repl.it

In this tutorial we'll introduce test-driven development and you'll see how to use [`pytest`](https://docs.pytest.org/en/stable/) to ensure that your code is working as expected. 

`pytest` lets you specify inputs and expected outputs for your functions. It runs each input through your function and validates that the output is correct. `pytest` is a Python library and works just like any other Python library: you install it through your package manager and you can import it into your Python code. Tests are written in Python too, so you'll have code testing other code.

Test-driven development or TDD is the practice of writing tests _before_ you write code. You can read more about TDD and why it's popular on [Wikipedia](https://en.wikipedia.org/wiki/Test-driven_development).

Specifically you'll:

* See how to structure your project to keep your tests separate but still have them refer to your main code files
* Figure out the requirements for a function that can split a full name into first and last name components
* Write tests for this function
* Write the actual function.

## Creating a project structure for `pytest`

For large projects, it's useful to keep your testing code separate from your application code. In order for this to work, you'll need your files set up in specific places, and you'll need to create individual Python **modules** so that you can refer to different parts of the project easily.

Create a new Python repl called `namesplitter`. As always, it'll already have a `main.py` file, but we're going to put our name splitting function into a different module called `utils`, which can house any helper code that our main application relies on. We also want a dedicated place for our tests.

Create two new folders: one called `utils` and one called `tests`, using the `add folder` button. Note that when you press this button it will by default create a folder in your currently active folder, so select the `main.py` file after creating the first folder or the second folder will be created inside the first folder.

You want both the folders to be at the root level of your project. 

Now add a file at the root level of the project called `__init__.py`. This is a special file that indicates to Python that we want our project to be treated as a "module": something that other files can refer to by name and import pieces from. Also add an `__init__.py` file inside the `utils` folder and the `tests` folder. These files will remain empty, but it's important that they exist for our tests to run. Their presence specifies that our main project should be treated as a module and that any code in our `utils` and `tests` folders should be treated as submodules of the main one.

Finally, create the files where we'll actually write code. Inside the `utils` folder create a file called `name_helper.py` and inside the `tests` folder create one called `test_name_helper.py`. Your project should now look as follows. Make sure that you have all the files and folders with exactly these names, in the correct places.

![**Image 1:** *Setting up our project structure for `pytest`.*](https://codewithrepl.it/img/09-project-structure.png)

## Defining examples for the name split function

Splitting names is useful in many contexts. For example, it is a common requirement when users sign up on websites with their full names and then companies want to send personalised emails addressing users by their first name only. You might think that this is as simple as splitting a name based on spaces as in the following example.

```python
def split_name(name):
    first_name, last_name = name.split()
    return first_name, last_name

print(split_name("John Smith"))
# >>> ["John", "Smith"]
```

While this does indeed work in many cases, names are surprisingly complicated and it's very common to make mistakes when dealing with them as programmers, as discussed in [this classic article](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/). It would be a huge project to try and deal with *any* name, but let's imagine that you have requirements to deal with the following kinds of names:

* First Last, e.g. John Smith
* First Middle Last, e.g John Patrick Smith (John Patrick taken as first name)
* First Middle Middle Last, e.g. John Patrick Thomson Smith (John Patrick Thomson taken as first name)
* First last last Last, e.g. Johan van der Berg (note the lowercase letters, Johan taken as first name, the rest as last)
* First Middle last last Last, e.g. Johan Patrick van der Berg (note the lowercase letters, Johan taken as first name, the rest as last)
* Last, e.g. Smith (we can assume that if we are given only one name, it is the last name)

Specifically, you can assume that once you find a name starting with a lowercase letter, it signifies the start of a last name, and that all other names starting with a capital letter are part of the first and middle names. Middle names can be combined with first names.

Of course, this does not cover all possibilities, but it is a good starting point in terms of requirements.

Using TDD, we always write *failing tests* first. The idea is that we should write a test about how some code *should* behave, check to make sure that it breaks in the way we expect (as the code isn't there). Only then do we write the actual code and check that the tests now pass.

## Writing the test cases for our names function

Now that we understand what our function should do, we can write tests to check that it does. In the `tests/test_name_helper.py` file, add the following code.

```python
from namesplitter.utils import name_helper

def test_two_names():
    assert name_helper.split_name("John Smith") == ["John", "Smith"]
```
Note that the `namesplitter` in the first line is taken from the name of your Repl.it project, which defines the names of the parent module. If you called your project something else, you'll need to use that name in the import line. It's important to not include special characters in the project name (including a hyphen, so names like `my-tdd-demo` are out) or the import won't work.

The `assert` keyword simply checks that a specific statement evaluates to `True`. In this case, we call our function on the left-hand side and give the expected value on the right-hand side, and ask `assert` to check if they are the same.

This is our most basic case: we have two names and we simply split them on the single space. Of course, we haven't written the `split_name` function anywhere yet, so we expect this test to fail. Let's check.

Usually you would run your tests by typing `py.test` into your terminal, but using Repl.it things work better if we import `pytest` into our code base and run it from there. This is because a) our terminal is always already activated into a Python environment and b) caching gets updated when we press the `Run` button, so invoking our tests from outside of this means that they could run on old versions of our code, causing confusion.

Let's run them from our `main.py` file for now as we aren't using it for anything else yet. Add the following to this file.

```python
import pytest
pytest.main()
```

Press the `Run` button. `pytest` does automatic test discovery so you don't need to tell it which tests to run. It will look for files that start with `test` and for functions that start with `test_` and assume these are tests. (You can read more about exactly how test discovery works and can be configured [here](https://docs.pytest.org/en/reorganize-docs/new-docs/user/naming_conventions.html).)

You should see some scary looking red failures, as shown below. (`pytest` uses dividors such as `======` and `------` to format sections and these can get messy if your output pane is too narrow. If things look a bit wonky try making it wider and rerunning.)

![**Image 2:** *Reading the `pytest` error messages.*](https://codewithrepl.it/img/09-failing-first-test.png)

If you read the output from the top down you'll see a bunch of different things happened. First, `pytest` ran test discovery and found one test. It ran this and it failed so you see the first red `F` above the `FAILURES` section. That tells us exactly which line of the test failed and how. In this case, it was an `AttributeError` as we tried to use `split_name` which was not defined. Let's go fix that.

Head over to the `utils/name_helper.py` file and add the following code.

```python
def split_name(name):
    first_name, last_name = name.split()
    return first_name, last_name
```

This is the very simple version we discussed earlier that can only handle two names, but it will solve the name error and TDD is all about small increments. Press `Run` to re-run the tests and you should see a far more friendly green output now, as below, indicating that all of our tests passed.

![**Image 3:** *Seeing our tests pass after updating the code.*](https://codewithrepl.it/img/09-passing-first-test.png)

Before fixing our function to handle more complex cases, let's first write the tests and check that they fail. Go back to `tests/test_name_helper.py` and add the following four test functions beneath the existing one.

```python
from namesplitter.utils import name_helper

def test_two_names():
    assert name_helper.split_name("John Smith") == ["John", "Smith"]

def test_middle_names():
    assert name_helper.split_name("John Patrick Smith") == ["John Patrick", "Smith"]
    assert name_helper.split_name("John Patrick Thomson Smith") == ["John Patrick Thomson", "Smith"]

def test_surname_prefixes():
    assert name_helper.split_name("John van der Berg") == ["John", "van der Berg"]
    assert name_helper.split_name("John Patrick van der Berg") == ["John Patrick", "van der Berg"]

def test_split_name_onename():
    assert name_helper.split_name("Smith") == ["", "Smith"]

def test_split_name_nonames():
    assert name_helper.split_name("") == ["", ""]
```

Rerun the tests and you should see a lot more output now. If you scroll back up to the most recent `===== test session starts =====` section, it should look as follows.

![**Image 4:** *Seeing more failures after adding more tests.*](https://codewithrepl.it/img/09-many-failures.png)

In the top section, the `.FFFF` is shorthand for "five tests were run, the first one passed and the next four failed" (a green dot indicates a pass and a red F indicates a failure). If you had more files with tests in them, you would see a line like this per file, with one character of output per test.

The failures are described in detail after this, but they all amount to variations of the same problem. Our code currently assumes that we will always get exactly two names, so it either has too many or too few values after running `split()` on the test examples.

## Fixing our `split_name` function

Go back to `name_helper.py` and modify it to look as follows.

```python
def split_name(name):
    names = name.split(" ")

    if not name:
        return ["", ""]

    if len(names) == 1:
        return ["", name]

    if len(names) == 2:
        firstname, lastname = name.split(" ")
        return [firstname, lastname]
```

This should handle the case of zero, one, or two names. Let's run our tests again to see if we've made progress before we handle the more difficult cases. You should get a lot less output now and three green dots, as shown below.

![**Image 5:** *Progress: some of our tests pass now.*](https://codewithrepl.it/img/09-three-tests-pass.png)

The rest of the output indicates that it's the middle names and surname prefix examples that are still tripping up our function, so let's add the code we need to fix those. Another important aspect of TDD is keeping your functions as small as possible so that they are easier to understand, test, and reuse, so let's write a second function to handle the three or more names cases.

Add the new function called `split_name_three_plus()` and add an `else` clause to the existing `split_name` function where you call this new function. The entire file should now look as follows.

```python
def split_name_three_plus(names):
    first_names = []
    last_names = []

    for i, name in enumerate(names):
        if i == len(names) - 1:
            last_names.append(name)
        elif name[0].islower():
            last_names.extend(names[i:])
            break
        else:
            first_names.append(name)
    first_name = " ".join(first_names)
    last_name = " ".join(last_names)
    return [first_name, last_name]

def split_name(name):
    names = name.split(" ")

    if not name:
        return ["", ""]

    if len(names) == 1:
        return ["", name]

    if len(names) == 2:
        firstname, lastname = name.split(" ")
        return [firstname, lastname]
    else:
        return split_name_three_plus(names)
```

The new function works by always appending names to the `first_names` list until it gets to the last name, or until it encounters a name that starts with a lowercase letter, at which point it adds all of the remaining names to `last_names` list. If you run the tests again, they should all pass now.

![**Image 6:** *All of the tests pass after adding a new function.*](https://codewithrepl.it/img/09-all-five-pass.png)

The tests were already helpful in making sure that we understood the problem and that our function worked for specific examples. If we had made any off-by-one mistakes in our code that deals with three or more names, our tests would have caught them. If we need to refactor or change our code in future, we can also use our tests to make sure that our new code doesn't introduce any regressions (where fixing problems causes code to break on other examples that worked before the fix.)

## Using our function

Let's build a very basic application to use our function. Replace the testing code in `main.py` with the following.

```python
from utils import name_helper

name = input("Please enter your full name: ")

first_name, last_name = name_helper.split_name(name)

print(f"Your first name is: {first_name}")
print(f"Your last name is: {last_name}")
```

If you run this, it will prompt the user for their name and then display their first and last name.

![**Image 7:** *Using our function in a basic console application.*](https://codewithrepl.it/img/09-dumbledore.png)

## Make it your own

We've written a name splitter that can handle some names more complicated than just "John Smith". It's not perfect though: for example, if you put in a name with two consecutive spaces it will crash our program. You could fork the project and fix this by first writing a test with consecutive spaces and then modifying the code to handle this (and any other edge cases you can think of).

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/namesplitter?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

Because you're using the `main.py` file now, you can also invoke `pytest` directly from the output console on the right by typing `import pytest; pytest.main()`. Note that updates to your code are only properly applied when you press the `Run` button though, so make sure to run your code between changes before running the tests.

![**Image 8:** *Triggering a new error and invoking `pytest` from the output pane.*](https://codewithrepl.it/img/09-error-and-invoke-from-repl.png)

## Where next

You've learned to do TDD in this project. It's a popular style of programming, but it's not for everyone. Even if you decide not to use TDD, having tests is still very useful and it's not uncommon for large projects to have thousands or millions of tests. 

Take a look at the [big list of naughty strings](https://github.com/minimaxir/big-list-of-naughty-strings) for a project that collects inputs that often cause software to break. You could also read [How SQLite Is Tested](https://www.sqlite.org/testing.html) which explains how SQLite, a popular lightweight database, has 150 thousand lines of code and nearly 100 million(!) lines of tests.

In the next tutorial, we'll show you how to become a Repl.it poweruser by taking advantage of the productivity features it offers.
