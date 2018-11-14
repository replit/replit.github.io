# Using Secret Keys

Building an app that uses a service (such as an API) or connects to an external
database usually requires a key, username, and/or password.  Since many repls are
public, it is not advised to share these private keys, as they allow other users
to access your services.  To that end, we provide the ability to create an `.env`
file to store your secrets.

## `.env` Files

`.env` files are used for declaring environment variables.  On Repl.it, `.env`
files are only visible to the owner of the repl.  Other users and guests viewing
a public repl will not be able to see the contents of the `.env` file, nor will
they be able to access it by downloading the repl or forking it.

The syntax for these files are to list, one per line, `VARIABLE=VALUE` where
`VARIABLE` is the name of the variable and `VALUE` is the value associated with
that variable.  Blank lines are ignored, and values do not have any inherent
data type (usually interpreted as string), so they do not need quotation marks.
Any included quotation marks will be considered as part of the value.

A sample `.env` file might look like this:

```
TOKEN=38zdJSDF48fKJSD4824fN
DB_USERNAME=admin
DB_PASSWORD=w0ws0secure!!
```

## Reading env Files

`.env` files can be read and parsed manually, in a Repl, we automatically load the
contents of your `.env` file into your environment so that they can be read.  Here
are the ways you can access them in Python, JavaScript, and Ruby, given an the
following `.env` file:

```
TOKEN=38zdJSDF48fKJSD4824fN
DB_USERNAME=admin
DB_PASSWORD=w0ws0secure!!
```

### Python

```python
import os
print(os.getenv("DB_USERNAME"))
# prints 'admin'
```

### JavaScript

```javascript
console.log(process.env.TOKEN)
// prints '38zdJSDF48fKJSD4824fN'
```

### Ruby

```ruby
puts ENV["DB_PASSWORD"]
# prints 'old_passw0rd-w00t'
```

For security reasons, we do not recommend using `.env` files with HTML/CSS/JS
repls (without a back-end) as the contents can be read by savvy visitors.

## Example

Here is a simple example of using the `dotenv` package in Python.  You can
drag out the file tree from the left to see the files, or click on the icon
in the top right to open as its own page.  To try it out, do the following:

* Run the repl to see the current secret token
* Fork the repl (the existing `.env` file will not be copied over)
* Rename the existing `env` file to `.env`
* Run the repl again to see the output

<iframe height="400px" width="100%" src="https://repl.it/@timmy_i_chen/python-dotenv-example?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
