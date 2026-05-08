exports.handler = async function (event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message: "track-visit function is running",
      }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        ok: false,
        message: "Method Not Allowed",
      }),
    };
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          message: "Missing Supabase environment variables",
        }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const ip =
      event.headers["x-nf-client-connection-ip"] ||
      event.headers["client-ip"] ||
      event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      event.headers["x-real-ip"] ||
      "";

    const userAgent =
      body.user_agent ||
      event.headers["user-agent"] ||
      "";

    const parsed = parseUserAgent(userAgent);

    const record = {
      page_url: body.page_url || "",
      page_path: body.page_path || "",
      page_title: body.page_title || "",
      referrer: body.referrer || "",

      visitor_id: body.visitor_id || "",
      session_id: body.session_id || "",

      ip,
      user_agent: userAgent,

      browser: body.browser || parsed.browser,
      os: body.os || parsed.os,
      device_type: body.device_type || parsed.device_type,
      device_vendor: body.device_vendor || "",
      device_model: body.device_model || "",

      screen_width: Number(body.screen_width) || null,
      screen_height: Number(body.screen_height) || null,
      language: body.language || "",

      source: "website",
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/visit_logs`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const errorText = await res.text();

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          message: "Failed to insert visit log",
          error: errorText,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message: "Visit logged",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        message: error.message || "Unknown error",
      }),
    };
  }
};

function parseUserAgent(ua) {
  ua = ua || "";

  let browser = "Unknown";
  let os = "Unknown";
  let device_type = "Desktop";

  if (/Edg\//i.test(ua)) {
    browser = "Edge";
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = "Safari";
  } else if (/Firefox\//i.test(ua)) {
    browser = "Firefox";
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "Internet Explorer";
  }

  if (/Windows NT/i.test(ua)) {
    os = "Windows";
  } else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) {
    os = "macOS";
  } else if (/Android/i.test(ua)) {
    os = "Android";
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  if (/iPad|Tablet/i.test(ua)) {
    device_type = "Tablet";
  } else if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
    device_type = "Mobile";
  }

  return {
    browser,
    os,
    device_type,
  };
}