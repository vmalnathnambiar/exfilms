# exfilms

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

A command line application to extract MS data from mzML into JSON, with spectrum filtering capability.

## Installation  
Download [Node.js®][nodejs-url]  

```bash
# Clone and navigate to repository
$ git clone https://github.com/vmalnathnambiar/exfilms.git
$ cd exfilms

# Install dependencies
$ npm install

# Install package globally
$ npm install -g .
```

<!-- If ExfilMS is created as a package available on NPM, execute the following command  instead of steps 2 and 3: -->
<!-- `$ npm i exfilms` -->

## Usage

```bash
# Basic execution with default extraction/filtering parameters
$ exfilms --inputDir (or -i) "/path/to/input/directory/containing/mzML/data/files/"

# For interactive mode
$ exfilms --interactive

# For help
$ exfilms --help
```

<!-- ```js
import library from 'exfilms';

const result = library(args);
// result is ...
``` -->

<!-- ## [API Documentation](https://vimalnathnambiar.github.io/exfilms/) -->

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/exfilms.svg
[npm-url]: https://www.npmjs.com/package/exfilms
[ci-image]: https://github.com/vimalnathnambiar/exfilms/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/vimalnathnambiar/exfilms/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/vimalnathnambiar/exfilms.svg
[codecov-url]: https://codecov.io/gh/vimalnathnambiar/exfilms
[download-image]: https://img.shields.io/npm/dm/exfilms.svg
[download-url]: https://www.npmjs.com/package/exfilms
[nodejs-url]: https://nodejs.org/en/download/