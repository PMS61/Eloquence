import os

from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)
system_message = "Title:The Power of ChangeContext:The speaker is addressing a group of professionals and students at a community event focused on personal growth and career development. The aim is to inspire the audience to embrace change as a pathway to growth and success.Script:Good evening, everyone. Before we dive in, let me ask you a question: How many of you have ever felt afraid of change? Maybe it was switching careers, moving to a new city, or even trying something as simple as a new hobby. Show of hands? Now, let me ask another question: How many of you have experienced something wonderful because of a change you didn’t expect? Something that started as scary but turned out to be one of the best decisions of your life?See, change is one of the few constants in life, yet it’s something we often resist. Why? Because it’s uncomfortable. It challenges us to grow, to adapt, and to let go of what’s familiar. But tonight, I want to talk about why change is not something to fear—it’s something to embrace.Let me share a quick story. A few years ago, I was stuck in a job that felt safe but unfulfilling. Every day felt the same, like I was going through the motions without any real purpose. And then, one day, I got laid off. At first, I was devastated. I thought, “What now? How will I move forward?” But that unexpected change forced me to reevaluate my goals. It gave me the push I needed to explore a completely different career path—one I’d always been curious about but too scared to try. Today, I’m standing here because of that change. What felt like a setback turned out to be the best thing that ever happened to me.Now, I know not every change feels positive at first. Sometimes, it’s hard. It’s messy. But I want you to remember this: Every challenge, every change, is an opportunity to learn something new. To discover strengths you didn’t know you had. To create a version of yourself that’s stronger, braver, and more resilient.So how do we embrace change? First, shift your mindset. Instead of asking, “Why is this happening to me?” ask, “What can I learn from this?” Second, take small steps. Big changes can feel overwhelming, but small, consistent actions build momentum. And third, build a support system. Surround yourself with people who encourage you to grow and who remind you of your potential, I’ll leave you with this thought: Change is not the enemy of stability; it’s the birthplace of possibility. The next time you face a moment of uncertainty, don’t shy away from it. Lean into it. Because just beyond that discomfort lies growth, opportunity, and perhaps even a version of yourself you’ll be proud to meet.Thank you."
chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": system_message,
        },
        {
            "role": "user",
            "content": "Evaluate the following speech based on vocabulary and relevance. Provide a short report covering:Vocabulary: Assess the richness, appropriateness, and clarity of the words used. Highlight if the speech uses engaging and varied language or if it is repetitive or overly simple.Relevance: Evaluate how well the speech aligns with the intended purpose and audience. Comment on the coherence of the message and whether it effectively achieves its goal of inspiring and motivating the audience.verall Score: Provide a score out of 100, giving equal weight (50% each) to vocabulary and relevance.",
        }
    ],
    model="llama-3.3-70b-versatile",
)

print(chat_completion.choices[0].message.content)