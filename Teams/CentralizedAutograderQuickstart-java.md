# Building a centralized autograder - quickstart (Java)

This is the shortcut guide to the [full walkthrough on how to set up a centralized autograder](./CentralizedAutograder-java). Follow that guide to get step by step instructions and explanations about how it works. Follow this guide if you just want to get it up and running.

**Note:** ⚠️ ⚠️ This guide shows you how to set up a basic fully automated homework grader. It is intended as a proof-of-concept to showcase how to build similar projects on top of Repl.it. **It should not be used as-is in cases where data is important or sensitive. For example, it offers no protection against malicious students who could submit code similar to `pb.command("rm", "-rf", "/");` to break the server and delete or modify other students' submissions or grades.** Stay tuned for updated guides and sample repls that resolve these issues. ⚠️⚠️

## Creating the grading server
1. Create a new project for the server in your Team account. Make sure that you **do not** publish this project, as it will host students' work.
2. Create a file called `.replit` and add the following code. Then press the `Run` button.

```bash
language = "bash"
run = "rm Main.java && wget https://github.com/replit/replit.github.io/raw/master/static/zip-template-repls/replit-autograding-server-java.zip && unzip -o replit-autograding-server-java.zip"
```

## Create the assignment
1. Create another new project in your Team account. This one you will publish to students.
2. Create a file called `.replit` and add the following code. Then press the `Run` button.
```bash
language = "bash"
run = "rm Main.java && wget https://github.com/replit/replit.github.io/raw/master/static/zip-template-repls/replit-autograding-assignment-template-java.zip && unzip -o replit-autograding-assignment-template-java.zip"
```
3. Modify the url in the `go.sh` file to point to the server repl that you created in the previous step.

## Make it your own
Make any other modifications you need based on the assignment you are setting your students.
1. Update the `README.md` in the assignment project to explain the task to your students
2. Update the `Example.java` file to give your students some code to start with and show them how to test it.
3. Update the `src/main/java/ExampleTest.java` file in the server repl to automatically grade the students' code.

## Publish it

Publish the project and share the URL with your students so they can get started (they will also receive a notification the moment you publish it).
