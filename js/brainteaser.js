// ===== BRAIN TEASERS — Random Puzzles for Breaks =====

var BRAIN_TEASERS = [
    { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?", a: "An echo" },
    { q: "I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?", a: "A map" },
    { q: "What has keys but no locks?", a: "A piano" },
    { q: "What gets wetter the more it dries?", a: "A towel" },
    { q: "I'm tall when I'm young and short when I'm old. What am I?", a: "A candle" },
    { q: "What has a head, a tail, is brown, and has no legs?", a: "A penny" },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp" },
    { q: "What has many teeth but can't bite?", a: "A comb" },
    { q: "If you drop me, I'm sure to crack. But smile at me, and I'll smile back. What am I?", a: "A mirror" },
    { q: "I have branches, but no fruit, trunk, or leaves. What am I?", a: "A bank" },
    { q: "What can you catch but never throw?", a: "A cold" },
    { q: "What building has the most stories?", a: "A library" },
    { q: "What has ears but cannot hear?", a: "A cornfield" },
    { q: "What has one eye but can't see?", a: "A needle" },
    { q: "What goes up but never comes down?", a: "Your age" },
    { q: "A man looks at a painting and says, 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the painting?", a: "His son" },
    { q: "What disappears as soon as you say its name?", a: "Silence" },
    { q: "I am not alive, but I grow; I don't have lungs, but I need air. What am I?", a: "Fire" },
    { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps" },
    { q: "What has a bottom at the top?", a: "Your legs" },
    { q: "What invention lets you look right through a wall?", a: "A window" },
    { q: "What has 13 hearts, but no other organs?", a: "A deck of cards" },
    { q: "What can fill a room but takes up no space?", a: "Light" },
    { q: "What word begins and ends with an 'E' but only has one letter?", a: "Envelope" }
];

var currentTeaser = -1;
var answerRevealed = false;

function showRandomTeaser() {
    var newIndex;
    do {
        newIndex = Math.floor(Math.random() * BRAIN_TEASERS.length);
    } while (newIndex === currentTeaser && BRAIN_TEASERS.length > 1);

    currentTeaser = newIndex;
    answerRevealed = false;

    var teaser = BRAIN_TEASERS[currentTeaser];
    var questionEl = document.getElementById("teaserQuestion");
    var answerEl = document.getElementById("teaserAnswer");
    var revealBtn = document.getElementById("revealBtn");

    if (questionEl) questionEl.innerText = teaser.q;
    if (answerEl) {
        answerEl.innerText = "";
        answerEl.style.display = "none";
    }
    if (revealBtn) revealBtn.innerText = "💡 Reveal Answer";
}

function revealAnswer() {
    if (currentTeaser < 0) return;

    var answerEl = document.getElementById("teaserAnswer");
    var revealBtn = document.getElementById("revealBtn");

    if (!answerRevealed) {
        answerEl.innerText = BRAIN_TEASERS[currentTeaser].a;
        answerEl.style.display = "block";
        if (revealBtn) revealBtn.innerText = "🔒 Hide Answer";
        answerRevealed = true;
    } else {
        answerEl.innerText = "";
        answerEl.style.display = "none";
        if (revealBtn) revealBtn.innerText = "💡 Reveal Answer";
        answerRevealed = false;
    }
}

// Init on page load
window.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("teaserQuestion")) {
        showRandomTeaser();
    }
});
