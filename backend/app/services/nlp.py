import re
from transformers import pipeline

URGENCY_RULES = [
    {"label": "death/fatality",      "pattern": r"\b(death|deaths|dead|died|fatal|fatality|killed)\b", "boost": 40, "floor": 85},
    {"label": "fire/explosion",      "pattern": r"\b(fire|blast|explosion|explode|burst|burning|flames?)\b", "boost": 25, "floor": 70},
    {"label": "trapped/collapse",    "pattern": r"\b(trapped|buried|collapse|collapsed|pinned|stuck under)\b", "boost": 20, "floor": 70},
    {"label": "gas leak",            "pattern": r"\b(gas leak|gas pipe|lpg|cylinder leak)\b", "boost": 30, "floor": 75},
    {"label": "unconscious/injured", "pattern": r"\b(unconscious|injured|bleeding|admitted|vomiting|poisoning)\b", "boost": 20, "floor": 65},
    {"label": "live wire",           "pattern": r"\b(live wire|electric wire|electrocuted|short circuit)\b", "boost": 25, "floor": 70},
    {"label": "children/vulnerable", "pattern": r"\b(child|children|infant|baby|elderly|pregnant)\b", "boost": 10, "floor": 0},
    {"label": "sick/contamination", "pattern": r"\b(falling sick|residents sick|people sick|contaminated|contamination|drinking water|water contamination|food poisoning)\b", "boost": 20, "floor": 55},
    {"label": "flooding/drowning",   "pattern": r"\b(flood|flooded|flooding|drowning|drowned|waterlogged|submerged|overflow)\b", "boost": 15, "floor": 50},
    {"label": "road accident",       "pattern": r"\b(accident|collision|crash|hit and run|vehicle overturned|fell into|fell in)\b", "boost": 20, "floor": 60},
    {"label": "missing person",      "pattern": r"\b(missing|kidnapped|abducted|child missing|person missing|gone missing)\b", "boost": 25, "floor": 70},
    {"label": "violence/crime",      "pattern": r"\b(assault|attack|stabbed|shot|robbery|theft|harassment|molested|rape|murder)\b", "boost": 35, "floor": 80},
    {"label": "structural danger",   "pattern": r"\b(cracked wall|broken bridge|damaged bridge|unstable|about to fall|leaning building|sinking road)\b", "boost": 20, "floor": 65},
    {"label": "animal danger",       "pattern": r"\b(stray dog|dog bite|snake|wild animal|rabies|attacked by dog|bitten)\b", "boost": 15, "floor": 50},
    {"label": "panic/crowd",         "pattern": r"\b(panic|stampede|mob|riot|crowd gathering|people running|chaos)\b", "boost": 15, "floor": 55},
    {"label": "no water supply",     "pattern": r"\b(no water|water supply cut|water shortage|no drinking water|dry tap|borewell dry)\b", "boost": 10, "floor": 45},
    {"label": "power outage",        "pattern": r"\b(no power|power cut|power outage|blackout|no electricity|transformer blown)\b", "boost": 10, "floor": 40},
    {"label": "sewage/sanitation",   "pattern": r"\b(sewage|sewer|manhole|open drain|drainage blocked|foul smell|stench|garbage dump)\b", "boost": 10, "floor": 40},
    {"label": "smoke/toxic",         "pattern": r"\b(smoke|toxic|fumes|chemical|hazardous|gas cloud|suffocating|breathing difficulty)\b", "boost": 20, "floor": 60},
]

CATEGORY_FLOORS = {
    "Public Safety": 60,
    "Health and Hygiene": 45,
}

def compute_urgency(text: str, category: str) -> dict:
    score = 30  # baseline
    floor = CATEGORY_FLOORS.get(category, 0)
    triggered = []

    for rule in URGENCY_RULES:
        if re.search(rule["pattern"], text, re.IGNORECASE):
            score += rule["boost"]
            triggered.append(rule["label"])
            if rule["floor"] > floor:
                floor = rule["floor"]

    # bonus for multiple hazard types
    if len(triggered) >= 3:
        score += 15
        triggered.append("multi-hazard bonus")

    # apply floor if needed
    if score < floor:
        score = floor

    return {
        "urgency_score": round(min(score, 98) / 100, 4),
        "urgency_pct": min(score, 98),
        "urgency_level": (
            "Critical" if score >= 80 else
            "High"     if score >= 60 else
            "Medium"   if score >= 40 else
            "Low"
        ),
        "triggered_rules": triggered,
    }


class NLPService:
    def __init__(self):
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
        self.candidate_labels = [
            "Sanitation and Waste Management",
            "Roads and Infrastructure",
            "Public Safety",
            "Health and Hygiene",
            "Electricity and Water",
        ]

    def classify_grievance(self, text: str) -> dict:
        result = self.classifier(text, self.candidate_labels)

        top_category = result["labels"][0]
        top_score = round(result["scores"][0], 4)
        final_category = "General Inquiry" if top_score < 0.30 else top_category

        urgency = compute_urgency(text, final_category)

        return {
            "category": final_category,
            "confidence": top_score,          # classification confidence (BART)
            "urgency_score": urgency["urgency_score"],
            "urgency_pct": urgency["urgency_pct"],
            "urgency_level": urgency["urgency_level"],
            "triggered_rules": urgency["triggered_rules"],
        }