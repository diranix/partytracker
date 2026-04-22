from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    username: str = Field(min_length=2, max_length=30)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

    @field_validator("username")
    @classmethod
    def username_alphanum(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Username cannot be blank")
        if not all(c.isalnum() or c in ("_", "-") for c in stripped):
            raise ValueError("Username may only contain letters, numbers, _ and -")
        return stripped


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=2, max_length=30)
    bio: Optional[str] = Field(default=None, max_length=160)
    location: Optional[str] = Field(default=None, max_length=80)

    @field_validator("username")
    @classmethod
    def username_alphanum(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if not all(c.isalnum() or c in ("_", "-") for c in stripped):
            raise ValueError("Username may only contain letters, numbers, _ and -")
        return stripped


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    bio: Optional[str] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: str
    user: UserResponse
