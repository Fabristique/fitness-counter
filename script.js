// ===============================
// COMPTEURS ACTUELS
// ===============================
let counters = {
  pushups: 0,
  knees: 0,
  squats: 0,
  baby: 0,
  bikeMinutes: 0
};

// ===============================
// INCRÉMENTATION
// ===============================
function increment(type) {
  counters[type]++;
  updateUI();
}

// ===============================
// MISE À JOUR UI
// ===============================
function updateUI() {
  for (let key in counters) {
    document.getElementById(key).textContent = counters[key];
  }
}

// ===============================
// SAUVEGARDE SESSION
// ===============================
function saveSession() {
  const now = new Date();

  const entry = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    pushups: counters.pushups,
    knees: counters.knees,
    squats: counters.squats,
    baby: counters.baby,
    bikeMinutes: counters.bikeMinutes
  };

  let history = JSON.parse(localStorage.getItem("fitnessHistory")) || [];
  history.push(entry);
  localStorage.setItem("fitnessHistory", JSON.stringify(history));

  counters = {
    pushups: 0,
    knees: 0,
    squats: 0,
    baby: 0,
    bikeMinutes: 0
  };

  updateUI();
  renderLog();
  renderStats();
}

// ===============================
// JOURNAL
// ===============================
function renderLog() {
  const log = document.getElementById("log");
  const history = JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  log.innerHTML = "";

  history.slice().reverse().forEach(e => {
    log.innerHTML += `
      <div>
        <strong>${e.date} – ${e.time}</strong><br>
        💪 Pompes: ${e.pushups || 0} |
        🦵 Genoux: ${e.knees || 0} |
        🏋️ Squats: ${e.squats || 0} |
        🪑 Baby: ${e.baby || 0} |
        🚴 Vélo: ${e.bikeMinutes || 0} min
        <hr>
      </div>
    `;
  });
}

// ===============================
// STATISTIQUES
// ===============================
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
  const history = JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  if (history.length === 0) {
    statsDiv.innerHTML = "<p>Aucune donnée enregistrée.</p>";
    return;
  }

  const daily = {};

  history.forEach(e => {
    if (!daily[e.date]) {
      daily[e.date] = {
        pushups: 0,
        knees: 0,
        squats: 0,
        baby: 0,
        bikeMinutes: 0
      };
    }

    daily[e.date].pushups += e.pushups || 0;
    daily[e.date].knees += e.knees || 0;
    daily[e.date].squats += e.squats || 0;
    daily[e.date].baby += e.baby || 0;
    daily[e.date].bikeMinutes += e.bikeMinutes || 0;
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
        <th>🚴 Vélo (min)</th>
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
        <td>${d.bikeMinutes}</td>
      </tr>
    `;
  });

  html += "</table>";
  statsDiv.innerHTML = html;
}

// ===============================
// INIT
// ===============================
renderLog();
updateUI();
