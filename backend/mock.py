"""
A saved sample answer for development.

When MOCK_LLM=true in .env, /ask returns this instead of calling Gemini,
so styling and frontend work cost nothing. It has exactly the same shape
as a real answer, so the frontend can't tell the difference.
"""

import json

MOCK_RESULT = {
    "answer": json.dumps({
        "summary": "This is such a common question, and the short answer is that PCOS is diagnosed when two out of three key signs are present.",
        "points": [
            {
                "heading": "Irregular or missing ovulation",
                "body": "Cycles that are very long, unpredictable, or missing altogether can be a sign that your body isn't ovulating regularly. This is one of the three signs doctors look for."
            },
            {
                "heading": "Signs of higher androgens",
                "body": "Androgens are hormones that can cause things like acne, extra hair growth, or hair thinning. Your doctor can look for these signs or check your levels with a blood test."
            },
            {
                "heading": "Ovaries on ultrasound or AMH",
                "body": "An ultrasound can show many small follicles on your ovaries. For adults, a blood test for a hormone called AMH can sometimes be used instead."
            },
            {
                "heading": "Ruling out other causes",
                "body": "Before diagnosing PCOS, your doctor will check that something else, like a thyroid condition, isn't causing your symptoms."
            }
        ],
        "closing": "Your healthcare provider can look at your full picture and help you understand what these signs mean for you."
    }),
    "sources": ["Sample answer — MOCK_LLM is on, no Gemini call was made"],
}