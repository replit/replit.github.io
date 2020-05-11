# Embedding Repls

## Embedding a Repl via `iframe`

You can embed repls in an iframe. This is useful if you want to integrate Repl.it
into your app. If your app supports [OEmbed](https://oembed.com/) -- we already
implement the standard, so simply copy and paste any Repl.it URL, and it should work.

If you'd like to embed specific code then do the following:

1. [Write your code in your favorite language](https://repl.it/languages)
2. Save
3. Share
4. Copy the embed code
5. Insert it on your site or blog

Here is an example:

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@amasad/PitifulLastingWhoopingcrane?lite=true"></iframe>

And the html snippet for this:

```html
<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@amasad/PitifulLastingWhoopingcrane?lite=true"></iframe>
```

You can also manually embed repls by using your own custom `iframe` tags.
These repls must have `?lite=true` as a query parameter to be embedded.  The
following options are also supported:

* `outputonly=1`: Include this as a query parameter if you want to hide the
editor in the embed.  Please note that the code is still accessible if the
user opens the repl on Repl.it.

Example: `https://repl.it/@timmy_i_chen/flask-boilerplate?lite=1&outputonly=1`

## Embedding on WordPress

WordPress supports OEmbed but can only embed content from an approved whitelist of websites. Check out the [WordPress documentation](https://wordpress.org/support/article/embeds/#adding-support-for-an-oembed-enabled-site) for instructions to add Repl.it to the whitelist. Once Repl.it is added, a repl URL formatted as https://repl.it/@username/repltitle will automatically embed an interactive copy of the repl into your WordPress site.

## Embedding on Medium via Embedly

To embed your Repl on Medium, simply paste the link to your repl
(https://repl.it/@username/repl-name) into your medium post and hit Enter.
It should automatically be converted to the interactive IDE, where you can
edit and run code.  To resize the embedded repl, simply click on it, then
select one of four choices that Medium presents to you.

## Editing an Embedded Repl

If anyone edits an embedded repl, it will automatically fork the repl for them
and they will be editing their own version.  If the user is logged into Repl.it
in their browser, the forked repl will become theirs and show up on their repls
dashboard.  If the owner edits an embedded repl, those changes will be saved to
the repl and become visible to others who view the embedded repl.