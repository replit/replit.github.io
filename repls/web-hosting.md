# Web Hosting

## Hosting a Web Site

Web Pages written in HTML, CSS, and JavaScript can be hosted on Repl.it.

HTML/CSS/JS repls are hosted on Repl.it and given a unique URL that can be
shared with your friends, family, peers, and clients.  After running a repl,
your repl will be hosted at the URL provided in the `result` tab.

## URL Format

The repl will be hosted with the following URLs:
* `https://REPL-NAME--USERNAME.repl.co`
* `http://USERNAME.repl.co/REPL-NAME`
* `http://REPL-NAME.USERNAME.repl.co`

Where `REPL-NAME` is the name of the repl and `USERNAME` is the owner's username.
If an anonymous repl is created, the username used in the URL will be `five-nine`.

Note that if your username contains underscores `_`, they will be converted to dashes
in the URL.

## Updating Web Sites

Changes made to your repl will not be reflected in the live version until
the web project is re-run.  Running a web repl will update its live version.

Note that a repl's public link will persist, even after the repl has been deleted.
You can clear a repl of it's server code before deleting it in order to prevent it
from loading.

## Custom Domains

You can point a custom domain to a hosted repl.  This includes both [static sites](#hosting-a-web-site) and [HTTP servers](/site/docs/repls/http-servers).  To start, click on the pencil icon next to the URL for your hosted repl:

![screenshot of edit button](https://replit.github.io/images/repls/edit-custom-domain-icon.png)

Enter the domain that you own:

![screenshot of cname instructions](https://replit.github.io/images/repls/custom-domain-cname.png)

You will be prompted to add a `CNAME` record to your domain pointing at a `repl.co` link.  Go to the service that manages your domain and find the section that allows you to add Resource Records.

Add a new entry by entering:
* `name`: this will be the subdomain pointing to the repl.  Some services do not allow you to leave it blank (root).  You can set it as www to point www.yourdomain.com to your repl.
* `type`: `CNAME`
* `data`: This should be the repl.co link from the Repl.it custom domain popover.  It should contain a long string of random numbers and letters.

Here's an example of how it might look, using Google Domains:

![screenshot of cname instructions](https://replit.github.io/images/repls/google-setup-custom-domain.png)

It may take some time to actually update.  If you used `www` for the name, you should enter `www.yourdomain.com` on the Repl.it interface.  Once connected, click the big green button to finish and your domain should be linked!

You can unlink your domain at any time by clicking on the pencil icon and clicking "Unlink".

## Example

Here's an example of a hosted webpage using p5.js.  The live, full-screen version
can be found [here](https://p5-demo--timmy_i_chen.repl.co).

<iframe height="800px" width="100%" src="https://repl.it/@timmy_i_chen/p5-demo?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Takedown Requests

If you require your hosted web page to be taken down, please contact
us at [contact@repl.it](mailto:contact@repl.it).