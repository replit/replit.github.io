# Working with Files using Repl.it

In this lesson, you'll gain experience with using and manipulating files using Repl.it. In the previous lesson you saw how to add new files to a project, but there's a lot more you can do. 

Files can be used for many different things. In programming, you'll primarily use them to store data or code. Instead of manually creating files and entering data, you can also use your programs to create files and automatically write data to these.

Repl.it also offers functionality to mass import or export files from or to the IDE; this is useful in cases when your program writes data to multiple files and you want to export all of these for use in another program.

## Working with files using Python

Create a new Python repl and call it `working-with-files`.

![**Image 1:** Creating our files project](/images/tutorials/02-managing-files/02-01-new-repl.png)

As before, you'll get a default repl project with a `main.py` file. We need a data file to practise reading data programmatically.

1. Create a new file using the `add file` button.
2. Call the file `mydata.txt`. Previously we created a Python file (`.py`) but in this case we are creating a plain text file (`.txt`).
3. Type a line of text into the file.

You should now have something similar to what you see below.

![**Image 2:** Adding data manually to our text file](/images/tutorials/02-managing-files/02-02-mydata-txt.png)

Go back to the `main.py` file and add the following code.

```python
f = open("mydata.txt")
contents = f.read()
f.close()
print(contents)
```

This opens the file programmatically, reads the data in the file into a variable called `contents`, closes the file, and prints the file contents to our output pane. 

Press the `Run` button. If everything went well, you should see output as shown in the image below.

![**Image 3:** Reading data from a file and printing it out](/images/tutorials/02-managing-files/02-03-read-file.png)

## Creating files using Python

Instead of manually creating files, you can also use Python to do this. Add the following code to your `main.py` file.

```python
f = open("createdfile.txt", "w")
f.write("This is some data that our Python script created.\n")
f.close()
```

Note the `w` argument that we pass into the `open` function now. This means that we want to open the file in "write" mode. Be careful: if the file already exists, Python will delete it and create a new one. There are many different 'modes' to work with files in different ways which you can read about in the [Python documentation](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files).

Run the code again and you should see a new file pop up in the files pane. If you click on the file, you'll find the data that the Python script wrote to it, as shown below.

![**Image 4:** Writing data to a file and viewing it](/images/tutorials/02-managing-files/02-04-write-file.png)

## Building a weather logging system using Python and Repl.it

Now that you can read from files and write to them, let's build a mini-project that records historical weather temperatures. Our program will

* Get the current temperature for a specified set of cities.
* Write this data to file with today's date.
* Print a summary of this data to the console.

### Creating a WeatherStack Account and getting an API key

We'll get weather data from the WeatherStack API. You'll need to sign up at [weatherstack.com](https://weatherstack.com) and follow the instructions to get your own access key. Choose the "free tier" option which is limited to 1000 calls per month.

After sign-up, you should see a page similar to the following containing the API access key.

![**Image 5:** *Getting an API key from WeatherStack*](/images/tutorials/02-managing-files/02-05-weatherstack-api.png)

You should keep this key secret to stop other people using up all of your monthly calls.

### Creating our weather reporting project

You can continue to use the `working-with-files` project that you created earlier if you want to, but for the demonstration we'll create a new Python repl called `weather report`.

In the `main.py` file add the following code, but replace the string for `API_KEY` with your own one.

```python
import requests

# change the following line to use your own API key
API_KEY = "baaf201731c0cbc4af2c519cb578f907"
WS_URL = "http://api.weatherstack.com/current"

city = "London"

parameters = {'access_key': API_KEY, 'query': city}

response = requests.get(WS_URL, parameters)
js = response.json()
print(js)
print()
```

This code asks WeatherStack for the current temperature in London, gets the [JSON](https://www.w3schools.com/js/js_json_intro.asp) version of this and prints it out. You should see something similar to what is shown below.

![**Image 6:** *Getting the current weather in JSON format*](/images/tutorials/02-managing-files/02-06-get-request.png)

WeatherStack returns a lot of data, but we are mainly interested in

1. **The location:** To see if we found the correct London and not one of the [29 other places](https://www.wanderlust.co.uk/content/londons-around-the-world/) called London.
2. **The date:** We'll record this when we save this data to a file.
3. **The current temperature:** This is specified by default in Celsius, but [can be customised](https://weatherstack.com/documentation) if you prefer Fahrenheit.

Add the following code below the existing code to extract these values into a format that's easier to read.

```python
temperature = js['current']['temperature']
date = js['location']['localtime']
city = js['location']['name']
country = js['location']['country']

print(f"The temperature in {city}, {country} on {date} is {temperature} degrees Celsius")
```

If you run the code again, you'll see a more human-friendly output, as shown below.

![**Image 7:** *Seeing a human-readable summary of the data*](/images/tutorials/02-managing-files/02-07-foramat-output.png)

This is great for getting the current weather, but now we want to extend it a bit to record weather historically.

We'll create a file called `cities.txt` containing the list of cities we want to get weather data for. Our script will request the weather for each city, and save a new line with the weather and timestamp.

Add the `cities.txt` file, as in the image below (of course, you can change which cities you would like to get weather info for).

![**Image 8:** *Creating the cities.txt file*](/images/tutorials/02-managing-files/02-08-add-cities.png)

Now remove the code we currently have in `main.py` and replace it with the following.

```python
import requests

API_KEY = "baaf201731c0cbc4af2c519cb578f907"
WS_URL = "http://api.weatherstack.com/current"

cities = []
with open("cities.txt") as f:
    for line in f:
        cities.append(line.strip())
print(cities)

for city in cities:
    parameters = {'access_key': API_KEY, 'query': city}
    response = requests.get(WS_URL, parameters)
    js = response.json()

    temperature = js['current']['temperature']
    date = js['location']['localtime']

    with open(f"{city}.txt", "w") as f:
        f.write(f"{date},{temperature}\n")
```

This is similar to the code we had before, but now we 

* Read the city names from our `cities.txt` file and put each city into a Python list.
* Loop through the cities and get the weather data for each one.
* Create a new file with the same name as each city and write the date and temperature (separated by a comma) to each file.

In our previous examples we explicitly closed files using `f.close()`. In this example, we instead open our files in a `with` block. This is a common idiom in Python and is usually how you will open files. You can read more about this in the [files section of the Python docs](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files). 

If you run this code, you'll see it creates one file for each city.

![**Image 9:** *The script creates one file for each city*](/images/tutorials/02-managing-files/02-09-all-cities.png)

If you open up one of the files, you'll see it contains the date and temperature that we fetched from WeatherStack.

![**Image 10:** *Example data recorded for London*](/images/tutorials/02-managing-files/02-10-write-datetime-weather.png)

If you run the script multiple times, each file will still only contain one line of data: that from the most recent run. This is because when we open a file with in "write" mode (`"w"`), it overwrites it with the new data. Because we want to create historical weather logs, we need to change the second last line to use "append" mode instead (`"a"`).

Change 

```python
    with open(f"{city}.txt", "w") as f:
```

to 

```python
    with open(f"{city}.txt", "a") as f:
```

and run the script again. If you open one of the city files again, you'll see it has a new line instead of the old data being overwritten. Newer data is appended to the end of the file. WeatherStack only updates its data every 5 minutes or so, so you might see exact duplicate lines if you run the script multiple times in quick succession.

![**Image 11:** *Adding new data to the end of each file*](/images/tutorials/02-managing-files/02-11-london-txt.png)

## Exporting our weather data files

If you run this script every day for a few months, you'll have a nice data set that could be useful in other contexts too. If you want to download all of the data from Repl.it, you can use the `Download as zip` functionality to export all of the files in a repl (including the code and data files).

![**Image 12:** *Downloading all of our files from Repl.it*](/images/tutorials/02-managing-files/02-12-export-files.png)

Once you've downloaded the `.zip` file you can extract it in your local file system and find all of the data files which can now be opened with other programs as required.

![**Image 13:** *The created data files on our local file system*](/images/tutorials/02-managing-files/02-13-files-zip.png)

From the same menu, you can also choose `upload file` or `upload folder` to import files into your repl. For example, if you cleaned the files using external software and then wanted your repl to start appending new data to the cleaned versions, you could re-import them.

Repl.it will warn you about overwriting your existing files if you haven't changed the names.

![**Image 14:** *Be careful about overwriting your precious data*](/images/tutorials/02-managing-files/02-14-upload-files.png)

## Make it your own

If you followed along, you'll already have your own version of the repl to extend. If not, start from ours. Fork it from the embed below.

<iframe height="400px" width="100%" src="https://repl.it/@GarethDwyer1/cwr-02-weather-report?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>

## Where next?

That's it for our weather reporting project. You learned how to work with files in Python and Repl.it, including different modes (read, write, or append) in which files can be opened.

You also worked with an external library, `requests`, for fetching data over the internet. This module is not actually part of Python, and in the next article you'll learn more about how to manage external modules or dependencies.

