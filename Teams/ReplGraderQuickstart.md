# Using ReplGrader.com - Python

**Note: replgrader.com is currently in beta and has some limitations. It is actively being worked on. If you have any feedback or need help getting started, feel free to email gareth@ritza.co.**

[ReplGrader.com](https://replgrader.com) is a free third-party grading service partnered with Repl.it. It provides very simple autograding of Python assignments. Here is a quickstart guide on how to use it, or head over to their site for more details.

## Create the grader repl
Create a new Python project under your Teams account.

This is your teacher repl to manage grades and submissions for a specific assignment, so call it something like "week 4 functions - GRADER" to indicate which assignment it is for, and to remind yourself not to publish it to students.

Add the following `.replit` file and press run.

```bash
language="bash"
run="wget https://replgrader.com/assets/grader-template.zip && unzip -o grader-template.zip && rm .replit" 
```

This will pull in all the files needed to run the grading interface as well as an example assignment file that you can expand for your students.

![](/images/teamsForEducation/replgrader-com-structure.png)

Modify the `assignment/main.py` and `assignment/test_main.py`. Students will receive a copy of the `main.py` file but the `test_main.py` file which contains the tests will be kept private. You can also modify the `README.md` file which will be distributed to students as the assignment instructions.

Once you are happy with your assignment, press the "run" button and press the "submit assignment" button in the web interface.

After the assignment is submitted, copy the `student_key` from the manifest.json file as you will need this in the next step.

![](/images/teamsForEducation/replgrader-com-student-key.png)


## Create the assignment repl
Now create a new Python project, also under your Teams account.

This is the template that will be shared with students. Call it the same name as your grader repl but without the `- GRADER` suffix so that you can easily match them up later if you create more than one assignment. 

Add the following `.replit` file and press run.

```bash
language="bash"
run="wget https://replgrader.com/assets/assignment-template.zip && unzip -o assignment-template.zip"
```

This pulls in all of the generic files needed for the student project, but you still need to initialise it with your own `main.py` file and `README.md`. As you already submitted these to replgrader.com, you can pull these from there by replacing the contents of the `.replit` file with the following and pressing run again.

```bash
lang="bash"
run="python initialise.py <student_key> && rm .replit"
```

Replace `<student_key>` with the student key that you got in the previous step, which should look something like `1bc29b36f623ba82aaf6724fd3b16718`.

Now you'll see your `main.py` file. If you followed the same pattern as the example file provided, students will be able to run the code to see some basic output before submitting it to replgrader.com which will trigger the full test suite. You can now press "Publish project" in the top right-hand corner to share this with your students.

![](/images/teamsForEducation/replgrader-com-initialised.png)

## Getting grades

There's no need to keep the grading project running, as grades will be submitted directly to replgrader.com. Once your students have submitted, you can start your grader project again by pressing the "run" button and then press "get grades"

![](/images/teamsForEducation/replgrader-com-grades.png)

In the example above, one student submitted twice. If the students joined your team using an [anonymous invitation](https://docs.repl.it/Teams/Invitations) you will not see their personal information - only their randomly generated username. If they signed up for a normal repl account, you will see their repl username. If a student submitted more than once, you can see the most recent submission by inspecting the timestamps.

## Example assignments

ReplGrader.com also provides some [example projects](https://replgrader.com/pages/home.html#examples) that you can use as homework assignments.

