// Toggle of nav menu

const menu = document.querySelector('.menu');
const navMenu = document.querySelector('.nav-menu');

menu.addEventListener('click', () => {
    event.stopPropagation()
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

window.addEventListener('click', () => {
    if(navMenu.classList.contains('active')){
        navMenu.classList.toggle('active');
        document.body.classList.remove('no-scroll');
    }
});