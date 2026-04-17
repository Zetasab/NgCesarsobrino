(function () {
    console.info("[visit-tracker] script cargado (v1)");
    window.__visitTrackerLoaded = true;
    const VISIT_ENDPOINT = "https://cesarsobapigateway.up.railway.app/api/Visits/addvisitng";
    const HUMAN_SIGNAL_TIMEOUT_MS = 12000;
    const VISIT_DEDUP_TTL_MS = 30 * 60 * 1000;
    const BOT_UA_REGEX = /bot|crawl|spider|slurp|bingpreview|headless|wget|curl|python-requests|aiohttp|httpclient|scanner|nikto|sqlmap|nmap/i;
    // const VISIT_ENDPOINT = "http://localhost:5112/api/Visits/addvisit";

    function getVisitParam() {
        const queryParam = new URLSearchParams(window.location.search).get("visitparams");
        if (queryParam) {
            return queryParam;
        }

        const segments = window.location.pathname.split("/").filter(Boolean);
        const visitParamsIndex = segments.findIndex(function (segment) {
            return segment.toLowerCase() === "visitparams";
        });

        if (visitParamsIndex !== -1 && segments[visitParamsIndex + 1]) {
            return decodeURIComponent(segments[visitParamsIndex + 1]);
        }

        return null;
    }

    async function registerVisit() {
        try {
            const visitParam = getVisitParam();
            if (isLikelyBot()) {
                console.info("[visit-tracker] visita ignorada (bot detectado)");
                return;
            }

            const humanSignalDetected = await waitForHumanSignal(HUMAN_SIGNAL_TIMEOUT_MS);
            if (!humanSignalDetected) {
                console.info("[visit-tracker] visita ignorada (sin señal humana)");
                return;
            }

            const dedupKey = getVisitDedupKey(visitParam);
            if (wasRecentlyTracked(dedupKey)) {
                console.info("[visit-tracker] visita ignorada (duplicada recientemente)");
                return;
            }

            const endpointUrl = new URL(VISIT_ENDPOINT);

            if (visitParam) {
                endpointUrl.searchParams.set("visitparams", visitParam);
            }

            await fetch(endpointUrl.toString(), {
                method: "POST",
                mode: "cors",
                credentials: "omit",
                cache: "no-store"
            });

            markTracked(dedupKey);

            console.info("[visit-tracker] visita registrada", endpointUrl.toString());
        } catch (error) {
            console.warn("[visit-tracker] No se pudo registrar la visita:", error);
        }
    }

    function isLikelyBot() {
        const userAgent = navigator.userAgent || "";
        const webdriver = navigator.webdriver === true;
        return BOT_UA_REGEX.test(userAgent) || webdriver;
    }

    function waitForHumanSignal(timeoutMs) {
        return new Promise(function (resolve) {
            let resolved = false;

            function cleanup() {
                window.removeEventListener("pointerdown", onHumanAction, true);
                window.removeEventListener("keydown", onHumanAction, true);
                window.removeEventListener("touchstart", onHumanAction, true);
                window.removeEventListener("scroll", onHumanAction, true);
            }

            function finish(value) {
                if (resolved) {
                    return;
                }
                resolved = true;
                cleanup();
                resolve(value);
            }

            function onHumanAction() {
                finish(true);
            }

            window.addEventListener("pointerdown", onHumanAction, { once: true, passive: true, capture: true });
            window.addEventListener("keydown", onHumanAction, { once: true, passive: true, capture: true });
            window.addEventListener("touchstart", onHumanAction, { once: true, passive: true, capture: true });
            window.addEventListener("scroll", onHumanAction, { once: true, passive: true, capture: true });

            setTimeout(function () {
                const visibleAndFocused = document.visibilityState === "visible" && document.hasFocus();
                finish(visibleAndFocused);
            }, timeoutMs);
        });
    }

    function getVisitDedupKey(visitParam) {
        const path = window.location.pathname || "/";
        const param = visitParam || "-";
        return "visit-tracker:last:" + path + ":" + param;
    }

    function wasRecentlyTracked(key) {
        try {
            const lastTimestampRaw = localStorage.getItem(key);
            if (!lastTimestampRaw) {
                return false;
            }

            const lastTimestamp = Number(lastTimestampRaw);
            if (!Number.isFinite(lastTimestamp)) {
                return false;
            }

            return Date.now() - lastTimestamp < VISIT_DEDUP_TTL_MS;
        } catch (_) {
            return false;
        }
    }

    function markTracked(key) {
        try {
            localStorage.setItem(key, String(Date.now()));
        } catch (_) {
            // Ignore storage failures (private mode, quota, etc.).
        }
    }

    function scheduleRegisterVisit() {
        setTimeout(registerVisit, 4000);
    }

    if (document.readyState === "complete") {
        scheduleRegisterVisit();
    } else {
        window.addEventListener("load", scheduleRegisterVisit, { once: true });
    }
})();