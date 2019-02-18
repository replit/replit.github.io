# Assignment-Submission Workflow

[Repl.it Classroom](/site/classroom)'s assignment and submission workflow is
designed to make running your classroom as easy and effective as possible
with a gentle learning curve (things should be intuitive). Similarly, the
student workflow resembles real-world teacher/student interaction so that
students can be productive from day 0.

![student overview](https://i.imgur.com/5N4gMNj.jpg)

_The [student overview](/site/blog/classroomoverview) page
showing the different states student submissions can be in_

First, there are a couple of concepts to define:

1. Assignments: the main unit of work that teachers can create and allocate to
students.
2. Submissions: the student's work against the assignment given by the teacher.

The submission workflow differ depending on the assignment "correction" type --
whether it's manual or automatic. We currently support two automated correction
mechanisms and one manual.

![correction](https://replit.github.io/media/assignment-submission/correction.png)

## Manual correction workflow

When a student clicks on the assignment allocated by the teacher, a new
submission is created. However, it starts out in a _draft_ state.

When the student is ready to submit their work they can hit _submit_ and their
submission then goes into an _awaiting feedback_ state. You'll then get a
notification about the submission. (Note that students are able to _unsubmit_
their submissions which will remove it from your queue and it goes back to a
_draft_ state).

You (teachers) can access student submissions either from the notifications page (accessible
from the header) or by going to the assignment name and clicking on the student
name (it'll say _awaiting feedback_).

At this point you have a choice to make:

1. If you think the submission is satisfactory, you can leave a feedback message like "good job!" and click _mark
complete_. This will put the submission into a _completed_ state and that'll be
the end of the submission lifecycle.
2. If you think it needs more work then you can leave feedback and send it back
to your student. The submission will then go into an _awaiting resubmission_
state and your student will then get a notification informing them.

So to sum up here is a diagram showing the lifecycle of a submission:

![manual submission
 lifecycle](https://replit.github.io/media/assignment-submission/manual_submission_lifecycle.png)

## Automatic correction workflow

This is very similar to the manual workflow but it differs in two major ways:

1. Submissions can be automatically marked correct (if it passes the automatic tests).
2. Students that fail automated tests but choose to submit anyways will put
their submission in an _awaiting help_ state.

Here is the updated diagram:

![automatic submission
 lifecycle](https://replit.github.io/media/assignment-submission/automatic_submission_lifecycle.png)

Note that at any point teachers can override the automatic behavior. For
example, if a submission was automatically marked correct but you see something you
don't like -- e.g. the test case didn't cover a certain condition -- then they can
send the submission back.