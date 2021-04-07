# Create your first autograded Java homework

There is also [a Python version of this guide](./SimpleAutograding).

**Note: you need a subscription to Repl.it's [Teams for Education](https://repl.it/teams) as well as a team where you have owner or admin privileges in order to follow this guide.**

If you teach a programming course and wish that you could build a robot to grade your students' homework for you, you can! In this guide, you'll see exactly how to set it up with some real-world examples. 

Autograding is done by having unit tests automatically execute your students' code with pre-specified inputs and check if the outputs are as expected. 

Specifically, we'll cover:
* Setting up projects and permissions on Repl.it Teams for Education  
* Creating a skeleton assignment for your students to work on
* Creating tests to check your students' submissions automatically
* Running these tests with JUnit.

## What is autograding and how can it help you?

 We can broadly think of grading as fitting into one of three categories:

* **No autograding:** Without any autograding, your students submit code and you have to inspect it line by line and manually specify inputs. 
* **Partial auto-grading:** To save time, you might have a script that runs your students' code with a pre-specified set of inputs to see exactly how it works and where it breaks, but you still need to decide what grade to award based this.
* **Full autograding:** You have a sophisticated testing suite and the students' grades are determined by how many tests their code passes.

In this guide, we'll show you how to set up partial auto-grading: you'll execute the tests individually for each student's submission but still award grades manually.

In theory, students could receive their grade automatically too, minutes after they submit. In the version we build though, only you, the teacher, will get the summary of grades, so that you can check these, add any personalised comments, and then share with your students at your convenience.

## Understanding Repl.it teams: Admins, members and projects
Before we get started with building the autograded solution, you should have a good understanding of some concepts from Repl.it teams. Specifically, we'll be using different roles (admin and member) and **projects**. You can skip this section if you're already familiar with how these work.

### The admin and member roles in Repl.it teams

If you're using Teams for Education, you should make sure that you're added as an 'owner' or 'admin' while all of your students are 'members'.

This means that you will be able to see all student versions of the homework, while your students will only be able to see the skeleton project that you provide.

![](/images/teamsForEducation/simple-autograding-java/01-manage-team.png)

### Understanding projects

Projects let you create a repl that might have different variants. For example, you can add the homework questions and skeleton code to a project and each student can then easily create their own version of this.

* Admins and owners can edit the main copy of the project; any changes they make will be seen by any student who creates a copy.
* Once the project is published, members (students) can only see the project and create their own copy to work on their submission. They cannot edit the main copy.
* People outside the team cannot see the project at all.

Only admins can see all submissions of a project. This means that students cannot see each other's work, which helps prevent plagiarism.

## Create your first project

Create a project for the homework assignment you want to prepare and add some details to help you and your students identify it. You can also specify what programming language to use. In this example, we'll use Java.

![](/images/teamsForEducation/simple-autograding-java/02-create-project.png)

Hit the create button and you'll be taken to a normal repl but with some additional features. Note the 'publish project' button in the top right that we'll use later.

## Writing a skeleton homework assignment

In the `Main.java` file, write any skeleton code that you want your students to use.

An example of this is:

```java
import org.junit.*;
import org.junit.runner.*;
import static org.junit.Assert.*;

public class Main {

  public int add(int a, int b) {
    return 0;
  }

  public int subtract(int a, int b){
      return 0;
  }

  // TESTS
  @Test
  public void test_add() {
    assertEquals(add(1, 2), 3); 
  }

  @Test 
  public void test_subtract(){
    assertEquals(subtract(4, 2), 2);
  }

  public static void main(String[] args) {
    org.junit.runner.JUnitCore.main("Main");
  }
}
```

In this example, we are only asking students to create two basic functions: `add` and `subtract`.

If you need to provide more comprehensive instructions you can create a [markdown](https://en.wikipedia.org/wiki/Markdown) file from within the repl by pressing the `add file` button in the files pane and calling it `README.md`. Markdown files have two modes, "edit" and "preview", so your students will be able to see basic formatting like links or bullet points and Repl.it will automatically display the `README.md` file when the student opens up the project.

![](/images/teamsForEducation/simple-autograding-java/03-instructions-readme.png)

If you already have the instructions in a different format such as PDF, you can upload the file from your local machine and students will be able to view it directly within the Repl.it interface.

![](/images/teamsForEducation/simple-autograding-java/04-upload-instructions-file.png)

## Installing JUnit

To run the tests, we'll use JUnit. Repl.it can import JUnit automatically but you'll need to install the hamcrest library which JUnit depends on. Install it by:

1. clicking on the package icon in the left menu bar
2. typing `org.hamcrest` into the search box
3. clicking on `org.hamcrest:hamcrest` from the results
4. clicking the plus button to install the package.

![](/images/teamsForEducation/simple-autograding-java/05-instsall-hamcrest.png)

Because we installed hamcrest in the main version of the project, it will automatically be installed in students' versions the first time they run code, so they won't have to complete these steps in their copies.

## Running the tests

We call JUnit in our `main()` function, which in turn finds the tests (labelled with `@Test`) and runs these. The tests execute the student's code and check if it produces the expected results.

Hit the `Run` button, and you should see the tests execute. The code is deliberately broken (it returns `0` for all inputs), so the tests fail as expected.

![](/images/teamsForEducation/simple-autograding-java/06-run-test.png)



JUnit is designed to help software engineers find bugs more than it is for grading homework so you'll see it produces a lot of output to pinpoint exactly what went wrong. This also helps students become comfortable with reading error messages and debugging code.

This means that our setup is working: it's the students' job to fix the functions so that they pass these tests.

Before students can see and submit this homework you need to 'publish' it. Do that now by pressing the button in the top right.

![](/images/teamsForEducation/simple-autograding-java/07-publish-project.png)

Now slide the button across to 'published' and your students can access the project. They will also get a notification in Repl.it that a new project has been published, and you will similarly see a notification once they start and submit.

![](/images/teamsForEducation/simple-autograding-java/08-edit-project-to-published.png)

## Submitting your homework as a student

To experience the process from your students' perspective, sign into a normal 'member' account that's part of your team plan. You can use a different web browser or incognito window to stay signed into your teacher account at the same time.

You'll see all of your published projects but no `edit` button. Instead there'll be a `Start project` button which is the first thing a student needs to press to begin the homework assignment.

The student will also get a notification (as soon as you published the project, but not when you created it).

![](/images/teamsForEducation/simple-autograding-java/09-notifications-new-project.png)

The student can now make changes to the code. In this example, they fill out the return statements. Note how `a` and `b` are in the wrong order in the subtract function: the correct answer is `return a - b`. 

![](/images/teamsForEducation/simple-autograding-java/10-submit-assignment.png)

Once the student is satisfied, they can press the `submit` button in the top right.

## Viewing all submissions as a teacher

Back in your teacher account, navigate to the team dashboard and find the relevant project. Press the `View submissions` button.

![](/images/teamsForEducation/simple-autograding-java/11-view-submissions.png)

You'll be taken to a page where you can see all versions of this assignment. In this example, we only see one (from the test we created above). Once your students start the assignment you'll see more, and each of them will be labeled as "submitted" or "unsubmitted", depending on whether or not the student has pressed the `submit` button.

![](/images/teamsForEducation/simple-autograding-java/12-projects-submisions-page.png)

Press "View repl" and hit the `Run` button. You'll see that one of the tests passes and the other fails.

![](/images/teamsForEducation/simple-autograding-java/13-test-results.png).

Once your students have each created and submitted the project, you can open each of the students' versions and hit `Run` to easily see a summary of how many tests they passed and what mistakes they made. 

If you want, you can simply use the percentage of the tests passed as a grade (for example, our imaginary student would be awarded 50% for passing 1/2 tests), but because you can see exactly what went wrong you can also decide if some tests are more important than others.

You can also select a piece of code from your student's submission and click on the annotate button to leave a message. This makes it easy to ask for clarification or give advice. You can read more on the annotation feature [here](https://docs.repl.it/Teams/Annotations)

While this is a semi-automated solution, you are still required to open each solution manually in order to kick off the tests. In [Creating a centralised grading application with Repl.it](./CentralizedAutograder-java), we show you how to take autograding a step further to avoid this.

## Conclusion

In this guide we showed you how to set up a basic auto-graded Java assignment. Unit tests are pretty powerful and you can use them to do more than just check basic inputs and outputs. For example, it's possible to check how many times a function was called, to check if specific exceptions are raised and more.

We focused on using JUnit and Java, but all languages have their own unit testing frameworks, so you can follow this same pattern if you are teaching other languages. We also have a [Python version of this guide](./SimpleAutograding).
