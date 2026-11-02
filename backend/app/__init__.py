"""Flask application factory for the TaskFlow REST API."""

from __future__ import annotations

from flask import Flask
from flask_cors import CORS

from app.routes import register_blueprints
from app.utils.errors import register_error_handlers
from config import get_config


def create_app(config_name: str | None = None) -> Flask:
    """Create and configure the TaskFlow Flask application.

    Args:
        config_name: One of ``development``, ``testing`` or ``production``.
            Defaults to the ``FLASK_ENV`` environment variable.

    Returns:
        A configured, unstarted Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    # Keep response key order stable so documented payloads match byte-for-byte.
    app.json.sort_keys = False

    # Allow the Next.js frontend (FRONTEND_URL) to call the API during
    # local development; production should set FRONTEND_URL to its real origin.
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
    )

    register_blueprints(app)
    register_error_handlers(app)

    return app
