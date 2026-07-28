---
slug: work-automation-story-part2
title: "소소한 업무 자동화 썰 2탄: Node.js & Python 스크립트로 귀찮은 데이터 처리 끝장내기"
authors: [brown]
tags: [Automation, Nodejs, Python, Scraping, DevStory]
Date: 2026-07-28 18:00
---

# 소소한 업무 자동화 썰 2탄: Node.js & Python 스크립트로 귀찮은 데이터 처리 끝장내기

<br />

[지난번 쇼핑몰 상품 정보 수동 변경 자동화 썰](/개발-잡담)에 이어, 이번에도 업무 현장에서 나를 괴롭히던 지독한 수작업 타스크들을 Node.js와 Python 스크립트로 끝장낸 썰 2탄을 가져왔다.

듣다보니 동료가 **"매주 50개가 넘는 협력사 사이트 들어돌아가서 PDF 엑셀 다운받고 항목 정리하는데 반나절이 날아가요..."**라며 피눈물을 흘리길래 참지 못하고 진행하게 되었는데...

<!-- truncate -->

### 1. 요구사항과 문제 상황

요구사항은 단순하면서도 지독했다.

1. 협력사 관리자 페이지 30여 곳에 개별 로그인
2. 동적 JS 렌더링으로 띄워지는 주간 공급 데이터 테이블을 CSV로 추출
3. 각 협력사마다 제각각인 칼럼명(예: `상품명`, `품목이름`, `Item Name`...)을 표준 데이터 스키마로 통합
4. 최종 결과를 하나의 Master Excel 파일로 취합하여 슬랙(Slack) 채널로 자동 전송!

솔직히 이걸 매주 월요일 아침마다 사람이 손으로 클릭클릭해 왔다는 소리를 들었을 때 **"이건 인간에 대한 학대다..."** 싶었다. 🤣

---

### 2. 해결 아이디어 & 자동화 파이프라인 설계

내가 설계한 자동화 파이프라인 구조다.

```
[Playwright Node.js] 
  ├── 동적 로그인 및 렌더링 대기
  ├── HTML Table 스크레이핑
  └── Raw JSON 저장
         ↓
[Python Data Processor (Pandas)]
  ├── Schema Mapping & 정규화 (Column Normalization)
  ├── Master Excel 통합 생성
  └── Slack Webhook 파일 전송!
```

---

### 3. 실전 구현 1: Node.js + Playwright 동적 스크레이핑

처음에는 Axios + BeautifulSoup 조합을 생각했는데, 대상 사이트 절반 이상이 React/Vue 기반 SPA여서 단순 HTTP 요청으로는 빈 `div id="root"`만 돌아왔다.

그래서 headless 브라우저인 **Playwright**를 도입했다.

```javascript
// scrape.js (Node.js + Playwright)
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🚀 협력사 로그인 시작...');
  await page.goto('https://vendor-portal.example.com/login');
  
  await page.fill('#vendor-id', process.env.VENDOR_ID);
  await page.fill('#vendor-pw', process.env.VENDOR_PW);
  await page.click('button[type="submit"]');
  
  // 데이터 테이블 렌더링 대기
  await page.waitForSelector('.data-table-row');

  // 테이블 데이터 추출
  const rowData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-table-row'));
    return rows.map(row => {
      const cols = row.querySelectorAll('td');
      return {
        itemName: cols[0].innerText.trim(),
        quantity: cols[1].innerText.trim(),
        price: cols[2].innerText.trim(),
      };
    });
  });

  fs.writeFileSync('./raw_data.json', JSON.stringify(rowData, null, 2));
  console.log('✅ 스크레이핑 완료! raw_data.json 저장됨.');

  await browser.close();
})();
```

---

### 4. 실전 구현 2: Python Pandas 데이터 정규화 & Slack 알림

수집된 제각각의 칼럼들을 정규화하고 엑셀로 만드는 데에는 **Python Pandas**만한 것이 없다.

```python
# process.py (Python 3)
import json
import pandas as pd
import requests
import os

# 1. Raw JSON 로드
with open('raw_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

df = pd.DataFrame(data)

# 2. 데이터 정규화 (칼럼명 변경 & 숫자 타입 변환)
df.rename(columns={
    'itemName': '상품명',
    'quantity': '수량',
    'price': '단가'
}, inplace=True)

df['수량'] = pd.to_numeric(df['수량'].str.replace(',', ''), errors='coerce').fillna(0)
df['단가'] = pd.to_numeric(df['단가'].str.replace('원', '').str.replace(',', ''), errors='coerce').fillna(0)
df['총금액'] = df['수량'] * df['단가']

# 3. 통합 마스터 엑셀 생성
output_file = '주간_공급_데이터_통합.xlsx'
df.to_excel(output_file, index=False)
print(f"📊 {output_file} 생성 완료!")

# 4. Slack Webhook 전송
slack_webhook_url = os.environ.get('SLACK_WEBHOOK_URL')
if slack_webhook_url:
    payload = {
        "text": f"🎉 *주간 자동화 데이터 처리가 완료되었습니다!*\n- 총 항목 수: {len(df)}건\n- 총 금액: {df['총금액'].sum():,}원"
    }
    requests.post(slack_webhook_url, json=payload)
    print("🔔 Slack 알림 전송 성공!")
```

---

### 5. 적용 결과 & 주관적 감상

| 구분 | 수작업 처리 방식 | 자동화 스크립트 적용 후 |
| --- | --- | --- |
| **소요 시간** | 매주 월요일 **약 3시간 30분** | **단 45초** (스케줄러 자동 실행) |
| **휴먼 에러** | 오타, 엑셀 수식 누락 빈번 | **오류율 0%** |
| **동료의 반응** | "월요일이 우울했는데 이제 커피 마실 시간 생겼다" | **극찬 & 피자 쏨 🍕** |

---

### 마무리 / Outro

개발자의 위대함은 거창한 거대 아키텍처를 만들 때뿐만 아니라, **누군가의 반복적이고 고통스러운 노동을 단 수십 줄의 코드로 구원해 줄 때**도 빛난다고 믿는다.

주변에 매일 귀찮은 복붙이나 엑셀 노가다로 고통받는 동료가 있다면 지금 바로 스크립트를 하나 선물해 보는 건 어떨까? 한잔해🥂!
