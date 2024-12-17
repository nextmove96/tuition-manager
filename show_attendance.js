const scriptURL = 'https://script.google.com/macros/s/AKfycbw5ux6i-MoV882cD8Ht-ZfqUQ4yAiPzYO_AHYicc3tte8xKi0ajC6qU-Ra0WxIsx-w_jQ/exec';
const attendanceTable = document.getElementById('attendanceTable');
const tableBody = attendanceTable.querySelector('tbody');
const responseMessage = document.getElementById('responseMessage');

async function searchAttendance() {
    const studentName = document.getElementById('studentName').value.trim();
    if (!studentName) {
        displayMessage('Please enter a student name.', 'error');
        return;
    }

    try {
        const response = await fetch(`${scriptURL}?action=searchAttendance&name=${studentName}`);
        const result = await response.json();

        if (result.status === 'error') {
            displayMessage(result.message, 'error');
            return;
        }

        displayAttendance(result);
    } catch (error) {
        displayMessage('Error fetching attendance data', 'error');
    }
}

function displayAttendance(data) {
    tableBody.innerHTML = '';
    attendanceTable.style.display = 'table';

    const dates = data.dates;
    const presentDates = data.presentDates;
    const absentDates = data.absentDates;

    dates.forEach(date => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        row.appendChild(dateCell);

        const presentCell = document.createElement('td');
        presentCell.appendChild(createDot(presentDates.includes(date), 'present'));
        row.appendChild(presentCell);

        const absentCell = document.createElement('td');
        absentCell.appendChild(createDot(absentDates.includes(date), 'absent'));
        row.appendChild(absentCell);

        tableBody.appendChild(row);
    });
}

function createDot(isMarked, type) {
    const dot = document.createElement('span');
    if (isMarked) {
        dot.classList.add('dot', type);
    }
    return dot;
}

function displayMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = type;
}
