let currentTrip = null;

document.addEventListener("DOMContentLoaded", () => {
  loadTrips();

  document.getElementById("refreshBtn").addEventListener("click", loadTrips);
  document.getElementById("closeModal").addEventListener("click", closeModal);

  document.getElementById("modal").addEventListener("click", (event) => {
    if (event.target.id === "modal") {
      closeModal();
    }
  });

  document.getElementById("signupForm").addEventListener("submit", submitSignup);
});

async function loadTrips() {
  const tripList = document.getElementById("tripList");
  tripList.innerHTML = `<div class="empty" style="grid-column:1/-1;">正在加载行程...</div>`;

  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .eq("status", "active")
    .order("start_date", { ascending: true });

  if (error) {
    tripList.innerHTML = `<div class="empty" style="grid-column:1/-1;">加载失败：${escapeHTML(error.message)}</div>`;
    return;
  }

  document.getElementById("tripCount").textContent = data.length;

  if (!data.length) {
    tripList.innerHTML = `<div class="empty" style="grid-column:1/-1;">暂无可报名行程</div>`;
    return;
  }

  tripList.innerHTML = data.map((trip) => {
    return `
      <article class="trip-card">
        <div class="trip-cover"></div>
        <span class="tag">${escapeHTML(trip.trip_type || "行程计划")}</span>
        <h3>${escapeHTML(trip.title)}</h3>

        <div class="meta">
          📍 ${escapeHTML(trip.destination || "目的地待定")}<br>
          📅 ${formatDateRange(trip.start_date, trip.end_date)}<br>
          🕘 ${escapeHTML(trip.meet_time || "时间待定")}<br>
          🧭 ${escapeHTML(trip.meet_place || "集合地点待定")}<br>
          👥 ${trip.person_limit ? `人数上限 ${trip.person_limit} 人` : "不限人数"}
        </div>

        <p class="desc">${escapeHTML(trip.description || "")}</p>

        <button class="btn full" onclick="openSignup('${trip.id}')">立即报名</button>
      </article>
    `;
  }).join("");

  window.tripCache = data;
}

function openSignup(tripId) {
  currentTrip = window.tripCache.find(item => item.id === tripId);

  if (!currentTrip) {
    showToast("行程不存在");
    return;
  }

  document.getElementById("signupForm").reset();
  document.getElementById("tripId").value = currentTrip.id;
  document.getElementById("peopleCount").value = 1;

  document.getElementById("modalTitle").textContent = currentTrip.title;
  document.getElementById("modalMeta").textContent =
    `${currentTrip.destination || "目的地待定"}｜${formatDateRange(currentTrip.start_date, currentTrip.end_date)}`;

  document.getElementById("deviceInfo").innerHTML =
    `当前设备 ID：${getDeviceId()}<br>当前浏览器 ID：${getBrowserId()}`;

  document.getElementById("modal").classList.add("show");
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

async function submitSignup(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "提交中...";

  const payload = {
    p_trip_id: document.getElementById("tripId").value,
    p_user_id_text: document.getElementById("userIdText").value.trim(),
    p_name: document.getElementById("name").value.trim(),
    p_phone: document.getElementById("phone").value.trim(),
    p_people_count: Number(document.getElementById("peopleCount").value || 1),
    p_remark: document.getElementById("remark").value.trim(),
    p_device_id: getDeviceId(),
    p_browser_id: getBrowserId(),
    p_user_agent: navigator.userAgent
  };

  const { data, error } = await supabaseClient.rpc("submit_registration", payload);

  submitBtn.disabled = false;
  submitBtn.textContent = "确认提交报名";

  if (error) {
    showToast(normalizeSupabaseError(error));
    return;
  }

  closeModal();
  showToast(data?.message || "报名成功");
}