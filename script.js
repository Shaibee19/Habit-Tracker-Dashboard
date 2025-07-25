

function updateDate() {
  const now = new Date(); // means that it will never change where "let" can change
  const days = [
    "Sunday", //'' "" both represent strings
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
    now.getMonth() + 1 // because Jan starts at 1 and not 0
  ).padStart(2, "0")}/${String(now.getDate()).padStart(
    2, // 2 numerical values
    "0" // no decimal places
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

// Load or retreive data from localStorage or use defaults
let habits = JSON.parse(
  // converting JSON to an object
  localStorage.getItem("dailyHabits") || JSON.stringify(defaultHabits) // converting JSON to a string
); // let = going to change over time || = OR
let streak = parseInt(localStorage.getItem("habitStreak") || "0"); // let the streak = 0 or the item habitStreak
let lastCompletedDate = localStorage.getItem("lastCompletedDate") || "";

// Save data to localStorage
function saveData() {
  localStorage.setItem("dailyHabits", JSON.stringify(habits));
  localStorage.setItem("habitStreak", streak.toString());
  localStorage.setItem("lastCompletedDate", lastCompletedDate);
}

// Render habits to the DOM
function renderHabits() {
  const container = document.getElementById("habits__container");
  container.innerHTML = "";
  habits.array.forEach((habit) => {
    const habitItem = document.createElement("div");
    habitItem.className = `habit__item ${habit.completed ? "completed" : ""}`; // either completed or not completed
    habitItem.innerHTML = `
            <div class="habit__checkbox ${habit.completed ? "checked" : ""}"
                onclick="toggleHabit(${habit.id})">
                ${habit.completed ? "✔️" : ""}
            </div> 
            <span class="habit__emoji">${habit.emoji}</span>
            <span class="habit__text">${habit.text}</span>
            ${
              habit.id > 7
                ? '<span onclick="deleteHabit(' + // ? if this is true
                  habit.id + // orange = static data || the pluses are b/c we've already added this dynamic data inside ${}
                  ')" style="margin-left: auto; cursor: pointer; color: #ff6b6b;">🗑️</span>'
                : "" // : if this is not true
            }
             `;
    container.appendChild(habitItem);
  });

  updateProgress();
}

// Toggle habit completion
function toggleHabit(id) {
  // id = external date we are going to pass into the function
  const habit = habits.find((h) => h.id === id); // trying to find the id that matches our from the load in local Storage
  if (habit) {
    habit.completed = !habit.completed; // this is actually toggling
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
    saveData(); // save to localStorage
    renderHabits(); // re render the new data
  }
}

// Update progress display
function updateProgress() {
  const completed = habits.filter((h) => h.completed).length;
  const total = habits.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  document.getElementById(
    "progress__text"
  ).textContent = `${completed}/${total} habits completed`;
  document.getElementById("progress__fill").style.width = `${percentage}%`;
  document.getElementById("streak").textContent = streak;

  // Change progress bar color based on completion
  const progressFill = document.getElementById("progress__fill");
  if (percentage === 100) {
    progressFill.style.background = "linear-gradient(90deg, #4caf50, #8bc34a)";
  } else if (percentage >= 75) {
    progressFill.style.background = "linear-gradient(90deg, #ff9800, #ffc107)";
  } else {
    progressFill.style.background =
      "linear-gradient(90deg, #8a2be2ff, #b450ffff)";
  }
}
