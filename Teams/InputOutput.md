# Input/Output Testing

Repl input/output testing allows a teacher to create simple tests that automatically match input values to expected output in student projects. Students can also easily test their code before submitting projects which improves persistence. You can even use regular expressions (regex) for complex, flexible pattern matching.

There is also a video explanation available [here](https://www.loom.com/share/a8664cccb66342419f7d1b9d8f33c0ed).

## Teams For Education

Input/output testing is a feature of [Teams for Education](https://teamsforeducationresources.obaidaa.repl.co/), if you don't have a team yet you can create one [here](https://repl.it/teams)

## Creating a Project

If you are new to projects, you can find more info on creating a project [here](./Projects)

## Input/Output Tests

Once your project is created, you'll find the "Input/Output Tests" window by clicking <img src="https://i.ritzastatic.com/repl/misc/in-out-icon.png" style="width: 38px; margin: 0; display: inline-block; vertical-align: middle;"> in the left side bar.

![Image showing in/out tests location](/images/teamsForEducation/input-output-tests/in-out-testing-location.png)

## Creating a Project with Input/Output Tests

Ideally after creating your project you should:

1. Add instructions for the student
2. Write some skeleton code for the student 
3. Configure the Input/Output tests (we will explain how shortly)
4. Publish the project for students to start

Let's look at the different testing options, each following the above sequence.

## Match Tests

The test is passed if the expected output is in (or equal to) the actual output. In other words, the actual output does not have to be identical to the expected output, it must just include it. The JavaScript equivalent is `actualOutput.includes(expectedOutput)`. 

Let's say we have a test on string formatting in Python. 

We have created a README.md file with the student's instructions.

![Image showing match README.md](/images/teamsForEducation/input-output-tests/match-readme.png)

We have created some skeleton code for the student to start from.

![Image showing match main.py](/images/teamsForEducation/input-output-tests/match-skeleton-code.png)

Now we can create the test.

Open the "Input/Output Tests" pane from the left sidebar and click on "+ Create test".

![Image showing Create test button](/images/teamsForEducation/input-output-tests/create-test.png)

A modal window will pop up where you can configure the input and output of the test. 

![Image showing match test config](/images/teamsForEducation/input-output-tests/match-config.png)

Above, we create the test with the following steps:

1. Give the test a name
2. Leave the input blank as it's not needed for this test
3. Specify "John Smith" for the output
4. Select "match" for the test type

We are selecting "match" for this test because we don't want an exact match. Students can write their own welcome message, however, the full name "John Smith" has to be part of the output string. 

Once the test is created, it'll be listed under "Input/Output Tests" and you can delete or modify it from there. To edit the test, click on the pencil icon next to the test name.

![Image showing match test created](/images/teamsForEducation/input-output-tests/match-test-created.png)

We now have a complete project for students to work on. Let's publish the project and look at the testing from the student's perspective.

![Image showing the publishing button](/images/teamsForEducation/input-output-tests/publish-unpublished.png)

Slide the unpublished slider to the right and assign groups or individuals – those students to be notified of the new project. Students can be assigned the project separately or in groups, for example classes or group projects. They will be able to work together if they are in the same group.

![Image showing publish slider](/images/teamsForEducation/input-output-tests/published-slider.png)

Once published, the students will get a notification that a new project has been published. Clicking on the notification opens the team's projects page where they can find the new project and click on "Start project" to open it.

![Student Notification](/images/teamsForEducation/input-output-tests/student-notification.png)

The student will be greeted with the project instructions `README.md file` added earlier. 

The `main.py` file has the skeleton code we added and they can start working from there. 

Let's open the input/output tests and run the String-Formatting test as a student. It will fail now, because we haven't added any code.

![Image showing student running the test- fail](/images/teamsForEducation/input-output-tests/match-test-failing.png)

The student can check the results to see what the expected output should be.

![Image showing failed results match](/images/teamsForEducation/input-output-tests/match-test-fail-results.png)

Let's add some code to make the test pass. We'll change the code to print the full name and then run the test again.

![Image showing string-code](/images/teamsForEducation/input-output-tests/match-test-passed.png)

Checking the "passed" results now, you'll see that the expected output only has the full name "John Smith", whereas the actual output has a string with some other words in it. With the "match" test, this will pass because the expected output is present within the actual output. If the name was incorrectly printed ie. "Smith John" then this test would fail. If you want an exact match, you can use "exact" for the input/output test type. 

![Image showing the passed results](/images/teamsForEducation/input-output-tests/match-passed-results.png)

## Exact Tests 

Exact tests pass only if the expected output is equal to the actual output (although we allow a trailing newline). The equivalent to this in JavaScript is `expectedOutput === actualOutput || expectedOutput + '\n' === actualOutput`.

Creating an "exact" test is similar to the "match" test created above. 

As an example, we'll create an assignement where students have to write the formula to calculate the area of a circle using the `math` module. To test that the student uses `math.pi` instead of some variable like `pi=3.14`, we will use the "exact" input/output test.

We have already created the skeleton code and readme file so next we'll create the test.

![Image showing the exact test config](/images/teamsForEducation/input-output-tests/exact-test-config.png)

Above, we create an exact test that will check for exactly the areas specified within the expected output. Follow the below steps to create an exact test.

1. Open the "Input/Output Tests" pain
2. Click on "Create test"
3. Name the test
4. Add the exact expected output
5. Choose "exact" as the test type and click the save button

You can now publish the project and assign students or groups to it. Students will get a notification that the project is published.

From the students' perspective, they'll have the skeleton code and the README.md file with instructions to complete the project.

If they run the test, it will fail because we haven't added any of the code to the skeleton yet. Students can check the expected output by checking the test results.

The student can then add their code to the main.py file with the skeleton code and run the test again to see if they passed.

Below we have code that uses the incorrect representation of `pi` and because we are using "exact" tests, the test is failing. 

![Image showing incorrect pi test fail](/images/teamsForEducation/input-output-tests/exact-failed-pi-results.png)

Then, when we import the math module and use `math.pi`, we get the correct answer that matches exactly with the expected output so our test passes and it is safe for the student to submit their code.

![Image showing exact test passing ](/images/teamsForEducation/input-output-tests/exact-test-pass.png)

When students submit a project without running the tests first, they will get a notification asking them to run tests first or submit anyway. This is a reminder for students to test their work before submitting as it will give them a good inidcation whether the work they did is correct.

![Image showing submit without running test](/images/teamsForEducation/input-output-tests/submit-without-testing.png)

When a student tries to submit a project while tests are failing, they will also get a notification making them aware of the fact, with an option to "View tests" or "Submit anyway".

![Image showing submission with failing tests](/images/teamsForEducation/input-output-tests/submit-with-failing-tests.png)

## Regex Tests

For more flexibility in defining the expected output, you can use regular expressions or "regex". The regex test is the third type of input/output test.

The test passes if the test matches the expected output compiled as a regex. This is equivalent to `actualOutput.match(expectedOutput)`.

As an example, we have a project where the student has to write code that will compile email addresses from the given variables. 

For the test, we'll set up a regex test to check that the student's email address matches the required email format.

![Image showing regex test config](/images/teamsForEducation/input-output-tests/regex-test-config.png)

To create the test seen above:

1. Open the "Input/Output Tests" window 
2. Create a new test
3. Give the test a name
4. Add the regex expression to the "Expected output"
5. Choose "regex" as the test type and click save

When we add the code to compile the email address and run the test, we get the following results.

![Image showing regex passed results](/images/teamsForEducation/input-output-tests/regex-pass-results.png)

If you don't want to be lenient of an extra newline and prefer to have a truly exact match with the expected output and actual output, you can use the `regex` with a `^` at the start and `$` at the end. Keep in mind though, that you'll have to escape other regex characters.

Tests cases can be added, edited, and deleted at any time – even after the project has been published. This added flexibility allows you to get started with testing right away. 
