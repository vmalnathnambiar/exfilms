![ExfilMS](./img/logo.png)\
[![NPM version][npm-image]][npm-url]
[![license][license-image]][license-url]
[![CI status][ci-image]][ci-url]
[![test coverage][codecov-image]][codecov-url]
[![semantic release][semantic-image]][semantic-url]
[![npm download][download-image]][download-url]

## Introduction

ExfilMS is a cross-platform, command line interface (CLI) tool to extract mass spectrometry (MS) data from mzML formatted files, with filtering capabilities.

<br>

## Features

1. MS data extraction (spectrum and chromatogram)

2. Precision value rounding

3. Spectra filtering (m/z and intensity)

   - Targeted (target file, m/z tolerance and ppm tolerance)
   - Range (minimum and maximum m/z)

4. Spectrum data filtering
   - Type (profile / centroid)
   - MS level (i.e., 1, 2, ..., n)
   - Polarity (positive / negative)
   - Exclude spectra (m/z and intensity)

<br>

## Supported MS Platforms

Data extraction and spectrum filtration have been tested on data files acquired on the following MS platforms:

<table>
   <tr>
      <th>Instrument Vendor</th>
      <th>MS Platform</th>
      <th>Status / Description</th>
   </tr>
   <tr>
      <td rowspan="4">Bruker</td>
      <td>EVOQ TQ-MS</td>
      <td>Untested (Conversion not supported by ProteoWizard)</td>
   </tr>
   <tr>
      <td>ImpactII QToF-MS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>solariX MRMS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>timsTOFPro TIMS-ToF-MS</td>
      <td>Not Working (File size > 2GB)</td>
   </tr>
   <tr>
      <td rowspan="3">Waters</td>
      <td>XEVOTQXS TQ-MS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>XEVOG2XSQTOF DESI-MS</td>
      <td>Working</td>
   </tr>
      <tr>
      <td>XEVOG2XSQTOF REIMS</td>
      <td>Working</td>
   </tr>
   <tr>
      <td>SCIEX</td>
      <td>QTRAP6500+ TQ-MS</td>
      <td>Working (Untested on wiff2 scan files acquired using the new SCIEX OS acquisition software - Conversion not supported by ProteoWizard)</td>
   </tr>
</table>

<br>

## Installation

> ExfilMS has been tested on Windows, macOS and Linux.

### CLI

> [!IMPORTANT]\
> Prerequisite: [Node.js®][nodejs-url]

`$ npm i -g exfilms`

<br>

### Docker

> [!IMPORTANT]\
> Prerequisite: [Docker][docker-url]

```md
# Clone repository

$ git clone https://github.com/vmalnathnambiar/exfilms.git

# Navigate into repository

$ cd exfilms

# Build Docker image

$ docker build -t exfilms .
```

<br>

## Usage

### CLI

```md
# Using command line arguments

$ exfilms -i "/path/to/input/directory/containing/mzML/data/files/" ...

# Interactive

$ exfilms -x
```

<br>

### Docker

```md
# Using command line arguments

$ docker run --rm -it -v "/path/to/input/directory/":/inputDirectory -v "/path/to/output/directory/":/outputDirectory -v "/path/to/log/directory/":/logDirectory exfilms -i /inputDirectory -o /outputDirectory -l /logDirectory ....

# Interactive

$ docker run --rm -it -v "/path/to/input/directory/":/inputDirectory -v "/path/to/output/directory/":/outputDirectory -v "/path/to/log/directory/":/logDirectory exfilms -x
```

> [!NOTE]\
> Running ExfilMS using Docker requires the use of volume mapping in the Docker command. For example,
>
> `-v "/path/on/the/local/machine/":/tmpPath`
>
> Once the volume mapping is done, you would use /tmpPath as the input data where required, instead of the actual path on the local machine. For the successful execution of ExfilMS, you are **REQUIRED** to provide the following:
>
> - -v "/path/to/input/directory/":/inputDirectory
> - -v "/path/to/output/directory/":/outputDirectory
> - -v "/path/to/log/directory/":/logDirectory

<br>

For more guidance on how to use ExfilMS, please refer to our available guides below:

- [Data Conversion to mzML using ProteoWizard](./docs/data-conversion-to-mzml-using-proteowizard.md)
- [How to ExfilMS: The Complete Guide](./docs/how-to-exfilms-the-complete-guide.md)
- [How to Create a Target File](./docs/how-to-create-a-target-file.md)

<br>

## Limitations

> [!WARNING]
>
> 1. Unable to extract MS data from Bruker EVOQ instruments and SCIEX wiff2 scan files (unsupported format by ProteoWizard).
>
> 2. Unable to parse mzML data with a file size > 2GB.
>
> 3. Large MS data may cause Node environment to terminate abruptly due to memory limit exhaustion.
>
> 4. Slow output write speed due to build architecture difference (i.e, Intel vs AMD vs ARM) when running ExfilMS with Docker.
>
> 5. Unable to perform chromatography filtering as of now.

<br>

## Citations

If you use ExfilMS in your work, please cite it using the following:

Nambiar, V. (2024). ExfilMS. GitHub. https://github.com/vmalnathnambiar/exfilms

<br>

<!-- ## API Documentation
Please refer to our API documentation [here](https://vmalnathnambiar.github.io/exfilms/). -->

## License

Please refer to our license information [here](./LICENSE).

<!-- URLs used in the markdown document-->

[npm-image]: https://img.shields.io/npm/v/exfilms.svg
[npm-url]: https://www.npmjs.com/package/exfilms
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://github.com/vmalnathnambiar/exfilms/blob/main/LICENSE
[ci-image]: https://github.com/vmalnathnambiar/exfilms/actions/workflows/build-publish.yml/badge.svg
[ci-url]: https://github.com/vmalnathnambiar/exfilms/actions/workflows/build-publish.yml
[codecov-image]: https://codecov.io/gh/vmalnathnambiar/exfilms/graph/badge.svg?token=V8O80QXJ5S
[codecov-url]: https://codecov.io/gh/vmalnathnambiar/exfilms
[semantic-image]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release
[semantic-url]: https://github.com/semantic-release/semantic-release
[download-image]: https://img.shields.io/npm/dm/exfilms.svg
[download-url]: https://www.npmjs.com/package/exfilms
[nodejs-url]: https://nodejs.org/en/download/
[docker-url]: https://docs.docker.com/engine/install/
