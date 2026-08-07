import json
import os
import re
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env / backend/.env at startup
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

def determine_season(date_str: str) -> str:
    """Extract month from YYYY-MM-DD string and return corresponding season."""
    try:
        parts = date_str.split('-')
        month = int(parts[1])
        if month in (12, 1, 2):
            return "winter"
        elif month in (3, 4, 5):
            return "spring"
        elif month in (6, 7, 8):
            return "summer"
        else:
            return "autumn"
    except (IndexError, ValueError):
        return "spring"

def build_poem_prompt(date: str, title: str, context: Optional[str] = None) -> str:
    """Build the system/user prompt sent to Gemini API for generating a 2-sentence poem note."""
    season = determine_season(date)
    ctx_str = f" Context/detail: {context}." if context else ""
    return (
        f"You are a poetic calendar companion creating warm, gentle 2-sentence poem notes for personal milestones.\n"
        f"Date: {date} (Season: {season})\n"
        f"Milestone Title: {title}.{ctx_str}\n\n"
        f"Instructions:\n"
        f"1. Write exactly 2 warm, poetic sentences connecting this personal milestone with the feeling of the {season} season.\n"
        f"2. Return ONLY a JSON object in this exact schema:\n"
        f"{{\"poemNote\": \"<2 warm sentences>\", \"season\": \"{season}\"}}\n"
    )

def parse_poem_response(raw_text: str, default_season: str = "spring") -> Dict[str, Any]:
    """Parse raw LLM output text into structured JSON dictionary."""
    try:
        # Clean potential markdown code blocks
        cleaned = re.sub(r'^```(json)?\s*', '', raw_text.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r'```$', '', cleaned.strip(), flags=re.MULTILINE)
        data = json.loads(cleaned)
        if isinstance(data, dict) and "poemNote" in data:
            return {
                "poemNote": str(data["poemNote"]),
                "season": data.get("season", default_season)
            }
    except Exception:
        pass
    
    return {
        "poemNote": "A special day held in quiet warmth, shining softly through the turning year.",
        "season": default_season
    }

def generate_poem_note(date: str, title: str, context: Optional[str] = None) -> Dict[str, Any]:
    """Generate poem note using Gemini API if available, falling back gracefully on error/unconfigured key."""
    season = determine_season(date)
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        return {
            "poemNote": f"As {season}'s gentle light surrounds {title}, this day stands as a warm ember in your year.",
            "season": season
        }
    
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        prompt = build_poem_prompt(date, title, context)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        if response and response.text:
            return parse_poem_response(response.text, default_season=season)
    except Exception:
        pass

    return {
        "poemNote": f"As {season}'s gentle light surrounds {title}, this day stands as a warm ember in your year.",
        "season": season
    }
