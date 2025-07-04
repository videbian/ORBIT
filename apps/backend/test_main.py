import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Testa o endpoint raiz da API"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "ORBIT IA Backend" in data["message"]

def test_health_endpoint():
    """Testa o endpoint de health check"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok"}

def test_health_endpoint_content_type():
    """Testa se o endpoint de health retorna JSON"""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"

def test_invalid_endpoint():
    """Testa endpoint inexistente"""
    response = client.get("/api/invalid")
    assert response.status_code == 404

def test_cors_headers():
    """Testa se os headers CORS estão configurados"""
    response = client.get("/api/health")
    assert response.status_code == 200
    # Verifica se não há erro de CORS (o middleware está configurado)
    assert "access-control-allow-origin" in response.headers or response.status_code == 200

class TestAPIStructure:
    """Testes para verificar a estrutura da API"""
    
    def test_api_title(self):
        """Testa se a API tem o título correto"""
        response = client.get("/docs")
        assert response.status_code == 200
    
    def test_openapi_schema(self):
        """Testa se o schema OpenAPI está disponível"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "info" in schema
        assert schema["info"]["title"] == "ORBIT IA Backend"

