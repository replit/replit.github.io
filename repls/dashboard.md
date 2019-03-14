# Repls Dashboard

## Managing Your Repls

The repls dashboard is the place to manage and keep track of all your repls.  Repls are
listed in order of when they were created.  Each repl has its own three-dot menu at the
far right.  Bringing up this menu will allow you to...

* Edit the repl (change its name, description, and tags)
* View its history
* Fork the repl
* Pin it to your profile
* Delete the repl
* Toggle privacy settings (Subscribers only)

### Starring Repls

You can star a repl to mark it as a favorite.  Starred repls can be easily accessed by
clicking on the star slider at the top of your dashboard.  There is no limit to how many
repls are starred.  Only you can see which repls are starred; they will not appear in
your profile.

### Adding Tags

You can add tags to your repl on your dashboard by clicking on the three dots to bring
up the menu, and clicking on "Edit".  From there, you can add tags, up to a maximum of
five, separated by commas.

![](https://replit.github.io/media/dashboard/search-add-tags.png)

Tags are also visible to you only; they will not appear in your profile.

## Searching

### Basic Search

Typing keywords into the search bar will filter repls whose name, language, or tags
match any of the keywords (separated by spaces).

Repls only need to match one of the keywords, tags, or special filters
(language/title/tag) in order to be included in the results.

Example:

**Search Query:** `draft repl python3`

**Returns:**
All repls that satisfy one or more of the following conditions:

* has `draft` in the title
* has `repl` in the title
* is tagged with `draft`
* is tagged with `repl`
* is a `python3` repl

### Search by Language

You can search for repls in a specific language by using the `language:` filter.
Typing in `language:` followed by the language you want to filter by will prompt
you with language suggestions.

Your search term will need to be the language name we use internally, which is why
we suggest selecting from the provided list.  For example, to search for all C++11
languages, you would search `language:cpp11`.  To search for HTML, CSS, JS repls,
you would search `language:html`.  This filter is case sensitive.

### Search by Title

Since plain searches include results with matching tags, you can search within repl
titles only using the `title:` filter.  Your search term may not include spaces.
This filter is case insensitive.

Example:

**Search Query:** `title:best project`

**Returns:**
Repls that satisfy one or more of the following conditions:

* has `best` in the title
* has `project` in the title
* is tagged with `project`

### Search by Tag

You can also search by tags by using the `tags:` filter.  This will result in only
repls that match the provided tag.  This search is case sensitive and looks for an
exact match.

Example:

**Search Query:** `tags:good`

**Will NOT Match:**

* repls tagged with "GOOD"
* repls tagged with "goody"
* repls tagged with "good stuff"

It will only match repls tagged with "good".
