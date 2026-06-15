// Quantity varying functionality

const quan = document.getElementById('quantity');
const minusBtn = document.getElementById('minus');
const plusBtn = document.getElementById('plus');

minusBtn.addEventListener('click', () => {
    quan.value = Math.max(1, parseInt(quan.value) - 1);
});
plusBtn.addEventListener('click', () => {
    quan.value = Math.min(999999, (parseInt(quan.value) + 1));
});

// Popup elements

const popup = document.querySelector('.popup');
const popupCont = document.querySelector('.popup-cont');
const okBtn = document.getElementById('ok-btn');
const popHeader = document.getElementById('pop-header');
const popHead = document.getElementById('pop-head');
const popInfo = document.getElementById('pop-info');

// SVG strings

const alertSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z"></path></svg>`;
const ecoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.998 3V5C20.998 14.6274 15.6255 19 8.99805 19L7.0964 18.9999C7.3079 15.9876 8.24541 14.1648 10.6939 11.9989C11.8979 10.9338 11.7965 10.3189 11.2029 10.6721C7.1193 13.1016 5.09114 16.3862 5.00119 21.6302L4.99805 22H2.99805C2.99805 20.6373 3.11376 19.3997 3.34381 18.2682C3.1133 16.9741 2.99805 15.2176 2.99805 13C2.99805 7.47715 7.4752 3 12.998 3C14.998 3 16.998 4 20.998 3Z"></path></svg>`;
const aiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path></svg>`;

const customSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"></path></svg>`;  // Star icon example

// Reusable function to show popup with custom SVG

function showPopup(svgHtml, title, message, borderColor, shadowColor, buttonColor) {
    const existingSvgs = popHeader.querySelectorAll('svg');
    
    existingSvgs.forEach(svg => svg.remove());
    if (svgHtml) {
        popHeader.insertAdjacentHTML('afterbegin', svgHtml);
    }
    
    popHead.textContent = title;
    popInfo.textContent = message;
    popup.style.opacity = '1';
    popup.style.visibility = 'visible';
    popup.style.transform = 'scale(1)';
    popupCont.style.borderColor = borderColor;
    popupCont.style.boxShadow = `0 0 10px 0 ${shadowColor}`;
    okBtn.style.backgroundColor = buttonColor;
    okBtn.style.borderColor = buttonColor;
}

// Buy Now button popup

const buyBtn = document.getElementById('buy-btn');
buyBtn.addEventListener('click', () => {
    showPopup(
        alertSvg,
        'Feature Not Available',
        'We have not implemented this feature yet because our focus has been on stabilizing core functionality. Adding it prematurely could create unnecessary complexity, so we are waiting for more user feedback to ensure it meets real needs.',
        'var(--accent)',
        '#ffc00040',
        'var(--accent)'
    );
});

// Eco-friendly icon popup

// const ecoBtn = document.getElementById('eco-btn');
// ecoBtn.addEventListener('click', () => {
//     showPopup(
//         ecoSvg,
//         'Eco-Friendly Product',
//         'This product is designed with sustainability in mind, using environmentally friendly materials and processes to minimize its impact on the planet.',
//         'var(--success)',
//         '#00ff8840',
//         'var(--success)'
//     );
// });

// AI-warning icon popup

// const aiBtn = document.getElementById('ai-btn');
// aiBtn.addEventListener('click', () => {
//     showPopup(
//         aiSvg,
//         'AI-Generated Design',
//         'This product features designs created with the assistance of artificial intelligence, ensuring innovative and unique aesthetics that stand out.',
//         'var(--danger)',
//         '#ff004440',
//         'var(--danger)'
//     );
// });

// OK button to close popup

okBtn.addEventListener('click', () => {
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
});

window.addEventListener('click', closePopupOnOutsideClick);

function closePopupOnOutsideClick(event) {

    // Close the popup if clicked only outside of it

    if (event.target === popup) {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
    }
}


// Contact Artisan button functionality

const contactBtn = document.getElementById('contact');
const contactPopup = document.getElementById('cont-popup');
const closeBtn = document.getElementById('close-btn');

contactBtn.addEventListener('click', () => {
    contactPopup.style.opacity = '1';
    contactPopup.style.visibility = 'visible';
    contactPopup.style.transform = 'scale(1)';
});

closeBtn.addEventListener('click', () => {
    contactPopup.style.opacity = '0';
    contactPopup.style.visibility = 'hidden';
});

window.addEventListener('click', closeOnOutsideClick);

function closeOnOutsideClick(event) {

    // Close the contact popup if clicked only outside of it

    if (event.target === contactPopup) {
        contactPopup.style.opacity = '0';
        contactPopup.style.visibility = 'hidden';
    }
}

 document.addEventListener('DOMContentLoaded', () => {
    const flashes = document.querySelectorAll('.toast');
    if (!flashes.length) return;

    setTimeout(() => {
        flashes.forEach(f => f.remove());
    }, 6000);
});