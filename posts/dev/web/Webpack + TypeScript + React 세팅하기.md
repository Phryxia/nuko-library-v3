---
date: 2021-07-26 13:52
tags: ['webpack', 'react', 'typescript', 'frontend', 'setting']
---

# 서론

프론트엔드 개발에서 제일 재미없는 일은 아마도 프로젝트 초기 세팅인 것 같다. 극도로 고도화된 생태계는 굉장히 많은 도구를 사용하게 진화해왔다.

2021년 기준으로 `TyeScript`와 `React`는 지배적인 기술이 되었고, 많은 초심자들이 이걸 배우기 위해 고분군투하곤 한다. 문제는, 이게 정보가 굉장히 파편화 돼 있다는 점이다.

사실 `React` 제작진도 이걸 인지하고 있기 때문에, `create-react-app`이라는 걸 만들어서 쉽게 기반 코드를 만들어낼 수 있게 했다. `TypeScript`가 보편화된 지금은 아예 프리셋을 제공해서, 인자 하나만 더 주면 알아서 완성이 된다.

그럼에도 불구하고 면접에서 CRA 안쓰고 프로젝트 세팅해봤는지 물어보거나, 과제에서 CRA 사용을 금지하는 이유는 무엇일까. 회사에서 안쓰는 것도 아닌데.

이유는 간단하다. 그것만 알고 내부 생태계를 이해하지 못하면, 프로젝트에 새 기술을 도입하거나 무언가를 수정해야할 때 애를 먹으며, 먼 훗날 신규 프로젝트를 할 때 큰 걸림돌이 되기 때문이다. (특히 IE 대응같은 크로스 브라우징이 필요한 경우, 이에 대한 이해가 필요하다)

이 글은 CRA 같은 간편 보일러플레이트만 쓰다가, 직접 도구의 도움 없이 프로젝트 설정을 해보고 싶은 사람들을 위해서 쓰여졌다. 2021년 7월 기준으로 다음과 같은 기술을 사용한다.

- Webpack 5
- TypeScript 4.3
- Babel 7
- React 17

# Webpack

**Webpack**은 웹 개발을 위한 번들러 도구다.

조금만 사이트 규모가 커져도 `js` 파일의 수는 급속도로 늘어난다. ES6가 도입되기 전에는 이걸 하나하나 수작업으로 HTML에 불러와야 했다. C언어 마냥 불러오는 순서에 굉장히 민감했고, 서버에 보내는 HTTP 요청도 부담되었다.

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="./model.js"></script>
<script src="./service.js"></script>
<script src="./index.js"></script>
```

번들링은 이것들을 하나의 `js` 파일로 묶어주는 것이다. 번들링 도구들은 Webpack 말고도 몇 개가 더 있는데 그 중 Webpack이 가장 성공적으로 진화하였다. Webpack은 단순히 `js` 번들링만 지원하는 것에서 끝나지 않고, 각종 플러그인이나 `css` 번들링 같은 기능도 지원하여 프론트엔드 생태계에 눌러 앉았다.

## 초기 설정 하기

먼저 프로젝트 폴더를 적당히 만들고, 초기화를 한다.

```
npm init
git init
```

이제 Webpack을 설치하자.

```
npm install webpack webpack-cli --save-dev
```

그런 뒤, 프로젝트 폴더 최상위에 `webpack.config.js` 파일을 다음과 같이 생성한다. 이 파일은 Webpack의 각종 설정을 관리하는 파일이다. 아주 단순한 경우에는 이 파일을 안써도 되긴 한데, 어지간한 프로젝트에서는 필요하다.

```javascript
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
}
```

## 테스트

잘 설치되었는지 확인해보자. 우선 프로젝트에 다음과 같이 2개의 JavaScript 코드를 작성한다.

```javascript
// index.js
import { foo } from './test'

console.log(foo('gfnuko'))

// test.js
export function foo(name) {
  return `${name} is awsome!`
}
```

그런 뒤 아래 명령어를 실행한다.

```
npx webpack --config webpack.config.js
```

그러면 `dist` 폴더가 생성되고, 그 안에 `bundle.js` 파일이 다음과 같이 생겼을 것이다. 이 폴더가 위의 설정파일에서 지정한 번들링 결과물의 경로이다.

```javascript
// dist/bundle.js
;(() => {
  'use strict'
  console.log('gfnuko is awsome!')
})()
```

> 참고로 사용하는 도구마다 결과물 폴더 이름과 경로가 상이하다. dist 외에도 build, public이 흔하게 쓰인다.

빌드 결과물은 특별한 이유가 없으면 소스코드에 포함시키지 않는다. 다른 컴퓨터에서 프로젝트를 받으면 새로 빌드하면 되기 때문이다. 그러니 `.gitignore` 파일을 프로젝트 폴더 최상위에 추가하고, 다음과 같이 설정한다.

```
node_modules*
dist*
```

매번 긴 명령어를 치기 귀찮으니, `package.json`에 들어가서 스크립트를 만들어주자. 이제 `npm run build`를 실행하면 된다.

```json
{
  ...
  "scripts": {
    "build": "webpack --config webpack.config.js"
  },
  ...
}

```

테스트가 끝났으니 만들었던 `js` 파일은 전부 지워주자.

# TypeScript

**TypeScript**는 JavaScript에 정적 타입 개념을 추가한 언어다. TypeScript를 한 번도 안 써 본 개발자는 있어도, 한 번만 써 본 개발자는 없을 정도로 강력하다. 왜 TypeScript를 써야하는지는 구글에 치면 나오니까, 여기서는 바로 설정으로 넘어가자.

TypeScript를 직접 돌릴 수 있는 런타임(`ts-node`나 `deno`)을 제외하면, JavaScript로 변환(Transpile)을 해야한다. 가장 기본적인 트랜스파일 방법은 `npx tsc`를 사용하는 것인데, 프로젝트가 복잡해지면 사용이 곤란하다.

Webpack에서는 특정 확장자의 파일을 만났을 때, 그 파일을 처리하는 "Loader"라는 개념이 있다. TypeScript의 경우 2가지 선택지가 있다.

- `ts-loader`를 사용하는 방법
- `babel-loader`를 사용하는 방법

몇 년 전만 하더라도 무조건 `babel-loader`를 쓰는게 정론이었는데, `ts-loader`가 ES5 트랜스파일을 지원하기 시작하면서 고민을 할 필요가 생겼다. 전자가 훨씬 가볍고 설정할 게 적기 때문이다. 참고로 `babel`은 몇 가지 사소한 [이슈](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)가 있다.

## 공통

아래의 명령어를 입력하여 TypeScript를 설치해주자.

```
npm install typescript --save-dev
```

그런 뒤, 프로젝트 최상단에 `tsconfig.json`을 생성해주자. `ts-loader`는 내부적으로 TypeScript 설치 시 제공되는 `tsc`를 사용한다. 그 트랜스파일러의 설정을 담당하는 파일이다.

```json
{
  "compilerOptions": {
    "noImplicitAny": true,
    "module": "es6",
    "jsx": "react",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

`module`은 JavaScript 결과물에서 모듈을 어떻게 처리할 지 설정하는 것이다. `es6`으로 설정하지 않으면, Webpack이 트리 쉐이킹(결과물 최적화)을 해주지 않는다.

`moduleResolution`은 특별한 이유가 없으면 `node`로 쓰면 된다. 모듈 경로를 지정하는 방식을 지정하는데, `node.js`의 방식이 사실상 표준이기 때문이다.

`allowSyntheticDefaultImports`는 모듈이 `export default`를 내보내지 않아도 Default Import가 가능하게 해주는 옵션인데, 많은 라이브러리가 이걸 켜지 않으면 빌드가 안된다.

## `ts-loader`를 사용할 경우

아래의 명령어를 입력하여 `ts-loader`를 설치한다.

```
npm install ts-loader --save-dev
```

이제 Webpack이 `ts`와 `tsx` 파일을 인식하여 `ts-loader`에 집어넣어줄 수 있도록, `webpack.config.js`에 다음의 내용을 추가하자.

외부 모듈(`node_modules`에 깔리는 것들)은 굳이 `ts-loader`를 거치지 않아도 사용할 수 있기 때문에, 빌드 성능을 위해 제외한다.

```js
const path = require('path')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
```

## `babel-loader`를 사용할 경우

아래의 명령어를 입력하여 `babel`과 `babel-loader`를 설치한다.

```
npm install babel-loader @babel/core @babel/preset-env @babel/preset-typescript
```

babel에는 프리셋이라는 개념이 있는데, 트랜스파일을 할 때 거치는 여러가지 도구를 용도에 맞게 모아놓은 것이다. `@babel/preset-env`는 브라우저 대응 등을 유연하게 할 수 있는 여러가지 설정이 포함된 프리셋이다.

`ts-loader`에서도 그랬듯, Webpack이 인식할 수 있게 `webpack.config.js`에 다음과 같이 추가한다. 이때 프리셋의 순서가 중요한데, 특이하게도 **뒤에서 부터 적용**된다.

```js
const path = require('path')

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: false,
                },
              ],
              '@babel/preset-typescript',
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
```

# React

이제 본격적으로 `React`를 설치할 차례이다. 아래 명령어를 이용하여 관련된 것들을 모두 설치하자.

```
npm install react react-dom @types/react @types/react-dom
```

`React` 자체는 JavaScript 라이브러리고, 이걸 TypeScript에서 인식할 수 있도록 타입을 추가하는 것이 `@types/react`와 `@types/react-dom`이다.

## `ts-loader`를 사용할 경우

`ts-loader`에 `tsx`를 해석하는 기능이 내장되어서, 추가적으로 설정할 것이 없다. 바로 테스트로 넘어가자.

## `babel-loader`를 사용할 경우

`tsx`를 인식할 수 있도록 프리셋을 설치하자.

```
npm install @babel/preset-react
```

`webpack.config.js`에서 설치한 프리셋을 **반드시 중간에** 삽입한다. TypeScript 프리셋은 트랜스파일 과정에서 JSX 문법(<>)을 만나면 그냥 통과시켜버리고, 그걸 React 프리셋이 마저 변환하는 구조이다.

```js
    ...
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: false,
                },
              ],
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
        exclude: /node_modules/,
      },
    ],
    ...
```

## 테스트

프로젝트 최상단에 `src` 폴더를 만든 뒤, 아래의 소스코드를 작성한다.

```typescript
// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

// App.tsx
import React, { useEffect } from 'react'

export default function App() {
  async function test() {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })

    console.log('done')
  }

  useEffect(() => {
    test()
  }, [])

  return <h1>Hello World!</h1>
}
```

그런 뒤 프로젝트 최상단에 `index.html`을 만들고 다음과 같이 작성한다.

```html
<html>
  <head>
    <title>Webpack Test</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./dist/bundle.js"></script>
  </body>
</html>
```

이제 `webpack.config.js`에 가서 엔트리를 수정하자.

```js
module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  ...
```

이제 실행할 차례다. Webpack에서는 개발용 로컬 서버를 제공한다. `pakcage.json`에 가서 다음 스크립트를 추가하자.

```json
  ...
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "start": "webpack serve"
  },
  ...
```

그런 뒤 터미널에서 다음 명령어를 입력하면 서버가 뜬다. 기본 포트는 8080이니 `http://localhost:8080`으로 접속하자.

```
npm run start
```

브라우저에 Hello World!가 뜨고, 개발자 도구(F12)를 열었을 때 1초가 지나서 'done'이 뜨면 완벽하다.

# IE 대응이 필요한 경우

ES6이 나온지가 6년이 되었으니, 현재 지원이 이루어지고 있는 브라우저들은 모두 ES6을 지원한다. 문제는 IE다.

IE 사용자를 배제하기 어려운 상황이면, 어쩔 수 없이 ES5로 트랜스파일 해야한다.

Webpack은 browserslist 형식을 지원한다. browserslist는 어떤 패키지가 어떤 브라우저나 환경에 대응하는지를 체계적으로 표시하는 설정 형식이다. browserslist를 지원하는 도구들은 동일한 형식(ex: "> 5% in US")의 문자열을 보고, 자신의 설정에 반영한다.

`package.json`에 다음 한 줄을 추가하자.

```json
"browserslist": ["IE 11"]
```

이러면 Webpack이 알아서 자신과 `ts-loader`나 `babel-loader`에게 해당 브라우저를 지원할 수 있는 설정 값을 전달한다.

## `ts-loader`인 경우

그러나 `ts-loader`가 `target`을 `es5`로 잡았다고 모든게 해결되지는 않는다. `ts-loader`는 그저 TypeScript 문법을 JavaScript로 바꿔주기만 하기 때문에, `es5`에서 존재하지 않는 객체(ex: `Promise`, `Map`)는 해결해주지 않는다.

그래서 폴리필(Polyfill)을 해줘야 한다. 먼저 폴리필 도구인 `core-js`를 설치하자.

```
npm install --save core-js@3
```

그런 뒤 TypeScript 진입점(`index.tsx`)에 가서 아래 한 줄을 추가해준다.

```javascript
import 'core-js'
```

## `babel-loader`인 경우

마찬가지로 폴리필이 필요한데, `env` 프리셋이 폴리필을 알아서 삽입해주기 때문에 방식이 조금 다르다.

먼저 `core-js`를 설치하자.

```
npm install --save core-js@3
```

그런 뒤 `webpack.config.js`에 가서 `env` 프리셋의 옵션을 다음과 같이 변경한다.

```javascript
        ...
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
        ...
```
