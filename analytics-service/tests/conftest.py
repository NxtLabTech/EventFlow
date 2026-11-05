import pytest
from app.main import _client


@pytest.fixture(autouse=True)
def clear_client_cache():
    """Ensure tests start and end with an empty MongoClient cache for test isolation."""
    _client.cache_clear()
    yield
    _client.cache_clear()
