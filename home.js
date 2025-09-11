let translations = {};
let firstAidData = {};
// let currentLang = "en";
let currentLang = localStorage.getItem("selectedLang") || "en";


fetch("languages.json")
  .then(res => res.json())
  .then(data => {
    translations = data;
    applyTranslations();

    localStorage.setItem("selectedLang", currentLang);
  })

  .catch(err => console.error("Failed to load translations:", err));

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
  
  
  currentLang = desktopSelect.value;
  mobileSelect.value = currentLang;
  localStorage.setItem("selectedLang", currentLang);
  
  applyTranslations();
  
  const modal = document.getElementById("emergencyModal");
  if (modal.style.display === "block") {
    const modalTitle = document.getElementById("modalTitle").textContent;
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


let currentEmergencyInfo = null;

function showEmergency(category, subcategory) {
  if (Object.keys(firstAidData).length === 0) {
    alert("First aid data is still loading. Please try again in a moment.");
    return;
  }


  currentEmergencyInfo = { category, subcategory };

  const modal = document.getElementById("emergencyModal");
  const modalTitle = document.getElementById("modalTitle");
  const stepsList = document.getElementById("stepsList");
  const keyRule = document.getElementById("keyRule");

  stepsList.innerHTML = "";
  keyRule.innerHTML = "";


  modalTitle.textContent = subcategory.replace(/_/g, " ");
  

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

    languageSelect.value = currentLang;
    languageSelect2.value = currentLang;
    
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