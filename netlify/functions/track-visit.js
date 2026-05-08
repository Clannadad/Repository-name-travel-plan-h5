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
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
        }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const record = {
      page_url: body.page_url || "",
      page_path: body.page_path || "",
      page_title: body.page_title || "",
      referrer: body.referrer || "",

      visitor_id: body.visitor_id || "",
      session_id: body.session_id || "",

      user_agent: body.user_agent || "",
      browser: body.browser || "",
      os: body.os || "",
      device_type: body.device_type || "",

      screen_width: body.screen_width || null,
      screen_height: body.screen_height || null,
      language: body.language || "",
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/visit_logs`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(record),
    });

    const text = await res.text();

    if (!res.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          ok: false,
          message: "Failed to insert visit log",
          status: res.status,
          error: text,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        message: "Visit logged",
        data: text ? JSON.parse(text) : null,
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