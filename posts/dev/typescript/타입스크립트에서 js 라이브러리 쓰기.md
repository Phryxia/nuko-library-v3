---
date: 2022-09-12 01:40
tags: ['javascript', 'typescript', 'js', 'ts', 'iterator', 'es6', 'generator', 'map', 'set', 'array']
---

TypeScript 초심자라면 누구나 한 번쯤 경험해봤을 문제가 바로 라이브러리의 타입이다. 이 문제를 이해하려면 JavaScript와 TypeScript의 모듈이 어떻게 작성되는지 이해해야 한다. 이에 관해 필자가 쓴 [JavaScript 번들러의 이해](https://medium.com/naver-place-dev/javascript-%EB%B2%88%EB%93%A4%EB%9F%AC%EC%9D%98-%EC%9D%B4%ED%95%B4-1-javascript-%EB%AA%A8%EB%93%88-d68c7e438fcd) 시리즈를 참고하면 좋다.

# .d.ts

타입스크립트에서 js 라이브러리를 사용하려면 해당 모듈에서 export하는 것들에 대해 타입이 정의돼 있어야 한다. 가령 `foo`라는 함수의 시그니쳐는 어떤 지, `bar`라는 변수의 타입은 무엇인지 등.

`.d.ts` 파일은 이것을 기술하는 타입 선언 파일이다.

예를 들어 `loadash`라는 라이브러리를 살펴보자. `loadash`는 각종 js 편의 기능을 제공하는 고전적인 라이브러리로, 아직까지도 널리 쓰이는 편이다. 이걸 타입스크립트에서 사용하려고 `import`를 하면 다음과 같은 에러 또는 경고가 발생한다.

```
Could not find a declaration file for module 'lodash'. 'c:/devenv/projects/ts-without-babel/node_modules/lodash/lodash.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/lodash` if it exists or add a new declaration (.d.ts) file containing `declare module 'lodash';`ts(7016)
```

`loadash`는 TypeScript가 없던 시절에 개발된 모듈이다. 때문에 배포판에는 타입 선언 파일이 없다. 이 경우 TypeScript 컴파일러는 모듈이 무언가를 export하는 것을 **암묵적인 any를 사용한 것으로 간주**한다.

## 방법 1. `noImplicitAny`를 `false`로 설정

암묵적인 `any` 사용을 허용하지 않았기 때문에 이런 문제가 발생했으므로 컴파일러 옵션에 암묵적인 `any` 사용을 허용하게 만들면 문제가 해결된다.

```json
{
    "compilerOptions": {
        // ...
        "noImplicitAny": false
    }
}
```

하지만 고작 레거시 라이브러리 몇 개 때문에, 개발 전체 안정성을 떨어트리는 것은 좋은 선택지가 아니다.

## 방법 2. 누군가가 만들어놓은 타입선언을 다운받는다.

`loadash`처럼 많은 사람들이 쓰는 라이브러리는, 추후에 제작자 또는 다른 사람들이 타입 선언 파일만 따로 배포하기도 한다. 이것들은 `@types/library-name` 규칙으로 `npm` 레지스트리에 등록돼 있다.

TypeScript 홈페이지에는 특정 라이브러리의 타입 선언이 공유되고 있는지 [검색하는 페이지](https://www.typescriptlang.org/dt/search?search=loadash)가 있다. 여기서 내가 쓰고 싶은 라이브러리의 이름을 검색해본 뒤, 있으면 그 모듈을 설치하면 된다.

```
npm i @types/lodash
```

명령어를 실행시키고 `node_modules` 디렉토리를 열어보면, `@types` 폴더 밑에 `lodash`라는 폴더가 생긴 것을 확인할 수 있다.  그 안에 들어가보면, 각종 타입 선언 파일이 가득한 것을 볼 수 있다.

## 방법 3. 직접 .d.ts 파일을 선언해준다.

만약 타입 선언이 제공되지 않는다면? 직접 타입 선언 파일을 만들면 된다. 하지만 내가 제작자도 아니고, 기여자도 아닌데다 그런 파일을 만들 시간이 없다면? 최소한 그런 모듈이 있다는 것을 선언해주면 된다.

프로젝트 루트 디렉토리에 적당히 `alltypes.d.ts`파일을 만들고 아래와 같이 적어준다.

```typescript
declare module 'loadash'
```

그런 뒤 `tsconfig.json`에 다음을 추가한다.

```json
{
    // ...
    "include": ["alltypes.d.ts"]
}
```

위치가 꼭 루트일 필요는 없으며, 파일 이름도 `tsconfig.json`에 적어주기만 하면 뭘 쓰든 상관없다.

VSCode 사용 시, 적당히 아무 `.ts` 파일을 열고, <kbd>ctrl</kbd>+<kbd>p</kbd>를 누른 뒤, `>TypeScript: Restart TS server` 명령을 실행하여 랭귀지 서버를 재부팅하자. 프로젝트의 규모가 작은 경우, 재부팅 없이 바로 적용되기도 한다.

`declare module` 문법은 `tsc`에게 그런 모듈이 있다는 것을 알려준다. 하지만 함수의 시그니쳐 등을 설정하지 않았기 때문에 모든 것이 `any` 타입으로 다뤄질 것이다. 자신이 정말 좋다고 생각하는 라이브러리라면, 타입 선언 파일을 PR로 기여해보는 것은 어떨까?