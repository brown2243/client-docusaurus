---
slug: github-actions-argocd-gitops-k8s
title: "GitHub Actions + ArgoCD + Kubernetes 기반 GitOps 무중단 배포 자동화"
authors: [brown]
tags: [DevOps, Kubernetes, ArgoCD, GitOps, CICD]
Date: 2026-09-16 16:00
---

# GitHub Actions + ArgoCD + Kubernetes 기반 GitOps 무중단 배포 자동화

<br />

기존의 CI/CD 방식에서는 Jenkins나 GitHub Actions 런너가 Kubernetes 클러스터의 `kubectl` 권한(kubeconfig)을 직접 가지고 명령어를 날리는 방식을 사용했다.
하지만 보안상 클러스터 외부로 인증 권한을 노출해야 하는 위험이 있었기에, **Git 리포지토리를 진실의 유일한 근원(Single Source of Truth)으로 삼는 GitOps 아키텍처**를 ArgoCD와 함께 구축해보았다.

<!-- truncate -->

### 1. Push 방식 CI/CD vs GitOps Pull 방식 비교

```
[전통적인 CI/CD (Push 방식)]
코드 커밋 ---> [GitHub Actions] ---> Docker Build ---> [kubectl apply] ---> [Kubernetes Cluster]
                                                        (외부 노출 위험!)

[GitOps 방식 (Pull 방식 - ArgoCD)]
1. 앱 코드 커밋 ---> [GitHub Actions] ---> Docker Build & Push (Docker Hub)
                                             │
                                             ▼
                               2. Manifest Repo 태그 업데이트!

3. [Kubernetes 내 ArgoCD] <--- (Polling / Webhook) --- [Manifest Repo]
       │
       └── 형상 차이 감지 후 클러스터에 자동 동기화(Sync)! (보안 안전!)
```

---

### 2. GitHub Actions 워크플로우 구성 (`.github/workflows/deploy.yml`)

애플리케이션 이미지 빌드 후, K8s 매니페스트 저장소의 태그 버전을 업데이트하는 워크플로우다.

```yaml
name: Build and Update Manifest

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Application Code
        uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: brown/my-app:${{ github.sha }}

      - name: Checkout Manifest Repository
        uses: actions/checkout@v4
        with:
          repository: brown/k8s-manifests
          token: ${{ secrets.GH_PAT }}
          path: k8s-manifests

      - name: Update Image Tag in Manifest
        run: |
          cd k8s-manifests
          sed -i 's|image: brown/my-app:.*|image: brown/my-app:${{ github.sha }}|g' deployment.yaml
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git commit -am "chore: update image tag to ${{ github.sha }}"
          git push
```

---

### 3. ArgoCD Application 매니페스트 설정

Kubernetes 클러스터 내부에서 매니페스트 저장소를 감시하는 ArgoCD `Application` 리소스 설정이다.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app-production
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/brown/k8s-manifests.git'
    targetRevision: HEAD
    path: '.'
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true # 누군가 kubectl로 임의 수정한 경우 Git 상태로 자동 원복!
```

---

### 4. 무중단 배포 (Rolling Update & Zero Downtime)

Kubernetes `Deployment` 스펙에 RollingUpdate 전략을 적용하여 트래픽 손실 없는 무중단 배포를 달성했다.

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%       # 추가로 생성할 수 있는 최대 파드 비율
      maxUnavailable: 0%  # 배포 중 유실 허용되는 파드 수 0!
```

---

### 마무리 / Outro

GitOps를 적용하고 나니 모든 시스템 변경 이력이 Git Commit으로 남게 되어 롤백도 `git revert` 하나로 원클릭 처리되는 놀라운 편의성을 얻었다.

보안과 배포 안정성 두 토끼를 모두 잡은 GitOps 구축 성공! 한잔해🥂!
