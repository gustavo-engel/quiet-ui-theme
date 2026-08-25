(() => {
  "use strict";

  const pageNames = Object.freeze({
    dashboard: "Dashboard",
    forms: "Formulários",
    calendar: "Calendário",
    timeline: "Timeline de projetos",
    components: "Componentes",
    datatables: "Data Tables",
    charts: "Gráficos",
    loading: "Loading states",
    profile: "Account Settings",
    docs: "Guia rápido",
  });

  const navigation = Object.freeze([
    { page: "dashboard", href: "index.html", label: "Dashboard", icon: "layout-dashboard" },
    { page: "forms", href: "forms.html", label: "Formulários", icon: "notebook-pen" },
    { page: "calendar", href: "calendar.html", label: "Calendário", icon: "calendar-days" },
    { page: "timeline", href: "timeline.html", label: "Timeline", icon: "milestone" },
    { page: "components", href: "components.html", label: "Componentes", icon: "blocks" },
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
          <div><strong>Quiet UI</strong><span${["profile", "datatables"].includes(page) ? ' lang="en"' : ""}>${escapeHtml(title)}</span></div>
        </div>
        <div class="ui-topbar-actions">
          <a class="ui-icon-button ui-hide-mobile" href="docs.html" aria-label="Abrir guia rápido"
            title="Guia rápido">${icon("circle-help")}</a>
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
    await refreshIcons();
    initializeSidebar();
    initializeMenus();
    initializeTabs();
    initializeToasts();
    initializeModals();
    initializeDismissible();
    initializeChips();
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
