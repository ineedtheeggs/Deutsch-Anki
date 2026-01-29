let cards = [];
let currentCardIndex = 0;
let reviewData = JSON.parse(localStorage.getItem('verbReviews')) || {};

async function loadCards() {
    try {
        // Load from GitHub raw URL
        const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/verbs.json');
        cards = await response.json();
        shuffleArray(cards);
        showCard(currentCardIndex);
        updateStats();
    } catch (error) {
        console.error('Error loading cards:', error);
        document.getElementById('front-content').textContent = 
            "Karten konnten nicht geladen werden. Bitte GitHub URL überprüfen.";
    }
}

function showCard(index) {
    const card = cards[index];
    const front = document.getElementById('front-content');
    const back = document.getElementById('back-content');
    
    front.innerHTML = `
        <h2>${card.front}</h2>
        <div class="hint">(Klicken zum Umdrehen)</div>
    `;
    
    back.innerHTML = `
        <div class="definition">${card.back.definition}</div>
        <div class="examples">
            <strong>Beispiele:</strong>
            <ul>${card.back.examples.map(ex => `<li>${ex}</li>`).join('')}</ul>
        </div>
        <div class="conjugation">
            <strong>Konjugation:</strong><br>
            Präsens: ${card.back.conjugation.Präsens}<br>
            Präteritum: ${card.back.conjugation.Präteritum}<br>
            Perfekt: ${card.back.conjugation.Perfekt}
        </div>
        <div class="level">Level: ${card.back.level}</div>
    `;
    
    document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
}

function rateCard(rating) {
    const cardId = cards[currentCardIndex].id;
    
    // Simple spaced repetition algorithm
    const now = Date.now();
    reviewData[cardId] = {
        lastReviewed: now,
        rating: rating,
        nextReview: calculateNextReview(rating, reviewData[cardId])
    };
    
    localStorage.setItem('verbReviews', JSON.stringify(reviewData));
    
    // Move to next card
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    showCard(currentCardIndex);
    updateStats();
}

function calculateNextReview(rating, previousData) {
    const intervals = {
        'again': 0,      // Review again now
        'hard': 1,       // 1 day
        'good': 3,       // 3 days
        'easy': 7        // 7 days
    };
    
    const now = Date.now();
    const days = intervals[rating] * 24 * 60 * 60 * 1000;
    return now + days;
}

function updateStats() {
    const total = cards.length;
    const reviewed = Object.keys(reviewData).length;
    document.getElementById('stats').textContent = 
        `Karten: ${total} | Gelernt: ${reviewed}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize
window.onload = loadCards;