from fastapi import APIRouter, Request, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
from app.services.whatsapp_service import WhatsAppHandler
from app.services.content_service import ContentService
from twilio.twiml.messaging_response import MessagingResponse
import logging
import traceback

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])

whatsapp_handler = WhatsAppHandler()


@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):

    try:
        form_data = await request.form()
        from_number = form_data.get("From", "").replace("whatsapp:", "")
        body = form_data.get("Body", "")

        success, response_text, extracted_data = (
            whatsapp_handler.process_message(from_number, body)
        )

        if success and extracted_data:
            extracted_data["user_id"] = from_number

            from app.models.schemas import CreateSavedContentSchema
            content_schema = CreateSavedContentSchema(**extracted_data)
            ContentService.create_content(db, content_schema)

        twiml = MessagingResponse()
        twiml.message(response_text)

        return Response(
            content=str(twiml),
            media_type="application/xml"
        )

    except Exception:
        logger.error("🔥 FULL ERROR TRACE BELOW:")
        traceback.print_exc()

        twiml = MessagingResponse()
        twiml.message("😅 Something went wrong. Please try again!")

        return Response(
            content=str(twiml),
            media_type="application/xml"
        )