"""Health and status endpoints."""
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["status"])


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Social Saver Bot Backend",
        "version": "1.0.0"
    }


@router.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Social Saver Bot API",
        "version": "1.0.0",
        "docs": "/docs"
    }
