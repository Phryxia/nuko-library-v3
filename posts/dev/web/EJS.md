---
date: 2021-04-01 00:00
tags: ['ejs', 'node.js', 'template', 'ssr', 'ssg']
---

# Embeded JavaScript(EJS)

**EJS**는 순수 JavaScript를 활용한 SSR 템플릿 스크립트이다. 백엔드에서 `node.js`를 사용할 경우 js를 사용한다는 점에서 궁합이 좋다. 배우기 쉽고 간단하다는 장점이 있다.

# 맛보기

터미널을 열고 아래 명령어를 실행하여 `ejs`를 설치한다.

```
npm i ejs
```

설치가 끝나면 먼저 템플릿을 작성한 뒤 `template.ejs`라고 저장하자.

```ejs
<!DOCTYPE html>
<html>
    <head>
        <title><%= title %></title>
    </head>
    <body>
        <!-- 제목 -->
        <h1><%= title %></h1>

        <!-- 이름들 -->
        <% list.forEach(entry => { %>
        <div><%= entry %></div>
        <% }) %>
    </body>
</html>
```

그 후 `node.js`를 위한 스크립트를 작성한다. 이 예제는 템플릿을 사용하여 웹페이지 사전 렌더링을 한다.

```javascript
const fs = require('fs')
const ejs = require('ejs')

// 템플릿에 밀어넣을 데이터 준비
const data = {
  title: 'Hello World',
  list: ['민수', '철수', '영희', '지수'],
}

// 템플릿 파일을 열어서 HTML 파일로 저장한다.
ejs.renderFile('template.ejs', data, (ejserror, html) => {
  // 에러 체크
  if (ejserror) {
    console.log(ejserror)
    return
  }

  // HTML 파일로 저장
  fs.writeFile('output.html', html, (fserror) => {
    if (fserror) console.log(fserror)
  })
})
```

SSR로 제공하고 싶으면 `express.js`같은 걸 써서 동적으로 요청에 응답하면 된다. 용도에 따라 유연하게 쓸 수 있는 것이 `ejs`의 장점이다. 아래와 같이 다양한 함수로 HTML을 템플릿으로부터 뽑아낼 수 있다.

```javascript
const template = ejs.compile('<%= name %>')
template({ name: '누꼬' }) // HTML 문자열 반환

ejs.render('<%s= name %>', { name: '누꼬' }) // HTML 문자열 반환

ejs.renderFile('template.ejs', { name: '누꼬' }, (err, html) => {
  // HTML 문자열을 콜백으로 전달
})
```

쉽고 편리하다! EJS에 관심이 생겼다면 [공식 홈페이지](https://ejs.co/)에서 배워보도록 하자.

# 한계

ejs의 장점은 가볍고 미니멀하다는 점이지만, 이는 다르게 말하면 사이트 개발에 필요한 편의기능은 없다는 것과도 같다.

ejs는 템플릿을 html로 바꿔주는 기능을 가지고 있으니, 서버를 잘 짜면 SSR 뿐만 아니라 SSG도 실현할 수가 있다. 하지만 SSG를 지원하는 다른 프레임워크에 비하면 생산성이 떨어지는게 현실이다. 복잡한 사이트를 개발할 때에는 [Next.js](https://nextjs.org/)나 [gatsby](https://www.gatsbyjs.com/) 같은 프레임워크를 쓰는게 정신건강에 이롭다.
