/**
 * CODEXA ENTERPRISE WEB APPLICATION ENGINE (SPA)
 * Unified state management, routing, command palette, and interactive modules.
 */

// ==========================================================================
// CENTRAL STATE & DEFAULT SEED DATA
// ==========================================================================
class AppStore {
  constructor() {
    this.storageKey = 'codexa_app_state_v2';
    this.state = this.loadState();
  }

  getDefaultState() {
    const today = new Date();
    const yStr = today.getFullYear();
    const mStr = String(today.getMonth() + 1).padStart(2, '0');
    const dStr = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${yStr}-${mStr}-${dStr}`;

    return {
      activeView: 'dashboard',
      workspaceName: 'CODEXA Core Growth Hub',
      theme: 'dark-default',
      
      // Multi-Calendars
      calendars: [
        { id: 'cal-social', name: 'Social Media Sprints', color: '#ec4899', icon: '📱', description: 'Viral Reels, YouTube Shorts & DM Campaigns', visible: true },
        { id: 'cal-seo', name: 'SEO & Search Ops', color: '#06b6d4', icon: '🔍', description: 'Google Maps, Local SEO & Keyword Audits', visible: true },
        { id: 'cal-dev', name: 'Custom Dev & Apps', color: '#3b82f6', icon: '💻', description: 'Next.js Platforms & Cross-Platform iOS/Android Apps', visible: true },
        { id: 'cal-client', name: 'Client Reviews & SOWs', color: '#10b981', icon: '💼', description: 'Strategy calls & Sprint deliverable signoffs', visible: true },
        { id: 'cal-exec', name: 'Milestones & Launches', color: '#f59e0b', icon: '🚀', description: 'Production Go-Lives & Executive KPI reviews', visible: true }
      ],

      // Calendar Events
      events: [
        {
          id: 'evt-1',
          calendarId: 'cal-social',
          title: 'Q3 Viral Shorts Batch Production',
          startDate: todayFormatted,
          startTime: '09:30',
          endDate: todayFormatted,
          endTime: '11:00',
          allDay: false,
          priority: 'High',
          category: 'Content',
          location: 'Studio A / Remote',
          description: 'Script and record 8 high-velocity Reels focusing on organic SaaS growth strategies.',
          attendees: 'Alex (Lead), Maria (Editor)'
        },
        {
          id: 'evt-2',
          calendarId: 'cal-seo',
          title: 'Google Core Algorithm Audit & Backlink Review',
          startDate: todayFormatted,
          startTime: '14:00',
          endDate: todayFormatted,
          endTime: '15:30',
          allDay: false,
          priority: 'Urgent',
          category: 'Audit',
          location: 'Google Meet',
          description: 'Audit top 15 target commercial keywords and refresh technical schema markup.',
          attendees: 'Dave (SEO Architect)'
        },
        {
          id: 'evt-3',
          calendarId: 'cal-dev',
          title: 'Next.js 15 Platform Speed & Edge Middleware Test',
          startDate: todayFormatted,
          startTime: '16:00',
          endDate: todayFormatted,
          endTime: '17:15',
          allDay: false,
          priority: 'Medium',
          category: 'Engineering',
          location: 'Discord Tech Hub',
          description: 'Sub-800ms load time optimization across edge regions.',
          attendees: 'Sarah (Frontend)'
        }
      ],

      // Kanban Tasks
      kanbanTasks: [
        { id: 'tsk-1', title: 'Viral Hook Optimization Framework', column: 'backlog', priority: 'Medium', tag: 'Social', assignee: 'Maria' },
        { id: 'tsk-2', title: 'Google Local Map Pack Schema Setup', column: 'in_progress', priority: 'High', tag: 'SEO', assignee: 'Dave' },
        { id: 'tsk-3', title: 'Next.js 15 Checkout & Booking Portal', column: 'in_progress', priority: 'Urgent', tag: 'Dev', assignee: 'Sarah' },
        { id: 'tsk-4', title: 'WhatsApp CRM Webhook Lead Auto-Reply', column: 'qa_review', priority: 'High', tag: 'Automation', assignee: 'Alex' },
        { id: 'tsk-5', title: 'Q2 Performance Report Delivery', column: 'done', priority: 'Low', tag: 'Client', assignee: 'Jordan' }
      ],

      // CRM Pipeline Leads
      leads: [
        { id: 'lead-1', name: 'Apex Logistics SaaS', contact: 'marcus@apexlog.io', service: 'Full Growth Engine', stage: 'active', value: '$8,500/mo', date: todayFormatted },
        { id: 'lead-2', name: 'Vanguard Health Clinics', contact: 'dr.elena@vanguard.com', service: 'Local SEO Dominance', stage: 'proposal', value: '$4,200/mo', date: todayFormatted },
        { id: 'lead-3', name: 'Horizon Luxury Apparel', contact: 'growth@horizon.co', service: 'Social Media Handling', stage: 'new', value: '$3,800/mo', date: todayFormatted },
        { id: 'lead-4', name: 'Nexus AI Systems', contact: 'founders@nexusai.dev', service: 'Custom Next.js App', stage: 'proposal', value: '$12,000 One-time', date: todayFormatted }
      ],

      // Activity Feed
      activities: [
        { id: 'act-1', text: 'Sarah updated task "Next.js 15 Checkout & Booking Portal" to In Progress', time: '10m ago' },
        { id: 'act-2', text: 'New calendar created: "Social Media Sprints"', time: '45m ago' },
        { id: 'act-3', text: '60s Audit generated for domain apexlog.io (Score: 94/100)', time: '2h ago' },
        { id: 'act-4', text: 'Lead Marcus from Apex Logistics signed SOW', time: '1d ago' }
      ]
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return Object.assign(this.getDefaultState(), JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  addActivity(text) {
    this.state.activities.unshift({
      id: 'act-' + Date.now(),
      text,
      time: 'Just now'
    });
    if (this.state.activities.length > 20) this.state.activities.pop();
    this.saveState();
  }
}

// ==========================================================================
// WEB APPLICATION CONTROLLER
// ==========================================================================
class CODEXAWebApp {
  constructor() {
    this.store = new AppStore();
    this.currentDate = new Date();
    this.miniCalDate = new Date();
    this.calActiveView = 'month';
    this.calSearchQuery = '';

    // Color Swatches & Icons Palette for Calendar
    this.presetColors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4',
      '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b', '#e11d48'
    ];
    this.presetIcons = ['📅', '📱', '🔍', '💻', '🚀', '⚡', '🎯', '👥', '💼', '🎨', '📊', '🛠️', '📣', '🔔', '🏆', '⭐'];

    this.init();
  }

  init() {
    this.cacheDom();
    this.bindEvents();
    this.handleRouting();
    this.renderAll();
  }

  // ==========================================================================
  // CACHE DOM ELEMENTS
  // ==========================================================================
  cacheDom() {
    this.dom = {
      sidebar: document.getElementById('appSidebar'),
      mobileToggle: document.getElementById('mobileNavToggle'),
      sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
      navBtns: document.querySelectorAll('.nav-item-btn'),
      panels: document.querySelectorAll('.app-view-panel'),
      pageTitle: document.getElementById('pageTitleDisplay'),
      
      // Command Palette
      cmdPaletteOverlay: document.getElementById('cmdPaletteOverlay'),
      cmdPaletteInput: document.getElementById('cmdPaletteInput'),
      cmdPaletteResults: document.getElementById('cmdPaletteResults'),
      btnOpenCmdPalette: document.getElementById('btnOpenCmdPalette'),

      // Dashboard
      dashKpiEvents: document.getElementById('dashKpiEvents'),
      dashKpiTasks: document.getElementById('dashKpiTasks'),
      dashKpiLeads: document.getElementById('dashKpiLeads'),
      dashActivityStream: document.getElementById('dashActivityStream'),

      // Solution Architect
      videoSlider: document.getElementById('videoSlider'),
      videoCountVal: document.getElementById('videoCountVal'),
      estWeeksVal: document.getElementById('estWeeksVal'),
      estBudgetVal: document.getElementById('estBudgetVal'),
      scopeCheckboxes: document.querySelectorAll('.scope-checkbox'),
      btnTransferToSow: document.getElementById('btnTransferToSow'),

      // Audit Lab
      auditDomainInput: document.getElementById('auditDomainInput'),
      btnRunAudit: document.getElementById('btnRunAudit'),
      auditResultsContainer: document.getElementById('auditResultsContainer'),
      gaugeSeo: document.getElementById('gaugeSeo'),
      gaugeSocial: document.getElementById('gaugeSocial'),
      gaugeSpeed: document.getElementById('gaugeSpeed'),
      gaugeConvert: document.getElementById('gaugeConvert'),

      // Kanban
      kanbanCols: {
        backlog: document.getElementById('colBacklog'),
        in_progress: document.getElementById('colInProgress'),
        qa_review: document.getElementById('colQaReview'),
        done: document.getElementById('colDone')
      },
      btnNewKanbanTask: document.getElementById('btnNewKanbanTask'),

      // Embedded Calendar Elements
      calPeriodLabel: document.getElementById('calPeriodLabel'),
      calPrevBtn: document.getElementById('calPrevBtn'),
      calNextBtn: document.getElementById('calNextBtn'),
      calTodayBtn: document.getElementById('calTodayBtn'),
      calViewBtns: document.querySelectorAll('.cal-view-btn'),
      calViewContainer: document.getElementById('calViewContainer'),
      calSidebarList: document.getElementById('calSidebarList'),
      btnAddCalendar: document.getElementById('btnAddCalendar'),
      btnNewEvent: document.getElementById('btnNewEvent'),
      btnExportIcs: document.getElementById('btnExportIcs'),
      calSearchInput: document.getElementById('calSearchInput'),

      // SOW Studio
      sowTemplateBtns: document.querySelectorAll('.sow-template-btn'),
      sowEditor: document.getElementById('sowEditor'),
      sowPreview: document.getElementById('sowPreview'),
      btnCopySow: document.getElementById('btnCopySow'),

      // CRM
      crmTableBody: document.getElementById('crmTableBody'),
      btnNewLead: document.getElementById('btnNewLead'),

      // Settings
      workspaceNameInput: document.getElementById('workspaceNameInput'),
      btnSaveSettings: document.getElementById('btnSaveSettings'),
      btnExportJsonBackup: document.getElementById('btnExportJsonBackup'),
      btnImportJsonBackup: document.getElementById('btnImportJsonBackup'),
      jsonFileInput: document.getElementById('jsonFileInput'),
      btnResetAllSeed: document.getElementById('btnResetAllSeed'),

      // Modals
      calendarModal: document.getElementById('calendarModal'),
      calendarForm: document.getElementById('calendarForm'),
      calNameInput: document.getElementById('calNameInput'),
      calColorInput: document.getElementById('calColorInput'),
      calIconInput: document.getElementById('calIconInput'),
      calDescInput: document.getElementById('calDescInput'),
      colorSwatchesGrid: document.getElementById('colorSwatchesGrid'),
      iconPickerGrid: document.getElementById('iconPickerGrid'),

      eventModal: document.getElementById('eventModal'),
      eventForm: document.getElementById('eventForm'),
      evtTitleInput: document.getElementById('evtTitleInput'),
      evtCalSelect: document.getElementById('evtCalSelect'),
      evtStartDateInput: document.getElementById('evtStartDateInput'),
      evtStartTimeInput: document.getElementById('evtStartTimeInput'),
      evtEndDateInput: document.getElementById('evtEndDateInput'),
      evtEndTimeInput: document.getElementById('evtEndTimeInput'),
      evtAllDayCheckbox: document.getElementById('evtAllDayCheckbox'),
      evtPrioritySelect: document.getElementById('evtPrioritySelect'),
      evtCategoryInput: document.getElementById('evtCategoryInput'),
      evtLocationInput: document.getElementById('evtLocationInput'),
      evtDescInput: document.getElementById('evtDescInput'),
      evtAttendeesInput: document.getElementById('evtAttendeesInput'),

      kanbanModal: document.getElementById('kanbanModal'),
      kanbanForm: document.getElementById('kanbanForm'),
      taskTitleInput: document.getElementById('taskTitleInput'),
      taskColSelect: document.getElementById('taskColSelect'),
      taskPrioritySelect: document.getElementById('taskPrioritySelect'),
      taskTagInput: document.getElementById('taskTagInput'),
      taskAssigneeInput: document.getElementById('taskAssigneeInput'),

      leadModal: document.getElementById('leadModal'),
      leadForm: document.getElementById('leadForm'),
      leadNameInput: document.getElementById('leadNameInput'),
      leadContactInput: document.getElementById('leadContactInput'),
      leadServiceInput: document.getElementById('leadServiceInput'),
      leadStageSelect: document.getElementById('leadStageSelect'),
      leadValueInput: document.getElementById('leadValueInput'),

      toastContainer: document.getElementById('toastContainer')
    };
  }

  // ==========================================================================
  // BIND DOM & GLOBAL EVENTS
  // ==========================================================================
  bindEvents() {
    // Navigation / SPA View switching
    this.dom.navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        this.navigateTo(view);
      });
    });

    window.addEventListener('hashchange', () => this.handleRouting());

    // Mobile sidebar toggle
    this.dom.mobileToggle?.addEventListener('click', () => {
      this.dom.sidebar?.classList.toggle('open');
    });

    // Command Palette (Ctrl+K / Cmd+K)
    this.dom.btnOpenCmdPalette?.addEventListener('click', () => this.openCommandPalette());
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openCommandPalette();
      }
      if (e.key === 'Escape') {
        this.closeAllModals();
        this.dom.cmdPaletteOverlay?.classList.remove('active');
      }
    });

    this.dom.cmdPaletteInput?.addEventListener('input', (e) => this.filterCommandPalette(e.target.value));

    // Modals generic close triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    // Module 2: Solution Architect
    this.dom.videoSlider?.addEventListener('input', (e) => {
      this.dom.videoCountVal.textContent = `${e.target.value} Videos / Month`;
      this.calculateScope();
    });

    this.dom.scopeCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => this.calculateScope());
    });

    this.dom.btnTransferToSow?.addEventListener('click', () => {
      this.generateSowFromScope();
      this.navigateTo('sow');
      this.showToast('Transferred custom scope to SOW Studio', 'success');
    });

    // Module 3: Audit Lab
    this.dom.btnRunAudit?.addEventListener('click', () => this.runSimulatedAudit());

    // Module 4: Kanban Task Modal
    this.dom.btnNewKanbanTask?.addEventListener('click', () => this.openKanbanModal());
    this.dom.kanbanForm?.addEventListener('submit', (e) => this.handleKanbanFormSubmit(e));

    // Module 5: Calendar Engine
    this.dom.calPrevBtn?.addEventListener('click', () => this.navigateCalPeriod(-1));
    this.dom.calNextBtn?.addEventListener('click', () => this.navigateCalPeriod(1));
    this.dom.calTodayBtn?.addEventListener('click', () => this.calGoToToday());
    this.dom.calViewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.switchCalView(e.currentTarget.dataset.calview));
    });
    this.dom.calSearchInput?.addEventListener('input', (e) => {
      this.calSearchQuery = e.target.value.trim().toLowerCase();
      this.renderCalendarViewport();
    });
    this.dom.btnAddCalendar?.addEventListener('click', () => this.openCalendarModal());
    this.dom.calendarForm?.addEventListener('submit', (e) => this.handleCalendarFormSubmit(e));
    this.dom.btnNewEvent?.addEventListener('click', () => this.openEventModal());
    this.dom.eventForm?.addEventListener('submit', (e) => this.handleEventFormSubmit(e));
    this.dom.btnExportIcs?.addEventListener('click', () => this.exportCalendarICS());

    // Module 6: SOW Studio
    this.dom.sowTemplateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.dom.sowTemplateBtns.forEach(b => b.classList.remove('btn-primary'));
        e.currentTarget.classList.add('btn-primary');
        this.loadSowTemplate(e.currentTarget.dataset.template);
      });
    });
    this.dom.sowEditor?.addEventListener('input', (e) => {
      this.renderSowPreview(e.target.value);
    });
    this.dom.btnCopySow?.addEventListener('click', () => {
      if (this.dom.sowEditor) {
        navigator.clipboard.writeText(this.dom.sowEditor.value);
        this.showToast('SOW copied to clipboard', 'success');
      }
    });

    // Module 7: CRM
    this.dom.btnNewLead?.addEventListener('click', () => this.openLeadModal());
    this.dom.leadForm?.addEventListener('submit', (e) => this.handleLeadFormSubmit(e));

    // Module 8: Settings
    this.dom.btnSaveSettings?.addEventListener('click', () => {
      const name = this.dom.workspaceNameInput.value.trim();
      if (name) {
        this.store.state.workspaceName = name;
        this.store.saveState();
        document.querySelectorAll('.workspace-name').forEach(el => el.textContent = name);
        this.showToast('Workspace settings saved', 'success');
      }
    });

    this.dom.btnExportJsonBackup?.addEventListener('click', () => this.exportJsonBackup());
    this.dom.btnImportJsonBackup?.addEventListener('click', () => this.dom.jsonFileInput?.click());
    this.dom.jsonFileInput?.addEventListener('change', (e) => this.importJsonBackup(e));
    this.dom.btnResetAllSeed?.addEventListener('click', () => {
      if (confirm('Reset entire application data to default CODEXA enterprise seeds?')) {
        localStorage.removeItem(this.store.storageKey);
        this.store.state = this.store.getDefaultState();
        this.store.saveState();
        this.renderAll();
        this.showToast('Restored default application state', 'success');
      }
    });

    this.renderColorSwatches();
    this.renderIconPicker();
  }

  // ==========================================================================
  // SPA ROUTING & NAVIGATION
  // ==========================================================================
  handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigateTo(hash, false);
  }

  navigateTo(viewName, updateHash = true) {
    if (updateHash) {
      window.location.hash = viewName;
    }

    this.store.state.activeView = viewName;
    this.store.saveState();

    // Update active nav button
    this.dom.navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update active panel
    this.dom.panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `view-${viewName}`);
    });

    // Update page title
    const titles = {
      dashboard: 'Growth Command Center',
      architect: 'Solution Architect & Pricing',
      audit: '60s Social & SEO Audit Lab',
      kanban: 'Sprint Kanban Execution',
      calendar: 'Multi-Calendar & Scheduler',
      sow: 'Scope of Work (SOW) Studio',
      crm: 'Client Pipeline & CRM',
      settings: 'Workspace Settings & Data'
    };
    if (this.dom.pageTitle) {
      this.dom.pageTitle.innerHTML = titles[viewName] || 'CODEXA App';
    }

    // Close mobile drawer on navigation
    this.dom.sidebar?.classList.remove('open');

    // Trigger specific view renders if needed
    if (viewName === 'calendar') this.renderCalendarViewport();
    if (viewName === 'kanban') this.renderKanbanBoard();
    if (viewName === 'crm') this.renderCrmTable();
    if (viewName === 'dashboard') this.renderDashboard();
  }

  // ==========================================================================
  // COMMAND PALETTE (CMD+K / CTRL+K)
  // ==========================================================================
  openCommandPalette() {
    this.dom.cmdPaletteOverlay?.classList.add('active');
    if (this.dom.cmdPaletteInput) {
      this.dom.cmdPaletteInput.value = '';
      this.dom.cmdPaletteInput.focus();
      this.filterCommandPalette('');
    }
  }

  filterCommandPalette(query) {
    if (!this.dom.cmdPaletteResults) return;

    const commands = [
      { label: '📊 Open Dashboard Overview', action: () => this.navigateTo('dashboard'), tag: 'Navigation' },
      { label: '⚙️ Solution Architect & Estimator', action: () => this.navigateTo('architect'), tag: 'Navigation' },
      { label: '🔍 Run 60s Social & SEO Audit', action: () => this.navigateTo('audit'), tag: 'Tool' },
      { label: '📋 View Kanban Sprint Board', action: () => this.navigateTo('kanban'), tag: 'Navigation' },
      { label: '📅 Open Multi-Calendar Scheduler', action: () => this.navigateTo('calendar'), tag: 'Navigation' },
      { label: '📝 Create / Edit SOW Brief', action: () => this.navigateTo('sow'), tag: 'Studio' },
      { label: '👥 View CRM Client Pipeline', action: () => this.navigateTo('crm'), tag: 'CRM' },
      { label: '➕ Create New Calendar Event', action: () => { this.navigateTo('calendar'); this.openEventModal(); }, tag: 'Action' },
      { label: '➕ Add Sprint Task to Kanban', action: () => { this.navigateTo('kanban'); this.openKanbanModal(); }, tag: 'Action' },
      { label: '➕ Add Inbound Client Lead', action: () => { this.navigateTo('crm'); this.openLeadModal(); }, tag: 'Action' },
      { label: '📥 Export .ICS Calendar File', action: () => this.exportCalendarICS(), tag: 'Export' },
      { label: '💾 Backup Application Data (JSON)', action: () => this.exportJsonBackup(), tag: 'Settings' }
    ];

    const q = query.toLowerCase().trim();
    const filtered = commands.filter(c => c.label.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q));

    this.dom.cmdPaletteResults.innerHTML = '';
    filtered.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cmd-result-item';
      el.innerHTML = `
        <span>${item.label}</span>
        <span class="cmd-result-badge">${item.tag}</span>
      `;
      el.addEventListener('click', () => {
        this.dom.cmdPaletteOverlay?.classList.remove('active');
        item.action();
      });
      this.dom.cmdPaletteResults.appendChild(el);
    });
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  // ==========================================================================
  // RENDER ALL MODULES
  // ==========================================================================
  renderAll() {
    this.renderDashboard();
    this.calculateScope();
    this.renderKanbanBoard();
    this.renderCalendarSidebar();
    this.renderCalendarViewport();
    this.loadSowTemplate('full_engine');
    this.renderCrmTable();
    if (this.dom.workspaceNameInput) this.dom.workspaceNameInput.value = this.store.state.workspaceName;
  }

  // ==========================================================================
  // MODULE 1: DASHBOARD
  // ==========================================================================
  renderDashboard() {
    if (this.dom.dashKpiEvents) this.dom.dashKpiEvents.textContent = this.store.state.events.length;
    if (this.dom.dashKpiTasks) this.dom.dashKpiTasks.textContent = this.store.state.kanbanTasks.filter(t => t.column !== 'done').length;
    if (this.dom.dashKpiLeads) this.dom.dashKpiLeads.textContent = this.store.state.leads.length;

    if (this.dom.dashActivityStream) {
      this.dom.dashActivityStream.innerHTML = '';
      this.store.state.activities.slice(0, 6).forEach(act => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
          <span>⚡</span>
          <span>${this.escapeHtml(act.text)}</span>
          <span class="act-time">${act.time}</span>
        `;
        this.dom.dashActivityStream.appendChild(item);
      });
    }
  }

  // ==========================================================================
  // MODULE 2: SOLUTION ARCHITECT
  // ==========================================================================
  calculateScope() {
    let totalWeeks = 0;
    let baseBudget = 1800; // base monthly retainer

    const videoCount = parseInt(this.dom.videoSlider?.value || '16', 10);
    baseBudget += (videoCount * 90);

    this.dom.scopeCheckboxes.forEach(cb => {
      const card = cb.closest('.scope-option-card');
      if (cb.checked) {
        card?.classList.add('selected');
        totalWeeks += parseInt(cb.dataset.weeks || '1', 10);
        baseBudget += parseInt(cb.dataset.price || '800', 10);
      } else {
        card?.classList.remove('selected');
      }
    });

    if (this.dom.estWeeksVal) this.dom.estWeeksVal.textContent = `${Math.max(2, totalWeeks)} Weeks`;
    if (this.dom.estBudgetVal) this.dom.estBudgetVal.textContent = `$${baseBudget.toLocaleString()} / mo`;
  }

  generateSowFromScope() {
    const videoCount = this.dom.videoSlider?.value || '16';
    const selectedServices = [];
    this.dom.scopeCheckboxes.forEach(cb => {
      if (cb.checked) selectedServices.push(`- ${cb.dataset.name} (${cb.dataset.weeks} Weeks Execution)`);
    });

    const markdown = `# CODEXA STATEMENT OF WORK (SOW)
**Client Workspace:** ${this.store.state.workspaceName}
**Generated Date:** ${new Date().toLocaleDateString()}
**Estimated Velocity:** ${this.dom.estWeeksVal?.textContent}
**Target Investment:** ${this.dom.estBudgetVal?.textContent}

---

### 1. Scope of Deliverables
- **Monthly Video Content:** ${videoCount} Viral Reels / YouTube Shorts (Scripted, Edited, Published)
${selectedServices.join('\n')}

### 2. SLA & Sprint Terms
- **Weekly Sprint Reviews:** Every Monday 10:00 AM GMT
- **Code & Content Ownership:** 100% Client-Owned Upon Sprint Completion
- **Performance Guarantee:** Top 3 Google Search Targets & Sub-1s Web Load Time
`;

    if (this.dom.sowEditor) {
      this.dom.sowEditor.value = markdown;
      this.renderSowPreview(markdown);
    }
  }

  // ==========================================================================
  // MODULE 3: 60-SECOND SOCIAL & SEO AUDIT LAB
  // ==========================================================================
  runSimulatedAudit() {
    const target = this.dom.auditDomainInput?.value.trim() || 'yourbusiness.com';
    this.dom.btnRunAudit.textContent = 'Crawling & Analyzing...';
    this.dom.btnRunAudit.disabled = true;

    setTimeout(() => {
      this.dom.btnRunAudit.textContent = 'Re-Run Audit';
      this.dom.btnRunAudit.disabled = false;

      // Simulated dynamic scores based on domain string
      const seoScore = 88 + (target.length % 10);
      const socialScore = 82 + (target.length % 12);
      const speedScore = 95;
      const convertScore = 91;

      if (this.dom.gaugeSeo) this.dom.gaugeSeo.textContent = `${seoScore}%`;
      if (this.dom.gaugeSocial) this.dom.gaugeSocial.textContent = `${socialScore}%`;
      if (this.dom.gaugeSpeed) this.dom.gaugeSpeed.textContent = `${speedScore}%`;
      if (this.dom.gaugeConvert) this.dom.gaugeConvert.textContent = `${convertScore}%`;

      this.store.addActivity(`Generated 60s Social & SEO Audit report for ${target}`);
      this.renderDashboard();
      this.showToast(`Audit Complete for ${target}`, 'success');
    }, 1000);
  }

  // ==========================================================================
  // MODULE 4: KANBAN SPRINT EXECUTION BOARD
  // ==========================================================================
  renderKanbanBoard() {
    Object.values(this.dom.kanbanCols).forEach(col => {
      if (col) col.innerHTML = '';
    });

    this.store.state.kanbanTasks.forEach(task => {
      const colEl = this.dom.kanbanCols[task.column] || this.dom.kanbanCols.backlog;
      if (!colEl) return;

      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <span class="kanban-tag">🏷️ #${this.escapeHtml(task.tag || 'Task')}</span>
        <div class="kanban-card-title">${this.escapeHtml(task.title)}</div>
        <div class="kanban-card-footer">
          <span>👤 ${this.escapeHtml(task.assignee || 'Unassigned')}</span>
          <span style="font-family: var(--font-mono); color: var(--brand-amber);">${task.priority}</span>
        </div>
      `;

      card.addEventListener('click', () => this.cycleTaskStage(task.id));
      colEl.appendChild(card);
    });
  }

  cycleTaskStage(taskId) {
    const stages = ['backlog', 'in_progress', 'qa_review', 'done'];
    const task = this.store.state.kanbanTasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIdx = stages.indexOf(task.column);
    const nextIdx = (currentIdx + 1) % stages.length;
    task.column = stages[nextIdx];

    this.store.saveState();
    this.store.addActivity(`Task "${task.title}" moved to ${stages[nextIdx].toUpperCase()}`);
    this.renderKanbanBoard();
    this.renderDashboard();
    this.showToast(`Task moved to ${stages[nextIdx].replace('_', ' ').toUpperCase()}`, 'info');
  }

  openKanbanModal() {
    this.dom.taskTitleInput.value = '';
    this.dom.taskTagInput.value = 'Dev';
    this.dom.taskAssigneeInput.value = 'Sarah';
    this.dom.kanbanModal?.classList.add('active');
    setTimeout(() => this.dom.taskTitleInput.focus(), 100);
  }

  handleKanbanFormSubmit(e) {
    e.preventDefault();
    const title = this.dom.taskTitleInput.value.trim();
    if (!title) return;

    const newTask = {
      id: 'tsk-' + Date.now().toString(36),
      title,
      column: this.dom.taskColSelect.value,
      priority: this.dom.taskPrioritySelect.value,
      tag: this.dom.taskTagInput.value.trim(),
      assignee: this.dom.taskAssigneeInput.value.trim()
    };

    this.store.state.kanbanTasks.push(newTask);
    this.store.saveState();
    this.store.addActivity(`Created task "${title}" in Sprint Board`);
    this.dom.kanbanModal?.classList.remove('active');
    this.renderKanbanBoard();
    this.renderDashboard();
    this.showToast(`Added task: "${title}"`, 'success');
  }

  // ==========================================================================
  // MODULE 5: MULTI-CALENDAR SCHEDULER ENGINE
  // ==========================================================================
  renderCalendarSidebar() {
    if (!this.dom.calSidebarList) return;
    this.dom.calSidebarList.innerHTML = '';

    this.store.state.calendars.forEach(cal => {
      const eventCount = this.store.state.events.filter(e => e.calendarId === cal.id).length;
      const item = document.createElement('div');
      item.className = 'calendar-item';
      item.style.setProperty('--cal-color', cal.color);

      item.innerHTML = `
        <div class="calendar-info-group" title="${this.escapeHtml(cal.description || cal.name)}">
          <input type="checkbox" class="cal-checkbox" data-id="${cal.id}" ${cal.visible ? 'checked' : ''}>
          <span class="calendar-badge-icon">${cal.icon || '📅'}</span>
          <span class="calendar-label-text" style="color: ${cal.visible ? '#fff' : 'var(--text-muted)'}">${this.escapeHtml(cal.name)}</span>
        </div>
        <div class="calendar-actions-hover">
          <span class="calendar-count-badge">${eventCount}</span>
          <button class="cal-action-btn btn-edit" title="Edit Calendar" data-id="${cal.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
        </div>
      `;

      item.querySelector('.cal-checkbox').addEventListener('change', (e) => {
        cal.visible = e.target.checked;
        this.store.saveState();
        this.renderCalendarViewport();
      });

      item.querySelector('.btn-edit').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCalendarModal(cal.id);
      });

      this.dom.calSidebarList.appendChild(item);
    });
  }

  renderCalendarViewport() {
    if (!this.dom.calViewContainer) return;
    this.dom.calViewContainer.innerHTML = '';

    // Update Header period label
    const y = this.currentDate.getFullYear();
    const m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][this.currentDate.getMonth()];
    if (this.dom.calPeriodLabel) this.dom.calPeriodLabel.textContent = `${m} ${y}`;

    const visibleCalIds = new Set(this.store.state.calendars.filter(c => c.visible).map(c => c.id));
    const filteredEvents = this.store.state.events.filter(e => {
      if (!visibleCalIds.has(e.calendarId)) return false;
      if (this.calSearchQuery && !`${e.title} ${e.description || ''}`.toLowerCase().includes(this.calSearchQuery)) return false;
      return true;
    });

    if (this.calActiveView === 'month') {
      this.renderMonthViewGrid(filteredEvents);
    } else {
      this.renderAgendaViewGrid(filteredEvents);
    }
  }

  renderMonthViewGrid(filteredEvents) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const todayStr = new Date().toISOString().split('T')[0];

    const grid = document.createElement('div');
    grid.className = 'month-days-matrix';

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i;
      const cell = document.createElement('div');
      cell.className = 'month-day-cell other-month';
      cell.innerHTML = `<span class="day-number-badge">${dNum}</span>`;
      grid.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;

      const cell = document.createElement('div');
      cell.className = `month-day-cell ${isToday ? 'today' : ''}`;
      cell.innerHTML = `
        <div class="month-day-header">
          <span class="day-number-badge">${d}</span>
          <button class="cell-add-quick-btn" title="Add event">+</button>
        </div>
        <div class="day-events-stack"></div>
      `;

      cell.querySelector('.cell-add-quick-btn').onclick = (e) => {
        e.stopPropagation();
        this.openEventModal(null, dateStr);
      };

      const stack = cell.querySelector('.day-events-stack');
      const dayEvents = filteredEvents.filter(e => e.startDate === dateStr);
      dayEvents.slice(0, 3).forEach(evt => {
        const cal = this.store.state.calendars.find(c => c.id === evt.calendarId) || { color: '#3b82f6' };
        const chip = document.createElement('div');
        chip.className = 'event-chip';
        chip.style.setProperty('--event-color', cal.color);
        chip.style.setProperty('--event-bg', `${cal.color}28`);
        chip.innerHTML = `<span class="chip-title">${this.escapeHtml(evt.title)}</span>`;
        chip.onclick = (e) => {
          e.stopPropagation();
          this.openEventModal(evt.id);
        };
        stack.appendChild(chip);
      });

      grid.appendChild(cell);
    }

    this.dom.calViewContainer.appendChild(grid);
  }

  renderAgendaViewGrid(filteredEvents) {
    const list = document.createElement('div');
    list.className = 'agenda-view-container';

    if (filteredEvents.length === 0) {
      list.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No events found matching criteria.</div>`;
      this.dom.calViewContainer.appendChild(list);
      return;
    }

    filteredEvents.forEach(evt => {
      const cal = this.store.state.calendars.find(c => c.id === evt.calendarId) || { name: 'General', color: '#3b82f6', icon: '📅' };
      const card = document.createElement('div');
      card.className = 'agenda-card-item';
      card.style.setProperty('--event-color', cal.color);
      card.style.setProperty('--event-bg', `${cal.color}22`);

      card.innerHTML = `
        <div class="agenda-time-pill">${evt.startDate} (${evt.allDay ? 'All Day' : evt.startTime})</div>
        <div class="agenda-main-info">
          <div class="agenda-title-row">
            <span class="agenda-title">${this.escapeHtml(evt.title)}</span>
            <span class="agenda-cal-tag">${cal.icon} ${this.escapeHtml(cal.name)}</span>
          </div>
          ${evt.description ? `<div class="agenda-desc">${this.escapeHtml(evt.description)}</div>` : ''}
        </div>
      `;
      card.onclick = () => this.openEventModal(evt.id);
      list.appendChild(card);
    });

    this.dom.calViewContainer.appendChild(list);
  }

  navigateCalPeriod(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendarViewport();
  }

  calGoToToday() {
    this.currentDate = new Date();
    this.renderCalendarViewport();
  }

  switchCalView(view) {
    this.calActiveView = view;
    this.dom.calViewBtns.forEach(b => b.classList.toggle('active', b.dataset.calview === view));
    this.renderCalendarViewport();
  }

  openCalendarModal(calId = null) {
    this.editingCalId = calId;
    if (calId) {
      const cal = this.store.state.calendars.find(c => c.id === calId);
      if (!cal) return;
      this.dom.calNameInput.value = cal.name;
      this.dom.calColorInput.value = cal.color;
      this.dom.calIconInput.value = cal.icon || '📅';
      this.dom.calDescInput.value = cal.description || '';
    } else {
      this.dom.calNameInput.value = '';
      this.dom.calColorInput.value = '#3b82f6';
      this.dom.calIconInput.value = '📅';
      this.dom.calDescInput.value = '';
    }
    this.updateActiveColorSwatch(this.dom.calColorInput.value);
    this.dom.calendarModal?.classList.add('active');
    setTimeout(() => this.dom.calNameInput.focus(), 100);
  }

  handleCalendarFormSubmit(e) {
    e.preventDefault();
    const name = this.dom.calNameInput.value.trim();
    if (!name) return;

    if (this.editingCalId) {
      const cal = this.store.state.calendars.find(c => c.id === this.editingCalId);
      if (cal) {
        cal.name = name;
        cal.color = this.dom.calColorInput.value;
        cal.icon = this.dom.calIconInput.value;
        cal.description = this.dom.calDescInput.value.trim();
        this.showToast(`Updated calendar "${name}"`, 'success');
      }
    } else {
      this.store.state.calendars.push({
        id: 'cal-' + Date.now().toString(36),
        name,
        color: this.dom.calColorInput.value,
        icon: this.dom.calIconInput.value || '📅',
        description: this.dom.calDescInput.value.trim(),
        visible: true
      });
      this.showToast(`Created calendar "${name}"`, 'success');
    }

    this.store.saveState();
    this.dom.calendarModal?.classList.remove('active');
    this.renderCalendarSidebar();
    this.renderCalendarViewport();
  }

  openEventModal(evtId = null, defaultDateStr = null) {
    this.editingEvtId = evtId;

    // Populate calendar selector
    this.dom.evtCalSelect.innerHTML = '';
    this.store.state.calendars.forEach(cal => {
      const opt = document.createElement('option');
      opt.value = cal.id;
      opt.textContent = `${cal.icon || '📅'} ${cal.name}`;
      this.dom.evtCalSelect.appendChild(opt);
    });

    if (evtId) {
      const evt = this.store.state.events.find(e => e.id === evtId);
      if (!evt) return;
      this.dom.evtTitleInput.value = evt.title;
      this.dom.evtCalSelect.value = evt.calendarId;
      this.dom.evtStartDateInput.value = evt.startDate;
      this.dom.evtStartTimeInput.value = evt.startTime || '10:00';
      this.dom.evtEndDateInput.value = evt.endDate || evt.startDate;
      this.dom.evtEndTimeInput.value = evt.endTime || '11:00';
      this.dom.evtAllDayCheckbox.checked = !!evt.allDay;
      this.dom.evtPrioritySelect.value = evt.priority || 'High';
      this.dom.evtCategoryInput.value = evt.category || 'Sprint';
      this.dom.evtLocationInput.value = evt.location || '';
      this.dom.evtDescInput.value = evt.description || '';
      this.dom.evtAttendeesInput.value = evt.attendees || '';
    } else {
      const defDate = defaultDateStr || new Date().toISOString().split('T')[0];
      this.dom.evtTitleInput.value = '';
      this.dom.evtStartDateInput.value = defDate;
      this.dom.evtStartTimeInput.value = '10:00';
      this.dom.evtEndDateInput.value = defDate;
      this.dom.evtEndTimeInput.value = '11:00';
      this.dom.evtAllDayCheckbox.checked = false;
      this.dom.evtPrioritySelect.value = 'High';
      this.dom.evtCategoryInput.value = 'Sprint';
      this.dom.evtLocationInput.value = 'Google Meet';
      this.dom.evtDescInput.value = '';
      this.dom.evtAttendeesInput.value = '';
    }

    this.dom.eventModal?.classList.add('active');
    setTimeout(() => this.dom.evtTitleInput.focus(), 100);
  }

  handleEventFormSubmit(e) {
    e.preventDefault();
    const title = this.dom.evtTitleInput.value.trim();
    if (!title) return;

    if (this.editingEvtId) {
      const evt = this.store.state.events.find(e => e.id === this.editingEvtId);
      if (evt) {
        evt.title = title;
        evt.calendarId = this.dom.evtCalSelect.value;
        evt.startDate = this.dom.evtStartDateInput.value;
        evt.startTime = this.dom.evtStartTimeInput.value;
        evt.endDate = this.dom.evtEndDateInput.value;
        evt.endTime = this.dom.evtEndTimeInput.value;
        evt.allDay = this.dom.evtAllDayCheckbox.checked;
        evt.priority = this.dom.evtPrioritySelect.value;
        evt.category = this.dom.evtCategoryInput.value.trim();
        evt.location = this.dom.evtLocationInput.value.trim();
        evt.description = this.dom.evtDescInput.value.trim();
        evt.attendees = this.dom.evtAttendeesInput.value.trim();
        this.showToast(`Updated event "${title}"`, 'success');
      }
    } else {
      this.store.state.events.push({
        id: 'evt-' + Date.now().toString(36),
        title,
        calendarId: this.dom.evtCalSelect.value,
        startDate: this.dom.evtStartDateInput.value,
        startTime: this.dom.evtStartTimeInput.value,
        endDate: this.dom.evtEndDateInput.value,
        endTime: this.dom.evtEndTimeInput.value,
        allDay: this.dom.evtAllDayCheckbox.checked,
        priority: this.dom.evtPrioritySelect.value,
        category: this.dom.evtCategoryInput.value.trim(),
        location: this.dom.evtLocationInput.value.trim(),
        description: this.dom.evtDescInput.value.trim(),
        attendees: this.dom.evtAttendeesInput.value.trim()
      });
      this.showToast(`Scheduled event "${title}"`, 'success');
    }

    this.store.saveState();
    this.dom.eventModal?.classList.remove('active');
    this.renderCalendarSidebar();
    this.renderCalendarViewport();
    this.renderDashboard();
  }

  exportCalendarICS() {
    let ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CODEXA//WebApp//EN', 'CALSCALE:GREGORIAN'];
    this.store.state.events.forEach(e => {
      const start = (e.startDate || '').replace(/-/g, '') + (e.allDay ? '' : 'T' + (e.startTime || '10:00').replace(/:/g, '') + '00');
      const end = (e.endDate || e.startDate || '').replace(/-/g, '') + (e.allDay ? '' : 'T' + (e.endTime || '11:00').replace(/:/g, '') + '00');
      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${e.id}@codexa.io`);
      ics.push(`DTSTART:${start}`);
      ics.push(`DTEND:${end}`);
      ics.push(`SUMMARY:${e.title}`);
      if (e.description) ics.push(`DESCRIPTION:${e.description}`);
      ics.push('END:VEVENT');
    });
    ics.push('END:VCALENDAR');

    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `codexa-schedule-${new Date().toISOString().split('T')[0]}.ics`;
    link.click();
    this.showToast('Exported .ICS calendar file', 'success');
  }

  // ==========================================================================
  // MODULE 6: SOW & BRIEF STUDIO
  // ==========================================================================
  loadSowTemplate(type) {
    const templates = {
      full_engine: `# CODEXA FULL GROWTH ENGINE SOW
**Client Workspace:** ${this.store.state.workspaceName}
**Sprint Model:** 12-Week Dedicated Growth Squad

### Deliverables:
1. **Viral Video Content Engine:** 16 Reels & YouTube Shorts / month.
2. **Organic Google SEO Dominance:** Top 3 target keyword ranking + Schema.
3. **Custom Next.js Web/App:** High-conversion web portal built on Next.js 15.
4. **Automated WhatsApp CRM Routing:** Instant lead intake and qualification bot.
`,
      social: `# CODEXA SOCIAL MEDIA ACCELERATOR SOW
### Deliverables:
1. Scripting, video editing and daily posting across IG, TikTok & YouTube.
2. Active DM engagement and community comment management.
3. Monthly performance review and viral hooks iteration.
`,
      seo: `# CODEXA LOCAL & SEARCH DOMINANCE SOW
### Deliverables:
1. Local Google Business Profile optimization.
2. 15 Commercial high-intent keyword ranking.
3. Authority backlink acquisition and technical Core Web Vitals tune.
`
    };

    const content = templates[type] || templates.full_engine;
    if (this.dom.sowEditor) {
      this.dom.sowEditor.value = content;
      this.renderSowPreview(content);
    }
  }

  renderSowPreview(markdown) {
    if (!this.dom.sowPreview) return;
    this.dom.sowPreview.innerHTML = markdown
      .replace(/^# (.*$)/gim, '<h2 style="color:#fff; margin-bottom:10px;">$1</h2>')
      .replace(/^### (.*$)/gim, '<h4 style="color:var(--brand-sky); margin:12px 0 6px;">$1</h4>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/\n/gim, '<br>');
  }

  // ==========================================================================
  // MODULE 7: CRM & CLIENT PIPELINE
  // ==========================================================================
  renderCrmTable() {
    if (!this.dom.crmTableBody) return;
    this.dom.crmTableBody.innerHTML = '';

    this.store.state.leads.forEach(lead => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${this.escapeHtml(lead.name)}</b></td>
        <td><span style="font-family:var(--font-mono); color:var(--text-secondary);">${this.escapeHtml(lead.contact)}</span></td>
        <td>${this.escapeHtml(lead.service)}</td>
        <td><span class="stage-pill ${lead.stage}">${lead.stage.toUpperCase()}</span></td>
        <td><b style="color:var(--brand-emerald);">${this.escapeHtml(lead.value)}</b></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="window.codexaApp.deleteLead('${lead.id}')">Remove</button>
        </td>
      `;
      this.dom.crmTableBody.appendChild(tr);
    });
  }

  openLeadModal() {
    this.dom.leadNameInput.value = '';
    this.dom.leadContactInput.value = '';
    this.dom.leadServiceInput.value = 'Full Growth Engine';
    this.dom.leadValueInput.value = '$6,500/mo';
    this.dom.leadModal?.classList.add('active');
    setTimeout(() => this.dom.leadNameInput.focus(), 100);
  }

  handleLeadFormSubmit(e) {
    e.preventDefault();
    const name = this.dom.leadNameInput.value.trim();
    if (!name) return;

    this.store.state.leads.push({
      id: 'lead-' + Date.now().toString(36),
      name,
      contact: this.dom.leadContactInput.value.trim(),
      service: this.dom.leadServiceInput.value.trim(),
      stage: this.dom.leadStageSelect.value,
      value: this.dom.leadValueInput.value.trim(),
      date: new Date().toISOString().split('T')[0]
    });

    this.store.saveState();
    this.store.addActivity(`Added new client lead: "${name}"`);
    this.dom.leadModal?.classList.remove('active');
    this.renderCrmTable();
    this.renderDashboard();
    this.showToast(`Added lead "${name}"`, 'success');
  }

  deleteLead(leadId) {
    this.store.state.leads = this.store.state.leads.filter(l => l.id !== leadId);
    this.store.saveState();
    this.renderCrmTable();
    this.renderDashboard();
    this.showToast('Lead removed', 'info');
  }

  // ==========================================================================
  // MODULE 8: SETTINGS & BACKUP
  // ==========================================================================
  exportJsonBackup() {
    const dataStr = JSON.stringify(this.store.state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `codexa-app-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    this.showToast('Downloaded full application JSON backup', 'success');
  }

  importJsonBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (imported.calendars && imported.events) {
          this.store.state = imported;
          this.store.saveState();
          this.renderAll();
          this.showToast('Imported backup successfully', 'success');
        } else {
          alert('Invalid backup format');
        }
      } catch (err) {
        alert('Could not parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ==========================================================================
  // COLOR & ICON PICKERS
  // ==========================================================================
  renderColorSwatches() {
    if (!this.dom.colorSwatchesGrid) return;
    this.dom.colorSwatchesGrid.innerHTML = '';
    this.presetColors.forEach(col => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-swatch-btn';
      btn.style.backgroundColor = col;
      btn.dataset.color = col;
      btn.onclick = () => {
        this.dom.calColorInput.value = col;
        this.updateActiveColorSwatch(col);
      };
      this.dom.colorSwatchesGrid.appendChild(btn);
    });
  }

  updateActiveColorSwatch(col) {
    this.dom.colorSwatchesGrid?.querySelectorAll('.color-swatch-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.color.toLowerCase() === col.toLowerCase());
    });
  }

  renderIconPicker() {
    if (!this.dom.iconPickerGrid) return;
    this.dom.iconPickerGrid.innerHTML = '';
    this.presetIcons.forEach(ic => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-option-btn';
      btn.textContent = ic;
      btn.dataset.icon = ic;
      btn.onclick = () => {
        this.dom.calIconInput.value = ic;
        this.updateActiveIconOption(ic);
      };
      this.dom.iconPickerGrid.appendChild(btn);
    });
  }

  updateActiveIconOption(ic) {
    this.dom.iconPickerGrid?.querySelectorAll('.icon-option-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.icon === ic);
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  showToast(message, type = 'info') {
    if (!this.dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ️'}</span> <span>${this.escapeHtml(message)}</span>`;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 200);
    }, 3500);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.codexaApp = new CODEXAWebApp();
});
