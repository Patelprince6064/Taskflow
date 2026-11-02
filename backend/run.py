"""Development entrypoint for the TaskFlow API.

Usage:
    python run.py

The host/port come from ``config.Config`` (the ``PORT`` environment variable
falls back to 5000), and the debugger/reloader follow ``FLASK_DEBUG``.
"""

from __future__ import annotations

from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=app.config["PORT"])
