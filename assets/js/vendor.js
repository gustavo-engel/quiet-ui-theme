(() => {
  "use strict";

  const source = document.currentScript;
  const requested = (source?.dataset.vendors || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  const registry = Object.freeze({
    poppins: {
      version: "Google Fonts",
      styles: [
        "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
      ],
    },
    lucide: {
      version: "1.34.0",
      scripts: ["https://unpkg.com/lucide@1.34.0/dist/umd/lucide.js"],
    },
    chartjs: {
      version: "4.5.1",
      scripts: ["https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"],
    },
  });

  const loaded = new Map();

  const normalizeAsset = (asset, key) =>
    typeof asset === "string" ? { [key]: asset } : asset;

  const loadStylesheet = (asset) =>
    new Promise((resolve, reject) => {
      const options = normalizeAsset(asset, "href");
      const existing = document.querySelector(`link[href="${options.href}"]`);
      if (existing) {
        resolve(existing);
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = options.href;
      if (options.integrity) {
        link.integrity = options.integrity;
        link.crossOrigin = "anonymous";
      }
      link.addEventListener("load", () => resolve(link), { once: true });
      link.addEventListener(
        "error",
        () => reject(new Error(`Não foi possível carregar ${options.href}`)),
        { once: true },
      );
      source?.before(link);
    });

  const loadScript = (asset) =>
    new Promise((resolve, reject) => {
      const options = normalizeAsset(asset, "src");
      const existing = document.querySelector(`script[src="${options.src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "true") resolve(existing);
        else existing.addEventListener("load", () => resolve(existing), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = options.src;
      script.async = true;
      if (options.integrity) {
        script.integrity = options.integrity;
        script.crossOrigin = "anonymous";
      }
      script.addEventListener(
        "load",
        () => {
          script.dataset.loaded = "true";
          resolve(script);
        },
        { once: true },
      );
      script.addEventListener(
        "error",
        () => reject(new Error(`Não foi possível carregar ${options.src}`)),
        { once: true },
      );
      document.head.append(script);
    });

  const load = (name) => {
    if (loaded.has(name)) return loaded.get(name);

    const definition = registry[name];
    if (!definition) {
      return Promise.reject(new Error(`Biblioteca desconhecida: ${name}`));
    }

    const promise = Promise.all([
      ...(definition.styles || []).map(loadStylesheet),
      ...(definition.scripts || []).map(loadScript),
    ])
      .then(() => {
        document.dispatchEvent(
          new CustomEvent("ui:vendor-ready", { detail: { name } }),
        );
        return definition;
      })
      .catch((error) => {
        console.warn(`[theme] ${error.message}`);
        document.dispatchEvent(
          new CustomEvent("ui:vendor-error", { detail: { name, error } }),
        );
        throw error;
      });

    loaded.set(name, promise);
    return promise;
  };

  window.ThemeVendors = Object.freeze({
    load,
    ready: (name) => loaded.get(name) || load(name),
    versions: Object.fromEntries(
      Object.entries(registry).map(([name, item]) => [name, item.version]),
    ),
  });

  requested.forEach((name) => load(name).catch(() => undefined));
})();
