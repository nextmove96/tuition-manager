const scriptURL = 'https://script.google.com/macros/s/AKfycby2jJ82kM24iCy3FjHoJ6TAha3VrSKnBkCDxTbSRhgY58PHkzfnGOjwwKB4cx5vxloDIw/exec';
const form = document.getElementById('studentForm');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', e => {
    e.preventDefault();
    responseMessage.innerHTML = '<p>Adding Student...</p>';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => {
        responseMessage.innerHTML = '<p>Student Added Successfully.</p>';
        responseMessage.classList.add('success');
        form.reset();
    })
    .catch(error => {
        responseMessage.innerHTML = 'Error! Please try again.';
        responseMessage.classList.add('error');
        console.error('Error!', error.message);
    });
});
