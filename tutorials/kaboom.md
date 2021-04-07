# Kaboom Editor

Kaboom.js is a game programming library that makes it fun and easy to build games! 

this doc is mainly explaining the tools provided by the kaboom editor on replit, to learn the kaboom library, it's recommended to check out the docs, guides and examples on the kaboom website:

https://kaboomjs.com/


## Scene Manager

in plain kaboom.js, you would write each scene's content inside each scene block:

```js
scene("start", () => {
	add(...);
	action(...);
	keyPress(...);
});

scene("game", () => {
	// ...
});
```

in replit kaboom editor, scenes are treated as files and you don't have to wrap everything in a scene block

![scene](/images/tutorials/kaboom/scene.png)

each scene will receive a `args` argument which contains the argument that you pass from e.g. `go("win", { score: 18, })`

## Sprite Manager & Editor

a nice list of sprites 

the editor will take care of `loadSprite()` calls, so you can directly use these with the `sprite('name')` component!

There're 2 ways to add sprites right now:

1. drag to upload your own files

![drag](/images/tutorials/kaboom/drag.png)

2. click '+' to create a sprite with the sprite editor!

![addsprite](/images/tutorials/kaboom/addsprite.png)

the sprites edited will be automatically saved, and can be directly used from the game!

![pedit](/images/tutorials/kaboom/pedit2.png)
![workspace](/images/tutorials/kaboom/workspace.png)

(right now the sprite editor is not optimized for big sized sprites)

## Sound Manager

right now it's just a place like sprite manager that lists your sounds, you can drag your sound files here and don't have to call `loadSound`, a built-in sound / music editor will come in the future!

## Debug

the debug menu contains some handy helper tools to help you inspect game states

![debug](/images/tutorials/kaboom/debug.png)


## Settings

the settings menu contains some game related configs, including

- size of the game canvas
- if fullscreen or not (ignores the size setting)
- pixel scale (try scale it up if you're making pixelated games)
- starting scene
- library version (new kaboom repls defaults to the latest version, if newer version comes out after you created the repl, you need to manually select it, unless you're on `dev` version, in that case you'll always be on the latest version and breaking change is possible)

![settings](/images/tutorials/kaboom/settings.png)