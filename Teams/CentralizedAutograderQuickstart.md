# Building a centralized autograder - quickstart (Python)

This is the shortcut guide to the [full walkthrough on how to set up a centralized autograder](./CentralizedAutograder). Follow that guide to get step by step instructions and explanations about how it works. Follow this guide if you just want to get it up and running.

## Creating the grading server
1. Create a new template for the server in your Team account. Make sure that you **do not** publish this template, as it will host students' work.
2. Create each of the files that you find in [this example autograder server repl](https://repl.it/@ritza/grading-server#main.py) in your private template and copy the contents of each file across as well. Hit the `Run` button and take note of the URL.

## Create the assignment
1. Create another new template in your Team account. This one you will publish to students.
2. Create each of the files that you find in [this example assignment repl](https://repl.it/@ritza/autograding-assignment-template), and copy the contents of each file.
3. Modify the `url` variable in the `submit.py` file to match the one you saw when you ran your server repl.

## Make it your own
Make any other modifications you need based on the assignment you are setting your students.
1. Update the `README.me` in the assignment template to explain the task to your students
2. Update the `main.py` file to give your students some code to start with and show them how to test it.
3. Update the `test_solution.py` file in the server repl to automatically grade the students' code.