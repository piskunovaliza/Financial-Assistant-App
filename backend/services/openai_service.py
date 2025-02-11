import openai
from config import Config

client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)

def get_financial_advice(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor."},
                {"role": "user", "content": prompt}
            ]
        )
        advice = response.choices[0].message.content.strip()
        return advice
    except Exception as e:
        return f"Error obtaining advice: {str(e)}"