import re

def clean_chat_text(raw_text: str):
    # Remove timestamps or labels like [10:45 PM], "You:", etc.
    lines = raw_text.splitlines()
    clean_lines = []
    for line in lines:
        if not line.strip():
            continue
        line = re.sub(r'\[\d{1,2}:\d{2}(?:\s?[APMapm]{2})?\]', '', line)  # removes timestamps
        line = re.sub(r'^\w+:', '', line)  # removes "You:", "Her:", etc.
        clean_lines.append(line.strip())
    return " ".join(clean_lines)
