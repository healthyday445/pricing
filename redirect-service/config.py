"""
Redirect configuration for the QR code redirect service.

Routes map a slug (e.g., "ofl") to a target base URL.
All query params from the incoming request are forwarded automatically.

Override at deploy time by setting the REDIRECT_CONFIG environment variable
to a JSON string, e.g.:
    REDIRECT_CONFIG='{"ofl":"https://register.dailyyogawithjagan.com","event":"https://example.com/event"}'
"""

import json
import os
from typing import Dict

# Default redirect mappings
_DEFAULT_REDIRECTS: Dict[str, str] = {
    "ofl": "https://register.dailyyogawithjagan.com",
    # "event": "https://example.com/event-page",
    # "offer": "https://example.com/offer-page",
    # "camp":  "https://example.com/camp-page",
}


def load_redirects() -> Dict[str, str]:
    """
    Load redirect mappings from environment variable or fall back to defaults.

    The REDIRECT_CONFIG env var should be a JSON object mapping slugs to URLs.
    If not set or invalid, the built-in defaults are used.
    """
    env_config = os.getenv("REDIRECT_CONFIG")
    if env_config:
        try:
            parsed = json.loads(env_config)
            if isinstance(parsed, dict):
                return parsed
        except (json.JSONDecodeError, TypeError):
            pass  # Fall through to defaults
    return _DEFAULT_REDIRECTS.copy()


# Singleton — loaded once at startup
REDIRECTS = load_redirects()
