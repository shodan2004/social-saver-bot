"""Pydantic schemas for request/response validation."""
from typing import Optional, List
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime


class CreateSavedContentSchema(BaseModel):
    """Schema for creating saved content."""
    user_id: str
    platform: str  # instagram, twitter, blog
    original_url: str
    caption: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    summary: Optional[str] = None
    hashtags: Optional[str] = None
    thumbnail_url: Optional[str] = None


class SavedContentSchema(CreateSavedContentSchema):
    """Schema for saved content response."""
    id: int
    is_archived: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WhatsAppMessageSchema(BaseModel):
    """Schema for incoming WhatsApp messages."""
    From: str
    Body: str
    MediaUrl0: Optional[str] = None


class LinkExtractionSchema(BaseModel):
    """Schema for extracted link data."""
    url: str
    platform: str
    caption: Optional[str] = None
    title: Optional[str] = None
    hashtags: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None


class SearchRequestSchema(BaseModel):
    """Schema for search requests."""
    query: str
    user_id: str
    category: Optional[str] = None
    platform: Optional[str] = None


class SearchResultSchema(BaseModel):
    """Schema for search results."""
    total: int
    items: List[SavedContentSchema]
