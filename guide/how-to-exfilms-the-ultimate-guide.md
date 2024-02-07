# How to ExfilMS: The Ultimate Guide

> Note: If you are reading this guide, it is assumed that you have the `exfilms` command-line application already installed on your machine. If you do not have it installed, please refer to the installation guide [here](../README.md#installation).

`exfilms` is a cross-platform, command line application that allows you to easily extract MS data from mzML files into JSON formatted output files, with spectrum filtering capability. This guide will help you understand the accepted input parameters that can be configured and how to use it for the extraction/filtering of MS data to suit your analytical needs.

There are two primary ways to use `exfilms`: 
1. [Command line input flags](#command-line-input)
2. [Interactive mode](#interactive-mode)

<br>

Let's begin!

## Command Line Input

## Interactive Mode

Extending the command line input, you can easily initiate `exfilms` in an interactive mode. This mode will trigger different input prompts that will guide you through the parameter configuration process. 

To use `exfilms` in interactive mode, simply run `exfilms` with the `--interactive` flag in your terminal:

```md
# To use interactive mode
$ exfilms --interactive
```

[nodejs-url]: https://nodejs.org/en/download/