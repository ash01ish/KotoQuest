// Reading, Listening and Mock-Exam modules — the back half of the study loop
// (Learn -> Drill -> Read -> Listen -> Test). Content lives in lazy-loaded banks
// (js/data/reading.js, js/data/listening.js). The mock exam assembles its
// Language-Knowledge section from FULL_VOCAB_DB and its Reading/Listening
// sections from those banks. Reuses globals from app.js: speakJapanese, player,
// updateHUDDisplays, saveGameData, generateProceduralQuestions.
(function () {
    const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
    const loadedSrc = {};

    function loadScript(src, cb) {
        if (loadedSrc[src]) { cb(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { loadedSrc[src] = true; cb(); };
        s.onerror = () => { console.log('practice: failed to load', src); cb(); };
        document.head.appendChild(s);
    }

    // Award XP/gold on the same level-up curve as the arena.
    // ponytail: mirrors the arena's inline level-up (checkBattleResolution); a
    // 6-line dup beats refactoring that hot path just to share it.
    function award(xp, gold) {
        if (typeof player === 'undefined') return;
        player.xp += xp; player.gold += gold;
        while (player.xp >= player.maxXp) {
            player.level++; player.xp -= player.maxXp;
            player.maxHp += 20; player.hp = player.maxHp;
            player.maxXp = Math.round(player.maxXp * 1.5);
        }
        if (typeof updateHUDDisplays === 'function') updateHUDDisplays();
        if (typeof saveGameData === 'function') saveGameData();
    }

    function levelPills(current, onPick) {
        const wrap = document.createElement('div');
        wrap.className = 'practice-levels';
        LEVELS.forEach(lv => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'practice-level' + (lv === current ? ' active' : '');
            b.textContent = lv;
            b.onclick = () => onPick(lv);
            wrap.appendChild(b);
        });
        return wrap;
    }

    // Render MC questions into `container`. `answer` is the index of the correct
    // option. Calls onDone(correctCount) once every question is answered.
    function renderQuestions(container, questions, onDone) {
        let answered = 0, correct = 0;
        questions.forEach((qq, qi) => {
            const card = document.createElement('div');
            card.className = 'practice-q';
            const qt = document.createElement('div');
            qt.className = 'practice-q-text';
            qt.textContent = (qi + 1) + '. ' + qq.q;
            card.appendChild(qt);
            if (qq.q_en) {
                const en = document.createElement('div');
                en.className = 'practice-q-en';
                en.textContent = qq.q_en;
                card.appendChild(en);
            }
            const opts = document.createElement('div');
            opts.className = 'practice-opts';
            let locked = false;
            qq.options.forEach((opt, oi) => {
                const ob = document.createElement('button');
                ob.type = 'button';
                ob.className = 'practice-opt';
                ob.textContent = opt;
                ob.onclick = () => {
                    if (locked) return;
                    locked = true;
                    answered++;
                    if (oi === qq.answer) correct++;
                    else ob.classList.add('wrong');
                    opts.children[qq.answer].classList.add('right');
                    if (answered === questions.length && onDone) onDone(correct);
                };
                opts.appendChild(ob);
            });
            card.appendChild(opts);
            container.appendChild(card);
        });
    }

    function backButton(label, onClick) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'practice-back';
        b.innerHTML = '<i class="fa-solid fa-arrow-left"></i> ' + label;
        b.onclick = onClick;
        return b;
    }

    function detailsBlock(summary, text) {
        const d = document.createElement('details');
        d.className = 'practice-details';
        const s = document.createElement('summary');
        s.textContent = summary;
        d.appendChild(s);
        const p = document.createElement('div');
        p.className = 'practice-details-body';
        p.textContent = text;
        d.appendChild(p);
        return d;
    }

    // ---- READING ----
    function renderReading() {
        const root = document.getElementById('reading');
        if (!root) return;
        loadScript('js/data/reading.js', () => {
            const bank = window.READING_BANK || {};
            let level = 'N5';
            root.innerHTML = '';
            const head = document.createElement('div');
            head.className = 'glass-card';
            head.innerHTML = '<div class="card-title"><i class="fa-solid fa-book-reader" style="color: var(--accent-teal);"></i> Reading Practice</div>'
                + '<p class="practice-intro">Original JLPT-style passages with comprehension questions. Practice material, not official exam content.</p>';
            const body = document.createElement('div');
            head.appendChild(body);
            root.appendChild(head);

            const showList = (lv) => {
                level = lv;
                body.innerHTML = '';
                body.appendChild(levelPills(level, showList));
                const items = bank[lv] || [];
                if (!items.length) {
                    const p = document.createElement('p');
                    p.className = 'practice-empty';
                    p.textContent = 'More ' + lv + ' passages coming soon.';
                    body.appendChild(p);
                    return;
                }
                items.forEach(it => {
                    const c = document.createElement('button');
                    c.type = 'button';
                    c.className = 'practice-item';
                    const t = document.createElement('span');
                    t.className = 'practice-item-title';
                    t.textContent = it.title;
                    c.appendChild(t);
                    c.onclick = () => openReading(it, lv, showList);
                    body.appendChild(c);
                });
            };
            showList(level);
        });
    }

    function openReading(item, lv, backToList) {
        const root = document.getElementById('reading');
        root.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.appendChild(backButton('Reading list', () => renderReading()));
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = item.title;
        card.appendChild(title);

        const passage = document.createElement('div');
        passage.className = 'reading-passage';
        passage.textContent = item.passage;
        card.appendChild(passage);
        if (item.passage_en) card.appendChild(detailsBlock('Show English translation', item.passage_en));

        const qWrap = document.createElement('div');
        qWrap.className = 'practice-questions';
        card.appendChild(qWrap);
        const result = document.createElement('div');
        card.appendChild(result);
        renderQuestions(qWrap, item.questions, (correct) => {
            const total = item.questions.length;
            award(10 + correct * 3, correct * 2);
            result.className = 'practice-result';
            result.textContent = `You got ${correct} / ${total} correct.  +${10 + correct * 3} XP`;
        });
        root.appendChild(card);
    }

    // ---- LISTENING ----
    function renderListening() {
        const root = document.getElementById('listening');
        if (!root) return;
        loadScript('js/data/listening.js', () => {
            const bank = window.LISTENING_BANK || {};
            let level = 'N5';
            root.innerHTML = '';
            const head = document.createElement('div');
            head.className = 'glass-card';
            head.innerHTML = '<div class="card-title"><i class="fa-solid fa-headphones" style="color: var(--accent-pink);"></i> Listening Practice</div>'
                + '<p class="practice-intro">Audio is generated by your browser\'s Japanese voice — great for training comprehension, not a substitute for native recordings. Play, answer, then check the transcript.</p>';
            const body = document.createElement('div');
            head.appendChild(body);
            root.appendChild(head);

            const showList = (lv) => {
                level = lv;
                body.innerHTML = '';
                body.appendChild(levelPills(level, showList));
                const items = bank[lv] || [];
                if (!items.length) {
                    const p = document.createElement('p');
                    p.className = 'practice-empty';
                    p.textContent = 'More ' + lv + ' clips coming soon.';
                    body.appendChild(p);
                    return;
                }
                items.forEach(it => {
                    const c = document.createElement('button');
                    c.type = 'button';
                    c.className = 'practice-item';
                    const t = document.createElement('span');
                    t.className = 'practice-item-title';
                    t.textContent = it.title;
                    c.appendChild(t);
                    c.onclick = () => openListening(it);
                    body.appendChild(c);
                });
            };
            showList(level);
        });
    }

    function openListening(item) {
        const root = document.getElementById('listening');
        root.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.appendChild(backButton('Listening list', () => renderListening()));
        const title = document.createElement('div');
        title.className = 'card-title';
        title.textContent = item.title;
        card.appendChild(title);

        // Play controls: play + speed. Script is hidden until answered.
        const controls = document.createElement('div');
        controls.className = 'listening-controls';
        let rate = 0.9;
        const play = document.createElement('button');
        play.type = 'button';
        play.className = 'btn listening-play';
        play.innerHTML = '<i class="fa-solid fa-play"></i> Play audio';
        play.onclick = () => { if (typeof speakJapanese === 'function') speakJapanese(item.script, rate); };
        controls.appendChild(play);
        [['Slow', 0.6], ['Normal', 0.9], ['Fast', 1.1]].forEach(([lab, r], i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'listening-speed' + (r === rate ? ' active' : '');
            b.textContent = lab;
            b.onclick = () => {
                rate = r;
                controls.querySelectorAll('.listening-speed').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
            };
            controls.appendChild(b);
        });
        card.appendChild(controls);

        const qWrap = document.createElement('div');
        qWrap.className = 'practice-questions';
        card.appendChild(qWrap);
        const after = document.createElement('div');
        card.appendChild(after);
        renderQuestions(qWrap, item.questions, (correct) => {
            const total = item.questions.length;
            award(10 + correct * 3, correct * 2);
            after.innerHTML = '';
            const res = document.createElement('div');
            res.className = 'practice-result';
            res.textContent = `You got ${correct} / ${total} correct.  +${10 + correct * 3} XP`;
            after.appendChild(res);
            const script = document.createElement('div');
            script.className = 'listening-script';
            script.textContent = item.script;
            after.appendChild(script);
            if (item.transcript_en) after.appendChild(detailsBlock('Show English translation', item.transcript_en));
        });
        root.appendChild(card);
    }

    // ---- MOCK EXAM ----
    // Three timed sections with sectional pass thresholds, mirroring the real
    // JLPT gating (overall >= 100/180 AND each section >= 19/60).
    function renderExam() {
        const root = document.getElementById('exam');
        if (!root) return;
        // exam pulls from both banks
        loadScript('js/data/reading.js', () => loadScript('js/data/listening.js', () => {
            let level = 'N5';
            root.innerHTML = '';
            const head = document.createElement('div');
            head.className = 'glass-card';
            head.innerHTML = '<div class="card-title"><i class="fa-solid fa-file-pen" style="color: var(--accent-purple);"></i> Mock Exam</div>'
                + '<p class="practice-intro">A short, timed JLPT-style test in three sections — Language Knowledge, Reading, Listening. You pass only if you clear <strong>100/180 overall AND at least 19/60 in every section</strong>, exactly like the real exam. Practice material, not official content.</p>';
            const body = document.createElement('div');
            head.appendChild(body);
            root.appendChild(head);

            const rebuild = (lv) => {
                level = lv;
                body.innerHTML = '';
                body.appendChild(levelPills(level, rebuild));
                const start = document.createElement('button');
                start.type = 'button';
                start.className = 'btn exam-start';
                start.innerHTML = '<i class="fa-solid fa-stopwatch"></i> Start ' + lv + ' mock exam';
                start.onclick = () => runExam(lv);
                body.appendChild(start);
            };
            rebuild(level);
        }));
    }

    function buildVocabSection(lv, count) {
        // reuse the arena's procedural vocab/reading questions; normalise answer to index
        if (typeof generateProceduralQuestions !== 'function') return [];
        const raw = generateProceduralQuestions(lv, count) || [];
        return raw.filter(q => q && q.options && q.options.length).map(q => ({
            q: q.q,
            options: q.options,
            answer: Math.max(0, q.options.indexOf(q.answer))
        }));
    }

    function runExam(lv) {
        const readingBank = (window.READING_BANK || {})[lv] || [];
        const listeningBank = (window.LISTENING_BANK || {})[lv] || [];
        const sections = [
            { key: 'Language Knowledge', type: 'vocab', questions: buildVocabSection(lv, 10) },
            { key: 'Reading', type: 'reading', items: readingBank.slice(0, 2) },
            { key: 'Listening', type: 'listening', items: listeningBank.slice(0, 2) }
        ];

        const root = document.getElementById('exam');
        root.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'glass-card';
        root.appendChild(card);

        // Timer bar
        const bar = document.createElement('div');
        bar.className = 'exam-bar';
        const timeEl = document.createElement('span');
        timeEl.className = 'exam-timer';
        bar.appendChild(timeEl);
        const submitBtn = document.createElement('button');
        submitBtn.type = 'button';
        submitBtn.className = 'btn exam-submit';
        submitBtn.textContent = 'Submit exam';
        bar.appendChild(submitBtn);
        card.appendChild(bar);

        // track score per section: {section: {correct, total}}
        const score = {};
        sections.forEach(s => { score[s.key] = { correct: 0, total: 0 }; });

        // record answers: for each rendered question, store correctness getter
        const graders = [];

        sections.forEach(sec => {
            const secEl = document.createElement('div');
            secEl.className = 'exam-section';
            const h = document.createElement('div');
            h.className = 'exam-section-title';
            h.textContent = sec.key;
            secEl.appendChild(h);

            if (sec.type === 'vocab') {
                sec.questions.forEach(q => graders.push(mkGrader(secEl, sec.key, q)));
            } else {
                (sec.items || []).forEach(item => {
                    if (sec.type === 'reading') {
                        const p = document.createElement('div');
                        p.className = 'reading-passage';
                        p.textContent = item.passage;
                        secEl.appendChild(p);
                    } else {
                        const play = document.createElement('button');
                        play.type = 'button';
                        play.className = 'btn listening-play';
                        play.innerHTML = '<i class="fa-solid fa-play"></i> Play audio';
                        play.onclick = () => { if (typeof speakJapanese === 'function') speakJapanese(item.script, 0.9); };
                        secEl.appendChild(play);
                    }
                    (item.questions || []).forEach(q => graders.push(mkGrader(secEl, sec.key, q)));
                });
            }
            card.appendChild(secEl);
        });

        // Grader: renders a question, returns {section, isCorrect()}.
        function mkGrader(parent, sectionKey, q) {
            score[sectionKey].total++;
            const box = document.createElement('div');
            box.className = 'practice-q';
            const qt = document.createElement('div');
            qt.className = 'practice-q-text';
            qt.textContent = q.q;
            box.appendChild(qt);
            const opts = document.createElement('div');
            opts.className = 'practice-opts';
            let chosen = -1;
            q.options.forEach((opt, oi) => {
                const ob = document.createElement('button');
                ob.type = 'button';
                ob.className = 'practice-opt';
                ob.textContent = opt;
                ob.onclick = () => {
                    chosen = oi;
                    opts.querySelectorAll('.practice-opt').forEach(x => x.classList.remove('chosen'));
                    ob.classList.add('chosen');
                };
                opts.appendChild(ob);
            });
            box.appendChild(opts);
            parent.appendChild(box);
            return { sectionKey, opts, q, isCorrect: () => chosen === q.answer, reveal: () => {
                opts.children[q.answer] && opts.children[q.answer].classList.add('right');
            } };
        }

        // Timer: ~1 min per question, min 5 min.
        let remaining = Math.max(300, graders.length * 45);
        const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
        timeEl.textContent = '⏱ ' + fmt(remaining);
        let done = false;
        const tick = setInterval(() => {
            remaining--;
            timeEl.textContent = '⏱ ' + fmt(remaining);
            if (remaining <= 0) finish();
        }, 1000);

        function finish() {
            if (done) return;
            done = true;
            clearInterval(tick);
            graders.forEach(g => {
                if (g.isCorrect()) score[g.sectionKey].correct++;
                g.reveal();
            });
            // scale each section to /60
            let overall = 0; const lines = []; let sectionalFail = false;
            sections.forEach(s => {
                const sc = score[s.key];
                const scaled = sc.total ? Math.round((sc.correct / sc.total) * 60) : 0;
                overall += scaled;
                if (scaled < 19) sectionalFail = true;
                lines.push(`${s.key}: ${scaled}/60${scaled < 19 ? '  ✕ below 19' : ''}`);
            });
            const passed = overall >= 100 && !sectionalFail;
            award(passed ? 80 : Math.round(overall / 3), passed ? 40 : 10);

            const res = document.createElement('div');
            res.className = 'exam-result ' + (passed ? 'pass' : 'fail');
            res.innerHTML = `<div class="exam-verdict">${passed ? 'PASS' : 'NOT YET'} — ${overall}/180</div>`
                + lines.map(l => `<div class="exam-line">${l}</div>`).join('')
                + `<div class="exam-note">Pass needs 100/180 overall and 19/60 in every section.</div>`;
            card.insertBefore(res, card.children[1]);
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'btn';
            retry.style.marginTop = '14px';
            retry.textContent = 'Back to mock exams';
            retry.onclick = () => renderExam();
            card.appendChild(retry);
            res.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
        submitBtn.onclick = finish;
    }

    // Lazy-render each module the first time its tab is opened (and on resume).
    const RENDERERS = { reading: renderReading, listening: renderListening, exam: renderExam };
    const rendered = {};
    function ensureRendered(tab) {
        if (rendered[tab] || !RENDERERS[tab]) return;
        rendered[tab] = true;
        RENDERERS[tab]();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.getElementById('main-nav');
        if (nav) nav.addEventListener('click', (e) => {
            const t = e.target.closest('.nav-tab');
            if (t) ensureRendered(t.getAttribute('data-tab'));
        });
        // resume: if the app restored one of our tabs, render it
        if (typeof player !== 'undefined' && player.lastTab && RENDERERS[player.lastTab]) {
            ensureRendered(player.lastTab);
        }
    });
})();
