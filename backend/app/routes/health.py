"""Health check endpoint."""

from __future__ import annotations

from flask import Blueprint, Response, jsonify

#: Prefixed with ``/api`` so every API route shares one namespace.
health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.get("/health")
def health() -> tuple[Response, int]:
    """Report that the API is up.

    Used by the frontend status card, monitoring and deployment smoke checks.
    """
    return jsonify(status="success", message="TaskFlow API is running"), 200
