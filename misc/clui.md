# CLUI, the Graphical CLI
Repl.it has created a text-based interface to interact with various aspects of your account. This page serves as documentation of the various capabilities of CLUI.

> Note: CLUI is not feature-complete and is still under active development. 

## Accessing CLUI

Navigate to https://repl.it/~/cli and the following prompt will appear:

![clui](/images/misc/clui.png)

The prompt will display in-line information about the commands which can be run.

## Commands
Expand the following top-level commands.

<details>
  <summary><b>account</b>: manage your account</summary>

  `account view-warns` <br>
  View warnings you have been issued.

  `account languages` <br>
  Manage your language preferences.

  `account change-username` <br>
  Change your username (this can only be done once).
</details>

<details>
  <summary><b>trash</b>: list and restore deleted repls</summary>

  `trash restore --title $title` <br>
  Restore a deleted repl by its title. If multiple repls exist with the same name, the most recently deleted repl will be restored.

  `trash view` <br>
  View your most recently deleted repls.

</details>

<details>
  <summary><b>team</b>: view and manage your teams</summary>

  `view` <br>
  View the members of your team
  
  `transfer-repl` <br>
  Transfer an own repl to team

</details>

<details>
  <summary><b>clear</b>: clears the screen</summary>

  `clear` <br>
  Clears screen.
</details>

## Further Reading
Check out our [blog post](https://blog.repl.it/clui) for a discussion on building CLUI.
