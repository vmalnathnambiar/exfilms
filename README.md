# exfilms

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

A command line application to extract MS data from mzML into JSON, with spectrum filtering capability.

## Installation
To install `exfilms`, you will need to first have the following installed on your machine:
- [Node.js®][nodejs-url]  

### Method 1 - via GitHub
This is useful if you want to contribute or just want to use it without publishing any changes back to GitHub.

```md
# Clone and navigate to repository
$ git clone https://github.com/vmalnathnambiar/exfilms.git
$ cd exfilms

# Install dependencies
$ npm install

# Install package globally
$ npm install -g .
```

### Method 2 - via npm (node package manager) [CURRENTLY NOT AVAILABLE]
`$ npm install exfilms`

## Usage
```md
# Basic command execution using default extraction/filtering parameters
$ exfilms --inputDir (or -i) "/path/to/input/directory/containing/mzML/data/files/"

# To use interactive mode
$ exfilms --interactive

# For help
$ exfilms --help
```

*For assistance in converting your vendor-specific MS data into mzML, please refer to our guide on data conversion [here](./guide/dataConversion.md).*

## Platform Compatibility  

This package has been tested on the following platforms:
- Windows
- macOS
- Linux

## API Documentation
Please refer to our API documentation [here](https://vimalnathnambiar.github.io/exfilms/).

## License
Please refer to our license information [here](./LICENSE).

[npm-image]: https://img.shields.io/npm/v/exfilms.svg
[npm-url]: https://www.npmjs.com/package/exfilms
[ci-image]: https://github.com/vimalnathnambiar/exfilms/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/vimalnathnambiar/exfilms/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/vimalnathnambiar/exfilms.svg
[codecov-url]: https://codecov.io/gh/vimalnathnambiar/exfilms
[download-image]: https://img.shields.io/npm/dm/exfilms.svg
[download-url]: https://www.npmjs.com/package/exfilms
[nodejs-url]: https://nodejs.org/en/download/