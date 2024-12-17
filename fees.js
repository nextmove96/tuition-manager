const scriptURL = 'https://script.google.com/macros/s/AKfycbyg3Phw5VnXs8BDNiyox6OWKWsc-glp0U09RJq2X0AlLjRxnwiXf3CXNLdThK1JHdW3pA/exec';
const studentNameInput = document.getElementById('studentName');
const detailsBtn = document.getElementById('detailsBtn');
const responseMessage = document.getElementById('responseMessage');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const studentDetails = document.getElementById('studentDetails');
const lastPaymentInfo = document.getElementById('lastPaymentInfo');
const makePaymentBtn = document.getElementById('makePaymentBtn');
const viewPaymentsBtn = document.getElementById('viewPaymentsBtn');
const deleteProfileBtn = document.getElementById('deleteProfileBtn');
const closePopup = document.getElementById('closePopup');

function showPopup() {
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopupFn() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

closePopup.addEventListener('click', closePopupFn);
overlay.addEventListener('click', closePopupFn);

detailsBtn.addEventListener('click', async () => {
    const studentName = studentNameInput.value.trim();
    if (!studentName) {
        responseMessage.textContent = 'Please enter a student name!';
        responseMessage.style.color = 'red';
        return;
    }

    responseMessage.textContent = 'Fetching details...';
    responseMessage.style.color = 'black';

    try {
        const response = await fetch(`${scriptURL}?action=getStudentDetails&name=${encodeURIComponent(studentName)}`);
        const result = await response.json();

        if (result.status === 'success' && result.details) {
            const details = result.details;
            studentDetails.innerHTML = `
                <strong>Name:</strong> ${details.name}<br>
                <strong>Contact:</strong> ${details.contact}<br>
                <strong>Email:</strong> ${details.email}<br>
                <strong>Address:</strong> ${details.address}<br>
                <strong>Parent Contact:</strong> ${details.parentContact}<br>
                <strong>Batch:</strong> ${details.batch}
            `;
            lastPaymentInfo.innerHTML = `<strong>Last Payment:</strong> ${details.lastPayment || 'No payments made yet'}`;
            showPopup();
            responseMessage.textContent = '';
        } else {
            responseMessage.textContent = result.message || 'No details found for the given name!';
            responseMessage.style.color = 'red';
        }
    } catch (error) {
        responseMessage.textContent = 'Error fetching details!';
        responseMessage.style.color = 'red';
        console.error('Error:', error);
    }
});

makePaymentBtn.addEventListener('click', async () => {
    const studentName = studentNameInput.value.trim();

    responseMessage.textContent = 'Processing payment...';
    responseMessage.style.color = 'black';

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'markPaid',
                name: studentName
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            responseMessage.textContent = 'Payment marked successfully!';
            responseMessage.style.color = 'green';
            closePopupFn();
        } else {
            responseMessage.textContent = result.message || 'Error processing payment!';
            responseMessage.style.color = 'red';
        }
    } catch (error) {
        responseMessage.textContent = 'Error processing payment!';
        responseMessage.style.color = 'red';
        console.error('Error:', error);
    }
});

viewPaymentsBtn.addEventListener('click', async () => {
    const studentName = studentNameInput.value.trim();

    responseMessage.textContent = 'Fetching payment history...';
    responseMessage.style.color = 'black';

    try {
        const response = await fetch(`${scriptURL}?action=viewPayments&name=${encodeURIComponent(studentName)}`);
        const result = await response.json();

        if (result.status === 'success') {
            const paymentHistory = result.payments.join('\n');
            alert(`Payment History:\n${paymentHistory}`);
            responseMessage.textContent = '';
        } else {
            responseMessage.textContent = result.message || 'No payments found!';
            responseMessage.style.color = 'red';
        }
    } catch (error) {
        responseMessage.textContent = 'Error fetching payment history!';
        responseMessage.style.color = 'red';
        console.error('Error:', error);
    }
});

deleteProfileBtn.addEventListener('click', async () => {
    const studentName = studentNameInput.value.trim();
    if (!confirm(`Are you sure you want to delete the profile for ${studentName}?`)) {
        return;
    }

    responseMessage.textContent = 'Deleting profile...';
    responseMessage.style.color = 'black';

    try {
        const response = await fetch(`${scriptURL}?action=deleteProfile&name=${encodeURIComponent(studentName)}`);
        const result = await response.json();

        if (result.status === 'success') {
            responseMessage.textContent = 'Profile deleted successfully!';
            responseMessage.style.color = 'green';
            closePopupFn();
        } else {
            responseMessage.textContent = result.message || 'Error deleting profile!';
            responseMessage.style.color = 'red';
        }
    } catch (error) {
        responseMessage.textContent = 'Error deleting profile!';
        responseMessage.style.color = 'red';
        console.error('Error:', error);
    }
});
