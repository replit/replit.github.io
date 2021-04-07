# Automatically Get Metadata about a repl (username and project slug)

In some cases it's useful to automatically retrieve metadata about a repl from within that repl.

You can find **owner** and **project name** of the current repl in environment variables `REPL_OWNER` and `REPL_SLUG` respectively.

![owner and slug](/images/misc/ownerproject.png)

For example, in Python:

```python
import os
print(os.getenv("REPL_OWNER"))
print(os.getenv("REPL_SLUG"))

# Output
# ritza
# repl-environment-variables
```

**Note:** The '@' is not included in the environment variable so to build the full project URL you need to manually include it, for example:

```python
import os
user = os.getenv("REPL_OWNER")
slug = os.getenv("REPL_SLUG")
print(f"This project can be found at https://repl.it/@{user}/{slug}")
```

This is useful, for example, when having homework assignments automatically submit themselves to an [autograding server](/Teams/Testing).