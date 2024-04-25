---
slug: browser-clipboard
title: 브라우저와 클립보드

authors: [brown]
tags: [browser, clipboard, img, canvas]
Date: 2024-04-24 16:00
---

# 브라우저와 클립보드

<br />

특정 버튼이나 텍스트를 클릭 시, 관련 텍스트를 clipboard에 복사해주는 기능을 제공하는 사이트들이 있다.

본인도 첫 회사에 입사 한지 얼마 안된 시점에서 뿜뿜(기능의 이름)이라는 비슷한 기능 구현을 요청 받았었는데

1. 특정 버튼 클릭
2. 수익률 관련 모달 팝업
3. 팝업에 복사 버튼 클릭시 이미지를 클립보드에 복사

이런 동작을 요구 했었다.

관련해서 전반적인 내용을 학습해보자.

<!-- truncate -->

## 클립보드란?

[클립보드(clipboard, ‘종이 끼우개’라는 뜻)는 잘라내서 붙여넣는 과정을 통해 문서나 응용 프로그램 사이에 자료가 전송될 때 짧은 시간 동안 해당 자료를 저장하는 데에 사용되는 소프트웨어 프로그램이다. 보통 그래픽 사용자 인터페이스 환경의 일부이며 환경 안에 있는 대부분의 프로그램으로부터 접근할 수 있는 임시 메모리 블록과 동의어이다.](https://ko.wikipedia.org/wiki/%ED%81%B4%EB%A6%BD%EB%B3%B4%EB%93%9C)

일반적으로 **클립보드는 OS에서 제공하는 일시적으로 텍스트, 파일, 이미지 등 다양한 종류의 데이터를 저장하는 메모리 영역**으로

잘라내기, 복사, 붙여넣기 작업을 수행할 때 사용된다.

## 클립보드에 데이터를 넣는 방법

잘라내기(cut) 또는 복사하기(copy) 작업을 수행하면, 선택한 데이터가 클립보드에 저장된다.

- copy: 선택한 데이터를 메모리에 복사
- cut: 선택한 데이터를 메모리에 복사 후, 원본 삭제

**클립보드는 운영 체제의 메모리 관리 기능(가상 메모리)을 활용하여 데이터를 저장**하므로, RAM보다 큰 용량의 데이터도 처리할 수 있다.

## browser 환경에서는?

브라우저는 사용자가 실행하는 응용프로그램이고, 우리가 작성한 자바스크립트는 브라우저 위에서 동작한다.

그러므로 브라우저에서 사용자의 컴퓨터 클립보드에 데이터를 저장하는 기능이 없다면, 저장할 수 없다.

가능하다면 이는 해킹의 영역이다.

그래서 관련된 기능을 web api로 제공하는데...

### document.execCommand

첫번째는 `Deprecated`된 [document.execCommand api](https://developer.mozilla.org/ko/docs/Web/API/Document/execCommand)다.

아래의 `clipboard api`가 나오기 전까지는 클립보드에 데이터를 저장할 수 있는 유일한 방법이었고, 현재도 많이 사용되는 방법이다.

아직도 많이 사용되는 [clipboard.js](https://www.npmjs.com/package/clipboard)도 내부적으로 `execCommand api`을 사용한다.

해당 api를 사용하는 방식을 보자.

1. 카피를 원하는 txt를 보이지 않는 input, textarea tag를 생성 후, value에 넣어준다.
2. 위에서 생성 된 태그에 select method를 실행한다(텍스트 선택).
3. `document.execCommand("copy")`을 실행한다.
4. 생성 된 태그를 삭제한다.

```javascript
const tag = document.querySelector("h1");
if (tag) {
  tag.onclick = () => {
    const tmp = document.createElement("textarea");
    tmp.value = tag.textContent;
    document.body.appendChild(tmp);

    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
  };
}
```

위 코드를 아무 페이지나 들어가서 tag 잡을 수 있게 처리 후, console에서 실행하면 해당 태그 클릭시 텍스트가 복사 될 것이다.

참고로 웹 페이지에서 js로 `document.execCommand("copy")`를 실행하려면 사용자의 액션이 동반되어야 `execCommand api`가 동작한다.

애초에 사용자에게 권한을 허용받지 않고 클립보드에 데이터를 저장할 수 있는게 문제가 될 수 있는데,

액션조차 없이 js로 저장할 수 있다는 건, 보안상 문제 가능성이 있기 때문에 최소한의 제약을 설정한 것으로 보인다.

### clipboard api

브라우저에서 클립보드 관련 기능을 담당할 웹 표준 [clipboard api](https://developer.mozilla.org/ko/docs/Web/API/Clipboard_API)이다.

차이점은 다음과 같다.

1. 해당 api는 먼저 사용자에게 clipboard 권한에 대한 요청을 한다
2. text외의 정보도 저장할 수 있다.
3. read도 가능하다.

## 뿜뿜

다시 뿜뿜으로 돌아가자.

일단 뿜뿜은 수익률 모달을 뛰우고, 저장 버튼 클릭시, 사용자의 클립보드에 이미지가 저장되어야 했다.

### 태그를 이미지화 하려면?

브라우저 환경에서 js는 파일류의 데이터를 처리할 때 `blob`(Binary Large Object)이라는 객체를 사용한다.

web api로 제공되며 이미지, 오디오, 비디오와 같은 멀티미디어 데이터를 포함하여 큰 용량의 이진 데이터를 다루기 위해 사용된다.

그러니 태그를 blob으로 변경 해야한다. 그 당시에 이부분은 관련된 라이브러리 몇개 찾아 비교 후, [이 라이브러리로](https://github.com/bubkoo/html-to-image/) 결정하고 사용했지 디테일하게 들어가진 않았는데, 이번엔 좀 더 자세하게 알아보겠다.

1. canvas는 image를 읽어서 그릴 수 있고, blob으로 변경할 수 있다.
   - `getContext("2d").drawImage method`
   - `canvas.toBlob method`
2. svg는 img tag에서 image로 그려줄 수 있다.
3. html 태그는 svg화 될 수 있다.

고로 변환 흐름은 html tag -> svg -> img -> canvas 순이다.

```javascript
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reject(new Error("blobToBase64 failed"));
    };
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

const htmlToBlob = (element) => {
  return new Promise(async (resolve, reject) => {
    // 1. SVG 요소 생성
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", element.offsetWidth);
    svg.setAttribute("height", element.offsetHeight);
    // 1.1 foreignObject 요소 생성
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    foreignObject.setAttribute("width", "100%");
    foreignObject.setAttribute("height", "100%");
    foreignObject.setAttribute("x", "0");
    foreignObject.setAttribute("y", "0");
    foreignObject.setAttribute("externalResourcesRequired", "true");

    // 1.2 HTML 요소 복제 및 수정
    const clone = element.cloneNode(true);
    if (clone instanceof HTMLImageElement) {
      const blob = await (await fetch(clone.src)).blob();
      const baseUrl = await blobToBase64(blob);
      clone.src = baseUrl;
    }

    // 1.3 foreignObject에 추가
    foreignObject.appendChild(clone);
    svg.appendChild(foreignObject);

    // 1.4 SVG를 문자열로 직렬화 후 url 생성
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      svgString
    )}`;

    // 2. 이미지 요소 생성
    const img = new Image();
    // 2.1 SVG 데이터 URL 설정
    img.src = svgUrl;
    // 2.2. 이미지 로드 완료 후 Canvas에 그리는 로직
    img.onload = () => {
      // 3. canvas 생성
      const canvas = document.createElement("canvas");
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
      const context = canvas.getContext("2d");

      // 3.1 img를 canvas에 draw
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 3.2 Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob."));
        }
      }, "image/png");
    };

    // 2.3. 이미지 로드 실패 시 오류 처리
    img.onerror = () => {
      reject(new Error("Failed to load image."));
    };
  });
};
```

라이브러리를 분석해서 과정을 한번 구현해본 코드인데 필요한 부분만 작성했다.

**svg를 직렬화 후 이미지 화 할때, 기존 img 경로를 참조 할 수 없기에 이미지를 blob화 후 base64 인코딩으로 변환**해서 경로에 넣어야 한다.

이부분은 **이미지화 할 노드 및 자식들 중 img 태그, background img를 사용하는 태그에 전부 전부에 적용**해야한다.

### 이미지를 클립보드에 저장하기

위의 과정을 거치면, 특정 태그를 svg -> img -> canvas -> blob화 까지 하게 되는데, blob을 클립보드에 저장하는 건 간단하다.

```javascript
const item = new ClipboardItem({ "image/png": blob });
await navigator.clipboard.write([item]);
```

다만 write 메서드 역시 태그에 focus가 안되면 에러를 뱉으니(사용자 액션 동반 필요) 주의하자.

그리고 clipboard api는 크롬 외에는 현재까지도 [writeText말고는 잘 안되는 것 같다](https://caniuse.com/?search=clipboard).

## 결론

그 당시 신입의 입장에서 안된다고 하면 내 실력이 부족해서 못한다고 생각할 것 같아 죽어라 분석했던 기억이 난다.

어쨌든 방법이 없는 문제였고, 그 당시 기획자와 얘기해서 다운 버튼을 추가하고 크롬은 다운, 복사 버튼 2개

그외 브라우저는 다운 버튼만 넣고 이미지를 다운하는 방향으로 바꿔 마무리 지었었다.

그때가 조금만 더 지나면 3년전 이라는게 소름이다. 시간 참 빠르다.
