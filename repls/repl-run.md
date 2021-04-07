We decided to sunset `repl.run`, which was a way to publish terminal apps as websites. `repl.run` urls will now redirect to the source repls where users can click "run" and use the repl. More information about what led to deprecation can be found [here](https://blog.repl.it/anon).

## Workaround

If you relied on repl.run as an easy to share only the terminal output of an app, you can use the following URL parameters to get a similar effect: 

- `embed=1`
- `output=1`

Example: https://repl.it/@util/jerbs?embed=1&output=1

Note that users still have to click the run button, but otherwise it should look fairly close to repl.run and is also embeddable on your website or blog.
