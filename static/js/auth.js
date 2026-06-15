// Validating authentication form

const form = document.querySelector('form');
const fname = document.getElementById('fname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const phone = document.getElementById('phone');
const loc = document.getElementById('loc');

form.addEventListener('submit', function (e) {
    if(!checkInputs()){
        e.preventDefault();
    } else if(e.key === 'Enter' && checkInputs()){
        form.submit();
    }
});

// Input validation

function checkInputs() {
    const emailValue = email.value !== null ? email.value.trim() : email.value;
    const passwordValue = password.value !== null ? password.value.trim() : password.value;

    if(fname){
        const fnameValue = fname.value !== null ? fname.value.trim() : fname.value;
        
        if (fnameValue === '' || fnameValue === null) {
            setErrorFor(fname, 'Please enter your name');
            return false;
        } else {
            setSuccessFor(fname);
        }
    }

    if (emailValue === '' || emailValue === null) {
        setErrorFor(email, 'Please enter your email');
        return false;
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Please enter a valid email');
        return false;
    } else {
        setSuccessFor(email);
    }
    
    if (passwordValue === '' || passwordValue === null) {
        setErrorFor(password, 'Please enter your password');
        return false;
    } else {
        setSuccessFor(password);
    }

    if(phone){
        const phoneValue = phone.value !== null ? phone.value.trim() : phone.value;
        
        if (!isPhone(phoneValue)) {
            setErrorFor(phone, 'Please enter valid 10-digit number');
            return false;
        } else {
            setSuccessFor(phone);
        }
    }

    if(loc){
        const locValue = loc.value !== null ? loc.value.trim() : loc.value;
        
        if (!isLoc(locValue)) {
            setErrorFor(loc, 'Please enter city with country');
            return false;
        } else {
            setSuccessFor(loc);
        }
    }

    return true;
}

// Error and Success Events

function setErrorFor(input, message) {
    const small = input.parentElement.querySelector('small');
    small.innerText = message;
    small.style.display = 'flex';
    input.style.borderColor = 'var(--danger)';
    return false;
}

function setSuccessFor(input) {
    const small = input.parentElement.querySelector('small');
    small.innerText = '';
    small.style.display = 'none';
    input.style.borderColor = 'var(--border)';
    return true;
}

// Validating valid inputs using regex

 function isEmail(email) {
     return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
 }

 function isPhone(phone) {
     return /^([0-9]{10}|)?$/.test(phone);
 }

 function isLoc(loc) {
     return /^([a-zA-Z]+,\s*[a-zA-Z]{2,})?$/.test(loc);
 }

 document.addEventListener('DOMContentLoaded', () => {
    const flashes = document.querySelectorAll('.toast');
    if (!flashes.length) return;

    setTimeout(() => {
        flashes.forEach(f => f.remove());
    }, 6000);
});