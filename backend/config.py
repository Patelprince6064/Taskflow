"""Application configuration for the TaskFlow API.

Configuration is environment-driven so the same code runs locally and on
Render. Values are read from a ``.env`` file (see ``backend/.env.example``);
real secrets are never committed to version control.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

# Load variables from the nearest .env file (backend/.env by default).
load_dotenv()


def env_flag(name: str, default: bool = False) -> bool:
    """Parse an environment variable as a boolean.

    Accepted truthy values: 1, true, yes, on (case-insensitive).
    """
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


class Config:
    """Base configuration shared by every environment."""

    # --- Flask ---------------------------------------------------------
    DEBUG: bool = False
    TESTING: bool = False
    PORT: int = int(os.getenv("PORT", "5000"))

    # --- CORS ----------------------------------------------------------
    # The Next.js dev server is the only origin allowed to call the API.
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGINS: list[str] = [FRONTEND_URL]


class DevelopmentConfig(Config):
    """Local development: verbose errors and the auto-reloader."""

    DEBUG: bool = env_flag("FLASK_DEBUG", default=True)


class TestingConfig(Config):
    """Used by pytest - errors surface immediately, no reloader."""

    TESTING: bool = True
    DEBUG: bool = False


class ProductionConfig(Config):
    """Deployment configuration (Render)."""

    DEBUG: bool = env_flag("FLASK_DEBUG", default=False)


#: Available configurations keyed by ``FLASK_ENV``.
CONFIG_MAP: dict[str, type[Config]] = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(name: str | None = None) -> type[Config]:
    """Resolve the configuration class for the given environment.

    Args:
        name: Environment name. Falls back to the ``FLASK_ENV`` environment
            variable and then to ``development``.

    Raises:
        ValueError: If the requested environment is not defined.
    """
    env = (name or os.getenv("FLASK_ENV", "development")).strip().lower()
    if env not in CONFIG_MAP:
        supported = ", ".join(sorted(CONFIG_MAP))
        raise ValueError(f"Unknown environment '{env}'. Expected one of: {supported}")
    return CONFIG_MAP[env]
