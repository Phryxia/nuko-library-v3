---
date: 2021-07-26 00:02
tags: ['webpack', 'typescript', 'react', 'babel', 'ts-loader']
---

# 서론

웹 프론트엔드에 입문하여 기초적인 기술(ex: `HTML`, `CSS`, `JavaScript`)을 익혔다면, 슬슬 `React`나 `TypeScript`같은 모던 웹 기술에 관심을 가지게 될 것이다. 그런데 처음에 이걸 시작하려면 정말 난감한게, 너무 많은 기술이 한꺼번에 등장하기 때문이다.

기본을 끝내서 더 나아가고는 싶고, 뭔가 다들 `React` 같은 걸 공부하라고 하는데, 공식 문서만 봐서는 정보가 미묘하게 부족하고, 결국 맨날 `create-react-app`만 쓰는 자신을 발견하게 되었다면? 환영한다.

이 글은 2021년 초심자가 모던 웹 생태계에 입문을 위한 방향을 제공하고 싶어서 쓰였다. 여기에는 '일단 뭔가가 돌아가게' 하는 방법과, 그것에 대한 간단한 이유를 적어두었다. 어차피 심도깊은 공부를 하려면 각 기술의 공식문서를 읽어야 하기에, 여기서는 다루지 않는다.

# TypeScript

TypeScript는 JavaScript에 정적 타입 개념을 추가한 언어이다. TypeScript로 작성된 코드는 일반적으로 JavaScript로 변환(Transpile)해서 브라우저나 `node.js` 같은 런타임에서 실행한다. (트랜스파일 없이 바로 런타임으로 돌리는 `ts-node`라는 물건도 존재한다) 대충 이렇게 생겼다.

```typescript
// 변수에 타입 주기
const myName: string = 'babo'

// 함수 파라미터와 반환 타입 주기
function sum(numberList: number[]): number {
    return numberList.reduce((acc, num) => acc + num, 0)
}

// 편리한 enum
enum Fruite {
    APPLE = 'apple',
    ORANGE = 'orrange',
    BANANA = 'banana',
}

// 타입 합성하기
type GeneralMessage = TextMessage | ImageMessage | VideoMessage

// 제네릭
function comparator<S extends Student>(studentA: S, studentB: S): number {
    return stduentA.grade - stduentB.grade
}
```

2021년 기준으로 수많은 개발자들이 타입스크립트를 쓴다. 타입스크립트는 이제 **선택이 아닌 필수**가 되었다. 타입스크립트의 장점은 구글에 치면 정말 잘 나오니까 여기서는 언급하지 않는다. 현실적으로도 타입스크립트를 요구하는 기업이 많기 때문에, 웹 개발자로 먹고 살고 싶다면 꼭 배워야 한다.

TypeScript는 JavaScript의 슈퍼셋이기 때문에, 웹 개발을 공부해왔다면 입문은 그렇게 어렵지 않다. VSCode를 깔고 TypeScript 플러그인을 설치한 뒤 지금까지 해왔던 것처럼 쓰다보면, 새로운 개념들을 알게 되고 금방 적응할 수 있다. TypeScript에 있는 강력한 기능과 난해한 것들을 언젠가는 알아야하지만, 적어도 지금 당장은 아니니까 겁먹지 말자.

## 시작은 미니멀하게

처음부터 웹팩이니 바벨이니 들이밀면 당황스럽다. 그러니 먼저 아주 최소한의 사양으로 프로젝트를 구성해보자.

먼저 `Node.js`를 [설치](https://nodejs.dev/download)한다.

