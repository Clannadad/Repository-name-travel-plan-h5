let allTrips = [];
let allRegistrations = [];

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await checkSession();
});

function bindEvents() {
  document.getElementById("loginForm").addEventListener("submit", login);
  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("tripForm").addEventListener("submit", createTrip);
  document.getElementById("reloadTripsBtn").addEventListener("click", loadAdminData);
  document.getElementById("tripFilter").addEventListener("change", renderRegistrations);
  document.getElementById("exportBtn").addEventListener("click", exportCSV);

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

async function createTrip(event) {
  event.preventDefault();

  const personLimitValue = document.getElementById("personLimit").value;

  const payload = {
    title: document.getElementById("title").value.trim(),
    destination: document.getElementById("destination").value.trim(),
    trip_type: document.getElementById("tripType").value.trim(),
    start_date: document.getElementById("startDate").value || null,
    end_date: document.getElementById("endDate").value || null,
    meet_time: document.getElementById("meetTime").value.trim(),
    meet_place: document.getElementById("meetPlace").value.trim(),
    person_limit: personLimitValue ? Number(personLimitValue) : null,
    description: document.getElementById("description").value.trim(),
    status: "active"
  };

  if (!payload.title) {
    showToast("请填写行程标题");
    return;
  }

  if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
    showToast("结束日期不能早于开始日期");
    return;
  }

  const { error } = await supabaseClient
    .from("trips")
    .insert(payload);

  if (error) {
    showToast("保存失败：" + error.message);
    return;
  }

  event.target.reset();
  showToast("行程已新增");
  await loadAdminData();
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

            return `
              <tr>
                <td>
                  <strong>${escapeHTML(trip.title)}</strong><br>
                  <span class="tag">${escapeHTML(trip.trip_type || "计划")}</span>
                </td>
                <td>${formatDateRange(trip.start_date, trip.end_date)}<br>${escapeHTML(trip.meet_time || "")}</td>
                <td>${escapeHTML(trip.destination || "")}<br>${escapeHTML(trip.meet_place || "")}</td>
                <td>${trip.status === "active" ? "开放中" : "已关闭"}</td>
                <td>${count}${trip.person_limit ? " / " + trip.person_limit : ""}</td>
                <td>
                  <button class="btn light" onclick="toggleTripStatus('${trip.id}', '${trip.status}')">
                    ${trip.status === "active" ? "关闭" : "开放"}
                  </button>
                  <button class="btn danger" onclick="deleteTrip('${trip.id}')">删除</button>
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

  const { error } = await supabaseClient
    .from("trips")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    showToast("操作失败：" + error.message);
    return;
  }

  showToast("状态已更新");
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