let counters = {
  pushups: 0,
  knees: 0,
  squats: 0,
  baby: 0
};

function increment(type) {
  counters[type]++;
  document.getElementById(type).textContent = counters[type];
}

function saveSession() {
  const now = new Date();
  const entry = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    ...counters
  };

  let history = JSON.parse(localStorage.getItem("fitnessHistory")) || [];
  history.push(entry);
  localStorage.setItem("fitnessHistory", JSON.stringify(history));

  counters = { pushups: 0, knees: 0, squats: 0, baby: 0 };
  updateUI();
  renderLog();
}

function updateUI() {
  for (let key in counters) {
    document.getElementById(key).textContent = counters[key];
  }
}

function renderLog() {
  const log = document.getElementById("log");
  const history = JSON.parse(localStorage.getItem("fitnessHistory")) || [];

  log.innerHTML = "";

  history.slice().reverse().forEach(e => {
    log.innerHTML += `
      <div>
        <strong>${e.date} – ${e.time}</strong><br>
        💪 Pompes: ${e.pushups},
        🦵 Genoux: ${e.knees},
        🏋️ Squats: ${e.squats},
        🪑 Baby: ${e.baby}
        <hr>
      </div>
    `;
  });
}

renderLog();
