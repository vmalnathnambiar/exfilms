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
$ exfilms --help
```
<br> **`--version`**

Display the version of ExfilMS.

```md
$ exfilms --version
```

<br> **`--interactive`**

Run ExfilMS in interactive mode. In this mode, you will be prompted for input allowing for more control over what data gets sent or how it gets there.

```md
$ exfilms --interactive
```

<!-- <br> **`-i`, `--inputDir`** -->


<!-- URLs used in the markdown document-->
[nodejs-url]: https://nodejs.org/en/download/