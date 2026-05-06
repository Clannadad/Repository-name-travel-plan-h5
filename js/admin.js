let allTrips = [];
let allRegistrations = [];
let editingTripId = null;

const TRIP_IMAGE_BUCKET = "trip-images";

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await checkSession();
});

function bindEvents() {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("tripForm").addEventListener("submit", saveTrip);
  document.getElementById("reloadTripsBtn").addEventListener("click", loadAdminData);
  document.getElementById("tripFilter").addEventListener("change", renderRegistrations);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);

  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", cancelEditTrip);
  }

  const imageInput = document.getElementById("tripImage");
  if (imageInput) {
    imageInput.addEventListener("change", previewTripImage);
  }

  document.querySelectorAll(".tabs button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const tab = button.dataset.tab;
      document.getElementById("tripsTab").classList.toggle("hidden", tab !== "trips");
      document.getElementById("registrationsTab").classList.toggle("hidden", tab !== "registrations");

      if (tab === "registrations") {
        renderRegistrations();
      }
    });
  });
}

async function checkSession() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    showAdmin();
    await loadAdminData();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById("loginPanel").classList.remove("hidden");
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
}

function showAdmin() {
  document.getElementById("loginPanel").classList.add("hidden");
  document.getElementById("adminPanel").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
}

async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showToast("登录失败：" + error.message);
    return;
  }

  showToast("登录成功");
  showAdmin();
  await loadAdminData();
}

async function logout() {
  await supabaseClient.auth.signOut();
  showToast("已退出登录");
  showLogin();
}

async function loadAdminData() {
  await Promise.all([
    loadTrips(),
    loadRegistrations()
  ]);

  renderAdminTrips();
  renderTripFilter();
  renderRegistrations();
  updateStats();
}

async function loadTrips() {
  const { data, error } = await supabaseClient
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    showToast("行程加载失败：" + error.message);
    allTrips = [];
    return;
  }

  allTrips = data || [];
}

async function loadRegistrations() {
  const { data, error } = await supabaseClient
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    showToast("报名数据加载失败：" + error.message);
    allRegistrations = [];
    return;
  }

  allRegistrations = data || [];
}

function updateStats() {
  document.getElementById("adminTripCount").textContent = allTrips.length;
  document.getElementById("adminRegCount").textContent = allRegistrations.length;
}

async function saveTrip(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = document.getElementById("saveTripBtn") || form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn ? submitBtn.textContent : "";

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = editingTripId ? "更新中..." : "保存中...";
    }

    const personLimitValue = document.getElementById("personLimit").value;
    const priceValue = getInputValue("price");
    const imageFile = getFileValue("tripImage");

    const payload = {
      title: document.getElementById("title").value.trim(),
      destination: document.getElementById("destination").value.trim(),
      trip_type: document.getElementById("tripType").value.trim(),
      start_date: document.getElementById("startDate").value || null,
      end_date: document.getElementById("endDate").value || null,
      meet_time: document.getElementById("meetTime").value.trim(),
      meet_place: document.getElementById("meetPlace").value.trim(),
      person_limit: personLimitValue ? Number(personLimitValue) : null,
      price: priceValue ? Number(priceValue) : null,
      price_includes: getInputValue("priceIncludes") || "全程用车费、过路费、停车费",
      description: document.getElementById("description").value.trim()
    };

    if (!payload.title) {
      showToast("请填写行程标题");
      return;
    }

    if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
      showToast("结束日期不能早于开始日期");
      return;
    }

    if (payload.person_limit !== null && (!Number.isFinite(payload.person_limit) || payload.person_limit <= 0)) {
      showToast("人数上限必须大于 0");
      return;
    }

    if (payload.price !== null && (!Number.isFinite(payload.price) || payload.price < 0)) {
      showToast("金额不能小于 0");
      return;
    }

    if (imageFile) {
      const imageUrl = await uploadTripImage(imageFile);
      payload.image_url = imageUrl;
    }

    let error;

    if (editingTripId) {
      const result = await supabaseClient
        .from("trips")
        .update(payload)
        .eq("id", editingTripId);

      error = result.error;
    } else {
      payload.image_url = payload.image_url || null;
      payload.status = "active";

      const result = await supabaseClient
        .from("trips")
        .insert(payload);

      error = result.error;
    }

    if (error) {
      showToast((editingTripId ? "更新失败：" : "保存失败：") + error.message);
      return;
    }

    showToast(editingTripId ? "行程已更新" : "行程已新增");

    resetTripFormState();
    await loadAdminData();

  } catch (err) {
    showToast((editingTripId ? "更新失败：" : "保存失败：") + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = document.getElementById("editTripId").value ? "保存修改" : originalBtnText;
    }
  }
}

function editTrip(id) {
  const trip = allTrips.find(item => item.id === id);

  if (!trip) {
    showToast("行程不存在");
    return;
  }

  editingTripId = id;

  document.getElementById("editTripId").value = id;
  document.getElementById("title").value = trip.title || "";
  document.getElementById("destination").value = trip.destination || "";
  document.getElementById("tripType").value = trip.trip_type || "";
  document.getElementById("startDate").value = trip.start_date || "";
  document.getElementById("endDate").value = trip.end_date || "";
  document.getElementById("meetTime").value = trip.meet_time || "";
  document.getElementById("personLimit").value = trip.person_limit || "";
  document.getElementById("price").value = trip.price !== null && trip.price !== undefined ? trip.price : "";
  document.getElementById("priceIncludes").value = trip.price_includes || "全程用车费、过路费、停车费";
  document.getElementById("meetPlace").value = trip.meet_place || "";
  document.getElementById("description").value = trip.description || "";

  const formTitle = document.getElementById("tripFormTitle");
  if (formTitle) {
    formTitle.textContent = "编辑行程";
  }

  const formDesc = document.getElementById("tripFormDesc");
  if (formDesc) {
    formDesc.textContent = "正在编辑已有行程。重新选择封面图后会替换前台展示图片。";
  }

  const saveBtn = document.getElementById("saveTripBtn");
  if (saveBtn) {
    saveBtn.textContent = "保存修改";
  }

  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) {
    cancelBtn.classList.remove("hidden");
  }

  const imageInput = document.getElementById("tripImage");
  if (imageInput) {
    imageInput.value = "";
  }

  const preview = document.getElementById("tripImagePreview");
  if (preview) {
    if (trip.image_url) {
      preview.innerHTML = `
        <div class="preview-label">当前封面图</div>
        <img src="${escapeHTML(trip.image_url)}" alt="${escapeHTML(trip.title || "行程封面")}">
      `;
      preview.classList.remove("hidden");
    } else {
      preview.innerHTML = "";
      preview.classList.add("hidden");
    }
  }

  document.getElementById("tripForm").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function cancelEditTrip() {
  resetTripFormState();
  showToast("已取消编辑");
}

function resetTripFormState() {
  editingTripId = null;

  const form = document.getElementById("tripForm");
  if (form) {
    form.reset();
  }

  const editTripId = document.getElementById("editTripId");
  if (editTripId) {
    editTripId.value = "";
  }

  const formTitle = document.getElementById("tripFormTitle");
  if (formTitle) {
    formTitle.textContent = "新增行程";
  }

  const formDesc = document.getElementById("tripFormDesc");
  if (formDesc) {
    formDesc.textContent = "填写行程基础信息，上传封面图后会展示在前台行程卡片中。";
  }

  const saveBtn = document.getElementById("saveTripBtn");
  if (saveBtn) {
    saveBtn.textContent = "保存行程";
    saveBtn.disabled = false;
  }

  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) {
    cancelBtn.classList.add("hidden");
  }

  clearTripImagePreview();

  const priceIncludes = document.getElementById("priceIncludes");
  if (priceIncludes) {
    priceIncludes.value = "全程用车费、过路费、停车费";
  }
}

async function uploadTripImage(file) {
  validateImageFile(file);

  const ext = getFileExt(file.name);
  const safeExt = ext || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`;
  const filePath = `covers/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(TRIP_IMAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw new Error("图片上传失败：" + uploadError.message);
  }

  const { data } = supabaseClient.storage
    .from(TRIP_IMAGE_BUCKET)
    .getPublicUrl(filePath);

  if (!data || !data.publicUrl) {
    throw new Error("图片地址获取失败");
  }

  return data.publicUrl;
}

function validateImageFile(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("图片格式仅支持 JPG、PNG、WEBP、GIF");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("图片大小不能超过 5MB");
  }
}

function previewTripImage() {
  const file = getFileValue("tripImage");
  const preview = document.getElementById("tripImagePreview");

  if (!preview) return;

  if (!file) {
    preview.innerHTML = "";
    preview.classList.add("hidden");
    return;
  }

  try {
    validateImageFile(file);
  } catch (err) {
    showToast(err.message);
    document.getElementById("tripImage").value = "";
    preview.innerHTML = "";
    preview.classList.add("hidden");
    return;
  }

  const url = URL.createObjectURL(file);

  preview.innerHTML = `
    <div class="preview-label">${editingTripId ? "新封面图预览" : "封面图预览"}</div>
    <img src="${url}" alt="行程图片预览">
  `;
  preview.classList.remove("hidden");
}

function clearTripImagePreview() {
  const preview = document.getElementById("tripImagePreview");

  if (preview) {
    preview.innerHTML = "";
    preview.classList.add("hidden");
  }
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function getFileValue(id) {
  const el = document.getElementById(id);
  return el && el.files && el.files[0] ? el.files[0] : null;
}

function getFileExt(filename) {
  if (!filename || !filename.includes(".")) return "";
  return filename.split(".").pop().toLowerCase();
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return num % 1 === 0 ? String(num) : num.toFixed(2);
}

function renderAdminTrips() {
  const box = document.getElementById("adminTripList");

  if (!allTrips.length) {
    box.innerHTML = `<div class="empty">暂无行程</div>`;
    return;
  }

  box.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>行程</th>
            <th>时间</th>
            <th>地点</th>
            <th>金额</th>
            <th>状态</th>
            <th>报名数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${allTrips.map(trip => {
            const count = allRegistrations
              .filter(r => r.trip_id === trip.id)
              .reduce((sum, r) => sum + Number(r.people_count || 1), 0);

            const imageHTML = trip.image_url
              ? `<img class="admin-trip-thumb" src="${escapeHTML(trip.image_url)}" alt="${escapeHTML(trip.title)}">`
              : `<div class="admin-trip-thumb placeholder">无图</div>`;

            const priceText = trip.price !== null && trip.price !== undefined
              ? `¥${formatMoney(trip.price)}`
              : "未填写";

            const statusText = trip.status === "active" ? "开放中" : "已关闭";
            const statusClass = trip.status === "active" ? "status-active" : "status-closed";

            return `
              <tr>
                <td>
                  <div class="admin-trip-cell">
                    ${imageHTML}
                    <div>
                      <strong>${escapeHTML(trip.title)}</strong><br>
                      <span class="tag">${escapeHTML(trip.trip_type || "计划")}</span>
                    </div>
                  </div>
                </td>
                <td>${formatDateRange(trip.start_date, trip.end_date)}<br>${escapeHTML(trip.meet_time || "")}</td>
                <td>${escapeHTML(trip.destination || "")}<br>${escapeHTML(trip.meet_place || "")}</td>
                <td>
                  <strong>${escapeHTML(priceText)}</strong><br>
                  <small>${escapeHTML(trip.price_includes || "")}</small>
                </td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${count}${trip.person_limit ? " / " + trip.person_limit : ""}</td>
                <td>
                  <div class="table-actions">
                    <button class="btn light" onclick="editTrip('${trip.id}')">编辑</button>
                    <button class="btn light" onclick="toggleTripStatus('${trip.id}', '${trip.status}')">
                      ${trip.status === "active" ? "关闭" : "开放"}
                    </button>
                    <button class="btn danger" onclick="deleteTrip('${trip.id}')">删除</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function toggleTripStatus(id, currentStatus) {
  const nextStatus = currentStatus === "active" ? "closed" : "active";

  if (nextStatus === "closed") {
    if (!confirm("确定关闭该行程报名吗？关闭后用户将无法继续报名。")) {
      return;
    }
  }

  const { error } = await supabaseClient
    .from("trips")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    showToast("操作失败：" + error.message);
    return;
  }

  if (editingTripId === id) {
    resetTripFormState();
  }

  showToast(nextStatus === "active" ? "行程已开放报名" : "行程已关闭报名");
  await loadAdminData();
}

async function deleteTrip(id) {
  if (!confirm("确定删除该行程吗？删除后对应报名记录也会被删除。")) return;

  const { error } = await supabaseClient
    .from("trips")
    .delete()
    .eq("id", id);

  if (error) {
    showToast("删除失败：" + error.message);
    return;
  }

  if (editingTripId === id) {
    resetTripFormState();
  }

  showToast("行程已删除");
  await loadAdminData();
}

function renderTripFilter() {
  const select = document.getElementById("tripFilter");

  select.innerHTML = `
    <option value="all">全部行程</option>
    ${allTrips.map(trip => `
      <option value="${trip.id}">${escapeHTML(trip.title)}</option>
    `).join("")}
  `;
}

function renderRegistrations() {
  const box = document.getElementById("registrationList");
  const filter = document.getElementById("tripFilter").value || "all";

  let list = allRegistrations;

  if (filter !== "all") {
    list = list.filter(item => item.trip_id === filter);
  }

  if (!list.length) {
    box.innerHTML = `<div class="empty">暂无报名信息</div>`;
    return;
  }

  box.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>提交时间</th>
            <th>行程</th>
            <th>用户ID</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>人数</th>
            <th>备注</th>
            <th>设备信息</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(item => {
            const trip = allTrips.find(t => t.id === item.trip_id);

            return `
              <tr>
                <td>${new Date(item.created_at).toLocaleString()}</td>
                <td>${escapeHTML(trip ? trip.title : "行程已删除")}</td>
                <td>${escapeHTML(item.user_id_text)}</td>
                <td>${escapeHTML(item.name)}</td>
                <td>${escapeHTML(item.phone)}</td>
                <td>${escapeHTML(item.people_count)}</td>
                <td>${escapeHTML(item.remark || "")}</td>
                <td style="word-break:break-all;max-width:260px;">
                  设备：${escapeHTML(item.device_id)}<br>
                  浏览器：${escapeHTML(item.browser_id)}
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function exportCSV() {
  if (!allRegistrations.length) {
    showToast("暂无可导出的报名数据");
    return;
  }

  const headers = [
    "提交时间",
    "行程标题",
    "金额",
    "费用包含",
    "用户ID",
    "姓名",
    "手机号",
    "人数",
    "备注",
    "设备ID",
    "浏览器ID"
  ];

  const rows = allRegistrations.map(item => {
    const trip = allTrips.find(t => t.id === item.trip_id);

    return [
      new Date(item.created_at).toLocaleString(),
      trip ? trip.title : "行程已删除",
      trip && trip.price !== null && trip.price !== undefined ? formatMoney(trip.price) : "",
      trip ? trip.price_includes || "" : "",
      item.user_id_text,
      item.name,
      item.phone,
      item.people_count,
      item.remark || "",
      item.device_id,
      item.browser_id
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "行程报名信息.csv";
  a.click();
  URL.revokeObjectURL(url);
}