# Building a centralized autograder (Java)

[There is also a Python version of this guide](./CentralizedAutograder)

**Note:** ⚠️ ⚠️ This guide shows you how to set up a basic fully automated homework grader. It is intended as a proof-of-concept to showcase how to build similar projects on top of Repl.it. **It should not be used as-is in cases where data is important or sensitive. For example, it offers no protection against malicious students who could submit code similar to `pb.command("rm", "-rf", "/");` to break the server and delete or modify other students' submissions or grades.** Stay tuned for updated guides and sample repls that resolve these issues. ⚠️⚠️

In a [previous guide](./SimpleAutograding-java) we built a basic autograding solution that could automatically run and test your students' assignments. However, there were still some manual steps involved: you needed to navigate to each student's submission of the assignment and kick off the tests manually.

In this guide, we'll show you how to take it a step further and build a centralised grading server. Your students will be able to submit their assignments to this server, and each submission will automatically kick off the tests, assign a grade, and create a summary report of submissions and grades for you to review.

This guide shows you how to build the solution step-by-step. If you just want to get it up and running as quickly as possible, you can follow the [quickstart guide](./CentralizedAutograderQuickstart-java) instead which shows you how to get started from our project repls.

Note that you'll need a subscription to [Teams for Education](https://repl.it/teams) to follow this guide as it is presented, but you should also be able to adapt it to run using a normal Repl.it account if you need.

We assume that your students are learning Java. We'll give an example Java assignment and an example testing suite using [JUnit 5](https://junit.org/junit5/docs/current/user-guide/). We'll use [Javalin](https://javalin.io/documentation) to create the centralised grading server.

## Overview of how the solution works

The basic workflow is similar to in the previous guide, but this time you won't need to look at each student's submission individually. Instead, students will submit them to a centralised server, and you can view their code there, or just look at the summary report it will generate.

![](/images/teamsForEducation/centralized-autograder-java/01-solution-overview.png)

After a student starts the assignment, they will be able to write their code, test it on their own, and then submit it when they are satisfied with their answers. 

The grading server will not be visible to students, so they will still not be able to view each other's work or grades.

## Setting up the grading server

We'll start by creating the grading server. We don't want to share this code for students as it will also host copies of their submitted assignments, so we'll have to make sure to **not publish** this project.

1. Press the 'create a project' button on your team page
2. Choose Java as the language
3. Call it 'grading-server'
4. Make a note to remind yourself and other admins not to publish this
5. Press the 'Create' button

![](/images/teamsForEducation/centralized-autograder-java/02-new-projects.png)

Our grading server will consist of a few different components, namely:

* A [Javalin](https://javalin.io/) web server that can receive files that students submit
* JUnit tests to evaluate the students' submissions
* A report file to keep a summary of all submissions and grades

### Creating the server

Instead of creating each file manually, we've set up a `.zip` project for you to get started from. You can load up this template project as follows.

1. Create a new file 
2. Call it exactly '.replit'
3. Copy the below code and paste it into the '.replit' file

```bash
language = "bash"
run = "rm Main.java && wget https://github.com/replit/replit.github.io/raw/master/static/zip-template-repls/replit-autograding-server-java.zip && unzip -o replit-autograding-server-java.zip"
```
![](/images/teamsForEducation/centralized-autograder-java/03-download-zip-bash.png)

This removes the default `Main.java` file, downloads the zip project, and unzips it. It will also overwrite the `.replit` file you just created with one to run the new project instead.

Press the `Run` button and you should see a bunch of new files appear.

*This grading server identifies each student through a unique student ID that the student will manually add to the top of their submission. This can be adapted to automatically use the student's Repl.it username by retrieving the "REPL_OWNER" environment variable. You'll have to retrieve the username through the student's `go.sh` file and modify the `extractStudentNumber` function from the server's `Main.java` file to use the username instead. You can read [Repl Environment Variables](/misc/repl-environment-variables) for more information.*

### Creating the tests

For demonstration, we're going to assume that the homework assignment requires the students to write two functions:

* `add(int a, int b)` which sums the two input integers and returns the result
* `subtract(int a, int b)` which subtracts `b` from `a` and returns the result

You can adapt this to your actual homework assignment as needed, but we recommend that you first make sure that everything is working with this simple example before you write a more advanced set of tests.

There is a file called `ExampleTest.java` which contains the following code.

```java
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ExampleTest {

  @Test
  void add_two_pos() {
    assertEquals(3, new Example().add(1, 2), "1 + 2");
  }

  @Test
  void add_one_neg_one_pos() {
    assertEquals(-2, new Example().add(-3, 1), "-3 + 1");
  }

  @Test
  void subtract_two_pos() {
    assertEquals(2, new Example().subtract(5, 3), "5 - 3");
  }

  @Test
  void subtract_two_neg() {
    assertEquals(1, new Example().subtract(-2, -3), "-2 - -3");
  }
}
```

These are the four tests that will be automatically run against our students' submitted code, so modify them or add more as needed.

Press the `Run` button and your server should start running and display two buttons: "Choose File" and "Submit" message, as shown below. 

Take note of the URL, which is based on your team and project name, as we'll need to add this to the student assignment that we create in the next step.

![](/images/teamsForEducation/centralized-autograder-java/04-java-running-server-and-url.png)


## Setting up the assignment 

Now that we have a server, we need to build the other half: the assignment project for students to start and submit.

### Create a new project 

On your teams page, create a new project. This will be specific to a single assignment for your students so call it something like "Grade 10 Java homework week 1" so you can keep track of different assignments for different classes.

![](/images/teamsForEducation/centralized-autograder-java/05-new-assignment-project.png)

### Adding the project files

1. Create new file 
2. Call it '.replit'
3. Copy the below code and paste it in the '.replit' file

```bash
language = "bash"
run = "rm Main.java && wget https://github.com/replit/replit.github.io/raw/master/static/zip-template-repls/replit-autograding-assignment-template-java.zip && unzip -o replit-autograding-assignment-template-java.zip"
```

4. Run your application

![](/images/teamsForEducation/centralized-autograder-java/06-assignment-zip-bash.png)

This will download all the files needed for the assignment project. 

### Add the code for the assignment

Our assignment needs the following three components:

* The starter code and instructions for students to work on
* A basic testing harness so that students can test their work (unlike in the previous guide, students won't have access to the full test suite that we use for grading)
* Code to submit the assignment to the central server

In the `Example.java` file, you will find the following code.

```java
// A1234567
// Ensure the above line contains exactly your student number.
//
// You can test your code by pressing the `Run` button.
// Once you are happy with it, change the `ReadyForSubmission` line
// to say `YES` and press the `Run` button again to submit
// -----------------------------------------------------------------
// ReadyForSubmission=NO
public class Example {
  // Add a and b and return the sum
  public int add(int a, int b) {
    return 0;
  }

  // Subtract b from a and return the result
  public int subtract(int a, int b) {
    return 0;
  }

  private void test() {
    System.out.printf("add(1, 2) returns %s\n", add(1, 2));
    System.out.printf("subtract(5, 2) returns %s\n", subtract(5, 2));
  }

  public static void main(String[] args) {
    new Example().test();
  }
}
```

Change the comment on the very first line to match the format of your students' identification numbers. This will be used in the report that the server generates and also for the directory names that it uses to store the students' code.

The `ReadyForSubmission` line indicates whether the student is ready to submit or not. By default, the code is in testing mode and when the student presses the `Run` button, it will run their code and display the results to them. 

Once they change the `ReadyForSubmission=NO` to `ReadyForSubmission=YES`, it changes to submission mode. Now when the student hits the `Run` button, it will submit the code to our server.

The `add()` and `subtract()` functions are starter code for the student to work from. The `test()` function runs these functions with some sample inputs and shows the results to the student.

The `main()` function checks what mode we are in and either runs the code locally or submits it to the server.

### Creating the submission script

In the file `go.sh` file you will find following code.

```bash
#!/bin/bash

if cat Example.java | grep -q "ReadyForSubmission=YES"; then
  curl -X POST \
       -H "Content-Type: multipart/form-data" \
       -F "codefile=@Example.java" \
       https://newURLautograder.username.repl.co
else
  javac Example.java
  java Example
fi
```

Change the URL `https://newURLautograder.username.repl.co` to the one that you copied in the final step of the server setup, as this is where the students' assignments will be submitted.

### Testing it all out

To make sure that everything works as expected, run the project. It's still in test mode, so it should run the two functions with the example inputs and display the output. Because we only have the starter code, we can see that the functions don't work yet.

![](/images/teamsForEducation/centralized-autograder-java/07-java-running-template-no-result.png)

Now fill out the two functions so that they look as follows. Note that we have a deliberate error in the `subtract()` function to make sure that our grading is working as expected.

```java
  // Add a and b and return the sum
  public int add(int a, int b) {
    return a + b;
  }

  // Subtract b from a and return the result
  public int subtract(int a, int b) {
    return b - a;
  }

```

Hit `Run` again and you should see that the functions return results now.

![](/images/teamsForEducation/centralized-autograder-java/08-java-running-template-completed-errors.png)

Change the `ReadyForSubmission=NO` line to `ReadyForSubmission=YES` and press `Run` again. This time it should submit the solution to the grader and return a confirmation message.

![](/images/teamsForEducation/centralized-autograder-java/09-java-submission-confirmed.png)

Fix the subtract function by swapping `b` and `a` as follows and submit it one more time by pressing the `Run` button. This lets us test that resubmissions are working.

```java
  // Subtract b from a and return the result
  public int subtract(int a, int b) {
    return a - b;
  }
```

Finally, change all of the code back to how it was as this is the version that students will work on and we don't want them to have the solutions. Change the ReadyForSubmission=YES line to NO and change the return statements, replacing the  answers with `return = 0` instead.

```java
// ReadyForSubmission=NO
public class Example {
  // Add a and b and return the sum
  public int add(int a, int b) {
    return 0;
  }

  // Subtract b from a and return the result
  public int subtract(int a, int b) {
    return 0;
  }

```

### Viewing the submitted code and report

Navigate back to your `grading-server` project and you should see some new files and folders that have been created by the grading project.

Each of the submissions generated a new subfolder with the student number in the first line of the submission file. Because they were the same, the second one has `_1` appended to it.

In each of these folders, you can see the code that was submitted.

You can also see `report.md` has been generated, with details of the two submissions (who submitted them and when) and their calculated grades.

If you want to discuss the submitted code with the student, you can navigate to the grading-project submissions page and view the submission in question. From there you can select a piece of code from your student's submission and click on the annotate button to leave a message. This makes it easy to ask for clarification or give advice. You can read more on the annotation feature [here](https://docs.repl.it/Teams/Annotations)

![](/images/teamsForEducation/centralized-autograder-java/10-java-example-report.png)

## Publishing the project for students to use

Once you are happy with the assignment, press the "publish project" button in the top right. Students will get a notification that their homework is ready and be able to start the project, modify the code, and submit it to the grading server.

![](/images/teamsForEducation/centralized-autograder-java/11-publish-asignment.png)

Leave the grading server running (don't press the "Stop" button) so that the students can submit when they are ready. You can visit your server URL (that you pasted into the `go.sh` file) to make sure that it stays up (it should display two buttons: "Choose file" and "Submit", if everything is running as expected. If you see an error or the page does not load, navigate back to the unpublished project file and hit the `Run` button again.)

## Where next?

Now you have a robot to take care of most of your grading for you which should save you a bunch of time! In this guide, we showed you how to set up an autograder, but you might like to extend it on your own with some additional features. For example, you could

* Create a more sophisticated directory and reporting structure so that different assignments can be submitted to the same server without all being mixed up into a single directory and single report.
* Set up a service like [UpTimerRobot](https://uptimerobot.com/) to keep an eye on your grading server and notify you if it becomes unavailable (this also stops Repl.it shutting it down from inactivity).
* Return the grades to students so that they see "You scored 75%" after submitting instead of just "Your code has been submitted".

We've focused on Java in this guide, but you should be able to adapt it to testing and grading submissions in JavaScript, Python, or other languages. We also have a [Python version of this guide](./CentralizedAutograder).
