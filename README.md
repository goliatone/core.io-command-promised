## core.io Command Promised

This module extends [core.io](https://github.com/goliatone/application-core) context object with a new method: `promisedCommand`.

We can dispatch a command event and `await` the command's resolution:

```js
let response = await context.promisedCommand('api.get', event);
```

### Install

```
$ npm i -S core.io-command-promised
```

## License
® License 2020 by goliatone
