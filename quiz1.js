// quiz1.js

// 1) Copy in the createQuiz factory
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

// 2) Lesson 1 data
const lesson1 = [
  { question: '1. Which factor is not essential for mangrove growth?',
    answers: [
      { text: 'Regular tidal flooding', correct: false },
      { text: 'High salinity tolerance', correct: false },
      { text: 'Deep, well-drained upland soils', correct: true },
      { text: 'Protected coastal location', correct: false }
    ]
  },
  { question: '2. The characteristic pneumatophores are found in which zone?',
    answers: [
      { text: 'Seaward (Sonneratia)', correct: false },
      { text: 'Mid-zone (Rhizophora)', correct: false },
      { text: 'Landward (Avicennia)', correct: true },
      { text: 'Upland tropical rainforest', correct: false }
    ]
  },
  { question: '3. Mangrove forests export organic nutrients to offshore waters, aiding:',
    answers: [
      { text: 'Coral bleaching', correct: false },
      { text: 'Marine food webs', correct: true },
      { text: 'Desertification', correct: false },
      { text: 'Mountain streams', correct: false }
    ]
  },
  { question: '4. “Blue carbon” refers to:',
    answers: [
      { text: 'Carbon in deep-sea fish', correct: false },
      { text: 'CO₂ sequestered by coastal vegetated ecosystems', correct: true },
      { text: 'Burning of marine oil deposits', correct: false },
      { text: 'Carbonates in coral skeletons', correct: false }
    ]
  },
  { question: '5. Taman Paya Bakau’s greatest educational value is its:',
    answers: [
      { text: 'In-park mineral springs', correct: false },
      { text: 'Urban mangrove boardwalk and outreach programs', correct: true },
      { text: 'Alpine climate research station', correct: false },
      { text: 'Oil-palm demonstration plots', correct: false }
    ]
  }
];

// 3) Initialize
document.addEventListener('DOMContentLoaded', () => {
  createQuiz({
    questions: lesson1,
    questionElId: 'question1',
    answersElId:  'answer-buttons1',
    nextBtnId:    'next-btn1'
  });
});