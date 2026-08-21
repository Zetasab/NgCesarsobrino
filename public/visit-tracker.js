(function () {
    console.info("[visit-tracker] script cargado (v2)");
    window.__visitTrackerLoaded = true;
    const API_BASE = "https://cesarsobapigateway.up.railway.app";
    const VISIT_ENDPOINT = API_BASE + "/api/addportfolio";
    const KEEPALIVE_ENDPOINT = API_BASE + "/api/addkeepaliveportfolio";
    const HUMAN_SIGNAL_TIMEOUT_MS = 12000;
    const VISIT_DEDUP_TTL_MS = 30 * 60 * 1000;
    const HEARTBEAT_INTERVAL_MS = 60000;
    const ID_SEG_KEY = "portfolio_id_seg";
    const BOT_UA_REGEX = /bot|crawl|spider|slurp|bingpreview|headless|wget|curl|python-requests|aiohttp|httpclient|scanner|nikto|sqlmap|nmap/i;

    let heartbeatIntervalId = null;

    function getIdSeg() {
        let idSeg = sessionStorage.getItem(ID_SEG_KEY);
        if (!idSeg) {
            idSeg = crypto.randomUUID();
            sessionStorage.setItem(ID_SEG_KEY, idSeg);
        }
        return idSeg;
    }

    function startHeartbeat() {
        if (heartbeatIntervalId !== null) {
            return;
        }

        heartbeatIntervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    }

    function sendHeartbeat() {
        const endpointUrl = new URL(KEEPALIVE_ENDPOINT);
        endpointUrl.searchParams.set("idSeg", getIdSeg());

        fetch(endpointUrl.toString(), {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            cache: "no-store"
        }).catch(function (error) {
            console.warn("[visit-tracker] No se pudo enviar el keepalive de visita:", error);
        });
    }

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
                endpointUrl.searchParams.set("visit", visitParam);
            }

            await fetch(endpointUrl.toString(), {
                method: "POST",
                mode: "cors",
                credentials: "omit",
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idSeg: getIdSeg() })
            });

            markTracked(dedupKey);
            startHeartbeat();

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

    function getVisitParamForProjectClick() {
        return getVisitParam();
    }

    function registerProjectVisit(proyect) {
        try {
            const visitParam = getVisitParamForProjectClick();
            const endpointUrl = new URL(VISIT_ENDPOINT);

            if (visitParam) {
                endpointUrl.searchParams.set("visit", visitParam);
            }

            fetch(endpointUrl.toString(), {
                method: "POST",
                mode: "cors",
                credentials: "omit",
                cache: "no-store",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idSeg: getIdSeg(), proyect: proyect })
            }).catch(function (error) {
                console.warn("[visit-tracker] No se pudo registrar la visita al proyecto:", error);
            });
        } catch (error) {
            console.warn("[visit-tracker] No se pudo registrar la visita al proyecto:", error);
        }
    }

    // Delegación de eventos: las tarjetas de proyecto las renderiza Angular
    // (pueden no existir todavía en el momento en que carga este script).
    document.addEventListener("click", function (event) {
        const card = event.target.closest && event.target.closest(".project-card");
        if (!card) {
            return;
        }

        const proyect = card.getAttribute("aria-label") || card.href || "desconocido";
        registerProjectVisit(proyect);
    }, true);
})();