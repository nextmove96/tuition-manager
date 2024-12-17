const scriptURL = 'https://script.google.com/macros/s/AKfycbzfyQB9PYus8bkVwB14V6qDntseo1hdnLEj4GFypspHsepHWB43XfuSiDnLKBux088qwA/exec';

const batchSelect = document.getElementById('batchSelect');
const studentTable = document.getElementById('studentTable');
const tableBody = studentTable.querySelector('tbody');
const responseMessage = document.getElementById('responseMessage');

async function fetchBatches() {
    try {
        const response = await fetch(`${scriptURL}?action=getBatches`);
        const batches = await response.json();

        batches.forEach(batch => {
            const option = document.createElement('option');
            option.value = batch;
            option.textContent = batch;
            batchSelect.appendChild(option);
        });
    } catch (error) {
        displayMessage('Error fetching batches', 'error');
    }
}

batchSelect.addEventListener('change', async (e) => {
    const selectedBatch = e.target.value;
    tableBody.innerHTML = '';
    studentTable.style.display = 'none';

    if (!selectedBatch) return;

    try {
        const response = await fetch(`${scriptURL}?action=getStudents&batch=${selectedBatch}`);
        const students = await response.json();

        students.forEach(student => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = student;
            row.appendChild(nameCell);

            const actionCell = document.createElement('td');
            const presentButton = document.createElement('button');
            presentButton.textContent = 'Present';
            presentButton.className = 'btn btn-present';
            presentButton.addEventListener('click', () => markAttendance(student, 'present'));

            const absentButton = document.createElement('button');
            absentButton.textContent = 'Absent';
            absentButton.className = 'btn btn-absent';
            absentButton.addEventListener('click', () => markAttendance(student, 'absent'));

            actionCell.appendChild(presentButton);
            actionCell.appendChild(absentButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });

        studentTable.style.display = 'table';
    } catch (error) {
        displayMessage('Error fetching students', 'error');
    }
});

async function markAttendance(studentName, type) {
    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'markAttendance',
                name: studentName,
                type
            })
        });
        const result = await response.json();

        if (result.status === 'success') {
            displayMessage(`Attendance marked as ${type} for ${studentName}`, 'success');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        displayMessage('Error marking attendance', 'error');
    }
}

function displayMessage(message, type) {
    responseMessage.textContent = message;
    responseMessage.className = type;
}

fetchBatches();
