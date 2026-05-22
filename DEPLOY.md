# TrueNorth Demo — Deployment Guide

Cluster: K3s at `178.104.234.55`
Namespace: `truenorth-demo`
Registry: `ghcr.io/almnjoy/`

---

## Prerequisites

- Docker Desktop running locally
- `kubectl` configured and pointing at your K3s cluster
- Logged in to GHCR: `echo $GITHUB_PAT | docker login ghcr.io -u almnjoy --password-stdin`
- `secrets.yaml` filled in (already done)

---

## Step 1 — Build and push the frontend image

Run from `MARKETING/SOLAR-DEMO/web2/`:

```bash
docker build -t ghcr.io/almnjoy/truenorth-frontend:latest .
docker push ghcr.io/almnjoy/truenorth-frontend:latest
```

> The `.env` file at `apps/web/.env` is copied into the build context and VITE_ vars get
> baked in at build time. No runtime env injection needed for the frontend.

---

## Step 2 — Apply manifests (in order)

Run from `MARKETING/SOLAR-DEMO/`:

```bash
# 1. Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Secrets (only safe to re-apply — no destructive changes)
kubectl apply -f k8s/secrets.yaml -n truenorth-demo

# 3. Postgres (PVC + Deployment + Service)
kubectl apply -f k8s/postgres-deployment.yaml

# 4. Frontend (Deployment + Service)
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Ingress (Traefik + TLS)
kubectl apply -f k8s/frontend-ingress.yaml
```

---

## Step 3 — Verify

```bash
# All pods running?
kubectl get pods -n truenorth-demo

# Services up?
kubectl get svc -n truenorth-demo

# Ingress showing correct host?
kubectl get ingress -n truenorth-demo

# Frontend logs
kubectl logs -n truenorth-demo deployment/truenorth-frontend

# Postgres logs
kubectl logs -n truenorth-demo deployment/truenorth-postgres
```

Expected pod states after ~60s:
```
truenorth-postgres-xxxxx    1/1   Running
truenorth-frontend-xxxxx    1/1   Running
```

---

## Step 4 — Verify TLS

Traefik handles the wildcard cert at the cluster level — no cert secret or cert-manager config needed per namespace. Same pattern as all user pod ingresses.

```bash
kubectl describe ingress truenorth-ingress -n truenorth-demo
```

HTTPS should work immediately once the ingress is applied.

---

## Redeployment (after code changes)

```bash
# From web2/
docker build -t ghcr.io/almnjoy/truenorth-frontend:latest .
docker push ghcr.io/almnjoy/truenorth-frontend:latest

# Force pod restart to pull new image
kubectl rollout restart deployment/truenorth-frontend -n truenorth-demo
kubectl rollout status deployment/truenorth-frontend -n truenorth-demo
```

---

## Teardown

```bash
kubectl delete namespace truenorth-demo
# PVC is deleted automatically with the namespace
```

---

## Troubleshooting

**Pod stuck in ImagePullBackOff**
```bash
kubectl describe pod -n truenorth-demo -l app=truenorth-frontend
# Check: GHCR package visibility must be set to "public" or add imagePullSecret
```

Make the GHCR package public in GitHub → Packages → truenorth-frontend → Package settings → Change visibility.

**Site loads but login redirect fails (Authentik 400)**
- Check Authentik provider config: redirect URI must match exactly `https://truenorth.madeformeai.com/callback`
- Check Authentik application: slug must be `truenorth`

**`/dashboard` shows blank or redirects to login after OAuth callback**
- Check browser devtools → Application → Session Storage for `auth_access_token`
- If missing, the token exchange failed — check CallbackPage errors in console

**Postgres readiness probe failing**
```bash
kubectl exec -n truenorth-demo deployment/truenorth-postgres -- pg_isready -U truenorth -d truenorth
```
