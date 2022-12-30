import bot from './assets/bot.svg';
import user from './assets/user.svg';


//
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

//loadInterval variable
let loadInterval;

//loader function that loads our chatbot's messages as we wait for the server to fetch the answer
function loader(element) {
  element.textContent = '';
  // every 300 milliseconds we add a '.' and if it reaches 4 dots we reset
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent == '....') {
      element.textContent = '';
    }
  }, 300);
}

// implements a 'typing' functionality to our chat's to improve user experience
function typeText(element, text) {
  let index = 0;

  // every 20 milliseconds we add a new char to our chat's response and increase til we reach the end of our string
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generates a uniqueId for every message in order to map over them
function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNum = Math.random();
  const hexString = randomNum.toString(16);

  return `id-${timeStamp}-${hexString}`;
}

//Changes what our 'chat-stripe' looks at depending on who is 'talking', the user or the bot
function chatStripe(isAi, value, uniqueId) {
  return ( 
  `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? 'bot' : 'user'}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `
  )
}

// handles our form submission to our server
const handleSubmit = async (e) => {
  // prevents the page from refreshing
  e.preventDefault();

  const data = new FormData(form);

  // setting our prompt's chat container HTML to our chatStripe function and giving it an initial value of false
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  //bot chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server
  const response = await fetch('https://codex-dihb.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval), (messageDiv.innerHTML = ' ');

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = 'Something went wrong';
    alert(err);
  }
};

// form submission event handler 
form.addEventListener('submit', handleSubmit);

//allows for form submission with the 'enter' key
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
