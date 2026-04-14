(function () {
    console.info("[visit-tracker] script cargado (v1)");
    window.__visitTrackerLoaded = true;
    const VISIT_ENDPOINT = "https://cesarsobapigateway.up.railway.app/api/Visits/addvisit";
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

            console.info("[visit-tracker] visita registrada", endpointUrl.toString());
        } catch (error) {
            console.warn("[visit-tracker] No se pudo registrar la visita:", error);
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