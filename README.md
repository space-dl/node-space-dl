<div align="center">
    <img src="img/logo.png">
    <h1>space-dl</h1>
    <p>Command line tool for recording Twitter space</p>
</div>

![space-dl-demo](https://user-images.githubusercontent.com/34929737/169988909-ead9c636-e1f4-42a3-b085-6c61f016bbde.gif)

[English](README.md)/[日本語](README_ja.md)

## Requirement

[Node.js](https://nodejs.org/) [ffmpeg](https://ffmpeg.org/)

## Install

```bash
$ npm i -g space-dl
```

## Usage

### For Twitter Space URL
```bash
$ space-dl <Twitter Space URL or Space ID>
```
or
```bash
$ space-dl -i <Twitter Space URL or Space ID>
```

### For ScreenName or Twitter account URL

```bash
$ space-dl -u <Twitter account URL or ScreenName>
```

To use this feature, you need to set the Twitter API v2 token.

Run the command below to set the Twitter API v2 token

```bash
$ space-dl token <Twitter API v2 Token>
```

## Author

[tsubasa652](https://github.com/tsubasa652)

## LICENSE

This software is released under the GNU General Public License v3.0 License, see [LICENSE](LICENSE).

