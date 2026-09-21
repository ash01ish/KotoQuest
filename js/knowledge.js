// js/knowledge.js
// Controller for the Japanese Knowledge Hub: Survival Japanese, Counters,
// Grammar Formulas, Cultural Etiquette, and Keigo Demystified.
// 100% offline, full 8-language parity (en, te, hi, ta, ko, es, kn, ml).

(function () {
    'use strict';

    let currentSection = 'phrases';
    let currentPhraseCategory = 'all';
    let selectedCounterId = 'tsu';
    let selectedCounterNum = 1;
    let selectedScenarioId = 'ramen';
    let scenarioCurrentStep = 0;
    let scenarioHistory = [];
    let currentSlangTab = 'tropes';
    let searchQuery = '';

    function getNativeCode() {
        if (typeof LANG_PACK_CODES !== 'undefined' && typeof player !== 'undefined') {
            return LANG_PACK_CODES[player.nativeLanguage] || 'en';
        }
        return 'en';
    }

    function renderKnowledgeHub() {
        if (typeof window.markDailyMission === 'function') {
            window.markDailyMission('knowledge');
        }

        const root = document.getElementById('knowledge');
        if (!root) return;

        const kb = window.KNOWLEDGE_BASE;
        if (!kb) {
            root.innerHTML = '<div class="glass-card"><p style="color:var(--text-muted); text-align:center; padding: 40px 0;">Loading Knowledge Hub...</p></div>';
            return;
        }

        const nativeCode = getNativeCode();

        root.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'glass-card knowledge-hub-container';

        // Header
        const header = document.createElement('div');
        header.className = 'knowledge-header';
        header.innerHTML = `
            <div class="card-title" style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-lightbulb" style="color: var(--accent-gold);"></i>
                <span>Japanese Knowledge Hub (日本語の知恵)</span>
            </div>
            <p class="practice-intro" style="margin-top: 6px;">
                Authentic, practical Japanese knowledge for everyday life, travel, and fluency. Learn natural expressions with audio, master tricky counters, explore grammar cheat sheets, and understand cultural etiquette.
            </p>
        `;
        container.appendChild(header);

        // Search Bar
        const searchWrap = document.createElement('div');
        searchWrap.className = 'knowledge-search-wrap';
        searchWrap.style.cssText = 'margin: 16px 0; display: flex; gap: 10px;';
        searchWrap.innerHTML = `
            <div style="position: relative; flex: 1;">
                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
                <input type="text" id="knowledge-search-input" class="knowledge-search-input"
                       placeholder="Search phrases, counters, particles, etiquette... (e.g. coffee, ticket, は, onsen)"
                       value="${searchQuery}"
                       style="width: 100%; padding: 10px 14px 10px 38px; border-radius: 8px; border: 1px solid var(--border-color, rgba(255,255,255,0.15)); background: rgba(0,0,0,0.25); color: #fff; font-size: 0.95rem;">
            </div>
        `;
        container.appendChild(searchWrap);

        // Sub-Navigation Pills
        const navPills = document.createElement('div');
        navPills.className = 'knowledge-nav-pills';
        navPills.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;';

        const sections = [
            { id: 'phrases', icon: 'fa-comments', label: 'Survival Japanese' },
            { id: 'counters', icon: 'fa-calculator', label: 'Essential Counters' },
            { id: 'scenarios', icon: 'fa-street-view', label: 'Life in Japan Simulator' },
            { id: 'slang', icon: 'fa-bolt', label: 'Anime vs. Reality & Slang' },
            { id: 'pitch', icon: 'fa-wave-square', label: 'Pitch Accent & Ear-Training' },
            { id: 'grammar', icon: 'fa-book-bookmark', label: 'Grammar Cheat Sheet' },
            { id: 'etiquette', icon: 'fa-torii-gate', label: 'Cultural Etiquette' },
            { id: 'keigo', icon: 'fa-user-tie', label: 'Keigo Demystified' }
        ];

        sections.forEach(sec => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn knowledge-pill-btn' + (currentSection === sec.id ? ' active' : '');
            btn.style.cssText = `padding: 8px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid ${currentSection === sec.id ? 'var(--accent-teal, #20bf6b)' : 'rgba(255,255,255,0.15)'}; background: ${currentSection === sec.id ? 'rgba(32,191,107,0.2)' : 'rgba(255,255,255,0.05)'}; color: ${currentSection === sec.id ? 'var(--accent-teal, #20bf6b)' : 'var(--text-color, #fff)'};`;
            btn.innerHTML = `<i class="fa-solid ${sec.icon}"></i> ${sec.label}`;
            btn.onclick = () => {
                currentSection = sec.id;
                renderKnowledgeHub();
            };
            navPills.appendChild(btn);
        });
        container.appendChild(navPills);

        // Main Content Area
        const contentArea = document.createElement('div');
        contentArea.className = 'knowledge-content-area';

        if (currentSection === 'phrases') {
            renderPhrasesSection(contentArea, kb.phrases, nativeCode);
        } else if (currentSection === 'counters') {
            renderCountersSection(contentArea, kb.counters, nativeCode);
        } else if (currentSection === 'scenarios') {
            renderScenariosSection(contentArea, kb.scenarios, nativeCode);
        } else if (currentSection === 'slang') {
            renderSlangSection(contentArea, kb.slang, nativeCode);
        } else if (currentSection === 'pitch') {
            renderPitchSection(contentArea, kb.pitch, nativeCode);
        } else if (currentSection === 'grammar') {
            renderGrammarSection(contentArea, kb.grammar, nativeCode);
        } else if (currentSection === 'etiquette') {
            renderEtiquetteSection(contentArea, kb.etiquette, nativeCode);
        } else if (currentSection === 'keigo') {
            renderKeigoSection(contentArea, kb.keigo, nativeCode);
        }

        container.appendChild(contentArea);
        root.appendChild(container);

        // Search Input Listener
        const searchInput = document.getElementById('knowledge-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderKnowledgeHub();
            });
        }
    }

    // ---- 1. SURVIVAL PHRASES ----
    function renderPhrasesSection(container, phrasesMap, nativeCode) {
        // Category filters
        const cats = [
            { id: 'all', label: 'All Phrases' },
            { id: 'greetings', label: 'Greetings & Daily' },
            { id: 'dining', label: 'Dining & Izakaya' },
            { id: 'shopping', label: 'Shopping & Konbini' },
            { id: 'travel', label: 'Travel & Stations' },
            { id: 'emergency', label: 'Emergencies' }
        ];

        const catBar = document.createElement('div');
        catBar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;';
        cats.forEach(c => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn' + (currentPhraseCategory === c.id ? ' active' : '');
            b.style.cssText = `padding: 4px 10px; border-radius: 12px; font-size: 0.78rem; cursor: pointer; border: 1px solid ${currentPhraseCategory === c.id ? 'var(--accent-gold, #f39c12)' : 'rgba(255,255,255,0.1)'}; background: ${currentPhraseCategory === c.id ? 'rgba(243,156,18,0.2)' : 'transparent'}; color: ${currentPhraseCategory === c.id ? 'var(--accent-gold, #f39c12)' : 'var(--text-muted, #aaa)'};`;
            b.textContent = c.label;
            b.onclick = () => {
                currentPhraseCategory = c.id;
                renderKnowledgeHub();
            };
            catBar.appendChild(b);
        });
        container.appendChild(catBar);

        // Filter phrases
        let list = [];
        Object.keys(phrasesMap).forEach(catKey => {
            if (currentPhraseCategory === 'all' || currentPhraseCategory === catKey) {
                phrasesMap[catKey].forEach(p => {
                    if (!searchQuery) {
                        list.push(p);
                    } else {
                        const match = (p.ja && p.ja.toLowerCase().includes(searchQuery)) ||
                                      (p.romaji && p.romaji.toLowerCase().includes(searchQuery)) ||
                                      (p.en && p.en.toLowerCase().includes(searchQuery)) ||
                                      (p[nativeCode] && p[nativeCode].toLowerCase().includes(searchQuery)) ||
                                      (p.note && p.note.toLowerCase().includes(searchQuery));
                        if (match) list.push(p);
                    }
                });
            }
        });

        if (!list.length) {
            container.innerHTML += '<p style="color:var(--text-muted); padding: 20px 0; text-align:center;">No phrases matched your search.</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px;';

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'knowledge-card';
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; transition: transform 0.2s;';

            const nativeText = p[nativeCode] || p.en;

            card.innerHTML = `
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                        <div style="font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: 0.05em;">${p.ja}</div>
                        <button type="button" class="btn speak-phrase-btn" style="background: rgba(32,191,107,0.15); border: 1px solid rgba(32,191,107,0.3); color: var(--accent-teal, #20bf6b); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;" title="Listen to pronunciation">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--accent-gold, #f39c12); margin-top: 2px;">${p.romaji}</div>
                    <div style="font-size: 0.9rem; color: #ddd; margin-top: 6px; font-weight: 500;">${p.en}</div>
                    ${nativeCode !== 'en' && p[nativeCode] ? `<div style="font-size: 0.85rem; color: var(--accent-pink, #ff7675); margin-top: 2px;">${p[nativeCode]}</div>` : ''}
                </div>
                ${p.note ? `<div style="font-size: 0.78rem; color: var(--text-muted, #999); border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 6px;"><i class="fa-solid fa-circle-info" style="color: var(--accent-teal);"></i> ${p.note}</div>` : ''}
            `;

            const btn = card.querySelector('.speak-phrase-btn');
            if (btn) {
                btn.onclick = () => {
                    if (typeof speakJapanese === 'function') speakJapanese(p.ja, 0.9);
                };
            }
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // ---- 2. ESSENTIAL COUNTERS ----
    function renderCountersSection(container, countersList, nativeCode) {
        // Calculator & Lookup Box
        const calcCard = document.createElement('div');
        calcCard.className = 'knowledge-calc-card';
        calcCard.style.cssText = 'background: rgba(32,191,107,0.06); border: 1px solid rgba(32,191,107,0.2); border-radius: 12px; padding: 16px; margin-bottom: 20px;';

        calcCard.innerHTML = `
            <div style="font-size: 1.05rem; font-weight: 700; color: var(--accent-teal); display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <i class="fa-solid fa-calculator"></i> Interactive Counter Finder
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                Select a counter type and number to hear the authentic pronunciation and see phonetic shifts.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                <div>
                    <label style="font-size: 0.8rem; color: #aaa; display: block; margin-bottom: 4px;">Counter Type:</label>
                    <select id="counter-select" style="padding: 8px 12px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 0.9rem;">
                        ${countersList.map(c => `<option value="${c.id}" ${c.id === selectedCounterId ? 'selected' : ''}>${c.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.8rem; color: #aaa; display: block; margin-bottom: 4px;">Quantity (1-10):</label>
                    <div style="display: flex; gap: 4px;" id="counter-num-buttons">
                        ${[1,2,3,4,5,6,7,8,9,10].map(n => `
                            <button type="button" class="btn counter-num-btn" data-n="${n}" style="padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid ${n === selectedCounterNum ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}; background: ${n === selectedCounterNum ? 'rgba(243,156,18,0.25)' : 'transparent'}; color: ${n === selectedCounterNum ? 'var(--accent-gold)' : '#fff'};">${n}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div id="counter-result-box" style="margin-top: 16px; padding: 14px; border-radius: 8px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between;">
                <!-- Filled dynamically below -->
            </div>
        `;

        container.appendChild(calcCard);

        const sel = calcCard.querySelector('#counter-select');
        const numBtns = calcCard.querySelectorAll('.counter-num-btn');
        const resBox = calcCard.querySelector('#counter-result-box');

        function updateCalcResult() {
            const currentCounter = countersList.find(c => c.id === selectedCounterId) || countersList[0];
            const item = currentCounter.items.find(it => it.n === selectedCounterNum) || currentCounter.items[0];

            resBox.innerHTML = `
                <div>
                    <div style="display: flex; align-items: baseline; gap: 10px;">
                        <span style="font-size: 1.8rem; font-weight: 800; color: #fff;">${item.kanji}</span>
                        <span style="font-size: 1.2rem; font-weight: 600; color: var(--accent-gold);">${item.ja}</span>
                        <span style="font-size: 0.9rem; color: #aaa;">(${item.romaji})</span>
                    </div>
                    <div style="font-size: 0.9rem; color: #ddd; margin-top: 4px;">${item.en}</div>
                    <div style="font-size: 0.8rem; color: var(--accent-teal); margin-top: 2px;">
                        ${currentCounter['desc_' + nativeCode] || currentCounter.desc}
                    </div>
                </div>
                <button type="button" class="btn speak-calc-btn" style="background: var(--accent-teal); color: #000; border: none; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.1rem;" title="Listen">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            `;

            const speakBtn = resBox.querySelector('.speak-calc-btn');
            if (speakBtn) {
                speakBtn.onclick = () => {
                    if (typeof speakJapanese === 'function') speakJapanese(item.ja, 0.85);
                };
            }
        }

        sel.onchange = (e) => {
            selectedCounterId = e.target.value;
            updateCalcResult();
        };

        numBtns.forEach(btn => {
            btn.onclick = () => {
                selectedCounterNum = parseInt(btn.getAttribute('data-n'), 10);
                numBtns.forEach(b => {
                    const isCur = parseInt(b.getAttribute('data-n'), 10) === selectedCounterNum;
                    b.style.borderColor = isCur ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)';
                    b.style.background = isCur ? 'rgba(243,156,18,0.25)' : 'transparent';
                    b.style.color = isCur ? 'var(--accent-gold)' : '#fff';
                });
                updateCalcResult();
            };
        });

        updateCalcResult();

        // Counter Tables Grid
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;';

        countersList.forEach(c => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
            const desc = c['desc_' + nativeCode] || c.desc;

            card.innerHTML = `
                <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 4px;">${c.name}</div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">${desc}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.85rem;">
                    ${c.items.map(it => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 6px; background: rgba(0,0,0,0.15);">
                            <div>
                                <span style="font-weight: 700; color: #fff;">${it.kanji}</span>
                                <span style="color: var(--accent-gold); font-size: 0.78rem;">${it.ja}</span>
                            </div>
                            <button type="button" class="btn speak-it-btn" style="background: transparent; border: none; color: var(--accent-teal); cursor: pointer; padding: 2px;" data-speak="${it.ja}">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;

            card.querySelectorAll('.speak-it-btn').forEach(b => {
                b.onclick = () => {
                    if (typeof speakJapanese === 'function') speakJapanese(b.getAttribute('data-speak'), 0.85);
                };
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // ---- 3. GRAMMAR CHEAT SHEET ----
    function renderGrammarSection(container, grammarData, nativeCode) {
        // Particles Guide
        const pHeader = document.createElement('div');
        pHeader.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-purple, #a55eea); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-link"></i> Particle Master Guide (助詞)
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                Contrastive rules and clear examples to permanently fix common particle mix-ups.
            </p>
        `;
        container.appendChild(pHeader);

        const pGrid = document.createElement('div');
        pGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; margin-bottom: 24px;';

        (grammarData.particles || []).forEach(p => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
            const ruleText = p['rule_' + nativeCode] || p.rule_en;
            const exNative = p['example_native_' + nativeCode];

            card.innerHTML = `
                <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">${p.pair}</div>
                <div style="font-size: 0.85rem; color: #ddd; line-height: 1.4; margin-bottom: 10px;">${ruleText}</div>
                <div style="background: rgba(0,0,0,0.2); border-left: 3px solid var(--accent-teal); padding: 8px 10px; border-radius: 0 6px 6px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: #fff; font-size: 0.9rem;">${p.example_ja}</span>
                        <button type="button" class="btn speak-ex-btn" style="background: transparent; border: none; color: var(--accent-teal); cursor: pointer;" data-speak="${p.example_ja}">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                    <div style="font-size: 0.8rem; color: #aaa; margin-top: 2px;">${p.example_en}</div>
                    ${exNative ? `<div style="font-size: 0.8rem; color: var(--accent-pink); margin-top: 2px;">${exNative}</div>` : ''}
                </div>
            `;

            const btn = card.querySelector('.speak-ex-btn');
            if (btn) {
                btn.onclick = () => {
                    if (typeof speakJapanese === 'function') speakJapanese(btn.getAttribute('data-speak'), 0.85);
                };
            }
            pGrid.appendChild(card);
        });
        container.appendChild(pGrid);

        // Verb Conjugation Matrix
        const cHeader = document.createElement('div');
        cHeader.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-teal); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-gears"></i> Verb Conjugation Rules (動詞の活用)
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 14px;">
                Step-by-step transformation formulas across Godan, Ichidan, and Irregular verbs.
            </p>
        `;
        container.appendChild(cHeader);

        const cGrid = document.createElement('div');
        cGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px;';

        (grammarData.conjugations || []).forEach(c => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
            card.innerHTML = `
                <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 4px;">${c.form}</div>
                <p style="font-size: 0.82rem; color: var(--accent-gold); margin-bottom: 10px;">${c.desc_en}</p>
                <ul style="margin: 0; padding-left: 18px; font-size: 0.82rem; color: #ddd; display: flex; flex-direction: column; gap: 6px;">
                    ${c.rules.map(r => `<li>${r}</li>`).join('')}
                </ul>
            `;
            cGrid.appendChild(card);
        });
        container.appendChild(cGrid);
    }

    // ---- 4. CULTURAL ETIQUETTE ----
    function renderEtiquetteSection(container, etiquetteList, nativeCode) {
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px;';

        etiquetteList.forEach(e => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px;';
            const desc = e[nativeCode] || e.en;

            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 1.8rem;">${e.icon}</span>
                    <div style="font-size: 1.15rem; font-weight: 700; color: #fff;">${e.title}</div>
                </div>
                <p style="font-size: 0.88rem; color: #ddd; margin-bottom: 12px; line-height: 1.4;">${desc}</p>
                <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 10px 12px;">
                    <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">Key Guidelines:</div>
                    <ul style="margin: 0; padding-left: 16px; font-size: 0.82rem; color: #bbb; display: flex; flex-direction: column; gap: 4px;">
                        ${e.points.map(pt => `<li>${pt}</li>`).join('')}
                    </ul>
                </div>
            `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // ---- 5. KEIGO DEMYSTIFIED ----
    function renderKeigoSection(container, keigoData, nativeCode) {
        const intro = keigoData['intro_' + nativeCode] || keigoData.intro_en;

        const introCard = document.createElement('div');
        introCard.style.cssText = 'background: rgba(165,94,234,0.08); border: 1px solid rgba(165,94,234,0.25); border-radius: 12px; padding: 16px; margin-bottom: 20px;';
        introCard.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-purple); display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <i class="fa-solid fa-user-tie"></i> Understanding the 3 Tiers of Keigo (敬語)
            </div>
            <p style="font-size: 0.9rem; color: #ddd; line-height: 1.4; margin-bottom: 12px;">${intro}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.85rem;">
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border-top: 3px solid #20bf6b;">
                    <div style="font-weight: 700; color: #20bf6b; margin-bottom: 2px;">1. 丁寧語 (Teineigo)</div>
                    <div style="color: #bbb;">Polite speech using です / ます. General politeness to strangers and peers.</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border-top: 3px solid #f39c12;">
                    <div style="font-weight: 700; color: #f39c12; margin-bottom: 2px;">2. 尊敬語 (Sonkeigo)</div>
                    <div style="color: #bbb;">Honorific speech. Elevates the actions of the customer, boss, or elder.</div>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border-top: 3px solid #eb3b5a;">
                    <div style="font-weight: 700; color: #eb3b5a; margin-bottom: 2px;">3. 謙譲語 (Kenjougo)</div>
                    <div style="color: #bbb;">Humble speech. Lowers your own actions to show humility and deference.</div>
                </div>
            </div>
        `;
        container.appendChild(introCard);

        // Verbs Conversion Table
        const tableWrap = document.createElement('div');
        tableWrap.style.cssText = 'overflow-x: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2);';

        tableWrap.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                <thead>
                    <tr style="background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.1); color: #fff;">
                        <th style="padding: 10px 12px;">Meaning</th>
                        <th style="padding: 10px 12px;">Plain Form (辞書形)</th>
                        <th style="padding: 10px 12px; color: #20bf6b;">Teineigo (丁寧語)</th>
                        <th style="padding: 10px 12px; color: #f39c12;">Sonkeigo (尊敬語)</th>
                        <th style="padding: 10px 12px; color: #eb3b5a;">Kenjougo (謙譲語)</th>
                    </tr>
                </thead>
                <tbody>
                    ${(keigoData.verbs || []).map((v, i) => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); ${i % 2 === 1 ? 'background: rgba(255,255,255,0.02);' : ''}">
                            <td style="padding: 10px 12px; font-weight: 600; color: #ddd;">${v.meaning}</td>
                            <td style="padding: 10px 12px; color: #fff;">${v.plain}</td>
                            <td style="padding: 10px 12px; color: #20bf6b; font-weight: 600;">${v.teineigo}</td>
                            <td style="padding: 10px 12px; color: #f39c12; font-weight: 600;">${v.sonkeigo}</td>
                            <td style="padding: 10px 12px; color: #eb3b5a; font-weight: 600;">${v.kenjougo}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        container.appendChild(tableWrap);
    }

    // ---- 6. SCENARIOS (Life in Japan Simulator) ----
    function renderScenariosSection(container, scenariosList, nativeCode) {
        if (!scenariosList || !scenariosList.length) {
            container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px 0;">No scenarios available.</p>';
            return;
        }

        const scenario = scenariosList.find(s => s.id === selectedScenarioId) || scenariosList[0];

        // Scenario Selector Bar
        const bar = document.createElement('div');
        bar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;';
        scenariosList.forEach(s => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn' + (s.id === scenario.id ? ' active' : '');
            b.style.cssText = `padding: 6px 14px; border-radius: 14px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid ${s.id === scenario.id ? 'var(--accent-teal, #20bf6b)' : 'rgba(255,255,255,0.1)'}; background: ${s.id === scenario.id ? 'rgba(32,191,107,0.2)' : 'transparent'}; color: ${s.id === scenario.id ? 'var(--accent-teal, #20bf6b)' : '#aaa'};`;
            b.innerHTML = `<i class="fa-solid ${s.icon}"></i> ${s.title.split(' (')[0]}`;
            b.onclick = () => {
                selectedScenarioId = s.id;
                scenarioCurrentStep = 0;
                scenarioHistory = [];
                renderKnowledgeHub();
            };
            bar.appendChild(b);
        });
        container.appendChild(bar);

        // Header info
        const info = document.createElement('div');
        info.style.cssText = 'background: rgba(32,191,107,0.06); border: 1px solid rgba(32,191,107,0.2); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;';
        info.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid ${scenario.icon}" style="color: var(--accent-teal, #20bf6b);"></i>
                <span>${scenario.title}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">${scenario.desc}</p>
        `;
        container.appendChild(info);

        const steps = scenario.steps || [];
        if (scenarioCurrentStep >= steps.length) {
            // Scenario Complete Screen
            const comp = document.createElement('div');
            comp.style.cssText = 'text-align: center; padding: 30px 20px; background: rgba(0,0,0,0.3); border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);';
            const bestCount = scenarioHistory.filter(r => r === 'best').length;
            comp.innerHTML = `
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🎉</div>
                <div style="font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Scenario Completed!</div>
                <div style="font-size: 1rem; color: var(--accent-gold); margin-bottom: 16px;">
                    Score: <strong>${bestCount} / ${steps.length}</strong> Recommended Responses
                </div>
                <p style="font-size: 0.88rem; color: #bbb; max-width: 450px; margin: 0 auto 20px auto;">
                    ${bestCount === steps.length ? 'Outstanding! You navigated this scenario with authentic Japanese etiquette.' : 'Good effort! Review the nuance tips to master natural Japanese conversation.'}
                </p>
                <button type="button" class="btn btn-primary" id="btn-restart-scenario" style="padding: 8px 20px;">
                    <i class="fa-solid fa-rotate-left"></i> Replay Scenario
                </button>
            `;
            container.appendChild(comp);
            comp.querySelector('#btn-restart-scenario').onclick = () => {
                scenarioCurrentStep = 0;
                scenarioHistory = [];
                renderKnowledgeHub();
            };
            return;
        }

        const step = steps[scenarioCurrentStep];
        const stepCard = document.createElement('div');
        stepCard.className = 'scenario-step-card';
        stepCard.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 18px; margin-bottom: 16px;';

        const nativeNpc = step[nativeCode] || step.en;

        // Speaker box
        stepCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: rgba(243,156,18,0.2); border: 1px solid var(--accent-gold); color: var(--accent-gold); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 10px;">Step ${scenarioCurrentStep + 1} of ${steps.length}</span>
                    <span style="font-size: 0.9rem; font-weight: 700; color: var(--accent-teal, #20bf6b);">${step.speaker}</span>
                </div>
                <button type="button" class="btn speak-step-btn" style="background: rgba(32,191,107,0.15); border: 1px solid rgba(32,191,107,0.3); color: var(--accent-teal, #20bf6b); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Hear Japanese audio">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            <div style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 4px; letter-spacing: 0.03em;">${step.ja}</div>
            <div style="font-size: 0.85rem; color: var(--accent-gold); margin-bottom: 6px;">${step.romaji}</div>
            <div style="font-size: 0.9rem; color: #ccc;">${step.en}</div>
            ${nativeCode !== 'en' && step[nativeCode] ? `<div style="font-size: 0.85rem; color: var(--accent-pink, #ff7675); margin-top: 3px;">${step[nativeCode]}</div>` : ''}

            <div style="margin-top: 18px; font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;">Your Response:</div>
            <div class="scenario-choices-grid" style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;"></div>
            <div class="scenario-feedback-box" style="display: none; margin-top: 14px; padding: 12px 14px; border-radius: 10px; font-size: 0.88rem; line-height: 1.45;"></div>
            <div class="scenario-next-wrap" style="display: none; margin-top: 14px; text-align: right;"></div>
        `;

        const speakBtn = stepCard.querySelector('.speak-step-btn');
        if (speakBtn) {
            speakBtn.onclick = () => {
                if (typeof speakJapanese === 'function') speakJapanese(step.ja, 0.9);
            };
        }

        const choicesGrid = stepCard.querySelector('.scenario-choices-grid');
        const feedbackBox = stepCard.querySelector('.scenario-feedback-box');
        const nextWrap = stepCard.querySelector('.scenario-next-wrap');

        let answered = false;

        step.choices.forEach(ch => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn scenario-choice-btn';
            btn.style.cssText = 'text-align: left; padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25); cursor: pointer; transition: all 0.2s; color: #fff; width: 100%;';
            
            btn.innerHTML = `
                <div style="font-size: 1.05rem; font-weight: 700;">${ch.ja}</div>
                <div style="font-size: 0.8rem; color: var(--accent-gold); margin-top: 2px;">${ch.romaji}</div>
                <div style="font-size: 0.85rem; color: #ddd; margin-top: 4px;">${ch.en}</div>
                ${nativeCode !== 'en' && ch[nativeCode] ? `<div style="font-size: 0.8rem; color: var(--accent-pink, #ff7675);">${ch[nativeCode]}</div>` : ''}
            `;

            btn.onclick = () => {
                if (answered) return;
                answered = true;
                scenarioHistory.push(ch.rating);

                // Highlight buttons
                choicesGrid.querySelectorAll('.scenario-choice-btn').forEach(b => {
                    b.style.pointerEvents = 'none';
                    b.style.opacity = '0.6';
                });
                btn.style.opacity = '1';

                let badge = '';
                if (ch.rating === 'best') {
                    btn.style.borderColor = 'var(--accent-teal, #20bf6b)';
                    btn.style.background = 'rgba(32,191,107,0.15)';
                    badge = '<span style="color: var(--accent-teal, #20bf6b); font-weight: 700;"><i class="fa-solid fa-circle-check"></i> Recommended & Natural (模範回答)</span>';
                    feedbackBox.style.border = '1px solid rgba(32,191,107,0.3)';
                    feedbackBox.style.background = 'rgba(32,191,107,0.08)';
                } else if (ch.rating === 'casual') {
                    btn.style.borderColor = 'var(--accent-gold)';
                    btn.style.background = 'rgba(243,156,18,0.15)';
                    badge = '<span style="color: var(--accent-gold); font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Casual / Slightly Awkward (注意)</span>';
                    feedbackBox.style.border = '1px solid rgba(243,156,18,0.3)';
                    feedbackBox.style.background = 'rgba(243,156,18,0.08)';
                } else {
                    btn.style.borderColor = 'var(--accent-pink, #ff7675)';
                    btn.style.background = 'rgba(255,118,117,0.15)';
                    badge = '<span style="color: var(--accent-pink, #ff7675); font-weight: 700;"><i class="fa-solid fa-circle-xmark"></i> Mistake / Cultural Taboo (誤り)</span>';
                    feedbackBox.style.border = '1px solid rgba(255,118,117,0.3)';
                    feedbackBox.style.background = 'rgba(255,118,117,0.08)';
                }

                feedbackBox.style.display = 'block';
                feedbackBox.innerHTML = `
                    <div style="margin-bottom: 4px;">${badge}</div>
                    <div style="color: #ddd;">${ch.feedback}</div>
                `;

                // Show next button
                nextWrap.style.display = 'block';
                nextWrap.innerHTML = `
                    <button type="button" class="btn btn-primary" style="padding: 8px 18px; font-weight: 600;">
                        ${scenarioCurrentStep + 1 < steps.length ? 'Next Step ➔' : 'Finish Scenario 🎉'}
                    </button>
                `;
                nextWrap.querySelector('button').onclick = () => {
                    scenarioCurrentStep++;
                    renderKnowledgeHub();
                };
            };

            choicesGrid.appendChild(btn);
        });

        container.appendChild(stepCard);
    }

    // ---- 7. SLANG & ANIME VS REALITY ----
    function renderSlangSection(container, slangData, nativeCode) {
        if (!slangData) return;

        // Sub-tabs
        const subTabs = [
            { id: 'tropes', label: 'Anime vs. Reality', icon: 'fa-tv' },
            { id: 'contractions', label: 'Conversational Contractions', icon: 'fa-compress' },
            { id: 'youth', label: 'Youth & Internet Slang', icon: 'fa-hashtag' },
            { id: 'particles', label: 'Ending Particles', icon: 'fa-comment-dots' }
        ];

        const bar = document.createElement('div');
        bar.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;';
        subTabs.forEach(st => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn' + (currentSlangTab === st.id ? ' active' : '');
            b.style.cssText = `padding: 6px 12px; border-radius: 14px; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: 1px solid ${currentSlangTab === st.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'}; background: ${currentSlangTab === st.id ? 'rgba(243,156,18,0.2)' : 'transparent'}; color: ${currentSlangTab === st.id ? 'var(--accent-gold)' : '#aaa'};`;
            b.innerHTML = `<i class="fa-solid ${st.icon}"></i> ${st.label}`;
            b.onclick = () => {
                currentSlangTab = st.id;
                renderKnowledgeHub();
            };
            bar.appendChild(b);
        });
        container.appendChild(bar);

        if (currentSlangTab === 'tropes') {
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px;';
            (slangData.tropes || []).forEach(tr => {
                const c = document.createElement('div');
                c.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;';
                c.innerHTML = `
                    <div>
                        <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">${tr.category}</span>
                        <div style="margin-top: 4px; padding: 8px 10px; border-radius: 8px; background: rgba(255,118,117,0.1); border: 1px solid rgba(255,118,117,0.3);">
                            <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-pink, #ff7675);"><i class="fa-solid fa-tv"></i> In Anime:</div>
                            <div style="font-size: 1.05rem; font-weight: 700; color: #fff; margin-top: 2px;">${tr.anime}</div>
                            <div style="font-size: 0.8rem; color: #ccc;">${tr.anime_meaning}</div>
                        </div>

                        <div style="margin-top: 8px; padding: 8px 10px; border-radius: 8px; background: rgba(32,191,107,0.1); border: 1px solid rgba(32,191,107,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-teal, #20bf6b);"><i class="fa-solid fa-user-check"></i> Real Japanese:</div>
                                <button type="button" class="btn speak-real-btn" style="background: transparent; border: none; color: var(--accent-teal, #20bf6b); cursor: pointer;" title="Hear pronunciation"><i class="fa-solid fa-volume-high"></i></button>
                            </div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-top: 2px;">${tr.real_japanese}</div>
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; color: #aaa; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;">
                        <i class="fa-solid fa-circle-info" style="color: var(--accent-gold);"></i> ${tr.reality}
                    </div>
                `;
                const btn = c.querySelector('.speak-real-btn');
                if (btn) {
                    btn.onclick = () => {
                        const jaText = tr.real_japanese.split('(')[0].replace(/[0-9a-zA-Z\s]/g, '').trim();
                        if (typeof speakJapanese === 'function' && jaText) speakJapanese(jaText);
                    };
                }
                grid.appendChild(c);
            });
            container.appendChild(grid);
        } else if (currentSlangTab === 'contractions') {
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px;';
            (slangData.contractions || []).forEach(cn => {
                const c = document.createElement('div');
                c.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
                c.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through;">${cn.formal}</span>
                        <i class="fa-solid fa-arrow-right" style="color: var(--accent-gold); font-size: 0.8rem;"></i>
                        <span style="font-size: 1.15rem; font-weight: 700; color: var(--accent-teal, #20bf6b);">${cn.casual}</span>
                    </div>
                    <div style="font-size: 0.88rem; color: #ddd; margin-bottom: 8px;">${cn.meaning}</div>
                    <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px 10px; font-size: 0.82rem;">
                        <div style="color: #aaa;">Formal: <span style="color: #ddd;">${cn.example_formal}</span></div>
                        <div style="color: var(--accent-gold); margin-top: 3px; font-weight: 600;">Casual: <span>${cn.example_casual}</span></div>
                    </div>
                `;
                grid.appendChild(c);
            });
            container.appendChild(grid);
        } else if (currentSlangTab === 'youth') {
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px;';
            (slangData.youth_slang || []).forEach(ys => {
                const c = document.createElement('div');
                c.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;';
                c.innerHTML = `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 1.2rem; font-weight: 700; color: #fff;">${ys.term}</div>
                            <span style="font-size: 0.8rem; color: var(--accent-gold);">${ys.romaji}</span>
                        </div>
                        <div style="font-size: 0.92rem; font-weight: 600; color: var(--accent-teal, #20bf6b); margin-top: 4px;">${ys.meaning}</div>
                    </div>
                    <div style="font-size: 0.82rem; color: #ccc; line-height: 1.4; border-top: 1px dashed rgba(255,255,255,0.08); padding-top: 8px;">
                        ${ys.explanation}
                    </div>
                `;
                grid.appendChild(c);
            });
            container.appendChild(grid);
        } else if (currentSlangTab === 'particles') {
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px;';
            (slangData.particles || []).forEach(pt => {
                const c = document.createElement('div');
                c.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
                c.innerHTML = `
                    <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 4px;">${pt.particle}</div>
                    <div style="font-size: 0.85rem; color: #ddd; margin-bottom: 8px; line-height: 1.4;">${pt.nuance}</div>
                    <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 8px 10px; font-size: 0.82rem; color: var(--accent-teal, #20bf6b);">
                        <i class="fa-solid fa-quote-left" style="opacity: 0.5;"></i> ${pt.example}
                    </div>
                `;
                grid.appendChild(c);
            });
            container.appendChild(grid);
        }
    }

    // ---- 8. PITCH ACCENT & EAR-TRAINING ----
    function renderPitchSection(container, pitchData, nativeCode) {
        if (!pitchData) return;

        // Intro & Patterns Card
        const intro = document.createElement('div');
        intro.style.cssText = 'background: rgba(165,94,234,0.06); border: 1px solid rgba(165,94,234,0.25); border-radius: 14px; padding: 16px; margin-bottom: 20px;';
        intro.innerHTML = `
            <div style="font-size: 1.15rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <i class="fa-solid fa-wave-square" style="color: var(--accent-purple, #a55eea);"></i>
                <span>Japanese Pitch Accent (高低アクセント)</span>
            </div>
            <p style="font-size: 0.88rem; color: #ccc; line-height: 1.45; margin-bottom: 12px;">
                Unlike English, which uses <em>stress accent</em> (loudness), standard Japanese (Tokyo dialect) uses <strong>pitch accent</strong> (high vs. low musical pitch). Pronouncing words with the correct pitch prevents confusion between famous homophones like <em>rain</em> vs. <em>candy</em> or <em>chopsticks</em> vs. <em>bridge</em>!
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
                ${(pitchData.patterns || []).map(p => `
                    <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px;">
                        <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-gold);">${p.name}</div>
                        <div style="font-size: 0.78rem; color: var(--accent-teal, #20bf6b); font-weight: 600; margin-top: 2px;">${p.pattern}</div>
                        <div style="font-size: 0.78rem; color: #bbb; margin-top: 4px;">${p.desc}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(intro);

        // Pairs Section
        const title = document.createElement('div');
        title.style.cssText = 'font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;';
        title.innerHTML = '<i class="fa-solid fa-headphones" style="color: var(--accent-teal, #20bf6b);"></i> Interactive Minimal Pairs & Ear-Training';
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.style.cssText = 'display: flex; flex-direction: column; gap: 14px;';

        (pitchData.pairs || []).forEach(pr => {
            const card = document.createElement('div');
            card.style.cssText = 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;';
            card.innerHTML = `
                <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 10px;">
                    ${pr.pair_name}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
                    ${pr.items.map((it, idx) => `
                        <div class="pitch-item-box" style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="font-size: 1.4rem; font-weight: 700; color: #fff;">${it.kanji} <span style="font-size: 0.9rem; color: #aaa;">(${it.kana})</span></div>
                                    <button type="button" class="btn speak-pitch-btn" data-ja="${it.kanji}" style="background: rgba(32,191,107,0.15); border: 1px solid rgba(32,191,107,0.3); color: var(--accent-teal, #20bf6b); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer;" title="Hear pitch">
                                        <i class="fa-solid fa-volume-high"></i>
                                    </button>
                                </div>
                                <div style="font-size: 0.85rem; color: var(--accent-pink, #ff7675); font-weight: 600;">${it.pitch_type}</div>
                                <div style="font-size: 0.88rem; color: #ddd; margin-top: 2px;">${it.meaning}</div>
                            </div>
                            <div style="font-size: 0.78rem; color: #aaa; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 6px 8px; border-left: 2px solid var(--accent-teal, #20bf6b);">
                                <div>${it.sentence}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            card.querySelectorAll('.speak-pitch-btn').forEach(b => {
                b.onclick = () => {
                    const ja = b.getAttribute('data-ja');
                    if (typeof speakJapanese === 'function' && ja) speakJapanese(ja, 0.85);
                };
            });

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    window.renderKnowledgeHub = renderKnowledgeHub;

    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.getElementById('main-nav');
        if (nav) {
            nav.addEventListener('click', (e) => {
                const t = e.target.closest('.nav-tab');
                if (t && t.getAttribute('data-tab') === 'knowledge') {
                    renderKnowledgeHub();
                }
            });
        }
        if (typeof player !== 'undefined' && player.lastTab === 'knowledge') {
            renderKnowledgeHub();
        }
    });
})();

