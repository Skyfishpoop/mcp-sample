# mcp-sample

MCPサーバー自作演習用リポジトリ。Zenn記事「未経験エンジニアがMCPサーバーを自作してClaude Desktopに繋いでみた」のサンプルコードです。

## 構成

```
mcp-sample/
├── api/              # ダミーREST API (Express, ポート3000)
│   ├── package.json
│   └── server.js
└── mcp-server/       # MCPサーバー (@modelcontextprotocol/sdk)
    ├── package.json
    └── index.js
```

## 必要環境

- Node.js 20 以上
- Claude Desktop

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd api && npm install
cd ../mcp-server && npm install
```

社内プロキシ等で `UNABLE_TO_VERIFY_LEAF_SIGNATURE` エラーが出る場合は `NODE_OPTIONS=--use-system-ca` を付けて実行してください。

### 2. ダミーAPIサーバーを起動

別ターミナルで:

```bash
cd api
node server.js
```

`http://localhost:3000/books` にアクセスできることを確認します。

### 3. Claude Desktop の設定

`claude_desktop_config.json` に以下を追加します（パスは自分の環境に合わせて変更）。

```json
{
  "mcpServers": {
    "books-api": {
      "command": "node",
      "args": ["C:/絶対パス/mcp-sample/mcp-server/index.js"]
    }
  }
}
```

設定ファイルの場所は OS とインストール経路で異なります。Claude Desktop の `Settings → Developer → Edit Config` から開くのが確実です。

### 4. Claude Desktop を完全終了して再起動

タスクトレイ/メニューバーから Quit してから起動し直します。

## 動作確認

Claude Desktop に話しかけてみてください:

- 「登録されている書籍を一覧表示してください」 → `list_books` が呼ばれます
- 「『プログラマーが知るべき97のこと』を著者なしで追加してください」 → `add_book` が呼ばれます

## 関連記事

(記事公開後に追加予定)
