const DEVICE_KEY = "travel_plan_device_id_v1";

function uuid(prefix = "id") {
  return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = uuid("device");
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function getBrowserId() {
  const raw = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ].join("|");

  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }

  return "browser_" + Math.abs(hash).toString(36);
}

function formatDateRange(start, end) {
  if (!start && !end) return "待定";
  if (start && !end) return start;
  if (!start && end) return end;
  if (start === end) return start;
  return `${start} 至 ${end}`;
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function normalizeSupabaseError(error) {
  if (!error) return "操作失败";
  return error.message || error.details || "操作失败";
}