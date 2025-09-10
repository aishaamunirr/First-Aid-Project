function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    menu.classList.toggle('show');
    hamburger.classList.toggle('active');
}