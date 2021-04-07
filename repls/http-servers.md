# Deploying HTTP Servers

For deploying HTTP servers, any framework can be used so long as the package can be imported or the port can be opened. However, we also provide templates for Ruby on Rails, Django, Node (Express), and Sinatra.

## Deploying an HTTP Server

To deploy an HTTP server on Replit:
1. Write the code that imports the required libraries or frameworks.
2. Begin listening on a port, and your server will start up.
3. A new pane should appear in your editor with the URL to your web app, along with a preview of the app.

Once deployed, the server will continue to run in the background, even after you close the browser tab. The server will stay awake and active until an hour after its last request, after which it will enter a sleeping stage. A sleeping repl will be woken up as soon as it receives another request; there is no need to re-run the repl. However, if you make changes to your server, you will need to restart the repl in order to see those changes reflected in the live version.

Below is an example of a simple HTTP server running Flask in Python3, displaying HTML from `templates/index.html`. Feel free to fork and play with the code as you'd like. 

<iframe height="400px" width="100%" src="https://repl.it/@kodumbeats/flasktemplate?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

Our [package manager](https://github.com/replit/upm) will automatically handle dependency files in your repls. See our documentation on [packages](/repls/packages) for more information on how to install and manage dependencies.

Private keys to external services or APIs can be kept in an `.env` file. See our documentation on [secret keys](/repls/secret-keys).

If you are using Django and you need access to specific bash commands to configure the server, please see [this Django template](https://repl.it/@masfrost/Django-Boilerplate).

## Persistence and Takedown Requests

Note that a repl's public link will persist, even after the repl has been deleted. You can clear a repl of its server code before deleting it in order to prevent it from loading. If you need your web app taken down, please contact us at [contact@replit.com](mailto:contact@replit.com).
