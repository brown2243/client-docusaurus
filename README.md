# Blog with docusaurus

- Language : typescript
- IDE : vscode
- Framework : docusaurus
- deployment : vercel

`npx create-docusaurus@latest . classic --typescript`

알고리아 스크래퍼
`docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper`
