![ExfilMS](./img/logo.png)\
[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

## Introduction

ExfilMS is a cross-platform, command line interface (CLI) tool to extract MS data from mzML formatted files, with spectrum filtering capabilities.\
<br>

### Features:

- Precision value rounding
- Spectra filtering
  - Targeted m/z filtering
  - m/z range filtering
- Spectrum data filtering
  - Spectrum type (profile / centroid)
  - MS level
  - Polarity (positive / negative)
  - Exclude spectra (m/z and intensity)

<br>

## Installation

> [!IMPORTANT]\
> **Prerequisite:** [Node.js®][nodejs-url]\
> **Platform compatibility:** Windows, macOS and Linux.

`$ npm install -g exfilms`

<br>

## Usage

```md
# Run with default extraction/spectrum filtering parameters

$ exfilms -i (or -inputDirectory) "/path/to/input/directory/containing/mzML/data/files/"

# Run interactive mode

$ exfilms --interactive

# Getting help

$ exfilms --help
```

For more guidance on how to use ExfilMS, please refer to our available guides below:

- [Data Conversion to mzML](./doc/data-conversion-to-mzML.md)
- [How To ExfilMS: The Complete Guide](./doc/how-to-exfilms-the-complete-guide.md)

<br>

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
