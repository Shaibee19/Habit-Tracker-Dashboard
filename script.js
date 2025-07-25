// global variables should go on top

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
  // converting JSON strings back to an array
  localStorage.getItem("dailyHabits") || JSON.stringify(defaultHabits) // converting JSON to a string
); // let = going to change over time || = OR
let streak = parseInt(localStorage.getItem("habitStreak") || "0"); // let the streak = 0 or the item habitStreak
let lastCompletedDate = localStorage.getItem("lastCompletedDate") || "";

// Save data to localStorage
function saveData() {
  localStorage.setItem("dailyHabits", JSON.stringify(habits)); // needs to be a string to be saved to localStorage
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

// Add custom habit
function addCustomHabit() {
  const text = prompt("Enter your custom habit:");
  if (text && text.trim()) {
    const emojis = ["✨", "🎯", "🔥", "💪", "🚀", "⭐", "🌟", "💎", "🎉", "🏆"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; // 0.678 * 10 = 6.78 = 6 .floor rounds down

    const newHabit = {
      id: Date.now(),
      emoji: randomEmoji,
      text: text.trim(), // making sure no empty spaces
      completed: false,
      category: "custom",
    };

    habits.push(newHabit); // the habit just getting created will be pushed as a newHabit element to the "habits" in the localStorage
    saveData();
    renderHabits(); // turning this JS back into HTML adds default 7, as well

    // Show success message
    showMessage("New habit added successfully! 🥳");
  }
}

// Delete custom habit
function deleteHabit(id) {
  if (confirm("Are you sure you want to delete this habit?")) {
    habits = habits.filter((h) => h.id !== id);
    saveData();
    renderHabits();
    showMessage("Habit deleted successfully! 🗑️");
  }
}

// Reset habits function
function resetHabits() {
  if (confirm("Are you sure you want to reset all habits?")) {
    habits = forEach((habit) => (habit.completed = false)); // going through all of the habits and checking if they are completed and changing it to false'not completed
    saveData();
    renderHabits();
    showMessage("All habits reset! Ready for a fresh start! 🔁");
  }
}

// Show celebration animation
function showCelebration() {
  const celebration = document.createElement("div"); // creating HTML
  celebration.innerHTML = "🎊 All habits completed! Streak: " + streak + " days! 🎊";
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    animation: bounce 0.5 ease-in-out;
    `;
  document.body.appendChild(celebration);
  setTimeout(() =>)
}

// Show temporary message
function showMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = "🎊 All habits completed! Streak: " + streak + " days! 🎊";
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    animation: bounce 0.5 ease-in-out;
    `;
  document.body.appendChild(celebration);
  setTimeout(() =>)
}

// Initialize the app
function initApp() {
  updateDate();
  renderHabits();

  // Check if it's a new day and reset if needed
  const today = new Date().toDateString();
  const lastActiveDate = localStorage.getItem("lastActiveDate") || "";

  if (lastActiveDate !== today) {
    // if this runs it means it is a new day
    habits.forEach((habit) => (habit.completed = false));
    localStorage.setItem("lastActiveDate", today);
    saveData();
    renderHabits();
  }
}

initApp();

setInterval(updateDate, 60000) // in msec so only 6 min - to continuously check if the date has been updated
