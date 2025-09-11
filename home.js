// const toggleBtn = document.getElementById("theme-toggle");
// const body = document.body;
// if (localStorage.getItem("theme") == "dark") {
//     body.classList.add("dark");
//     toggleBtn.textContent = "Light Mode";
// }
// toggleBtn.addEventListener("click", () =>{
//     body.classList.toggle("dark");
//     const darkModeon = body.classList.contains("dark");

//     toggleBtn.textContent = darkModeon ? "Light Mode" : "Dark Mode";
//     localStorage.setItem("theme", darkModeon ? "dark" : "light");
// });

// function toggleMenu() {
//     const menu = document.getElementById('mobileMenu');
//     const hamburger = document.querySelector('.hamburger');
//     menu.classList.toggle('show');
//     hamburger.classList.toggle('active');
// }
// let translations = {};
// let currentLang = "en";

// fetch("languages.json")
//   .then(res => res.json())
//   .then(data => {
//     translations = data;
//     applyTranslations(); 
//   })
//   .catch(err => console.error("Error loading translations:", err));
  


// function changeLanguage() {
//   const select = document.getElementById("languageSelect");
//   currentLang = select.value;
//   applyTranslations();
// }

// function applyTranslations() {
//   document.querySelectorAll("[data-i18n]").forEach(el => {
//     const keys = el.getAttribute("data-i18n").split(".");
//     let text = translations[currentLang];
//     keys.forEach(k => { if (text) text = text[k]; });
//     if (text) el.textContent = text;
//   });
// }

let translations = {};
let currentLang = "en";

// Load translations
fetch("languages.json")
  .then(res => res.json())
  .then(data => {
    translations = data;
    applyTranslations();
  })
  .catch(err => console.error("Failed to load translations:", err));

// Language change
function changeLanguage() {
  const desktopSelect = document.getElementById("languageSelect");
  const mobileSelect = document.getElementById("languageSelect2");
  currentLang = desktopSelect.value;
  mobileSelect.value = currentLang; // sync mobile
  applyTranslations();
}

// Toggle mobile menu
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  menu.classList.toggle("show");
  hamburger.classList.toggle("active");
}

// Apply translations
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const keys = el.getAttribute("data-i18n").split(".");
    let text = translations[currentLang];
    keys.forEach(k => { if (text) text = text[k]; });
    if (text) el.textContent = text;
  });
}

// First aid data
let firstAidData = {};

async function fetchFirstAidData() {
  try {
    const response = await fetch("data.json");
    firstAidData = await response.json();
    console.log("First aid data loaded successfully");
  } catch (error) {
    console.error("Error loading first aid data:", error);
  }
}

// Show emergency info
function showEmergency(category, subcategory) {
  if (Object.keys(firstAidData).length === 0) {
    alert("First aid data is still loading. Please try again in a moment.");
    return;
  }

  const modal = document.getElementById("emergencyModal");
  const modalTitle = document.getElementById("modalTitle");
  const stepsList = document.getElementById("stepsList");
  const keyRule = document.getElementById("keyRule");

  stepsList.innerHTML = "";
  keyRule.innerHTML = "";

  modalTitle.textContent = subcategory.replace(/_/g, " ");
  const emergency = firstAidData[category][subcategory];

  if (emergency && emergency.steps) {
    emergency.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });
  }

  if (emergency && emergency.key_rule) {
    keyRule.innerHTML = `<strong>Key Rule:</strong> ${emergency.key_rule}`;
  }

  modal.style.display = "block";
}

// Close modal
function closeModal() {
  const modal = document.getElementById("emergencyModal");
  modal.style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("emergencyModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  fetchFirstAidData();

  const languageSelect = document.getElementById("languageSelect");
  const languageSelect2 = document.getElementById("languageSelect2");

  if (languageSelect && languageSelect2) {
    languageSelect2.addEventListener("change", () => {
      languageSelect.value = languageSelect2.value;
      changeLanguage();
    });

    languageSelect.addEventListener("change", () => {
      languageSelect2.value = languageSelect.value;
      changeLanguage();
    });
  }
});
