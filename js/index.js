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

  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/[^\d]/g, "").slice(0, 11);
    });
  }
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

  const trips = data || [];

  document.getElementById("tripCount").textContent = trips.length;

  if (!trips.length) {
    tripList.innerHTML = `<div class="empty" style="grid-column:1/-1;">暂无可报名行程</div>`;
    window.tripCache = [];
    return;
  }

  tripList.innerHTML = trips.map((trip) => {
    const coverHTML = renderTripCover(trip);
    const priceHTML = renderPriceBox(trip);
    const descHTML = trip.description
      ? `<p class="desc">${escapeHTML(trip.description)}</p>`
      : `<p class="desc">更多行程信息待补充。</p>`;

    return `
      <article class="trip-card">
        ${coverHTML}

        <span class="tag">${escapeHTML(trip.trip_type || "行程计划")}</span>

        <h3>${escapeHTML(trip.title || "未命名行程")}</h3>

        <div class="meta">
          <div>📍 ${escapeHTML(trip.destination || "目的地待定")}</div>
          <div>📅 ${formatDateRange(trip.start_date, trip.end_date)}</div>
          <div>🕘 ${escapeHTML(trip.meet_time || "时间待定")}</div>
          <div>🧭 ${escapeHTML(trip.meet_place || "集合地点待定")}</div>
          <div>👥 ${trip.person_limit ? `人数上限 ${escapeHTML(trip.person_limit)} 人` : "不限人数"}</div>
        </div>

        ${priceHTML}

        ${descHTML}

        <button class="btn full" type="button" onclick="openSignup('${trip.id}')">立即报名</button>
      </article>
    `;
  }).join("");

  window.tripCache = trips;
}

function renderTripCover(trip) {
  if (trip.image_url) {
    return `
      <div class="trip-cover has-image">
        <img
          class="trip-img"
          src="${escapeHTML(trip.image_url)}"
          alt="${escapeHTML(trip.title || "行程图片")}"
          loading="lazy"
        />
      </div>
    `;
  }

  return `<div class="trip-cover"></div>`;
}

function renderPriceBox(trip) {
  const hasPrice = trip.price !== null && trip.price !== undefined && trip.price !== "";
  const includes = trip.price_includes || "";

  if (!hasPrice && !includes) {
    return "";
  }

  const priceText = hasPrice ? `¥${formatMoney(trip.price)} / 人` : "费用待定";
  const includesText = includes || "全程用车费、过路费、停车费";

  return `
    <div class="price-box">
      <div><strong>💰 费用：</strong>${escapeHTML(priceText)}</div>
      <div><strong>包含：</strong>${escapeHTML(includesText)}</div>
    </div>
  `;
}

function openSignup(tripId) {
  currentTrip = window.tripCache.find(item => item.id === tripId);

  if (!currentTrip) {
    showToast("行程不存在");
    return;
  }

  if (currentTrip.status !== "active") {
    showToast("该行程已关闭报名");
    loadTrips();
    return;
  }

  document.getElementById("signupForm").reset();
  document.getElementById("tripId").value = currentTrip.id;
  document.getElementById("peopleCount").value = 1;

  document.getElementById("modalTitle").textContent = currentTrip.title || "行程报名";

  const metaParts = [
    currentTrip.destination || "目的地待定",
    formatDateRange(currentTrip.start_date, currentTrip.end_date)
  ];

  if (currentTrip.price !== null && currentTrip.price !== undefined && currentTrip.price !== "") {
    metaParts.push(`¥${formatMoney(currentTrip.price)} / 人`);
  }

  document.getElementById("modalMeta").textContent = metaParts.join("｜");

  const deviceInfo = document.getElementById("deviceInfo");
  if (deviceInfo) {
    deviceInfo.innerHTML =
      `当前设备 ID：${getDeviceId()}<br>当前浏览器 ID：${getBrowserId()}`;
  }

  document.getElementById("modal").classList.add("show");
}

function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

async function submitSignup(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;

  const tripId = document.getElementById("tripId").value;
  const userIdText = document.getElementById("userIdText").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const peopleCount = Number(document.getElementById("peopleCount").value || 1);
  const remark = document.getElementById("remark").value.trim();

  const validationMessage = validateSignupForm({
    tripId,
    userIdText,
    name,
    phone,
    peopleCount
  });

  if (validationMessage) {
    showToast(validationMessage);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "提交中...";

  const canSignup = await checkTripCanSignup(tripId);

  if (!canSignup) {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    showToast("该行程已关闭报名");
    closeModal();
    await loadTrips();
    return;
  }

  const payload = {
    p_trip_id: tripId,
    p_user_id_text: userIdText,
    p_name: name,
    p_phone: phone,
    p_people_count: peopleCount,
    p_remark: remark,
    p_device_id: getDeviceId(),
    p_browser_id: getBrowserId(),
    p_user_agent: navigator.userAgent
  };

  const { data, error } = await supabaseClient.rpc("submit_registration", payload);

  submitBtn.disabled = false;
  submitBtn.textContent = originalText;

  if (error) {
    showToast(normalizeSupabaseError(error));
    return;
  }

  closeModal();
  showToast(data?.message || "报名成功");
  await loadTrips();
}

function validateSignupForm(values) {
  if (!values.tripId) {
    return "请选择要报名的行程";
  }

  if (!values.userIdText) {
    return "请填写用户 ID / 微信号";
  }

  if (!values.name) {
    return "请填写姓名";
  }

  if (!values.phone) {
    return "请填写手机号";
  }

  if (!isValidChinaMobile(values.phone)) {
    return "请填写正确的 11 位手机号";
  }

  if (!Number.isFinite(values.peopleCount) || values.peopleCount < 1) {
    return "同行人数至少为 1 人";
  }

  return "";
}

function isValidChinaMobile(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

async function checkTripCanSignup(tripId) {
  const { data, error } = await supabaseClient
    .from("trips")
    .select("status")
    .eq("id", tripId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.status === "active";
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return num % 1 === 0 ? String(num) : num.toFixed(2);
}