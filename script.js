// Get DOM elements
const timeElement = document.getElementById('time');
const alarmHourElement = document.getElementById('alarmHour');
const alarmMinuteElement = document.getElementById('alarmMinute');
const alarmSecondElement = document.getElementById('alarmSecond');
const amPmElement = document.getElementById('amPm');
const setAlarmButton = document.getElementById('setAlarm');
const alarmsList = document.getElementById('alarmsList');

// Update clock time
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    timeElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${amPm}`;
}

// Set interval to update clock every second
setInterval(updateClock, 1000);

// Store alarms in an array
const alarms = [];
const hourSelect = document.getElementById("alarmHour");
for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i.toString();
    option.textContent = i.toString();
    hourSelect.appendChild(option);
}

// Populate minutes and seconds (0-59)
const minuteSelect = document.getElementById("alarmMinute");
const secondSelect = document.getElementById("alarmSecond");
for (let i = 0; i <= 59; i++) {
    const option = document.createElement("option");
    const paddedValue = i.toString().padStart(2, "0"); // Add leading zero if needed
    option.value = paddedValue;
    option.textContent = paddedValue;
    minuteSelect.appendChild(option);
    secondSelect.appendChild(option.cloneNode(true)); // Clone for seconds
}

function addAlarm() {
    const hour = parseInt(alarmHourElement.value);
    const minute = parseInt(alarmMinuteElement.value);
    const second = parseInt(alarmSecondElement.value);
    const amPm = amPmElement.value;

    if (!isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
        // Create a Date object for the alarm time
        const alarmTime = new Date();
        alarmTime.setHours(amPm === 'PM' ? hour + 12 : hour);
        alarmTime.setMinutes(minute);
        alarmTime.setSeconds(second);

        // Get the current time
        const currentTime = new Date();

        // Calculate the time until the alarm
        const timeUntilAlarm = alarmTime - currentTime;

        if (timeUntilAlarm > 0) {
            // Set a timeout for the alarm
            const alarmTimeout = setTimeout(() => {
                playAlarmSound();
                const alertResult = alert('Alarm! Wake up!');
                
                // Check if the alert is closed (returns undefined)
                if (alertResult === undefined) {
                    // Cancel the timeout when the alert is closed
                    clearTimeout(alarmTimeout);
                }
            }, timeUntilAlarm);

            // Add the alarm time to the alarms list
            alarms.push(alarmTime.toLocaleTimeString());
            alarmHourElement.value = '';
            alarmMinuteElement.value = '';
            alarmSecondElement.value = '';
            amPmElement.value = 'AM';
            displayAlarms();
        } else {
            alert('Please enter a future time for the alarm.');
        }
    } else {
        alert('Please enter valid alarm time.');
    }
}



// Function to display alarms
function displayAlarms() {
    alarmsList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = alarm;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteAlarm(index);
        });
        listItem.appendChild(deleteButton);
        alarmsList.appendChild(listItem);
    });
}
function playAlarmSound() {
    alarmSound.play();
}

// Event listener for the "Set Alarm" button
setAlarmButton.addEventListener('click', addAlarm);

// Add event listeners to check alarms from the alarm list
alarmsList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const alarmIndex = Array.from(alarmsList.children).indexOf(event.target);
        const alarm = alarms[alarmIndex];
        alert(`Alarm set for ${alarm.alarmTime}`);
    }
});

// Function to delete an alarm
function deleteAlarm(index) {
    alarms.splice(index, 1);
    displayAlarms();
}

// Function to check and trigger alarms
function checkAlarms() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (alarms.includes(currentTime)) {
        alert('Alarm! Time to wake up!');
    }
}

// Set interval to check alarms every second
setInterval(checkAlarms, 1000);

// Add event listener for set alarm button
setAlarmButton.addEventListener('click', addAlarm);
