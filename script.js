// Durée du compte-à-rebours en secondes (12 minutes)
let totalSeconds = 12 * 60;

// Sélection du champ de réponse
const answerInput = document.getElementById("answer");

// 🔹 Gestion de la disparition du placeholder
answerInput.addEventListener("focus", () => {
  answerInput.placeholder = "";
});

answerInput.addEventListener("blur", () => {
  answerInput.placeholder = "_   _   _   _   _   _   _   _";
});

// 🔹 Fonction pour mettre à jour le timer
function updateTimer() {
  const timerEl = document.getElementById("timer");
  if (!timerEl) return; // sécurité

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  timerEl.textContent = `${minutes}:${seconds}`;

  if (totalSeconds > 0) {
    totalSeconds--;
  } else {
    clearInterval(interval);
    timerEl.textContent = "⏰ TERMINÉ";
    lockInput();
  }
}

// 🔹 Fonction pour vérifier la réponse
function checkAnswer() {
  const result = document.getElementById("result");
  const input = document.getElementById("answer");
  if (!result || !input) return; // sécurité

  const userAnswer = input.value.toUpperCase();
  const correctAnswer = "DIJKSTRA";

  if (userAnswer === correctAnswer) {
    result.textContent = "✅ Accès autorisé";
    result.style.color = "#00ffcc";
    clearInterval(interval);
  } else {
    result.textContent = "❌ Incorrect";

    // 🔁 relance l'animation à chaque clic
    result.classList.remove("error");
    void result.offsetWidth; // hack pour reset l'animation
    result.classList.add("error");
  }
}

// 🔹 Fonction pour bloquer le champ de réponse
function lockInput() {
  const input = document.getElementById("answer");
  if (input) input.disabled = true;
}

// 🔹 Rendre checkAnswer accessible au bouton HTML
window.checkAnswer = checkAnswer;

// 🔹 Initialisation du timer
updateTimer();
const interval = setInterval(updateTimer, 1000);