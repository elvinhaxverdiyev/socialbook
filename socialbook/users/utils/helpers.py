"""
Kiçik köməkçi funksiyalar — bir neçə `apis/*_v1_apis.py` faylında təkrarlanmasın.
"""


def normalize_username(value):
    if not isinstance(value, str):
        return ""
    return value.strip().lstrip("@")
