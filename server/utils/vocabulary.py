import os
from groq import Groq

def evaluate_vocabulary(transcription, context):
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    system_message = f"""
    Context: {context}
    Script: {transcription}
    """
    user_message = """
    Evaluate the following speech based on vocabulary. Provide a short report covering:
    - Vocabulary: Assess the richness, appropriateness, and clarity of the words used.
    - Highlight if the speech uses engaging and varied language or if it is repetitive or overly simple.
    - Do not include any scores in the report.
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_message,
            },
            {
                "role": "user",
                "content": user_message,
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    print(chat_completion.choices[0].message.content)
    return chat_completion.choices[0].message.content