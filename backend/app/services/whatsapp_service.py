"""WhatsApp/Twilio integration service."""
import os
import re
import logging
from typing import Tuple, Optional, Dict
from twilio.rest import Client
from app.utils.url_extractor import URLExtractor
from app.utils.ai_processor import AIProcessor

logger = logging.getLogger(__name__)


class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.bot_number = os.getenv("TWILIO_PHONE_NUMBER")

        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            logger.warning("Twilio credentials not configured")

    def extract_url_from_message(self, message: str) -> Optional[str]:
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, message)
        return urls[0] if urls else None

    def format_response_message(
        self,
        title: Optional[str],
        category: str,
        summary: str,
        url: str
    ) -> str:

        message = "✨ *Saved to your knowledge base!*\n\n"

        if title:
            message += f"*{title}*\n"

        message += f"📁 Category: {category}\n"
        message += f"📝 Summary: {summary}\n"
        message += f"🔗 {url}\n\n"
        message += "Go to your dashboard to organize and search your saved content! 🚀"

        return message


class WhatsAppHandler:

    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        self.url_extractor = URLExtractor()
        self.ai_processor = AIProcessor()

    def process_message(
        self,
        from_number: str,
        message_body: str
    ) -> Tuple[bool, str, Optional[Dict]]:

        try:
            url = self.whatsapp_service.extract_url_from_message(message_body)

            if not url:
                response = (
                    "❌ I didn't find a link in your message.\n\n"
                    "Please send me a link from Instagram, Twitter, or any blog."
                )
                return False, response, None

            # Remove tracking params
            url = url.split("?")[0]

            extracted_data = self.url_extractor.extract(url)

            if not extracted_data:
                return False, "⚠️ Could not extract content from this link.", None

            platform = extracted_data.get("platform")

            if platform == "other":
                return False, (
                    "⚠️ I support Instagram, Twitter, and blogs only."
                ), None

            caption = extracted_data.get("caption")
            title = extracted_data.get("title")

            # 🔥 SMART FALLBACK FOR INSTAGRAM REELS
            if not caption:
                caption = f"Analyze this Instagram content: {url}"

            # Process with AI
            category, summary = self.ai_processor.process(caption, title)

            response = self.whatsapp_service.format_response_message(
                title=title,
                category=category,
                summary=summary,
                url=url
            )

            return True, response, {
                "platform": platform,
                "original_url": url,
                "caption": caption,
                "title": title,
                "category": category,
                "summary": summary,
                "hashtags": ",".join(extracted_data.get("hashtags", [])),
                "thumbnail_url": extracted_data.get("thumbnail_url")
            }

        except Exception as e:
            logger.error(f"Error processing message: {e}")
            return False, "😅 Something went wrong. Please try again!", None