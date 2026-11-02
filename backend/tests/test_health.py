"""Tests for the health check endpoint."""

from __future__ import annotations

from flask.testing import FlaskClient


def test_health_returns_expected_payload(client: FlaskClient) -> None:
    """GET /api/health reports success with the documented message."""
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.is_json
    assert response.get_json() == {
        "status": "success",
        "message": "TaskFlow API is running",
    }


def test_health_content_type_is_json(client: FlaskClient) -> None:
    """The API always answers with a JSON content type."""
    response = client.get("/api/health")

    assert response.headers["Content-Type"].startswith("application/json")


def test_health_rejects_unsupported_methods(client: FlaskClient) -> None:
    """Only GET is allowed on the health endpoint."""
    response = client.post("/api/health")

    assert response.status_code == 405
    assert response.get_json()["status"] == "error"
