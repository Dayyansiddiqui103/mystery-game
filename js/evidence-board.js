/**
 * THE LAST SIGNAL - Interactive Evidence Board & Visual Connection Graph
 */

class EvidenceBoard {
  constructor() {
    this.selectedNodeId = null;
    this.connections = []; // [{ from, to }]
    this.unlockedDeductions = new Set();
  }

  render(containerEl, gameState, onDeductionUnlocked) {
    // Build node elements list from discovered items
    const collectedClues = CASE_DATA.clues.filter(c => gameState.collectedClues.has(c.id));
    const suspects = CASE_DATA.suspects;

    containerEl.innerHTML = `
      <div class="evidence-board-container glass-panel p-6 relative overflow-hidden min-h-[600px] flex flex-col justify-between">
        <!-- TOP TOOLBAR -->
        <div class="board-header flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-white/10 z-10">
          <div>
            <h3 class="font-serif text-xl font-bold text-amber flex items-center gap-2">
              <i class="fa-solid fa-diagram-project"></i> DETECTIVE EVIDENCE BOARD
            </h3>
            <p class="text-xs text-muted">Click two items to form a link line. Discover correct clue connections to unlock Deductions.</p>
          </div>
          <div class="flex gap-3">
            <button id="btnClearConnections" class="btn-secondary text-xs py-1.5 px-3">
              <i class="fa-solid fa-eraser me-1"></i> CLEAR LINKS
            </button>
          </div>
        </div>

        <!-- MAIN GRAPH CANVAS AREA -->
        <div class="board-canvas-area relative my-4 flex-1 min-h-[450px] bg-dark-deep/80 rounded-xl border border-white/5 overflow-hidden" id="boardCanvasArea">
          <!-- SVG CONNECTIONS OVERLAY -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" id="boardSvgLines"></svg>

          <!-- NODES GRID -->
          <div class="board-nodes-grid relative z-10 p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <!-- SUSPECT NODES -->
            ${suspects.map(s => `
              <div class="board-node suspect-node glass-card p-3 rounded-lg border border-cyan/30 text-center cursor-pointer transition-all hover:scale-105 select-none" data-nodeid="${s.id}" data-type="suspect">
                <img src="${s.avatar}" class="w-12 h-12 rounded-full mx-auto mb-2 object-cover border border-cyan">
                <div class="text-xs font-serif font-bold text-offwhite truncate">${s.name}</div>
                <div class="text-[10px] text-cyan font-mono">${s.role}</div>
              </div>
            `).join('')}

            <!-- CLUE NODES -->
            ${collectedClues.map(c => `
              <div class="board-node clue-node glass-card p-3 rounded-lg border border-amber-400/30 text-center cursor-pointer transition-all hover:scale-105 select-none" data-nodeid="${c.id}" data-type="clue">
                <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center mx-auto mb-2 text-amber text-sm">
                  <i class="fa-solid ${c.icon}"></i>
                </div>
                <div class="text-xs font-serif font-bold text-offwhite truncate">${c.name}</div>
                <div class="text-[10px] text-amber/80 font-mono">${c.importance}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- DEDUCTIONS UNLOCKED PANEL -->
        <div class="deductions-panel border-t border-white/10 pt-4 z-10">
          <h4 class="font-serif text-sm text-purple-400 mb-2 flex items-center gap-2">
            <i class="fa-solid fa-brain"></i> UNLOCKED DEDUCTIONS (<span id="deductionCount">${this.unlockedDeductions.size}</span>/4)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="deductionsList">
            ${Array.from(this.unlockedDeductions).map(dedId => {
              const ded = CASE_DATA.boardConnections.find(bc => bc.id === dedId);
              if (!ded) return '';
              return `
                <div class="p-3 bg-purple-900/20 border border-purple-500/40 rounded-lg text-xs animate-fadeIn">
                  <div class="font-serif font-bold text-purple-300 flex justify-between">
                    <span>${ded.deductionTitle}</span>
                    <span class="text-amber">+${ded.progressBonus}% PROGRESS</span>
                  </div>
                  <p class="text-offwhite/80 mt-1">${ded.deductionText}</p>
                </div>
              `;
            }).join('') || '<div class="text-xs text-muted italic col-span-2">No deductions unlocked yet. Connect clues and suspects on the board above.</div>'}
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(containerEl, gameState, onDeductionUnlocked);
    setTimeout(() => this.drawLines(containerEl), 100);
  }

  attachEventListeners(containerEl, gameState, onDeductionUnlocked) {
    const nodes = containerEl.querySelectorAll('.board-node');
    const svg = containerEl.querySelector('#boardSvgLines');

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        soundManager.playClick();
        const nodeId = node.dataset.nodeid;

        if (!this.selectedNodeId) {
          // First node selection
          this.selectedNodeId = nodeId;
          node.classList.add('node-selected', 'border-amber-400', 'ring-2', 'ring-amber-400');
        } else if (this.selectedNodeId === nodeId) {
          // Deselect same node
          this.selectedNodeId = null;
          node.classList.remove('node-selected', 'border-amber-400', 'ring-2', 'ring-amber-400');
        } else {
          // Connect node A and node B
          const from = this.selectedNodeId;
          const to = nodeId;

          // Clear previous outline
          const prevNode = containerEl.querySelector(`.board-node[data-nodeid="${from}"]`);
          if (prevNode) prevNode.classList.remove('node-selected', 'border-amber-400', 'ring-2', 'ring-amber-400');

          this.selectedNodeId = null;

          // Check if connection already exists
          const exists = this.connections.some(c => (c.from === from && c.to === to) || (c.from === to && c.to === from));
          if (!exists) {
            this.connections.push({ from, to });
            soundManager.playKeypress();
            this.drawLines(containerEl);

            // Check if connection unlocks a deduction
            this.checkDeduction(from, to, gameState, onDeductionUnlocked);
          }
        }
      });
    });

    containerEl.querySelector('#btnClearConnections').addEventListener('click', () => {
      soundManager.playClick();
      this.connections = [];
      this.drawLines(containerEl);
    });
  }

  drawLines(containerEl) {
    const svg = containerEl.querySelector('#boardSvgLines');
    const canvasArea = containerEl.querySelector('#boardCanvasArea');
    if (!svg || !canvasArea) return;

    const rect = canvasArea.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = '';

    this.connections.forEach(conn => {
      const elA = containerEl.querySelector(`.board-node[data-nodeid="${conn.from}"]`);
      const elB = containerEl.querySelector(`.board-node[data-nodeid="${conn.to}"]`);

      if (elA && elB) {
        const rA = elA.getBoundingClientRect();
        const rB = elB.getBoundingClientRect();

        const x1 = rA.left + rA.width / 2 - rect.left;
        const y1 = rA.top + rA.height / 2 - rect.top;
        const x2 = rB.left + rB.width / 2 - rect.left;
        const y2 = rB.top + rB.height / 2 - rect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#ffb703');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('class', 'animate-pulse');

        svg.appendChild(line);
      }
    });
  }

  checkDeduction(from, to, gameState, onDeductionUnlocked) {
    CASE_DATA.boardConnections.forEach(bc => {
      const match1 = (bc.nodeA === from && bc.nodeB === to) || (bc.nodeA === to && bc.nodeB === from);
      if (match1 && !this.unlockedDeductions.has(bc.id)) {
        soundManager.playClueDiscovered();
        this.unlockedDeductions.add(bc.id);
        onDeductionUnlocked(bc);
      }
    });
  }
}

const evidenceBoard = new EvidenceBoard();
