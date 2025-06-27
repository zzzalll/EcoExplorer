// HTML references
const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')
const promptImage = document.getElementById('prompt-image')

let state = {}
let pendingNextNode = null

function startGame() {
  // initialize Awareness, Compliance, Engagement
  state = {
    awareness: 0,
    compliance: 0,
    engagement: 0
  }
  showTextNode(0)  // start at intro
}

function showTextNode(nodeId) {
  pendingNextNode = null
  const node = textNodes.find(n => n.id === nodeId)

  // image handling (optional)
  if (node.image) {
    promptImage.src = node.image
    promptImage.alt = node.alt || ''
    promptImage.style.display = 'block'
  } else {
    promptImage.style.display = 'none'
  }

  // final summary?
  if (node.id === 11) {
    textElement.innerText = getFinalText()
  } else {
    textElement.innerText = node.text
  }

  // render buttons
  optionButtonsElement.innerHTML = ''
  node.options.forEach(option => {
    if (!option.requiredState || option.requiredState(state)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function selectOption(option) {
  // apply score changes
  if (option.setState) {
    Object.entries(option.setState).forEach(([k, v]) => {
      if (['awareness','compliance','engagement'].includes(k)) {
        state[k] += v
      } else {
        state[k] = v
      }
    })
  }

  const next = option.nextText
  // no effect text? jump directly
  if (option.effect === undefined) {
    if (next <= 0) startGame()
    else showTextNode(next)
    return
  }

  // prepare effect display
  const deltaAwr = option.setState?.awareness || 0
  const deltaCmp = option.setState?.compliance || 0
  const deltaEng = option.setState?.engagement || 0
  pendingNextNode = next
  showEffect({ a: deltaAwr, c: deltaCmp, e: deltaEng }, option.effect)
}

function showEffect(delta, effectText = '') {
  // build delta message
  const parts = []
  if (delta.a) parts.push(`Awareness ${delta.a>0?'+':''}${delta.a}`)
  if (delta.c) parts.push(`Compliance ${delta.c>0?'+':''}${delta.c}`)
  if (delta.e) parts.push(`Engagement ${delta.e>0?'+':''}${delta.e}`)
  const scoreMsg = parts.length ? parts.join(' | ') : 'No change'

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
  const A = state.awareness
  const C = state.compliance
  const E = state.engagement
  const total = A + C + E
  let title, msg

  if (total >= 20) {
    title = 'Sustainable Steward'
    msg = 'You deeply understand, obey rules, and engage fully. Taman Botani thanks you!'
  } else if (total >= 10) {
    title = 'Eco-Friendly Visitor'
    msg = 'Good awareness and compliance—boost your engagement next time.'
  } else {
    title = 'Unaware Tourist'
    msg = 'Reflect on park guidelines and take part in its conservation.'
  }

  return `Your visit concludes.

Scores:
• Awareness:  ${A}
• Compliance: ${C}
• Engagement: ${E}

Total: ${total}

— ${title} —
${msg}`
}

const textNodes = [
  {
    id: 0,
    image: 'botani/botani.png',
    text: `Welcome to Taman Botani Negara Shah Alam!

In this adventure you'll face ten real scenarios. Each choice affects three scores:
• Awareness: how much you learn  
• Compliance: how well you follow park rules  
• Engagement: how actively you participate  

Aim to become a Sustainable Steward! Click Start to go.`,
    options: [
      { text: 'Start', nextText: 1 }
    ]
  },
  {
    id: 1,
    image: 'botani/waste.jpg',
    text: `You see a large sign about waste segregation (Recycle, Organic, General).  
What do you do?`,
    options: [
      {
        text: 'Read carefully and sort correctly.',
        setState: { awareness: 2, compliance: 2 },
        effect: 'Great! You learn and apply proper waste sorting.',
        nextText: 2
      },
      {
        text: 'Glance, then sort randomly.',
        setState: { awareness: 1, compliance: 0 },
        effect: 'You get some guidelines but mis-sort anyway.',
        nextText: 2
      },
      {
        text: 'Ignore sign and litter on bench.',
        setState: { awareness: -2, compliance: -2 },
        effect: 'Poor choice: you harm park cleanliness and miss guidance.',
        nextText: 2
      }
    ]
  },
  {
    id: 2,
    image: 'kanching/trash.jpg',
    text: `You approach a stretch with no bins for 500m.  
What do you do with your trash?`,
    options: [
      {
        text: 'Carry it until the next bin.',
        setState: { compliance: 2, engagement: 1 },
        effect: 'Excellent: you keep the park clean.',
        nextText: 3
      },
      {
        text: 'Bury items in soil.',
        setState: { compliance: -1, awareness: -1 },
        effect: 'Burying doesn’t solve microplastic issues.',
        nextText: 3
      },
      {
        text: 'Drop it for staff to pick up.',
        setState: { compliance: -2, engagement: -1 },
        effect: 'Staff burden rises; park suffers.',
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    image: 'botani/map.jpeg',
    text: `A map shows an eco-trail with interpretive boards.  
How do you explore?`,
    options: [
      {
        text: 'Follow trail and read every board.',
        setState: { engagement: 2, awareness: 1 },
        effect: 'You learn about local flora and fauna.',
        nextText: 4
      },
      {
        text: 'Walk it but ignore the boards.',
        setState: { engagement: 0, awareness: -1 },
        effect: 'Missed chance to learn key conservation facts.',
        nextText: 4
      },
      {
        text: 'Venture off-trail to shortcut.',
        setState: { compliance: -2, engagement: -1 },
        effect: 'You risk trampling sensitive habitats.',
        nextText: 4
      }
    ]
  },
  {
    id: 4,
    image: 'botani/flyer.jpg',
    text: `At the picnic area staff offer flyers on sustainability.  
What’s your response?`,
    options: [
      {
        text: 'Accept, read, and ask questions.',
        setState: { engagement: 2, awareness: 2 },
        effect: 'You engage deeply and learn best practices.',
        nextText: 5
      },
      {
        text: 'Take flyer but toss it later.',
        setState: { engagement: -1, awareness: -1 },
        effect: 'Lost materials and lost opportunity to learn.',
        nextText: 5
      },
      {
        text: 'Decline and chat with friends.',
        setState: { engagement: 0, awareness: 0 },
        effect: 'Neutral—no gain or harm.',
        nextText: 5
      }
    ]
  },
  {
    id: 5,
    image: 'botani/sign.jpg',
    text: `At the butterfly garden, a sign warns “Do not touch plants.”  
Your action?`,
    options: [
      {
        text: 'Respect sign; keep distance.',
        setState: { compliance: 2 },
        effect: 'You protect delicate specimens.',
        nextText: 6
      },
      {
        text: 'Touch gently “just once.”',
        setState: { compliance: -1 },
        effect: 'Even gentle touch can harm wings and plants.',
        nextText: 6
      },
      {
        text: 'Break a leaf as a souvenir.',
        setState: { compliance: -2 },
        effect: 'Damages the exhibit and ecosystem.',
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    image: 'botani/trash.jpg',
    text: `You spot separate compost and recycling bins.  
How do you sort?`,
    options: [
      {
        text: 'Organic to compost; paper to recycle.',
        setState: { awareness: 1, compliance: 2 },
        effect: 'Perfect sorting supports both systems.',
        nextText: 7
      },
      {
        text: 'Combine organics with recycle.',
        setState: { compliance: -1 },
        effect: 'Contaminates the recycling stream.',
        nextText: 7
      },
      {
        text: 'All in general waste.',
        setState: { compliance: -2 },
        effect: 'Missed chance to divert waste from landfill.',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    image: 'botani/talk.png',
    text: `A workshop on water conservation is in session.  
Do you…?`,
    options: [
      {
        text: 'Join actively, ask questions.',
        setState: { engagement: 2, awareness: 1 },
        effect: 'You gain hands-on conservation tips.',
        nextText: 8
      },
      {
        text: 'Stand by and listen quietly.',
        setState: { engagement: 1 },
        effect: 'You pick up some ideas passively.',
        nextText: 8
      },
      {
        text: 'Keep walking—no time.',
        setState: { engagement: 0 },
        effect: 'Lost opportunity to learn water-saving methods.',
        nextText: 8
      }
    ]
  },
  {
    id: 8,
    image: 'botani/animal.jpeg',
    text: `A loud tour group disturbs the Animal Garden.  
Your move?`,
    options: [
      {
        text: 'Politely ask them to lower voices.',
        setState: { engagement: 2 },
        effect: 'You help protect wildlife from stress.',
        nextText: 9
      },
      {
        text: 'Join them in joking loudly.',
        setState: { compliance: -1, engagement: -1 },
        effect: 'Adds noise and pressure on birds.',
        nextText: 9
      },
      {
        text: 'Walk away quietly.',
        setState: { engagement: 0 },
        effect: 'You avoid conflict but wildlife still suffers.',
        nextText: 9
      }
    ]
  },
  {
    id: 9,
    image: 'botani/bus.jpeg',
    text: `Sign suggests shuttle over private car.  
You choose to…`,
    options: [
      {
        text: 'Ride the shuttle bus.',
        setState: { compliance: 1, engagement: 1 },
        effect: 'Reduces carbon emissions and traffic.',
        nextText: 10
      },
      {
        text: 'Drive your own car.',
        setState: { compliance: -1 },
        effect: 'Higher emissions and congestion.',
        nextText: 10
      },
      {
        text: 'Cycle from city center.',
        setState: { compliance: 2, engagement: 1 },
        effect: 'Very eco-friendly transport choice!',
        nextText: 10
      }
    ]
  },
  {
    id: 10,
    image: 'kanching/phone.jpeg',
    text: `At home, you share your park visit online.  
What do you post?`,
    options: [
      {
        text: 'A guide to the park’s green practices.',
        setState: { engagement: 2, awareness: 1 },
        effect: 'Spreads knowledge and inspires friends!',
        nextText: 11
      },
      {
        text: 'Only selfies at scenic spots.',
        setState: { engagement: -1 },
        effect: 'Missed chance to highlight sustainability.',
        nextText: 11
      },
      {
        text: 'Nothing; you keep it private.',
        setState: {},
        nextText: 11
      }
    ]
  },
  {
    id: 11,
    // final node
    options: [
      { text: 'Play Again', nextText: -1 }
    ]
  }
]

startGame()