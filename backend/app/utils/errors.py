"""JSON error handling for the TaskFlow API.

Every failure is returned as a consistent JSON envelope so API clients (the
Next.js frontend) can handle errors uniformly instead of parsing HTML pages.
"""

from __future__ import annotations

from flask import Flask, Response, jsonify


def register_error_handlers(app: Flask) -> None:
    """Register JSON responses for the common HTTP errors.

    Args:
        app: The application instance created by the application factory.
    """

    @app.errorhandler(404)
    def handle_not_found(_error: Exception) -> tuple[Response, int]:
        """Unknown path."""
        return jsonify(status="error", message="Resource not found"), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(_error: Exception) -> tuple[Response, int]:
        """Known path, unsupported HTTP method."""
        return jsonify(status="error", message="Method not allowed"), 405

    @app.errorhandler(500)
    def handle_internal_error(_error: Exception) -> tuple[Response, int]:
        """Unexpected server-side failure."""
        return jsonify(status="error", message="Internal server error"), 500
