# Storing Secrets in .env

⚠️  **Note** - the `.env` file is deprecated in favour of our [new UI for setting environment variables](./secrets-environment-variables). The new UI is slowly rolling out to users. If you don't see it yet, you can continue to use the `.env` file as described below and your data will be automatically migrated to the UI soon. ⚠️

Building an app that uses an external service usually requires a key or password. Sharing these secret keys (via public repls) would allow other users to access your services. With Replit, you can create an `.env` file to safely store your secrets. This means you can safely share your code, without sharing your secrets.

## `.env` Files

`.env` files are used for declaring environment variables. On Replit, `.env` files are only visible to the owner of the repl. Other users and guests viewing a public repl will not be able to see the contents of the `.env` file, nor will they be able to access it by downloading the repl or forking it. **The only exception to this is Multiplayer – other users in your Multiplayer session can view your `.env` file.**

The syntax for these files are to list, one per line, `VARIABLE=VALUE` where `VARIABLE` is the name of the variable and `VALUE` is the value associated with that variable. Quoted values and comments are also supported.

A sample `.env` file might look like this:

```
# super secret token
TOKEN=38zdJSDF48fKJSD4824fN
DB_USERNAME="admin" # this one has quotes :)
DB_PASSWORD=w0ws0secure!!
```

## Reading .env Files

Your repl will automatically load the contents of your `.env` file into your environment so that it can be read. Here are the ways you can access them in Python and JavaScript, given the following `.env` file:

```
# super secret token
TOKEN=38zdJSDF48fKJSD4824fN
DB_USERNAME="admin" # this one has quotes :)
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

For security reasons, we do not recommend storing `.env` files in HTML repls, as they would be served to anyone who requests `/.env`.

## Example

Here is a simple example of using `.env` in Python. You can drag out the filetree from the left to see the files, or click on the icon in the top right to open as its own page. To try it out, do the following:

1. Run the repl. The secret `TOKEN` won't be printed.
2. Fork it.
3. Create a file called `.env` with the content `TOKEN=hello!`.
4. Run the repl again. You should see `hello!` printed.
5. No one else see your secret when they run your repl.

<iframe height="400px" width="100%" src="https://repl.it/@turbio/python-dotenv-example?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
