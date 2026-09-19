/**
 * THE LAST SIGNAL - Interactive Mini-Game Puzzles Logic
 */

class PuzzleManager {
  constructor() {
    this.keypadInput = "";
    this.cipherShift = 0;
    this.scannerSpotsFound = new Set();
  }

  // --- PUZZLE 1: KEYPAD ---
  initKeypad(containerEl, onSolved) {
    this.keypadInput = "";
    containerEl.innerHTML = `
      <div class="puzzle-card glass-panel text-center">
        <div class="puzzle-header mb-3">
          <i class="fa-solid fa-calculator text-amber text-2xl mb-2"></i>
          <h3 class="font-serif text-xl">SECURITY TERMINAL ACCESS KEYPAD</h3>
          <p class="text-xs text-muted">Enter 4-digit master access authorization pin.</p>
          <div class="hint-box mt-2 p-2 rounded border border-amber-500/20 bg-amber-500/5 text-amber text-xs">
            <i class="fa-solid fa-lightbulb me-1"></i> Hint: Lab Anniversary (04/17) + Sector 23.
          </div>
        </div>

        <div class="keypad-display my-4 p-3 bg-dark-deep rounded font-mono text-2xl text-cyan tracking-widest border border-cyan/30" id="keypadDisplay">
          ____
        </div>

        <div class="keypad-grid grid grid-cols-3 gap-3 max-w-xs mx-auto mb-4">
          ${[1,2,3,4,5,6,7,8,9,'CLR',0,'OK'].map(val => `
            <button class="btn-keypad ${typeof val === 'number' ? 'btn-num' : (val==='CLR'?'btn-clr':'btn-ok')}" data-val="${val}">
              ${val}
            </button>
          `).join('')}
        </div>
        <div id="keypadFeedback" class="text-xs font-mono h-5 text-red-400"></div>
      </div>
    `;

    const display = containerEl.querySelector('#keypadDisplay');
    const feedback = containerEl.querySelector('#keypadFeedback');

    const updateDisplay = () => {
      display.textContent = this.keypadInput.padEnd(4, '_');
    };

    containerEl.querySelectorAll('.btn-keypad').forEach(btn => {
      btn.addEventListener('click', () => {
        soundManager.playKeypress();
        const val = btn.dataset.val;
        if (val === 'CLR') {
          this.keypadInput = "";
          feedback.textContent = "";
        } else if (val === 'OK') {
          if (this.keypadInput === CASE_DATA.puzzles[0].solution) {
            soundManager.playSuccess();
            feedback.className = "text-xs font-mono text-green-400 font-bold";
            feedback.textContent = "ACCESS GRANTED. AUTHORIZATION CONFIRMED.";
            setTimeout(() => onSolved('puzzle_keypad', CASE_DATA.puzzles[0].clueIdYield), 1000);
          } else {
            soundManager.playError();
            feedback.className = "text-xs font-mono text-red-400 animate-shake";
            feedback.textContent = "INVALID PASSCODE. ACCESS DENIED.";
            this.keypadInput = "";
          }
        } else {
          if (this.keypadInput.length < 4) {
            this.keypadInput += val;
          }
        }
        updateDisplay();
      });
    });
  }

  // --- PUZZLE 2: CIPHER DECODER ---
  initCipher(containerEl, onSolved) {
    this.cipherShift = 0;
    const ciphertext = CASE_DATA.puzzles[1].ciphertext;

    const decodeText = (str, shift) => {
      return str.split('').map(char => {
        if (char >= 'A' && char <= 'Z') {
          let code = char.charCodeAt(0) - 65;
          code = (code - shift + 26) % 26;
          return String.fromCharCode(code + 65);
        }
        return char;
      }).join('');
    };

    containerEl.innerHTML = `
      <div class="puzzle-card glass-panel">
        <div class="puzzle-header text-center mb-3">
          <i class="fa-solid fa-lock text-cyan text-2xl mb-2"></i>
          <h3 class="font-serif text-xl">PARCHMENT CIPHER DECRYPTOR</h3>
          <p class="text-xs text-muted">Adjust the shift frequency slider to decode the encryption layer.</p>
        </div>

        <div class="cipher-box p-4 bg-dark-deep rounded border border-cyan/20 my-4 text-center">
          <div class="text-xs text-muted mb-1 font-mono">ENCRYPTED INPUT:</div>
          <div class="text-lg font-mono text-amber mb-3 tracking-widest">${ciphertext}</div>
          
          <div class="text-xs text-muted mb-1 font-mono">DECODED OUTPUT:</div>
          <div class="text-xl font-mono text-cyan font-bold tracking-widest" id="cipherOutput">
            ${decodeText(ciphertext, 0)}
          </div>
        </div>

        <div class="cipher-controls p-3 bg-dark-surface rounded border border-white/5 my-3">
          <label class="block text-xs font-mono text-muted mb-2 text-center">
            SHIFT OFFSET: <span id="shiftValue" class="text-amber font-bold">0</span>
          </label>
          <input type="range" id="shiftSlider" min="0" max="25" value="0" class="w-full accent-cyan cursor-pointer">
        </div>

        <div class="text-center mt-4">
          <button id="btnSubmitCipher" class="btn-primary py-2 px-6">
            <i class="fa-solid fa-unlock me-2"></i>SUBMIT DECRYPTION
          </button>
          <div id="cipherFeedback" class="text-xs font-mono mt-2 h-5"></div>
        </div>
      </div>
    `;

    const slider = containerEl.querySelector('#shiftSlider');
    const shiftVal = containerEl.querySelector('#shiftValue');
    const output = containerEl.querySelector('#cipherOutput');
    const feedback = containerEl.querySelector('#cipherFeedback');

    slider.addEventListener('input', (e) => {
      soundManager.playKeypress();
      this.cipherShift = parseInt(e.target.value);
      shiftVal.textContent = this.cipherShift;
      output.textContent = decodeText(ciphertext, this.cipherShift);
    });

    containerEl.querySelector('#btnSubmitCipher').addEventListener('click', () => {
      const decoded = decodeText(ciphertext, this.cipherShift);
      if (decoded === CASE_DATA.puzzles[1].solution) {
        soundManager.playSuccess();
        feedback.className = "text-xs font-mono text-green-400 font-bold";
        feedback.textContent = "CIPHER SOLVED: 'THE OBSERVATORY KNOWS'";
        setTimeout(() => onSolved('puzzle_cipher', CASE_DATA.puzzles[1].clueIdYield), 1200);
      } else {
        soundManager.playError();
        feedback.className = "text-xs font-mono text-red-400";
        feedback.textContent = "INCORRECT DECRYPTION. TEXT REMAINS GIBBERISH.";
      }
    });
  }

  // --- PUZZLE 3: DOCUMENT SCANNER ---
  initScanner(containerEl, onSolved) {
    this.scannerSpotsFound.clear();
    const totalSpots = 3;

    containerEl.innerHTML = `
      <div class="puzzle-card glass-panel">
        <div class="puzzle-header text-center mb-3">
          <i class="fa-solid fa-fingerprint text-purple-400 text-2xl mb-2"></i>
          <h3 class="font-serif text-xl">UV SPECTRUM DOCUMENT SCANNER</h3>
          <p class="text-xs text-muted">Adjust UV Wavelength slider to 365nm to excite thermal ink, then click all 3 redacted spots.</p>
        </div>

        <div class="scanner-controls p-3 bg-dark-surface rounded border border-white/5 my-3">
          <div class="flex justify-between text-xs font-mono text-muted mb-1">
            <span>UV FREQUENCY:</span>
            <span id="uvValue" class="text-purple-400 font-bold">200 nm</span>
          </div>
          <input type="range" id="uvSlider" min="200" max="450" value="200" class="w-full accent-purple-500 cursor-pointer">
        </div>

        <div class="document-preview p-4 bg-dark-deep rounded border border-purple-500/20 my-4 relative font-serif text-sm leading-relaxed select-none" id="docPreview">
          <p class="mb-2"><strong>CONFIDENTIAL AGREEMENT - PROJECT AETHER</strong></p>
          <p class="mb-2">This document establishes that Dr. Elias Vale hereby transfers exclusive intellectual rights of Quantum Receiver Telemetry to AETHER Corp.</p>
          <p class="mb-2">
            Section 4: Indemnification and <span class="redact-spot redact-1 cursor-pointer bg-black/80 px-2 py-0.5 rounded border border-dashed border-red-500/40 text-transparent transition-all" data-id="1">forceful patent acquisition</span> in the event of non-compliance.
          </p>
          <p class="mb-2">
            Section 7: Retainer of <span class="redact-spot redact-2 cursor-pointer bg-black/80 px-2 py-0.5 rounded border border-dashed border-red-500/40 text-transparent transition-all" data-id="2">$5,000,000 buyout terms</span> deposited into private escrow.
          </p>
          <p>
            Authorized Signature: <span class="redact-spot redact-3 cursor-pointer bg-black/80 px-2 py-0.5 rounded border border-dashed border-red-500/40 text-transparent transition-all" data-id="3">Victor Hale - Corporate Director</span>
          </p>
        </div>

        <div class="flex justify-between items-center text-xs font-mono">
          <div class="text-muted">SPOTS REVEALED: <span id="spotsCount" class="text-amber font-bold">0 / 3</span></div>
          <div id="scannerFeedback" class="h-5 text-green-400 font-bold"></div>
        </div>
      </div>
    `;

    const uvSlider = containerEl.querySelector('#uvSlider');
    const uvValue = containerEl.querySelector('#uvValue');
    const docPreview = containerEl.querySelector('#docPreview');
    const spotsCount = containerEl.querySelector('#spotsCount');
    const feedback = containerEl.querySelector('#scannerFeedback');

    let currentUv = 200;

    uvSlider.addEventListener('input', (e) => {
      soundManager.playKeypress();
      currentUv = parseInt(e.target.value);
      uvValue.textContent = `${currentUv} nm`;

      if (currentUv >= 355 && currentUv <= 375) {
        docPreview.classList.add('uv-active');
        uvValue.className = "text-green-400 font-bold animate-pulse";
      } else {
        docPreview.classList.remove('uv-active');
        uvValue.className = "text-purple-400 font-bold";
      }
    });

    containerEl.querySelectorAll('.redact-spot').forEach(spot => {
      spot.addEventListener('click', () => {
        if (currentUv >= 355 && currentUv <= 375) {
          const id = spot.dataset.id;
          if (!this.scannerSpotsFound.has(id)) {
            soundManager.playClueDiscovered();
            this.scannerSpotsFound.add(id);
            spot.classList.remove('text-transparent', 'bg-black/80');
            spot.classList.add('bg-purple-900/50', 'text-amber', 'border-amber-400');
            spotsCount.textContent = `${this.scannerSpotsFound.size} / ${totalSpots}`;

            if (this.scannerSpotsFound.size === totalSpots) {
              soundManager.playSuccess();
              feedback.textContent = "DOCUMENT REDACTIONS FULLY EXPOSED!";
              setTimeout(() => onSolved('puzzle_scanner', CASE_DATA.puzzles[2].clueIdYield), 1200);
            }
          }
        } else {
          soundManager.playError();
          feedback.textContent = "CALIBRATE UV FREQUENCY FIRST!";
          setTimeout(() => feedback.textContent = "", 1500);
        }
      });
    });
  }
}

const puzzleManager = new PuzzleManager();
