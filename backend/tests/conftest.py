"""Shared pytest fixtures for the TaskFlow API test suite."""

from __future__ import annotations

import pytest
from flask import Flask
from flask.testing import FlaskClient

from app import create_app


@pytest.fixture()
def app() -> Flask:
    """Build an application configured for testing (TESTING=True, no reloader)."""
    return create_app("testing")


@pytest.fixture()
def client(app: Flask) -> FlaskClient:
    """Return a test client bound to the ``app`` fixture."""
    return app.test_client()
