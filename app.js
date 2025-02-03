async function generateContent() {
  const topic = document.getElementById('topic').value;
  const difficulty = document.getElementById('difficulty').value;
  const loading = document.getElementById('loading');
  
  if (!topic) return alert('Please enter a topic');
  
  loading.style.display = 'block';
  
  try {
      const response = await fetch('/.netlify/functions/generate-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, difficulty })
      });
      
      if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
      }

      const data = await response.json();
      
      document.getElementById('summary').innerHTML = 
          `<h3>Summary</h3><div class="summary-content">${data.summary}</div>`;
      
      document.getElementById('quiz').innerHTML = 
          `<h3>Quiz</h3>${formatQuiz(data.quiz)}`;
      
      document.getElementById('flashcards').innerHTML = 
          `<h3>Flashcards</h3>${formatFlashcards(data.flashcards)}`;
      
      showTab('summary');
  } catch (error) {
      console.error('Error:', error);
      alert('Error generating content. Please try again.');
  } finally {
      loading.style.display = 'none';
  }
}

function formatQuiz(quizText) {
  if (!quizText) return '<div>No quiz generated.</div>';

  // Remove markdown backticks and split questions
  const cleanText = quizText.replace(/```/g, '');
  const questions = cleanText.split('\n\n').filter(q => q.trim() !== '');

  return questions.map((q, index) => {
    try {
      const lines = q.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 3) return ''; // Skip invalid questions

      const question = lines[0].replace('Question: ', '').trim();
      const options = lines.slice(1, -1);
      const answerLine = lines[lines.length - 1] || '';
      const answer = answerLine.split('Answer: ')[1]?.trim() || 'A';

      return `
        <div class="question" data-correct-answer="${answer}" data-question-id="${index}">
          <p>${question}</p>
          <div class="options">
            ${options.map((o, i) => `
              <div class="option" data-option="${String.fromCharCode(65 + i)}">
                ${o.trim()}
              </div>
            `).join('')}
          </div>
          <div class="feedback"></div>
        </div>
      `;
    } catch (error) {
      console.error(`Error processing question ${index + 1}:`, q);
      return `<div class="question error">
        <p>Could not load this question</p>
      </div>`;
    }
  }).join('');
}

function formatFlashcards(flashcards) {
  return flashcards.split('\n\n').map(card => {
    const [termPart, definitionPart] = card.split('|');
    const term = termPart.replace('Term:', '').trim();
    const definition = definitionPart.replace('Definition:', '').trim();
    return `<div class="flashcard">
      <strong>${term}</strong>
      <p>${definition}</p>
    </div>`;
  }).join('');
}

function showTab(tabName, event) {
  document.querySelectorAll('.tab-content').forEach(tab => 
    tab.classList.remove('active')
  );
  document.getElementById(tabName).classList.add('active');

  if (event) {
    document.querySelectorAll('.tab-buttons button').forEach(btn => 
      btn.classList.remove('tab-active')
    );
    event.target.classList.add('tab-active');
  }
}

// Quiz interaction handler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('option')) {
      const option = e.target;
      const questionDiv = option.closest('.question');
      const correctAnswer = questionDiv.dataset.correctAnswer;
      const selectedOption = option.dataset.option;
      const feedbackDiv = questionDiv.querySelector('.feedback');

      // Disable further clicks
      questionDiv.querySelectorAll('.option').forEach(opt => 
          opt.style.pointerEvents = 'none'
      );

      // Highlight answers
      questionDiv.querySelectorAll('.option').forEach(opt => {
          const optValue = opt.dataset.option;
          if (optValue === correctAnswer) {
              opt.classList.add('correct');
          } else if (optValue === selectedOption) {
              opt.classList.add('wrong');
          }
      });

      // Show feedback
      feedbackDiv.innerHTML = selectedOption === correctAnswer 
          ? '🎉 Correct!' 
          : `❌ Correct answer: ${correctAnswer}`;
  }
});