from transformers import pipeline

class NLPService:
    def __init__(self):
        self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        self.candidate_labels = [
            "Sanitation and Waste Management", 
            "Roads and Infrastructure", 
            "Public Safety", 
            "Health and Hygiene", 
            "Electricity and Water"
        ]

    def classify_grievance(self, text: str):
        result = self.classifier(text, self.candidate_labels)
        
        top_category = result['labels'][0]
        top_score = round(result['scores'][0], 4)

        if top_score < 0.30:
            final_category = "General Inquiry"
        else:
            final_category = top_category

        return {
            "category": final_category,
            "confidence": top_score
        }