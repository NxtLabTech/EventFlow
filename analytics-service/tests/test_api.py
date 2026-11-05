from datetime import datetime, timedelta, timezone

import mongomock
import pytest
from fastapi.testclient import TestClient
from pymongo.errors import PyMongoError

from app.main import _client, app, get_db


@pytest.fixture
def db():
    database = mongomock.MongoClient().eventflow
    app.dependency_overrides[get_db] = lambda: database
    yield database
    app.dependency_overrides.clear()


@pytest.fixture
def client(db):
    return TestClient(app)


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_analytics_empty(client):
    res = client.get("/analytics/events")
    assert res.status_code == 200
    assert res.json() == {"totalEvents": 0, "totalRegistrations": 0, "upcomingEvents": 0}


def test_analytics_counts(client, db):
    now = datetime.now(timezone.utc)
    db.events.insert_many(
        [
            {"title": "past", "date": now - timedelta(days=10)},
            {"title": "future 1", "date": now + timedelta(days=5)},
            {"title": "future 2", "date": now + timedelta(days=30)},
        ]
    )
    db.registrations.insert_many([{"email": "a@x.com"}, {"email": "b@x.com"}])

    res = client.get("/analytics/events")
    assert res.status_code == 200
    assert res.json() == {"totalEvents": 3, "totalRegistrations": 2, "upcomingEvents": 2}


def test_analytics_database_error_returns_503():
    class BrokenDb:
        def __getitem__(self, name):
            raise PyMongoError("boom")

    app.dependency_overrides[get_db] = lambda: BrokenDb()
    try:
        res = TestClient(app).get("/analytics/events")
    finally:
        app.dependency_overrides.clear()
    assert res.status_code == 503
    assert res.json() == {"detail": "Database unavailable"}


def test_analytics_without_database_config_returns_503(monkeypatch):
    monkeypatch.delenv("MONGODB_URI", raising=False)
    res = TestClient(app).get("/analytics/events")
    assert res.status_code == 503
    assert res.json() == {"detail": "Database not configured"}


def test_client_cache_is_isolated_before_test():
    """Verify that tests start with an empty _client cache."""
    assert _client.cache_info().currsize == 0


def test_client_cache_cleared_after_populating(monkeypatch):
    """Verify that populating the cache within a test leaves the cache isolated for subsequent tests."""
    monkeypatch.setenv("MONGODB_URI", "mongodb://localhost:27017/eventflow")
    client_instance = _client()
    assert client_instance is not None
    assert _client.cache_info().currsize == 1


def test_cache_is_clean_after_populated_test():
    """Verify that the cache was reset by the fixture after the previous test populated it."""
    assert _client.cache_info().currsize == 0


def test_client_cache_isolation_on_unconfigured_database(monkeypatch):
    """Verify that a populated client cache does not leak into tests expecting unconfigured database."""
    # Pre-populate the cache with a dummy connection string
    monkeypatch.setenv("MONGODB_URI", "mongodb://localhost:27017/eventflow")
    _client()
    assert _client.cache_info().currsize == 1

    # Clear cache as done between tests, and verify unconfigured error path is reached
    _client.cache_clear()
    monkeypatch.delenv("MONGODB_URI", raising=False)
    res = TestClient(app).get("/analytics/events")
    assert res.status_code == 503
    assert res.json() == {"detail": "Database not configured"}

