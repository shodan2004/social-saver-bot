"""Database models for Social Saver Bot."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class SavedContent(Base):
    """Model for saved content from social media."""
    
    __tablename__ = "saved_content"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), index=True, nullable=False)
    platform = Column(String(50), nullable=False)  # instagram, twitter, blog
    original_url = Column(String(2048), nullable=False)
    caption = Column(Text, nullable=True)
    title = Column(String(1024), nullable=True)
    category = Column(String(100), nullable=True)  # Fitness, Coding, Food, Travel, etc.
    summary = Column(Text, nullable=True)
    hashtags = Column(String(1024), nullable=True)  # comma-separated
    thumbnail_url = Column(String(2048), nullable=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert model to dictionary."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "platform": self.platform,
            "original_url": self.original_url,
            "caption": self.caption,
            "title": self.title,
            "category": self.category,
            "summary": self.summary,
            "hashtags": self.hashtags,
            "thumbnail_url": self.thumbnail_url,
            "is_archived": self.is_archived,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
