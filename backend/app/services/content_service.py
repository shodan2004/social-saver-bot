"""Service layer for saved content operations."""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.database import SavedContent
from app.models.schemas import CreateSavedContentSchema
import logging

logger = logging.getLogger(__name__)


class ContentService:
    """Service for managing saved content."""
    
    @staticmethod
    def create_content(db: Session, content: CreateSavedContentSchema) -> SavedContent:
        """Create a new saved content entry."""
        db_content = SavedContent(**content.dict())
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
        return db_content
    
    @staticmethod
    def get_content_by_id(db: Session, content_id: int, user_id: str) -> Optional[SavedContent]:
        """Get content by ID for a specific user."""
        return db.query(SavedContent).filter(
            and_(
                SavedContent.id == content_id,
                SavedContent.user_id == user_id
            )
        ).first()
    
    @staticmethod
    def get_user_content(
        db: Session,
        user_id: str,
        skip: int = 0,
        limit: int = 20,
        archived: bool = False
    ) -> List[SavedContent]:
        """Get all content for a user."""
        query = db.query(SavedContent).filter(
            and_(
                SavedContent.user_id == user_id,
                SavedContent.is_archived == archived
            )
        ).order_by(SavedContent.created_at.desc())
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def search_content(
        db: Session,
        user_id: str,
        query: str,
        category: Optional[str] = None,
        platform: Optional[str] = None
    ) -> List[SavedContent]:
        """Search user's content."""
        filters = [
            SavedContent.user_id == user_id,
            SavedContent.is_archived == False,
            or_(
                SavedContent.caption.ilike(f"%{query}%"),
                SavedContent.title.ilike(f"%{query}%"),
                SavedContent.summary.ilike(f"%{query}%"),
                SavedContent.hashtags.ilike(f"%{query}%")
            )
        ]
        
        if category:
            filters.append(SavedContent.category.ilike(f"%{category}%"))
        if platform:
            filters.append(SavedContent.platform == platform)
        
        return db.query(SavedContent).filter(and_(*filters)).order_by(
            SavedContent.created_at.desc()
        ).all()
    
    @staticmethod
    def update_content(
        db: Session,
        content_id: int,
        user_id: str,
        updates: dict
    ) -> Optional[SavedContent]:
        """Update content entry."""
        db_content = ContentService.get_content_by_id(db, content_id, user_id)
        if not db_content:
            return None
        
        for key, value in updates.items():
            if hasattr(db_content, key):
                setattr(db_content, key, value)
        
        db.commit()
        db.refresh(db_content)
        return db_content
    
    @staticmethod
    def delete_content(db: Session, content_id: int, user_id: str) -> bool:
        """Archive/delete content entry."""
        db_content = ContentService.get_content_by_id(db, content_id, user_id)
        if not db_content:
            return False
        
        db_content.is_archived = True
        db.commit()
        return True
    
    @staticmethod
    def get_categories(db: Session, user_id: str) -> List[str]:
        """Get all unique categories for a user."""
        results = db.query(SavedContent.category).filter(
            and_(
                SavedContent.user_id == user_id,
                SavedContent.is_archived == False,
                SavedContent.category.isnot(None)
            )
        ).distinct().all()
        
        return [r[0] for r in results if r[0]]
    
    @staticmethod
    def get_platforms(db: Session, user_id: str) -> List[str]:
        """Get all unique platforms for a user."""
        results = db.query(SavedContent.platform).filter(
            and_(
                SavedContent.user_id == user_id,
                SavedContent.is_archived == False
            )
        ).distinct().all()
        
        return [r[0] for r in results if r[0]]

    @staticmethod
    def get_users(db: Session) -> List[str]:
        """Get all unique user IDs that have saved content."""
        results = db.query(SavedContent.user_id).filter(
            SavedContent.user_id.isnot(None)
        ).distinct().all()
        return [r[0] for r in results if r[0]]
