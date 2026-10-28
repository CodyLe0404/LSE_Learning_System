from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.dependencies import get_project_service
from app.core.exceptions import ServiceError
from app.models.schemas import ChangePasswordRequest, LoginRequest, CommonCondition
from app.services.project_service import ProjectService

router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/testconnection")
def test_connection(service: ProjectService = Depends(get_project_service)) -> dict[str, str]:
    try:
        service.get_project_details()
        return {"status": "success", "message": "Connected to SQL Server Express successfully!"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(exc)}") from exc


@router.post("/Common/Login")
def login(request: LoginRequest, service: ProjectService = Depends(get_project_service)) -> dict[str, object]:
    try:
        return service.login(request.userId, request.password)
    except ServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.post("/changeuserpw")
def change_user_password(request: ChangePasswordRequest, service: ProjectService = Depends(get_project_service)) -> dict[str, object]:
    try:
        return service.change_user_password(request.userId, request.currentPassword, request.newPassword)
    except ServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.get("/dashboard/itemmissing")
def get_item_missing_assignee(service: ProjectService = Depends(get_project_service)) -> list:
    return service.get_item_missing_data()


@router.post("/lms/commondata")
def get_item_missing_assignee(payload: CommonCondition, service: ProjectService = Depends(get_project_service)):
    return service.get_common_data(payload)


