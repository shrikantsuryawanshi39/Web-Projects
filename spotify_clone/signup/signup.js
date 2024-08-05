document.querySelector('.next-button').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    if (email) {
        alert('Email: ' + email);
    } else {
        alert('Please enter your email address.');
    }
});
