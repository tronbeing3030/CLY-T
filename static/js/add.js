// Show Image preview

const imgInput = document.getElementById('upload');
const existingImageInput = document.getElementById('existing-image');
const image = document.getElementById('image');

const replaceImg = document.getElementById('replace-image');
const replaceImgText = document.getElementById('replace-image-text');

function getImg(event) {
    event.stopPropagation();

    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    let url = window.URL.createObjectURL(file);
    if (image.style.backgroundImage.includes('blob:')) {
        const oldUrl = image.style.backgroundImage.replace(/^url\(['"](.+)['"]\)$/, '$1');
        window.URL.revokeObjectURL(oldUrl);
    }
    image.style.backgroundImage = `url(${url})`;
    image.classList.add('added');
    replaceImg.classList.add('added');

    if (replaceImgText) {
        replaceImgText.textContent = "Click to change image";
    }
    
}

imgInput?.addEventListener('change', getImg);

// Form validation

const form = document.querySelector('form');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    try{
        const isValid = await checkInputs();
        if(isValid){
            form.submit();
        }
    } catch (error) {
        console.error("Validation error:", error);
    }
});

// Input validation

const title = document.getElementById('title');
const desc = document.getElementById('desc');
const price = document.getElementById('price');

const alertToast = document.getElementById('alert-toast');

async function checkInputs() {

    const titleValue = title.value;
    const descValue = desc.value;
    const priceValue = price.value;
    const hasExistingImage = existingImageInput && existingImageInput.value;

    if (imgInput.files.length === 0 && !hasExistingImage){
        alertToast.classList.add('visible');
        return false;
    } else {
        if(alertToast.classList.contains('visible')){
            alertToast.classList.remove('visible');
        }
    }

    if (titleValue === '' || titleValue === null) {
        setErrorFor(title, 'Please add product name');
        return false;
    } else if(!isTitleEnglish(titleValue)){
        setErrorFor(title, 'Title must have english characters only');
    } else {
        setSuccessFor(title);
    }
    
    const isEnglish = await detectLang(descValue);
    if (descValue === '' || descValue === null) {
        setErrorFor(desc, 'Please add product description');
        return false;
    } else if (!isEnglish) {
        setErrorFor(desc, 'Product description must be in English only');
        return false;
    } else {
        setSuccessFor(desc);
    }

    if (priceValue === '' || priceValue === null) {
        setErrorFor(price, 'Please add product price');
        return false;
    } else if(isPrice(priceValue)) {
        setSuccessFor(price);
    } else {
        setSuccessFor(price);
    }

    // // const isEnglish = await detectLang(descValue);
    // if (!isEnglish) {
    //     setErrorFor(desc, 'Product description must be in English only');
    //     return false;
    // } else {
    //     setSuccessFor(desc);
    // }


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

function isPrice(priceVal) {
    return /^\d+(\.\d{1,2})?$/.test(priceVal);
}

function isTitleEnglish(titleVal){
   return /^[a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/.test(titleVal)
}

// Toast appear and disappering functionality

 window.addEventListener('click', (event) => {
    if(alertToast.classList.contains('visible') && event.target !== alertToast){
        alertToast.classList.remove('visible');
    }
 });

 window.onload = setInterval(() => alertToast.classList.remove('visible'), 6000);

// AI features animation

const translateBtn = document.getElementById('translate');
const micBtn = document.getElementById('mic');
const genInfoBtn = document.getElementById('gen-info');
const shadowOfAI = document.getElementById('shadow');

const shadowOfVoiceAI = document.getElementById('voice-input-shadow');
const speechTextInput = document.getElementById('speech-text');
const offMic = document.getElementById('off-mic');

genInfoBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (imgInput.files.length === 0){
        alertToast.classList.add('visible');
    } else{
        shadowOfAI.classList.toggle('on');
        let imgUrl = window.URL.createObjectURL(imgInput.files[0])
        await getSuggestions(imgUrl, title, desc);
        setTimeout(() => shadowOfAI.classList.remove('on'), 2000);
    }
});

translateBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const descValue = desc.value;
    if (descValue === '' || descValue === null) {
        setErrorFor(desc, 'Please add product description');
    } else{
        setSuccessFor(title);
        setSuccessFor(desc);
        shadowOfAI.classList.toggle('on');
        translateData(descValue)
    }
});

micBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if(!shadowOfVoiceAI.classList.contains('on')){
        shadowOfVoiceAI.classList.add('on');
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        var recognition = new SpeechRecognition();
        recognition.start();
        recognition.onresult = function (e) {
            console.log(e);
            var transcript = e.results[0][0].transcript;
            speechTextInput.innerHTML = transcript;
        }
    }
});

offMic.addEventListener('click', (event) => {
    event.stopPropagation();
    if(shadowOfVoiceAI.classList.contains('on')){
        shadowOfVoiceAI.classList.remove('on');
    }
})


// Translating any other language to English for ease of website

function translateData(desc){
    fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({old_desc: desc})
    })
    .then(response => response.json()).then(data => {
        console.log(data.translated_desc)
        document.getElementById('desc').value = data.translated_desc
    })
}

// Check whether the language added is English or not

function detectLang(desc){
    return fetch('/detect_lang?t=' + Date.now(), {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        body: JSON.stringify({old_desc: desc})
    })
    .then(response => response.json()).then(data => {
        if(data.desc_lang === 'en'){
            return true
        } else {
            return false
        }
    })
    .catch(error => {
        console.error('Language detection error:', error);
        return false;
    })
}

const slide = document.getElementById('slide');

// AI Generation function
async function getSuggestions(imageFile, title_name, description) {
    const file = imgInput.files[0];
    const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    try {
        const res = await fetch("/generate", { 
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                curr_img: dataUrl,
                old_title: title_name.value,
                old_desc: description.value
            })
        });

        const contentType = res.headers.get('content-type') || '';

        if (!res.ok) {
            const text = await res.text();
            console.error('Server returned error:', res.status, text);
            return;
        }
        if (!contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON but got:', text);
            return;
        }
        const data = await res.json();
        if (data.error) {
            console.error('Generation error:', data.error);
            return;
        }

        const suggesstionArray = data.suggestions;
        slide.style.visibility = 'visible';
        slide.style.opacity = '1';
        slide.style.transform = 'translateY(0)';
        const title_Text = suggesstionArray[0].title;
        const desc_Text = suggesstionArray[0].description.replace(/\s+/g, ' ').trim();
        await Promise.all([
            typeText(title, title_Text, 20),
            typeText(desc, desc_Text, 10)
        ]);
        toggleSlide(suggesstionArray, title, description);

    } catch (error) {
        console.error('Fetch/generation error:', error);
    }
}

// Letter animation
function typeText(el, text, delay = 40) {
    el.value = '';
    return new Promise((resolve) => {
        let i = 0;
        const type = () => {
            if (i < text.length) {
                el.value += text[i++];
                setTimeout(type, delay);
            } else {
                resolve();
            }
        };
        type();
    });
}

// Toggle slide of multiple outputs
function toggleSlide(suggesstionArray, title_n, desc){
    slide.addEventListener('click', (event) => {
        event.stopPropagation();
        let index = event.target.value;
        title_n.value = suggesstionArray[index].title;
        desc.value = suggesstionArray[index].description.replace(/\s+/g, ' ').trim();
        for(let i = 0; i < 3; i++){
            const radioBtn = document.getElementById(`radio-${i}`);
            if(i == index){
                radioBtn.classList.add('active');
            } else {
                radioBtn.classList.remove('active');
            }   
        }
    });
}