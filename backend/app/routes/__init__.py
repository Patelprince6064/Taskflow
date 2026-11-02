"""Route blueprints exposed by the TaskFlow API."""

from __future__ import annotations

from flask import Flask

from app.routes.health import health_bp


def register_blueprints(app: Flask) -> None:
    """Attach every API blueprint to the application.

    New feature routes (Phase 2+) are registered here so the application
    factory stays free of route details.
    """
    app.register_blueprint(health_bp)
