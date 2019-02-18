# Importing Packages

You can require any package package on Repl.it using Python, JavaScript, or Ruby.  These packages
are installed on-the-fly.

## Searching and Adding Packages

On a Python or JavaScript repl, you can search for a package to install by clicking on the
<img
  src="https://replit.github.io/media/misc/libraries_hover.png"
  style="height: 24px; vertical-align:text-bottom; width: 21px; margin: 0 3px; display: inline-block;"
/>
icon on the sidebar in the workspace.  Simply search for the package you want, and select it
to install the package or to view its documentation.  Clicking on the Add Package icon will
put it in a dependencies file (such as `requirements.txt` or `package.json`).  If no such file exists,
it will be created for you.

Python packages are searched through [PyPI](https://pypi.org/), the Python Package Index.
JavaScript packages are searched through [npm](https://www.npmjs.com/), Node Package Manager.
Unless otherwise specified, the repl will always attempt to install the latest version of each
package.

Once installed, packages will not need to be re-installed for the user's session (the session ends
when the user leaves the page).  If the page is refreshed, the packages will be installed again on
the first run.

## Direct Imports

You can also directly import a package without a dependencies file by requiring it:

Python:

```python
import flask
```

JavaScript:

```javascript
const express = require('express');
```

Doing so will install the latest version of the package into your repl.

Ruby works a bit differently.  To import a package in Ruby, you'll have to use `bundler/inline`
to define the gemspec within the code.  As an example, it may look like this:

```ruby
require 'bundler/inline'

gemfile true do
 source 'http://rubygems.org'
 gem 'colorize'
end
```

However, wherever possible, we recommend using a file to manage dependencies.

## Dependencies Files

Each language has a specific file that can be used to describe the project's required packages:

* Python: `requirements.txt`
* JavaScript (Node.js): `package.json`
* Ruby: `Gemfile`

### Python

In a `requirements.txt` file, you list your packages, one per line.  You can optionally specify
the version of each package.  For example, given the following `requirements.txt`:

```
Framework==0.9.4
Library>=0.2
Other
```

It will install `Framework` at exactly version 0.9.4, while installing `Library` at version
`0.2` or greater.  `Other` will be installed at the latest version.

### JavaScript

Note that `package.json` files are only for Nodejs/Express repls (they do not work in HTML/CSS/JS
repls).  A package.json contains more information about the project, but also lists the
dependencies.  As an example, here is the `package.json` file included in our
[express template](/languages/express).

```json
{
  "name": "app",
  "version": "0.0.1",
  "description": "",
  "main": "index.js",
  "scripts": {
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "latest",
    "body-parser": "latest",
    "sqlite3": "latest"
  }
}
```

Note that all the packages are being installed with their latest version.  You can replace
"latest" with a specific version number to install that version, or precede it with a carat
`^` to indicate "this version or newer".  For example:

```json
  "dependencies": {
    "express": "^4.16.3",
    "body-parser": "latest",
    "sqlite3": "3.1.12"
  }
```

This will install `express` at version 4.16.3 or newer, `body-parser` at the latest version,
and `sqlite3` at exactly version 3.1.12.

### Ruby

In Ruby, you can use a `Gemfile`.  In this file, you simple start with
`source 'https://rubygems.org'` followed by the gems you want to install.  As an example,
from our [rails boilerplate](https://repl.it/@timmy_i_chen/rails-template), a `Gemfile` may
look like:

```ruby
source 'https://rubygems.org'

gem 'rails', '~> 5.1.5'
gem 'sqlite3'
gem 'tzinfo-data'
```