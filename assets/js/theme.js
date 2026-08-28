(() => {
  "use strict";

  const pageNames = Object.freeze({
    dashboard: "Dashboard",
    forms: "Formulários",
    calendar: "Calendário",
    timeline: "Timeline de projetos",
    components: "Componentes",
    flags: "Flags",
    datatables: "Data Tables",
    charts: "Gráficos",
    loading: "Loading states",
    profile: "Account Settings",
    docs: "Guia rápido",
  });

  const themeRelease = Object.freeze({
    version: "2026.08.25",
    date: "2026-08-25",
    author: "Gustavo Engel",
  });

  const navigation = Object.freeze([
    { page: "dashboard", href: "index.html", label: "Dashboard", icon: "layout-dashboard" },
    { page: "forms", href: "forms.html", label: "Formulários", icon: "notebook-pen" },
    { page: "calendar", href: "calendar.html", label: "Calendário", icon: "calendar-days" },
    { page: "timeline", href: "timeline.html", label: "Timeline", icon: "milestone" },
    { page: "components", href: "components.html", label: "Componentes", icon: "blocks" },
    { page: "flags", href: "flags.html", label: "Flags", icon: "flag" },
    { page: "datatables", href: "datatables.html", label: "Data Tables", icon: "table-2" },
    { page: "charts", href: "charts.html", label: "Gráficos", icon: "chart-no-axes-combined" },
    { divider: true, label: "Referência" },
    { page: "loading", href: "loading.html", label: "Loading states", icon: "loader-circle" },
    { page: "docs", href: "docs.html", label: "Guia rápido", icon: "book-open" },
  ]);

  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
          character
        ],
    );

  const icon = (name, className = "ui-icon") =>
    `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;

  const refreshIcons = async () => {
    try {
      await window.ThemeVendors?.ready("lucide");
      window.lucide?.createIcons({ attrs: { "stroke-width": 1.8 } });
    } catch {
      document.documentElement.classList.add("ui-icons-unavailable");
    }
  };

  const renderShell = () => {
    const page = document.body.dataset.page || "dashboard";
    const sidebar = document.querySelector("[data-ui-sidebar]");
    const topbar = document.querySelector("[data-ui-topbar]");
    const workspace = document.querySelector(".ui-workspace");

    if (sidebar) {
      const items = navigation
        .map((item) => {
          if (item.divider) {
            return `<div class="ui-nav-divider"><span>${item.label}</span></div>`;
          }
          const active = item.page === page;
          return `
            <a class="ui-nav-item${active ? " is-active" : ""}" href="${item.href}"
              ${active ? 'aria-current="page"' : ""} title="${item.label}">
              ${icon(item.icon, "ui-nav-icon")}
              <span class="ui-nav-label">${item.label}</span>
            </a>`;
        })
        .join("");

      sidebar.innerHTML = `
        <div class="ui-sidebar-header">
          <a class="ui-brand" href="index.html" aria-label="Quiet UI — Dashboard">
            <span class="ui-brand-mark" aria-hidden="true">Q</span>
            <span class="ui-brand-copy"><strong>Quiet UI</strong><small>Tema administrativo</small></span>
          </a>
          <button class="ui-icon-button ui-sidebar-close" type="button" data-ui-sidebar-close
            aria-label="Fechar menu lateral">${icon("x")}</button>
        </div>
        <nav class="ui-sidebar-nav" aria-label="Navegação principal">${items}</nav>
        <div class="ui-sidebar-status">
          <span class="ui-status-dot" aria-hidden="true"></span>
          <span class="ui-sidebar-status-copy"><strong>Biblioteca aberta</strong><small>Componentes reutilizáveis</small></span>
        </div>`;
    }

    if (topbar) {
      const title = pageNames[page] || document.querySelector("h1")?.textContent || "Quiet UI";
      const notificationMode = document.body.dataset.notificationMode === "external" ? "external" : "demo";
      topbar.innerHTML = `
        <div class="ui-topbar-start">
          <button class="ui-icon-button" type="button" data-ui-sidebar-toggle
            aria-controls="ui-sidebar" aria-expanded="true" aria-label="Recolher menu lateral">
            ${icon("panel-left")}
          </button>
          <div><strong>Quiet UI</strong><span${["profile", "datatables"].includes(page) ? ' lang="en"' : ""}>${escapeHtml(title)}</span></div>
        </div>
        <div class="ui-topbar-actions">
          <div class="ui-menu ui-notification-center" data-ui-menu data-ui-notification-center
            data-ui-notification-mode="${notificationMode}">
            <button class="ui-icon-button ui-notification-trigger" type="button"
              data-ui-menu-button data-ui-notification-toggle aria-controls="ui-notification-panel"
              aria-expanded="false" aria-haspopup="dialog" aria-label="Notificações" title="Notificações">
              ${icon("bell")}
              <span class="ui-notification-count" data-ui-notification-count aria-hidden="true" hidden>0</span>
            </button>
            <section class="ui-notification-panel" id="ui-notification-panel" data-ui-menu-panel
              data-ui-notification-panel role="dialog" aria-modal="false"
              aria-labelledby="ui-notification-title" hidden>
              <header class="ui-notification-header">
                <div>
                  <h2 id="ui-notification-title">Notificações</h2>
                  <p data-ui-notification-summary>Carregando histórico...</p>
                </div>
                <button class="ui-notification-mark-all" type="button"
                  data-ui-notification-mark-all aria-disabled="true">Marcar todas como lidas</button>
              </header>
              <span class="ui-visually-hidden" data-ui-notification-live role="status"
                aria-live="polite" aria-atomic="true"></span>
              <ol class="ui-notification-list" data-ui-notification-list></ol>
              <footer class="ui-notification-footer">
                <a href="profile.html#notifications">${icon("settings-2")} Configurar notificações</a>
                <p data-ui-notification-storage-note>As notificações lidas permanecem neste navegador.</p>
              </footer>
            </section>
          </div>
          <div class="ui-menu" data-ui-menu>
            <button class="ui-user-button" type="button" data-ui-menu-button aria-expanded="false">
              <span class="ui-avatar" aria-hidden="true">MC</span>
              <span class="ui-user-copy"><strong>Marina Costa</strong><small>Conta demo</small></span>
              ${icon("chevron-down", "ui-menu-chevron")}
            </button>
            <div class="ui-menu-panel" data-ui-menu-panel hidden>
              <a href="profile.html#my-account">${icon("user-round")} Perfil</a>
              <a href="profile.html#preferences">${icon("settings-2")} Preferências</a>
              <span class="ui-menu-separator"></span>
              <button type="button" data-ui-toast-trigger data-message="Sessão de demonstração encerrada.">
                ${icon("log-out")} Sair da demonstração
              </button>
            </div>
          </div>
        </div>`;
    }

    if (workspace && !workspace.querySelector("[data-ui-footer]")) {
      const footer = document.createElement("footer");
      footer.className = "ui-footer";
      footer.dataset.uiFooter = "";
      footer.innerHTML = `
        <div class="ui-footer-inner">
          <p class="ui-footer-brand"><strong>Quiet UI</strong><span>Biblioteca de componentes</span></p>
          <p class="ui-footer-meta">
            <span>Versão</span>
            <time datetime="${themeRelease.date}">v${escapeHtml(themeRelease.version)}</time>
            <span>${escapeHtml(themeRelease.author)}</span>
          </p>
        </div>`;
      workspace.append(footer);
    }
  };

  const initializeSidebar = () => {
    const root = document.querySelector("[data-ui-shell]");
    const sidebar = document.getElementById("ui-sidebar");
    const workspace = root?.querySelector(".ui-workspace");
    const toggle = root?.querySelector("[data-ui-sidebar-toggle]");
    const close = root?.querySelector("[data-ui-sidebar-close]");
    const backdrop = root?.querySelector("[data-ui-sidebar-backdrop]");
    if (!root || !sidebar || !workspace || !toggle || !backdrop) return;

    const mobile = window.matchMedia("(max-width: 52rem)");
    let open = false;
    let collapsed = false;
    try {
      collapsed = localStorage.getItem("quiet-ui-sidebar") === "collapsed";
    } catch {
      collapsed = false;
    }

    const update = () => {
      if (mobile.matches) {
        root.dataset.sidebarOpen = String(open);
        root.removeAttribute("data-sidebar-collapsed");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu lateral" : "Abrir menu lateral");
        sidebar.inert = !open;
        workspace.inert = open;
      } else {
        open = false;
        root.dataset.sidebarOpen = "false";
        root.dataset.sidebarCollapsed = String(collapsed);
        toggle.setAttribute("aria-expanded", String(!collapsed));
        toggle.setAttribute(
          "aria-label",
          collapsed ? "Expandir menu lateral" : "Recolher menu lateral",
        );
        sidebar.inert = false;
        workspace.inert = false;
      }
    };

    const closeMobile = (returnFocus = false) => {
      if (!mobile.matches || !open) return;
      open = false;
      update();
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      if (mobile.matches) {
        open = !open;
        update();
        if (open) close?.focus();
        return;
      }
      collapsed = !collapsed;
      try {
        localStorage.setItem("quiet-ui-sidebar", collapsed ? "collapsed" : "expanded");
      } catch {
        // A preferência é opcional; a navegação continua funcionando sem storage.
      }
      update();
    });
    close?.addEventListener("click", () => closeMobile(true));
    backdrop.addEventListener("click", () => closeMobile(true));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobile(true);
    });
    mobile.addEventListener("change", () => {
      open = false;
      update();
    });
    update();
  };

  const initializeMenus = () => {
    const menus = [...document.querySelectorAll("[data-ui-menu]")];
    const closeAll = (except) => {
      menus.forEach((menu) => {
        if (menu === except) return;
        menu.querySelector("[data-ui-menu-panel]")?.setAttribute("hidden", "");
        menu.querySelector("[data-ui-menu-button]")?.setAttribute("aria-expanded", "false");
      });
    };

    menus.forEach((menu) => {
      const button = menu.querySelector("[data-ui-menu-button]");
      const panel = menu.querySelector("[data-ui-menu-panel]");
      if (!button || !panel) return;
      button.addEventListener("click", () => {
        const willOpen = panel.hasAttribute("hidden");
        closeAll(willOpen ? menu : undefined);
        panel.toggleAttribute("hidden", !willOpen);
        button.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) {
          panel.querySelector('a, button:not([disabled]):not([aria-disabled="true"])')?.focus();
        }
      });
      panel.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        panel.setAttribute("hidden", "");
        button.setAttribute("aria-expanded", "false");
        button.focus();
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-ui-menu]")) closeAll();
    });
  };

  const initializeNotifications = () => {
    const center = document.querySelector("[data-ui-notification-center]");
    if (!center) return;

    const trigger = center.querySelector("[data-ui-notification-toggle]");
    const count = center.querySelector("[data-ui-notification-count]");
    const summary = center.querySelector("[data-ui-notification-summary]");
    const list = center.querySelector("[data-ui-notification-list]");
    const markAll = center.querySelector("[data-ui-notification-mark-all]");
    const live = center.querySelector("[data-ui-notification-live]");
    const storageNote = center.querySelector("[data-ui-notification-storage-note]");
    if (!trigger || !count || !summary || !list || !markAll || !live) return;

    const mode = center.dataset.uiNotificationMode === "external" ? "external" : "demo";
    const storageKey = "quiet-ui.notifications.demo.v1";
    const schemaVersion = 1;
    const seedVersion = "demo-v1";
    const maxReadHistoryItems = 100;
    const typeConfig = Object.freeze({
      system: { label: "Sistema", icon: "refresh-cw", tone: "primary" },
      message: { label: "Mensagem", icon: "message-square", tone: "comment" },
      execution: { label: "Execução", icon: "circle-check", tone: "success" },
    });
    const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const fullFormatter = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
      timeStyle: "medium",
    });
    const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    let notifications = [];
    let storageAvailable = mode !== "demo";

    const cleanText = (value, maximum) => String(value ?? "").trim().slice(0, maximum);
    const validIsoDate = (value) => {
      if (typeof value !== "string"
        || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(5, 7));
      const day = Number(value.slice(8, 10));
      const hour = Number(value.slice(11, 13));
      const minute = Number(value.slice(14, 16));
      const second = Number(value.slice(17, 19));
      const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
      if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth
        || hour > 23 || minute > 59 || second > 59) return null;
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
    };
    const normalizeNotification = (value) => {
      if (!value || typeof value !== "object") return null;
      const id = String(value.id ?? "").trim();
      const type = cleanText(value.type, 24);
      const title = cleanText(value.title, 120);
      const body = cleanText(value.body, 280);
      const createdAt = validIsoDate(value.createdAt);
      const readAt = value.readAt == null ? null : validIsoDate(value.readAt);
      if (!id || id.length > 128 || !title || !createdAt || !Object.hasOwn(typeConfig, type)) return null;
      if (value.readAt != null && !readAt) return null;
      return { id, type, title, body, createdAt, readAt };
    };
    const sortNotifications = (values) =>
      [...values].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
    const retainHistory = (values) => {
      const sorted = sortNotifications(values);
      const unread = sorted.filter((item) => !item.readAt);
      const read = sorted.filter((item) => item.readAt);
      return sortNotifications([
        ...unread,
        // Notificações não lidas nunca são descartadas automaticamente.
        ...read.slice(0, maxReadHistoryItems),
      ]);
    };
    const normalizeCollection = (values) => {
      const unique = new Map();
      (Array.isArray(values) ? values : []).forEach((value) => {
        const normalized = normalizeNotification(value);
        if (normalized) unique.set(normalized.id, normalized);
      });
      return retainHistory([...unique.values()]);
    };
    const normalizeStrictCollection = (values) => {
      if (!Array.isArray(values)) return null;
      const normalized = values.map(normalizeNotification);
      return normalized.some((item) => !item) ? null : normalizeCollection(normalized);
    };
    const createDemoNotifications = () => {
      const now = Date.now();
      const at = (minutesAgo) => new Date(now - minutesAgo * 60_000).toISOString();
      const syncFinishedAt = at(2);
      const executionFinishedAt = at(54);
      return [
        {
          id: "demo:sync:completed",
          type: "system",
          title: "Sincronização concluída",
          body: `Finalizada às ${clockFormatter.format(new Date(syncFinishedAt))} · 18 registros atualizados.`,
          createdAt: syncFinishedAt,
          readAt: null,
        },
        {
          id: "demo:message:project",
          type: "message",
          title: "Nova mensagem no projeto",
          body: "Marina enviou uma atualização sobre a revisão semanal.",
          createdAt: at(18),
          readAt: null,
        },
        {
          id: "demo:execution:report",
          type: "execution",
          title: "Execução finalizada",
          body: `Relatório mensal concluído às ${clockFormatter.format(new Date(executionFinishedAt))}.`,
          createdAt: executionFinishedAt,
          readAt: null,
        },
        {
          id: "demo:system:preferences",
          type: "system",
          title: "Preferências atualizadas",
          body: "Os novos canais de notificação já estão ativos.",
          createdAt: at(1_440),
          readAt: at(1_420),
        },
      ].map(normalizeNotification).filter(Boolean);
    };
    const persistDemo = (values) => {
      if (mode !== "demo") return true;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ schemaVersion, seedVersion, items: values }),
        );
        storageAvailable = true;
        return true;
      } catch {
        storageAvailable = false;
        return false;
      }
    };
    const loadDemo = () => {
      const seeds = createDemoNotifications();
      try {
        const stored = localStorage.getItem(storageKey);
        storageAvailable = true;
        if (!stored) {
          notifications = retainHistory(seeds);
          persistDemo(notifications);
          return;
        }
        const parsed = JSON.parse(stored);
        if (parsed?.schemaVersion !== schemaVersion) throw new Error("Schema incompatível");
        const storedItems = normalizeStrictCollection(parsed.items);
        if (!storedItems) throw new Error("Coleção inválida");
        const merged = new Map(storedItems.map((item) => [item.id, item]));
        if (parsed.seedVersion !== seedVersion) {
          seeds.forEach((item) => {
            if (!merged.has(item.id)) merged.set(item.id, item);
          });
        }
        notifications = retainHistory([...merged.values()]);
        if (parsed.seedVersion !== seedVersion) persistDemo(notifications);
      } catch {
        notifications = retainHistory(seeds);
        persistDemo(notifications);
      }
    };
    const sameCalendarDay = (left, right) =>
      left.getFullYear() === right.getFullYear()
      && left.getMonth() === right.getMonth()
      && left.getDate() === right.getDate();
    const displayTime = (value) => {
      const date = new Date(value);
      return sameCalendarDay(date, new Date())
        ? `Hoje, ${clockFormatter.format(date)}`
        : shortDateFormatter.format(date);
    };
    const emitChanged = (reason) => {
      document.dispatchEvent(new CustomEvent("quietui:notifications:changed", {
        detail: {
          reason,
          unreadCount: notifications.filter((item) => !item.readAt).length,
          ids: notifications.map((item) => item.id),
        },
      }));
    };
    const createNotificationItem = (item) => {
      const config = typeConfig[item.type];
      const unread = !item.readAt;
      const row = document.createElement("li");
      row.className = `ui-notification-item ${unread ? "is-unread" : "is-read"}`;
      row.dataset.notificationId = item.id;

      const article = document.createElement("article");
      const itemIcon = document.createElement("span");
      itemIcon.className = `ui-notification-icon is-${config.tone}`;
      itemIcon.setAttribute("aria-hidden", "true");
      itemIcon.innerHTML = icon(config.icon);

      const copy = document.createElement("div");
      copy.className = "ui-notification-copy";
      const meta = document.createElement("div");
      meta.className = "ui-notification-meta";
      const type = document.createElement("span");
      type.className = "ui-notification-type";
      type.textContent = config.label;
      const time = document.createElement("time");
      time.dateTime = item.createdAt;
      time.title = fullFormatter.format(new Date(item.createdAt));
      time.textContent = displayTime(item.createdAt);
      meta.append(type, time);

      const title = document.createElement("h3");
      title.textContent = item.title;
      const body = document.createElement("p");
      body.textContent = item.body;
      const action = document.createElement("button");
      action.className = "ui-notification-action";
      action.type = "button";
      action.dataset.uiNotificationRead = item.id;
      action.setAttribute(
        "aria-label",
        `${unread ? "Marcar como lida" : "Marcar como não lida"}: ${item.title}`,
      );
      action.innerHTML = `${icon(unread ? "check" : "rotate-ccw")}<span>${unread ? "Marcar como lida" : "Marcar como não lida"}</span>`;
      copy.append(meta, title, body, action);

      const state = document.createElement("span");
      state.className = `ui-notification-state ${unread ? "is-new" : "is-read"}`;
      state.textContent = unread ? "Nova" : "Lida";
      article.append(itemIcon, copy, state);
      row.append(article);
      return row;
    };
    const createEmptyState = () => {
      const row = document.createElement("li");
      row.className = "ui-notification-empty";
      const emptyIcon = document.createElement("span");
      emptyIcon.className = "ui-notification-empty-icon";
      emptyIcon.setAttribute("aria-hidden", "true");
      emptyIcon.innerHTML = icon("bell-off");
      const title = document.createElement("strong");
      title.textContent = "Tudo em dia";
      const copy = document.createElement("span");
      copy.textContent = "Novas notificações aparecerão aqui.";
      row.append(emptyIcon, title, copy);
      return row;
    };
    const focusItemAction = (id) => {
      const action = [...list.querySelectorAll("[data-ui-notification-read]")]
        .find((candidate) => candidate.dataset.uiNotificationRead === id);
      action?.focus();
      return Boolean(action);
    };
    const render = (focusId) => {
      const activeElement = document.activeElement;
      const hadListFocus = activeElement instanceof HTMLElement && list.contains(activeElement);
      const activeItemId = hadListFocus ? activeElement.dataset.uiNotificationRead : undefined;
      const restoreItemId = focusId || activeItemId;
      const unreadCount = notifications.filter((item) => !item.readAt).length;
      count.hidden = unreadCount === 0;
      count.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
      trigger.classList.toggle("has-unread", unreadCount > 0);
      trigger.setAttribute(
        "aria-label",
        unreadCount
          ? `Notificações, ${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"}`
          : "Notificações, nenhuma não lida",
      );
      summary.textContent = notifications.length
        ? `${unreadCount} não ${unreadCount === 1 ? "lida" : "lidas"} · ${notifications.length} no histórico`
        : "Nenhuma notificação no histórico";
      markAll.setAttribute("aria-disabled", String(unreadCount === 0));
      list.replaceChildren(
        ...(notifications.length ? notifications.map(createNotificationItem) : [createEmptyState()]),
      );
      if (storageNote) {
        storageNote.textContent = mode === "external"
          ? "O estado de leitura é confirmado pela aplicação conectada."
          : storageAvailable
            ? "As notificações lidas permanecem neste navegador."
            : "O histórico ficará disponível apenas nesta aba.";
      }
      refreshIcons();
      if (restoreItemId || hadListFocus) {
        window.requestAnimationFrame(() => {
          if (!focusItemAction(restoreItemId) && hadListFocus) trigger.focus();
        });
      }
    };
    const commit = (next, reason, focusId) => {
      const normalized = normalizeCollection(next);
      if (mode === "demo" && !persistDemo(normalized)) {
        live.textContent = "Não foi possível salvar a alteração. O estado anterior foi preservado.";
        showToast("Não foi possível salvar o estado da notificação.", "danger");
        render(focusId);
        return false;
      }
      notifications = normalized;
      render(focusId);
      emitChanged(reason);
      return true;
    };
    const upsert = (payload, reason = "upsert") => {
      const normalized = normalizeNotification(payload);
      if (!normalized) return false;
      const existing = notifications.find((item) => item.id === normalized.id);
      if (existing && !Object.prototype.hasOwnProperty.call(payload, "readAt")) {
        normalized.readAt = existing.readAt;
      }
      const updated = commit(
        [...notifications.filter((item) => item.id !== normalized.id), normalized],
        reason,
      );
      if (updated && mode === "external") {
        live.textContent = `Histórico confirmado pela aplicação. ${notifications.filter((item) => !item.readAt).length} não lidas.`;
      }
      return updated;
    };
    const replace = (values, reason = "replace") => {
      const normalized = normalizeStrictCollection(values);
      if (!normalized) return false;
      const updated = commit(normalized, reason);
      if (updated && mode === "external") {
        live.textContent = `Histórico confirmado pela aplicação. ${notifications.filter((item) => !item.readAt).length} não lidas.`;
      }
      return updated;
    };
    const snapshot = () => notifications.map((item) => ({ ...item }));
    const applyReadState = (id, shouldRead) => {
      const current = notifications.find((item) => item.id === id);
      if (!current || Boolean(current.readAt) === shouldRead) return false;
      const readAt = shouldRead ? new Date().toISOString() : null;
      const next = notifications.map((item) => item.id === id ? { ...item, readAt } : item);
      if (!commit(next, shouldRead ? "read" : "unread", id)) return false;
      live.textContent = `${current.title} marcada como ${shouldRead ? "lida" : "não lida"}. ${notifications.filter((item) => !item.readAt).length} não lidas.`;
      return true;
    };

    list.addEventListener("click", (event) => {
      const action = event.target.closest("[data-ui-notification-read]");
      if (!action || !list.contains(action)) return;
      const id = action.dataset.uiNotificationRead;
      const current = notifications.find((item) => item.id === id);
      if (!current) return;
      const shouldRead = !current.readAt;
      if (mode !== "demo") {
        live.textContent = "Solicitação enviada. Aguardando confirmação da aplicação.";
      }
      document.dispatchEvent(new CustomEvent("quietui:notification:read-request", {
        detail: { id, read: shouldRead },
      }));
      if (mode === "demo") applyReadState(id, shouldRead);
    });
    markAll.addEventListener("click", () => {
      const unreadIds = notifications.filter((item) => !item.readAt).map((item) => item.id);
      if (!unreadIds.length) return;
      if (mode !== "demo") {
        live.textContent = "Solicitação enviada. Aguardando confirmação da aplicação.";
      }
      document.dispatchEvent(new CustomEvent("quietui:notifications:read-all-request", {
        detail: { ids: unreadIds },
      }));
      if (mode !== "demo") return;
      const readAt = new Date().toISOString();
      const next = notifications.map((item) => item.readAt ? item : { ...item, readAt });
      if (commit(next, "read-all")) {
        live.textContent = `${unreadIds.length} notificações marcadas como lidas.`;
        markAll.focus();
      }
    });
    document.addEventListener("quietui:notification:upsert", (event) => {
      upsert(event.detail, "event-upsert");
    });
    document.addEventListener("quietui:notifications:replace", (event) => {
      replace(event.detail?.items ?? event.detail, "event-replace");
    });
    if (mode === "demo") {
      window.addEventListener("storage", (event) => {
        if (event.key !== storageKey || !event.newValue) return;
        try {
          const parsed = JSON.parse(event.newValue);
          if (parsed?.schemaVersion !== schemaVersion) return;
          const synchronized = normalizeStrictCollection(parsed.items);
          if (!synchronized) return;
          notifications = synchronized;
          storageAvailable = true;
          render();
          emitChanged("storage");
        } catch {
          // Uma aba com estado inválido não substitui o histórico atual.
        }
      });
      loadDemo();
    }

    const quietUi = window.QuietUI && typeof window.QuietUI === "object" ? window.QuietUI : {};
    quietUi.notifications = Object.freeze({
      upsert: (payload) => upsert(payload, "api-upsert"),
      replace: (values) => replace(values, "api-replace"),
      snapshot,
    });
    window.QuietUI = quietUi;
    render();
    emitChanged("initialize");
    const refreshAtMidnight = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      window.setTimeout(() => {
        render();
        refreshAtMidnight();
      }, nextDay.getTime() - now.getTime() + 100);
    };
    refreshAtMidnight();
  };

  const initializeTabs = () => {
    document.querySelectorAll("[data-ui-tabs]").forEach((group) => {
      const tabs = [...group.querySelectorAll('[role="tab"]')];
      const tablist = group.querySelector('[role="tablist"]');
      const panels = tabs
        .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
        .filter(Boolean);
      if (!tabs.length || !panels.length) return;

      const hashEnabled = group.hasAttribute("data-ui-tabs-hash");
      const responsiveTabs = tablist?.hasAttribute("data-ui-responsive-tabs");
      const compactTabs = window.matchMedia("(max-width: 70rem)");
      const updateOrientation = () => {
        if (responsiveTabs) {
          tablist.setAttribute("aria-orientation", compactTabs.matches ? "horizontal" : "vertical");
        }
      };
      updateOrientation();
      if (responsiveTabs) compactTabs.addEventListener("change", updateOrientation);

      const tabFromHash = () =>
        hashEnabled
          ? tabs.find((tab) => `#${tab.getAttribute("aria-controls")}` === window.location.hash)
          : undefined;

      const activate = (selected, focus = false, historyMode = undefined) => {
        tabs.forEach((tab) => {
          const active = tab === selected;
          tab.setAttribute("aria-selected", String(active));
          tab.tabIndex = active ? 0 : -1;
          tab.classList.toggle("is-active", active);
          document.getElementById(tab.getAttribute("aria-controls"))?.toggleAttribute("hidden", !active);
        });
        const panelId = selected.getAttribute("aria-controls");
        if (hashEnabled && historyMode && panelId && window.location.hash !== `#${panelId}`) {
          window.history[historyMode === "replace" ? "replaceState" : "pushState"](
            null,
            "",
            `#${panelId}`,
          );
        }
        if (focus) selected.focus();
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", (event) => {
          if (hashEnabled) event.preventDefault();
          activate(tab, false, hashEnabled ? "push" : undefined);
        });
        tab.addEventListener("keydown", (event) => {
          const vertical = tablist?.getAttribute("aria-orientation") === "vertical";
          const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
          const nextKey = vertical ? "ArrowDown" : "ArrowRight";
          if (![previousKey, nextKey, "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (event.key === previousKey) next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === nextKey) next = (index + 1) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          activate(tabs[next], true, hashEnabled ? "replace" : undefined);
        });
      });

      if (hashEnabled) {
        const syncFromHash = () => activate(tabFromHash() || tabs[0]);
        window.addEventListener("popstate", syncFromHash);
        window.addEventListener("hashchange", syncFromHash);
      }
      activate(tabFromHash() || tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
    });
  };

  const showToast = (message, tone = "success") => {
    const region = document.getElementById("ui-toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = `ui-toast is-${tone}`;
    toast.setAttribute("role", tone === "danger" ? "alert" : "status");
    toast.innerHTML = `${icon(tone === "danger" ? "circle-alert" : "circle-check")}<span>${escapeHtml(message)}</span>`;
    region.append(toast);
    refreshIcons();
    window.setTimeout(() => toast.remove(), 4200);
  };

  const initializeToasts = () => {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-ui-toast-trigger]");
      if (!trigger) return;
      showToast(trigger.dataset.message || "Ação concluída.", trigger.dataset.tone || "success");
    });
  };

  const initializeModals = () => {
    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-ui-modal-open]");
      if (opener) document.getElementById(opener.dataset.uiModalOpen)?.showModal();
      const closer = event.target.closest("[data-ui-modal-close]");
      if (closer) closer.closest("dialog")?.close();
    });
    document.querySelectorAll("dialog[data-ui-modal]").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });
  };

  const initializeDismissible = () => {
    document.addEventListener("click", (event) => {
      const dismiss = event.target.closest("[data-ui-dismiss]");
      if (dismiss) dismiss.closest(dismiss.dataset.uiDismiss)?.remove();
    });
  };

  const initializeChips = () => {
    document.querySelectorAll("[data-ui-chip-field]").forEach((field) => {
      const input = field.querySelector("input");
      const list = field.querySelector("[data-ui-chip-list]");
      const live = field.querySelector("[data-ui-chip-live]");
      if (!input || !list) return;

      const add = (rawValue) => {
        const value = rawValue.trim().replace(/,$/, "");
        if (!value) return;
        const existing = [...list.querySelectorAll("[data-chip-value]")].some(
          (chip) => chip.dataset.chipValue.toLowerCase() === value.toLowerCase(),
        );
        if (existing) {
          if (live) live.textContent = `${value} já foi adicionado.`;
          return;
        }
        const chip = document.createElement("span");
        chip.className = "ui-chip is-primary";
        chip.dataset.chipValue = value;
        chip.innerHTML = `${escapeHtml(value)}<button type="button" aria-label="Remover ${escapeHtml(value)}" data-ui-chip-remove>${icon("x")}</button>`;
        list.append(chip);
        input.value = "";
        if (live) live.textContent = `${value} adicionado.`;
        refreshIcons();
      };

      input.addEventListener("keydown", (event) => {
        if (!["Enter", ","].includes(event.key)) return;
        event.preventDefault();
        add(input.value);
      });
      field.querySelector("[data-ui-chip-add]")?.addEventListener("click", () => add(input.value));
      list.addEventListener("click", (event) => {
        const remove = event.target.closest("[data-ui-chip-remove]");
        if (!remove) return;
        const chip = remove.closest("[data-chip-value]");
        const value = chip?.dataset.chipValue;
        chip?.remove();
        if (live) live.textContent = `${value} removido.`;
        input.focus();
      });
    });
  };

  const initializeFlags = () => {
    document.querySelectorAll("[data-ui-flag-catalog]").forEach((catalog) => {
      const search = catalog.querySelector("[data-ui-flag-search]");
      const region = catalog.querySelector("[data-ui-flag-region]");
      const cards = Array.from(catalog.querySelectorAll("[data-ui-flag-card]"));
      const count = catalog.querySelector("[data-ui-flag-count]");
      const empty = catalog.querySelector("[data-ui-flag-empty]");
      const live = catalog.querySelector("[data-ui-flag-live]");

      const normalize = (value) =>
        String(value)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("pt-BR")
          .trim();

      const update = () => {
        const query = normalize(search?.value || "");
        const selectedRegion = region?.value || "all";
        let visible = 0;

        cards.forEach((card) => {
          const matchesText = !query || normalize(card.dataset.flagSearch).includes(query);
          const matchesRegion = selectedRegion === "all" || card.dataset.flagRegion === selectedRegion;
          const matches = matchesText && matchesRegion;
          card.hidden = !matches;
          if (matches) visible += 1;
        });

        if (count) count.textContent = String(visible);
        if (empty) empty.hidden = visible > 0;
        if (live) live.textContent = `${visible} ${visible === 1 ? "bandeira encontrada" : "bandeiras encontradas"}.`;
      };

      search?.addEventListener("input", update);
      region?.addEventListener("change", update);

      catalog.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-ui-flag-copy]");
        if (!button) return;
        const code = button.dataset.uiFlagCopy;
        try {
          await navigator.clipboard.writeText(code);
          showToast(`Código ${code} copiado.`);
        } catch {
          showToast(`Use o código ${code}.`, "warning");
        }
      });

      update();
    });
  };

  const initializeForms = () => {
    const validateConfirmation = (confirmation) => {
      const source = document.getElementById(confirmation.dataset.uiConfirmField);
      if (!source) return;
      confirmation.setCustomValidity(
        confirmation.value && confirmation.value !== source.value
          ? "The confirmation does not match."
          : "",
      );
    };

    document.querySelectorAll("[data-ui-password-toggle]").forEach((button) => {
      const field = document.getElementById(button.dataset.uiPasswordToggle);
      if (!field) return;
      button.addEventListener("click", () => {
        const visible = field.type === "text";
        field.type = visible ? "password" : "text";
        const showLabel = button.dataset.showLabel || "Mostrar senha";
        const hideLabel = button.dataset.hideLabel || "Ocultar senha";
        button.setAttribute("aria-label", visible ? showLabel : hideLabel);
        button.innerHTML = icon(visible ? "eye" : "eye-off");
        refreshIcons();
      });
    });

    document.querySelectorAll("[data-ui-confirm-field]").forEach((confirmation) => {
      const source = document.getElementById(confirmation.dataset.uiConfirmField);
      if (!source) return;
      source.addEventListener("input", () => validateConfirmation(confirmation));
      confirmation.addEventListener("input", () => validateConfirmation(confirmation));
    });

    document.querySelectorAll("[data-ui-verification-field]").forEach((field) => {
      const status = document.getElementById(field.dataset.uiVerificationField);
      if (!status) return;
      const update = () => {
        const changed = field.value.trim() !== field.defaultValue.trim();
        status.textContent = changed ? "Verification required" : "Verified";
        status.classList.toggle("is-success", !changed);
        status.classList.toggle("is-warning", changed);
      };
      field.addEventListener("input", update);
      field.form?.addEventListener("reset", () => window.requestAnimationFrame(update));
    });

    document.querySelectorAll("form[data-ui-form]").forEach((form) => {
      form.addEventListener("reset", () => {
        form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute("aria-invalid"));
        form.querySelectorAll("[data-error-for]").forEach((error) => {
          error.hidden = true;
        });
        form.querySelectorAll("[data-ui-confirm-field]").forEach((field) => field.setCustomValidity(""));
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let firstInvalid;
        form.querySelectorAll("[data-ui-confirm-field]").forEach(validateConfirmation);
        form.querySelectorAll("[required]").forEach((field) => {
          const invalid = !field.checkValidity();
          field.toggleAttribute("aria-invalid", invalid);
          const error = form.querySelector(`[data-error-for="${field.id}"]`);
          if (error) error.hidden = !invalid;
          if (invalid && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) {
          firstInvalid.focus();
          showToast(form.dataset.errorMessage || "Revise os campos destacados.", "danger");
          return;
        }
        showToast(form.dataset.successMessage || "Formulário validado. Nenhum dado foi enviado.");
      });
    });
  };

  const initializeImageUploads = () => {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const maxSize = 5 * 1024 * 1024;

    document.querySelectorAll("[data-ui-image-upload]").forEach((input) => {
      const target = document.getElementById(input.dataset.uiImageUpload);
      const status = document.getElementById(input.dataset.uiImageStatus);
      if (!target) return;
      let previewUrl;

      const setFeedback = (message, danger = false) => {
        input.toggleAttribute("aria-invalid", danger);
        if (!status) return;
        status.hidden = false;
        status.textContent = message;
        status.classList.toggle("ui-help", !danger);
        status.classList.toggle("ui-error", danger);
        status.setAttribute("role", danger ? "alert" : "status");
        status.setAttribute("aria-live", danger ? "assertive" : "polite");
      };

      input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (!file) return;
        if (!allowedTypes.has(file.type) || file.size > maxSize) {
          const message = "Choose a JPG, PNG or WebP image up to 5 MB.";
          input.value = "";
          setFeedback(message, true);
          return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = URL.createObjectURL(file);
        target.src = previewUrl;
        const message = `${file.name} is ready in the local preview.`;
        setFeedback(message);
      });

      window.addEventListener("beforeunload", () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      });
    });
  };

  const initializeCalendar = () => {
    const calendar = document.querySelector("[data-ui-calendar]");
    if (!calendar) return;
    const grid = calendar.querySelector("[data-ui-calendar-grid]");
    const title = calendar.querySelector("[data-ui-calendar-title]");
    const detail = calendar.querySelector("[data-ui-calendar-detail]");
    if (!grid || !title) return;

    let current = new Date();
    current = new Date(current.getFullYear(), current.getMonth(), 1);
    const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
    const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const eventSeeds = Object.freeze({
      3: ["09:00", "Revisão semanal", "primary"],
      8: ["14:30", "Reunião de projeto", "warning"],
      14: ["10:00", "Publicação do relatório", "success"],
      21: ["16:00", "Planejamento do ciclo", "comment"],
      27: ["11:00", "Fechamento mensal", "danger"],
    });

    const selectEvent = (day, eventData) => {
      if (!detail) return;
      const date = new Date(current.getFullYear(), current.getMonth(), day);
      detail.innerHTML = `
        <span class="ui-calendar-detail-icon is-${eventData[2]}">${icon("calendar-check")}</span>
        <div><p>${date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h3>${escapeHtml(eventData[1])}</h3><span class="ui-calendar-detail-meta">${eventData[0]} · Evento demonstrativo</span></div>`;
      refreshIcons();
    };

    const render = () => {
      title.textContent = formatter.format(current).replace(/^./, (letter) => letter.toUpperCase());
      const year = current.getFullYear();
      const month = current.getMonth();
      const days = new Date(year, month + 1, 0).getDate();
      const leading = (new Date(year, month, 1).getDay() + 6) % 7;
      const today = new Date();
      const cells = [];
      weekdays.forEach((weekday) => cells.push(`<div class="ui-calendar-weekday">${weekday}</div>`));
      for (let index = 0; index < leading; index += 1) {
        cells.push('<div class="ui-calendar-day is-outside" aria-hidden="true"></div>');
      }
      for (let day = 1; day <= days; day += 1) {
        const eventData = eventSeeds[day];
        const isToday =
          today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
        cells.push(`
          <div class="ui-calendar-day${isToday ? " is-today" : ""}">
            <span class="ui-calendar-number">${day}</span>
            ${
              eventData
                ? `<button type="button" class="ui-calendar-event is-${eventData[2]}" data-calendar-day="${day}">
                    <span>${eventData[0]}</span>${escapeHtml(eventData[1])}</button>`
                : ""
            }
          </div>`);
      }
      grid.innerHTML = cells.join("");
      grid.querySelectorAll("[data-calendar-day]").forEach((button) => {
        button.addEventListener("click", () => selectEvent(Number(button.dataset.calendarDay), eventSeeds[button.dataset.calendarDay]));
      });
      selectEvent(3, eventSeeds[3]);
    };

    calendar.querySelectorAll("[data-calendar-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.calendarAction;
        if (action === "today") {
          const today = new Date();
          current = new Date(today.getFullYear(), today.getMonth(), 1);
        } else {
          current = new Date(current.getFullYear(), current.getMonth() + (action === "next" ? 1 : -1), 1);
        }
        render();
      });
    });
    render();
  };

  const initializeCounters = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-ui-counter-value]").forEach((element) => {
      const target = Number(element.dataset.uiCounterValue);
      if (!Number.isFinite(target)) return;
      const decimals = Number(element.dataset.uiCounterDecimals || 0);
      const prefix = element.dataset.uiCounterPrefix || "";
      const suffix = element.dataset.uiCounterSuffix || "";
      const formatter = new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      const renderValue = (value) => {
        element.textContent = `${prefix}${formatter.format(value)}${suffix}`;
      };

      element.setAttribute("aria-label", `${prefix}${formatter.format(target)}${suffix}`);
      if (reducedMotion) {
        renderValue(target);
        return;
      }

      const startedAt = performance.now();
      const duration = 850;
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        renderValue(target * eased);
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      renderValue(0);
      window.requestAnimationFrame(tick);
    });
  };

  const initializeReveals = () => {
    const items = [...document.querySelectorAll("[data-ui-reveal]")];
    if (!items.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    items.forEach((item, index) => {
      item.classList.add("is-reveal-pending");
      item.style.setProperty("--ui-reveal-delay", `${Math.min(index * 70, 280)}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    items.forEach((item) => observer.observe(item));
  };

  const initializeLoadingDemos = () => {
    document.querySelectorAll("[data-ui-loading-trigger]").forEach((button) => {
      const idle = button.querySelector("[data-ui-loading-idle]");
      const busy = button.querySelector("[data-ui-loading-busy]");
      if (!idle || !busy) return;
      button.addEventListener("click", () => {
        if (button.getAttribute("aria-busy") === "true") return;
        button.setAttribute("aria-busy", "true");
        button.classList.add("is-loading");
        button.disabled = true;
        idle.hidden = true;
        busy.hidden = false;
        window.setTimeout(() => {
          button.setAttribute("aria-busy", "false");
          button.classList.remove("is-loading");
          button.disabled = false;
          idle.hidden = false;
          busy.hidden = true;
          document.querySelector("[data-ui-loading-live]")?.replaceChildren(
            document.createTextNode("Demo completed. Content is ready."),
          );
          button.focus();
        }, 1600);
      });
    });

    const pageLoader = document.querySelector("[data-ui-page-loader]");
    if (!pageLoader) return;
    document.querySelectorAll("[data-ui-page-loader-open]").forEach((button) => {
      button.addEventListener("click", () => {
        const shell = document.querySelector("[data-ui-shell]");
        pageLoader.hidden = false;
        document.body.classList.add("has-page-loader");
        if (shell) shell.inert = true;
        pageLoader.querySelector(".ui-page-loader-panel")?.focus();
        window.setTimeout(() => {
          pageLoader.hidden = true;
          document.body.classList.remove("has-page-loader");
          if (shell) shell.inert = false;
          button.focus();
        }, 1800);
      });
    });
  };

  const initializeDataTables = () => {
    const normalize = (value) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();
    const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
    const cellText = (cell) => {
      const copy = cell.cloneNode(true);
      copy.querySelectorAll('[aria-hidden="true"], .ui-progress').forEach((item) => item.remove());
      copy.querySelectorAll("strong + small").forEach((item) => item.before(" — "));
      return copy.textContent.replace(/\s+/g, " ").trim();
    };
    const safeSheetName = (value) =>
      value.replace(/[\\/*?:[\]]/g, " ").trim().slice(0, 31) || "Dados";

    document.querySelectorAll("[data-ui-data-table]").forEach((tableRoot) => {
      const body = tableRoot.querySelector("[data-ui-table-body]");
      const rows = [...tableRoot.querySelectorAll("[data-ui-table-row]")];
      const emptyRow = tableRoot.querySelector("[data-ui-table-empty]");
      const search = tableRoot.querySelector("[data-ui-table-search]");
      const filters = [...tableRoot.querySelectorAll("[data-ui-table-filter]")];
      const sortButtons = [...tableRoot.querySelectorAll("[data-ui-table-sort]")];
      const reset = tableRoot.querySelector("[data-ui-table-reset]");
      const summary = tableRoot.querySelector("[data-ui-table-summary]");
      const pagination = tableRoot.querySelector("[data-ui-table-pagination]");
      const exportButtons = [...tableRoot.querySelectorAll("[data-ui-table-export]")];
      const exportStatus = tableRoot.querySelector("[data-ui-table-export-status]");
      const exportTitle = tableRoot.dataset.exportTitle || "Data table";
      const exportFile = tableRoot.dataset.exportFile || "data-table";
      const counter = tableRoot.id
        ? document.querySelector(`[data-ui-table-count-for="${tableRoot.id}"]`)
        : null;
      const pageSize = Math.max(1, Number.parseInt(tableRoot.dataset.pageSize || "10", 10));
      if (!body || !rows.length) return;

      let currentPage = 1;
      let sortKey = "";
      let sortDirection = "ascending";

      sortButtons.forEach((button) => {
        button.dataset.sortLabel = button.textContent.trim();
        button.setAttribute("aria-label", `Ordenar por ${button.dataset.sortLabel}`);
      });

      const compareRows = (first, second) => {
        const button = sortButtons.find((item) => item.dataset.uiTableSort === sortKey);
        const type = button?.dataset.sortType || "text";
        const firstValue = first.dataset[sortKey] || "";
        const secondValue = second.dataset[sortKey] || "";
        let result;
        if (type === "number") {
          result = Number(firstValue) - Number(secondValue);
        } else if (type === "date") {
          result = Date.parse(firstValue) - Date.parse(secondValue);
        } else {
          result = collator.compare(firstValue, secondValue);
        }
        return sortDirection === "ascending" ? result : -result;
      };

      const getOrderedRows = () => sortKey ? [...rows].sort(compareRows) : [...rows];
      const getFilteredRows = (orderedRows = getOrderedRows()) => {
        const query = normalize(search?.value);
        return orderedRows.filter((row) => {
          const matchesSearch = !query || normalize(row.textContent).includes(query);
          const matchesFilters = filters.every((filter) => {
            const value = filter.value;
            return !value || row.dataset[filter.dataset.uiTableFilter] === value;
          });
          return matchesSearch && matchesFilters;
        });
      };

      const getExportMatrix = (filteredRows) => {
        const table = tableRoot.querySelector("table");
        const headers = [...table.querySelectorAll("thead th")].map(cellText);
        const data = filteredRows.map((row) => [...row.children].map(cellText));
        return { headers, data };
      };

      const updateExportStatus = (message) => {
        if (exportStatus) exportStatus.textContent = message;
      };

      const exportPdf = async (filteredRows) => {
        await window.ThemeVendors?.ready("jspdf");
        await window.ThemeVendors?.ready("jspdf-autotable");
        const JsPdf = window.jspdf?.jsPDF;
        if (!JsPdf) throw new Error("jsPDF indisponível");
        const documentPdf = new JsPdf({ orientation: "landscape", unit: "pt", format: "a4" });
        const { headers, data } = getExportMatrix(filteredRows);
        const renderTable = typeof documentPdf.autoTable === "function"
          ? (options) => documentPdf.autoTable(options)
          : typeof window.autoTable === "function"
            ? (options) => window.autoTable(documentPdf, options)
            : null;
        if (!renderTable) throw new Error("AutoTable indisponível");

        documentPdf.setProperties({ title: exportTitle, subject: "Quiet UI data table" });
        documentPdf.setFont("helvetica", "bold");
        documentPdf.setFontSize(16);
        documentPdf.setTextColor(23, 32, 51);
        documentPdf.text(exportTitle, 40, 34);
        documentPdf.setFont("helvetica", "normal");
        documentPdf.setFontSize(8);
        documentPdf.setTextColor(102, 112, 133);
        const exportedAt = new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date());
        documentPdf.text(`${filteredRows.length} registros · Exportado em ${exportedAt}`, 40, 49);
        renderTable({
          head: [headers],
          body: data,
          startY: 62,
          theme: "grid",
          showHead: "everyPage",
          margin: { top: 40, right: 32, bottom: 32, left: 32 },
          styles: {
            cellPadding: 4,
            font: "helvetica",
            fontSize: 6.8,
            overflow: "linebreak",
            textColor: [23, 32, 51],
            lineColor: [226, 231, 240],
            lineWidth: 0.5,
          },
          headStyles: {
            fillColor: [23, 35, 63],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          alternateRowStyles: { fillColor: [248, 250, 253] },
        });
        documentPdf.save(`${exportFile}.pdf`);
      };

      const exportExcel = async (filteredRows) => {
        await window.ThemeVendors?.ready("xlsx");
        if (!window.XLSX) throw new Error("SheetJS indisponível");
        const { headers, data } = getExportMatrix(filteredRows);
        const worksheet = window.XLSX.utils.aoa_to_sheet([headers, ...data]);
        worksheet["!cols"] = headers.map((_, columnIndex) => ({
          wch: Math.min(
            42,
            Math.max(12, ...[headers, ...data].map((row) => String(row[columnIndex] || "").length + 2)),
          ),
        }));
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName(exportTitle));
        const workbookBytes = window.XLSX.write(workbook, {
          bookType: "xlsx",
          compression: true,
          type: "array",
        });
        const downloadUrl = URL.createObjectURL(new Blob([workbookBytes], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }));
        const download = document.createElement("a");
        download.href = downloadUrl;
        download.download = `${exportFile}.xlsx`;
        document.body.append(download);
        download.click();
        download.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      };

      const printTable = (filteredRows) => {
        const previousTitle = document.title;
        const pageStyle = document.createElement("style");
        pageStyle.dataset.uiTablePrintPage = "true";
        pageStyle.textContent = "@page { size: landscape; margin: 12mm; }";
        let cleanupTimer;
        let cleaned = false;
        const cleanup = () => {
          if (cleaned) return;
          cleaned = true;
          window.clearTimeout(cleanupTimer);
          window.removeEventListener("afterprint", cleanup);
          pageStyle.remove();
          document.title = previousTitle;
          document.body.classList.remove("is-table-printing");
          tableRoot.classList.remove("is-print-target");
          rows.forEach((row) => row.classList.remove("is-print-excluded"));
        };
        rows.forEach((row) => row.classList.toggle("is-print-excluded", !filteredRows.includes(row)));
        document.head.append(pageStyle);
        document.title = exportTitle;
        document.body.classList.add("is-table-printing");
        tableRoot.classList.add("is-print-target");
        window.addEventListener("afterprint", cleanup, { once: true });
        cleanupTimer = window.setTimeout(cleanup, 60000);
        try {
          window.print();
        } catch (error) {
          cleanup();
          throw error;
        }
      };

      const runExport = async (button, operation) => {
        const originalContent = button.innerHTML;
        button.disabled = true;
        button.classList.add("is-loading");
        button.setAttribute("aria-busy", "true");
        button.innerHTML = '<span class="ui-button-loading"><span class="ui-spinner is-small" aria-hidden="true"></span> Preparando…</span>';
        try {
          await operation();
        } finally {
          button.disabled = false;
          button.classList.remove("is-loading");
          button.removeAttribute("aria-busy");
          button.innerHTML = originalContent;
          refreshIcons();
        }
      };

      const createPageButton = ({ label, page, current = false, disabled = false, accessibleLabel }) => {
        const button = document.createElement("button");
        button.className = `ui-page-button${current ? " is-active" : ""}`;
        button.type = "button";
        button.textContent = label;
        button.disabled = disabled;
        if (current) button.setAttribute("aria-current", "page");
        if (accessibleLabel) button.setAttribute("aria-label", accessibleLabel);
        button.addEventListener("click", () => {
          currentPage = page;
          render();
          tableRoot.querySelector(".ui-table-wrap")?.focus({ preventScroll: true });
        });
        return button;
      };

      const renderPagination = (totalPages) => {
        if (!pagination) return;
        pagination.replaceChildren();
        pagination.hidden = totalPages <= 1;
        if (totalPages <= 1) return;
        pagination.append(
          createPageButton({
            label: "‹",
            page: Math.max(1, currentPage - 1),
            disabled: currentPage === 1,
            accessibleLabel: "Página anterior",
          }),
        );
        for (let page = 1; page <= totalPages; page += 1) {
          pagination.append(
            createPageButton({
              label: String(page),
              page,
              current: page === currentPage,
              accessibleLabel: `Página ${page}`,
            }),
          );
        }
        pagination.append(
          createPageButton({
            label: "›",
            page: Math.min(totalPages, currentPage + 1),
            disabled: currentPage === totalPages,
            accessibleLabel: "Próxima página",
          }),
        );
      };

      const render = () => {
        const orderedRows = getOrderedRows();
        const filteredRows = getFilteredRows(orderedRows);
        const totalPages = Math.ceil(filteredRows.length / pageSize);
        currentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
        const start = (currentPage - 1) * pageSize;
        const visibleRows = filteredRows.slice(start, start + pageSize);

        orderedRows.forEach((row) => {
          body.append(row);
          row.classList.remove("is-even");
          row.hidden = !visibleRows.includes(row);
        });
        visibleRows.forEach((row, index) => row.classList.toggle("is-even", index % 2 === 1));
        if (emptyRow) {
          body.append(emptyRow);
          emptyRow.hidden = filteredRows.length > 0;
        }

        if (summary) {
          summary.textContent = filteredRows.length
            ? `Exibindo ${start + 1}–${start + visibleRows.length} de ${filteredRows.length} registros.`
            : "Nenhum registro encontrado.";
        }
        if (counter) {
          counter.textContent = `${filteredRows.length} ${filteredRows.length === 1 ? "registro" : "registros"}`;
        }
        renderPagination(totalPages);
      };

      search?.addEventListener("input", () => {
        currentPage = 1;
        render();
      });
      filters.forEach((filter) => {
        filter.addEventListener("change", () => {
          currentPage = 1;
          render();
        });
      });
      sortButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const nextKey = button.dataset.uiTableSort;
          sortDirection = sortKey === nextKey && sortDirection === "ascending"
            ? "descending"
            : "ascending";
          sortKey = nextKey;
          currentPage = 1;
          sortButtons.forEach((item) => {
            const active = item === button;
            const direction = active ? sortDirection : "none";
            item.closest("th")?.setAttribute("aria-sort", direction);
            item.setAttribute(
              "aria-label",
              active
                ? `Ordenar por ${item.dataset.sortLabel}, atualmente ${sortDirection === "ascending" ? "crescente" : "decrescente"}`
                : `Ordenar por ${item.dataset.sortLabel}`,
            );
          });
          render();
        });
      });
      exportButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const filteredRows = getFilteredRows();
          if (!filteredRows.length) {
            const message = "Não há registros filtrados para exportar.";
            updateExportStatus(message);
            showToast(message, "danger");
            return;
          }
          const format = button.dataset.uiTableExport;
          const countLabel = `${filteredRows.length} ${filteredRows.length === 1 ? "registro" : "registros"}`;
          try {
            if (format === "print") {
              printTable(filteredRows);
              const message = `Impressão preparada com ${countLabel}.`;
              updateExportStatus(message);
              showToast(message);
              return;
            }
            updateExportStatus(`Preparando ${format === "pdf" ? "PDF" : "Excel"}.`);
            await runExport(button, () => format === "pdf"
              ? exportPdf(filteredRows)
              : exportExcel(filteredRows));
            const message = `${format === "pdf" ? "PDF" : "Excel"} exportado com ${countLabel}.`;
            updateExportStatus(message);
            showToast(message);
          } catch (error) {
            console.error("[theme] Falha ao exportar data table", error);
            const message = "Não foi possível concluir a exportação. Verifique a conexão e tente novamente.";
            updateExportStatus(message);
            showToast(message, "danger");
          }
        });
      });
      reset?.addEventListener("click", () => {
        if (search) search.value = "";
        filters.forEach((filter) => {
          filter.value = "";
        });
        sortKey = "";
        sortDirection = "ascending";
        currentPage = 1;
        sortButtons.forEach((button) => {
          button.closest("th")?.setAttribute("aria-sort", "none");
          button.setAttribute("aria-label", `Ordenar por ${button.dataset.sortLabel}`);
        });
        render();
        search?.focus();
      });

      render();
    });
  };

  const initializeCharts = async () => {
    const canvases = [...document.querySelectorAll("canvas[data-ui-chart]")];
    if (!canvases.length) return;
    try {
      await window.ThemeVendors?.ready("chartjs");
    } catch {
      document.querySelectorAll("[data-ui-chart-error]").forEach((message) => {
        message.hidden = false;
      });
      return;
    }
    if (!window.Chart) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const common = {
      responsive: true,
      maintainAspectRatio: false,
      animation: reducedMotion ? false : { duration: 720, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#17233f",
          padding: 12,
          titleFont: { family: "Poppins", weight: "700" },
          bodyFont: { family: "Poppins" },
        },
      },
    };
    window.Chart.defaults.font.family = '"Poppins", system-ui, sans-serif';
    window.Chart.defaults.color = "#667085";

    const chartInstances = {};
    canvases.forEach((canvas) => {
      const type = canvas.dataset.uiChart;
      if (type === "line") {
        chartInstances.line = new window.Chart(canvas, {
          type: "line",
          data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
            datasets: [{
              label: "Itens concluídos",
              data: [18, 24, 21, 32, 29, 38, 42, 47],
              borderColor: "#3b5ccc",
              backgroundColor: "rgba(59, 92, 204, 0.12)",
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointBackgroundColor: "#ffffff",
              pointBorderWidth: 2,
            }],
          },
          options: {
            ...common,
            scales: {
              x: { grid: { display: false }, border: { display: false } },
              y: { beginAtZero: true, grid: { color: "#edf0f5" }, border: { display: false } },
            },
          },
        });
      }
      if (type === "bar") {
        chartInstances.bar = new window.Chart(canvas, {
          type: "bar",
          data: {
            labels: ["Produto", "Operações", "Suporte", "Marketing", "Financeiro"],
            datasets: [{
              label: "Demandas",
              data: [38, 27, 22, 18, 14],
              backgroundColor: ["#3b5ccc", "#2857b8", "#14795a", "#9a5b05", "#6941c6"],
              borderRadius: 7,
              maxBarThickness: 36,
            }],
          },
          options: {
            ...common,
            scales: {
              x: { grid: { display: false }, border: { display: false } },
              y: { beginAtZero: true, grid: { color: "#edf0f5" }, border: { display: false } },
            },
          },
        });
      }
      if (type === "doughnut") {
        chartInstances.doughnut = new window.Chart(canvas, {
          type: "doughnut",
          data: {
            labels: ["Concluído", "Em andamento", "Pendente"],
            datasets: [{
              data: [58, 27, 15],
              backgroundColor: ["#14795a", "#3b5ccc", "#e2e7f0"],
              borderWidth: 0,
              hoverOffset: 4,
            }],
          },
          options: { ...common, cutout: "72%" },
        });
      }
      if (type === "sparkline") {
        const values = (canvas.dataset.chartValues || "")
          .split(",")
          .map(Number)
          .filter(Number.isFinite);
        if (!values.length) return;
        const color = canvas.dataset.chartColor || "#3b5ccc";
        const fill = canvas.dataset.chartFill || "rgba(59, 92, 204, 0.1)";
        new window.Chart(canvas, {
          type: "line",
          data: {
            labels: values.map((_, index) => String(index + 1)),
            datasets: [{
              data: values,
              borderColor: color,
              backgroundColor: fill,
              borderWidth: 2.5,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 3,
            }],
          },
          options: {
            ...common,
            events: [],
            layout: { padding: { top: 4, right: 2, bottom: 4, left: 2 } },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
              x: { display: false },
              y: { display: false },
            },
          },
        });
      }
    });

    const ranges = {
      "8m": { labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"], data: [18, 24, 21, 32, 29, 38, 42, 47] },
      "6m": { labels: ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"], data: [21, 32, 29, 38, 42, 47] },
      "3m": { labels: ["Jun", "Jul", "Ago"], data: [38, 42, 47] },
    };
    document.querySelectorAll("[data-chart-range]").forEach((button) => {
      button.addEventListener("click", () => {
        const range = ranges[button.dataset.chartRange];
        if (!range || !chartInstances.line) return;
        document.querySelectorAll("[data-chart-range]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        chartInstances.line.data.labels = range.labels;
        chartInstances.line.data.datasets[0].data = range.data;
        chartInstances.line.update();
        const canvas = document.querySelector('canvas[data-ui-chart="line"]');
        const first = range.labels[0];
        const last = range.labels.at(-1);
        canvas?.setAttribute(
          "aria-label",
          `Linha de ${first} a ${last}, evoluindo de ${range.data[0]} para ${range.data.at(-1)} itens concluídos`,
        );
        const summary = document.querySelector("[data-ui-chart-range-summary]");
        if (summary) {
          summary.textContent = `${first}–${last}: ${range.data.join(", ")} itens concluídos por período.`;
        }
      });
    });
  };

  const initialize = async () => {
    renderShell();
    initializeSidebar();
    initializeMenus();
    initializeNotifications();
    await refreshIcons();
    initializeTabs();
    initializeToasts();
    initializeModals();
    initializeDismissible();
    initializeChips();
    initializeFlags();
    initializeForms();
    initializeImageUploads();
    initializeCalendar();
    initializeCounters();
    initializeReveals();
    initializeLoadingDemos();
    initializeDataTables();
    initializeCharts();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
