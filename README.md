# mcp-sample

MCPサーバー自作演習用リポジトリ。Zenn記事「未経験エンジニアがMCPサーバーを自作してClaude Desktopに繋いでみた」のサンプルコードです。

## 構成

```
mcp-sample/
├── api/              # ダミーREST API (Express, JavaScript, ポート3000)
│   ├── package.json
│   └── server.js
└── mcp-server/       # MCPサーバー (@modelcontextprotocol/sdk, TypeScript)
    ├── package.json
    ├── tsconfig.json
    └── index.ts
```

### なぜ言語が非対称(api=JS / mcp-server=TS)なのか

`mcp-server` 側だけ TypeScript にしているのは、公式SDK が TS製で **ツール定義の型補完が学習教材として強力**だから。一方 `api` は「**既存システムの代役**」という位置づけで、現実には Python でも Go でも何でもよいことを示すために素のJSのまま残しています。

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
npm start
```

`http://localhost:3000/books` にアクセスできることを確認します。

### 3. Claude Desktop の設定

`claude_desktop_config.json` に以下を追加します（パスは自分の環境に合わせて変更）。

`mcp-server` は TypeScript なので、`tsx` で直接実行します(ビルド不要)。

```json
{
  "mcpServers": {
    "books-api": {
      "command": "npx",
      "args": [
        "--yes",
        "tsx",
        "C:/絶対パス/mcp-sample/mcp-server/index.ts"
      ]
    }
  }
}
```

Claude Desktop の `Settings → Developer → Edit Config` から開くのが確実です。

### 4. Claude Desktop を完全終了して再起動

タスクトレイ/メニューバーから Quit してから起動し直します。

## 動作確認

Claude Desktop に話しかけてみてください:

- 「登録されている書籍を一覧表示してください」 → `list_books` が呼ばれます
- 「『プログラマーが知るべき97のこと』を著者なしで追加してください」 → `add_book` が呼ばれます
