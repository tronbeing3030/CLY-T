// Searching in real time functionality

const searchBox = document.getElementById('search');
const prodName = document.getElementsByClassName('prod-name');

const prods = Array.from(prodName);

searchBox.addEventListener('input', () => {
    prods.forEach(prod => {
        var checkProd = prod.innerHTML.toLowerCase().includes(searchBox.value.toLowerCase());
        if(searchBox.value === '') {
            prod.parentElement.style.display = 'flex';
        } else {
            prod.parentElement.style.display = (checkProd) ? 'flex': 'none';
        }        
    });
});


// Filter popup animations

const filterIcon = document.getElementById('filter-icon');
const filterPopup = document.getElementById('filter-popup');

filterIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    filterPopup.classList.toggle('visible');
    filterIcon.classList.toggle('active');
});

window.addEventListener('click', (event) => {
    if(filterPopup.classList.contains('visible') && event.target !== filterPopup){ 
        filterPopup.classList.remove('visible');
        filterIcon.classList.remove('active');
    }
});


// Token toggle functionality

// AI and sustainability token toggles

// const ecoSwitch = document.getElementById('eco');
// const aiSwitch = document.getElementById('ai-p');
// const ecoToken = document.getElementById('token-eco');
// const aiToken = document.getElementById('token-ai-p');

// ecoToken.addEventListener('click', (event) => {
//     event.stopPropagation();
//     if(aiToken.classList.contains('active')){
//         aiSwitch.classList.remove('active');
//         aiToken.classList.remove('active');
//     }
//     ecoToken.classList.toggle('active');
//     ecoSwitch.classList.toggle('active');
//     filter();
// });

// ecoSwitch.addEventListener('click', (event) => {
//     event.stopPropagation();
//     if(aiToken.classList.contains('active')){
//         aiSwitch.classList.remove('active');
//         aiToken.classList.remove('active');
//     }
//     ecoToken.classList.toggle('active');
//     ecoSwitch.classList.toggle('active');
//     filter();
// });

// aiToken.addEventListener('click', (event) => {
//     event.stopPropagation();
//     if(aiSwitch.classList.contains('active') && ecoToken.classList.contains('active')){
//         ecoSwitch.classList.remove('active');
//         ecoToken.classList.remove('active');
//     }
//     aiToken.classList.toggle('active');
//     aiSwitch.classList.toggle('active');
//     filter();
// });

// aiSwitch.addEventListener('click', (event) => {
//     event.stopPropagation();
//     if(ecoToken.classList.contains('active')){
//         ecoSwitch.classList.remove('active');
//         ecoToken.classList.remove('active');
//     }
//     aiToken.classList.toggle('active');
//     aiSwitch.classList.toggle('active');
//     filter();
// });

// new and old products sorting token toggles

const newSwitch = document.getElementById('new');
const oldSwitch = document.getElementById('old');
const newToken = document.getElementById('token-new');
const oldToken = document.getElementById('token-old');

oldSwitch.addEventListener('click', (event) => {
    event.stopPropagation();
    if(lowToken.classList.contains('active')){
        lowSwitch.classList.remove('active');
        lowToken.classList.remove('active');
    } else if(highToken.classList.contains('active')){
        highSwitch.classList.remove('active');
        highToken.classList.remove('active');
    }
    if(newToken.classList.contains('active')){
        newSwitch.classList.remove('active');
        newToken.classList.remove('active');
        applyAgeOrder('old');
    } else {
        applyAgeOrder('new');
    }
    if(!oldSwitch.classList.contains('active')){
        oldSwitch.classList.toggle('active');
        oldToken.classList.toggle('active');
        applyAgeOrder('old');
    }
});

newSwitch.addEventListener('click', (event) => {
    event.stopPropagation();
    if(lowToken.classList.contains('active')){
        lowSwitch.classList.remove('active');
        lowToken.classList.remove('active');
    } else if(highToken.classList.contains('active')){
        highSwitch.classList.remove('active');
        highToken.classList.remove('active');
    }
    if(oldToken.classList.contains('active')){
        oldSwitch.classList.remove('active');
        oldToken.classList.remove('active');
        applyAgeOrder('new');
    } else {
        applyAgeOrder('old');
    }
    if(!newSwitch.classList.contains('active')){
        newSwitch.classList.toggle('active');
        newToken.classList.toggle('active');
    }
});


function applyAgeOrder(direction) {
    const order = direction === 'old'
        ? [...originalProdOrder].reverse()
        : [...originalProdOrder];
    order.forEach(item => products.appendChild(item));
}

// Sorting by high or low price token toggles

const lowSwitch = document.getElementById('l-price');
const highSwitch = document.getElementById('h-price');
const lowToken = document.getElementById('token-l-price');
const highToken = document.getElementById('token-h-price');

const products = document.getElementById('products');
const prod = document.querySelectorAll('.prod');
const prodArray = Array.from(prod);

// Store the original order of products
const originalProdOrder = [...prodArray];

lowToken.addEventListener('click', (event) => {
    event.stopPropagation();
    if(!newToken.classList.contains('active')){
        newSwitch.classList.toggle('active');
        newToken.classList.toggle('active');
    } else if(!oldToken.classList.contains('active')){
        oldSwitch.classList.toggle('active');
        oldToken.classList.toggle('active');
    }
    if(highToken.classList.contains('active')){
        highSwitch.classList.remove('active');
        highToken.classList.remove('active');
    }
    lowToken.classList.toggle('active');
    lowSwitch.classList.toggle('active');
    if(lowToken.classList.contains('active')){
        sortPrice();
    } else if(!highToken.classList.contains('active')){
        // Restore original order
        originalProdOrder.forEach(item => {
            products.appendChild(item);
        });
        if(!newToken.classList.contains('active')){
            newSwitch.classList.toggle('active');
            newToken.classList.toggle('active');
        }
    }
});

lowSwitch.addEventListener('click', (event) => {
    event.stopPropagation();
    if(newToken.classList.contains('active')){
        newSwitch.classList.remove('active');
        newToken.classList.remove('active');
    } else if(oldToken.classList.contains('active')){
        oldSwitch.classList.remove('active');
        oldToken.classList.remove('active');
    }
    if(highToken.classList.contains('active')){
        highSwitch.classList.remove('active');
        highToken.classList.remove('active');
    }
    lowToken.classList.toggle('active');
    lowSwitch.classList.toggle('active');
    if(lowToken.classList.contains('active')){
        sortPrice();
    } else if(!highToken.classList.contains('active')){
        // Restore original order
        originalProdOrder.forEach(item => {
            products.appendChild(item);
        });
        if(!newToken.classList.contains('active')){
            newSwitch.classList.toggle('active');
            newToken.classList.toggle('active');
        }
    }
});

highToken.addEventListener('click', (event) => {
    event.stopPropagation();
    if(!newToken.classList.contains('active')){
        newSwitch.classList.toggle('active');
        newToken.classList.toggle('active');
    } else if(!oldToken.classList.contains('active')){
        oldSwitch.classList.toggle('active');
        oldToken.classList.toggle('active');
    }
    if(lowToken.classList.contains('active')){
        lowSwitch.classList.remove('active');
        lowToken.classList.remove('active');
    }
    highToken.classList.toggle('active');
    highSwitch.classList.toggle('active');
    if(highToken.classList.contains('active')){
        sortPrice();
    } else if(!lowToken.classList.contains('active')){
        // Restore original order
        originalProdOrder.forEach(item => {
            products.appendChild(item);
        });
        if(!newToken.classList.contains('active')){
            newSwitch.classList.toggle('active');
            newToken.classList.toggle('active');
        }
    }
});

highSwitch.addEventListener('click', (event) => {
    event.stopPropagation();
    if(newToken.classList.contains('active')){
        newSwitch.classList.remove('active');
        newToken.classList.remove('active');
    } else if(oldToken.classList.contains('active')){
        oldSwitch.classList.remove('active');
        oldToken.classList.remove('active');
    }
    if(lowToken.classList.contains('active')){
        lowSwitch.classList.remove('active');
        lowToken.classList.remove('active');
    }
    highToken.classList.toggle('active');
    highSwitch.classList.toggle('active');
    if(highToken.classList.contains('active')){
        sortPrice();
    } else if(!lowToken.classList.contains('active')){
        // Restore original order
        originalProdOrder.forEach(item => {
            products.appendChild(item);
        });
        if(!newToken.classList.contains('active')){
            newSwitch.classList.toggle('active');
            newToken.classList.toggle('active');
        }
    }
});

// Sorting function to sort high price and low price

function sortPrice() {
    if(lowToken && lowToken.classList.contains('active')){
        prodArray.sort((a, b) => {
            const scoreA = parseInt(a.querySelector('.price').textContent.replace('₹', ''));
            const scoreB = parseInt(b.querySelector('.price').textContent.replace('₹', ''));
            return scoreA - scoreB;
        });
    } else if(highToken && highToken.classList.contains('active')){
        prodArray.sort((a, b) => {
            const scoreA = parseInt(a.querySelector('.price').textContent.replace('₹', ''));
            const scoreB = parseInt(b.querySelector('.price').textContent.replace('₹', ''));
            return scoreB - scoreA;
        });
    } else {
        return;
    }
  prodArray.forEach(item => {
    products.appendChild(item);
  });
}

// Filtering eco or ai

// const ai = document.getElementsByClassName('ai');
// const eco = document.getElementsByClassName('eco');

// Filter function to show either ai or eco

// function filter() {
//     prodArray.forEach(product => {
//         let show = true;
//         if (aiToken.classList.contains('active')) {
//             show = product.querySelector('.ai') !== null;
//         } else if (ecoToken.classList.contains('active')) {
//             show = product.querySelector('.eco') !== null;
//             }
//             product.style.display = show ? 'flex' : 'none';
//     });    
// }

 document.addEventListener('DOMContentLoaded', () => {
    const flashes = document.querySelectorAll('.toast');
    if (!flashes.length) return;

    setTimeout(() => {
        flashes.forEach(f => f.remove());
    }, 6000);
});