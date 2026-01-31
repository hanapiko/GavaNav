import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_passport_application():
    payload = {
        "user_profile": {
            "county": "Nairobi",
            "age": 25,
            "citizenship_status": "kenyan_citizen",
            "application_type": "first_time"
        },
        "service_request": {
            "service_category": "identity",
            "service_name": "Kenyan Passport",
            "urgency_level": "normal"
        },
        "session_context": {
            "language_preference": "en",
            "device_type": "desktop",
            "timestamp": "2023-10-27T10:00:00Z"
        }
    }
    response = client.post("/api/v1/agent", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "service_guidance" in data
    assert data["service_guidance"]["service_summary"]["service_name"] == "Kenyan Passport"
    assert data["requirements_and_eligibility"]["eligibility"]["status"] == "eligible"

def test_underage_id_application():
    # National ID requires age 18
    payload = {
        "user_profile": {
            "county": "Mombasa",
            "age": 16,
            "citizenship_status": "kenyan_citizen",
            "application_type": "first_time"
        },
        "service_request": {
            "service_category": "identity",
            "service_name": "National Identity Card",
            "urgency_level": "normal"
        },
        "session_context": {
            "language_preference": "en",
            "device_type": "mobile",
            "timestamp": "2023-10-27T10:00:00Z"
        }
    }
    response = client.post("/api/v1/agent", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["requirements_and_eligibility"]["eligibility"]["status"] == "not_eligible"
    assert any("Age" in r for r in data["requirements_and_eligibility"]["eligibility"]["reasons"])

def test_invalid_category_handled():
    # Now that we expanded Liteals, we should test if unknown categories are handled gracefully by logic
    payload = {
        "user_profile": {
            "county": "Kisumu",
            "age": 30,
            "citizenship_status": "resident",
            "application_type": "renewal"
        },
        "service_request": {
            "service_category": "unknown_cat",
            "service_name": "Non Existent Service",
            "urgency_level": "normal"
        },
        "session_context": {
            "language_preference": "en",
            "device_type": "desktop",
            "timestamp": "2023-10-27T10:00:00Z"
        }
    }
    response = client.post("/api/v1/agent", json=payload)
    # The current knowledge_checker returns 400 error if service not found
    assert response.status_code == 400
    assert "not found" in response.json()["detail"]
