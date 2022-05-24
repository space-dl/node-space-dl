<div align="center">
    <img src="img/logo.png">
    <h1>space-dl</h1>
    <p>Twitterスペースを録音するコマンドラインツール</p>
</div>

[English](README.md)/[日本語](README_ja.md)

## 必要な環境

[Node.js](https://nodejs.org/) [ffmpeg](https://ffmpeg.org/)

## インストール

```bash
$ npm i -g space-dl
```

## 使い方

### スペースのURLのでダウンロード
```bash
$ space-dl <スペースのURLまたはスペースのID>
```
or
```bash
$ space-dl -i <スペースのURLまたはスペースのID>
```

### プロフィールのURLまたはスクリーンネームからダウンロード

```bash
$ space-dl -u <プロフィールのURLまたはスクリーンネーム>
```

この機能を利用するにはspace-dlにTwitter API v2トークンを設定する必要があります。

次のコマンドを実行してspace-dlにTwitter API v2トークンを設定してください。

```bash
$ space-dl token <Twitter API v2トークン>
```

## 製作者

[tsubasa652](https://github.com/tsubasa652)

## ライセンス

このソフトウェアはGNU General Public License v3.0でライセンスされています。詳しくは[LICENSE](LICENSE)を参照してください。
