---
date: 2022-05-11 00:38
tags: ['javascript', 'typescript', 'js', 'ts', 'iterator', 'es6', 'generator', 'map', 'set', 'array']
---

최근 함수형 프로그래밍 강의를 들으면서 반복자(Iterator)를 알게 되었고, 그걸 어떻게 써먹을 수 있을까 다양하게 연구를 하고 있었다. 그러던 중, JavaScript가 기본적으로 제공하는 자료형의 반복자는 원본의 변경(Mutation)에 대해 어떻게 대응하고 있는지 궁금하여 실험해보았다.

# Array

다음과 같은 간단한 실험을 해보자.

```js
function showNext(itr) {
    console.log(itr.next().value)
}

const array = [1, 2, 3, 4]
const itr = array[Symbol.iterator]()

showNext(itr)
showNext(itr)

array[2] = 5

showNext(itr)
```

결과는 다음과 같다.

```
1
2
5
```

즉, 배열의 반복자는 원본의 변화를 그대로 반영한다. 그렇다면 마지막 원소를 가리키는 상태에서 삭제를 해버리면 어떻게 될까?

```js
function showNext(itr) {
    console.log(itr.next().value)
}

const array = [1, 2, 3, 4]
const itr = array[Symbol.iterator]()

showNext(itr)
showNext(itr)
showNext(itr)

array.pop()

showNext(itr)
```

결과는 다음과 같다.

```
1
2
3
undefined
```

이런 성질 때문에 반복자를 활용하는 **for-of 문에서 배열을 함부로 변경하는 일은 매우 위험**하다는 것을 알 수 있다. 아래의 코드를 실행하면 무한루프가 발생한다.

```js
const array = [1]

for (const element of array) {
    console.log(element)
    array.push(element + 1)
}
```

## ECMA2015 표준 스펙에서의 정의

ECMA-262 12th edition의 664페이지에 따르면, 배열 반복자는 내부적으로 인덱스를 정의하고 증가하면서 진행한다. 즉, 배열의 변경에 대해서는 어떠한 언급도 없으며 원본 배열의 값을 그대로 참조하도록 정의돼 있기 때문에, 위 실험과 같은 결과가 나온 것이다.

```
a. Let index be 0.
b. Repeat
  ...
  iii. If index ≥ len, return undefined
  iv.  If kind is key, perform ? Yield(F(index))
  ...
  vi.  Set index to index + 1
```

# Map, Set

글을 짧게 하기 위해서 결론만 말하면, 배열과 다를 바 없이 원본의 변화에 영향을 받는다. 위에서 했던 실험을 배열 대신 `Map`이나 `Set`을 넣어서 하면 된다.

## ECMA2015 표준 스펙에서의 정의

표준서 695페이지를 보면 `Map` 반복자의 행동을 알 수가 있는데, 내부적으로는 `[[MapData]]`라는 리스트를 바라보는 인덱스를 진행시키는 식으로 돼 있다. `[[MapData]]`는 `Map`에 넣은 key-value 쌍들이 넣은 순서대로 들어가 있는 리스트다. 

`Map`에 새 값을 집어넣으면 이 배열 끝에 값이 들어가게 되고, `Map`에 값을 지우면 이 리스트에서 해당 항목이 `empty`라는 값으로 채워진다. 반복자는 그저 이 리스트를 순회하는 것에 불과하므로, 원본의 변화를 그대로 따라가게 된다.

`Set`도 크게 다르지 않다.

# 결론

1. 반복자가 일반적으로 어떤 식으로 자료를 순회해야 하는지에 대해서는 표준에 **언급이 없다**.
2. 기본 제공하는 반복자들은 **원본의 변경(Mutation)에 영향**을 받는다.
3. 반복자 사용 시 원본의 변화에 주의해야 한다.
4. 반복자 사용 시 비동기 작업같은 동시성을 고려해야 한다.