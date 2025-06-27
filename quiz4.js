function createQuiz({ questions, questionElId, answersElId, nextBtnId }) {
  let idx = 0, score = 0;
  const Q = document.getElementById(questionElId);
  const A = document.getElementById(answersElId);
  const N = document.getElementById(nextBtnId);

  show();
  function show() {
    A.innerHTML = '';
    N.classList.add('hidden');
    Q.textContent = questions[idx].question;
    questions[idx].answers.forEach(a => {
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = a.text;
      if (a.correct) b.dataset.correct = 'true';
      b.onclick = select;
      A.appendChild(b);
    });
  }
  function select(e) {
    const chosen = e.target;
    Array.from(A.children).forEach(b => b.disabled = true);
    if (chosen.dataset.correct === 'true') {
      chosen.classList.add('correct'); score++;
    } else {
      chosen.classList.add('wrong');
      const right = [...A.children].find(b => b.dataset.correct);
      right?.classList.add('correct');
    }
    N.classList.remove('hidden');
  }
  N.onclick = () => {
    idx++;
    if (idx < questions.length) return show();
    // final
    A.innerHTML = '';
    Q.textContent = `You scored ${score}/${questions.length}!`;
    N.textContent = 'Play Again';
    N.onclick = () => { idx = 0; score = 0; N.textContent = 'Next'; show(); };
  };
}

const lesson4 = [
  {
    question: 'The main method used to validate satellite-derived maps was:',
    answers: [
      { text: 'Drone-based LiDAR', correct: false },
      { text: 'Ground-truth GPS surveys', correct: true },
      { text: 'Ship-borne radar', correct: false },
      { text: 'Google Street View', correct: false }
    ]
  },
  {
    question: 'Which NDVI change flagged a successful restoration patch?',
    answers: [
      { text: '–0.2', correct: false },
      { text: '0', correct: false },
      { text: '+0.1', correct: true },
      { text: '–1.0', correct: false }
    ]
  },
  {
    question: 'The district council’s no-development buffer was set at:',
    answers: [
      { text: '10 m', correct: false },
      { text: '25 m', correct: false },
      { text: '50 m', correct: true },
      { text: '100 m', correct: false }
    ]
  },
  {
    question: 'Between 1990 and 2017, the park lost roughly what percentage of its mangroves?',
    answers: [
      { text: '2 %', correct: false },
      { text: '7.5 %', correct: true },
      { text: '20 %', correct: false },
      { text: '50 %', correct: false }
    ]
  },
  {
    question: 'The “Adopt-a-Plot” scheme involves:',
    answers: [
      { text: 'Renting mangrove land', correct: false },
      { text: 'Community groups monitoring small areas with NDVI apps', correct: true },
      { text: 'Private golf course development', correct: false },
      { text: 'Importing exotic tree species', correct: false }
    ]
  }
];

// 3) Initialize Lesson 4 quiz when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createQuiz({
    questions: lesson4,
    questionElId: 'question4',
    answersElId:  'answer-buttons4',
    nextBtnId:    'next-btn4'
  });
});
