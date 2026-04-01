const API_BASE = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("jwt_token");
}

function setToken(token) {
  localStorage.setItem("jwt_token", token);
}

function clearToken() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_profile");
}

function isLoggedIn() {
  return !!getToken();
}

function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "dashboard.html";
  }
}

async function apiCall(method, path, body = null) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = "Bearer " + token;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(API_BASE + path, options);

  if (response.status === 401) {
    clearToken();
    window.location.href = "index.html";
    return;
  }

  const text = await response.text();
  try {
    return { ok: response.ok, status: response.status, data: JSON.parse(text) };
  } catch {
    return { ok: response.ok, status: response.status, data: text };
  }
}

function loginWithGoogle() {
  window.location.href = API_BASE + "/oauth2/authorization/google";
}

async function loadUserProfile() {
  const cached = localStorage.getItem("user_profile");
  if (cached) return JSON.parse(cached);

  const res = await apiCall("GET", "/auth/me");
  if (res && res.ok) {
    localStorage.setItem("user_profile", JSON.stringify(res.data));
    return res.data;
  }
  return null;
}

function logout() {
  clearToken();
  window.location.href = "index.html";
}

async function initNav(activePage) {
  // Mark active link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.dataset.page === activePage) link.classList.add("active");
  });

  // Load user into avatar
  const user = await loadUserProfile();
  const avatarEl = document.getElementById("nav-avatar");
  if (!avatarEl || !user) return;

  if (user.picture) {
    avatarEl.innerHTML = `<img src="${user.picture}" alt="${user.name}">`;
  } else {
    avatarEl.textContent = (user.name || user.email || "U")[0].toUpperCase();
  }
}

async function getAllMeasurements() {
  return await apiCall("GET", "/api/measurements");
}

async function getMeasurementCount() {
  return await apiCall("GET", "/api/measurements/count");
}

async function deleteAllMeasurements() {
  return await apiCall("DELETE", "/api/measurements");
}

async function compareQuantities(q1, q2) {
  return await apiCall("POST", "/api/measurements/compare", { q1, q2 });
}

async function convertQuantity(quantity, targetUnit) {
  return await apiCall("POST", "/api/measurements/convert", {
    quantity,
    targetUnit,
  });
}

async function addQuantities(q1, q2) {
  return await apiCall("POST", "/api/measurements/add", { q1, q2 });
}

async function subtractQuantities(q1, q2) {
  return await apiCall("POST", "/api/measurements/subtract", { q1, q2 });
}

async function divideQuantities(q1, q2) {
  return await apiCall("POST", "/api/measurements/divide", { q1, q2 });
}

const UNITS = {
  LENGTH: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  WEIGHT: ["KILOGRAM", "GRAM", "POUND"],
  VOLUME: ["LITRE", "MILLILITRE", "GALLON"],
  TEMPERATURE: ["CELSIUS", "FAHRENHEIT"],
};

const UNIT_TO_TYPE = {};
Object.entries(UNITS).forEach(([type, units]) => {
  units.forEach((u) => (UNIT_TO_TYPE[u] = type));
});

function populateUnitSelect(selectEl, type = null) {
  selectEl.innerHTML = '<option value="">Select unit</option>';
  const groups = type ? { [type]: UNITS[type] } : UNITS;
  Object.entries(groups).forEach(([groupName, units]) => {
    const og = document.createElement("optgroup");
    og.label = groupName;
    units.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = u;
      opt.textContent = u.charAt(0) + u.slice(1).toLowerCase();
      og.appendChild(opt);
    });
    selectEl.appendChild(og);
  });
}

function showAlert(el, message, type = "info") {
  el.className = `alert alert-${type} show`;
  el.textContent = message;
}

function hideAlert(el) {
  el.className = "alert";
}

function showResult(el, label, value) {
  el.querySelector(".result-label").textContent = label;
  el.querySelector(".result-value").textContent = value;
  el.classList.add("show");
}

function setLoading(btn, spinner, loading) {
  btn.disabled = loading;
  spinner.classList.toggle("show", loading);
  btn.style.opacity = loading ? "0.6" : "1";
}

function checkUrlForToken() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    setToken(token);
    // Clean the token out of the URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
}

async function loginWithEmail(email, password) {
  const res = await fetch(API_BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function registerWithEmail(email, password, name) {
  const res = await fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}
