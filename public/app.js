const API = '/api';
const statusEl = document.getElementById('status');
const form = document.getElementById('user-form');
const idInput = document.getElementById('user-id');
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const passwordInput = document.getElementById('user-password');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formOut = document.getElementById('form-out');
const formTitle = document.getElementById('form-title');

function setStatus(msg) {
  statusEl.textContent = msg;
}

function setEditing(user) {
  if (user) {
    idInput.value = user._id;
    nameInput.value = user.name ?? '';
    emailInput.value = user.email ?? '';
    passwordInput.value = '';
    passwordInput.required = false;
    passwordInput.placeholder = 'leave blank to keep';
    submitBtn.textContent = 'Update';
    formTitle.textContent = 'Update user';
    cancelBtn.hidden = false;
  } else {
    form.reset();
    idInput.value = '';
    passwordInput.required = true;
    passwordInput.placeholder = '';
    submitBtn.textContent = 'Add';
    formTitle.textContent = 'Add user';
    cancelBtn.hidden = true;
  }
}

async function readError(res) {
  try {
    const j = await res.json();
    return j.error || JSON.stringify(j);
  } catch {
    return await res.text();
  }
}

async function loadUsers() {
  const ul = document.getElementById('users-out');
  ul.textContent = '';
  setStatus('loading users...');
  const r = await fetch(API);
  if (!r.ok) {
    ul.textContent = `load failed status=${r.status}: ${await readError(r)}`;
    setStatus('load failed');
    return;
  }
  const users = await r.json();
  setStatus(`loaded ${users.length} user(s)`);
  for (const u of users) {
    const li = document.createElement('li');
    li.dataset.id = u._id;
    const label = document.createElement('span');
    label.textContent = `${u.name} <${u.email}>`;
    const edit = document.createElement('button');
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => setEditing(u));
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.addEventListener('click', async () => {
      if (!confirm(`Delete ${u.name}?`)) return;
      const d = await fetch(`${API}/${u._id}`, { method: 'DELETE' });
      if (!d.ok) {
        alert(`Delete failed: ${await readError(d)}`);
        return;
      }
      if (idInput.value === u._id) setEditing(null);
      await loadUsers();
    });
    li.append(label, ' ', edit, ' ', del);
    ul.appendChild(li);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = idInput.value;
  const body = { name: nameInput.value.trim(), email: emailInput.value.trim() };
  const pw = passwordInput.value;
  // POST requires password; PUT keeps old if blank
  if (!id || pw) body.password = pw;
  formOut.textContent = '';
  const r = await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    formOut.textContent = `failed: ${await readError(r)}`;
    return;
  }
  formOut.textContent = id ? 'updated' : 'added';
  setEditing(null);
  await loadUsers();
});

cancelBtn.addEventListener('click', () => {
  setEditing(null);
  formOut.textContent = '';
});

document.getElementById('users-btn').addEventListener('click', loadUsers);

loadUsers();
