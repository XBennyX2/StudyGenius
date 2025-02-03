StudyGenius - AI-Powered Study Assistant
StudyGenius is a single-page web application that uses Google’s Gemini 1.5 Flash generative AI model to create personalized study materials, including summaries, quizzes, and flashcards, tailored to your chosen topic and difficulty level.

Features
Dynamic Content Generation:

Generate summaries tailored to your difficulty level.

Create multiple-choice quizzes with answers.

Build flashcards with key terms and definitions.

Interactive Interface:

Input a topic and difficulty level, and the app dynamically generates and displays the content in a clean, tabbed interface.

AI-Powered Personalization:

Uses generative AI to ensure content is relevant, accurate, and tailored to your needs.



How to Use
Enter a Topic:

Type a topic (e.g., "Photosynthesis") in the input field.

Select a Difficulty Level:

Choose from High School, College, or Graduate.

Generate Study Materials:

Click the Generate Study Materials button to get AI-generated content.

Explore the Results:

Switch between Summary, Quiz, and Flashcards tabs to view the generated content.

Setup Instructions
Prerequisites
Node.js: Ensure Node.js is installed on your machine. Download it from here.

Netlify CLI: Install the Netlify CLI globally:

bash
Copy
npm install -g netlify-cli
Installation
Clone the Repository:

bash
Copy
git clone https://github.com/your-username/study-genius.git
cd study-genius
Install Dependencies:

bash
Copy
npm install
Set Up Environment Variables:

Create a .env file in the project root:

Copy
GEMINI_API_KEY=your_actual_key_here
Add .env to your .gitignore file to avoid committing sensitive data.

Run Locally:
Start the Netlify development server:

bash
Copy
netlify dev
Open your browser and go to:

Copy
http://localhost:8888
Deployment
Deploy to Netlify
Link to Netlify:

bash
Copy
netlify init
Follow the prompts to link your project to a new or existing Netlify site.

Set Environment Variables:
Set the GEMINI_API_KEY environment variable in the Netlify Dashboard:

bash
Copy
netlify env:set GEMINI_API_KEY your_actual_key_here
Deploy:
Push your code to GitHub, and Netlify will automatically deploy the site.

Technologies Used
Frontend:

HTML, CSS, JavaScript

Backend:

Netlify Functions (Serverless)

Generative AI:

Google’s Gemini 1.5 Flash API

Deployment:

Netlify

Prompt Engineering
The app uses prompt engineering to guide the Gemini API in generating high-quality, structured outputs. Examples include:

Contextual Prompting:

javascript
Copy
const summaryPrompt = `Generate a ${difficulty}-level summary on ${topic}.
  Focus on core concepts. Use bullet points. Limit to 150 words.`;
Few-Shot Prompting:

javascript
Copy
const quizPrompt = `Generate 5 multiple-choice questions on ${topic} at ${difficulty} level.
  Format each as:
  Question: [question]
  A) [option1]
  B) [option2]
  C) [option3]
  Answer: [correct letter]`;
Parameters Tuned
Temperature:

Summary: 0.3 (low for factual accuracy).

Quiz: 0.7 (higher for creative distractors).

Flashcards: 0.5 (balanced for diverse yet accurate terms).

Max Tokens:

Summary: 300 (to enforce brevity).

Quiz: 500 (to allow for multiple questions).

Flashcards: 600 (to accommodate 10 terms and definitions).

Contributing
Contributions are welcome! If you’d like to contribute to StudyGenius, follow these steps:

Fork the repository.

Create a new branch:

bash
Copy
git checkout -b feature/your-feature-name
Commit your changes:

bash
Copy
git commit -m "Add your feature"
Push to the branch:

bash
Copy
git push origin feature/your-feature-name
Open a pull request.

Acknowledgments
Google Gemini API: For providing the generative AI capabilities.

Netlify: For hosting and serverless functions.

OpenAI: For inspiration and prompt engineering techniques.


Enjoy using StudyGenius! 🚀
