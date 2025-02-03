exports.handler = async (event) => {
  const fetch = (await import("node-fetch")).default;

  const { topic, difficulty } = JSON.parse(event.body);
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const summaryPrompt = `Generate a ${difficulty}-level summary on ${topic}.
    Focus on core concepts. Use bullet points. Limit to 150 words.`;

  const quizPrompt = `Generate 10 multiple-choice questions on ${topic} at ${difficulty} level.
    Format each as:
    Question: [question]
    A) [option1]
    B) [option2]
    C) [option3]
    Answer: [correct letter]`;

  const flashcardsPrompt = `Generate 10 key terms with definitions for ${topic}.
    Format each as: Term: [term] | Definition: [definition].`;

  try {
    const [summary, quiz, flashcards] = await Promise.all([
      callGeminiAPI(summaryPrompt, GEMINI_API_KEY, fetch),
      callGeminiAPI(quizPrompt, GEMINI_API_KEY, fetch),
      callGeminiAPI(flashcardsPrompt, GEMINI_API_KEY, fetch)
    ]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ summary, quiz, flashcards })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

async function callGeminiAPI(prompt, apiKey, fetch) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}