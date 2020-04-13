const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const finalMessageRevealWord = document.getElementById(
  'final-message-reveal-word'
);
const figureParts = document.querySelectorAll('.figure-part');
const languagUa = document
  .getElementById('ua')
  .addEventListener('click', uaLanguag);
const languagEn = document
  .getElementById('en')
  .addEventListener('click', enLanguag);
const balanseAmound = document.querySelector('.balanse-amound');

const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');

const rateEl = document.getElementById('rate');
const uahCurrency = document.querySelector('.UAH-currency');
const usdCurrency = document.querySelector('.USD-currency');
uahCurrency.hidden = true;
let words = ['application', 'programming', 'interface', 'wizard'];

async function uaLanguag() {
  words = ['застосування', 'програмування', 'інтерфейс', 'майстер'];
  restart();
uahCurrency.hidden = false;
  usdCurrency.hidden = true;
  const response = await fetch('client-data.json');
  const data = await response.json();
  document.querySelector('.header').innerText = data.headerUa;
  document.querySelector('.description').innerText = data.descriptionUa;
  document.querySelector('.notification').innerText = data.notificationUa;
  document.querySelector('.balanse').innerText = data.balanseUa;
  playAgainBtn.innerText = data.btnUa;
}

async function enLanguag() {
  words = ['application', 'programming', 'interface', 'wizard'];
  restart();
uahCurrency.hidden = true;
usdCurrency.hidden = false;
  const response = await fetch('client-data.json');
  const data = await response.json();
  document.querySelector('.header').innerText = data.headerEn;
  document.querySelector('.description').innerText = data.descriptionEn;
  document.querySelector('.notification').innerText = data.notificationEn;
  document.querySelector('.balanse').innerText = data.balanseEn;
  playAgainBtn.innerText = data.btnEn;
}

let selectedWord = words[Math.floor(Math.random() * words.length)];

let playable = true;

let balance = [];
const correctLetters = [];
const wrongLetters = [];
const regexpUa = /[а-яА-Я]/;
const regexpEn = /[a-zA-Z]/;

// Show hidden word
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split('')
      .map(
        (letter) => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
      )
      .join('')}
  `;
  const innerWord = wordEl.innerText.replace(/[ \n]/g, '');

  if (innerWord === selectedWord) {
    if (regexpUa.test(words)) {
      finalMessage.innerText = 'Вітаю! Ви виграли! 😃';
      finalMessageRevealWord.innerText = '';
      plusMoney();
    } else {
      finalMessage.innerText = 'Congratulations! You won! 😃';
      finalMessageRevealWord.innerText = '';
      plusMoney();
    }
    playable = false;
    popup.style.display = 'flex';
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    if (regexpUa.test(words)) {
      finalMessage.innerText = 'Нажаль ви програли. 😕';
      finalMessageRevealWord.innerText = `...слово було: ${selectedWord}`;
      minusMoney();
    } else {
      finalMessage.innerText = 'Unfortunately you lost. 😕';
      finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`;
      minusMoney();
    }
    playable = false;
    popup.style.display = 'flex';
  }
}

// Show notification
function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', (e) => {
  if (playable) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          displayWord();
          balanceResult();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);

          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  }
});

// Restart game and play again
playAgainBtn.addEventListener('click', restart);
function restart() {
  playable = true;

  //  Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];
  balanceResult();
  displayWord();
  // displayBalanse();
  updateWrongLettersEl();

  popup.style.display = 'none';
}

balanceResult();
displayWord();

// Settings btn click
document
  .getElementById('settings-btn')
  .addEventListener('click', () => settings.classList.toggle('hide'));

function minusMoney() {
  balance.push(-5);
}
function plusMoney() {
  balance.push(5);
}

function balanceResult() {
  let sum = 0;
  balance.forEach((el) => (sum += el));
  balanseAmound.value = sum;
  function calculate() {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const rate = data.rates[currency_two].toFixed(2);

        rateEl.innerText = `1 ${currency_one} = ${rate} ${currency_two}`;
        amountEl_two.value = (parseFloat(balanseAmound.value) * rate).toFixed(
          0
        );
      });
  }
  calculate();
}

balanceResult();
