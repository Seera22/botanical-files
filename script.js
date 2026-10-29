
const cases = [
  {
    title: "The Mystery of the Growing Shoot",
    scenario:
      "A young plant becomes taller every week. Its roots also extend deeper into the soil. The investigator must identify the tissue responsible.",
    evidence:
      "Evidence A: New cells are produced at the tips of shoots and roots.",
    question:
      "Which meristem is mainly responsible for this increase in length?",
    options: [
      "Lateral meristem",
      "Apical meristem",
      "Intercalary meristem",
      "Epidermal tissue"
    ],
    answer: 1,
    explanation:
      "Apical meristems at root and shoot tips contribute to primary growth, increasing plant length."
  },
  {
    title: "The Expanding Tree Trunk",
    scenario:
      "A tree that was once thin now has a much thicker trunk. The investigator examines the tissues responsible for this change.",
    evidence:
      "Evidence B: New tissues are added around the sides of stems and roots.",
    question:
      "Which meristem is mainly responsible for this increase in thickness?",
    options: [
      "Apical meristem",
      "Intercalary meristem",
      "Lateral meristem",
      "Root cap"
    ],
    answer: 2,
    explanation:
      "Lateral meristems contribute to secondary growth, increasing the thickness of stems and roots."
  },
  {
    title: "The Grass Reboot",
    scenario:
      "Cows eat the upper parts of grass in a field. Days later, the grass grows again. How can the grass regrow after being grazed?",
    evidence:
      "Evidence C: In many grasses, intercalary meristems remain near the bases of leaves or internodes.",
    question:
      "Which meristem helps many grasses regrow after grazing?",
    options: [
      "Apical meristem",
      "Lateral meristem",
      "Intercalary meristem",
      "Xylem"
    ],
    answer: 2,
    explanation:
      "Intercalary meristems allow many grasses to regrow from remaining growth regions near the base."
  }
];

// GAME PROGRESS
let currentCase = 0;
let answered = false;

// Progress is saved while this page remains open.
const solvedCases = [false, false, false];

function getScore() {
  return solvedCases.filter(Boolean).length;
}

function getCaseStatus(index) {
  return solvedCases[index] ? "CASE SOLVED" : "UNDER INVESTIGATION";
}

function openCase(index) {
  if (index < 0 || index >= cases.length) return;

  currentCase = index;
  answered = false;

  const item = cases[index];
  const status = getCaseStatus(index);

  document.getElementById("report").innerHTML = `
    <div class="file-header">
      <span class="file-stamp">CONFIDENTIAL</span>
      <span class="file-number">FILE NO. 00${index + 1}</span>
    </div>

    <p class="eyebrow">BOTANICAL INVESTIGATION UNIT</p>
    <h3>${item.title}</h3>

    <div class="report-meta">
      <div>
        <span>CASE STATUS</span>
        <strong id="case-status">${status}</strong>
      </div>
      <div>
        <span>SUBJECT</span>
        <strong>PLANT GROWTH</strong>
      </div>
    </div>

    <div class="report-divider"></div>

    <h4>01 / CASE BRIEFING</h4>
    <p>${item.scenario}</p>

    <h4>02 / EVIDENCE LOG</h4>
    <div class="evidence-entry">
      <div class="evidence-number">E-01</div>
      <div>
        <strong>OBSERVED EVIDENCE</strong>
        <p>${item.evidence}</p>
      </div>
    </div>

    <div class="investigator-note">
      <span>INVESTIGATOR'S NOTE</span>
      <p>Analyse the evidence carefully. What biological process could explain this observation?</p>
    </div>

    ${
      solvedCases[index]
        ? `<p class="case-success">✓ THIS CASE HAS BEEN SOLVED.</p>`
        : `<p class="report-warning">⚠ DO NOT SUBMIT YOUR CONCLUSION BEFORE EXAMINING THE EVIDENCE.</p>`
    }
  `;

  document.getElementById("quiz").hidden = true;
  document.getElementById("investigation").hidden = false;

  document.getElementById("investigation").scrollIntoView({
    behavior: "smooth"
  });
}

function startQuiz() {
  const item = cases[currentCase];
  answered = false;

  const quiz = document.getElementById("quiz");
  quiz.hidden = false;

  quiz.innerHTML = `
    <p class="eyebrow">INVESTIGATOR CHALLENGE</p>

    <div class="game-progress">
      <span>CASE 00${currentCase + 1} / 003</span>
      <span id="score-display">SCORE: ${getScore()}/3</span>
    </div>

    <h3>${item.question}</h3>

    <div id="options"></div>

    <div id="feedback" aria-live="polite"></div>
    <div id="next"></div>
  `;

  const options = document.getElementById("options");

  item.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "quiz-option";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    button.onclick = () => checkAnswer(index);
    options.appendChild(button);
  });

  quiz.scrollIntoView({ behavior: "smooth" });
}

function checkAnswer(index) {
  if (answered) return;
  answered = true;

  const item = cases[currentCase];
  const buttons = document.querySelectorAll(".quiz-option");
  const feedback = document.getElementById("feedback");

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;

    if (buttonIndex === item.answer) {
      button.classList.add("answer-correct");
    } else if (buttonIndex === index) {
      button.classList.add("answer-incorrect");
    }
  });

  const isCorrect = index === item.answer;

  if (isCorrect) {
    solvedCases[currentCase] = true;
updateAchievementDashboard();
    feedback.className = "feedback feedback-correct";
    feedback.innerHTML = `
      <div class="feedback-heading">✓ CASE SOLVED</div>
      <p><strong>Correct answer: ${item.options[item.answer]}</strong></p>
      <p>${item.explanation}</p>
    `;

    const status = document.getElementById("case-status");

    if (status) {
      status.textContent = "CASE SOLVED";
      status.classList.add("status-solved");
    }
  } else {
    feedback.className = "feedback feedback-incorrect";
    feedback.innerHTML = `
      <div class="feedback-heading">✕ EVIDENCE MISMATCH</div>
      <p><strong>Correct answer: ${item.options[item.answer]}</strong></p>
      <p>${item.explanation}</p>
      <p>Review the evidence and investigate this case again.</p>
    `;
  }

  document.getElementById("score-display").textContent =
    `SCORE: ${getScore()}/3`;

  const solvedCount = getScore();
  const next = document.getElementById("next");

  if (solvedCount === cases.length) {
    next.innerHTML = `
      <div class="final-result">
        <p class="eyebrow">INVESTIGATION COMPLETE</p>
        <h3>ALL CASES SOLVED</h3>
        <p>You have successfully solved all three botanical cases.</p>
        <div class="final-score">${solvedCount} / ${cases.length}</div>
        <p>Perfect investigation! All evidence has been analysed.</p>
      </div>

      <button class="primary-btn" onclick="backToCases()">
        RETURN TO CASE FILES →
      </button>
    `;
  } else {
    next.innerHTML = `
      <div class="score-summary">
        <span>CASES SOLVED</span>
        <strong>${solvedCount} / ${cases.length}</strong>
        <div class="score-track">
          <div class="score-fill" style="width: ${(solvedCount / cases.length) * 100}%"></div>
        </div>
      </div>

      ${
        isCorrect
          ? `<p class="result-note">Evidence confirmed. Your investigation score has been updated.</p>`
          : `<p class="result-note">No point awarded this time. You can reopen this case to try again.</p>`
      }

      <button class="primary-btn" onclick="backToCases()">
        RETURN TO CASE FILES →
      </button>
    `;
  }
}

function backToCases() {
  document.getElementById("investigation").hidden = true;
  document.getElementById("cases").scrollIntoView({
    behavior: "smooth"
  });
}

function startInvestigation() {
  document.getElementById("cases").scrollIntoView({
    behavior: "smooth"
  });
}
// ===== UPDATE ACHIEVEMENT DASHBOARD =====

function updateAchievementDashboard() {
  const solvedCount = getScore();
  const percentage = Math.round((solvedCount / cases.length) * 100);

  document.getElementById("dashboard-solved").innerHTML =
    `${solvedCount} <small>/ ${cases.length}</small>`;

  document.getElementById("dashboard-percent").textContent =
    `${percentage}%`;

  document.getElementById("dashboard-remaining").textContent =
    cases.length - solvedCount;

  document.getElementById("dashboard-progress-label").textContent =
    `${solvedCount} OF ${cases.length} COMPLETE`;

  document.getElementById("dashboard-progress-fill").style.width =
    `${percentage}%`;

  const rank = document.getElementById("investigator-rank");
  const icon = document.getElementById("rank-icon");

  if (solvedCount === 3) {
    rank.textContent = "MASTER BOTANICAL DETECTIVE";
    icon.textContent = "🏆";
  } else if (solvedCount === 2) {
    rank.textContent = "EXPERT INVESTIGATOR";
    icon.textContent = "🕵️";
  } else if (solvedCount === 1) {
    rank.textContent = "FIELD INVESTIGATOR";
    icon.textContent = "🔬";
  } else {
    rank.textContent = "ROOKIE INVESTIGATOR";
    icon.textContent = "🔎";
  }

  cases.forEach((item, index) => {
    const mission = document.getElementById(`mission-${index}`);
    const status = mission.querySelector(".mission-status");
    const tag = mission.querySelector(".mission-tag");

    if (solvedCases[index]) {
      mission.classList.add("mission-complete");
      status.textContent = "✓";
      tag.textContent = "COMPLETED";
    } else {
      mission.classList.remove("mission-complete");
      status.textContent = "○";
      tag.textContent = "PENDING";
    }
  });
}
// Set the initial dashboard values when the page loads.
document.addEventListener("DOMContentLoaded", updateAchievementDashboard);