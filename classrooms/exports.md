# Exporting Classroom Data

Both students and teachers are capable of exporting data - teachers can export their classroom grade data, whereas students can export their assignments to repls.

## Student Exports

Students can export an assignment to a repl, which can then be downloaded as a zip file, or worked on outside the classroom environment.  Students export their submissions from their classroom page, or on the submission itself.

Any submission exported to a repl will be public by default.  A student who is on the Hacker Plan (or any other plan) can toggle it to be private.

## Teacher Exports

### Exporting Submission Data

Teachers can export their student submission data from the classroom page under the "Student Overview" section.  The data will be exported as a CSV file with the students names, emails, and status of each of their submissions.

Each submission has one of the following statuses:

* `no_submission` - The student never opened the assignment.
* `draft` - The student has started but has not submitted it yet
* `abandoned` - The student submitted it, unsubmitted it, then never re-submitted it.
* `submitted` - The student has submitted it and it was not manually marked complete
* `submitted_incomplete` (auto-graded assignments only) - The student has submitted without passing all the tests.
* `sent_back` - The teacher sent the submission back)
* `complete` - The student submitted the assignment, passing all the tests, or a teacher manually marked it as complete.

### Exporting Assignments

Currently there is no place to export all of a classroom's assignments.  If this is something you would like to see, please let us know on our [feedback forums](/feedback).
