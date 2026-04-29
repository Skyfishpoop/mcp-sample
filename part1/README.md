# Part 1: 未経験エンジニアがMCPサーバーを自作してClaude Desktopに繋いでみた

連載1本目のサンプルコードです。Zenn記事「未経験エンジニアがMCPサーバーを自作してClaude Desktopに繋いでみた」に対応する成果物です。

連載トップは [リポジトリルートのREADME](../README.md) を参照してください。

## 構成

```
mcp-sample/part1/
├── api/              # ダミーREST API (Express, JavaScript, ポート3000)
│   ├── package.json
│   └── server.js
└── mcp-server/       # MCPサーバー (@modelcontextprotocol/sdk, TypeScript)
    ├── package.json
    ├── tsconfig.json
    └── index.ts
```

### なぜ言語が非対称(api=JS / mcp-server=TS)なのか

`api` は「**既存システムの代役**」という位置づけで、現実には Python でも Go でも何でもよいことを示すために素のJSのまま残しています。

一方 `mcp-server` 側だけ TypeScript にしているのは、**MCPサーバーが育っていく前提で書くなら TS の方が後で得をする**からです。サンプル規模(ツール2個・スキーマ最小)では JS + zod でも実用上は困りませんが、以下の方向に育つと差が効いてきます。

- **入力スキーマが複雑化したとき**: zod の `z.object` / `z.array` / `z.enum` などをネストすると、ハンドラ引数の型が深くなる。TSならエディタが各プロパティの型と `undefined` の可能性を即座に教えてくれる。JSだと毎回スキーマ定義まで遡って確認することになる。
- **ツール数が増えたとき**: `Book` のような共通型に項目を足すと、未対応のハンドラがコンパイル時に一覧でエラー表示される。JSだと grep + 目視で漏れが起きやすい。
- **SDKをバージョンアップするとき**: `@modelcontextprotocol/sdk` はまだ仕様変更が入る段階。`registerTool` のシグネチャが変わるような破壊的変更を、実行前に型エラーとして検出できる。
- **時間が経って読み返すとき**: ハンドラ引数にホバーするだけで型が分かるので、スキーマ定義まで遡る必要がない。型がそのままドキュメントになる。

なお、ランタイムの入力検証は zod が JS/TS どちらでも担ってくれるので、**TSが効くのは「コードを書いている瞬間」と「変更を加える瞬間」の編集コスト・事故率**であり、実行時の安全性ではありません。

公式SDKは TS で書かれていますが、npmへは `.js` + `.d.ts`(型定義) として配布されています。`.d.ts` のおかげで、利用側がTSの場合は `registerTool` の入力スキーマからハンドラ引数の型が自動推論される、という恩恵を受けられます。

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
        "C:/絶対パス/mcp-sample/part1/mcp-server/index.ts"
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
