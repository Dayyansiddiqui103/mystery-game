/**
 * THE LAST SIGNAL - Main Game Controller & Navigation Manager
 */

class GameEngine {
  constructor() {
    this.state = {
      view: 'landing', // 'landing', 'briefing', 'dashboard'
      tab: 'case',     // 'case', 'locations', 'evidence', 'suspects', 'messages', 'puzzles', 'board', 'accusation'
      activeLocationId: 'loc_facility',
      collectedClues: new Set(),
      solvedPuzzles: new Set(),
      unlockedTimeline: new Set(['0', '1', '6']), // initial 3 timeline events visible
      interrogatedSuspects: new Set(),
      unlockedDeductions: new Set(),
      selectedAccusationSuspect: null,
      selectedAccusationEvidence: new Set(),
      endingData: null
    };

    this.init();
  }

  init() {
    this.loadStateFromStorage();
    this.bindGlobalEvents();
    this.renderView();
  }

  saveStateToStorage() {
    try {
      const serialized = {
        view: this.state.view,
        tab: this.state.tab,
        activeLocationId: this.state.activeLocationId,
        collectedClues: Array.from(this.state.collectedClues),
        solvedPuzzles: Array.from(this.state.solvedPuzzles),
        unlockedTimeline: Array.from(this.state.unlockedTimeline),
        interrogatedSuspects: Array.from(this.state.interrogatedSuspects),
        unlockedDeductions: Array.from(this.state.unlockedDeductions)
      };
      localStorage.setItem('the_last_signal_state', JSON.stringify(serialized));
    } catch (e) {}
  }

  loadStateFromStorage() {
    try {
      const saved = localStorage.getItem('the_last_signal_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state.view = parsed.view || 'landing';
        this.state.tab = parsed.tab || 'case';
        this.state.activeLocationId = parsed.activeLocationId || 'loc_facility';
        this.state.collectedClues = new Set(parsed.collectedClues || []);
        this.state.solvedPuzzles = new Set(parsed.solvedPuzzles || []);
        this.state.unlockedTimeline = new Set(parsed.unlockedTimeline || ['0', '1', '6']);
        this.state.interrogatedSuspects = new Set(parsed.interrogatedSuspects || []);
        this.state.unlockedDeductions = new Set(parsed.unlockedDeductions || []);
        evidenceBoard.unlockedDeductions = this.state.unlockedDeductions;
      }
    } catch (e) {}
  }

  resetGame() {
    localStorage.removeItem('the_last_signal_state');
    this.state = {
      view: 'landing',
      tab: 'case',
      activeLocationId: 'loc_facility',
      collectedClues: new Set(),
      solvedPuzzles: new Set(),
      unlockedTimeline: new Set(['0', '1', '6']),
      interrogatedSuspects: new Set(),
      unlockedDeductions: new Set(),
      selectedAccusationSuspect: null,
      selectedAccusationEvidence: new Set(),
      endingData: null
    };
    evidenceBoard.unlockedDeductions = new Set();
    evidenceBoard.connections = [];
    interrogationManager.confrontationHistory.clear();
    this.renderView();
  }

  calculateProgress() {
    const totalClues = CASE_DATA.clues.length;
    const totalPuzzles = CASE_DATA.puzzles.length;
    const totalDeductions = CASE_DATA.boardConnections.length;

    const clueWeight = 40 * (this.state.collectedClues.size / totalClues);
    const puzzleWeight = 20 * (this.state.solvedPuzzles.size / totalPuzzles);
    const deductionWeight = 30 * (this.state.unlockedDeductions.size / totalDeductions);
    const suspectWeight = 10 * (this.state.interrogatedSuspects.size / CASE_DATA.suspects.length);

    return Math.min(100, Math.round(clueWeight + puzzleWeight + deductionWeight + suspectWeight));
  }

  bindGlobalEvents() {
    // Sound Toggle Button
    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        soundBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark text-red-400"></i>' : '<i class="fa-solid fa-volume-high text-cyan"></i>';
      });
    }

    // Reset / Restart Button
    const resetBtn = document.getElementById('btnRestartCase');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset the case investigation progress?")) {
          soundManager.playClick();
          this.resetGame();
        }
      });
    }
  }

  changeView(viewName) {
    soundManager.playClick();
    this.state.view = viewName;
    if (viewName === 'dashboard') {
      soundManager.startAmbient();
    }
    this.saveStateToStorage();
    this.renderView();
  }

  changeTab(tabName) {
    soundManager.playClick();
    this.state.tab = tabName;
    this.saveStateToStorage();
    this.renderDashboardTab();
  }

  renderView() {
    const landingView = document.getElementById('viewLanding');
    const briefingView = document.getElementById('viewBriefing');
    const dashboardView = document.getElementById('viewDashboard');

    if (landingView) landingView.classList.add('hidden');
    if (briefingView) briefingView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');

    if (this.state.view === 'landing') {
      if (landingView) landingView.classList.remove('hidden');
      this.initLandingScreen();
    } else if (this.state.view === 'briefing') {
      if (briefingView) briefingView.classList.remove('hidden');
      this.initBriefingScreen();
    } else if (this.state.view === 'dashboard') {
      if (dashboardView) dashboardView.classList.remove('hidden');
      this.initDashboardScreen();
    }
  }

  // --- LANDING SCREEN ---
  initLandingScreen() {
    const btnStart = document.getElementById('btnStartInvestigation');
    const btnHowTo = document.getElementById('btnHowToPlay');
    const modalHowTo = document.getElementById('modalHowToPlay');
    const btnCloseHowTo = document.getElementById('btnCloseHowTo');

    if (btnStart) {
      btnStart.onclick = () => this.changeView('briefing');
    }
    if (btnHowTo && modalHowTo) {
      btnHowTo.onclick = () => {
        soundManager.playClick();
        modalHowTo.classList.remove('hidden');
      };
    }
    if (btnCloseHowTo && modalHowTo) {
      btnCloseHowTo.onclick = () => {
        soundManager.playClick();
        modalHowTo.classList.add('hidden');
      };
    }
  }

  // --- BRIEFING SCREEN ---
  initBriefingScreen() {
    const btnBegin = document.getElementById('btnBeginCase');
    const btnSkip = document.getElementById('btnSkipBriefing');

    if (btnBegin) {
      btnBegin.onclick = () => this.changeView('dashboard');
    }
    if (btnSkip) {
      btnSkip.onclick = () => this.changeView('dashboard');
    }
  }

  // --- DASHBOARD SCREEN ---
  initDashboardScreen() {
    this.updateTopBar();
    this.bindSidebarTabs();
    this.renderDashboardTab();
  }

  updateTopBar() {
    const progressVal = this.calculateProgress();
    const progressEl = document.getElementById('progressValue');
    const progressBar = document.getElementById('progressBarFill');
    const cluesCountEl = document.getElementById('cluesFoundCount');

    if (progressEl) progressEl.textContent = `${progressVal}%`;
    if (progressBar) progressBar.style.width = `${progressVal}%`;
    if (cluesCountEl) cluesCountEl.textContent = `${this.state.collectedClues.size}/15`;
  }

  bindSidebarTabs() {
    const tabs = document.querySelectorAll('.sidebar-nav-item');
    tabs.forEach(tab => {
      tab.classList.remove('active-tab');
      if (tab.dataset.tab === this.state.tab) {
        tab.classList.add('active-tab');
      }
      tab.onclick = () => this.changeTab(tab.dataset.tab);
    });
  }

  renderDashboardTab() {
    this.updateTopBar();
    const contentArea = document.getElementById('dashboardMainContent');
    if (!contentArea) return;

    contentArea.innerHTML = '';

    switch (this.state.tab) {
      case 'case':
        this.renderCaseOverview(contentArea);
        break;
      case 'locations':
        this.renderLocationsView(contentArea);
        break;
      case 'evidence':
        this.renderEvidenceView(contentArea);
        break;
      case 'suspects':
        this.renderSuspectsView(contentArea);
        break;
      case 'messages':
        this.renderMessagesView(contentArea);
        break;
      case 'puzzles':
        this.renderPuzzlesView(contentArea);
        break;
      case 'board':
        this.renderBoardView(contentArea);
        break;
      case 'accusation':
        this.renderAccusationView(contentArea);
        break;
    }
  }

  // --- TAB 1: CASE OVERVIEW ---
  renderCaseOverview(container) {
    const meta = CASE_DATA.meta;
    container.innerHTML = `
      <div class="glass-panel p-6 space-y-6">
        <div class="flex flex-wrap justify-between items-start border-b border-white/10 pb-4">
          <div>
            <span class="badge badge-warning text-xs mb-2">${meta.id}</span>
            <h2 class="font-serif text-3xl font-bold text-offwhite">${meta.title}</h2>
            <p class="text-xs text-muted font-mono mt-1">SUBJECT: ${meta.subject} (${meta.age}) - ${meta.occupation}</p>
          </div>
          <div class="text-right">
            <span class="badge badge-danger text-xs animate-pulse">STATUS: ${meta.status}</span>
            <div class="text-xs text-muted font-mono mt-2">LAST LOCATION: ${meta.lastLocation}</div>
          </div>
        </div>

        <div class="bg-dark-deep p-4 rounded-lg border border-cyan/20">
          <h4 class="font-mono text-xs text-cyan mb-2"><i class="fa-solid fa-terminal me-2"></i>CASE BRIEFING SUMMARY</h4>
          <p class="text-sm text-offwhite/90 leading-relaxed">${meta.briefingText}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-card p-4 text-center rounded-lg">
            <div class="text-2xl font-mono text-amber font-bold">${this.state.collectedClues.size} / 15</div>
            <div class="text-xs text-muted mt-1">CLUES DISCOVERED</div>
          </div>
          <div class="glass-card p-4 text-center rounded-lg">
            <div class="text-2xl font-mono text-cyan font-bold">${this.state.solvedPuzzles.size} / 3</div>
            <div class="text-xs text-muted mt-1">PUZZLES SOLVED</div>
          </div>
          <div class="glass-card p-4 text-center rounded-lg">
            <div class="text-2xl font-mono text-purple-400 font-bold">${this.state.unlockedDeductions.size} / 4</div>
            <div class="text-xs text-muted mt-1">DEDUCTIONS UNLOCKED</div>
          </div>
        </div>

        <div class="flex justify-center pt-4">
          <button id="btnOverviewStartExplore" class="btn-primary py-3 px-8 text-sm">
            <i class="fa-solid fa-compass me-2"></i>EXPLORE CRIME SCENE LOCATIONS
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btnOverviewStartExplore').onclick = () => this.changeTab('locations');
  }

  // --- TAB 2: LOCATIONS EXPLORATION ---
  renderLocationsView(container) {
    const locations = CASE_DATA.locations;
    const activeLoc = locations.find(l => l.id === this.state.activeLocationId) || locations[0];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- LOCATION SELECTOR TABS -->
        <div class="flex flex-wrap gap-2 p-2 bg-dark-surface rounded-lg border border-white/5">
          ${locations.map(loc => `
            <button class="btn-loc-tab flex-1 min-w-[140px] py-2.5 px-3 rounded text-xs font-mono transition-all text-center ${loc.id === activeLoc.id ? 'bg-cyan/20 border border-cyan text-cyan font-bold shadow-lg' : 'text-muted hover:text-offwhite hover:bg-white/5'}" data-locid="${loc.id}">
              <i class="fa-solid ${loc.icon} me-1.5"></i> ${loc.name}
            </button>
          `).join('')}
        </div>

        <!-- ACTIVE LOCATION CANVAS SCENE -->
        <div class="glass-panel p-6 relative min-h-[480px] rounded-xl overflow-hidden border border-white/10" style="background: ${activeLoc.bgStyle}">
          <div class="mb-4">
            <h3 class="font-serif text-2xl font-bold text-offwhite">${activeLoc.name}</h3>
            <p class="text-xs text-cyan font-mono">${activeLoc.tagline}</p>
            <p class="text-xs text-muted mt-1">${activeLoc.description}</p>
          </div>

          <!-- HOTSPOTS SCENE LAYER -->
          <div class="hotspots-scene relative w-full h-[360px] bg-black/40 rounded-lg border border-white/5 overflow-hidden">
            <div class="absolute inset-0 scanline-overlay pointer-events-none"></div>

            ${activeLoc.hotspots.map(hs => {
              const isFound = this.state.collectedClues.has(hs.discoveredClueId);
              return `
                <div class="hotspot-pin absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 z-10" style="top: ${hs.top}; left: ${hs.left};" data-hsid="${hs.id}">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center ${isFound ? 'bg-green-500/20 border-2 border-green-400 text-green-400' : 'bg-amber-500/20 border-2 border-amber-400 text-amber animate-pulse'} shadow-xl">
                    <i class="fa-solid ${hs.icon} text-sm"></i>
                  </div>
                  <div class="text-[10px] font-mono text-center mt-1 px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-offwhite whitespace-nowrap">
                    ${hs.name} ${isFound ? '✓' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- INVESTIGATION MODAL -->
      <div id="modalInvestigation" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 hidden">
        <div class="glass-panel max-w-md w-full p-6 m-4 relative animate-scaleUp">
          <button id="btnCloseModalHS" class="absolute top-4 right-4 text-muted hover:text-offwhite text-lg">&times;</button>
          <div id="modalHSContent"></div>
        </div>
      </div>
    `;

    // Location tab click
    container.querySelectorAll('.btn-loc-tab').forEach(btn => {
      btn.onclick = () => {
        soundManager.playClick();
        this.state.activeLocationId = btn.dataset.locid;
        this.saveStateToStorage();
        this.renderLocationsView(container);
      };
    });

    // Hotspot click modal opening
    const modal = container.querySelector('#modalInvestigation');
    const modalContent = container.querySelector('#modalHSContent');
    const btnCloseModal = container.querySelector('#btnCloseModalHS');

    if (btnCloseModal && modal) {
      btnCloseModal.onclick = () => modal.classList.add('hidden');
    }

    container.querySelectorAll('.hotspot-pin').forEach(pin => {
      pin.onclick = () => {
        soundManager.playClick();
        const hsId = pin.dataset.hsid;
        const hs = activeLoc.hotspots.find(h => h.id === hsId);
        if (!hs) return;

        const clue = CASE_DATA.clues.find(c => c.id === hs.discoveredClueId);
        const isCollected = this.state.collectedClues.has(clue.id);

        modalContent.innerHTML = `
          <div class="text-center mb-4">
            <div class="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2 text-amber text-xl">
              <i class="fa-solid ${hs.icon}"></i>
            </div>
            <span class="badge badge-warning text-[10px] mb-1">OBJECT: ${hs.name.toUpperCase()}</span>
            <h3 class="font-serif text-xl font-bold text-offwhite">${clue.name}</h3>
          </div>

          <div class="p-3 bg-dark-deep rounded border border-white/5 text-xs text-offwhite/90 space-y-2 mb-4">
            <p><strong>EXAMINATION OBSERVED:</strong></p>
            <p class="italic text-muted font-mono">${hs.examineText}</p>
          </div>

          ${clue.unlockedBy && !this.state.solvedPuzzles.has(clue.unlockedBy) ? `
            <div class="p-3 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-300 mb-4">
              <i class="fa-solid fa-lock me-1"></i> THIS CLUE IS ENCRYPTED. Solve the associated puzzle in the <strong>PUZZLES</strong> section to unlock full evidence data.
            </div>
          ` : ''}

          <div class="flex gap-3">
            <button id="btnAddClueEvidence" class="btn-primary flex-1 py-2.5 text-xs ${isCollected ? 'opacity-50 cursor-not-allowed' : ''}" ${isCollected ? 'disabled' : ''}>
              <i class="fa-solid fa-folder-plus me-1"></i> ${isCollected ? 'ALREADY IN EVIDENCE' : 'ADD TO EVIDENCE'}
            </button>
            <button id="btnCloseHSModalInner" class="btn-secondary py-2.5 px-4 text-xs">CLOSE</button>
          </div>
        `;

        modal.classList.remove('hidden');

        modalContent.querySelector('#btnCloseHSModalInner').onclick = () => modal.classList.add('hidden');

        const btnAdd = modalContent.querySelector('#btnAddClueEvidence');
        if (btnAdd && !isCollected) {
          btnAdd.onclick = () => {
            soundManager.playClueDiscovered();
            this.state.collectedClues.add(clue.id);

            // Auto reveal related timeline events
            CASE_DATA.timeline.forEach((item, idx) => {
              if (item.clueRef === clue.id) this.state.unlockedTimeline.add(idx.toString());
            });

            this.saveStateToStorage();
            this.updateTopBar();
            modal.classList.add('hidden');
            this.renderLocationsView(container);
          };
        }
      };
    });
  }

  // --- TAB 3: EVIDENCE INVENTORY ---
  renderEvidenceView(container) {
    const collected = CASE_DATA.clues.filter(c => this.state.collectedClues.has(c.id));

    container.innerHTML = `
      <div class="glass-panel p-6 space-y-6">
        <div class="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h3 class="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
              <i class="fa-solid fa-box-archive text-amber"></i> DISCOVERED EVIDENCE LOCKER
            </h3>
            <p class="text-xs text-muted">Inspect collected clues and review suspect associations.</p>
          </div>
          <div class="badge badge-warning text-xs font-mono">${collected.length} / 15 CLUES COLLECTED</div>
        </div>

        ${collected.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${collected.map(clue => `
              <div class="glass-card p-4 rounded-lg border border-amber-400/20 hover:border-amber-400 transition-all flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <span class="badge ${clue.importance==='CRITICAL'?'badge-danger':(clue.importance==='HIGH'?'badge-warning':'badge-secondary')} text-[10px]">
                      ${clue.importance}
                    </span>
                    <i class="fa-solid ${clue.icon} text-amber text-lg"></i>
                  </div>
                  <h4 class="font-serif font-bold text-offwhite text-sm mb-1">${clue.name}</h4>
                  <div class="text-[10px] font-mono text-cyan mb-2">LOCATION: ${clue.location}</div>
                  <p class="text-xs text-offwhite/80 line-clamp-3">${clue.description}</p>
                </div>
                <div class="mt-4 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-muted">
                  <span>RELATED: ${clue.suspects.join(', ') || 'None'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center py-12 text-muted">
            <i class="fa-solid fa-folder-open text-4xl mb-3 text-white/20"></i>
            <p class="text-sm">No evidence collected yet.</p>
            <p class="text-xs mt-1">Visit locations in the <strong>LOCATIONS</strong> tab to search for clues.</p>
          </div>
        `}
      </div>
    `;
  }

  // --- TAB 4: SUSPECTS INTERROGATION ---
  renderSuspectsView(container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 space-y-3" id="suspectsListNav"></div>
        <div class="lg:col-span-2" id="interrogationRoomArea"></div>
      </div>
    `;

    const listNav = container.querySelector('#suspectsListNav');
    const roomArea = container.querySelector('#interrogationRoomArea');

    if (!interrogationManager.activeSuspectId) {
      interrogationManager.activeSuspectId = CASE_DATA.suspects[0].id;
    }

    const refreshRoom = (suspectId) => {
      this.state.interrogatedSuspects.add(suspectId);
      this.saveStateToStorage();
      this.updateTopBar();

      interrogationManager.renderSuspectList(listNav, this.state, (sId) => refreshRoom(sId));
      interrogationManager.renderInterrogationRoom(roomArea, suspectId, this.state, (sId, clueId, conf) => {
        this.saveStateToStorage();
        this.updateTopBar();
      });
    };

    refreshRoom(interrogationManager.activeSuspectId);
  }

  // --- TAB 5: MESSAGES & CHAT ---
  renderMessagesView(container) {
    container.innerHTML = `
      <div class="glass-panel p-6 space-y-6">
        <div class="border-b border-white/10 pb-4">
          <h3 class="font-serif text-xl font-bold text-offwhite flex items-center gap-2">
            <i class="fa-solid fa-comments text-cyan"></i> INTERCEPTED COMMUNICATIONS
          </h3>
          <p class="text-xs text-muted">Review recovered mobile logs and encrypted network transmissions.</p>
        </div>

        <div class="space-y-4">
          ${CASE_DATA.messages.map(msg => `
            <div class="p-4 bg-dark-surface rounded-lg border border-white/5 hover:border-cyan/30 transition-all">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="font-mono text-xs text-cyan">${msg.sender} ➔ ${msg.receiver}</span>
                  <span class="text-[10px] text-muted ms-2">${msg.timestamp}</span>
                </div>
                ${msg.locked ? `
                  <span class="badge badge-danger text-[10px]"><i class="fa-solid fa-lock me-1"></i> ENCRYPTED</span>
                ` : `
                  <span class="badge badge-success text-[10px]">UNLOCKED</span>
                `}
              </div>

              ${msg.locked ? `
                <p class="text-xs text-red-300 italic mb-2">This message thread is encrypted with high-level ciphers.</p>
                ${this.state.collectedClues.has(msg.unlockClueId) ? `
                  <button class="btn-primary text-xs py-1 px-3 btn-unlock-msg" data-msgid="${msg.id}">
                    <i class="fa-solid fa-key me-1"></i> UNLOCK THREAD (USING RECOVERED EVIDENCE)
                  </button>
                ` : `
                  <p class="text-[10px] text-muted">Requires CCTV Purge Clue #07 to unlock decryption keys.</p>
                `}
              ` : `
                <p class="text-xs text-offwhite/90 leading-relaxed bg-dark-deep p-3 rounded border border-cyan/10 font-sans">${msg.body}</p>
              `}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-unlock-msg').forEach(btn => {
      btn.onclick = () => {
        soundManager.playSuccess();
        const msgId = btn.dataset.msgid;
        const msg = CASE_DATA.messages.find(m => m.id === msgId);
        if (msg) msg.locked = false;
        this.renderMessagesView(container);
      };
    });
  }

  // --- TAB 6: PUZZLES ---
  renderPuzzlesView(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <!-- PUZZLE SELECTOR TABS -->
        <div class="flex flex-wrap gap-3">
          ${CASE_DATA.puzzles.map(puz => {
            const isSolved = this.state.solvedPuzzles.has(puz.id);
            return `
              <button class="btn-puz-tab flex-1 min-w-[160px] p-3 rounded-lg border text-left transition-all ${isSolved ? 'bg-green-950/20 border-green-500/40' : 'bg-dark-surface border-white/10 hover:border-cyan/40'}" data-puzid="${puz.id}">
                <div class="flex justify-between items-center text-xs mb-1">
                  <span class="font-serif font-bold text-offwhite">${puz.title}</span>
                  ${isSolved ? '<i class="fa-solid fa-circle-check text-green-400"></i>' : '<i class="fa-solid fa-lock text-amber"></i>'}
                </div>
                <div class="text-[10px] font-mono text-muted">${puz.location}</div>
              </button>
            `;
          }).join('')}
        </div>

        <div id="puzzlePlayArea" class="glass-panel p-6"></div>
      </div>
    `;

    const playArea = container.querySelector('#puzzlePlayArea');

    const loadPuzzle = (puzId) => {
      const puz = CASE_DATA.puzzles.find(p => p.id === puzId);
      if (!puz) return;

      if (this.state.solvedPuzzles.has(puz.id)) {
        playArea.innerHTML = `
          <div class="text-center py-8">
            <i class="fa-solid fa-circle-check text-5xl text-green-400 mb-3"></i>
            <h3 class="font-serif text-2xl font-bold text-offwhite">PUZZLE SOLVED</h3>
            <p class="text-xs text-muted mt-1">You have already completed this cryptographic challenge.</p>
          </div>
        `;
        return;
      }

      const onSolved = (solvedPuzId, yieldClueId) => {
        this.state.solvedPuzzles.add(solvedPuzId);
        if (yieldClueId) this.state.collectedClues.add(yieldClueId);
        this.saveStateToStorage();
        this.updateTopBar();
        this.renderPuzzlesView(container);
      };

      if (puz.type === 'keypad') {
        puzzleManager.initKeypad(playArea, onSolved);
      } else if (puz.type === 'cipher') {
        puzzleManager.initCipher(playArea, onSolved);
      } else if (puz.type === 'scanner') {
        puzzleManager.initScanner(playArea, onSolved);
      }
    };

    container.querySelectorAll('.btn-puz-tab').forEach(btn => {
      btn.onclick = () => {
        soundManager.playClick();
        loadPuzzle(btn.dataset.puzid);
      };
    });

    loadPuzzle(CASE_DATA.puzzles[0].id);
  }

  // --- TAB 7: EVIDENCE BOARD ---
  renderBoardView(container) {
    evidenceBoard.render(container, this.state, (deduction) => {
      this.state.unlockedDeductions.add(deduction.id);
      this.saveStateToStorage();
      this.updateTopBar();
      this.renderBoardView(container);
    });
  }

  // --- TAB 8: FINAL ACCUSATION ---
  renderAccusationView(container) {
    const progress = this.calculateProgress();
    const collectedClues = CASE_DATA.clues.filter(c => this.state.collectedClues.has(c.id));

    container.innerHTML = `
      <div class="glass-panel p-6 space-y-6">
        <div class="text-center border-b border-white/10 pb-4">
          <span class="badge badge-danger text-xs mb-1 animate-pulse">CASE FINAL PHASE</span>
          <h2 class="font-serif text-3xl font-bold text-offwhite">FORMAL ACCUSATION FILE</h2>
          <p class="text-xs text-muted mt-1">Review the case details and designate the primary perpetrator responsible for Elias Vale's disappearance.</p>
        </div>

        <!-- SUSPECT SELECTION GRID -->
        <div>
          <h4 class="font-serif text-md text-amber mb-3">1. SELECT THE CULPRIT:</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${CASE_DATA.suspects.map(suspect => {
              const isSelected = this.state.selectedAccusationSuspect === suspect.id;
              return `
                <div class="suspect-acc-card glass-card p-4 rounded-lg border text-center cursor-pointer transition-all ${isSelected ? 'border-crimson bg-crimson/10 glow-red' : 'border-white/10 hover:border-cyan/40'}" data-susid="${suspect.id}">
                  <img src="${suspect.avatar}" class="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-white/20">
                  <h4 class="font-serif font-bold text-offwhite text-sm">${suspect.name}</h4>
                  <div class="text-[10px] text-cyan font-mono">${suspect.role}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- SUPPORTING EVIDENCE SELECTOR -->
        <div>
          <h4 class="font-serif text-md text-amber mb-3">2. SELECT SUPPORTING EVIDENCE (MINIMUM 2):</h4>
          ${collectedClues.length > 0 ? `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              ${collectedClues.map(clue => {
                const isSelected = this.state.selectedAccusationEvidence.has(clue.id);
                return `
                  <div class="ev-acc-card p-3 bg-dark-surface rounded border cursor-pointer transition-all ${isSelected ? 'border-amber-400 bg-amber-500/10' : 'border-white/5 hover:border-white/20'}" data-clueid="${clue.id}">
                    <div class="flex items-center gap-2 text-xs font-serif font-bold text-offwhite">
                      <input type="checkbox" ${isSelected ? 'checked' : ''} class="pointer-events-none accent-amber">
                      <span>${clue.name}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="text-xs text-muted italic">No clues collected yet. Gather evidence before submitting an accusation.</div>
          `}
        </div>

        <!-- SUBMIT BUTTON -->
        <div class="text-center pt-4 border-t border-white/10">
          <button id="btnSubmitAccusation" class="btn-primary py-3.5 px-10 text-sm bg-crimson hover:bg-crimson/80 border-crimson">
            <i class="fa-solid fa-gavel me-2"></i>SUBMIT FINAL ACCUSATION
          </button>
          <div id="accusationError" class="text-xs text-red-400 font-mono mt-2 h-4"></div>
        </div>
      </div>
    `;

    // Suspect selection
    container.querySelectorAll('.suspect-acc-card').forEach(card => {
      card.onclick = () => {
        soundManager.playClick();
        this.state.selectedAccusationSuspect = card.dataset.susid;
        this.renderAccusationView(container);
      };
    });

    // Evidence selection
    container.querySelectorAll('.ev-acc-card').forEach(card => {
      card.onclick = () => {
        soundManager.playClick();
        const clueId = card.dataset.clueid;
        if (this.state.selectedAccusationEvidence.has(clueId)) {
          this.state.selectedAccusationEvidence.delete(clueId);
        } else {
          this.state.selectedAccusationEvidence.add(clueId);
        }
        this.renderAccusationView(container);
      };
    });

    // Submit Accusation
    const btnSubmit = container.querySelector('#btnSubmitAccusation');
    const errEl = container.querySelector('#accusationError');

    btnSubmit.onclick = () => {
      if (!this.state.selectedAccusationSuspect) {
        soundManager.playError();
        errEl.textContent = "PLEASE SELECT A SUSPECT TO ACCUSE.";
        return;
      }
      if (this.state.selectedAccusationEvidence.size < 2) {
        soundManager.playError();
        errEl.textContent = "REQUIRED: AT LEAST 2 PIECES OF SUPPORTING EVIDENCE.";
        return;
      }

      this.processEnding();
    };
  }

  processEnding() {
    const suspect = this.state.selectedAccusationSuspect;
    const progress = this.calculateProgress();
    const ev = this.state.selectedAccusationEvidence;

    let ending = null;

    if (suspect === 'suspect_adrian' && ev.has('clue_07') && ev.has('clue_13')) {
      if (this.state.unlockedDeductions.size >= 3) {
        ending = CASE_DATA.endings.SECRET_ENDING;
      } else {
        ending = CASE_DATA.endings.TRUE_ENDING;
      }
    } else if (suspect === 'suspect_victor' && ev.has('clue_11')) {
      ending = CASE_DATA.endings.SECRET_ENDING;
    } else if (progress < 40) {
      ending = CASE_DATA.endings.INCOMPLETE_CASE;
    } else {
      ending = CASE_DATA.endings.WRONG_ACCUSATION;
    }

    this.state.endingData = ending;
    this.renderCaseSummaryScreen();
  }

  renderCaseSummaryScreen() {
    const ending = this.state.endingData;
    const contentArea = document.getElementById('dashboardMainContent');
    if (!contentArea || !ending) return;

    soundManager.playSuccess();

    contentArea.innerHTML = `
      <div class="glass-panel p-8 space-y-6 text-center animate-scaleUp">
        <span class="badge ${ending.badgeClass} text-sm px-4 py-1.5 font-mono mb-2">${ending.badge}</span>
        
        <h1 class="font-serif text-4xl font-bold text-offwhite">${ending.title}</h1>
        
        <div class="bg-dark-deep p-6 rounded-xl border border-white/10 max-w-2xl mx-auto text-left space-y-4">
          <h4 class="font-mono text-xs text-amber border-b border-white/5 pb-2">CASE CONCLUSION SUMMARY:</h4>
          <p class="text-sm text-offwhite/90 leading-relaxed whitespace-pre-line">${ending.description}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto font-mono">
          <div class="p-3 bg-dark-surface rounded border border-white/5">
            <div class="text-xl font-bold text-cyan">${this.calculateProgress()}%</div>
            <div class="text-[10px] text-muted">COMPLETION</div>
          </div>
          <div class="p-3 bg-dark-surface rounded border border-white/5">
            <div class="text-xl font-bold text-amber">${this.state.collectedClues.size}/15</div>
            <div class="text-[10px] text-muted">CLUES</div>
          </div>
          <div class="p-3 bg-dark-surface rounded border border-white/5">
            <div class="text-xl font-bold text-purple-400">${this.state.solvedPuzzles.size}/3</div>
            <div class="text-[10px] text-muted">PUZZLES</div>
          </div>
          <div class="p-3 bg-dark-surface rounded border border-white/5">
            <div class="text-xl font-bold text-green-400">${this.state.unlockedDeductions.size}/4</div>
            <div class="text-[10px] text-muted">DEDUCTIONS</div>
          </div>
        </div>

        <div class="flex justify-center gap-4 pt-4">
          <button id="btnSummaryPlayAgain" class="btn-primary py-3 px-8 text-sm">
            <i class="fa-solid fa-rotate-right me-2"></i>PLAY AGAIN / RESTART CASE
          </button>
        </div>
      </div>
    `;

    contentArea.querySelector('#btnSummaryPlayAgain').onclick = () => {
      soundManager.playClick();
      this.resetGame();
    };
  }
}

let gameEngine;
document.addEventListener('DOMContentLoaded', () => {
  gameEngine = new GameEngine();
});
