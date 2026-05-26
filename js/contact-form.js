/* ============================================================
   FS Energy Projects — contact-form.js
   Form validation, submission handling, success/fail states
   Submits to Formspree or similar — update action URL below
   ============================================================ */

(function () {

  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmit');
  const successEl = document.getElementById('formSuccess');
  const failEl    = document.getElementById('formFail');

  if (!form) return;

  /* ── VALIDATION RULES ── */
  const rules = {
    firstName: { required: true, label: 'First name' },
    lastName:  { required: true, label: 'Last name' },
    phone:     { required: true, label: 'Phone number', pattern: /^[\d\s\+\-\(\)]{7,15}$/ },
    service:   { required: true, label: 'Service' },
    message:   { required: true, label: 'Message', minLength: 10 }
  };

  function getField(name) { return document.getElementById(name); }
  function getError(name) { return document.getElementById(name + 'Error'); }

  function setError(name, msg) {
    const field = getField(name);
    const error = getError(name);
    if (field)  field.classList.add('error');
    if (error)  error.textContent = msg;
  }

  function clearError(name) {
    const field = getField(name);
    const error = getError(name);
    if (field)  field.classList.remove('error');
    if (error)  error.textContent = '';
  }

  function validateField(name) {
    const rule  = rules[name];
    const field = getField(name);
    if (!field || !rule) return true;

    const value = field.value.trim();

    if (rule.required && !value) {
      setError(name, rule.label + ' is required.');
      return false;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      setError(name, 'Please enter a valid ' + rule.label.toLowerCase() + '.');
      return false;
    }

    if (rule.minLength && value.length < rule.minLength) {
      setError(name, 'Please provide a bit more detail.');
      return false;
    }

    clearError(name);
    return true;
  }

  function validateAll() {
    let valid = true;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name)) valid = false;
    });
    return valid;
  }

  /* Live validation on blur */
  Object.keys(rules).forEach(function (name) {
    const field = getField(name);
    if (field) {
      field.addEventListener('blur', function () { validateField(name); });
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) validateField(name);
      });
    }
  });

  /* ── SUBMISSION ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    successEl.style.display = 'none';
    failEl.style.display    = 'none';

    if (!validateAll()) return;

    submitBtn.disabled     = true;
    submitBtn.textContent  = 'Sending…';

    /* 
      ── FORM SUBMISSION ──
      Options:
      1. Formspree (recommended — free tier available):
         Replace the URL below with your Formspree endpoint.
         Sign up at formspree.io, create a form, get your endpoint.
         e.g. https://formspree.io/f/xpzgkwqr

      2. Netlify Forms:
         Add data-netlify="true" to the <form> tag and remove this fetch call.

      3. Custom backend:
         Replace the URL with your own API endpoint.
    */

    const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // ⚠ Replace before launch

    const data = {
      firstName: getField('firstName').value.trim(),
      lastName:  getField('lastName').value.trim(),
      phone:     getField('phone').value.trim(),
      email:     getField('email').value.trim(),
      service:   getField('service').value,
      message:   getField('message').value.trim()
    };

    fetch(FORM_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(data)
    })
    .then(function (res) {
      if (res.ok) {
        form.reset();
        successEl.style.display = 'flex';
        submitBtn.disabled      = false;
        submitBtn.innerHTML     = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send quote request';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Server error');
      }
    })
    .catch(function () {
      failEl.style.display   = 'flex';
      submitBtn.disabled     = false;
      submitBtn.innerHTML    = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send quote request';
      failEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

})();
