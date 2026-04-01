if (typeof redirectIfLoggedIn === "function") redirectIfLoggedIn();
if (typeof checkUrlForToken === "function" && checkUrlForToken()) {
  window.location.href = "dashboard.html";
}

function switchTab(name, btn) {
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  btn.classList.add("active");
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  const show = inp.type === "password";
  inp.type = show ? "text" : "password";
  btn.innerHTML = show
    ? `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = "alert alert-" + type + " show";
}

async function handleLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pw = document.getElementById("login-pw").value;
  if (!email || !pw) {
    showMsg("login-alert", "Please fill in all fields.", "error");
    return;
  }

  const btn = document.querySelector("#tab-login .btn-submit");
  btn.disabled = true;
  btn.textContent = "Signing in…";

  const res = await loginWithEmail(email, pw);

  btn.disabled = false;
  btn.textContent = "Login";

  if (res.ok && res.data.token) {
    setToken(res.data.token);
    window.location.href = "dashboard.html";
  } else {
    showMsg(
      "login-alert",
      res.data?.error || "Login failed. Please try again.",
      "error",
    );
  }
}

async function handleSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const pw = document.getElementById("signup-pw").value;
  if (!name || !email || !pw) {
    showMsg("signup-alert", "Please fill in all fields.", "error");
    return;
  }

  const btn = document.querySelector("#tab-signup .btn-submit");
  btn.disabled = true;
  btn.textContent = "Creating account…";

  const res = await registerWithEmail(email, pw, name);

  btn.disabled = false;
  btn.textContent = "Signup";

  if (res.ok && res.data.token) {
    setToken(res.data.token);
    window.location.href = "dashboard.html";
  } else {
    showMsg(
      "signup-alert",
      res.data?.error || "Registration failed. Please try again.",
      "error",
    );
  }
}

const params = new URLSearchParams(window.location.search);
if (params.get("error"))
  showMsg("login-alert", "Google login failed. Please try again.", "error");