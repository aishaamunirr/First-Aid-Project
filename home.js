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

fetch("languages.json")
  .then(res => res.json())
  .then(data => {
    translations = data;
    applyTranslations(); // Apply default language
  })
  .catch(err => console.error("Failed to load translations:", err));


function changeLanguage() {
  const desktopSelect = document.getElementById("languageSelect");
  const mobileSelect = document.getElementById("languageSelect2");
  currentLang = desktopSelect.value;
  mobileSelect.value = currentLang; // sync mobile
  applyTranslations();
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.toggle('show');
  hamburger.classList.toggle('active');
}


function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const keys = el.getAttribute("data-i18n").split(".");
    let text = translations[currentLang];
    keys.forEach(k => { if (text) text = text[k]; });
    if (text) el.textContent = text;
  });
}
