# Create a static site generator with Python and Replit

A static site generator (SSG) is a tool for building informational websites such as blogs and documentation repositories. SSGs allow technical users to build websites that are faster and more secure than ones running on dynamic platforms such as Wordpress, without having to write each HTML page.

There are many SSGs out there already, such as Jekyll and Hugo, but many people opt to write their own – either so that they fully understand it and can be more productive, or to meet custom needs.

After this tutorial, you'll: 

* Be able to build a simple but flexible SSG in Python in under 100 lines of code.
* Understand advanced file and directory handling.
* Know how to build a configurable tool for technical users. 

![Example static site generator functionality](/images/tutorials/static-site-generator/generator_functionality.gif)

At the end, you'll have a full SSG that you can use as is or extend for your own requirements.

## Building a proof of concept

A basic SSG takes in a list of [Markdown](https://en.wikipedia.org/wiki/Markdown) files, converts them to HTML, and inserts them into different predefined HTML templates. Beyond that, most SSGs have the concept of [frontmatter](https://jekyllrb.com/docs/front-matter/) to define metadata such as title and publish date for each Markdown file. SSGs also usually have global configuration files, containing general information about the site such as its name and domain.

Before we start dealing with files, we're going to implement our SSG using strings. This will serve as an initial proof of concept.

### Setting up and defining the flow

We'll start by defining the main functions we'll use. Create a new Python repl and enter the following code in `main.py`.

![Creating a new Python repl](/images/tutorials/static-site-generator/new_repl.png)

```python
def load_config():
    pass

def load_content_items():
    pass

def load_templates():
    pass

def render_site(config, content, templates):
    pass

def main():
    config = load_config()
    content = load_content_items()
    templates = load_templates()
    render_site(config, content, templates)

main()
```

This skeleton defines the program flow:

1. Load the global site configuration.
2. Load the content files containing Markdown and frontmatter.
3. Load the HTML templates.
4. Render the site using everything we've loaded above.

Throughout this tutorial, we will keep to this flow, even as we expand and refine its individual elements.

### Parsing content and templates

Now we need to import some modules. At the top of `main.py`, enter the following line.

```python
import markdown, jinja2, toml, re
```

All four of these modules are essentially parsers:

* `markdown`: This module will render Markdown.
* `jinja2`: The [Jinja templating language](https://jinja.palletsprojects.com/en/2.11.x/), which we will use to create HTML templates that we can enhance with Python-esque code.
* `toml`: We will use [TOML](https://github.com/toml-lang/toml) (Tom's Obvious, Minimal Language) for post frontmatter and global configuration.
* `re`: We'll use Python's regular expressions (regex) module for some additional, very light, parsing not provided by the three packages above.

Now that we have our parsers, let's add some content to parse. Add a TOML string for global site configuration at the top of the `main` function.

```python
def main():
    config_string = """
    title = "My blog"
    """
```

For now, this just defines the title of our site. Change it to whatever you want. To load this config, we'll use `toml.loads` on its content. Go to the `load_config` function at the top of `main.py` and give it the following parameter and content.

```python
def load_config(config_string):
    return toml.loads(config_string)
```

To use this function, go back to the `main` function and pass `config_string` to this line in the `main` function.

```python
    config = load_config(config_string)
```

Now let's create a couple of content strings below the config string. We're going to format these strings with a block of TOML metadata terminated by a row of five plus signs (`+++++`). The rest of the string will contain Markdown-formatted text. Add this block of code below the definition of `config_string` in the `main` function.

```python
    content_strings = ["""
title = "My first entry"
date = 2021-02-14T11:47:00+02:00
+++++

Hello, welcome to my **blog**
""",
"""
title = "My second entry"
date = 2021-02-15T17:47:00+02:00
+++++

This is my second post.
"""]
```

We'll parse these strings in our `load_content_items` function. Give the function a `content_strings` parameter and add the following code.

```python
def load_content_items(content_strings):
    items = []
    for item in content_strings:
        frontmatter, content = re.split("^\s*\+\+\+\+\+\s*$", item, 1, re.MULTILINE)
        item = toml.loads(frontmatter)
        item['content'] = markdown.markdown(content)

        items.append(item)

    # sort in reverse chronological order
    items.sort(key=lambda x: x["date"],reverse=True)

    return items
```

Here we use a _for_ loop to construct a list of items from our item strings. For each one, we split up the frontmatter and content on a regular expression that will match a line of text containing five plus signs. We pass in `1` as `re.split`'s `maxsplit` parameter to ensure that we only split on the first matched line, and `re.MULTILINE` so that our regex will work correctly in a multiline string.

We then use `toml.loads()` to convert the frontmatter into a dictionary. Finally, we convert the Markdown in `content` into HTML and add it to the dictionary we just created. The result will be a dictionary that looks something like this:

```python
{
    'title': 'My first entry',
    'date': datetime.datetime(2021, 2, 14, 11, 47, tzinfo=<toml.tz.TomlTz object at 0x7f4032da6eb0>),
    'content': '<p>Hello, welcome to my <strong>blog</strong>.</p>'
}
```

Finally, since this is a blog site, we're sorting our `items` dictionary in reverse chronological order. We do this by using Python's `list.sort` method's custom sort functionality to sort by each list entry's `date` value. The `key` parameter takes a function which it will pass each value into and use the return value to sort the list. For brevity, we've created an in-line anonymous function using a [lambda expression](https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions).

Back in our `main` function, let's pass `content_strings` to the `load_content_items` function call.

```python
    content = load_content_items(content_strings)
```

Now let's create a template string below the content strings. This is just some HTML with Jinja code in `{{ }}` and `{% %}` blocks. Add this code block beneath the definition of `content_strings` in the `main` function.

```python
    template_string = """
<!DOCTYPE html>
<html>
    <body>
        <h1>{{ config.title }}</h1>
        {% for post in content %}
        <article>
            <h2>{{ post.title }}</h2>
            <p>Posted at {{ post.date }}</p>
            {{ post.content }}
        </article>
        {% endfor %}
    </body>
</html>
"""
```

Each of the values inside `{{ }}` blocks is something we've assembled in the preceding code: `config.title` from the config strings, `content` from the content strings, and the individual values inside the Jinja [for loop](https://jinja.palletsprojects.com/en/2.11.x/templates/#for) from each item in the `content` list. Note that in Jinja, `post.title` is equivalent to `post["title"]`.

To load this template, we will add the following parameter and code to the `load_templates` function.

```python
def load_templates(template_string):
    return jinja2.Template(template_string)
```

We'll also change the `load_templates` function invocation in the `main` function.

```python
    templates = load_templates(template_string)
```

### Rendering the site

Now let's populate the template with our config and content data. We'll do this using the template's `render()` method. This method takes a list of keyword arguments which it will use to resolve the variable references template's `{{ }}` and `{% %}` blocks.

In the `render_site` function, add the following code:

```python
def render_site(config, content, template):
    print(template.render(config=config, content=content))
```

As our `render_site` invocation in `main` already takes the correct arguments, we can run our code now. The result should look like this:

```html
<!DOCTYPE html>
<html>
    <body>
        <h1>My blog</h1>
        
        <article>
            <h2>My second entry</h2>
            <p>Posted at 2021-02-15 17:47:00+02:00</p>
            <p>This is my second post.</p>
        </article>
        
        <article>
            <h2>My first entry</h2>
            <p>Posted at 2021-02-14 11:47:00+02:00</p>
            <p>Hello, welcome to my <strong>blog</strong></p>
        </article>
        
    </body>
</html>
```

![Proof of concept output](/images/tutorials/static-site-generator/poc_run.png)

We now have the core of our SSG. Modify the content of one of the content strings and the output will change. Add new variables to each content file's frontmatter and the template, and they will propagate through without any changes to the Python code.

Next, let's create and ingest some files.

## Blog generator

First, we need to create a directory structure. In the file pane of your repl, create four directories: `content`, `content/posts`, `layout` and `static`. Your file pane should now look like this:

![](/images/tutorials/static-site-generator/input-dirs.png)

We will put our Markdown files in `content/posts`, our Jinja files in `layout` and unprocessed files like CSS stylesheets and images in `static`. We're using `content/posts` so we can create different content types later on, such as undated pages like "About".

### Creating input files

First, we'll create our config file `config.toml`. In addition to the title value, we'll give it a base URL based on our repl's URL.

`config.toml`
```
title = "My blog"
baseURL = "https://YOUR-REPL-NAME-HERE.YOUR-REPLIT-USERNAME.repl.co"
```

Replace the all-caps text with the relevant values.

Now let's put our content strings into post files. Create two files with the following content:

`content/posts/first-post.md`
```
title = "My first entry"
date = 2021-02-14T11:47:00+02:00
+++++

Hello, welcome to my **blog**.
```

`content/posts/second-post.md`
```
title = "My second entry"
date = 2021-02-15T17:47:00+02:00
+++++

This is my second post.
```

Make as many additional posts as you want. Just remember to give each one a title, correctly formatted datestamp and some Markdown content. File names should be lowercase with no spaces, ending in the `.md` file extension.

In contrast to our proof of concept, this will be a multi-page website, so we're going to create three HTML files in our `layout` directory: `index.html`, `post.html` and `macros.html`. 

* `index.html` will be the template for our homepage, showing a list of blog posts in reverse chronological order.
* `post.html` will be the template for post pages, containing their rendered Markdown content.
* `macros.html` will not be a template, but a container file for Jinja [macros](https://jinja.palletsprojects.com/en/2.10.x/templates/#macros). These are reusable snippets of HTML that we can use in our templates.

Create three files and populate them as follows.

`layout/index.html`
```html
<!DOCTYPE html>
<html>
    {% import "macros.html" as macros %}
    {{ macros.head(config.title) }}
    <body>
        <h1>Posts</h1>
        <ul>
        {% for post in content.posts %}
            <li><a href="{{ post.url }}">{{ post.title }}</a> (posted at {{ post.date }})</li>
        {% endfor %}
        </ul>
    </body>
</html>
```

`layout/post.html`
```html
<!DOCTYPE html>
<html>
    {% import "macros.html" as macros %}
    {{ macros.head(this.title) }}
    <body>
        <h1>{{ this.title }}</h1>
        <p>Posted at {{ this.date }}</p>
        {{ this.content }}
        <p><a href="{{ config.baseURL }}">Return to the homepage &#10558;</a></p>
    </body>
</html>
```

(`&#10558;` is the [HTML entity](https://developer.mozilla.org/en-US/docs/Glossary/Entity) for "⤾".)

`layout/macros.html`
```html
{% macro head(page_title) -%}
<head>
    <title>{{ page_title }}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
{% endmacro -%}
```

The only macro we've defined is `head`, which will generate an HTML `<head>` tag containing an appropriate title for the page as well as a link to our website's stylesheet. Let's create that now.

In the `static` directory, create a subdirectory called `css`. Then create a file called `style.css` in this subdirectory and add the following code.

`static/css/style.css`
```css
h1 {
    font-family: sans-serif;
    margin-top: 2em;
}

body {
    font-family: serif;
    margin: 0 auto;
    max-width: 40em;
    line-height: 1.2em;
}
```

These are a couple of small style adjustments to improve readability and differentiate our site from an unstyled page. Feel free to add your own touches.

### Ingesting input files

Now that we've created our input files, let's write some code in `main.py` to read them and create our website. To do this, we'll be iterating our proof-of-concept code.

First, at the top of the file, let's import some new modules for dealing with reading and writing files and directories. Add the second line below the first in `main.py`.

```python
import jinja2, markdown, toml, re
import os, glob, pathlib, shutil, distutils.dir_util
```

Then delete the `config_string`, `content_strings` and `template_string` definitions from the `main` function.

### Ingesting site configuration

First, let's ingest the configuration file. Change the `load_config` function as follows.

```python
def load_config(config_filename):
    with open(config_filename, 'r') as config_file:
        return toml.loads(config_file.read())
```

Now change this line in the `main` function:

```python
    config = load_config(config_string)
```

To this:

```python
    config = load_config("config.toml")
```

### Ingesting posts

Next, we will ingest the `content/posts` directory. Change the content of the `load_content_items` function as follows.

```python
def load_content_items(content_directory):
    items = []
    for fn in glob.glob(f"{content_directory}/*.md"):
        with open(fn, 'r') as file:
            frontmatter, content = re.split("^\+\+\+\+\+$", file.read(), 1, re.MULTILINE)
        item = toml.loads(frontmatter)
        item['content'] = markdown.markdown(content)

        items.append(item)
    
    # sort in reverse chronological order
    items.sort(key=lambda x: x["date"],reverse=True)
    
    return items
```

Instead of looping through a list of strings, we're now looping through all files ending in `.md` in the `content/posts` directory using the [`glob`](https://docs.python.org/3/library/glob.html) method and parsing their contents.

Since we're now building a real site with multiple pages, we'll need to add a couple of additional attributes to our `post` dictionary. Namely, `slug` and `url`.

* `slug` will be the name of the post's Markdown file without the `.md` extension.
* `url` will be a partial URL including the post's date and slug. For the first post, it will look like this: `/2021/02/14/first-post/`

Let's create the slug by using `os.path.basename` to get our file's filename without its full path (i.e. `first-post.md` rather than `content/posts/first-post.md`). Then we'll use `os.path.splitext` on the result to split the filename and extension, and we'll discard the extension. Add the following line to the _for_ loop, below where we define `item['content']`.

```python
    item['slug'] = os.path.splitext(os.path.basename(file.name))[0]
```

We'll then use this slug along with our post's date to construct the full URL. We'll use Python's [string formatting](https://docs.python.org/3/library/string.html#string-formatting) to ensure correct zero-padding of single-digit values for months and days. Add this line below the one we just added:

```python
    item['url'] = f"/{item['date'].year}/{item['date'].month:0>2}/{item['date'].day:0>2}/{item['slug']}/"
```

Now we can update our function invocation in `main`. Change this line:

```python
    content = load_content_items(content_strings)
```

To this:

```python
    content = { "posts": load_content_items("content/posts") }
```

Using a dictionary instead of a plain list will allow us to add additional content types in a later section of this tutorial.

### Ingesting templates

Now that we have a list of posts, let's ingest our templates so we have somewhere to put them. Jinja works quite differently from the file system and from strings, so we're going to change our `load_templates` function to create a Jinja [`Environment`](https://jinja.palletsprojects.com/en/2.11.x/api/#jinja2.Environment) with a [`FileSystemLoader`](https://jinja.palletsprojects.com/en/2.11.x/api/#loaders) that knows to look for templates in a particular directory. Change the function code as follows.

```python
def load_templates(template_directory):
    file_system_loader = jinja2.FileSystemLoader(template_directory)
    return jinja2.Environment(loader=file_system_loader)
```

Then, in the `main` function, change this line:

```python
    template = load_templates(template_string)
```

To this:

```python
    environment = load_templates("layout")
```

In the next section, we'll pass this environment to our `render_site` function where we'll load individual templates as we need them.

### Writing output files

Now let's render the site by writing some output files. We'll be using a directory named `public` for this, but you don't need to create this in your file pane – we'll do so in code. Go to the `render_site` function and replace its code with the following (remember to change the function parameters).

```python
def render_site(config, content, environment, output_directory):
    if os.path.exists(output_directory):
        shutil.rmtree(output_directory)
    os.mkdir(output_directory)
```

We do two things here: remove the output directory and all of its content if it exists, and create a fresh output directory. This will avoid errors when running our code multiple times.

Now let's write our home page by adding this code to the bottom of the function.

```python
    # Homepage
    index_template = environment.get_template("index.html")
    with open(f"{output_directory}/index.html", 'w') as file:
        file.write(index_template.render(config=config,content=content))
```

Here we use our Jinja environment to load the template at `layout/index.html`. We then open the `public/index.html` file and write to it the results of rendering `index_template` with our `config` and `content` dictionaries passed in.

The code for writing individual post files is a bit more complex. Add the _for_ loop below to the bottom of the function.

```python
    # Post pages
    post_template = environment.get_template("post.html")
    for item in content["posts"]:
        path = f"{output_directory}/{item['url']}"
        pathlib.Path(path).mkdir(parents=True, exist_ok=True)
        with open(path+"index.html", 'w') as file:
            file.write(post_template.render(this=item, config=config, content=content))
```

First we create the directories necessary to show our post URLs. To display a URL such as `2021/02/14/first-post/`, we need to create a directory named `2021` inside `public`, and then nested directories named `02`, `14` and `first-post`. Inside the final directory, we create a file named `index.html` and write our rendered template to it.

Note the values we pass to `render`: variables for this post are contained in `this` and site-wide configuration variables are contained in `config`. We also pass in `content` to allow us to access other posts. Although we aren't using this in the `post.html` template right now, it's good to have the option for future template updates.

Now we need to load our static files. Add this code to the bottom of the `render_site` function:

```python
    # Static files
    distutils.dir_util.copy_tree("static", "public")
```

All this code does is copy the file tree from our static directory into our public directory. This means that our CSS file at `static/css/style.css` can be accessed in our HTML templates as `css/style.css`. Similarly, if we create a file at `static/my-picture.jpg`, we can reference that in our HTML or Markdown as `my-picture.jpg` and it will be found and loaded.

Now we just need to update the function invocation in our `main` function. Change this line:

```python
    render_site(config, content, templates)
```

To this:

```python
    render_site(config, content, environment, "public")
```

Now run the code. You should see the `public` directory appear in your file pane. Look inside, and you'll see the directories and files we just created. To see your site in action, run the following commands in Replit's "Shell" tab.

```
cd public
python -m http.server
```

![Shell tab](/images/tutorials/static-site-generator/shell.png)

This should bring up the Replit web view with your home page, as below. Click on each of the links to visit the post pages.

![Blog homepage](/images/tutorials/static-site-generator/homepage-blog.png)

This server will need to be restarted periodically as you work on your site.

## Generic site generator

In addition to chronological blog posts, our site could do with undated pages, such as an "About" or "Contact" page. Depending on the kind of site we want to build, we may also want photo pages, or pages including podcast episodes, or any number of other things. If we give this SSG to someone else to use, they may have their own ideas as well – for example, they may want to make a site organised as a book with numbered chapters rather than as a blog. Rather than trying to anticipate everyone's needs, let's make it so we can create multiple types of content pages, and allow the user to define those types and how they should be ordered.

This is simpler than it sounds, but will require some refactoring.

### Expanding the config file

First, let's add some content to our `config.toml` file to give this customization a definite shape. Add these lines below the definition of `baseURL`.

`config.toml`
```toml
title = "My site"
baseURL = "https://YOUR-REPL-NAME-HERE.YOUR-REPLIT-USERNAME.repl.co"

types = ["post", "page"]

post.dateInURL = true
post.sortBy = "date"
post.sortReverse = true

page.dateInURL = false
page.sortBy = "title"
page.sortReverse = false
```

Here we've told our site generator we want two kinds of pages – a *post* type, which we will use for blog posts, and a *page* type, which we will use for evergreen content such as contact details and general site information. Below that, we've used TOML's dictionary syntax to specify some characteristics of each type.

* Posts will have a date in their URLs and will be sorted in reverse date order when listed.
* Pages will not have a date in their URLs and will be sorted alphabetically by their title.

By creating these settings, we'll make it possible to sort a content type by any attribute in its frontmatter.

### Ingesting user-defined content

To implement this, let's first import a new module at the top of `main.py`. Add the third line to your file, below the first two.

```python
import jinja2, markdown, toml, re
import glob, pathlib, os, shutil, distutils.dir_util
import inflect
```

The [`inflect`](https://pypi.org/project/inflect/) module allows us to turn singular words into plurals and vice versa. This will be useful for working with the `types` list from our configuration file. Change the `load_config` function to resemble the following.

```python
def load_config(config_filename): 

    with open(config_filename, 'r') as config_file:
        config = toml.loads(config_file.read())
    
    ie = inflect.engine()
    for content_type in config["types"]:
        config[content_type]["plural"] = ie.plural(content_type)

    return config
```

This code will expand the dictionaries we load from our config file with a key containing the type's plural. If we were to print out our `config` dictionary at this point, it would look like this:

```python
{
    "title": "My site"
    "baseURL": "https://YOUR-REPL-NAME-HERE.YOUR-REPLIT-USERNAME.repl.co"
    "types": ["post", "page"]
    "post": {
        "plural": "posts",
        "dateInURL": true,
        "sortBy": "date",
        "sortReverse": true
    },
    "page": {
        "plural": "pages",
        "dateInURL": true,
        "sortBy": "title",
        "sortReverse": false
    }
}
```

Now let's modify `load_content_items` to deal with multiple, user-defined content types. First, we need to change the function to take our `config` dictionary as an additional parameter. Second, we'll put all of our function's current content in an inner function named `load_content_type`. Your function should now look like this:

```python
def load_content_items(config, content_directory):

    def load_content_type(content_type):
        items = []
        for fn in glob.glob(f"{content_directory}/*.md"):
            with open(fn, 'r') as file:
                frontmatter, content = re.split("^\+\+\+\+\+$", file.read(), 1, re.MULTILINE)
            
            item = toml.loads(frontmatter)
            item['content'] = markdown.markdown(content)
            item['slug'] = os.path.splitext(os.path.basename(file.name))[0]
            item['url'] = f"/{item['date'].year}/{item['date'].month:0>2}/{item['date'].day:0>2}/{item['slug']}/"
    
            items.append(item)
    
        # sort in reverse chronological order
        items.sort(key=lambda x: x["date"],reverse=True)

        return items
```

To load from the correct directory, we will need to change this line:

```python
        for fn in glob.glob(f"{content_directory}/*.md"):
```

To this:

```python
        for fn in glob.glob(f"{content_directory}/{config[content_type]['plural']}/*.md"):
```

Here we're using the plural of the content type we defined earlier. This will ensure that items of type "post" can be found in "content/posts" and items of type "page" can be found in "content/pages".

We now need to add code to respect our configuration settings. We'll do this by changing this line:

```python
            item['url'] = f"/{item['date'].year}/{item['date'].month:0>2}/{item['date'].day:0>2}/{item['slug']}/"
```

To this:

```python
            if config[content_type]["dateInURL"]:
                item['url'] = f"/{item['date'].year}/{item['date'].month:0>2}/{item['date'].day:0>2}/{item['slug']}/"
            else:
                item['url'] = f"/{item['slug']}/"
```
    
Now we'll sort according to the configuration file by changing this line:

```python
    # sort in reverse chronological order
    items.sort(key=lambda x: x["date"],reverse=True)
```

To this:

```python
    # sort according to config
    items.sort(key=lambda x: x[config[content_type]["sortBy"]],
               reverse=config[content_type]["sortReverse"])
```    

We can complete this `load_content_items` function by writing some code to iterate through our site's configured content types, calling `load_content_type` for each one. Add the following code below the definition of `load_content_type` (ensure that it's de-indented so as to be part of `load_content_items`).

```python
    content_types = {}
    for content_type in config["types"]:
        content_types[config[content_type]['plural']] = load_content_type(content_type)

    return content_types
```

Then in the `main` function, change this line:

```python
    content = { "posts": load_content_items("content/posts") }
```

To this:

```python
    content = load_content_items(config, "content")
```

### Rendering user-defined content

Now we need to change our output code in `render_site` to render each content type with its own template. As we did with `load_content_items`, we'll start by moving the post-creating _for_ loop into an inner function, this time named `render_type`. Alter your `render_site` function so that it resembles the following.

```python
def render_site(config, content, environment, output_directory):

    def render_type(content_type): # <-- new inner function
        # Post pages
        post_template = environment.get_template("post.html")
        for item in content["posts"]:
            path = f"public/{item['url']}"
            pathlib.Path(path).mkdir(parents=True, exist_ok=True)
            with open(path+"index.html", 'w') as file:
                file.write(post_template.render(this=item, config=config))

    if os.path.exists(output_directory):
        shutil.rmtree(output_directory)
    os.mkdir(output_directory)

    for content_type in config["types"]: # <-- new for loop
        render_type(content_type)

    # !!! post for loop moved to inner function above

    # Homepage
    index_template = environment.get_template("index.html")
    with open("public/index.html", 'w') as file:
        file.write(index_template.render(config=config, content=content))


    # Static files
    distutils.dir_util.copy_tree("static", "public")
```

Then change this line in the `render_type` inner function that loads the post template:

```python
        post_template = environment.get_template("post.html")
```

Into this line that loads a template for the provided content type:

```python
        template = environment.get_template(f"{content_type}.html")
```

Alter the _for_ loop below that line to use the content type's plural.

```python
        for item in content[config[content_type]["plural"]]:
```

Finally, change `post_template` in the loop's final line to `template`.

```python
                file.write(template.render(this=item, config=config, content=content))
```

### Adding a new content type

Now that we've done all that work to generify our code, all that's left is to create our pages. First, let's create a page template at `layout/page.html`. Use the following code.

```html
<!DOCTYPE html>
<html>
    {% import "macros.html" as macros %}
    {{ macros.head(this.title) }}
    <body>
        <h1>{{ this.title }}</h1>
        {{ this.content }}
        <p><a href="{{ config.baseURL }}">Return to the homepage &#10558;</a></p>
    </body>
</html>
```

This is just our `post.html` template without the date.

Now create a new subdirectory in `content` called `pages`. Inside that subdirectory, create a file named `about.md` and put the following content in it.

```
title = "About"
+++++

This website is built with Python, Jinja, TOML and Markdown.
```

This is sufficient to create a new page at `/about/`, but it won't be linked anywhere. For that, we'll need to create a global navigation bar for our site. Create the following additional macro in `layout/macros.html`.

```html
{% macro navigation(pages) -%}
<nav><ul>
    {% for page in pages %}
        <li><a href="{{ page.url }}">{{ page.title }}</a></li>
    {% endfor %}
</ul></nav>
{% endmacro -%}
```

Then include the macro in `index.html`, `page.html` and `post.html` by inserting the following code just underneath `{{ macros.head(this.title) }}`.

```html
    {{ macros.navigation(content.pages) }}
```

Finally, add the CSS below to `static/css/style.css` to apply light styling to the navigation bar.

```css
nav ul
{
    list-style-type: none;
    text-align: right;
}
```

Run your code and preview your site with `cd public && python -m http.server` in the repl shell, and you should see something like this:

![Static site generator functionality](/images/tutorials/static-site-generator/generator_functionality.gif)

## Where to next?

We've created a flexible SSG capable of generating many different types of HTML pages, which can be served from any web server. Apart from fleshing out the templates and adding new content types, you might want to expand the generator's functionality to allow things like:

- Categories or tags for content items.
- Ability to generate an RSS or Atom feed for people to subscribe to.
- A way to mark items as drafts, so they won't be included when the site is compiled.
- Navigation features like next and previous item links.
- Useful error messages for malformed directory structures and configuration files.

You can find our SSG repl below:

<iframe height="800px" width="100%" src="https://replit.com/@ritza/python-static-side-generator?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
