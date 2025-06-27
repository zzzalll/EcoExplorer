// HTML elements
const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')
const promptImage = document.getElementById('prompt-image')

let state = {}
let pendingNextNode = null

function startGame() {
  // Initialize Knowledge, Attitude, Practice scores
  state = {
    knowledge: 0,
    attitude: 0,
    practice: 0
  }
  showTextNode(0)    // begin at intro
}

function showTextNode(textNodeIndex) {
  pendingNextNode = null
  const node = textNodes.find(n => n.id === textNodeIndex)

  // Image handling (optional)
  if (node.image) {
    promptImage.src = node.image
    promptImage.alt = node.alt || ''
    promptImage.style.display = 'block'
  } else {
    promptImage.style.display = 'none'
  }

  // Final node?
  if (node.id === 12) {
    textElement.innerText = getFinalText()
  } else {
    textElement.innerText = node.text
  }

  // Render option buttons
  optionButtonsElement.innerHTML = ''
  node.options.forEach(option => {
    if (!option.requiredState || option.requiredState(state)) {
      const btn = document.createElement('button')
      btn.innerText = option.text
      btn.classList.add('btn')
      btn.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(btn)
    }
  })
}

function selectOption(option) {
  // Apply knowledge/attitude/practice deltas
  if (option.setState) {
    for (const [key, value] of Object.entries(option.setState)) {
      if (['knowledge', 'attitude', 'practice'].includes(key)) {
        state[key] += value
      } else {
        state[key] = value
      }
    }
  }

  const next = option.nextText
  // If no effect text, jump directly
  if (option.effect === undefined) {
    if (next <= 0) startGame()
    else showTextNode(next)
    return
  }

  // Queue effect display
  const deltaK = option.setState?.knowledge || 0
  const deltaA = option.setState?.attitude || 0
  const deltaP = option.setState?.practice || 0
  pendingNextNode = next
  showEffect({ k: deltaK, a: deltaA, p: deltaP }, option.effect)
}

function showEffect(delta, effectText = '') {
  // Build score-change message
  const parts = []
  if (delta.k) parts.push(`Knowledge ${delta.k > 0 ? '+' : ''}${delta.k}`)
  if (delta.a) parts.push(`Attitude ${delta.a > 0 ? '+' : ''}${delta.a}`)
  if (delta.p) parts.push(`Practice ${delta.p > 0 ? '+' : ''}${delta.p}`)
  const scoreMsg = parts.length ? parts.join(' | ') : 'No score change'

  textElement.innerText = scoreMsg + "\n\n" + effectText
  optionButtonsElement.innerHTML = ''

  const cont = document.createElement('button')
  cont.innerText = 'Continue'
  cont.classList.add('btn')
  cont.addEventListener('click', () => {
    if (pendingNextNode <= 0) startGame()
    else showTextNode(pendingNextNode)
  })
  optionButtonsElement.appendChild(cont)
}

function getFinalText() {
  const K = state.knowledge
  const A = state.attitude
  const P = state.practice
  const total = K + A + P
  let title, msg

  if (total >= 16) {
    title = 'Eco-Champion'
    msg = 'Your knowledge, attitude & practice shine. Kanching thanks you!'
  } else if (total >= 8) {
    title = 'Conscious Traveler'
    msg = 'Good grasp and caring heart—just tighten up some practices.'
  } else {
    title = 'Eco-Novice'
    msg = 'Time to study principles and turn awareness into action.'
  }

  return `Your journey ends at the gate…

Scores:
• Knowledge: ${K}
• Attitude:  ${A}
• Practice:  ${P}

Total Eco‐Score: ${total}

— ${title} —
${msg}`
}

// Adventure steps
const textNodes = [
  {
    id: 0,
    image: 'kanching/kanching.jpg',
    text: `Welcome to Kanching Waterfall!

In this interactive adventure you’ll learn the three pillars of eco-tourism: Knowledge, Attitude, Practice, through ten real-life scenarios. Each choice you make will adjust your KAP scores. Become an Eco-Champion by the end!

Click Start to begin.`,
    options: [
      { text: 'Start', nextText: 1 }
    ]
  },
  {
    id: 1,
    image: 'kanching/eco-t.jpeg',
    text: `You see a big sign:
“Eco-tourism = responsible travel that conserves, sustains & educates.”
What do you do?`,
    options: [
      {
        text: 'Read every line, take notes.',
        setState: { knowledge: 2 },
        effect: 'You absorb key principles that will guide you!',
        nextText: 2
      },
      {
        text: 'Glance at it and move on.',
        setState: { knowledge: 1 },
        effect: 'A quick glance gives you some context.',
        nextText: 2
      },
      {
        text: 'Ignore it—photos are more fun!',
        setState: { knowledge: -2 },
        effect: 'You miss crucial guidelines for responsible travel.',
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    image: 'kanching/litter.jpg',
    text: `On the path, you spot plastic bottles and candy wrappers.`,
    options: [
      {
        text: 'Pick them up and carry to the bin.',
        setState: { practice: 2 },
        effect: 'Great job—cleaning up protects the river!',
        nextText: 3
      },
      {
        text: 'Walk past; “someone else will do it.”',
        setState: { practice: 0 },
        effect: 'You leave the trash to harm wildlife downstream.',
        nextText: 3
      },
      {
        text: 'Add your empty bottle to the pile.',
        setState: { practice: -2 },
        effect: 'Adding more waste worsens pollution.',
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    image: 'kanching/carving.jpg',
    text: `You find some villagers selling handcrafted wood carvings.`,
    options: [
      {
        text: 'Buy one at a fair price; ask its story.',
        setState: { attitude: 2 },
        effect: 'You support local culture and artisans!',
        nextText: 4
      },
      {
        text: 'Politely decline; buy in KL instead.',
        setState: { attitude: 0 },
        effect: 'You miss a chance to empower the community.',
        nextText: 4
      },
      {
        text: 'Haggle aggressively for half price.',
        setState: { attitude: -1 },
        effect: 'Undermines fair pay for artisans.',
        nextText: 4
      }
    ]
  },
  {
    id: 4,
    image: 'botani/monkey.jpg',
    text: `You see a family of monkeys plays nearby.`,
    options: [
      {
        text: 'Keep your distance; watch quietly.',
        setState: { practice: 2 },
        effect: 'Respectful wildlife viewing—perfect!',
        nextText: 5
      },
      {
        text: 'Flash the camera close up.',
        setState: { practice: -1 },
        effect: 'Startles them and invades their space.',
        nextText: 5
      },
      {
        text: 'Throw peanuts to lure them closer.',
        setState: { practice: -2 },
        effect: 'Feeding wild animals distorts their diet.',
        nextText: 5
      }
    ]
  },
  {
    id: 5,
    image: 'kanching/dance.jpg',
    text: `A guide invites you to learn a traditional dance.`,
    options: [
      {
        text: 'Join respectfully; ask questions.',
        setState: { attitude: 2 },
        effect: 'You honor cultural heritage!',
        nextText: 6
      },
      {
        text: 'Watch quietly from the edge.',
        setState: { attitude: 1 },
        effect: 'You observe but miss deeper engagement.',
        nextText: 6
      },
      {
        text: 'Mock the steps for laughs.',
        setState: { attitude: -2 },
        effect: 'Disrespectful to the community’s culture.',
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    image: 'kanching/photo.png',
    text: `Ten people wait for a photo spot.`,
    options: [
      {
        text: 'Wait your turn patiently.',
        setState: { practice: 2 },
        effect: 'Courteous and low-impact behavior!',
        nextText: 7
      },
      {
        text: 'Squeeze past others for one shot.',
        setState: { practice: -1 },
        effect: 'Disturbs fellow visitors.',
        nextText: 7
      },
      {
        text: 'Shout to hurry them up.',
        setState: { practice: -2 },
        effect: 'Creates tension and noise.',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    image: 'kanching/ferns.jpg',
    text: `A rare fern grows beside the stream.`,
    options: [
      {
        text: 'Stay on the boardwalk; admire from afar.',
        setState: { practice: 2 },
        effect: 'Prevents trampling sensitive plants.',
        nextText: 8
      },
      {
        text: 'Step partly off-trail for a closer look.',
        setState: { practice: -1 },
        effect: 'Even light foot traffic damages roots.',
        nextText: 8
      },
      {
        text: 'Rip a frond as a keepsake.',
        setState: { practice: -2 },
        effect: 'Removes vital tissue from a fragile species.',
        nextText: 8
      }
    ]
  },
  {
    id: 8,
    image: 'kanching/fence.jpg',
    text: `A shortcut through a broken fence tempts you.`,
    options: [
      {
        text: 'Stay on the marked trail.',
        setState: { practice: 2 },
        effect: 'Protects habitat and prevents erosion.',
        nextText: 9
      },
      {
        text: 'Sneak through the gap once.',
        setState: { practice: -1 },
        effect: 'Creates an informal trail others may follow.',
        nextText: 9
      },
      {
        text: 'Cut a new path deeper into the forest.',
        setState: { practice: -2 },
        effect: 'Severely damages undergrowth and soil.',
        nextText: 9
      }
    ]
  },
  {
    id: 9,
    image: 'kanching/trash.jpg',
    text: `No trash bin is nearby after your snack.`,
    options: [
      {
        text: 'Pack out your trash until you find one.',
        setState: { practice: 2 },
        effect: '“Leave no trace” in action!',
        nextText: 10
      },
      {
        text: 'Bury the wrapper in soil.',
        setState: { practice: -1 },
        effect: 'Burying doesn’t stop microplastics.',
        nextText: 10
      },
      {
        text: 'Toss it into the river.',
        setState: { practice: -2 },
        effect: 'Pollutes waterways and harms wildlife.',
        nextText: 10
      }
    ]
  },
  {
    id: 10,
    image: 'kanching/phone.jpeg',
    text: `Back home, you decide how to share your trip.`,
    options: [
      {
        text: 'Post a detailed eco-guide online.',
        setState: { knowledge: 2 },
        effect: 'Spreads accurate eco-tourism tips!',
        nextText: 12
      },
      {
        text: 'Share only selfies and brag.',
        setState: { knowledge: -1 },
        effect: 'Misses chance to educate others.',
        nextText: 12
      },
      {
        text: 'Stay silent online.',
        setState: { knowledge: 0 },
        effect: 'Neutral—no further impact.',
        nextText: 12
      }
    ]
  },
  {
    id: 12,
    options: [
      { text: 'Play Again', nextText: -1 }
    ]
  }
]

startGame()