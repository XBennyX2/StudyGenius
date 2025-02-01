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
        
        const data = await response.json();
        
        document.getElementById('summary').innerHTML = 
            `<h3>Summary</h3><div class="summary-content">${data.summary}</div>`;
        
        document.getElementById('quiz').innerHTML = 
            `<h3>Quiz</h3>${formatQuiz(data.quiz)}`;
        
        document.getElementById('flashcards').innerHTML = 
            `<h3>Flashcards</h3>${formatFlashcards(data.flashcards)}`;
        
        showTab('summary');
    } catch (error) {
        alert('Error generating content. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}

function formatQuiz(quizText) {
    // Gemini sometimes adds markdown backticks - remove them
    const cleanText = quizText.replace(/```/g, '');
    const questions = cleanText.split('\n\n');
    return questions.map(q => {
      const lines = q.split('\n').filter(l => l.trim() !== '');
      const question = lines[0].replace('Question: ', '');
      const options = lines.slice(1, -1); // Exclude answer line
      const answer = lines[lines.length-1].split('Answer: ')[1];
      
      return `<div class="question">
        <p>${question}</p>
        <ul>${options.map(o => `<li>${o}</li>`).join('')}</ul>
        <div class="answer">Answer: ${answer}</div>
      </div>`;
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

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => 
        tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    document.querySelectorAll('.tab-buttons button').forEach(btn => 
        btn.classList.remove('tab-active'));
    event.target.classList.add('tab-active');
}