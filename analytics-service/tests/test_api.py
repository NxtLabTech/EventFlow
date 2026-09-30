import logging
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


def test_analytics_database_error_returns_503(caplog):
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

    # The original error is logged on the server
    [record] = [r for r in caplog.records if r.name == "app.main"]
    assert record.levelno == logging.ERROR
    assert isinstance(record.exc_info[1], PyMongoError)
    assert "boom" in caplog.text


def test_analytics_without_database_config_returns_503(monkeypatch, caplog):
    monkeypatch.delenv("MONGODB_URI", raising=False)
    res = TestClient(app).get("/analytics/events")
    assert res.status_code == 503
    assert res.json() == {"detail": "Database not configured"}

    [record] = [r for r in caplog.records if r.name == "app.main"]
    assert record.levelno == logging.ERROR
    assert "MONGODB_URI is not set" in caplog.text


def test_database_error_does_not_expose_connection_string(monkeypatch, caplog):
    # A URI without a database name makes get_default_database() fail
    uri = "mongodb://admin:s3cret@db.internal:27017"
    monkeypatch.setenv("MONGODB_URI", uri)
    _client.cache_clear()
    try:
        res = TestClient(app).get("/analytics/events")
    finally:
        _client.cache_clear()
    assert res.status_code == 503
    assert res.json() == {"detail": "Database not configured"}
    assert "s3cret" not in res.text
    assert "db.internal" not in res.text
    assert any(r.name == "app.main" and r.exc_info for r in caplog.records)
