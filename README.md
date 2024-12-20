## 写経
(Express認証付きスターターセット: Docker×Prisma×JWTで始めるバックエンド構築)[https://zenn.dev/miumi/articles/812c7038e92b8f]

<br/>
<br/>

## 成果物
- なし

<br/>
<br/>


## 技術スタック
- Prisma 関連
  - @prisma/client: 6.1.0
  - prisma: 6.1.0
- 認証（bcrypt, jsonwebtoken）関連
  - bcrypt: 5.1.1
  - @types/bcrypt: 5.0.2
  - jsonwebtoken: 9.0.2
  - @types/jsonwebtoken: 9.0.7
- Express 関連
  - express: 4.21.2
  - @types/express: 5.0.0
- Node.js と環境設定関連
  - @types/node: 22.10.2
  - dotenv: 16.4.7
  - nodemon: 3.1.9
- TypeScript 関連
  - typescript: 5.7.2
  - ts-node: 10.9.2

<br/>
<br/>

## 実行したコマンド（順不同）
- npm install express typescript ts-node @types/express dotenv @types/node
- npx tsc --init
- docker-compose up -d
- npm install prisma @prisma/client
- npx prisma migrate dev --name init
- npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken

<br/>
<br/>

## 学べる点
- 認証周り（bcrypt, JWT）
- TypeScript, Expressの簡易的なAPI実装
- Prismaによる簡易的なCRUD処理実装

<br/>
<br/>

## 使用した外部サービス
- なし

<br/>
<br/>

## 他
- 良記事
