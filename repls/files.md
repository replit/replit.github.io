# Eval Mode / Project Mode

Repls currently run in one of two modes: Eval Mode and Project Mode. Each has different behaviors and limitations. Read on to learn more about each.

## Eval Mode

A fresh repl (with the exception of repls that begin with multiple files) begin
in **Eval Mode**.  In eval mode, you can evaluate code from the console (including
values declared in your program).

For example, in the following repl, try running the repl, then using the console
to evaluate expressions that use the defined values.

<iframe height="400px" width="100%" src="https://repl.it/@timmy_i_chen/replit-docs-eval-mode?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

If you are using python, you can also clear the console by using our custom
`replit` module:

```python
import replit
replit.clear()
```

Repls in eval mode, however, cannot support additional files of the same filetype
(e.g. only one `.py` or `.js` file, depending on the language).  If your program
programmatically creates those files, your repl will be forced into project mode.
You can always return to eval mode by ensuring you only have one file with the extension
of your language.  This means that you can have media files (like `png`, `gif` files)
and still remain in eval mode.

## Project Mode

In any language where we support multiple files, you can enter **Project Mode** by
creating a file - either by clicking on the
<img
  src="http://i.imgur.com/psW3k5D.png"
  style="height: 24px; vertical-align:text-bottom; width: 21px; margin: 0 3px; display: inline-block;"
/>
icon. Or upload one from your computer by clicking
<img
  src="https://replit.github.io/media/misc/upload_button.svg"
  style="height: 24px; vertical-align:text-bottom; width: 21px; margin: 0 3px; display: inline-block;"
/> and give it the same extension as the main file.  Once a file has been uploaded or
added, it can be dragged into any existing folder.

In project mode, you no longer have access to globally defined variables in the console.
You also cannot `import replit` to clear the console in python/python3.  However, you do
have access to multiple files and folders.  The first file (typically named `main`) will
always be the program's entry point.  You can create files both manually and programmatically.

We support uploading any file type including images, video, and audio files, which will be
displayed correctly in the browser.  These files can also be programmatically generated.

For example, you can upload an image, alter it
programmatically, and save the result to a new image.
Like this (which you can try out [here](https://repl.it/@masonclayton/rotatify)):

This will put you in project mode which behaves slightly differently than
the normal repl. Keep in mind The first file is always the entry point
(typically named main), you won't be able to evaluate code in the console
(it can only be used for STDIN), and any changes your program makes to files
will be updated live.

You can edit a file's name or delete it if you wish by clicking on the
<img
  src="http://i.imgur.com/Fsg7XB2.png"
  style="height: 24px; vertical-align:text-bottom; width: 6px; margin: 0 3px; display: inline-block;"
/>
icon beside it. If you're renaming your file, make sure you have the right
extension for it.

Two things to note about files:

1. They can be of any type/extension and you can use them in your code however you'd like.
2. Files will be placed in the current working directory, generally you'd access it through
the relative path './filename.ext'.

Here's a few examples on files in different languages:
- Ruby: [Word frequency in a file](https://repl.it/@masonclayton/Word-frequency-in-a-file)
- Java: [Classes in different files](https://repl.it/@masfrost/Classes-in-different-files)
- Python: [Reading from CSV](https://repl.it/@amasad/CSV-Example)

# File Changes

While you can programmatically create files in project mode, there are a few caveats:

- When you change a file through your program, those changes will not be reflected until
the repl stops running
- Directories/folders cannot be programmatically generated or removed
- Files cannot be deleted or renamed programmatically (but it can be done manually from the file tree )
