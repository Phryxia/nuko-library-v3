---
date: 2022-09-15 18:31
tags: ['yaml', 'json']
---

**YAML(YAML Ain't Markup Language)**은 JSON이나 XML의 구차한 문법을 지양하고, 사람이 읽기 쉽게 만든 데이터 직렬화 표현 마크업 언어이다. 온갖 설정 파일에서 많이 쓰인다.

[#공식 홈페이지](https://yaml.org/)
[#Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml)

YAML 스펙은 생각보다 방대하지만, 여기서는 설정파일을 원활하게 읽고 쓰기 위해 필요한 것만 다룬다. 

또한 YAML은 공백문자(` `, `\n`)에 민감하다. (정확히는 Block Style에서 민감하다)

# 주석

```yaml
# 으로 시작하면 됨
```

# Scalar

원자적인 값. JSON과 달리 YAML은 타입 개념이 없다. YAML을 활용하는 어플리케이션마다 의미부여하는 방식이 다르다.

```yaml
some string
'quoted string'
"double quoted string, can use escape like \n"
```

# Block Style과 Flow Style

YAML은 동일한 데이터를 두 가지 방법으로 표현할 수 있다. 하나는 공백문자(` `, `\n`)와 `-`를 사용하여 의미를 구분하는 Block Style이고, 다른 하나는 구분자(`{`, `}`, `[`, `]`, `,`)를 사용하여 구분하는 Flow Style이다. Flow Style은 JSON과 거의 유사하다고 생각하면 된다.

Flow Style에서는 공백이나 개행이 별 의미가 없으나, **Block Style에서는 의미를 가지므로** 섞어 쓸 경우 정신 잘 차려야 한다. Block Style에서 주의할 점으로, `-` 문자도 공백(` `)처럼 인덴트로 간주한다.

## Sequence 

뭔가를 나열한 것

### Block Sequence

Comact하게 중첩을 줄 안 띄우고 하는 방법도 있긴 한데, 정식 문법을 정확히 숙지하고 있는게 아니면 대단히 헷갈리기 때문에, 여기서는 다루지 않는다.

```yaml
- a
- b
- # null
-
  - e
  - f
```

### Flow Sequence

```yaml
[a, b, null, [e, f]]
```

## Mappings

JSON의 Object에 해당하는 것. key-value 쌍들을 모은 것. 주의할 점으로 인덴트가 들어가면 별개 노드로 취급한다.

### Block Mappings

```yaml
key1: value1
key2: value2
nested:
  key3: value3
  key4: value4
key5: # null
```

### Flow Mappings

```yaml
{
  key1: value1,
  key2: value2,
  nested: {
    key3: value3,
    key4: value4
  },
  key5: null
}
```

## Block Style과 Flow Style의 혼용

Block Style 안에서는 Flow Style을 써도 문제가 없는데, Flow Style 안에서는 Block Style이 거의 안된다. (매우 부분적으로만 가능) 설사 된다고 하더라도 안하는게 좋은데, 파서 구현에 따라 버그나기 딱 좋고 가독성도 떨어지기 때문이다.