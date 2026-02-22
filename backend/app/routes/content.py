"""Content API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from app.models.schemas import (
    SavedContentSchema,
    CreateSavedContentSchema,
    SearchRequestSchema
)
from app.services.content_service import ContentService
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/users", response_model=List[str])
async def get_users(db: Session = Depends(get_db)):
    """Get all user IDs that currently have saved content."""
    try:
        return ContentService.get_users(db)
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch users")


@router.post("/", response_model=SavedContentSchema)
async def create_content(
    content: CreateSavedContentSchema,
    db: Session = Depends(get_db)
):
    """Create a new saved content entry."""
    try:
        return ContentService.create_content(db, content)
    except Exception as e:
        logger.error(f"Error creating content: {e}")
        raise HTTPException(status_code=500, detail="Failed to create content")


@router.get("/{user_id}/all", response_model=List[SavedContentSchema])
async def get_user_content(
    user_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all saved content for a user."""
    try:
        return ContentService.get_user_content(db, user_id, skip, limit, False)
    except Exception as e:
        logger.error(f"Error fetching user content: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch content")


@router.get("/{user_id}/search", response_model=List[SavedContentSchema])
async def search_content(
    user_id: str,
    q: str = Query(..., min_length=1),
    category: str = Query(None),
    platform: str = Query(None),
    db: Session = Depends(get_db)
):
    """Search user's saved content."""
    try:
        return ContentService.search_content(db, user_id, q, category, platform)
    except Exception as e:
        logger.error(f"Error searching content: {e}")
        raise HTTPException(status_code=500, detail="Failed to search content")


@router.get("/{user_id}/{content_id}", response_model=SavedContentSchema)
async def get_content(
    user_id: str,
    content_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific content by ID."""
    try:
        content = ContentService.get_content_by_id(db, content_id, user_id)
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        return content
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching content: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch content")


@router.put("/{user_id}/{content_id}", response_model=SavedContentSchema)
async def update_content(
    user_id: str,
    content_id: int,
    updates: dict,
    db: Session = Depends(get_db)
):
    """Update a content entry."""
    try:
        content = ContentService.update_content(db, content_id, user_id, updates)
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        return content
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating content: {e}")
        raise HTTPException(status_code=500, detail="Failed to update content")


@router.delete("/{user_id}/{content_id}")
async def delete_content(
    user_id: str,
    content_id: int,
    db: Session = Depends(get_db)
):
    """Archive a content entry."""
    try:
        success = ContentService.delete_content(db, content_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Content not found")
        return {"status": "archived"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting content: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete content")


@router.get("/{user_id}/filters/categories", response_model=List[str])
async def get_categories(user_id: str, db: Session = Depends(get_db)):
    """Get all categories for a user."""
    try:
        return ContentService.get_categories(db, user_id)
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")


@router.get("/{user_id}/filters/platforms", response_model=List[str])
async def get_platforms(user_id: str, db: Session = Depends(get_db)):
    """Get all platforms for a user."""
    try:
        return ContentService.get_platforms(db, user_id)
    except Exception as e:
        logger.error(f"Error fetching platforms: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch platforms")
