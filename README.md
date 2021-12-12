<div align="center">
    <h1>space-dl</h1>
    <p>Command line tool for recording Twitter space</p>
</div>

## Requirement

ffmpeg

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