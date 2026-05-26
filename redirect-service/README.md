# HealthyDay Redirect Service

A lightweight FastAPI microservice for QR code URL redirects with configurable destinations.

## How It Works

| QR Code URL | Redirects To |
|---|---|
| `https://yoga.healthyday.co.in/ofl?ref=mp` | `https://register.dailyyogawithjagan.com?ref=mp` |
| `https://yoga.healthyday.co.in/ofl?ref=mp&utm=summer` | `https://register.dailyyogawithjagan.com?ref=mp&utm=summer` |

All query parameters are forwarded automatically.

## Local Development

```bash
cd redirect-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Test:
```bash
curl -v "http://localhost:8000/ofl?ref=mp&utm=summer"
# → 302 redirect to https://register.dailyyogawithjagan.com?ref=mp&utm=summer
```

## Configuration

### Default (in code)
Edit `config.py` → `_DEFAULT_REDIRECTS` dict.

### Environment Variable (recommended for production)
Set `REDIRECT_CONFIG` as a JSON string:

```bash
REDIRECT_CONFIG='{"ofl":"https://register.dailyyogawithjagan.com","event":"https://example.com/event","offer":"https://example.com/offer","camp":"https://example.com/camp"}'
```

## Deploy to Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/redirect-service

# Deploy
gcloud run deploy redirect-service \
  --image gcr.io/YOUR_PROJECT/redirect-service \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars 'REDIRECT_CONFIG={"ofl":"https://register.dailyyogawithjagan.com"}'
```

## Adding New Routes

1. Add the slug and target URL to `REDIRECT_CONFIG` env var (or `config.py`).
2. Add a proxy rule in `netlify.toml` for the new slug.
3. Redeploy.

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /redirects` | List all configured redirects |
| `GET /{slug}` | Redirect to configured target |
