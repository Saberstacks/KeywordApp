document.addEventListener('DOMContentLoaded', () => {
  const keywordsInput = document.getElementById('keywords-input');
  const locationCodeInput = document.getElementById('location-code-input');
  const languageCodeInput = document.getElementById('language-code-input');
  const submitButton = document.getElementById('submit-button');
  const resultDiv = document.getElementById('result');

  function isValidInput() {
    return (
      keywordsInput.value.trim().length > 0 &&
      locationCodeInput.value.trim().length > 0 &&
      languageCodeInput.value.trim().length > 0
    );
  }

  keywordsInput.addEventListener('input', toggleSubmitButton);
  locationCodeInput.addEventListener('input', toggleSubmitButton);
  languageCodeInput.addEventListener('input', toggleSubmitButton);

  function toggleSubmitButton() {
    submitButton.disabled = !isValidInput();
  }

  submitButton.addEventListener('click', () => {
    const keywords = keywordsInput.value.trim().split(',').map(kw => kw.trim());
    const location_code = parseInt(locationCodeInput.value.trim());
    const language_code = languageCodeInput.value.trim();

    if (!isValidInput()) {
      alert('Please fill in all fields.');
      return;
    }

    const payload = {
      keywords: keywords,
      location_code: location_code,
      language_code: language_code,
    };

    resultDiv.textContent = 'Processing... Please wait.';

    fetch('/api/keyword-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || 'An error occurred');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
        } else {
          resultDiv.textContent = JSON.stringify(data, null, 2);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        resultDiv.innerHTML = `<div class="error">An error occurred: ${error.message}</div>`;
      });
  });
});
