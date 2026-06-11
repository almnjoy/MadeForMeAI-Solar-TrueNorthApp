# TrueNorth Demo — Deployment Guide

Cluster: K3s at `<CLUSTER_IP>`
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

Apply files individually, never `kubectl apply -f k8s/` the whole directory — one
file (`truenorth-outpost.yaml`) writes into the shared `traefik` namespace and a
blanket apply there is what takes down Authentik for every app.

```bash
# 1. Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Secrets (fill in real values first; only safe to re-apply — no destructive changes)
kubectl apply -f k8s/secrets.yaml -n truenorth-demo

# 3. Data stores
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml

# 4. App workloads
kubectl apply -f k8s/twenty-deployment.yaml
kubectl apply -f k8s/hermes-deployment.yaml
kubectl apply -f k8s/openclaw-deployment.yaml

# 5. Frontend (Deployment + Service) + its ingress
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-ingress.yaml
```

### Step 2b — Authentik outpost (SHARED traefik namespace — deliberate, separate step)

`truenorth-outpost.yaml` creates a Middleware and an IngressRoute in the **traefik**
namespace, shared with the main platform. Review the diff before applying and never
delete/blanket-reapply it casually — a mistake here breaks auth cluster-wide.

```bash
# Confirm the wildcard TLS secret the outpost IngressRoute references exists here:
kubectl get secret madeformeai-wildcard-tls -n traefik

# Then apply, on its own:
kubectl apply -f k8s/truenorth-outpost.yaml
```

If `madeformeai-wildcard-tls` is NOT present in the traefik namespace, either copy it
there or drop `tls.secretName` from the IngressRoute and rely on Traefik's default
TLSStore (the pattern the user-pod ingresses use). A missing secret silently breaks
TLS on the callback path and looks exactly like "Authentik is down."

### Step 2c — Optional: NetworkPolicy hardening

See the caveats in `k8s/networkpolicy.yaml`. Apply on its own and verify pods stay
Ready (some CNIs block kubelet probes):

```bash
kubectl apply -f k8s/networkpolicy.yaml
kubectl get pods -n truenorth-demo -w
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
