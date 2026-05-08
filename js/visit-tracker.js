(function () {
    function getOrCreateId(key) {
        let id = localStorage.getItem(key);

        if (!id) {
            id =
                Date.now().toString(36) +
                "-" +
                Math.random().toString(36).slice(2) +
                "-" +
                Math.random().toString(36).slice(2);

            localStorage.setItem(key, id);
        }

        return id;
    }

    function getSessionId() {
        const key = "travel_site_session_id";
        const timeKey = "travel_site_session_time";
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        let sessionId = sessionStorage.getItem(key);
        let lastTime = Number(sessionStorage.getItem(timeKey) || 0);

        if (!sessionId || now - lastTime > thirtyMinutes) {
            sessionId =
                "session-" +
                Date.now().toString(36) +
                "-" +
                Math.random().toString(36).slice(2);

            sessionStorage.setItem(key, sessionId);
        }

        sessionStorage.setItem(timeKey, String(now));

        return sessionId;
    }

    function getDeviceType() {
        const ua = navigator.userAgent || "";

        if (/iPad|Tablet/i.test(ua)) {
            return "Tablet";
        }

        if (/Mobile|Android|iPhone|iPod/i.test(ua)) {
            return "Mobile";
        }

        return "Desktop";
    }

    function getBrowser() {
        const ua = navigator.userAgent || "";

        if (/Edg\//i.test(ua)) return "Edge";
        if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) return "Chrome";
        if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return "Safari";
        if (/Firefox\//i.test(ua)) return "Firefox";
        if (/MSIE|Trident/i.test(ua)) return "Internet Explorer";

        return "Unknown";
    }

    function getOS() {
        const ua = navigator.userAgent || "";

        if (/Windows NT/i.test(ua)) return "Windows";
        if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "macOS";
        if (/Android/i.test(ua)) return "Android";
        if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "Unknown";
    }

    async function trackVisit() {
        try {
            const visitorId = getOrCreateId("travel_site_visitor_id");
            const sessionId = getSessionId();

            const data = {
                page_url: window.location.href,
                page_path: window.location.pathname,
                page_title: document.title || "",
                referrer: document.referrer || "",

                visitor_id: visitorId,
                session_id: sessionId,

                user_agent: navigator.userAgent || "",
                browser: getBrowser(),
                os: getOS(),
                device_type: getDeviceType(),

                screen_width: window.screen.width || null,
                screen_height: window.screen.height || null,
                language: navigator.language || "",
            };

            await fetch("/.netlify/functions/track-visit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                keepalive: true,
            });
        } catch (error) {
            console.warn("Visit tracking failed:", error);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", trackVisit);
    } else {
        trackVisit();
    }
})();