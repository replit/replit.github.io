# Using the Repl.it database

![](/images/tutorials/11-database/11-01-db-heading.png)

In previous tutorials we used the file system to store data persistently. This works fine for smaller projects, but there are some limitations to storing data directly in a file system. A more advanced way to store data which is used by nearly any production application is a database.

Another advantage of storing data in a database instead of in files is that it separates our code and data cleanly. If we build an application on Repl.it that processes any kind of data, it's likely that we'll want to share the code with other people but **not** the data. Having our data cleanly separated into a private database allows us to do exactly this.

In this tutorial, you'll see how to store data from a Repl.it project directly in the Repl.it key-value store, one of the simplest varieties of database, similar to a Python dictionary and more scalable.

As a demonstration project, we'll build a basic phone book application, storing contact information about friends and family and a command line application to allow users to:

* add new contacts
* search for existing contacts
* update existing contacts
* remove contacts.

This will cover the so-called "CRUD" (Create, Read, Update, Delete) operations that are fundamental to any database-backed software.

Now create a new Python repl called "phonebook".

## Adding and reading data using the Repl.it database

In the `main.py` file import the database driver with this code:

```python
from replit import db
```

Databases usually store data on a separate physical server from where your code is running, so your code needs to know how to find the database and how to authenticate (to prove that you are authorised to access a specific database to stop other people reading your data).

Usually we would have to supply some kind of credentials for this (e.g. a username and password), as well as an endpoint to indicate where the database can be found. In this case, Repl.it handles everything automatically (as long as you are signed in), so you can start storing data straight away.

The `db` object works very similarly to a global Python dictionary but any data is persistently stored. You can associate a specific value with a given key in the same way. Add the following to your `main.py` file.

```python
db["Smith, John"] = "0123456789"
print(db["Smith, John"])
```

You should see the phone number printed to the console, as shown below.

![**Image 2:** *Viewing a phone number from the database.*](/images/tutorials/11-database/11-02-print-number.png)

### How is this different from a dictionary?

The main difference between using the database and a Python dictionary is that, with the database, the data is:

* _persisted_ between runs
* kept separate from the code.

For a concrete example, consider storing the same "John Smith" contact in both a dictionary and the database. Replace the code in your `main.py` file with the following and run it.

```python
from replit import db 

# database
db["Smith, John"] = "0123456789"
print(db["Smith, John"])

# dictionary
d = {}
d["Smith, John"] = "0123456789"
print(d["Smith, John"])
```

Here we store the information first in the database and print it from the database and then in a dictionary and print it from there. In both cases, we see the result printed and the syntax is exactly the same.

However, if we comment out the lines where we create the association between key and value, and run the code again, we'll see a difference.

```python
from replit import db 

# database
# db["Smith, John"] = "0123456789"
print(db["Smith, John"])

# dictionary
# d = {}
# d["Smith, John"] = "0123456789"
print(d["Smith, John"])
```

In this case, the first print still works as the data has persisted in the database. However the dictionary has been cleared between runs so we get the error `NameError: name 'd' is not defined`.

Because each Repl.it project has its own unique database which needs a secret key to access, you can add as much data to your database and still share your project without sharing any of your data.

The database also has some functionality that Python dictionaries do not, such as searching keys by prefix, which we will take a closer look at soon.

## Building a basic phonebook application that can read and store data

Let's get started with the application. We'll build two separate components in parallel, piece by piece:

1. The database logic to create, read, update, and delete contacts.
2. The command line interface to prompt the user to choose what to do, get input, and show output.

We'll keep the code that interacts with users in our `main.py` file and the database logic in a new module called `contacts.py`

As we don't have any contacts yet, we'll start by allowing our users to add them.

### Allowing the user to add contacts to the phonebook

Let's build the user interaction side first. We need to be able to accept input from the user and show them prompts and output. Add the following code to `main.py`:

```python
def prompt_add_contact():
    name = input("Please enter the contact's name: ")
    number = input("Please enter the contact's phone number: ")
    print(f"Adding {name} with {number}")

prompt_add_contact()
```

This doesn't actually store the contact anywhere yet, but you can test it out to see how it prompts the user for input and then displays a confirmation message. 

Next we need to add some logic to store this in our database.

Create a new file called contacts.py and add the following code.

```python
from replit import db 

def add_contact(name, phone_number):
    if name in db:
        print("Name already exists")
    else:
        db[name] = phone_number
```

Because we will use people's names as keys in our database and because it's possible that different people share the same name, it's possible that our users could overwrite important phone numbers by adding a new contact with the same name as an existing one. To prevent this, we'll ensure that they use a unique name for each contact and only add information with this method to **new** names.

Back in the `main.py` file add two lines to import our new module and call the add_contact function. The new code should look as follows:

```python
import contacts

def prompt_add_contact():
    name = input("Please enter the contact's name: ")
    number = input("Please enter the contact's phone number: ")
    print(f"Adding {name} with {number}")
    contacts.add_contact(name, number)

prompt_add_contact()
```

Test that this works - run it twice and enter the same name both times, with a different phone number. You should see the confirmation the first time, but the second time it will inform you that the contact already exists, as shown below.

![**Image 3:** *Adding new contacts or showing an error.*](/images/tutorials/11-database/11-03-contact-already-exists.png)

### Allowing users to retrieve details of stored contacts

Now that we've added a contact to our database, let's allow users to retrieve this information. We want the user to be able to input a name and get the associated phone number in return. We can follow a similar pattern to before: adding a function to both our `main.py` file to handle user interaction and a separate one to our `contacts.py` file to handle database interaction.

In `main.py` add the following function and change the last line to call our new function instead of the `prompt_add_contact()` one, as follows:

```python
def prompt_get_contact():
    name = input("Please enter the name to find: ")
    number = contacts.get_contact(name)
    if number:
        print(f"{name}'s number is {number}")
    else:
        print(f"It looks like {name} does not exist")

prompt_get_contact()
```

Note that this time we call the `get_contact` function before we write it - we have a blueprint that works now from our previous example so we can skip some back-and-forth steps.

Add the following function to `contacts.py`:

```python
def get_contact(name):
    number = db.get(name)
    return number
```

Our new code to go into `contact.py` is very simple and it might be tempting to just put this logic directly in the `main.py` file as it's so short. However it's good to stay consistent as each of the files is likely to grow in length and complexity over time, and it will be easier to maintain our codebase if our user interaction code is strictly separate from our database interaction code.

Run the code again and input the same name as before. If all went well, you'll see the number, as in the example below.

![**Image 4:** *Retrieving contacts from user input.*](/images/tutorials/11-database/11-04-get-number.png)

### Interlude: Creating a main menu

We now have functionality to add and retrieve contacts, and still need to add:

* searching for names with partial matches
* updating existing contacts (name or number)
* removing contacts.

But before we get started on those problems, we need to allow users to choose what kind of functionality they want to activate. With a GUI or web application, we could add some menu items or buttons, but our command line application is driven only by text input and output on a simple console. Let's build a main menu that allows users to specify what they want to do.

To make life easier for our users, we'll let them make choices by inputting a single number that's associated with the relevant menu item.

Change your `main.py` file to look as follows:

```python
import contacts
from os import system

main_message = """WELCOME TO PHONEBOOK
----------------------------------
Please choose:
1 - to add a new contact
2 - to find a contact
----------------------------------
"""

def prompt_add_contact():
    name = input("Please enter the contact's name: ")
    number = input("Please enter the contact's phone number: ")
    print(f"Adding {name} with {number}")
    contacts.add_contact(name, number)

def prompt_get_contact():
    name = input("Please enter the name to find: ")
    number = contacts.get_contact(name)
    if number:
        print(f"{name}'s number is {number}")
    else:
        print(f"It looks like {name} does not exist")

def main():
    print(main_message)
    choice = input("Please make your choice: ").strip()
    if choice == "1":
        prompt_add_contact()
    elif choice == "2":
        prompt_get_contact()
    else:
        print("Invalid input. Please try again.")

while True:
    system("clear")
    main()
    input("Press enter to continue: ")
```

This looks like a lot more code than we had before, but if you ignore the multi-line string at the top and the two functions that we already had, there's not much more. Our new `main()` function asks the users to choose an item from the menu, makes sure that it's a valid choice, and then calls the appropriate function. 

Below our `main()` function, we have an infinite loop so that the user can keep using our application without re-running it after the first action. We call `system("clear")` between runs to clean up the old inputs and outputs (and we also added a new import at the top of the file for this). 

### Extending our search functionality

We already allow users to find contacts by entering their exact name, but it's useful to be able to do partial matches too. If our user inputs "Smith" and we have a "Smith, John" and a "Smith, Mary", we should be able to show the user both of these contacts.

The Repl.it database has a `prefix` function that can find all keys that start with a specific string. Giving "Smi" to this prefix function would match "Smith", "Smith, John" and "Smith, Mary", but **not** "John Smith", as it only matches from the **start** of each key. 

You can use this by calling, for example, `db.prefix("Smi")` which will return all of the *keys* that match the "Smi" prefix. Note that this does not return the values (in our case, the phone numbers), so once we have our matches we still need to look up each phone number individually.

We want our application to prefer finding an exact match if one exists, or gracefully fall back to returning a list of matches by prefix only if there is no exact match.

Add a new function to `contacts.py` that can search for contacts and extract each phone number as follows:

```python
def search_contacts(search):
    match_keys = db.prefix(search)
    return {k: db[k] for k in match_keys}
```

And over in `main.py` modify the `prompt_get_contacts()` function to call this if necessary (when there is no exact match) as follows:

```python
def prompt_get_contact():
    name = input("Please enter the name to find: ")
    number = contacts.get_contact(name)
    if number:
        print(f"{name}'s number is {number}")
    else:
        matches = contacts.search_contacts(name)
        if matches:
            for k in matches:
                print(f"{k}'s number is {matches[k]}")
        else:
            print(f"It looks like {name} does not exist")
```

Run the code again and choose to add a contact. Enter "Smith, Mary" when prompted and any phone number. When the program starts over, choose to find a contact and input "Smi". It should print out both "Smith" matches that we have, as shown below.

![**Image 5:** *The user menu: They can now choose what action to do.*](/images/tutorials/11-database/11-05-choose-add-contact.png)

### Allowing users to update contacts

There are two ways that users might want to update contacts. They should be able to:

1. Change the name of a contact but keep the same phone number
2. Change the phone number of a contact but keep the same name

Because we are storing contacts as keys and values, to do 1) we need to create a new contact and remove the original one, while for 2) we can simply update the value of the existing key.

We can handle both cases with a single prompt by allowing the user to leave either field blank, in this case preserving the old value. Add the following function to your `main.py` file.

```python
def prompt_update_contact():
    old_name = input("Please enter the name of the contact to update: ")
    old_number = contacts.get_contact(old_name)
    if old_number:
        new_name = input(f"Please enter the new name for this contact (leave blank to keep {old_name}): ").strip()
        new_number = input(f"Please enter the new number for this contact (leave blank to keep {old_number}): ").strip()

        if not new_number:
            new_number = old_number

        if not new_name:
            contacts.update_number(old_name, new_number)
        else:
            contacts.update_contact(old_name, new_name, new_number)
            
    else:
        print(f"It looks like {old_name} does not exist")
```

This uses two functions in our `contacts.py` file that don't exist yet. These are:

* `update_number` to keep the contact but change the phone number
* `update_contact` to update the name (and maybe also the number) by removing the old contact and creating a new one.

Create these two functions in `contacts.py` as follows.

```python
def update_number(old_name, new_number):
    db[old_name] = new_number

def update_contact(old_name, new_name, new_number):
    db[new_name] = new_number
    del db[old_name]
```

Note how we can use the `del` Python keyword to remove things from our database. We'll use this again in the next section.

Now we need to allow users to choose "update" as an option from the menu. In the `main.py` file, add a new line to the menu prompt to inform our users about the option and update the `main()` function to call the new update function when appropriate, as follows:

```python
main_message = """WELCOME TO PHONEBOOK
----------------------------------
Please choose:
1 - to add a new contact
2 - to find a contact
3 - to update a contact
----------------------------------
"""
# ...
```

```python
def main():
    print(main_message)
    choice = input("Please make your choice: ").strip()
    if choice == "1":
        prompt_add_contact()
    elif choice == "2":
        prompt_get_contact()
    elif choice == "3":
        prompt_update_contact()
    else:
        print("Invalid input. Please try again.")
```

Test it out! Change someone's name, someone else's number, and then update both the name and the number at once.

### Allowing users to remove contacts

Sometimes there are people we just don't want to talk to any more. We've already seen how to remove contacts by updating their key and removing the old one, but let's allow for removals without updates too. By now, you should be familiar with the parts of the code that you need to update. To recap, these are:

* adding a new `prompt_*` function to the `main.py` file
* adding a new `*_contact` function to `contacts.py`
* adding a new line to the menu prompt in `main.py`
* adding a new `elif` block to the `main()` function in `main.py`.

These are each shown in turn below.

```python
def prompt_delete_contact():
    name = input("Please enter the name to delete: ")
    contact = contacts.get_contact(name)
    if contact:
        print(f"Deleting {name}")
        contacts.delete_contact(name)
    else:
        print(f"It looks like {name} does not exist")
```

```python
def delete_contact(name):
    del db[name]
```

```python
main_message = """WELCOME TO PHONEBOOK
----------------------------------
Please choose:
1 - to add a new contact
2 - to find a contact
3 - to update a contact
4 - to delete a contact
----------------------------------
"""
```

```python
def main():
    print(main_message)
    choice = input("Please make your choice: ").strip()
    if choice == "1":
        prompt_add_contact()
    elif choice == "2":
        prompt_get_contact()
    elif choice == "3":
        prompt_update_contact()
    elif choice == "4":
        prompt_delete_contact()
    else:
        print("Invalid input. Please try again.")
```

It may be a bit inconvenient to type out the whole name of a contact that you want to delete, but it's usually acceptable to make "dangerous" operations less user friendly. As there is no way to recover contacts, it's good to make it a bit more difficult to delete them. Maybe our user will change their mind while typing out the name of an old friend to delete the record and reach out instead :).

## Make it your own

If you've followed along, you'll have your own version of the repl to extend. Otherwise start from ours below.

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/cwr-11-phonebook?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Where next

You've learned how basic databases work. Databases are a complicated topic on their own and it can take years or decades to master the more advanced aspects of them, but they can also do more than the simple operations that we've covered here. Spend some time reading about [PostgreSQL](https://www.postgresql.org/) and [relational databases](https://en.wikipedia.org/wiki/Relational_database) in general, or other [key-value stores](https://en.wikipedia.org/wiki/Key%E2%80%93value_database) like the Repl.it database.

Even without further research, the basic Create, Read, Update, and Delete (CRUD) operations that we covered here will get you far and you can build nearly any app you can imagine with just these.

Next we'll take a look at playing audio files programmatically so you can use Python to control your music.

