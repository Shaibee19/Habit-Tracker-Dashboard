/** -----------------
 * KAT STARTS HERE
 * ----------------- **/

// Initialize date display
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  document.getElementById("currentDay").textContent = days[now.getDay()];
  document.getElementById("currentDate").textContent = `${String(
    now.getDate()
  ).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}/${now.getFullYear()}`;
}

// Default habits with better variety
const defaultHabits = [
  {
    id: 1,
    emoji: "💧",
    text: "Drink 8 glasses of water",
    completed: false,
    category: "health",
  },
  {
    id: 2,
    emoji: "🏃",
    text: "Exercise for 30 minutes",
    completed: false,
    category: "fitness",
  },
  {
    id: 3,
    emoji: "😴",
    text: "Sleep 8 hours",
    completed: false,
    category: "health",
  },
  {
    id: 4,
    emoji: "📚",
    text: "Read for 20 minutes",
    completed: false,
    category: "learning",
  },
  {
    id: 5,
    emoji: "🧘",
    text: "Meditate for 10 minutes",
    completed: false,
    category: "wellness",
  },
  {
    id: 6,
    emoji: "🥗",
    text: "Eat healthy meals",
    completed: false,
    category: "health",
  },
  {
    id: 7,
    emoji: "📱",
    text: "Limit screen time",
    completed: false,
    category: "productivity",
  },
];

// Load data from localStorage or use defaults
let habits = JSON.parse(
  localStorage.getItem("dailyHabits") || JSON.stringify(defaultHabits)
);
let streak = parseInt(localStorage.getItem("habitStreak") || "0");
let lastCompletedDate = localStorage.getItem("lastCompletedDate") || "";

// Save data to localStorage
function saveData() {
  localStorage.setItem("dailyHabits", JSON.stringify(habits));
  localStorage.setItem("habitStreak", streak.toString());
  localStorage.setItem("lastCompletedDate", lastCompletedDate);
}

// Render habits to the DOM
function renderHabits() {
  const container = document.getElementById("habits-container");
  container.innerHTML = "";

  habits.forEach((habit) => {
    const habitItem = document.createElement("div");
    habitItem.className = `habit-item ${habit.completed ? "completed" : ""}`;
    habitItem.innerHTML = `
            <div class="habit-checkbox ${
              habit.completed ? "checked" : ""
            }" onclick="toggleHabit(${habit.id})">
              ${habit.completed ? "✓" : ""}
            </div>
            <span class="habit-emoji">${habit.emoji}</span>
            <span class="habit-text">${habit.text}</span>
            ${
              habit.id > 7
                ? '<span onclick="deleteHabit(' +
                  habit.id +
                  ')" style="margin-left: auto; cursor: pointer; color: #ff6b6b;">🗑️</span>'
                : ""
            }
          `;
    container.appendChild(habitItem);
  });

  updateProgress();
}

// Toggle habit completion
function toggleHabit(id) {
  const habit = habits.find((h) => h.id === id);
  if (habit) {
    habit.completed = !habit.completed;

    // Check if all habits are completed
    const allCompleted = habits.every((h) => h.completed);
    if (allCompleted) {
      const today = new Date().toDateString();
      if (lastCompletedDate !== today) {
        streak++;
        lastCompletedDate = today;
        showCelebration();
      }
    }

    saveData();
    renderHabits();
  }
}

// Update progress display
function updateProgress() {
  const completed = habits.filter((h) => h.completed).length;
  const total = habits.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  document.getElementById(
    "progress-text"
  ).textContent = `${completed}/${total} habits completed`;
  document.getElementById("progress-fill").style.width = `${percentage}%`;
  document.getElementById("streak").textContent = streak;

  // Change progress bar color based on completion
  const progressFill = document.getElementById("progress-fill");
  if (percentage === 100) {
    progressFill.style.background = "linear-gradient(90deg, #4caf50, #8bc34a)";
  } else if (percentage >= 75) {
    progressFill.style.background = "linear-gradient(90deg, #ff9800, #ffc107)";
  } else {
    progressFill.style.background =
      "linear-gradient(90deg, rgb(138, 43, 226), rgb(180, 80, 255))";
  }
}

/** -----------------
 * VICTOR STARTS HERE
 * ----------------- **/

// Start here...