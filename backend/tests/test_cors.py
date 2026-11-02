"""Tests for the CORS configuration used by the Next.js dev server."""

from __future__ import annotations

from flask.testing import FlaskClient


def test_preflight_allows_frontend_origin(client: FlaskClient) -> None:
    """The configured FRONTEND_URL origin may call the API."""
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("Access-Control-Allow-Origin") == (
        "http://localhost:3000"
    )


def test_preflight_blocks_unknown_origin(client: FlaskClient) -> None:
    """Origins outside FRONTEND_URL are not granted access."""
    response = client.options(
        "/api/health",
        headers={
            "Origin": "http://evil.example",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.headers.get("Access-Control-Allow-Origin") != (
        "http://evil.example"
    )
