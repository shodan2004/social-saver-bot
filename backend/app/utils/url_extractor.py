"""Utility functions for extracting data from URLs."""
import re
import requests
from typing import Dict
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)


class URLExtractor:
    """Extract content from various social media links."""

    @staticmethod
    def identify_platform(url: str) -> str:
        if "instagram.com" in url:
            return "instagram"
        elif "twitter.com" in url or "x.com" in url:
            return "twitter"
        elif any(domain in url for domain in (
            "medium.com", "dev.to", "hashnode.com", "linkedin.com"
        )):
            return "blog"
        else:
            return "other"

    # 🔥 IMPROVED INSTAGRAM EXTRACTION
    @staticmethod
    def extract_instagram_data(url: str) -> Dict:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0"
            }

            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # Extract caption
            caption = None
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                caption = og_desc.get("content")

            # Extract thumbnail
            thumbnail_url = None
            og_image = soup.find("meta", property="og:image")
            if og_image:
                thumbnail_url = og_image.get("content")

            # Extract hashtags
            hashtags = re.findall(r"#(\w+)", caption) if caption else []

            # Extract post ID
            post_id_match = re.search(r'/p/([^/?]+)', url)
            post_id = post_id_match.group(1) if post_id_match else None

            return {
                "platform": "instagram",
                "original_url": url,
                "post_id": post_id,
                "caption": caption,
                "title": None,
                "hashtags": hashtags,
                "thumbnail_url": thumbnail_url
            }

        except Exception as e:
            logger.error(f"Error extracting Instagram data: {e}")
            return {
                "platform": "instagram",
                "original_url": url,
                "caption": None,
                "title": None,
                "hashtags": [],
                "thumbnail_url": None
            }

    @staticmethod
    def extract_twitter_data(url: str) -> Dict:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0"
            }

            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            caption = None
            og_desc = soup.find("meta", property="og:description")
            if og_desc:
                caption = og_desc.get("content")

            hashtags = re.findall(r"#(\w+)", caption) if caption else []

            tweet_id_match = re.search(r'/status/(\d+)', url)
            tweet_id = tweet_id_match.group(1) if tweet_id_match else None

            return {
                "platform": "twitter",
                "original_url": url,
                "tweet_id": tweet_id,
                "caption": caption,
                "title": None,
                "hashtags": hashtags,
                "thumbnail_url": None
            }

        except Exception as e:
            logger.error(f"Error extracting Twitter data: {e}")
            return {
                "platform": "twitter",
                "original_url": url,
                "caption": None,
                "title": None,
                "hashtags": [],
                "thumbnail_url": None
            }

    @staticmethod
    def extract_article_data(url: str) -> Dict:
        try:
            headers = {
                "User-Agent": "Mozilla/5.0"
            }

            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            title = None
            title_tag = soup.find("h1") or soup.find("title")
            if title_tag:
                title = title_tag.get_text().strip()

            caption = None
            meta_desc = soup.find("meta", attrs={"name": "description"})
            if meta_desc:
                caption = meta_desc.get("content")

            thumbnail_url = None
            og_image = soup.find("meta", property="og:image")
            if og_image:
                thumbnail_url = og_image.get("content")

            hashtags = re.findall(r"#(\w+)", caption) if caption else []

            return {
                "platform": "blog",
                "original_url": url,
                "title": title,
                "caption": caption,
                "hashtags": hashtags,
                "thumbnail_url": thumbnail_url
            }

        except Exception as e:
            logger.error(f"Error extracting article data: {e}")
            return {
                "platform": "blog",
                "original_url": url,
                "title": None,
                "caption": None,
                "hashtags": [],
                "thumbnail_url": None
            }

    @classmethod
    def extract(cls, url: str) -> Dict:
        platform = cls.identify_platform(url)

        if platform == "instagram":
            return cls.extract_instagram_data(url)
        elif platform == "twitter":
            return cls.extract_twitter_data(url)
        elif platform == "blog":
            return cls.extract_article_data(url)
        else:
            return {
                "platform": "other",
                "original_url": url,
                "caption": None,
                "title": None,
                "hashtags": [],
                "thumbnail_url": None
            }