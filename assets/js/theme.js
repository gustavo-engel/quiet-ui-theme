(() => {
  "use strict";

  const pageNames = Object.freeze({
    dashboard: "Dashboard",
    forms: "Formulários",
    calendar: "Calendário",
    timeline: "Timeline de projetos",
    components: "Componentes",
    charts: "Gráficos",
    loading: "Loading states",
    docs: "Guia rápido",
  });

  const navigation = Object.freeze([
    { page: "dashboard", href: "index.html", label: "Dashboard", icon: "layout-dashboard" },
    { page: "forms", href: "forms.html", label: "Formulários", icon: "notebook-pen" },
    { page: "calendar", href: "calendar.html", label: "Calendário", icon: "calendar-days" },
    { page: "timeline", href: "timeline.html", label: "Timeline", icon: "milestone" },
    { page: "components", href: "components.html", label: "Componentes", icon: "blocks" },
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
      topbar.innerHTML = `
        <div class="ui-topbar-start">
          <button class="ui-icon-button" type="button" data-ui-sidebar-toggle
            aria-controls="ui-sidebar" aria-expanded="true" aria-label="Recolher menu lateral">
            ${icon("panel-left")}
          </button>
          <div><strong>Quiet UI</strong><span>${escapeHtml(title)}</span></div>
        </div>
        <div class="ui-topbar-actions">
          <a class="ui-icon-button ui-hide-mobile" href="docs.html" aria-label="Abrir guia rápido"
            title="Guia rápido">${icon("circle-help")}</a>
          <div class="ui-menu" data-ui-menu>
            <button class="ui-user-button" type="button" data-ui-menu-button aria-expanded="false">
              <span class="ui-avatar" aria-hidden="true">AD</span>
              <span class="ui-user-copy"><strong>Conta demo</strong><small>Administrador</small></span>
              ${icon("chevron-down", "ui-menu-chevron")}
            </button>
            <div class="ui-menu-panel" data-ui-menu-panel hidden>
              <a href="forms.html">${icon("user-round")} Perfil</a>
              <a href="components.html">${icon("settings-2")} Preferências</a>
              <span class="ui-menu-separator"></span>
              <button type="button" data-ui-toast-trigger data-message="Sessão de demonstração encerrada.">
                ${icon("log-out")} Sair da demonstração
              </button>
            </div>
          </div>
        </div>`;
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
        if (willOpen) panel.querySelector("a, button")?.focus();
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

  const initializeTabs = () => {
    document.querySelectorAll("[data-ui-tabs]").forEach((group) => {
      const tabs = [...group.querySelectorAll('[role="tab"]')];
      const panels = tabs
        .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
        .filter(Boolean);
      if (!tabs.length || !panels.length) return;

      const activate = (selected, focus = false) => {
        tabs.forEach((tab) => {
          const active = tab === selected;
          tab.setAttribute("aria-selected", String(active));
          tab.tabIndex = active ? 0 : -1;
          document.getElementById(tab.getAttribute("aria-controls"))?.toggleAttribute("hidden", !active);
        });
        if (focus) selected.focus();
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activate(tab));
        tab.addEventListener("keydown", (event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          activate(tabs[next], true);
        });
      });
      activate(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
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

  const initializeForms = () => {
    document.querySelectorAll("[data-ui-password-toggle]").forEach((button) => {
      const field = document.getElementById(button.dataset.uiPasswordToggle);
      if (!field) return;
      button.addEventListener("click", () => {
        const visible = field.type === "text";
        field.type = visible ? "password" : "text";
        button.setAttribute("aria-label", visible ? "Mostrar senha" : "Ocultar senha");
        button.innerHTML = icon(visible ? "eye" : "eye-off");
        refreshIcons();
      });
    });

    document.querySelectorAll("form[data-ui-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        let firstInvalid;
        form.querySelectorAll("[required]").forEach((field) => {
          const invalid = !field.checkValidity();
          field.toggleAttribute("aria-invalid", invalid);
          const error = form.querySelector(`[data-error-for="${field.id}"]`);
          if (error) error.hidden = !invalid;
          if (invalid && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) {
          firstInvalid.focus();
          showToast("Revise os campos destacados.", "danger");
          return;
        }
        showToast("Formulário validado. Nenhum dado foi enviado.");
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
        <h3>${escapeHtml(eventData[1])}</h3><span>${eventData[0]} · Evento demonstrativo</span></div>`;
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
    await refreshIcons();
    initializeSidebar();
    initializeMenus();
    initializeTabs();
    initializeToasts();
    initializeModals();
    initializeDismissible();
    initializeChips();
    initializeForms();
    initializeCalendar();
    initializeCounters();
    initializeReveals();
    initializeLoadingDemos();
    initializeCharts();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
