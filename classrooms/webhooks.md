# Classroom Webhooks

Classroom webhooks unlock the metadata of your students' assignments so they can be filtered, analyzed, and organized in any way you see fit.

1. [What are webhooks?](#what-are-webhooks)
2. [How do you use webhooks?](#how-do-you-use-webhooks)
3. [Security](#security)
4. [Event Types](#event-types)

  * [`student_submits_assignment`](#student_submits_assignment)

5. [More with Webhooks](#more-with-webhooks)

## What are webhooks?

Webhooks allow you to send event data to services or your own servers for further processing/storing/handling.

For example, if you want to implement cheat detection in your classroom, you can receive student submission events and compare their code with existing code elsewhere.  If you wanted a history of submissions, you can save each event to build a timeline for your own uses.

When a specific event happens, we will send a POST request to an endpoint that you specify.

You can access your webhook settings for a classroom by clicking on the three-dots-menu for that classroom on your teacher dashboard.

## How do you use webhooks?

**Warning: By using webhooks, you are potentially exposing student data to services outside of Repl.it.  Please be aware of where you are sending and storing the data and the security of those places/services.**

Webhooks can be used by services such as [Zapier](https://zapier.com/apps/webhook/integrations), or you can [create your own server](/site/docs/repls/http-servers) to handle the data.

Here's an example of a simple server repls that will receive and log webhooks:

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@timmy_i_chen/class-webhook-example?lite=true"></iframe>

The URL that can receive webhooks is `https://class-webhook-example.timmy-i-chen.repl.co/data`.  I can then set up my webhook settings as follows:

![screenshot of webhook settings](https://replit.github.io/images/classrooms/webhook-setup.png)

I can then test this by having a student submit an assignment:

![screenshot of the event logged to my console](https://replit.github.io/images/classrooms/webhook-result.png)

This data can then be saved to a database, or it can trigger another POST request, or anything else.  The world is your oyster with webhooks!  Do note that if your repl is public and you need to store private database keys or API keys, you can do so securely by using [.env files](/site/docs/repls/secret-keys).

## Security

To ensure that the webhook event is coming from us (and not any third party), we include a secret key in your classroom webhook settings.  This key will be sent with any webhook events for that classroom, which you can then match on your server.  If they do not match, you can assume that the webhook was not sent by us.

Please note that both classroom owners and teacher assistants can edit webhook settings.

If a webhook fails, it will try again for a total of 10 times, waiting about 10 seconds between each try.  Please make sure that your route responds with a 2xx HTTP code so that it doesn't try again (otherwise it will timeout and fail).  The webhook will not retry routes that respond with 404s.

Your secret key can be refreshed at any time.

## Event Types

### `student_submits_assignment`

This event is fired anytime a student submits an assignment.  The event is in the following format:

```
{
  assignment: {
    name: string,
    type: enum(
      'manual',
      'input_output',
      'unit_test'
    )
  },
  classroom: {
    name: string,
    webhook_secret: string,
  },
  submission: {
    status: enum(
      'submitted',
      'submitted_incomplete',
      'complete'
    ),
    time_submitted: string (date),
    time_created: string (date),
    teacher_url: string,
    student_url: string,
    files: [
      {
        name: string,
        content: string,
      }
    ]
  },
  student: {
    first_name: string,
    last_name: string,
    email: string
  },
  event_name: 'student_submits_assignment'
}
```

`event.submission.files` will only contain files if they have been changed by the student from the original assignment.  This is to prevent large dataset files from being sent with each event.

# More with Webhooks

We'd love to hear about how you're using webhooks on our [feedback post](https://repl.it/feedback/p/feedback-for-classroom-webhooks).  Additionally, if you have more ideas for webhook events, please share them with us there as well.
