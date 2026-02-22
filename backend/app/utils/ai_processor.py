"""AI processing using Hugging Face Inference API (Stable Version)."""

import os
import requests
import re
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class AIProcessor:

    CATEGORIES = [
        "Fitness",
        "Coding",
        "Food",
        "Travel",
        "Design",
        "Business",
        "Education",
        "Entertainment",
        "Health",
        "Productivity",
        "Other"
    ]

    def __init__(self):
        self.api_token = os.getenv("HF_API_TOKEN")

        # Router endpoint compatible with OpenAI-style chat completions.
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.model = os.getenv("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct")

    def process(self, caption: Optional[str], title: Optional[str]) -> Tuple[str, str]:

        if not self.api_token:
            return "Other", "HF API not configured"

        text = f"{title or ''}\n{caption or ''}".strip()

        if not text:
            text = "Social media content."

        prompt = (
            "Classify the following content into ONE category from this list:\n"
            f"{', '.join(self.CATEGORIES)}\n\n"
            "Then write a short one sentence summary.\n\n"
            f"Content:\n{text}\n\n"
            "Respond exactly like this:\n"
            "Category: <category>\n"
            "Summary: <summary>"
        )

        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a strict formatter. Output only two lines: "
                        "'Category: ...' and 'Summary: ...'."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 120,
            "temperature": 0.3,
            "stream": False,
        }

        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=60
            )

            logger.debug("HF status: %s", response.status_code)

            if response.status_code != 200:
                logger.warning(
                    "HF returned non-200 status=%s body=%s",
                    response.status_code,
                    response.text[:300],
                )
                return "Other", "AI service unavailable"

            result = response.json()

            choices = result.get("choices") if isinstance(result, dict) else None
            if not choices:
                return "Other", "AI response invalid"
            message = choices[0].get("message", {})
            output = (message.get("content") or "").strip()
            if not output:
                return "Other", "AI response invalid"

            category = "Other"
            summary = "Unable to generate summary"

            for line in output.split("\n"):
                if line.lower().startswith("category:"):
                    category = line.split(":", 1)[1].strip()
                if line.lower().startswith("summary:"):
                    summary = line.split(":", 1)[1].strip()

            # Be resilient if the model drifts from the exact format.
            if summary == "Unable to generate summary":
                line_candidates = [ln.strip() for ln in output.splitlines() if ln.strip()]
                if line_candidates:
                    summary = line_candidates[-1]

            # Normalize category spelling/casing and map unknowns to Other.
            normalized = None
            for c in self.CATEGORIES:
                if category.lower() == c.lower():
                    normalized = c
                    break
            if not normalized:
                match = re.search(r"(fitness|coding|food|travel|design|business|education|entertainment|health|productivity|other)", category.lower())
                if match:
                    token = match.group(1)
                    normalized = next((c for c in self.CATEGORIES if c.lower() == token), "Other")
            category = normalized or "Other"

            if category not in self.CATEGORIES:
                category = "Other"

            return category, summary

        except Exception as e:
            logger.error(f"HuggingFace AI error: {e}")
            return "Other", "Unable to generate summary"
