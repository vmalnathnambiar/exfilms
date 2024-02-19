# How to ExfilMS: The Ultimate Guide

> *Note: If you are reading this guide, it is assumed that you have ExfilMS already installed and is available on your machine. If it is not installed, please refer to the installation guide [here](../README.md#installation).*

ExfilMS is a cross-platform, command line application that allows you to easily extract MS data from mzML formatted files into JSON, with spectrum filtering capabilities. This guide will help you understand how to use ExfilMS to its full potential. 

Once ExfilMS has been installed on your local machine, the ExfilMS process can be initiated through the execution of simple, easy-to-use command line prompts upon installation.

Let's begin!

## Command Line Flags

ExfilMS can easily be executed upon installation with the command `exfilms`. However, running this command on its own will result in an error, as seen below. The `--inputDir` or `-i` (to be discussed later) displayed in the error message is referred to as a command line flag that is required for the successful execution of the `exfilms` command.

![launch-error](../img/err/launch.png)

ExfilMS comes with a few command line flags (both mandatory and non-mandatory) that can be executed along with the `exfilms` command to establish the behaviour of the application and configure the parameters to be used for the extraction/filtration of MS data. 

Now, let's go through the flags available to be used with exfilMS. 

<br> **`--help`**

Displays a help message listing all available flags and their functions.

```md
# Show help
$ exfilms --help
```
<br> **`--version`**

Display the version of ExfilMS.

```md
# Show version number
$ exfilms --version
```

<br> **`--interactive`**

Run ExfilMS in interactive mode. In this mode, you will be prompted for input allowing for more control over what data gets sent or how it gets there.

```md
# Run interactive mode
$ exfilms --interactive
```

<br> **`-i`, `--inputDir`**

*_*Required_*

Specify the input directory where mzML data files will be read from for the ExfilMS operation. This flag must always be provided when using `exfilms`. If no value is specified, an error message will be prompted.

```md
# Specify input directory containing mzML data files
$ exfilms -i (or --inputDir) "/path/to/input/directory/"
```

<br> By default, once the input directory has been specified - all files ("*") within the input directory will be read for the ExfilMS operation. However, users can specify a specific list of files to exfiltrate from by including a secondary command line flag `--fileList` a space-separated list of file names.

```md
# Default: All files in input directory
$ exfilms -i (or --inputDir) "/path/to/input/directory/" --fileList "*"

# List specific file(s) in input directory
$ exfilms -i (or --inputDir) "/path/to/input/directory/" --fileList "file1.mzML" "file2.mzML" "file3.mzML"
```

<!-- URLs used in the markdown document-->
[nodejs-url]: https://nodejs.org/en/download/