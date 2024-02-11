// Alert
const alertContainer = document.getElementById('alertContainer');
const alertTitle = document.getElementById('alertTitle');
const alertText = document.getElementById('alertText');
const alertBtn = document.getElementById('alertBtn');

function showAlert(options = {}) {
  const defaultOptions = {
    title: 'Alert', // Default title
    message: 'This is an alert! I am alerting you that my weenie is extremely average! tmi? I don\'t care.', // Default message
    buttonText: 'Confirm', // Default button text
    // ... other default options here ...
  };

  // Merge default options with the provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // Set the content of the modal elements
  alertTitle.innerText = mergedOptions.title;
  alertText.innerText = mergedOptions.message;
  alertBtn.innerText = mergedOptions.buttonText;

  // Show the modal
  alertContainer.style.display = 'block';

  // Function to close the modal
  const closeAlert = function() {
    alertContainer.style.display = 'none';
    // Remove the event listener to prevent memory leaks
    alertBtn.removeEventListener('click', closeAlert);
  };

  // Set up the close functionality using 'click' event
  alertBtn.addEventListener('click', closeAlert);
}