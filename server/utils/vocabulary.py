import os
from groq import Groq

def evaluate_vocabulary(transcription, context):
    """
    Evaluates the vocabulary and relevance of a speech.

    Args:
        transcription (str): The transcribed text of the speech.
        context (str): The context or script provided by the user.

    Returns:
        str: A report evaluating the vocabulary and relevance of the speech.
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    system_message = f"""
    Title: The Power of Change
    Context: {context}
    Script: {transcription}
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_message,
            },
            {
                "role": "user",
                "content": "Evaluate the following speech based on vocabulary and relevance. Provide a short report covering: Vocabulary: Assess the richness, appropriateness, and clarity of the words used. Highlight if the speech uses engaging and varied language or if it is repetitive or overly simple. Relevance: Evaluate how well the speech aligns with the intended purpose and audience. Comment on the coherence of the message and whether it effectively achieves its goal of inspiring and motivating the audience. Overall Score: Provide a score out of 100, giving equal weight (50% each) to vocabulary and relevance.",
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    return chat_completion.choices[0].message.content