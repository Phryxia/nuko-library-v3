# Nuko-Library-v3

누코 라이브러리는 마크다운 기반의 커스텀 정적 블로그입니다.

아직 안정화가 안됐습니다.

## Technology

- SSG using Next.js
- React
- TypeScript
- markdown-it
- highlight.js

# Install

```
npm install
npm run dev
```

# Publish

`posts` 폴더에 들어가서 마크다운 파일이나 폴더를 자유롭게 추가하면 됩니다.

## YAML Front Matter

마크다운 앞에 다음과 같은 형식으로 메타 데이터를 붙일 수 있습니다.

```markdown
---
date: 2021-06-23
---
```

# History

누코 라이브러리 초기버전은 React 연습용으로 만들었는데, node.js를 결합해서 썼습니다. CSR만 지원하는 SPA라서 검색엔진최적화가 안됐습니다.

두 번째 버전은 SEO를 지원하기 위해 바닐라 js와 node.js, ejs를 사용하였습니다. 그러나 아무래도 리액트를 쓰는 것만큼 유연하지는 못했습니다.

세 번째 버전인 저장소는 Next.js를 학습하고 나서 적용한 것입니다.
