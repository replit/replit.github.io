# Playing Audio on Repl.it [BETA]

###### Note that audio is currently only enabled for explorers. Learn to become an explorer [here].(https://repl.it/talk/announcements/Become-an-Explorer/6180)

Users can play audio in their repls without creating a website.

To make it as easier for users, we based audio on a request system. This means that users just need to request for a file to be played, rather than reading it directly. Although they aren't directly reading the files, users can still control:

+ The volume of your file
+ How many times your file is played (without sending multiple requests)
+ Whether your file is playing (whether its paused or not)

Another built in feature is the ability for users to play as many files as they would like.

Supported files are `.wav`, `.aiff`, and `.mp3` files (detailed more later). 

Currently, we have Javascript and Python libraries for audio.

An example of the JS library is shown below, and generated docs can be found [here](https://audio-js-docs--allawesome497.repl.co/).

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@turbio/audio-js-demo?lite=true"></iframe>

An example using the Python library is shown below. Generated docs can be found with the Python Repl.it package documented [here](https://replit-docs-python.allawesome497.repl.co/).

<iframe frameborder="0" width="100%" height="500px" src="https://repl.it/@AllAwesome497/py-audio-demo?lite=true"></iframe>

## Community Contributed Libraries

+ [For rust](https://github.com/Daniel-Liu-c0deb0t/replit_audio)


# Developing an Audio Library for Repl.it

Since not everyone uses Python or JS, we decided to document how to make a library.

## Step 1: Add an Audio Source


Currently, supported file types are `.wav`, `.aiff`, and `.mp3` files.

Files are played in mono/single channel mode, files with multiple channels will be read and converted into single channel data.

To make this as light as possible on your repl's resources, audio files are played via a request system. To make a request, simply write to a named pype, `/tmp/audio`. 

An example request might look like:
```json
{
  "Paused": false,
  "Name": "My tone",
  "Type": "tone",
  "Volume": 1,
  "DoesLoop": false,
  "LoopCount": 0,
  "Args": {
    "Pitch": 400,
    "Seconds": 5,
    "Type": 1,
    "Path": ""
  }
}
```


What these fields mean:
+ `Paused` – Whether the source is paused or not. This can only be set when updating the source.
+ `Name` – The name of the source. This can be used to identify the source when it's being created. If it's not set, the name will be set by pid1.
+ `Type` – The type of the source, current supported types are:
    + `wav` – A `.wav` file
    + `aiff` – A `.aiff` file 
    + `mp3` – A `.mp3` file
    + `tone` – A generated tone
+ `Volume` – The volume of the source as a floating point number; `1` would be `100`%.
+ `DoesLoop` – Whether the source should loop or not. If true, `LoopCount` should be set.
+ `LoopCount` – How many times the source should loop. If set to `1`, the source will restart `1`x once its done playing. If set to a negative value it will loop forever. Will be ignored if `DoesLoop` is not true.
+ `Args` – Additional arguments that aren’t used by every source type. 
	+ `Path` (used by `aiff`, `wav`, and `mp3` types) – The path to the file. This can be relative or absolute (relative to the workspace’s root*).
	+ `Pitch` (used for the `tone` type) – The frequency/pitch of the tone.
	+ `Type` (used for the `tone` type) – The wave type of the generated tone. Valid values are:
		+ `0` – The sine wave type
		+ `1` – The triangle wave type
		+ `2` – The saw wave type
		+ `3` – The sqr wave type


## Step 2: Getting the Sstatus of Playing Audio.

An example status for audio is shown below:

```json
{
  "Sources": [
    {
      "Name": "1",
      "Type": "tone",
      "Volume": 1,
      "Duration": 2000,
      "Remaining": 1995,
      "Paused": false,
      "Loop": 0,
      "ID": 1,
      "EndTime": "2020-08-20T18:15:27.763933471Z",
      "StartTime": "2020-08-20T18:15:25.763933471Z",
      "Request": {
        "ID": 0,
        "Paused": false,
        "Name": "1",
        "Type": "tone",
        "Volume": 1,
        "DoesLoop": false,
        "LoopCount": 1,
        "Args": {
          "Pitch": 400,
          "Seconds": 2,
          "Type": 1
        }
      }
    }
  ],
  "Disabled": false,
  "Running": true
}
```

What this is:
+ `Sources` – A list of playing sources.
    + `Name` – The name of the source.
    + `Type` – The type of the source (types documented above).
    + `Volume` – The volume of the source (`float64`).
    + `Duration` – The (estimated) duration of the source (in milliseconds) (`int64`).
    + `Remaining` – The (estimated) time remaining for the source (in milliseconds) (`int64`).
    + `Paused` – Whether the source is paused or not (`bool`).
    + `Loop` – How many times the source will play itself again. Negative values are infinite (`int64`).
    + `ID` – The ID of the source used for updating it (`int64`).
    + `EndTime` – The estimated time when the source will be done playing.
    + `StartTime` – When the source started playing.
    + `Request` – The request used to create the source (documented above).
+ `Disabled` – Whether the pid1 audio player is disabled or not; useful for debugging.
+ `Running` – Whether pid1 is sending audio or not; useful for debugging.

Note: Estimated end time is based on the current loop, and does not factor in the fact that the source may repeat itself.

Note: Timestamps are formatted like so: `yyyy-MM-dd'T'HH:mm:ssZ`

In order to read the data from the sources, you need to read `/tmp/audioStatus.json`.
The file is formatted as shown below:

Note: After a source finishes playing, it is removed from the known sources.

## Step 3: Managing Current Sources

In order to pause or edit a playing source, you first need its ID.
You can get its ID by reading `/tmp/audioStatus.json`, as detailed above.

Edit requests are formatted as shown below:
```js
{
	"ID": 1, // The id of the source
	"Volume": 1, // The volume for the source to be played at
	"Paused": false, // Whether the file is paused or not.
	"DoesLoop": false, // Whether the file should be repeated or not.
	"LoopCount": -1 // How many times to repeat the file.  Set to a negative value to create an endless loop.
}
```

All fields **must** be provided, with the exception of `LoopCount` when `DoesLoop` is `false`.

For editing a source, you could do the following (or the equivelent in other languages):

```py
import json

class NoSuchPlayerException(Exception): pass

def update_source(id, **changes):
    player_data = read_status()  # Assume read_status reads /tmp/audioStatus.json

    for s in player_data['Sources']:
        if s['ID'] == id:
            data = s
            break
    
    if not data:
        raise NoSuchPlayerException(f'No player with id "{id}" found!')

    data.update({key.title(): changes[key] for key in changes})

    with open('/tmp/audio', 'w') as f:
        f.write(json.dumps(data))
```

There is also a simple demo created in Python available [here](https://repl.it/@AllAwesome497/Audio-Demo)


