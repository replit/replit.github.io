
# Repl.it and GitHub: Using and contributing to open-source projects

You've probably heard of [GitHub](https://github.com), which hosts millions of coding projects that you can use or learn from.

In this tutorial, we'll see how to:

* Import open-source projects from GitHub to Repl.it so that we can run them or modify them
* Integrate your own GitHub account with your Repl.it account so that you can work on your private projects
* Push changes back to open-source projects as pull requests.

We'll use a basic Flask `hello world` app for the demonstrations. You can use this same project to follow along, or pick any other project on GitHub that interests you.

## Importing a project from GitHub and running it on Repl.it

We'll use the [Flask](https://flask.palletsprojects.com/en/1.1.x/) application available at [https://github.com/ritza-co/flask-hello-world](https://github.com/ritza-co/flask-hello-world) for demonstration purposes. To import it into Repl.it, press the `+ new repl` button, switch to the "Import From GitHub" tab, and paste in the GitHub URL, as shown below.

![**Image 1:** *Importing a repository from GitHub to Repl.it.*](/images/tutorials/06-github/06-01-github-import.png)

Press the green `Import from GitHub` button and you'll see Repl.it clone the repository and turn it into a repl. In all of our previous projects, we used the `main.py` file that Repl.it automatically creates for all new Python projects, and which it runs automatically when you press the `run` button. Note how in this GitHub project, we have no `main.py` file, and our code is instead in `mydemoapp.py`. Therefore, Repl.it will need some help from you to define how to run the project. This is configured through another special file named `.replit`. Because there was no `main.py` file, Repl.it automatically created this file and will prompt you to configure it.

![**Image 2:** *Adding a `.replit` file to indicate how the project should be run.*](/images/tutorials/06-github/06-02-configure-run-button.png)

Select the language (Python) from the first dropdown and type `python mydemoapp.py` in the "configure the run button" input. Every time you press the `run` button, Repl.it will execute the command given here. If you prefer, you can also edit the `.replit` file directly. If you click on it, you'll see it now contains the following configuration, which matches what we provided through the GUI panel. 

```
language = "python3"
run = "python mydemoapp.py"
```

If you hit the `run` button, you should see the app start. As you can see, the web application is very basic: all it can do is display a welcome message. If the configuration panel doesn't pop up automatically, you can manually create a file called `.replit` and add the configuration above to get the same result.

![**Image 3:** *Running the Flask application on Repl.it.*](/images/tutorials/06-github/06-03-mydemoapp-run.png)

Some GitHub projects are very large and complicated, and you might not be able to run everything you need directly on Repl.it, but in many cases it just works. Open-source projects can be read and run by anyone, but still have restrictions on who can push changes to them. Next we'll improve this project and request that the owner merges our changes into the original.

## Looking at the version control panel in Repl.it

Repl.it includes a version control tab which shows you information about the GitHub repository and in some cases allows you to push your changes made in Repl.it back to GitHub.

![**Image 4:** *Viewing details about the repository in the version control tab.*](/images/tutorials/06-github/06-04-version-control.png)

If you select this version control tab from the menu on the left, you'll see a summary of the linked repository. Note that it's already figured out what changes we've made, and it shows that the `.replit` file is new. It would be nice for other people who use this repository with GitHub to have the file automatically, so we might want to push the changes we made back to GitHub.

Note that the owner of the repository is `ritza-co` though, so you won't have write permissions for this repository. If you press the `commit & push` button, you'll see an error as shown below.

![**Image 5:** *You need permission to push to repositories on GitHub.*](/images/tutorials/06-github/06-05-unable-to-connect.png)

## Forking the project to your own GitHub account

Usually when contributing to open-source projects, you'll first create a "fork" of the original project. This means that you make your own version of the project and, as it's yours, you can make any changes to it that you want. If you think these changes would be useful to others too and are an obvious improvement over the original project, you can make a "pull request", which asks the owner of the original project to merge your changes into the main canonical project.

Create an account on [github.com](https://github.com) or log in to your existing one and navigate back to the original project (https://github.com/ritza-co/flask-hello-world). In the top right corner, press the `Fork` button to create a copy of the project in your own GitHub account.

![**Image 6:** *Forking a repository in GitHub.*](/images/tutorials/06-github/06-06-fork-github.png)

You should be taken to a new page in GitHub that looks very similar to the old one but which is owned by your own GitHub username. My GitHub username is `sixhobbits` so the new URL for me is https://github.com/sixhobbits/flask-hello-world (but yours will be different).

Now, instead of cloning the original project into Repl.it, create a new repl and import this fork of the project instead. Instead of going through the import UI again, you can also just create and load the relevant import URL. These URLs are in the format `https://repl.it/github/<githubproject>` so in my case I open https://repl.it/github/sixhobbits/flask-hello-world in my browser (you need to substitute your own GitHub username for this to work).

Configure the `.replit` file again and open the version control tab, as before. Under "what did you change" enter "add .repl file" or a similar message to describe what contributions you're making, and press `commit and push`.

You'll see the error again and be presented with the option to connect your Repl.it account to GitHub to prove that you authorise Repl.it to make these changes to GitHub on your behalf.

You can give Repl.it access to all of your repositories (useful if you want to use this integration a lot), but by default it will only get permission for the specific repository that we're working with.

![**Image 7:** *Giving Repl.it permission to access your GitHub data.*](/images/tutorials/06-github/06-07-repository-access.png)

Press the green `approve` button and you'll be directed back to Repl.it. Press the `commit & push` button again on Repl.it and this time everything should work without any errors.

Navigate back to your fork of the GitHub project, and you should see that the changes are reflected in GitHub too.

![**Image 8:** *Seeing our changes reflected in our GitHub fork.*](/images/tutorials/06-github/06-08-github-updated.png)

As you can see, the new `.replit` file is visible and GitHub prompts you to make a pull request back into the original repository. Press `Pull request`, `create pull request`, add a comment explaining why your changes should be merged into the original repository, and click `Create pull request` again.

![**Image 9:** *Creating a pull request from GitHub to merge our changes back into the original repository.*](/images/tutorials/06-github/06-09-open-pull-request.png)

The owner of the repository will get a notification about your proposal and can choose to add your changes or reject them (in this case, don't be too hopeful about your changes being accepted as the `.replit` file being missing is important to follow along the earlier steps of this tutorial 😉.) 

## Make it your own

For this tutorial, it's important that you do the steps yourself so that everything is correctly linked to your own GitHub account, but if you want an example to play with, use the one below. It's the same as the Flask app but it can greet individual users dynamically instead of having a static welcome message.

Visit [https://cwr-06-github--garethdwyer1.repl.co/Gareth](https://cwr-06-github--garethdwyer1.repl.co/Gareth) to see it in action (replace the last part of the URL with your own name to receive a personalised greeting). 

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/cwr-06-github?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

Can you figure out how it works?

## Where next?

Cloning repositories and being able to immediately run them is useful in many scenarios, from just wanting to try out a cool project that you found to running production workflows.

Open-source software only exists because of people who build, maintain, and improve it. There's no global committee that decides who gets to be an open-source software developer and you can be one too. Find a project that you like, look at the "Issues" tab on GitHub to see what problems exist, and try to fix one. Many issues on GitHub are tagged with "Good first issue" to help direct newer developers to places where they can get started. 

In the next tutorial, we'll do something a bit different and build a 2D game using PyGame.
