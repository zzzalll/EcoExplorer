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
// quiz2.js
// (reuse createQuiz factory from quiz1.js)

const lesson2 = [
  { question: 'A primary cause of global mangrove loss is:',
    answers: [
      { text: 'Alpine skiing', correct: false },
      { text: 'Aquaculture pond development', correct: true },
      { text: 'Increased bird nesting', correct: false },
      { text: 'Underground mining', correct: false }
    ]
  },
  { question: 'Excessive nutrient runoff into mangroves can lead to:',
    answers: [
      { text: 'Increased oxygenation', correct: false },
      { text: 'Algal blooms that block sunlight', correct: true },
      { text: 'Lower salinity levels', correct: false },
      { text: 'More prop root growth', correct: false }
    ]
  },
  { question: 'Which climate change effect directly drowns mangrove roots?',
    answers: [
      { text: 'Temperate heatwaves', correct: false },
      { text: 'Sea-level rise', correct: true },
      { text: 'Asian monsoons', correct: false },
      { text: 'Polar vortex', correct: false }
    ]
  },
  { question: 'Removing mangroves increases coastal erosion because:',
    answers: [
      { text: 'No bird habitat remains', correct: false },
      { text: 'Wave energy isn’t dissipated by roots', correct: true },
      { text: 'Plastics accumulate on beaches', correct: false },
      { text: 'Sunlight overdries the sand', correct: false }
    ]
  },
  { question: 'Long-term monitoring of mangroves helps to:',
    answers: [
      { text: 'Stockpile unused timber', correct: false },
      { text: 'Detect deforestation trends early', correct: true },
      { text: 'Promote recreational hunting', correct: false },
      { text: 'Prevent hurricanes', correct: false }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  createQuiz({
    questions: lesson2,
    questionElId: 'question2',
    answersElId:  'answer-buttons2',
    nextBtnId:    'next-btn2'
  });
});
