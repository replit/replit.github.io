# Web Hosting

## Hosting a Web Site

Web Pages written in HTML, CSS, and JavaScript can be hosted on Repl.it.
HTML/CSS/JS repls are hosted on Repl.it and given a unique URL that can be
shared with your friends, family, peers, and clients.

After running a repl, your repl will be hosted at the URL provided in the `result` tab.

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
You can clear a repl of its server code before deleting it in order to prevent it
from loading.

## Custom Domains

Any hosted repl can be linked to a domain that you own. This includes both [static sites](#hosting-a-web-site) and [HTTP servers](/site/docs/repls/http-servers). To start, click on the pencil icon next to the URL for your repl:

![screenshot of edit button](https://replit.github.io/images/repls/edit-custom-domain-icon.png)

Enter the full domain where you'd like the repl to be accessible from, this includes subdomains.

![screenshot of cname instructions](https://replit.github.io/images/repls/custom-domain-cname.png)

You will be prompted to add a `CNAME` record to your domain pointing at your repl's special `repl.co` domain. Go to your domain registrar and find the section that allows you to add DNS records.

Add a new entry with the following information:
* The type should be `CNAME`.
* `name` or `hostname` will be the subdomain you want, or you can enter `@` if you'd like to use the full domain. Some services do not allow `CNAME`s to be at the top level, we recommend instead using www and making sure you enter www.yourdomain.com in your repl.
* `data` or `target` should be the special repl.co link you got when you started linking your repl. It should contain a long string of random numbers and letters at the beginning.

For example:
- If I want to serve a repl from `example.com` I'd enter `example.com` in the repl linking box then in my registrar the target should be `@`.
- If I want to serve a repl from `coolproject.example.com` I'd enter `coolproject.example.com` in the repl linking box and `coolproject` in the target field on my registrar.

The exact steps will vary between services. Here's an example of how it might look, using Google Domains:

![screenshot of cname instructions](https://replit.github.io/images/repls/google-setup-custom-domain.png)

It may take some time for the DNS record to be updated. Once connected, click the big green button to finish and your domain should be linked!

You can unlink your domain at any time by clicking on the pencil icon and clicking "Unlink".

## Example

Here's an example of a hosted webpage using p5.js.  The live, full-screen version
can be found [here](https://p5-demo--timmy_i_chen.repl.co).

<iframe height="800px" width="100%" src="https://repl.it/@timmy_i_chen/p5-demo?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Takedown Requests

If you require your hosted web page to be taken down, please contact
us at [contact@repl.it](mailto:contact@repl.it).
