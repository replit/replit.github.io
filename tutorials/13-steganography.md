# Hiding messages in images: steganography with Python and Repl.it
 
In this tutorial, we'll build a steganography tool in Python. Steganography is the practice of hiding information within other data. Unlike encryption, where the goal is to secure *the contents* of communication between two parties, steganography aims to obscure the fact that the parties are communicating at all.

Our tool will enable the user to hide secret text within a normal-looking `.png` image file. The receiver of the image will use the same tool to reveal the hidden message.

We'll use Python to build the tool. The most popular Python image processing libraries are [Pillow](https://pypi.org/project/Pillow/) and [OpenCV](https://pypi.org/project/opencv-python/), but these are heavy libraries with many dependencies. We'll avoid these and instead use the lightweight [PyPNG](https://pypi.org/project/pypng/) library which is written in pure Python, and therefore easier to run on various platforms.
 
## A quick background on steganography
 
Let's imagine three people: Alice, Bob and Eve. Alice wants to send a private message to Bob, while Eve wants to intercept this message. While modern-day encryption can help Alice and Bob ensure that Eve doesn't know the *contents* of their message, Eve can possibly still deduce interesting information just from knowing that Alice and Bob are communicating at all, and how frequently they communicate.

To obscure the communication channel completely, Alice and Bob can exploit the fact that hundreds of millions of photos are uploaded and shared across the internet daily. Instead of communicating directly, Alice can leave her message hidden in an image at a pre-agreed location and Bob can access this message. From Eve's perspective, there is now no direct communication between the two.
 
A single image is made up of millions of pixels. While many formats exist, a pixel is most simply represented by a group of three numbers between 0 and 255, one number each for the red, blue, and green values of that pixel. Using this Red-Green-Blue scheme we can represent any colour in the [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model).
 
Digital text, like images, is also represented internally by numbers, so the differences between a text file and an image file are not as large as you might assume. Any digital data can be represented as a [binary string](https://thehelloworldprogram.com/computer-science/what-is-binary/), a bunch of 1s and 0s, and we can make tiny modifications to an image to encode a binary string within it. As an example, consider the following:

```python
image = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
```
This is a representation of an image with three pixels: one red, one green, and one blue. If we encode this as an image and open it in an image viewer, we'll see the three pixel image, but if we read this data with Python, it is simply a list of tuples, each containing three integers.

We could also look at each value making up each pixel and calculate whether it is *odd* or *even*. We could encode odd numbers as `1` and even values as `0`. This would give us the binary string "100 010 001" (as the 255 values are odd and the 0s are even).

If we made a small modification to the image as follows:

```python
image = [(254, 1, 1), (1, 255, 1), (1, 0, 254)]
```

The image would look almost identical in any image viewer (we have just added or subtracted a minuscule amount of color from some values), but the binary string -- using our odd/even method -- would look completely different: "011 111 100". 

Using this technique but extending it over an entire image (millions of pixels), we can hide a large amount of text data in any image.

## Creating the project on Repl.it

If you were serious about keeping your messages as secret as possible, you'd want to do all of these steps on an offline computer that you fully control. As a learning exercise though, we'll set the project up on [repl.it](https://repl.it). Navigate to their site and sign up for an account if you don't have one.

Create a new project, choosing "Python" as the language, and give your project a name.

![Creating a new repl](/images/tutorials/13-steganography/04-create-repl.png)

The first piece we need to build is a function to encode any text message as a binary string.
 
## Encoding a text message as a binary string
 
Open the `main.py` file and add the following code
 
```python
import base64
 
def encode_message_as_bytestring(message):
    b64 = message.encode("utf8")
    bytes_ = base64.encodebytes(b64)
    bytestring = "".join(["{:08b}".format(x) for x in bytes_])
    return bytestring
```

This first encodes our text as [base64](https://en.wikipedia.org/wiki/Base64) and then as a binary string. You can add some print statements to see how the message is transformed in the different steps, as shown below.

![Encoding a message as a binary string](/images/tutorials/13-steganography/13-01-encode-binstring.png)

The base64 step is not strictly necessary, but it is useful as any file or data can be encoded as base64. This opens our project up to future extensions such as hiding other kinds of files within image files instead of just text strings.

## Adding an 'end of message' delimeter

We'll assume that our message will always 'fit' in our image. We can fit three binary digits per pixel (one for each of the RGB values), so our resulting binary string should be shorter than the the number of pixels in the image multiplied by three.

We'll also need to know when the message *ends*. The message will only be encoded in the beginning of the image file, but if we don't know how long the message is, we'll keep looking at normal pixels and trying to encode them as text data. Let's add an "end of string" delimiter to the end of our message: this should be something that wouldn't appear half way through our actual message by chance. We'll use the binary representation of '!ENDOFMESSAGE!' for this.

Modify your function to look as follows, which adds this delimeter at the end.

```python
import base64
 
ENDOFMESSAGE = "0100100101010101010101100100111101010010010001010011100101000111010101000101010101010110010101000101010100110000010001100100100001010010010100110100010100111101"
 
def encode_message_as_bytestring(message):
    b64 = message.encode("utf8")
    bytes_ = base64.encodebytes(b64)
    bytestring = "".join(["{:08b}".format(x) for x in bytes_])
    bytestring += ENDOFMESSAGE
    return bytestring
```

Now that we can handle some basic text encoding, let's look at images.

## Getting pixels from an image

Find a PNG image somewhere - either one you've taken yourself or from a site like unsplash. You can use any online JPG to PNG converter if you only have `.jpg` files available.

Upload your PNG file by clicking on the three dot menu in the repl sidebar, in the top right corner of the files pane to the left, and selecting `upload file` or by simply dragging and dropping your file within the files pane.
 
![Image showing file upload](/images/tutorials/13-steganography/05-upload-file.png)

We're going to write a function that extracts the raw pixel data from this image file. Add an import to the top of the file.

```python
import png
```

And then add a new function to the bottom of `main.py`:
 
```python
def get_pixels_from_image(fname):
    img = png.Reader(fname).read()
    pixels = img[2]
    return pixels
```

The `read()` method returns a 4‑tuple consisting of:
 
- width: Width of PNG image in pixels
- height: Height of PNG image in pixels
- rows: A sequence or iterator for the row data
- info: An info dictionary containing some meta data

We are primarily interested in the third item, "rows", which is an iterator containing all the pixels of the image, row by row. If you're not familiar with Python generators take a look at [this guide](https://realpython.com/introduction-to-python-generators/), but they are essentially memory-efficient lists.

## Encoding the image with the message
 
Now that we have the encoded message and pixels of the image ready we can combine them to form our secret encoded image.
 
Add the following function to the bottom of the `main.py` file. This function takes in the outputs from the previous functions (our raw pixels and our message encoded as a binary string), and combines them.
 
```python
def encode_pixels_with_message(pixels, bytestring):
    '''modifies pixels to encode the contents from bytestring'''
 
    enc_pixels = []
    string_i = 0
    for row in pixels:
        enc_row = []
        for i, char in enumerate(row):
            if string_i >= len(bytestring):
                pixel = row[i]
            else:
                if row[i] % 2 != int(bytestring[string_i]):
                    if row[i] == 0:
                        pixel = 1
                    else:
                        pixel = row[i] - 1
                else:
                    pixel = row[i]
            enc_row.append(pixel)
            string_i += 1
 
        enc_pixels.append(enc_row)
    return enc_pixels
```

This is the most complicated part of our project, but most of the code is there to handle edge cases. The important insight is that we want to control whether each pixel has an odd value (representing a 1 in our binary string) or an even one (to represent a 0). By chance, half of the pixel values will already have the correct value.

We simply loop through the binary string and the pixel and 'bump' each value that isn't correct by one. That is, we subtract 1 from the value if we need to change it from odd to even or vice versa. We don't want any negative numbers, so if we need to change any of the `0` values, we add 1 instead.

### Writing our modified pixels back to an image
 
We now have all the image data, including the encoded message but it is still just a list of pixels. Let's add a function that will compile our pixels back into a PNG image.
 
Add the following function to the bottom of the `main.py` file.
 
```python
def write_pixels_to_image(pixels, fname):
    png.from_array(pixels, 'RGB').save(fname)
```

The above function takes the array `pixels` and uses the `png` module to write these to a brand new `.png` file.

Play around with these functions to make sure you understand how they work. Before we write some wrapper code to actually use these, we're going to do everything backwards so that we can also extract hidden messages from previously encoded PNG files.
 
## Decoding messages from image files

First we need a function that can turn a binary string back into readable text. As before, we'll go via base64 for better compatability. Add the following function to the bottom of the `main.py` file.

```python
def decode_message_from_bytestring(bytestring):
    bytestring = bytestring.split(ENDOFMESSAGE)[0]
    message = int(bytestring, 2).to_bytes(len(bytestring) // 8, byteorder='big')
    message = base64.decodebytes(message).decode("utf8")
    return message
```

Remember how we added a special `ENDOFMESSAGE` delimiter above? Here we first split our string on that so we don't look for text in random data (pixels from the unmodified part of the image) and then go backwards through our encoding pipe: first to base64 and then to text.

We also need a way to extract the bytestring from an image. Add the following function to `main.py` to do this.

```python
def decode_pixels(pixels):
    bytestring = []
    for row in pixels:
        for c in row:
            bytestring.append(str(c % 2))
    bytestring = ''.join(bytestring)
    message = decode_message_from_bytestring(bytestring)
    return message
```

Once again, this is just the reverse of what we did before. We grab the remainder of each value to get `1` for each odd value and `0` for each even one and keep them in a string. We then call our decode function to get the plaintext.

That's it for our encoding and decoding functions; next we'll put everything together in our `main()` function.
 
## Adding a command line wrapper script

At this point, we could create a web application with a UI for people to add text to their images. Given the fact that people who want to do steganography probably won't trust a web application with their data, we'll rather create a command line application that people can run on their own machines.
 
Add the following to the top of your `main.py` file, right below the imports.
 
```python
PROMPT = """
Welcome to basic steganography. Please choose:
 
1. To encode a message into an image
2. To decode an image into a message
q. To exit
"""
```

Now let's write the `main()` function that puts it all together. Add the following to the end of the `main.py` file.
 
```python
def main():
    print(PROMPT)
    user_inp = ""
    while user_inp not in ("1", "2", "q"):
        user_inp = input("Your choice: ")
    
    if user_inp == "1":
        in_image = input("Please enter filename of existing PNG image: ")
        in_message = input("Please enter the message to encode: ")
 
        print("-ENCODING-")
        pixels = get_pixels_from_image(in_image)
        bytestring = encode_message_as_bytestring(in_message)
        epixels = encode_pixels_with_message(pixels, bytestring)
        write_pixels_to_image(epixels, in_image + "-enc.png")
 
    elif user_inp == "2":
        in_image = input("Please enter the filename of an existing PNG image: ")
        print("-DECODING-")
        pixels = get_pixels_from_image(in_image)
        print(decode_pixels(pixels))
 
if __name__ == "__main__":
    main()
```

The `main()` function above creates a prompt flow for the user to interact with the program. Depending on the input from the user, the program will call the relevant functions in order to either encode or decode a message. We also included a `q` for the user to close the program.

## Where next?
 
If you have followed along you'll have your own repl to expand; if not you can fork [our repl](https://repl.it/@ritza/python-steganography) and work from there or test it out below.
 
<iframe height="400px" width="100%" src="https://repl.it/@ritza/python-steganography?lite=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>
