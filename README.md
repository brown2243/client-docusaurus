# Personal blog project with Docusaurus

url: **https://braurus.dev/**

## 프론트매터 best practice

```
---
# 필수 메타데이터
id: unique-doc-id                      # 문서의 고유 식별자
title: 문서 제목                        # 브라우저 탭과 문서 상단에 표시되는 제목
description: "이 문서는 기능 X에 대한 사용법을 설명합니다"  # SEO와 소셜 미디어 공유에 사용

# 사이드바 및 네비게이션
sidebar_label: 짧은 제목             # 사이드바에 표시될 간결한 제목
sidebar_position: 1                  # 사이드바에서의 정렬 순서
sidebar_class_name: special-doc      # 사이드바 항목에 적용할 CSS 클래스

# 날짜 및 버전 관리
created_date: "2025-03-17"           # 문서 최초 작성일
last_updated: "2025-03-17"           # 문서 마지막 업데이트일
version: "1.0.0"                     # 문서가 적용되는 소프트웨어 버전

# 저자 정보
author: "개발자 이름"                 # 주 작성자
contributors: ["기여자1", "기여자2"]   # 기여자 목록

# 검색 및 분류
keywords: ["키워드1", "키워드2"]      # 검색 엔진 최적화를 위한 키워드
tags: ["시작하기", "설정", "고급"]     # 문서 분류 태그

# 문서 상태 및 가시성
draft: false                         # 초안 상태 (true면 프로덕션에서 숨겨짐)
unlisted: false                      # 목록에서 제외 (true면 직접 URL로만 접근 가능)

# 문서 표시 옵션
hide_title: false                    # 문서 상단 제목 숨김 여부
hide_table_of_contents: false        # 목차 숨김 여부
toc_min_heading_level: 2             # 목차에 포함할 최소 제목 레벨
toc_max_heading_level: 3             # 목차에 포함할 최대 제목 레벨

# 페이지 네비게이션
pagination_label: "커스텀 페이지네이션 라벨"  # 페이지네이션에 표시될 텍스트
pagination_next: advanced-guide      # 다음 문서 지정 (null로 비활성화 가능)
pagination_prev: introduction        # 이전 문서 지정 (null로 비활성화 가능)

# URL 및 참조
slug: /custom-path                   # 커스텀 URL 경로
custom_edit_url: https://github.com/org/repo/edit/main/docs/file.md  # 편집 링크

# 추가 메타데이터 (커스텀 필드)
complexity: "중급"                   # 문서 난이도
reading_time: "10분"                 # 예상 읽기 시간
feature_status: "안정"               # 기능 상태 (실험적/베타/안정)
related_documents: ["설치-가이드", "문제해결"]  # 관련 문서
---

```
