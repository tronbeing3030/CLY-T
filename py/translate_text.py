from deep_translator import GoogleTranslator
from langdetect import detect


def lang_translate(text_to_translate):
    translator = GoogleTranslator(source='auto', target='en')
    translated_text = translator.translate(text_to_translate)
    return translated_text


def detect_lang(text_to_translate):
    return detect(text_to_translate)
