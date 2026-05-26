"""
FastAPI Redirect Service for QR Code URLs.

Provides configurable short-URL redirects that preserve all query parameters.
Designed for use behind QR codes so the destination can change without
reprinting the code.

Usage:
    GET /ofl?ref=mp&utm=summer
    → 302 redirect to https://register.dailyyogawithjagan.com?ref=mp&utm=summer
"""

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from config import REDIRECTS

app = FastAPI(
    title="HealthyDay Redirect Service",
    description="QR code redirect service with configurable destinations",
    version="1.0.0",
)


# ──────────────────────────────────────────────
# Health check
# ──────────────────────────────────────────────
@app.get("/health")
async def health():
    """Health check endpoint for Cloud Run / load balancers."""
    return {"status": "ok", "routes_configured": len(REDIRECTS)}


# ──────────────────────────────────────────────
# Debug: list active redirects (disable in prod if sensitive)
# ──────────────────────────────────────────────
@app.get("/redirects")
async def list_redirects():
    """List all currently configured redirect mappings."""
    return {"redirects": REDIRECTS}


# ──────────────────────────────────────────────
# Core redirect handler
# ──────────────────────────────────────────────
@app.get("/{slug}")
async def redirect(slug: str, request: Request):
    """
    Redirect a short-URL slug to its configured target.

    All query parameters from the incoming request are forwarded
    to the target URL automatically.

    Args:
        slug: The redirect key (e.g., "ofl", "event", "offer", "camp").
        request: The incoming FastAPI request (used to extract query params).

    Returns:
        302 RedirectResponse to the target URL with query params appended.
        404 JSON response if the slug is not configured.
    """
    target_base = REDIRECTS.get(slug)

    if not target_base:
        return JSONResponse(
            status_code=404,
            content={
                "error": "not_found",
                "message": f"No redirect configured for '/{slug}'",
                "available_routes": list(REDIRECTS.keys()),
            },
        )

    # Build the final URL with query params
    query_string = str(request.query_params)
    if query_string:
        # Handle case where target already has query params
        separator = "&" if "?" in target_base else "?"
        final_url = f"{target_base}{separator}{query_string}"
    else:
        final_url = target_base

    return RedirectResponse(url=final_url, status_code=302)
