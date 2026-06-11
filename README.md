# TrueNorth Solar — AI-Powered Sales & Support Platform

> A production-grade demo of an AI-powered solar sales platform built on MadeForMeAI infrastructure. Full-stack React frontend, Five specialized AI agents, Twenty CRM integration, Authentik SSO, and a private K3s Kubernetes cluster.

[![Frontend](https://img.shields.io/badge/frontend-React%2019%20%2B%20Vite-61DAFB?logo=react)](https://truenorth.madeformeai.com)
[![CRM](https://img.shields.io/badge/CRM-Twenty-black?logo=data:image/svg+xml;base64,PHN2Zy8+)](https://truenorth-crm.madeformeai.com)
[![Docs](https://img.shields.io/badge/docs-Mintlify-00B4D8)](https://docs-truenorth.madeformeai.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Live URLs](#live-urls)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Kubernetes Manifests](#kubernetes-manifests)
- [AI Agents](#ai-agents)
- [Authentication](#authentication)
- [CRM Integration](#crm-integration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TrueNorth Solar is a full-stack demo platform built to showcase how AI agents can power a residential solar sales operation end-to-end. The platform includes:

- **Public marketing site** — lead capture, Solar 101 content, quote form that creates live CRM leads
- **Team dashboard** — protected by Authentik SSO, live pipeline Kanban connected to Twenty CRM
- **Five AI agents** — running on Hermes gateway (Discord + web chat), each with distinct personas and toolsets
- **Full observability** — Hermes dashboard, OpenClaw gateway UI, both behind Authentik forward auth

This repo contains the **React frontend** (`web2/`), **Kubernetes manifests** (`k8s/`), and deployment tooling. Agent configs and runbooks live in companion repos.

---

## Live URLs

| Service | URL | Auth |
|---------|-----|------|
| Public Website | https://truenorth.madeformeai.com | Public |
| Team Dashboard | https://truenorth.madeformeai.com/dashboard | Authentik SSO |
| Documentation | https://docs-truenorth.madeformeai.com | Public |
| Twenty CRM | https://truenorth-crm.madeformeai.com | Authentik SSO |
| Hermes Gateway API | https://truenorth-hermes.madeformeai.com | API Key |
| Hermes Dashboard | https://hermes-truenorth.madeformeai.com | Authentik SSO (Admin) |
| OpenClaw Gateway | https://truenorth-openclaw.madeformeai.com | Authentik SSO (Admin) |
| Authentik (SSO) | https://truenorth-login.madeformeai.com | — |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare DNS / CDN                       │
│              Wildcard: *.madeformeai.com                      │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────▼───────────────────────────────┐
│                   K3s Cluster (<CLUSTER_IP>)                │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Traefik Ingress + Wildcard TLS                     │     │
│  │  Forward Auth → Authentik Outpost (truenorth-demo)  │     │
│  └──────┬──────────┬──────────┬──────────┬────────────┘     │
│         │          │          │          │                    │
│  ┌──────▼──┐ ┌─────▼───┐ ┌───▼────┐ ┌──▼──────────┐        │
│  │Frontend │ │ Twenty  │ │Hermes  │ │  OpenClaw   │        │
│  │ (nginx) │ │  CRM    │ │Gateway │ │  Gateway    │        │
│  │  :80    │ │:3000    │ │ :8642  │ │  :18789     │        │
│  └──────┬──┘ └─────┬───┘ └───┬────┘ └─────────────┘        │
│         │          │          │                               │
│  ┌──────▼──────────▼──┐  ┌───▼──────┐                       │
│  │   PostgreSQL        │  │  Redis   │                       │
│  │   (Twenty data)     │  │ (cache)  │                       │
│  └────────────────────┘  └──────────┘                       │
│                                                               │
│  Namespace: truenorth-demo                                    │
└─────────────────────────────────────────────────────────────┘
```

### Auth Flow

```
User → truenorth.madeformeai.com/login
     → Authentik (truenorth-login.madeformeai.com) [PKCE OAuth2]
     → /callback → JWT stored in sessionStorage
     → Dashboard (protected routes read JWT)

Admin-only routes (Agent Brain):
     → requireAdmin={true} on ProtectedRoute
     → Checks Authentik group membership from JWT claims
```

---

## Tech Stack

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| HTTP | Native fetch (no Axios) |
| Auth | Authentik PKCE OAuth2 |
| Notifications | Sonner |
| Icons | Lucide React |
| Fonts | Manrope + DM Sans (Google Fonts) |

### Infrastructure
| Layer | Technology |
|-------|-----------|
| Orchestration | K3s (lightweight Kubernetes) |
| Ingress | Traefik v2 with TLS termination |
| Auth Provider | Authentik (self-hosted) |
| CRM | Twenty CRM (self-hosted, GraphQL API) |
| AI Gateway | Hermes (NousResearch) |
| Chat Gateway | OpenClaw |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Registry | GitHub Container Registry (ghcr.io/almnjoy) |
| DNS | Cloudflare (wildcard *.madeformeai.com) |

### AI
| Agent | Model | Channel |
|-------|-------|---------|
| truenorth-sales | OpenAI GPT-5.5 via Codex | Discord #solar-sales |
| truenorth-support | OpenAI GPT-5.5 via Codex | Discord #solar-support |
| truenorth-doc | OpenAI GPT-5.5 via Codex | Discord #solar-info |
| truenorth-lead | OpenAI GPT-5.5 via Codex | Intake automation |
| truenorth-controller | OpenAI GPT-5.5 via Codex | Orchestration |

---

## Repository Structure

```
MadeForMeAI-Solar-TrueNorthApp/
├── web2/                          # React frontend (monorepo)
│   ├── apps/web/
│   │   ├── src/
│   │   │   ├── components/        # Shared UI components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TrueNorthLogo.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── contexts/
│   │   │   │   └── AuthContext.jsx  # Authentik PKCE auth state
│   │   │   ├── lib/
│   │   │   │   └── twentyClient.js  # Twenty CRM GraphQL client
│   │   │   ├── pages/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── CallbackPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── PipelinePage.jsx
│   │   │   │   ├── TeamPage.jsx
│   │   │   │   ├── ResourcesPage.jsx
│   │   │   │   ├── AccountPage.jsx
│   │   │   │   ├── AgentBrainPage.jsx
│   │   │   │   ├── GetAQuotePage.jsx
│   │   │   │   ├── HowItWorksPage.jsx
│   │   │   │   ├── Solar101Page.jsx
│   │   │   │   └── ContactPage.jsx
│   │   │   └── App.jsx
│   │   ├── public/
│   │   │   └── truenorth-logo.svg
│   │   └── .env                   # VITE_ vars — baked in at build time
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── k8s/
│   ├── namespace.yaml             # truenorth-demo namespace
│   ├── secrets.yaml               # All secrets template (DO NOT COMMIT real values)
│   ├── frontend-deployment.yaml   # React app + nginx
│   ├── frontend-ingress.yaml      # Traefik ingress + TLS
│   ├── postgres-deployment.yaml   # PostgreSQL for Twenty CRM
│   ├── redis-deployment.yaml      # Redis for Twenty CRM
│   ├── twenty-deployment.yaml     # Twenty CRM (server + worker + migration)
│   ├── hermes-deployment.yaml     # Hermes AI gateway + ConfigMap + Ingress
│   ├── hermes-config.yaml         # Hermes agent config (personalities, model, memory)
│   ├── openclaw-deployment.yaml   # OpenClaw chat gateway
│   ├── openclaw-config.json       # OpenClaw channel and bot configuration
│   └── truenorth-outpost.yaml     # Authentik proxy outpost + Traefik middleware
├── DEPLOY.md                      # Detailed deployment runbook
└── README.md                      # This file
```

---

## Prerequisites

- **Docker** (with GHCR login) — for building and pushing the frontend image
- **kubectl** — configured against the K3s cluster
- **Node.js 20+** — for local frontend development
- **git** — obviously
- **GitHub PAT** with `write:packages` scope — for pushing to GHCR

```bash
# Authenticate with GHCR
echo $GITHUB_PAT | docker login ghcr.io -u almnjoy --password-stdin
```

---

## Environment Variables

All frontend env vars are `VITE_` prefixed and **baked into the Docker image at build time**. There is no runtime injection.

### `web2/apps/web/.env`

```env
# Authentik SSO
VITE_AUTHENTIK_URL=https://truenorth-login.madeformeai.com
VITE_AUTHENTIK_CLIENT_ID=<authentik_pkce_client_id>
VITE_AUTHENTIK_REDIRECT_URI=https://truenorth.madeformeai.com/callback

# Twenty CRM
VITE_TWENTY_API_URL=https://truenorth-crm.madeformeai.com
VITE_TWENTY_API_KEY=<twenty_api_key_jwt>

# Hermes AI Gateway
VITE_HERMES_API_URL=https://truenorth-hermes.madeformeai.com
VITE_HERMES_API_KEY=<hermes_api_key>
```

### `k8s/secrets.yaml` (never commit real values)

```yaml
# Populated via: kubectl apply -f k8s/secrets.yaml -n truenorth-demo
HERMES_API_KEY: <base64>
HERMES_OPENROUTER_KEY: <base64>
AUTHENTIK_OUTPOST_TOKEN: <base64>
TWENTY_APP_SECRET: <base64>
POSTGRES_PASSWORD: <base64>
OPENCLAW_GATEWAY_TOKEN: <base64>
```

> **Security note:** `secrets.yaml` in this repo contains placeholder values only. Real secrets are applied manually on the cluster and never committed to git.

---

## Local Development

```bash
# Clone
git clone https://github.com/almnjoy/MadeForMeAI-Solar-TrueNorthApp.git
cd MadeForMeAI-Solar-TrueNorthApp/web2

# Install dependencies
npm install

# Copy and fill env
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your local/dev values

# Start dev server
npm run dev
# → http://localhost:5173
```

### Development Notes

- Authentik SSO redirect URI must include `http://localhost:5173/callback` in the Authentik provider config for local dev
- The Twenty CRM GraphQL client falls back gracefully when `VITE_TWENTY_API_KEY` is not set — the dashboard shows mock data with a banner
- Hot reload works normally; Tailwind JIT is configured via `vite.config.js`

---

## Deployment

See [`DEPLOY.md`](DEPLOY.md) for the full deployment runbook. Quick reference:

### Full deploy (first time)

```bash
# 1. Build and push image (from web2/)
docker build --no-cache -t ghcr.io/almnjoy/truenorth-frontend:latest .
docker push ghcr.io/almnjoy/truenorth-frontend:latest

# 2. Apply manifests (from repo root, on the controller)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml -n truenorth-demo
kubectl apply -f k8s/truenorth-outpost.yaml        # Creates in traefik namespace
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/twenty-deployment.yaml
kubectl apply -f k8s/hermes-deployment.yaml
kubectl apply -f k8s/openclaw-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-ingress.yaml
```

### Redeploy after code changes

```bash
# From ~/demos/truenorth on the controller
git pull
cd web2
docker build --no-cache -t ghcr.io/almnjoy/truenorth-frontend:latest .
docker push ghcr.io/almnjoy/truenorth-frontend:latest
kubectl rollout restart deployment/truenorth-frontend -n truenorth-demo
kubectl rollout status deployment/truenorth-frontend -n truenorth-demo
```

### Verify cluster state

```bash
kubectl get pods -n truenorth-demo
kubectl get svc -n truenorth-demo
kubectl get ingress -n truenorth-demo
```

---

## Kubernetes Manifests

| Manifest | What it creates |
|----------|----------------|
| `namespace.yaml` | `truenorth-demo` namespace |
| `secrets.yaml` | `truenorth-env` Secret with all keys |
| `frontend-deployment.yaml` | nginx serving the React SPA (image: `ghcr.io/almnjoy/truenorth-frontend:latest`) |
| `frontend-ingress.yaml` | Traefik ingress for `truenorth.madeformeai.com` with TLS |
| `postgres-deployment.yaml` | PostgreSQL 16 with PVC for Twenty CRM data |
| `redis-deployment.yaml` | Redis 7 for Twenty CRM caching and queues |
| `twenty-deployment.yaml` | Twenty CRM server + background worker + DB migration job |
| `hermes-deployment.yaml` | Hermes agent gateway (ports 8642 API / 9119 dashboard), ConfigMap with agent personalities |
| `openclaw-deployment.yaml` | OpenClaw chat gateway (port 18789) with ConfigMap |
| `truenorth-outpost.yaml` | Authentik proxy outpost, ClusterIP service, Traefik ForwardAuth middleware, IngressRoutes for callback paths |

### Important: Traefik CRDs

The Authentik forward auth middleware and the outpost callback IngressRoutes must be created in the **`traefik` namespace**, not `truenorth-demo`. This is handled in `truenorth-outpost.yaml`. Traefik only watches its own namespace for CRD objects.

---

## AI Agents

Five Hermes agent personalities are configured in `k8s/hermes-deployment.yaml` ConfigMap:

| Personality Key | Role | Primary Channel |
|----------------|------|----------------|
| `truenorth-sales` | Lead qualification, ROI estimation, survey booking | Discord `#solar-sales` |
| `truenorth-support` | Post-install support, troubleshooting, warranty | Discord `#solar-support` |
| `truenorth-doc` | Solar education, permits, terminology | Discord `#solar-info` |
| `truenorth-lead` | Intake automation, CRM lead creation | Webhook/form integration |
| `truenorth-controller` | Orchestration, agent routing, escalation | Internal |

All agents run on a shared Hermes gateway using OpenAI Codex (GPT-5.5) via `provider: openai-codex`. Memory is enabled per-agent with a 2200-character limit. Session resets at 4am daily.

---

## Authentication

Auth is handled by Authentik with PKCE OAuth2 flow:

1. User hits `/login` → redirected to Authentik at `truenorth-login.madeformeai.com`
2. User authenticates → Authentik redirects back to `/callback` with `code`
3. `CallbackPage.jsx` exchanges code for tokens via PKCE
4. Access token stored in `sessionStorage` as `auth_access_token`
5. `AuthContext.jsx` reads token, decodes JWT claims (groups, email, name)
6. `ProtectedRoute` checks `isAuthenticated`; `requireAdmin={true}` checks `isAdmin` (group membership)

The Authentik proxy outpost also provides forward auth for the Hermes dashboard and OpenClaw gateway — both are admin-only via the `traefik-truenorth-authentik-forwardauth@kubernetescrd` middleware.

---

## CRM Integration

The frontend connects to **Twenty CRM** via GraphQL at `VITE_TWENTY_API_URL/graphql`.

### Client: `web2/apps/web/src/lib/twentyClient.js`

Key operations:

| Function | Description |
|----------|-------------|
| `getOpportunities()` | Fetch all pipeline opportunities with contact + company |
| `updateOpportunityStage(id, stage)` | Drag-to-update Kanban stages |
| `getPeople(first)` | Fetch contacts |
| `createLead({...})` | Create Person + Opportunity from quote form submission |
| `getNotes(first)` | Fetch activity notes for dashboard feed |

### Lead Creation Flow

```
Website /get-quote form submit
  → createLead() in twentyClient.js
  → createPerson mutation (name, email, phone, province)
  → createOpportunity mutation (stage: NEW, linked to person)
  → Lead appears in /pipeline Kanban board
```

### Stage Mapping

| Twenty Stage | Dashboard Label |
|-------------|----------------|
| `NEW` | New Lead |
| `SCREENING` | Contacted |
| `MEETING` | Site Survey Booked |
| `PROPOSAL` | Proposal Sent |
| `CUSTOMER` | Won |
| `CHURNED` | Lost |

---

## Contributing

This is a demo platform managed by the MadeForMeAI team. For changes:

1. Fork the repo and create a feature branch (`git checkout -b feature/my-change`)
2. Make changes — frontend only in `web2/`, infrastructure only in `k8s/`
3. **Never commit real secrets** — `secrets.yaml` uses placeholder values only
4. Test locally (`npm run dev`) before opening a PR
5. PR description should include: what changed, whether a Docker rebuild is needed, whether K8s manifests need re-applying

### Commit Convention

```
feat: new feature
fix: bug fix
chore: dependency update, config change
docs: documentation only
infra: k8s manifest change
```

---

## Related Repos

| Repo | Contents |
|------|----------|
| [MadeForMeAI-Solar-DemoDocs](https://github.com/almnjoy/MadeForMeAI-Solar-DemoDocs) | Mintlify documentation source |
| [MadeForMeAI-Solar-Demo](https://github.com/almnjoy/MadeForMeAI-Solar-Demo) | Agent runbooks, demo scripts, planning docs |
| [mintlify-docs](https://github.com/almnjoy/mintlify-docs) | Mintlify docs repo (auto-synced to docs-truenorth.madeformeai.com) |

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built on [MadeForMeAI](https://madeformeai.com) — enterprise AI infrastructure for businesses.*
