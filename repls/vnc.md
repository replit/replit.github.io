# Native Graphics using VNC 

## What is VNC?

VNC a mature virtual desktop protocol that allows your Repl to stream a native desktop to your web browser. By using this protocol, native applications (developed in Python, Java, C++, etc) can open desktop windows as they would on any physical computer. 

This streaming technology allows you to work with legacy applications in your browser from any device! For example, you could run a Python-powered game designed for desktop right on your mobile phone or tablet without making any changes to the underlying code.

<img style="width:600px" src="https://docs.replit.com/images/vnc/tetris.png"/>

<a href="https://replit.com/@demcrepl/Tetris-in-Pygame" target="_blank">Tetris (powered by PyGame)</a>

## How can I use VNC?

Any repl - in any language - can use a virtual desktop. No changes are needed to execute native graphics programs on Replit. The VNC pane will appear when any application attempts to open a native desktop window.


## Securing your repl 

By default your VNC connection does not have a password, and can only be accessed from https://replit.com, since the connection relies on the same authentication used for the WebSocket. Should you need to access your repl via the external [noVNC](https://novnc.com) client, you may opt to set a VNC password.

Set a password in your repl [env](https://docs.replit.com/repls/secret-keys) configuration.  `env` is a secure place to store passwords without the fear of other users accessing your passwords. Setting `VNC_PASSWORD` will add enchanced security when connecting remotely.

## How can I use fullscreen VNC?

You must complete the "Securing your repl" section to proceed with these steps.

1. Execute the following command in your Shell tab: `echo $REPL_ID`

   <img style="width:300px" src="https://docs.replit.com/images/vnc/replid.png"/>

2. Construct your connection URL by replacing `REPL_ID` in with the output from above: `<REPL_ID>.id.repl.co`

3. Open the [noVNC client](https://novnc.com/noVNC/vnc.html) in a separate browser tab.

4. Open connection settings.

   <img style="width:50px" src="https://docs.replit.com/images/vnc/settings.png"/>

5. Expand the WebSockets field. Enter your connection URL (`<REPL_ID>.id.repl.co`) in the `host` field.

   <img style="width:200px" src="https://docs.replit.com/images/vnc/host.png"/>

6. Use the `runner` username and the password configured above (ETA: Apr 7) when asked for credentials.

## Examples

- <a href="https://replit.com/@demcrepl/Tetris-in-Pygame" target="_blank">PyGame</a>
- <a href="https://replit.com/@amasad/docs-matplotlib" target="_blank">Python matplotlib</a>
- <a href="https://replit.com/@sigcse2021/Game-of-Life-demcrepl" target="_blank">Java Processing</a>
