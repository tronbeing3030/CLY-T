from PIL import Image
import os
import json
import base64
import re
from typing import List, Dict, Any, Optional

try:
    import google.generativeai as genai
except Exception:
    genai = None

try:
    INFO_IMG = Image.open("./static/images/clyst.png").info
except Exception:
    INFO_IMG = None


def generate_copy_suggestions(content_type: str, prompt: str = '', description: str = '',
                              image_url: str = '', image_base64: str = '', image_mime: str = '',
                              api_key: str = None) -> Dict[str, Any]:
    """
    Simpler Gemini-backed generator:
    - Accepts either `image_base64` (preferred) or `image_url` (used as context only).
    - Requests a strict JSON response from the model and returns a list of 3 suggestions.
    - Falls back to deterministic templates when Gemini is not available.
    """
    try:
        content_type = (content_type or '').lower()
        prompt = (prompt or '').strip()
        description = (description or '').strip()
        image_url = (image_url or '').strip()
        image_present = bool(image_url or image_base64)

        if not image_present:
            return {'ok': False, 'error': 'Image is required (base64 string or URL) to generate suggestions.'}

        # Use Gemini when configured
        if genai and api_key and api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-2.5-flash")

                instruction = (
                    "You are a product-copy assistant. Return EXACTLY one JSON object with key `suggestions` "
                    "whose value is an array of 3 objects with keys `title` and `description`. "
                    "Titles should be 3-5 words claiming the product name, descriptions 5-6 lines, "
                    "with each sentence having 16-18 words, no extra spaces or tabs. Return ONLY JSON."
                )

                parts: List[Any] = []
                if image_base64:
                    # decode base64 into raw bytes and send as a blob-like dict the SDK understands
                    try:
                        img_bytes = base64.b64decode(image_base64)
                        parts.append({"mime_type": image_mime or "image/jpeg", "data": img_bytes})
                    except Exception:
                        # fall back to sending base64 as context if decoding fails
                        instruction += "\n(Note: image provided as base64 but decoding failed.)"
                elif image_url:
                    # include the URL in the prompt so model can use it as context
                    instruction += f"\nImage URL: {image_url}"

                if prompt:
                    instruction += f"\nTitle prompt: {prompt}"
                if description:
                    instruction += f"\nContext: {description}"

                parts.append({"text": instruction})

                # Ask for JSON output via generation config where supported
                response = model.generate_content(parts, generation_config={"temperature": 0.7,
                                                                            "response_mime_type": "application/json"})

                # Extract text from response
                text = getattr(response, 'text', '') or ''
                if not text:
                    try:
                        text = '\n'.join([c.text for c in getattr(response, 'candidates', []) if hasattr(c, 'text')])
                    except Exception:
                        text = str(response)

                # Isolate JSON blob and parse
                if '{' in text and '}' in text:
                    json_blob = text[text.find('{'): text.rfind('}') + 1]
                else:
                    json_blob = text

                parsed = json.loads(json_blob)
                raw_suggestions = parsed.get('suggestions') or []
                suggestions: List[Dict[str, str]] = []
                for item in raw_suggestions[:3]:
                    t = (item.get('title') or '').strip()
                    d = (item.get('description') or '').strip()
                    if t and d:
                        suggestions.append({'title': t, 'description': d})

                if not suggestions:
                    return {'ok': False, 'error': 'Model returned no valid suggestions.'}

                return {'ok': True, 'suggestions': suggestions}
            except Exception as e:
                return {'ok': False, 'error': f'Gemini error: {e}'}

        # Simple deterministic fallback when Gemini is not available
        base_context = (prompt or description or 'AI not available').strip() or 'Craft'
        is_product = content_type == 'product'
        titles = [
            f"{base_context.capitalize()}",
            f"{base_context.capitalize()}",
            f"{base_context.capitalize()}"
        ]
        descriptions = [
            "Please try again later or try manually enterring the fields",
            "Original work. Premium materials, gallery-ready finish.",
            "Expressive composition. Ships safely, ready to display."
        ] if is_product else [
            "An exploration through texture, light, and color.",
            "Captures movement and mood with layered technique.",
            "A contemplative blend of technique and emotion."
        ]
        suggestions = [{'title': titles[i], 'description': descriptions[i]} for i in range(3)]
        return {'ok': True, 'suggestions': suggestions}

    except Exception as e:
        return {'ok': False, 'error': str(e)}
