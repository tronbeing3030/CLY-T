// Display Picture (DP) edit popup functionality

const dpEditBtn = document.getElementById('edit-btn');
const dpPopup = document.getElementById('dp-popup');

dpEditBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    window.scrollTo(0, 0);
    dpPopup.classList.toggle('visible');
    document.body.classList.toggle('no-scroll');
});

window.addEventListener('click', (event) => {
    if(dpPopup.classList.contains('visible') && event.target === dpPopup){
        dpPopup.classList.toggle('visible');
        document.body.classList.toggle('no-scroll');
    }
});

// Show Image preview

const imgInput = document.getElementById('image');
const imgBg = document.getElementById('full-img');
const imgPreview = document.getElementById('preview-img');

const defaultSvg = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="126" height="126"><path id="a" d="M126 0v21.584L21.584 126H0v-17.585L108.415 0H126Zm0 108.414V126h-17.586L126 108.414Zm0-84v39.171L63.585 126H24.414L126 24.414Zm0 42v39.17L105.584 126h-39.17L126 66.414ZM105.586 0 0 105.586V66.415L66.415 0h39.171Zm-42 0L0 63.586V24.415L24.415 0h39.171Zm-42 0L0 21.586V0h21.586Z" fill="rgb(136, 136, 136, 0.2)" fill-rule="evenodd"/></svg>';

function getImg(event){
    const file = event.target.files[0];
    if (!file) return;
    
    let url = window.URL.createObjectURL(file);
    imgBg.style.backgroundImage = `url(${url})`;
    imgBg.style.backgroundRepeat = "no-repeat";
    imgBg.style.backgroundSize = "cover";
    imgBg.style.backgroundPosition = "center";
    imgPreview.src = url;
}

function checkExistingDp() {
    if (!imgBg || !imgPreview) return;

    const hasNewFile = imgInput.files.length > 0;
    const currentDpUrl = imgBg.dataset.currentDp;

    if (hasNewFile) {
        const file = imgInput.files[0];
        const url = window.URL.createObjectURL(file);
        imgBg.style.backgroundImage = `url(${url})`;
        imgBg.style.backgroundRepeat = "no-repeat";
        imgBg.style.backgroundSize = "cover";
        imgBg.style.backgroundPosition = "center";
        imgPreview.src = url;
    } else if (currentDpUrl) {
        imgBg.style.backgroundImage = `url(${currentDpUrl})`;
        imgBg.style.backgroundRepeat = "no-repeat";
        imgBg.style.backgroundSize = "cover";
        imgBg.style.backgroundPosition = "center";
        imgPreview.src = currentDpUrl;
    } else {
        imgBg.style.backgroundImage = defaultSvg;
        imgPreview.src = defaultSvg;
    }
}

checkExistingDp();
imgInput?.addEventListener('change', getImg);

// Change DP
const dpForm = document.getElementById('dp-edit-form');

dpForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (!imgInput.files.length) {
        showToast("Add image to start", "error");
        return;
    }
    const formData = new FormData(dpForm);
    try {
        const response = await fetch(dpForm.action, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.success) {
            // optionally update UI or close popup
            dpPopup.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            window.location.reload();
            setReloadToast(data.message || "Profile picture changed successfully");
        } else {
            showToast(data.error || "Upload failed", "error");
        }
    } catch (error) {
        showToast("Network error", "error");
    }
});

// Username and contact info edit popup functionality

const editBtn = document.getElementById('name-edit-btn');
const editPopup = document.getElementById('edit-popup');

editBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    window.scrollTo(0, 0);
    editPopup.classList.toggle('visible');
    document.body.classList.toggle('no-scroll');
});

window.addEventListener('click', (event) => {
    if(editPopup.classList.contains('visible') && event.target === editPopup){
        editPopup.classList.toggle('visible');
        document.body.classList.toggle('no-scroll');
    }
});

// Form validation for username and contact info editing

const profileForm = document.getElementById('name-edit-form');
const fname = document.getElementById('username');
const phone = document.getElementById('phone');
const loc = document.getElementById('location');

profileForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    if(checkInputs()){
        const formData = new FormData(profileForm);
        try{
            const response = await fetch(profileForm.action, {
                method: 'POST',
                body: formData
            }); 
            const data = await response.json();
            if (data.success) {
                // optionally update UI or close popup
                editPopup.classList.toggle('visible');
                document.body.classList.toggle('no-scroll');
                setReloadToast(data.message || "Profile updated", "success");
                window.location.reload();
            } else {
                showToast(data.error || "Profile update failed", "error");
            }
        } catch (error){
            showToast("Network error", "error");
        }
    }
});

function checkInputs() {

    // Username input validation
    
    const fnameValue = fname.value !== null ? fname.value.trim() : fname.value;
    
    if (fnameValue === '' || fnameValue === null) {
        setErrorFor(fname, 'Please enter your name');
        return false;
    } else {
        setSuccessFor(fname);
    }

    // Phone number input validation

    const phoneValue = phone.value !== null ? phone.value.trim() : phone.value;
    
    if (!isPhone(phoneValue)) {
        setErrorFor(phone, 'Please enter valid 10-digit number');
        return false;
    } else {
        setSuccessFor(phone);
    }

    // Location number input validation

    const locValue = loc.value !== null ? loc.value.trim() : loc.value;
    
    if (!isLoc(locValue)) {
        setErrorFor(loc, 'Please enter city with country');
        return false;
    } else {
        setSuccessFor(loc);
    }

    return true;
}

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

function isPhone(phone) {
    return /^(|([0-9]{10}))?$/.test(phone);
}

function isLoc(loc) {
    return /^(|([a-zA-Z]+,\s*[a-zA-Z]{2,}))?$/.test(loc);
}

// More profile edit functionality

const moreOptBtn = document.getElementById('profile-opt-btn');
const moreOptMenu = document.getElementById('profile-opt-menu');

moreOptBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    moreOptMenu.classList.toggle('visible');
});


// Product functionality popup

const prodMenuBtns = document.querySelectorAll('.prod-menu-btn');

prodMenuBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const prodCard = btn.closest('.prod');
        const prodMenu = prodCard?.querySelector('.prod-edit-menu');
        if (!prodMenu) return;

        document.querySelectorAll('.prod-edit-menu.visible').forEach(menu => {
            if (menu !== prodMenu) {
                menu.classList.remove('visible');
            }
        });

        prodMenu.classList.toggle('visible');
    });
});

const okBtn = document.getElementById('ok-btn')
window.addEventListener('click', (event) => {
    document.querySelectorAll('.prod-edit-menu.visible').forEach(menu => {
        const prodCard = menu.closest('.prod');
        const btn = prodCard?.querySelector('.prod-menu-btn');
        if (menu !== event.target && !menu.contains(event.target) && !btn?.contains(event.target)) {
            menu.classList.remove('visible');
        }
    });

    if (moreOptMenu.classList.contains('visible') && event.target !== moreOptMenu) {
        moreOptMenu.classList.remove('visible');
    }
    if(delPopup.classList.contains('visible') && event.target === delPopup){
        delPopup.classList.remove('visible');
        document.body.classList.toggle('no-scroll');
    }
    if(sharePopup.classList.contains('visible') && event.target === sharePopup || event.target === okBtn){
        sharePopup.classList.remove('visible');
        document.body.classList.toggle('no-scroll');
        shareLink.innerHTML = '';
    }
});


const delPopup = document.getElementById('popup');
const delAlertPopup = document.getElementById('alert-popup');

const deleteProductButtons = document.querySelectorAll('.delete-product-btn');
const delAllProds = document.getElementById('del-all-prods');
const delAccount = document.getElementById('del-account');
const popHead = document.getElementById('pop-head');
const popInfo = document.getElementById('pop-info');
const delAllBtn = document.getElementById('del-all-btn');

let currentDeleteUrl = null;
let currentDeleteMode = null;

function showPopup(titleHead, innerMessage, actionText, delUrl = null, deleteMode = null) {
    window.scrollTo(0, 0);
    delPopup.classList.toggle('visible');
    document.body.classList.toggle('no-scroll');
    popHead.innerText = titleHead;
    popInfo.innerText = innerMessage;
    delAllBtn.innerText = actionText;
    delAllBtn.style.backgroundColor = 'var(--danger)';
    delAllBtn.style.borderColor = 'var(--danger)';
    delAlertPopup.style.borderColor = 'var(--danger)';
    delAlertPopup.style.boxShadow = '0 0 10px 0 #ff004440';
    currentDeleteUrl = delUrl;
    currentDeleteMode = deleteMode;
    delAllBtn.href = 'javascript:void(0)';
}

deleteProductButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const prodId = btn.dataset.prodId;
        if (!prodId) return;

        showPopup(
            'Delete Product',
            'Deleting this product is a permanent action. Once removed, it cannot be recovered or restored. Please confirm carefully before proceeding, as all associated data and details will be lost forever.',
            'DELETE PRODUCT',
            `/del_prod/${prodId}`,
            'single'
        );
    });
});

if (delAllProds) {
    delAllProds.addEventListener('click', (event) => {
        event.stopPropagation();
        showPopup(
            'Delete all Products',
            'Deleting all products is a permanent action. Once confirmed, every product in the system will be removed and cannot be recovered. This will erase all associated data and details forever, so please proceed only if you are absolutely certain.',
            'DELETE ALL PRODUCTS',
            '/delete',
            'all'
        );
    });
}

if (delAccount) {
    delAccount.addEventListener('click', (event) => {
        event.stopPropagation();
        showPopup(
            'DELETE ACCOUNT',
            'Deleting your account is a permanent action. Once confirmed, all your data, products, and personal information linked to this account will be erased and cannot be recovered. Please proceed only if you are absolutely certain.',
            'DELETE ACCOUNT',
            '/del_acc',
            'account'
        );
    });
}

if (delAllBtn) {
    delAllBtn.addEventListener('click', async (event) => {
        if (currentDeleteMode === 'single' || currentDeleteMode === 'all') {
            event.preventDefault();
            if (!currentDeleteUrl) return;

            try {
                const response = await fetch(currentDeleteUrl, { method: 'POST' });
                const data = await response.json();

                if (data.success) {
                    delPopup.classList.remove('visible');
                    document.body.classList.remove('no-scroll');
                    setReloadToast(data.message || 'Deleted successfully', 'success');
                    window.location.reload();
                } else {
                    showToast(data.error || 'Delete failed', 'error');
                }
            } catch (error) {
                showToast('Network error', 'error');
            }
        } else if(currentDeleteMode === 'account' ){
            event.preventDefault();
            if (!currentDeleteUrl) return;
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = currentDeleteUrl;
            document.body.appendChild(form);
            form.submit();
        }
    });
}

// Searching in real time functionality

const searchBox = document.getElementById('search');
const prodName = document.getElementsByClassName('prod-name');

const prods = Array.from(prodName);

searchBox.addEventListener('input', () => {
    prods.forEach(prod => {
        var checkProd = prod.innerHTML.toLowerCase().includes(searchBox.value.toLowerCase());
        if(searchBox.value === '') {
            prod.parentElement.parentElement.style.display = 'flex';
        } else {
            prod.parentElement.parentElement.style.display = (checkProd) ? 'flex': 'none';
        }        
    });
});


// Change password functionality which is not implemented popup

const changePwdBtn = document.getElementById('change-pwd');
changePwdBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    window.scrollTo(0, 0);
    delPopup.classList.toggle('visible');
    document.body.classList.toggle('no-scroll');
    popHead.textContent = 'Sorry! Functionality not added';
    popInfo.textContent = 'The Change Password functionality is not yet available in this application. We are actively working on implementing this feature, and it will be added shortly in an upcoming update. In the meantime, please continue using your current credentials. Thank you for your patience and understanding.';
    delAllBtn.textContent = 'OK, GOT IT';
    delAllBtn.style.backgroundColor = 'var(--accent)';
    delAllBtn.style.borderColor = 'var(--accent)';
    delAlertPopup.style.borderColor = 'var(--accent)';
    delAlertPopup.style.boxShadow = '0 0 10px 0 #ffc00040';
    delAllBtn.href = '';
})

// Copy link functionality
const shareBtns = document.querySelectorAll('.share-btn');
const sharePopup = document.getElementById('share-popup');
const shareLink = document.getElementById('share-link');

shareBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const homeURL = window.location.href;
        let prodId = btn.dataset.prodId;
        if (!prodId) return;
        window.scrollTo(0, 0);
        sharePopup.classList.toggle('visible');
        document.body.classList.toggle('no-scroll');
        shareLink.innerText = `${homeURL}/prod/${prodId}`;
    });
});

const copyBtn = document.getElementById('copy-btn');

copyBtn.addEventListener('click', () => {
    let text = shareLink.innerText;
    navigator.clipboard.writeText(text);
    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM17.4571 9.45711L16.0429 8.04289L11 13.0858L8.20711 10.2929L6.79289 11.7071L11 15.9142L17.4571 9.45711Z"></path></svg>';
    setTimeout(() => {
        copyBtn.innerHTML = originalContent;
    }, 3000);
});

// Toast functionality
function showToast(message, type = "success") {
    const toast = document.createElement('div');
    const toastP = document.createElement('p');
    toast.className = `toast ${type}`;
    toastP.innerHTML = message;
    toast.appendChild(toastP);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 6000);
}

function setReloadToast(message, type = "success") {
    sessionStorage.setItem('reloadToast', JSON.stringify({ message, type }));
}

function showReloadToast() {
    const stored = sessionStorage.getItem('reloadToast');
    if (!stored) return;

    const { message, type } = JSON.parse(stored);
    showToast(message, type);
    sessionStorage.removeItem('reloadToast');
}

document.addEventListener('DOMContentLoaded', showReloadToast);