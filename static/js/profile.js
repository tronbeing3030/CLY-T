// Contact info popup toggle functionality

const contactBtn = document.getElementsByClassName('contact-btn');
const contactInfo = document.getElementById('contact-info');

contactBtn[0].addEventListener('click', function(event) {
    event.stopPropagation();
    if(!contactInfo.classList.contains('visible')){
        contactInfo.classList.add('visible');
    } else{
        contactInfo.classList.remove('visible');
    }
});

contactInfo.addEventListener('click', (event) => {
    event.stopPropagation();
})

window.addEventListener('click', (event) => {
    if(contactInfo.classList.contains('visible') && event.target !== contactInfo){
        contactInfo.classList.remove('visible');
    }
});

 document.addEventListener('DOMContentLoaded', () => {
    const flashes = document.querySelectorAll('.toast');
    if (!flashes.length) return;

    setTimeout(() => {
        flashes.forEach(f => f.remove());
    }, 6000);
});