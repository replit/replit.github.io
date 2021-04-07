# **Replit Database**

You can jump right in and follow [this](https://docs.repl.it/tutorials/11-using-the-replit-database) basic phone book tutorial where you'll learn how to perform the fundamental "CRUD" (Create, Read, Update, Delete) operations with Repl.it Database.

Database is a simple and easy-to-use key-value store inside of every repl.
There is no configuration—just start using it! Here's how:

#### **Where can I find my database?**

When viewing your repl, you'll see the Database icon toward the bottom of the sidebar.
That’s Repl.it’s new key-value database, built right into your repl!

#### **How can I access my database?**

To access Database, you can use a library or simple curl commands.

Replit provides official clients:

- Python: https://pypi.org/project/replit/
- Node.js: https://www.npmjs.com/package/@replit/database
- Go: https://github.com/replit/database-go

We recommend using the above clients if your repl is in one of those languages.

#### **How do I use my database?**

When you click on the Database icon in the sidebar, you'll see some instructions.
If your repl is in a language that has an official Database client, you can quickly
import it and start using Database by clicking on the "Insert" buttons.

If your language does not have a client, we provide some curl examples. They are
also found below. These are a useful reference if you wish to write your own
Database client.

##### Set

```
curl $REPLIT_DB_URL -d '<key>=<value>'
```

If your key and value don't use any unsafe characters, you can use
an alternative version:

```
curl -XPOST $REPLIT_DB_URL/<key>=<value>
```

##### Get

```
curl $REPLIT_DB_URL/<key>
```

##### Delete

```
curl -XDELETE $REPLIT_DB_URL/<key>
```

Delete returns status code 204 if the key was deleted or 404 if the key did not exist.

##### List

```
curl $REPLIT_DB_URL --get -d 'prefix=<key>'
```

or

```
curl "$REPLIT_DB_URL?prefix=<key>"
```

The returned keys will be separated by newlines.

Listing also takes a query parameter: `encode=true`. If set, the returned keys
will be URL encoded. This lets you safely handle keys that contain newlines.

#### **What is REPLIT_DB_URL?**

This is the environment variable we have created with your repl. It is the key that will allow you to access your database.

The clients listed above take care of using `REPLIT_DB_URL` for you. But if you want to write your own client or use Database from a language that doesn't yet have a client. Here are two examples:

Python:

```
import os
print(os.getenv("REPLIT_DB_URL"))
```

Node.js:

```
console.log(process.env.REPLIT_DB_URL)
```

`REPLIT_DB_URL` provides full access to your database. Therefore, you should take care not to expose it to the world or share it with people you don't trust.

The value of `REPLIT_DB_URL` changes from time to time, so we recommend that you not copy it elsewhere. Subsequent reads by the same process will see the same value. We will restart your repl if we need to change it after it has been read.

#### **What limits does Database have?**

The limits are currently:

- 50 MB per database (sum of keys and values)
- 5,000 keys per database
- 1000 bytes per key
- 5 MB per value

There are rate limits that apply to all operations. You will receive an HTTP 429 if you exceed them. We recommend implementing an exponential backoff and retry to handle this case.

#### **How can I tell how much storage I'm using?**

The Database sidebar shows you the number of keys in your database along with
the total storage occupied by your keys and values.

#### **Is my database private?**

Yes, each Database is private and isolated. Every repl has its own database, and
they are not shared among repls.

#### **How do I share a database across repls?**

The easiest way to do this is to use one repl as the primary database and have other repls connect to it via web hosting. Here’s an example repl in Python: https://repl.it/@util/Replit-Database-proxy

Any requests sent to the above repl will operate on its database, so sending
requests to it from other repls means that they all share the same information.
