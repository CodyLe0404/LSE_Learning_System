from __future__ import annotations

from datetime import date, datetime
from typing import Any, Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    ldapName: str
    userId: str
    password: str


class ChangePasswordRequest(BaseModel):
    userId: str
    currentPassword: str
    newPassword: str


class UserInfo(BaseModel):
    userId: str
    displayName: str
    email: str
    userConfig: list[str]


class LoginResponse(BaseModel):
    message: str
    setUserInfoStatus: int
    user: UserInfo | None = None


class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Any | None = None


class CommonCondition(BaseModel):
    userId: str
    condition: str


