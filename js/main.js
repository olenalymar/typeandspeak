// init Web Speech API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector('form'),
  textInput = document.querySelector('#text-input'),
  voiceSelect = document.querySelector('#voice-select'),
  rate = document.querySelector('#rate'),
  rateValue = document.querySelector('#rate-value'),
  pitch = document.querySelector('#pitch'),
  pitchValue = document.querySelector('#pitch-value'),
  body = document.querySelector('body');

// init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // loop through voices and create an option for each one
  voices.forEach(voice => {
    // create option element
    const option = document.createElement('option');
    // fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';
    // set option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    // append options to select
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// speak
const speak = () => {
  // add background animation
  body.style.background = '#141414 url(../images/wave.gif)';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundPosition = '50% 50%';

  // check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // speak end
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    };

    // speak error
    speakText.onerror = e => {
      console.error('Something was wrong');
    };

    // selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // speak
    synth.speak(speakText);
  }
};

// event listeners

// text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// rate value change
rate.addEventListener('change', e => {
  rateValue.textContent = rate.value;
});

// pitch value change
pitch.addEventListener('change', e => {
  pitchValue.textContent = pitch.value;
});

// voice select change
voiceSelect.addEventListener('change', e => speak());
