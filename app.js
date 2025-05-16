<!-- app.js -->
const QUESTIONS = [
  'What do my circumstances suggest?',
  'How do I sense the Spirit directing me?',
  'What do my counselors advise?',
  'What do I hear from God in prayer?',
  'What does God\'s Word say?'
];

const STORAGE_KEY = 'issues';
const view = document.getElementById('view');
const addIssueBtn = document.getElementById('addIssueBtn');

// --- Models and Persistence ---
function loadIssues() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveIssues(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}
function upsertIssue(issue) {
  const issues = loadIssues();
  const i = issues.findIndex(x => x.id === issue.id);
  if (i >= 0) issues[i] = issue; else issues.unshift(issue);
  saveIssues(issues);
}

// --- UI Renderers ---
function renderList() {
  const template = document.getElementById('issue-list-template');
  view.innerHTML = template.innerHTML;
  const ul = document.getElementById('issueList');
  const issues = loadIssues();
  issues.forEach(issue => {
    const li = document.createElement('li');
    li.textContent = issue.title || '(Untitled Issue)';
    li.onclick = () => renderDetail(issue.id);
    ul.appendChild(li);
  });
}

function renderDetail(issueId) {
  let issue = loadIssues().find(x => x.id === issueId) || {
    id: crypto.randomUUID(),
    title: '',
    answers: ['', '', '', '', ''],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reminderFrequency: 'none',
    reminderTime: '09:00'
  };

  const template = document.getElementById('issue-detail-template');
  view.innerHTML = template.innerHTML;

  const titleEl = document.getElementById('titleInput');
  const listEl = document.getElementById('questions');
  const freqEl = document.getElementById('frequency');
  const timeEl = document.getElementById('reminderTime');

  titleEl.value = issue.title;
  freqEl.value = issue.reminderFrequency;
  timeEl.value = issue.reminderTime;

  QUESTIONS.forEach((q, i) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.textContent = q;
    const ta = document.createElement('textarea');
    ta.value = issue.answers[i];
    ta.oninput = e => issue.answers[i] = e.target.value;
    li.append(label, ta);
    listEl.appendChild(li);
  });

  document.getElementById('saveBtn').onclick = () => {
    issue.title = titleEl.value;
    issue.reminderFrequency = freqEl.value;
    issue.reminderTime = timeEl.value;
    issue.updatedAt = Date.now();
    upsertIssue(issue);
    renderList();
  };

  document.getElementById('backBtn').onclick = renderList;
}

// --- Initialisation ---
window.addEventListener('load', () => {
  renderList();
});

addIssueBtn.onclick = () => renderDetail();

// --- PWA Installation Prompt ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e; // You could show an "Install" button
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
