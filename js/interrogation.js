/**
 * THE LAST SIGNAL - Suspect Interrogation & Evidence Confrontation Engine
 */

class InterrogationManager {
  constructor() {
    this.activeSuspectId = null;
    this.confrontationHistory = new Set();
  }

  renderSuspectList(containerEl, gameState, onSelectSuspect) {
    containerEl.innerHTML = CASE_DATA.suspects.map(suspect => {
      const isSelected = suspect.id === this.activeSuspectId;
      const isConfronted = Array.from(this.confrontationHistory).some(key => key.startsWith(suspect.id));

      return `
        <div class="suspect-card glass-panel cursor-pointer p-4 transition-all duration-300 ${isSelected ? 'active-suspect border-amber-400 glow-amber' : 'hover:border-cyan/40'}" data-id="${suspect.id}">
          <div class="flex items-center gap-4">
            <img src="${suspect.avatar}" alt="${suspect.name}" class="w-16 h-16 rounded-full object-cover border-2 border-cyan/40 shadow-lg">
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h4 class="font-serif text-lg font-bold text-offwhite truncate">${suspect.name}</h4>
                <span class="badge ${suspect.suspicionLevel > 60 ? 'badge-danger' : 'badge-warning'} text-xs">
                  ${suspect.suspicionLevel}% SUSPICION
                </span>
              </div>
              <div class="text-xs text-cyan font-mono">${suspect.role}</div>
              <p class="text-xs text-muted truncate mt-1">${suspect.personality}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    containerEl.querySelectorAll('.suspect-card').forEach(card => {
      card.addEventListener('click', () => {
        soundManager.playClick();
        this.activeSuspectId = card.dataset.id;
        onSelectSuspect(this.activeSuspectId);
      });
    });
  }

  renderInterrogationRoom(containerEl, suspectId, gameState, onConfrontSuccess) {
    const suspect = CASE_DATA.suspects.find(s => s.id === suspectId);
    if (!suspect) return;

    // Filter collected evidence relevant to this suspect
    const inventoryClues = CASE_DATA.clues.filter(c => gameState.collectedClues.has(c.id));
    const confrontableClues = inventoryClues.filter(c => suspect.confrontations.some(conf => conf.clueId === c.id));

    containerEl.innerHTML = `
      <div class="interrogation-room glass-panel p-6">
        <!-- HEADER -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
          <div class="flex items-center gap-4">
            <img src="${suspect.avatar}" alt="${suspect.name}" class="w-20 h-20 rounded-lg object-cover border-2 border-amber-400/50 shadow-xl">
            <div>
              <h2 class="font-serif text-2xl font-bold text-offwhite">${suspect.name}</h2>
              <div class="text-xs font-mono text-cyan">${suspect.role.toUpperCase()}</div>
              <div class="text-xs text-muted mt-1">MOTIVE: ${suspect.motive}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono text-muted">SUSPICION LEVEL</div>
            <div class="text-3xl font-mono text-amber font-bold">${suspect.suspicionLevel}%</div>
          </div>
        </div>

        <!-- MAIN INTERROGATION CONTENT GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- LEFT: STATEMENT QUESTIONING -->
          <div class="questions-panel bg-dark-surface p-4 rounded-lg border border-white/5">
            <h3 class="font-serif text-md text-amber mb-3 flex items-center gap-2">
              <i class="fa-solid fa-comments"></i> INTERROGATION QUESTIONS
            </h3>
            
            <div class="space-y-3 mb-4">
              ${suspect.statements.map((st, idx) => `
                <button class="btn-statement text-left w-full p-3 rounded bg-dark-deep border border-white/5 hover:border-cyan/40 text-xs transition-all" data-idx="${idx}">
                  <i class="fa-solid fa-circle-question text-cyan me-2"></i> ${st.question}
                </button>
              `).join('')}
            </div>

            <div class="confrontation-section pt-4 border-t border-white/10">
              <h3 class="font-serif text-md text-crimson mb-2 flex items-center gap-2">
                <i class="fa-solid fa-hand-fist"></i> CONFRONT WITH DISCOVERED EVIDENCE
              </h3>
              
              ${confrontableClues.length > 0 ? `
                <div class="space-y-2">
                  ${confrontableClues.map(clue => {
                    const isUsed = this.confrontationHistory.has(`${suspect.id}_${clue.id}`);
                    return `
                      <button class="btn-confront text-left w-full p-2.5 rounded bg-crimson/10 border ${isUsed ? 'border-gray-600 opacity-60' : 'border-crimson/40 hover:bg-crimson/20'} text-xs font-mono text-offwhite transition-all" data-clueid="${clue.id}" ${isUsed ? 'disabled' : ''}>
                        <i class="fa-solid fa-triangle-exclamation text-amber me-2"></i>
                        [CONFRONT WITH ${clue.name.toUpperCase()}]
                        ${isUsed ? ' (ALREADY USED)' : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              ` : `
                <p class="text-xs text-muted italic">No matching evidence in inventory for this suspect yet. Investigate locations to find clues.</p>
              `}
            </div>
          </div>

          <!-- RIGHT: DIALOGUE TERMINAL / RESPONSE DISPLAY -->
          <div class="dialogue-display bg-dark-deep p-4 rounded-lg border border-cyan/20 flex flex-col justify-between min-h-[300px]">
            <div>
              <div class="text-xs font-mono text-muted mb-2 border-b border-white/5 pb-1 flex justify-between">
                <span>INTERROGATION LOG</span>
                <span class="text-cyan animate-pulse">● RECORDING</span>
              </div>
              <div id="dialogueOutput" class="space-y-4 text-sm font-sans">
                <div class="p-3 bg-dark-surface/50 rounded border-l-2 border-amber-400 text-xs text-offwhite italic">
                  "Select a question from the left panel or present evidence to confront Dr. ${suspect.name.split(' ')[1]}."
                </div>
              </div>
            </div>

            <!-- KNOWN FACTS UNLOCKED -->
            <div class="mt-4 pt-3 border-t border-white/5 text-xs">
              <div class="text-muted font-mono mb-1">DOSSIER SUMMARY:</div>
              <p class="text-offwhite/80 leading-relaxed">${suspect.background}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const output = containerEl.querySelector('#dialogueOutput');

    // Handle Question Click
    containerEl.querySelectorAll('.btn-statement').forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playKeypress();
        const idx = parseInt(btn.dataset.idx);
        const st = suspect.statements[idx];

        output.innerHTML = `
          <div class="detective-msg p-3 bg-cyan/10 rounded border-l-2 border-cyan text-xs text-offwhite">
            <strong class="text-cyan font-mono">DETECTIVE:</strong> "${st.question}"
          </div>
          <div class="suspect-msg p-3 bg-dark-surface rounded border-l-2 border-amber-400 text-xs text-offwhite animate-fadeIn">
            <strong class="text-amber font-mono">${suspect.name.toUpperCase()}:</strong> "${st.answer}"
          </div>
        `;
      });
    });

    // Handle Confrontation Click
    containerEl.querySelectorAll('.btn-confront').forEach(btn => {
      btn.addEventListener('click', () => {
        const clueId = btn.dataset.clueid;
        const clue = CASE_DATA.clues.find(c => c.id === clueId);
        const conf = suspect.confrontations.find(c => c.clueId === clueId);

        if (conf) {
          soundManager.playSuccess();
          this.confrontationHistory.add(`${suspect.id}_${clueId}`);
          suspect.suspicionLevel = Math.max(0, Math.min(100, suspect.suspicionLevel + conf.suspicionChange));

          output.innerHTML = `
            <div class="detective-msg p-3 bg-crimson/15 rounded border-l-2 border-crimson text-xs text-offwhite">
              <strong class="text-crimson font-mono">DETECTIVE (CONFRONTING WITH ${clue.name.toUpperCase()}):</strong>
              <p class="mt-1">"${conf.triggerQuestion}"</p>
            </div>
            <div class="suspect-msg p-3 bg-amber-500/10 rounded border-l-2 border-amber-400 text-xs text-offwhite animate-shake">
              <strong class="text-amber font-mono">${suspect.name.toUpperCase()} (BREAKDOWN):</strong>
              <p class="mt-1">"${conf.suspectResponse}"</p>
            </div>
            <div class="fact-unlocked p-2.5 bg-green-900/30 rounded border border-green-500/40 text-xs text-green-300 font-mono">
              <i class="fa-solid fa-check-circle me-1"></i> CRITICAL FACT DISCOVERED: ${conf.revealsFact}
            </div>
          `;

          btn.disabled = true;
          btn.classList.add('opacity-50');

          onConfrontSuccess(suspect.id, clueId, conf);
        }
      });
    });
  }
}

const interrogationManager = new InterrogationManager();
