'use strict';

// Keep one non-sensitive preference, shared by the planner and interest form.
const STORAGE_KEY = 'tc-rescue-interest-v1';
const interestOptions = [
  { id: 'volunteer', label: 'Volunteering', title: 'Put your time to work',
    description: 'Support animals through care, transport, events, or organizing donations.',
    steps: ['Think about the days and times you can offer.', 'Tell us which volunteer roles interest you.'] },
  { id: 'foster', label: 'Fostering', title: 'Offer a safe place to land',
    description: 'A temporary home gives an animal time and space while a permanent home is found.',
    steps: ['Consider your space, schedule, and other pets.', 'Share your availability and pet experience with our team.'] },
  { id: 'adoption', label: 'Adoption information', title: 'Find a companion who fits your life',
    description: 'Start a conversation about available animals and the care they need.',
    steps: ['Consider the daily care you can provide.', 'Ask our team about the adoption process and current opportunities.'] },
  { id: 'partner', label: 'Donations or community partnership', title: 'Build support beyond one home',
    description: 'Help connect the rescue with everyday supplies, community events, or local partners.',
    steps: ['Identify the supplies or support you would like to offer.', 'Tell our team about your donation or partnership idea.'] }
];
const fieldRules = [
  { id: 'name', label: 'your full name', min: 2, max: 100 },
  { id: 'email', label: 'your email address', min: 1, max: 254 },
  { id: 'interest-type', label: 'an interest type', min: 1, max: 100 },
  { id: 'availability', label: 'your availability', min: 3, max: 200 },
  { id: 'experience', label: 'your experience with pets', min: 3, max: 1000 },
  { id: 'message', label: 'a short message', min: 10, max: 1000 }
];

function findInterest(id) {
  return interestOptions.find(option => option.id === id);
}

function readSavedInterest() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return findInterest(saved) ? saved : '';
  } catch (error) {
    return '';
  }
}

function saveInterest(id) {
  if (!findInterest(id)) return false;
  try {
    localStorage.setItem(STORAGE_KEY, id);
    return true;
  } catch (error) {
    return false;
  }
}

function forgetInterest() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

function renderRecommendation(id) {
  const result = document.getElementById('help-result');
  const saveButton = document.getElementById('save-interest');
  const link = document.getElementById('planner-contact');
  const option = findInterest(id);
  result.replaceChildren();
  saveButton.disabled = !option;
  link.textContent = option ? `Continue with ${option.label.toLowerCase()}` : 'Continue to the interest form';
  if (!option) {
    const prompt = document.createElement('p');
    prompt.textContent = 'Select an interest above to see how you can get started.';
    result.append(prompt);
    return;
  }
  const heading = document.createElement('h3');
  heading.textContent = option.title;
  const description = document.createElement('p');
  description.textContent = option.description;
  const list = document.createElement('ul');
  option.steps.forEach(step => {
    const item = document.createElement('li');
    item.textContent = step;
    list.append(item);
  });
  result.append(heading, description, list);
}

function initializePlanner() {
  const choice = document.getElementById('help-choice');
  if (!choice) return;
  document.getElementById('planner-controls').hidden = false;
  const status = document.getElementById('storage-feedback');
  const saved = readSavedInterest();
  choice.value = saved;
  renderRecommendation(saved);
  if (saved) status.textContent = `Welcome back. Your saved interest is ${findInterest(saved).label.toLowerCase()}.`;
  choice.addEventListener('change', () => {
    renderRecommendation(choice.value);
    status.textContent = choice.value ? 'Your new choice is ready. Select Remember my interest to save it.' : '';
  });
  document.getElementById('save-interest').addEventListener('click', () => {
    const savedOK = saveInterest(choice.value);
    status.textContent = savedOK
      ? `Saved: ${findInterest(choice.value).label}. This choice will be filled in on the interest form.`
      : 'This browser could not save your choice. You can still choose an interest on the form.';
  });
  document.getElementById('clear-interest').addEventListener('click', () => {
    const cleared = forgetInterest();
    if (cleared) {
      choice.value = '';
      renderRecommendation('');
    }
    status.textContent = cleared ? 'Your saved interest has been removed from this browser.' : 'This browser could not remove the saved choice. Check your browser storage settings.';
  });
  // A direct Continue action also carries the currently displayed selection.
  document.getElementById('planner-contact').addEventListener('click', () => {
    if (choice.value) saveInterest(choice.value);
  });
}

function validateField(rule) {
  const field = document.getElementById(rule.id);
  const value = field.value.trim();
  let message = '';
  if (!value) message = `Please enter ${rule.label}.`;
  else if (rule.id === 'email' && field.validity.typeMismatch) message = 'Enter a valid email address, such as name@example.com.';
  else if (rule.id === 'interest-type' && !findInterest(value)) message = 'Please choose an interest type from the list.';
  else if (value.length < rule.min) message = `Please use at least ${rule.min} characters for ${rule.label}.`;
  else if (value.length > rule.max) message = `Please use no more than ${rule.max} characters for ${rule.label}.`;
  document.getElementById(`${rule.id}-error`).textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  return message === '';
}

function initializeInterestForm() {
  const form = document.getElementById('interest-form');
  if (!form) return;
  // Set only after JS loads, leaving built-in validation available without JS.
  form.noValidate = true;
  const select = document.getElementById('interest-type');
  const restored = document.getElementById('restored-interest');
  const feedback = document.getElementById('form-feedback');
  const saved = readSavedInterest();
  if (saved) {
    select.value = saved;
    restored.textContent = `Restored from this browser: ${findInterest(saved).label}. You can change this selection.`;
  }
  select.addEventListener('change', () => {
    if (!select.value) {
      const removed = forgetInterest();
      restored.textContent = removed ? 'No interest is saved in this browser.' : 'The saved interest could not be removed.';
    } else {
      restored.textContent = saveInterest(select.value) ? `Remembered in this browser: ${findInterest(select.value).label}.` : 'This choice could not be saved. You can still complete the form.';
    }
  });
  fieldRules.forEach(rule => {
    const field = document.getElementById(rule.id);
    field.addEventListener('input', () => {
      feedback.textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validateField(rule);
    });
    field.addEventListener('change', () => {
      feedback.textContent = '';
      if (field.getAttribute('aria-invalid') === 'true') validateField(rule);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalidRules = fieldRules.filter(rule => !validateField(rule));
    if (invalidRules.length) {
      feedback.textContent = `Please correct ${invalidRules.length} highlighted field${invalidRules.length === 1 ? '' : 's'}. Your entries have been kept.`;
      document.getElementById(invalidRules[0].id).focus();
      return;
    }
    saveInterest(select.value);
    feedback.textContent = 'Your interest form is complete. This classroom demo has not sent an inquiry. Your contact details and message have not been stored.';
    feedback.focus();
  });
}

initializePlanner();
initializeInterestForm();
