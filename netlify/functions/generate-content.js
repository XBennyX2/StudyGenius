exports.handler = async (event) => {
    const { topic, difficulty } = JSON.parse(event.body);
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
    // Define prompts
    const summaryPrompt = `Generate a ${difficulty}-level summary on ${topic}.
      Focus on core concepts and avoid jargon. Use bullet points. Limit to 150 words.`;
  
    const quizPrompt = `Generate 5 multiple-choice questions on ${topic} at ${difficulty} level.
      Format each as:
      Question: [question]
      A) [option1]
      B) [option2]
      C) [option3]
      Answer: [correct letter]`;
  
    const flashcardsPrompt = `Generate 10 key terms with definitions for ${topic}.
      Format each as: Term: [term] | Definition: [definition]`;
  
    try {
      const [summary, quiz, flashcards] = await Promise.all([
        callGeminiAPI(summaryPrompt, GEMINI_API_KEY),
        callGeminiAPI(quizPrompt, GEMINI_API_KEY),
        callGeminiAPI(flashcardsPrompt, GEMINI_API_KEY)
      ]);
  
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: summary,
          quiz: quiz,
          flashcards: flashcards
        })
      };
    } catch (error) {
      return { statusCode: 500, body: error.message };
    }
  };
  
  async function callGeminiAPI(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
  
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }