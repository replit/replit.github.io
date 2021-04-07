# Managing dependencies using Repl.it

Nearly all useful programs rely to some extent on pre-existing code in various forms. The existing code that your code relies on is known as a _dependency_. You have already come across some dependencies in previous tutorials: you used the `math` module to calculate quadratic equations in the first tutorial and you used the `requests` module to fetch weather data in the second tutorial.

In the first tutorial, you also wrote the `solver.py` module, and imported this into the `main.py` file.

We can think of dependencies as falling into three broad categories:

* Internal dependencies: other code that you or your organisation wrote and which you fully control, e.g. the `solver.py` file.
* Standard dependencies: code that exists as part of the standard language libraries, e.g. the `math` module.
* External dependencies: code that is written by third-party developers, e.g. the `requests` module.

In this tutorial, you'll gain more experience with all three categories of dependencies. Specifically, you'll write an NLP (natural language processing) program to analyse sentences, using [spaCy](https://spacy.io/), a third-party dependency.

Dependency management is a hugely complicated area, and there is a large ecosystem of related tools to help manage packaging and installing Python programs. We won't be covering all of the options and background, but you can read an overview of the different tools [here](https://modelpredict.com/python-dependency-management-tools).

## Understanding Repl.it's magic import tool and the universal package manager

In nearly all programming environments, you have to explicitly install third-party dependencies. Let's say you wanted to use the `requests` library (which is not included in Python by default) on your local machine. If you try to import it, you would get a `ModuleNotFound` error, as shown below.

![**Image 1:** *Trying to use a dependency without installing it*](/images/tutorials/03-handling-dependecies/03-01-error-no-module.png)

In order to use this library, you would first have to install it using a command similar to `pip install requests`, and only then would the import statement run correctly.

Repl.it, by contrast, can often do the installation for you completely automatically, using the [Universal Package Manager](https://blog.repl.it/upm). The moment you run the `import requests` line of code, the package manager will go find the correct package and install it, or in some cases Repl.it will even have pre-installed the package. Either way, your code will "just work".

![**Image 2:** *Seamless external package use on a new repl*](/images/tutorials/03-handling-dependecies/03-02-import-module.png)

This is super convenient, but sometimes you need more control. For example, you might need a specific version of a package, or the universal package manager might not be able to automatically install all of your dependencies. In these cases, you can use more advanced ways to install packages.

## Installing packages through the GUI 

If you're not sure exactly which package you need, you can use Repl.it's built-in package manager GUI to search for packages. In the example below, we are looking for a package called `beautifulsoup4`.

To use this, you need to 

1. Click on the packages tab from the left toolbar.
2. Search for a package by typing in part or all of its name.
3. Select the package you want from the search results.

![**Image 3:** *Using the GUI package manager to find a package*](/images/tutorials/03-handling-dependecies/03-03-find-package.png)

This will take you to a page showing an overview and summary of the selected package. You can install it to your repl by using the `+` button, as shown below.

![**Image 4:** *Installing a package from the overview page*](/images/tutorials/03-handling-dependecies/03-04-add-package.png)

Once the package is installed, we can use it in our code. Run the example shown below to extract the "Google Search" text from the main button on the homepage.

```python
import requests
from bs4 import BeautifulSoup

r = requests.get("https://google.com").text
soup = BeautifulSoup(r, "html.parser")

print([x.get("title") for x in soup.findAll("input") if x.get("title")])

```

This code uses the `requests` library to scrape the HTML from google.com and then uses the `beautifulsoup4` library to get the title of the button off the page and print it to the console. 

Because `requests` is one of the most commonly used Python libraries, Repl.it probably installed it in a slightly different way from most packages. However, `beautifulsoup4` is less common and this will have been installed in the standard way using [poetry](https://python-poetry.org/docs/basic-usage/). 

If you go back to the files tab, you'll see two new files `poetry.lock` and `pyproject.toml` which were created automatically by the installer. Take a look inside the `pyproject.toml` file.

![**Image 5:** *The `pyproject.toml` file lists all dependencies and their versions.*](/images/tutorials/03-handling-dependecies/03-05-project-files.png)

In this case, line 9 says that our project relies on the `beautifulsoup4` package and needs at least version 4.9.1. If we look at [the `beautifulsoup` page on PyPi](https://pypi.org/project/beautifulsoup4/), we'll see that the latest stable version is 4.9.1, so if this project is run in the future and there is a new version available, it will automatically use the updated package.

## Building an NLP project using `spaCy`

So far, we have installed packages that are easy for the Repl.it universal dependency manager to install automatically, behind the scenes. Some packages are more complicated though. [`spaCy`](https://spacy.io/), for example, is an NLP library that relies on a large external data file. When installing this library, you usually have to install this data file as a separate step.

### Installing the `spaCy` language model

To get this to work on Repl.it, we'll have to manually modify the `pyproject.toml` file.

Create a new repl, `SpacyExample`, then click on the `Packages` icon and search for "spacy".

![**Image 6:** *We can access the `spaCy` package via the package index"*](/images/tutorials/03-handling-dependecies/03-06-installing-spacy.png)

Select the version at the top and hit the `+` button to add this package to your application. Once this is complete, head across to your `main.py` and enter the following code:

```python
import spacy
print(spacy.__version__)
```

This should output the version of `spaCy` that we are using, which means that `spaCy` has been added as a dependency correctly. 

If you take a look at your `pyproject.toml` file now, you should see that it has specified `spaCy` as a dependency.

```
[tool.poetry]
name = "spacy-example"
version = "0.1.0"
description = ""
authors = ["Your Name <you@example.com>"]

[tool.poetry.dependencies]
python = "^3.8"
spacy = "^2.3.2"

[tool.poetry.dev-dependencies]

[build-system]
requires = ["poetry>=0.12"]
build-backend = "poetry.masonry.api"
```

An important component of `spaCy` is a set of pretrained statistical models that support NLP. These do not come with `spaCy` by default, nor are they indexed on PyPi. One of these models is `en_core_web_sm`.

In your `main.py` file, replace your current code with the following:

```python
import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("The quick brown fox jumps over the lazy dog.")
for token in doc:
    print(token.text)
```

This code should simply break our short sentence into tokens (words), and print each one out.

However, at this point, if you run your code you will get an error, as Python cannot find the `en_core_web_sm` model:

```
OSError: [E050] Can't find model 'en_core_web_sm'. It doesn't seem to be a shortcut link, 
a Python package or a valid path to a data directory.
```

We will now explicitly tell our application how to access this dependency. To do this, we need to find where the model is stored online.

First, we need to find the `spaCy` documentation for this model. This can be accessed [here](https://spacy.io/models/en).

![**Image 7:** *The `spaCy` documentation gives us information about the model*](/images/tutorials/03-handling-dependecies/03-07-spacy-docs.png)

Selecting the `RELEASE DETAILS` button will guide us to where the model is stored online, on [GitHub](https://github.com/explosion/spacy-models/releases//tag/en_core_web_sm-2.3.1). GitHub is a very common place to store code and related components online.

![**Image 8:** *This is the `en_core_web_sm` GitHub page*](/images/tutorials/03-handling-dependecies/03-08-spacy-component.png)

The GitHub page also lets us know what version of `spaCy` is needed to make sure the model runs correctly. 

![**Image 9:** *The GitHub page provides information about the requirements and features of the model*](/images/tutorials/03-handling-dependecies/03-09-spacy-version.png)

Here we see that `spaCy` version should be greater than or equal to *2.3.0*, but less than *2.4.0*. We should make a note of this for later, so we can check that we have pinned an appropriate `spaCy` version.

If we scroll right to the bottom of the page, you will see an "Assets" section, and under this you will see the same `Package` icon we used in Repl.it with "en_core_web_sm-2.3.1.tar.gz" next to it. This is what we have been looking for: the file containing the model.

![**Image 10:** *The model can be found under the "Assets" heading*](/images/tutorials/03-handling-dependecies/03-10-assets.png)

Right-click on this file and select `copy link address`. We will need this shortly, as this is the URL of the file.

We now need to modify our `pyproject.toml` file in Repl.it. Open this file and add the following section to it 

```
[tool.poetry.dependencies.en_core_web_sm]
url = "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-2.3.1/en_core_web_sm-2.3.1.tar.gz"
```

The `url` should be the one that you copied from GitHub in the previous step. Your whole `pyproject.toml` file should now look like the one below.

![**Image 11:** *Modifying `pyproject.toml` to explicitly point to the model allows our application to find it and use it*](/images/tutorials/03-handling-dependecies/03-11-pyproject-toml.png)

At this point that we should also check that we are using an appropriate version of `spaCy`. We are using version *2.3.2*, which is in the allowed range for the model release (>=2.3.0, <2.4.0) , so we do not need to modify this.

Finally, hit the `run` button. This will cause your configuration files to be updated and then will run your application. If everything has gone correctly, you should see the following in the output pane once it completes.

![**Image 12:** *`spaCy` and the necessary components are all found as dependencies, so the application runs successfully*](/images/tutorials/03-handling-dependecies/03-12-brown-fox.png)

### Extracting names from headlines using `spaCy`

We've now seen how to install common packages like `requests` simply by importing them, how to find and install slightly more complicated packages like `beautifulsoup` using the GUI package manager, and how to manually install even more complicated packages like `spaCy` (which have their own dependencies) by manually writing sections of the `pyproject.toml` file.

Let's put everything together and use all three packages to extract people's names from today's headlines. We'll use the plaintext version of CNN at [lite.cnn.com](https://lite.cnn.com) as it's easier to extract text from.

Replace the code in your `main.py` with the following.

```python
import spacy
import requests
from bs4 import BeautifulSoup
from collections import Counter

nlp = spacy.load("en_core_web_sm")
response = requests.get("http://lite.cnn.com/en")
soup = BeautifulSoup(response.text, "html.parser")

# https://stackoverflow.com/questions/1936466/beautifulsoup-grab-visible-webpage-text
[s.extract() for s in soup(['style', 'script', '[document]', 'head', 'title'])]
text = soup.getText()
doc = nlp(text)

names = []
for ent in doc.ents:
    if ent.label_ == "PERSON":
        names.append(ent.lemma_)

print("These people are in the headlines today")
print(Counter(names).most_common(10))
```

This pulls the HTML from the lite version of CNN, extracts the HTML, removes non-visible text such as CSS styles and JavaScript, and parses the resulting text using `spaCy`.

Then we loop through all of the [named entities](https://en.wikipedia.org/wiki/Named_entity) that `spaCy` detects as part of its standard parse, and print out any that look like people.

If you run this code, you should see a list of people making headlines today. At the time of writing, John Lewis is mentioned in the most headlines. (Note that named entity recognition is a difficult task and here `spaCy` considers the possessive form `John Lewis'` to be a separate entity. We can see that John Lewis was mentioned a total of 7 times though.)

![**Image 13:** *Using `spaCy` to extract people in today's news.*](/images/tutorials/03-handling-dependecies/03-13-using-spacy.png)

## Make it your own

If you followed along, you'll already have your own version of the repl to extend. If not, start from ours. Fork it from the embed below.

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/cwr-03-nlp-spacy?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Where next?

`spaCy` is a very powerful NLP library and it can do far more than simply extract people's names. See what other interesting insights you can automatically extract from today's news.

Now you can use the Repl.it IDE, write programs that use files, and install third-party dependencies. Next up, we'll be taking a look at doing data science with Repl.it by visualising data using `matplotlib` and `seaborn`.