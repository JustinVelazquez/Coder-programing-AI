import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const container = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent == '....') {
      element.textContent = '';
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexString = randomNum.toString(16);

  return `id-${timeStamp}-${hexString}`;
}

// function chatStripe(isAi, value, uniqueId) {
//   return (
//     `
//     <div class='wrapper ${isAi && 'ai'}>

//     </div>
//     `
//   )
// }
