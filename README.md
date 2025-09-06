# Startercraft CLI

> **Note:** Currently, `@startercraft/cli` is a library for use with [PlopJS](https://plopjs.com/).

## Usage Example

Install the package:

```bash
npm install --save-dev @startercraft/cli
```

Use it in your `plopfile.js`:

```js
const startercraft = require('@startercraft/cli');
/**
 * @param {import('plop').NodePlopAPI} plop
 */
module.exports = function (plop) {
  startercraft.default(plop);
};
```

This will register Startercraft generators with PlopJS.

## Features
- Generate React components, features, providers, and subcomponents using built-in templates
- Integrate with project configuration and code organization standards

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## License
This project is licensed under the MIT License.
