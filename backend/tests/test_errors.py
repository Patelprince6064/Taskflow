"""Tests for the shared JSON error handlers."""

from __future__ import annotations

from flask.testing import FlaskClient


def test_unknown_path_returns_json_404(client: FlaskClient) -> None:
    """Unknown routes answer with the JSON error envelope, not an HTML page."""
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404
    assert response.is_json
    assert response.get_json() == {
        "status": "error",
        "message": "Resource not found",
    }


def test_unsupported_method_returns_405(client: FlaskClient) -> None:
    """A known path with the wrong method returns a JSON 405."""
    response = client.put("/api/health")

    assert response.status_code == 405
    assert response.get_json() == {
        "status": "error",
        "message": "Method not allowed",
    }


def test_error_payload_shape_is_consistent(client: FlaskClient) -> None:
    """Every error response carries ``status`` and ``message`` keys."""
    payload = client.get("/missing").get_json()

    assert set(payload.keys()) == {"status", "message"}
    assert payload["status"] == "error"
