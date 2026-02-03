// ============================
// DONNÉES COURANTES
// ============================
let counters = {
  pushups: 0,
  knees: 0,
  squats: 0,
  baby: 0
};

// ============================
// INCRÉMENT
// ============================
function increment(type) {
  counters[type]++;
  document.getElementById(type).textContent = counters[type];
}

// ============================
// ENREGISTREMENT (SAFE)
// ============================
function saveSession() {
  const now = new Date();

  const entry = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    pushups: counters.pushups,
    knees: counters.knees,
    squats: counters.squats,
    baby: counters.baby
  };

  const history =
    JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  history.push(entry);

  // 🔒 clé UNIQUE et STABLE → données conservées même si le code change
  localStorage.setItem("fitnessHistory", JSON.stringify(history));

  counters = { pushups: 0, knees: 0, squats: 0, baby: 0 };
  updateUI();
  renderLog();
}

// ============================
// UI
// ============================
function updateUI() {
  Object.keys(counters).forEach(key => {
    document.getElementById(key).textContent = counters[key];
  });
}

// ============================
// JOURNAL
// ============================
function renderLog() {
  const log = document.getElementById("log");
  const history =
    JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  log.innerHTML = "";

  history.slice().reverse().forEach(e => {
    log.innerHTML += `
      <div>
        <strong>${e.date} – ${e.time}</strong><br>
        💪 Pompes: ${e.pushups} |
        🦵 Genoux: ${e.knees} |
        🏋️ Squats: ${e.squats} |
        🪑 Baby: ${e.baby}
        <hr>
      </div>
    `;
  });
}

// ============================
// STATISTIQUES
// ============================
function toggleStats() {
  const statsDiv = document.getElementById("stats");
  statsDiv.style.display =
    statsDiv.style.display === "none" ? "block" : "none";

  if (statsDiv.style.display === "block") {
    renderStats();
  }
}

function renderStats() {
  const statsDiv = document.getElementById("stats");
  const history =
    JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  if (history.length === 0) {
    statsDiv.innerHTML = "<p>Aucune donnée enregistrée.</p>";
    return;
  }

  // REGROUPEMENT PAR JOUR (SAFE)
  const daily = {};

  history.forEach(e => {
    if (!daily[e.date]) {
      daily[e.date] = { pushups: 0, knees: 0, squats: 0, baby: 0 };
    }
    daily[e.date].pushups += e.pushups || 0;
    daily[e.date].knees += e.knees || 0;
    daily[e.date].squats += e.squats || 0;
    daily[e.date].baby += e.baby || 0;
  });

  let html = `
    <h2>📈 Évolution par jour</h2>
    <table>
      <tr>
        <th>Date</th>
        <th>💪 Pompes</th>
        <th>🦵 Genoux</th>
        <th>🏋️ Squats</th>
        <th>🪑 Baby</th>
      </tr>
  `;

  Object.keys(daily).sort().forEach(date => {
    const d = daily[date];
    html += `
      <tr>
        <td>${date}</td>
        <td>${d.pushups}</td>
        <td>${d.knees}</td>
        <td>${d.squats}</td>
        <td>${d.baby}</td>
      </tr>
    `;
  });

  html += "</table>";
  statsDiv.innerHTML = html;
}

// ============================
// INIT
// ============================
renderLog();
