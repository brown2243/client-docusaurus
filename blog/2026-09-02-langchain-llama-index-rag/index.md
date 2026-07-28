---
slug: langchain-llama-index-rag-system
title: "LangChain과 LlamaIndex로 로컬 벡터 DB 기반 RAG(검색 증강 생성) 시스템 구현하기"
authors: [brown]
tags: [AI, RAG, LangChain, LlamaIndex, Python]
Date: 2026-09-02 15:00
---

# LangChain과 LlamaIndex로 로컬 벡터 DB 기반 RAG(검색 증강 생성) 시스템 구현하기

<br />

LLM(대형 언어 모델)을 서비스에 적용하다 보면 가장 큰 한계에 부딪힌다. **"우리 회사 내부 기술 문서나 사내 규칙에 대해서는 아무것도 모른다"**는 점과 **환각(Hallucination) 현상**이다.
이를 해결하기 위해 사내 매뉴얼 PDF/Markdown 문서를 임베딩하여 로컬 벡터 DB에 수집하고, 질의 시 관련 문맥을 검색해 모델에 넘겨주는 **RAG(Retrieval-Augmented Generation) 시스템**을 작성해 보았다.

<!-- truncate -->

### 1. RAG(검색 증강 생성)의 기본 작동 원리

```
[1. 문서 인덱싱 단계]
문서(PDF/MD) ---> [Text Splitter] (청크 단위 쪼개기) ---> [Embedding Model] ---> [Vector DB (Chroma)]

[2. 질의 응답 단계]
사용자 질문 ---> [Vector Search] (유사도 검색) ---> 최적 문맥(Context) 추출
                                                         │
                                                         ▼
                                       [LLM (Claude/GPT)] ---> 최종 답변 생성!
```

---

### 2. LangChain + Chroma 로컬 파이프라인 구축

Python 환경에서 LangChain과 오픈소스 벡터 데이터베이스인 `ChromaDB`를 결합하여 RAG 시스템을 구축하는 코드다.

```python
# rag_pipeline.py
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# 1. 문서 로드 및 청크 분할
loader = DirectoryLoader('./docs', glob="**/*.md", loader_cls=TextLoader)
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)

# 2. 임베딩 및 로컬 Chroma Vector DB 저장
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(docs, embeddings, persist_directory="./chroma_db")

# 3. Retriever 및 LLM 체인 생성
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

system_prompt = (
    "당신은 사내 전문 가이드 에이전트입니다. 아래 제공된 문맥(Context)만을 바탕으로 답변하세요.\n"
    "문맥에 답변할 내용이 없다면 솔직하게 '관련 정보를 찾을 수 없습니다'라고 답하세요.\n\n"
    "Context:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# 4. 실행
response = rag_chain.invoke({"input": "Spring Security JWT 토큰 재발급 정책이 어떻게 되나요?"})
print("🤖 AI 답변:", response["answer"])
```

---

### 3. LlamaIndex를 활용한 고난도 Structured Data RAG

문서 내에 표(Table)나 복잡한 지식 그래프 구조가 포함되어 있을 때는 **LlamaIndex**가 더 정교한 검색을 지원해준다.

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 문서 인덱싱
documents = SimpleDirectoryReader("./docs").load_data()
index = VectorStoreIndex.from_documents(documents)

# Query Engine 생성
query_engine = index.as_query_engine()
response = query_engine.query("Docker 멀티 스테이지 빌드 적용 결과 감량 비율은?")
print(response)
```

---

### 4. RAG 품질 향상을 위한 3대 팁

:::tip
1. **Chunk Size & Overlap 최적화**: 500자 단위 청크에 50자 overlap을 주어 세션 간 맥락 단절을 방지한다.
2. **Hybrid Search (Sparse + Dense)**: 키워드 기반 BM25 검색과 의미 기반 Vector Search를 결합하면 검색 정확도가 크게 올라간다.
3. **Reranking 도입**: Cohere Rerank 모델을 추가하여 유사도 상위 10개 문서 중 가장 관련성 높은 3개를 최종 선별한다.
:::

---

### 마무리 / Outro

RAG를 도입하고 나니 AI가 사내 지식 기반에 맞게 100% 사실에 근거한 정확한 답변을 내놓는 것을 확인할 수 있었다.
환각을 극복하고 실무에 AI를 연결하는 핵심 열쇠인 RAG 시스템 구축 완료!
