# exfilms

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

A cross-platform, command line application to extract MS data from mzML files into JSON formatted output files, with spectrum filtering capability.

## Installation
You will need to have the following installed on your machine:
- [Node.js®][nodejs-url]

<br>

Once the required prerequisites has been installed, use npm to install `exfilms`:

`$ npm install exfilms`

## Platform Compatibility  
`exfilms` has been tested on the following platforms:
- Windows
- macOS
- Linux

## Usage
```md
# Basic command execution using default parameters
$ exfilms --inputDir (or -i) "/path/to/input/directory/containing/mzML/data/files/"

# To use interactive mode
$ exfilms --interactive

# For help
$ exfilms --help
```
<br>

For more guidance on how to use `exfilms`, please refer to the available guides below:
- [Data Conversion to mzML](./guide/data-conversion-to-mzML.md)
- [How To ExfilMS: The Ultimate Guide](./guide/how-to-exfilms-the-ultimate-guide.md)

<!-- ## API Documentation
Please refer to our API documentation [here](https://vmalnathnambiar.github.io/exfilms/). -->

## License
Please refer to our license information [here](./LICENSE).

<!-- URLs used in the markdown document-->
[npm-image]: https://img.shields.io/npm/v/exfilms.svg
[npm-url]: https://www.npmjs.com/package/exfilms
[ci-image]: https://github.com/vmalnathnambiar/exfilms/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/vmalnathnambiar/exfilms/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/vmalnathnambiar/exfilms.svg
[codecov-url]: https://codecov.io/gh/vmalnathnambiar/exfilms
[download-image]: https://img.shields.io/npm/dm/exfilms.svg
[download-url]: https://www.npmjs.com/package/exfilms
[nodejs-url]: https://nodejs.org/en/download/