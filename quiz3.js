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

// quiz3.js
// (reuse createQuiz factory)

const lesson3 = [
  { question: 'In false-color satellite composites, healthy vegetation often appears:',
    answers: [
      { text: 'Bright red (high NIR reflectance)', correct: true },
      { text: 'Deep blue (water absorption)', correct: false },
      { text: 'Pure white (cloud cover)', correct: false },
      { text: 'Dark brown (bare soil)', correct: false }
    ]
  },
  { question: 'A 30 m spatial resolution means each pixel covers:',
    answers: [
      { text: '30 cm × 30 cm', correct: false },
      { text: '3 m × 3 m', correct: false },
      { text: '30 m × 30 m', correct: true },
      { text: '300 m × 300 m', correct: false }
    ]
  },
  { question: 'Which step corrects for sensor/viewing geometry before analysis?',
    answers: [
      { text: 'NDVI calculation', correct: false },
      { text: 'Geometric correction', correct: true },
      { text: 'Cloud masking', correct: false },
      { text: 'Supervised classification', correct: false }
    ]
  },
  { question: 'Google Earth Engine is best described as:',
    answers: [
      { text: 'A desktop photo-editing tool', correct: false },
      { text: 'A cloud-based geospatial analysis platform', correct: true },
      { text: 'A hardware sensor on Landsat', correct: false },
      { text: 'A fishing app', correct: false }
    ]
  },
  { question: 'For Landsat 8, the NIR band is labeled:',
    answers: [
      { text: 'B2', correct: false },
      { text: 'B4', correct: false },
      { text: 'B5', correct: true },
      { text: 'B10', correct: false }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  createQuiz({
    questions: lesson3,
    questionElId: 'question3',
    answersElId:  'answer-buttons3',
    nextBtnId:    'next-btn3'
  });
});