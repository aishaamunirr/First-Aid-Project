let translations = {};
let firstAidData = {};
let currentLang = "en";

// Load translations
fetch("languages.json")
  .then(res => res.json())
  .then(data => {
    translations = data;
    applyTranslations();
  })
  .catch(err => console.error("Failed to load translations:", err));

// Load first aid data
async function fetchFirstAidData() {
  try {
    const response = await fetch("data.json");
    firstAidData = await response.json();
    console.log("First aid data loaded successfully");
  } catch (error) {
    console.error("Error loading first aid data:", error);
  }
}

function changeLanguage() {
  const desktopSelect = document.getElementById("languageSelect");
  const mobileSelect = document.getElementById("languageSelect2");
  
  // Get current language from the selector that triggered the change
  currentLang = desktopSelect.value;
  
  // Sync both selectors
  mobileSelect.value = currentLang;
  
  applyTranslations();
  
  // If modal is open, refresh its content with new language
  const modal = document.getElementById("emergencyModal");
  if (modal.style.display === "block") {
    // Get current modal title to determine which emergency is showing
    const modalTitle = document.getElementById("modalTitle").textContent;
    // Find and re-display the emergency info in new language
    refreshModalContent();
  }
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");
  menu.classList.toggle("show");
  hamburger.classList.toggle("active");
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const keys = el.getAttribute("data-i18n").split(".");
    let text = translations[currentLang];
    keys.forEach(k => { if (text) text = text[k]; });
    if (text) el.textContent = text;
  });
}

// Store current emergency info for modal refresh
let currentEmergencyInfo = null;

function showEmergency(category, subcategory) {
  if (Object.keys(firstAidData).length === 0) {
    alert("First aid data is still loading. Please try again in a moment.");
    return;
  }

  // Store current emergency info for language switching
  currentEmergencyInfo = { category, subcategory };

  const modal = document.getElementById("emergencyModal");
  const modalTitle = document.getElementById("modalTitle");
  const stepsList = document.getElementById("stepsList");
  const keyRule = document.getElementById("keyRule");

  stepsList.innerHTML = "";
  keyRule.innerHTML = "";

  // Set title (replace underscores with spaces)
  modalTitle.textContent = subcategory.replace(/_/g, " ");
  
  // Get emergency data in current language
  const emergency = firstAidData[currentLang][category][subcategory];

  if (emergency && emergency.steps) {
    emergency.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });
  }

  if (emergency && emergency.key_rule && emergency.key_rule !== "None") {
    const keyRuleTitle = translations[currentLang]?.modal?.key_rule_title || "Key Rule:";
    keyRule.innerHTML = `<strong>${keyRuleTitle}</strong> ${emergency.key_rule}`;
  }

  modal.style.display = "block";
}

function refreshModalContent() {
  if (currentEmergencyInfo) {
    showEmergency(currentEmergencyInfo.category, currentEmergencyInfo.subcategory);
  }
}

function closeModal() {
  const modal = document.getElementById("emergencyModal");
  modal.style.display = "none";
  currentEmergencyInfo = null;
}

window.onclick = function(event) {
  const modal = document.getElementById("emergencyModal");
  if (event.target === modal) {
    closeModal();
  }
};

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