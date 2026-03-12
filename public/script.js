// התחברות לשרת הסוקט בפורט הנוכחי
// autoConnect=false כדי שלא נפספס אירועים מוקדמים (כמו מונה משתמשים)
const socket = io({ autoConnect: false });

// אם השרת והלקוח בפרויקטים אחרים
// const socket = io.connect("http://localhost:8000");

const h1 = document.querySelector('h1');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const colorInput = document.getElementById('usercolor');
const userDetailsForm = document.getElementById('user-details-form');
const disconnectBtn = document.getElementById('disconnect-btn');
const counterDisplay = document.getElementById('counter-display');

// מאזינים לפני התחברות בפועל
socket.on('update users count', (count) => {
    counterDisplay.textContent = `יש ${count} לקוחות פעילים כרגע`;
});

socket.connect();

disconnectBtn.addEventListener('click', () => {
    socket.disconnect();
    alert('התנתקת מהסוקט');
});

userDetailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const details = {
        name: usernameInput.value.trim(),
        color: colorInput.value
    };

    if (details.name) {
        // שליחת אירוע "עדכון פרטי לקוח" לשרת
        socket.emit('update_user_details', details);
        alert('הפרטים נשמרו בהצלחה!');
    } else {
        alert('אנא הזן שם משתמש');
    }
});

// Handle form submission
form.addEventListener('submit', e => {
    e.preventDefault();

    const message = input.value.trim();
    if (message) {
        // Emit the message to the server
        socket.emit('new message', message);

        // Clear the input
        input.value = '';
    }
});

// Listen for incoming messages
socket.on('user connected', ({ userId }) => {
    h1.textContent += ` - user ${userId}`
})

socket.on('send message', msgFromServer => {
    const item = document.createElement('li');
    item.textContent = `new message added by ${msgFromServer.by}: ${msgFromServer.msg}`;
    item.style.color = msgFromServer.color;
    messages.append(item);

    // Scroll to the bottom
    messages.scrollTop = messages.scrollHeight;
});
socket.on('user left', ({ userName, color }) => {
    const item = document.createElement('li');
    item.textContent = `${userName} left the chat`;
    item.style.color = color;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
});