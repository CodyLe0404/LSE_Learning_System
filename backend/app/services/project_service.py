from __future__ import annotations

from datetime import datetime
from typing import Any

from app.core.exceptions import ServiceError
from app.core.middleware import log_daily
from app.repositories.project_repository import ProjectRepository
from app.utils.security import decrypt_password, encrypt_password
from app.services.User_Permission.user_permission_builder import UserPermissionBuilder

class ProjectService:
    def __init__(self, repository: ProjectRepository) -> None:
        self.repository = repository

    def get_project_details(self) -> list[dict[str, Any]]:
        return self.repository.get_project_details()

    def login(self, user_id: str, password: str) -> dict[str, Any]:
        encrypted_password = encrypt_password(password)
        user = self.repository.check_login(user_id, encrypted_password)
        if user is None:
            log_daily(f"[{user_id}] Login | Failed")
            raise ServiceError("Invalid username or password", status_code=401)
        
        log_daily(f"[{user_id}] Login | Successful")
        return {"message": "Login successful", "setUserInfoStatus": 0, "user": user}

    def change_user_password(self, user_id: str, current_password: str, new_password: str) -> dict[str, Any]:
        current_pw = encrypt_password(current_password)
        new_pw = encrypt_password(new_password)
        status, message = self.repository.change_user_password(user_id, current_pw, new_pw)
        if status == 1:
            log_daily(f"[{user_id}] Change Password | Successfully changed password")
            return {"status": status, "message": message}
        
        log_daily(f"[{user_id}] Change Password | Failed to change password: {message}")
        raise ServiceError(message, status_code=400)

    def get_item_missing_data(self)-> list[dict[str, Any]]:
            raw_data = self.repository.get_item_data_missing()
            return raw_data
        
    def get_common_data(self, payload: Any)-> list[dict[str, Any]]:
        if payload.condition == 'Permission_Access':
            raw_data = self.repository.get_data_common(payload.condition)
            builder = UserPermissionBuilder()
            data_built = builder.build_user_permissions(raw_data)
            return data_built
        
        elif payload.condition == 'All_permission':
            raw_data = self.repository.get_data_common(payload.condition)
            builder = UserPermissionBuilder()
            data_built = builder.build_permissions_list(raw_data)
            return data_built  
          
        else:
            raw_data = self.repository.get_data_common(payload.condition)
        return raw_data
    
    