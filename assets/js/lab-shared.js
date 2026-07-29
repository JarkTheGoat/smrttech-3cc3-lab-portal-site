(function () {
    const MIN_PREDICTION_CHARS = 10;
    const STAGE_CONFIRM_PREFIX = 'smrttech:stage-confirmed:v1';

    function currentStage() {
        const bodyStage = [...document.body.classList].find(name => /^stage-\d+$/.test(name));
        if (bodyStage) return bodyStage.replace('stage-', '');
        const active = document.querySelector('[data-stage].active, .stage-btn.active[id^="btn-stage-"]');
        return active?.dataset.stage || active?.id?.replace('btn-stage-', '') || '0';
    }

    function setupSkillTreeReturnLinks() {
        document.querySelectorAll('a[href*="knowledge/skill-tree.html"]').forEach(link => {
            link.addEventListener('click', () => {
                try {
                    const href = new URL(link.getAttribute('href'), window.location.href);
                    const returnUrl = new URL(window.location.href);
                    returnUrl.searchParams.set('stage', currentStage());
                    returnUrl.hash = `stage-${currentStage()}`;
                    href.searchParams.set('return', returnUrl.href);
                    link.href = href.href;
                } catch {}
            });
        });
    }

    function restoreStageFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const stage = params.get('stage') || window.location.hash.replace(/^#stage-/, '');
        if (!/^\d+$/.test(stage)) return;
        const button = document.querySelector(`[data-stage="${stage}"], #btn-stage-${stage}`);
        if (button) button.click();
        else if (typeof window.setStage === 'function') window.setStage(Number(stage));
    }

    function findPredictionField(details) {
        const explicit = details.dataset.predictionKey
            ? document.querySelector(`[data-key="${details.dataset.predictionKey}"]`)
            : null;
        if (explicit) return explicit;

        let node = details.previousElementSibling;
        while (node) {
            const field = node.matches?.('textarea, input[type="text"], input:not([type]), textarea.persist-text, .persist-text')
                ? node
                : node.querySelector?.('textarea, input[type="text"], input:not([type]), textarea.persist-text, .persist-text');
            if (field && field.matches('textarea, input')) return field;
            node = node.previousElementSibling;
        }
        return details.closest('article, section')?.querySelector('textarea, input[type="text"], input:not([type])');
    }

    function setupGatedHints() {
        document.querySelectorAll('details').forEach(details => {
            const summaryText = details.querySelector('summary')?.textContent || '';
            if (!/hint after/i.test(summaryText)) return;
            details.dataset.gatedHint = 'true';
            const prediction = findPredictionField(details);
            if (!prediction) return;

            let message = details.nextElementSibling;
            if (!message || !message.classList.contains('hint-lock-message')) {
                message = document.createElement('p');
                message.className = 'hint-lock-message';
                message.textContent = 'Write a prediction first, then the hint will unlock.';
                details.after(message);
            }

            function updateMessage() {
                const ready = (prediction.value || '').trim().length >= MIN_PREDICTION_CHARS;
                message.hidden = ready;
                details.classList.toggle('is-locked', !ready);
            }

            details.addEventListener('toggle', () => {
                const ready = (prediction.value || '').trim().length >= MIN_PREDICTION_CHARS;
                if (details.open && !ready) {
                    details.open = false;
                    message.hidden = false;
                    prediction.focus();
                }
            });
            prediction.addEventListener('input', updateMessage);
            updateMessage();
        });
    }

    function evidenceFileStorageKey(input) {
        return `smrttech:evidence-file:${window.location.pathname}:${input.dataset.key}`;
    }

    function acceptedFileTokens(input) {
        return String(input.accept || '')
            .split(',')
            .map(token => token.trim().toLowerCase())
            .filter(Boolean);
    }

    function evidenceFileIsAccepted(input, fileOrName) {
        const tokens = acceptedFileTokens(input);
        if (!tokens.length) return true;

        const name = String(fileOrName?.name || fileOrName || '').trim().toLowerCase();
        const type = String(fileOrName?.type || '').trim().toLowerCase();
        if (!name) return false;

        return tokens.some(token => {
            if (token.startsWith('.')) return name.endsWith(token);
            if (token === 'image/*') {
                return (Boolean(type) && type.startsWith('image/')) ||
                    /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/i.test(name);
            }
            if (token.endsWith('/*')) return Boolean(type) && type.startsWith(token.slice(0, -1));
            return Boolean(type) && type === token;
        });
    }

    function storedEvidenceFileName(input) {
        const selectedFile = input.files?.[0];
        if (selectedFile) {
            return evidenceFileIsAccepted(input, selectedFile) ? selectedFile.name : '';
        }
        const saved = localStorage.getItem(evidenceFileStorageKey(input)) || '';
        return evidenceFileIsAccepted(input, saved) ? saved : '';
    }

    function evidenceAcceptDescription(input) {
        const tokens = acceptedFileTokens(input);
        return tokens.length ? tokens.join(', ') : 'the listed file type';
    }

    function setEvidenceFileFeedback(input, output, state, message) {
        input.setAttribute('aria-invalid', String(state === 'error'));
        input.setCustomValidity(state === 'error' ? message : '');
        if (!output) return;
        output.textContent = message;
        output.classList.toggle('is-success', state === 'success');
        output.classList.toggle('is-error', state === 'error');
    }

    function setupEvidenceFileInputs() {
        document.querySelectorAll('input[type="file"][data-key]').forEach(input => {
            const fileKey = evidenceFileStorageKey(input);
            const saved = localStorage.getItem(fileKey);
            const output = document.querySelector(`[data-file-name-for="${input.dataset.key}"]`);
            const uploadLabel = input.closest('label');
            let helper = uploadLabel && [...uploadLabel.querySelectorAll('small')]
                .find(small => !small.matches('.file-name-preview'));
            if (!helper && uploadLabel) {
                helper = document.createElement('small');
                helper.className = 'text-gray-500';
                output?.after(helper);
            }
            if (helper) {
                helper.textContent = `Accepted: ${evidenceAcceptDescription(input)}. The selected file stays available while this page remains open and will be included with completion.json in the submission ZIP. If you reload or reopen the page, select the file again.`;
            }
            if (output) {
                if (!output.id) output.id = `file-status-${input.dataset.key}`;
                input.setAttribute('aria-describedby', output.id);
                output.setAttribute('role', 'status');
                output.setAttribute('aria-live', 'polite');
            }

            if (saved && evidenceFileIsAccepted(input, saved)) {
                setEvidenceFileFeedback(
                    input,
                    output,
                    'success',
                    `Saved evidence selection: ${saved}. Reselect this file before downloading the submission ZIP so it can be included.`
                );
            } else if (saved) {
                localStorage.removeItem(fileKey);
                setEvidenceFileFeedback(
                    input,
                    output,
                    'error',
                    `The saved filename is not an accepted type. Choose ${evidenceAcceptDescription(input)}.`
                );
            }

            input.addEventListener('change', () => {
                const file = input.files?.[0];
                const fileName = file?.name || '';
                if (file && !evidenceFileIsAccepted(input, file)) {
                    const message = `File not accepted. Choose ${evidenceAcceptDescription(input)}.`;
                    localStorage.removeItem(fileKey);
                    input.value = '';
                    setEvidenceFileFeedback(input, output, 'error', message);
                    return;
                }
                try {
                    localStorage.setItem(fileKey, fileName);
                } catch {}
                setEvidenceFileFeedback(
                    input,
                    output,
                    fileName ? 'success' : '',
                    fileName
                        ? `Selected: ${fileName}. It will be included in the submission ZIP while this page remains open.`
                        : 'No file selected.'
                );
            });
        });
    }

    function setupActivityHeadings() {
        document.querySelectorAll('h2, h3, h4').forEach(heading => {
            if (heading.dataset.activityHeading === 'true') return;
            const text = heading.textContent.trim();
            const match = text.match(/^(Activity\s+[A-Z0-9]+):\s*(.+)$/i);
            if (!match) return;

            heading.dataset.activityHeading = 'true';
            heading.classList.add('activity-heading');
            heading.textContent = '';

            const label = document.createElement('span');
            label.className = 'activity-heading__label';
            label.textContent = match[1];

            const title = document.createElement('span');
            title.className = 'activity-heading__title';
            title.textContent = match[2];

            heading.append(label, title);
        });
    }

    function setupTabbedSubpageContainment() {
        const allTabs = [...document.querySelectorAll('[data-tabs][data-target]')];
        const groups = [...new Set(allTabs.map(tab => tab.dataset.tabs).filter(Boolean))];

        function tabsInGroup(group) {
            return allTabs.filter(tab => tab.dataset.tabs === group);
        }

        function activateTab(selectedTab) {
            const group = selectedTab?.dataset.tabs;
            if (!group) return;

            tabsInGroup(group).forEach((tab, index) => {
                const active = tab === selectedTab;
                const panel = document.getElementById(tab.dataset.target);
                const safeGroup = group.replace(/[^a-z0-9_-]+/gi, '-');

                tab.id ||= `${safeGroup}-shared-tab-${index + 1}`;
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', String(active));
                tab.tabIndex = active ? 0 : -1;
                tab.classList.toggle('active', active);

                if (!panel) return;
                tab.setAttribute('aria-controls', panel.id);
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', tab.id);
                panel.setAttribute('aria-hidden', String(!active));
                panel.classList.toggle('active', active);
                panel.hidden = !active;
                panel.inert = !active;
            });
        }

        groups.forEach(group => {
            const tabs = tabsInGroup(group);
            if (!tabs.length) return;
            const tabList = tabs[0].parentElement;
            tabList?.setAttribute('role', 'tablist');
            if (tabList && !tabList.getAttribute('aria-label')) {
                tabList.setAttribute('aria-label', `${group} subpages`);
            }

            const initial = tabs.find(tab =>
                tab.classList.contains('active') || tab.getAttribute('aria-selected') === 'true'
            ) || tabs[0];
            activateTab(initial);
            tabs.forEach(tab => {
                tab.addEventListener('click', () => activateTab(tab));
            });
        });
    }

    function stageNumberFromPanel(panel) {
        const className = [...panel.classList].find(name => /^stage-\d+$/.test(name));
        return className ? Number(className.replace('stage-', '')) : -1;
    }

    function stagePanels() {
        return [...document.querySelectorAll('.stage-panel')]
            .map(panel => ({ panel, stage: stageNumberFromPanel(panel) }))
            .filter(item => item.stage >= 0)
            .sort((a, b) => a.stage - b.stage);
    }

    function currentLabNumber() {
        const match = window.location.pathname.match(/lab-(\d+)/i);
        return match ? Number(match[1]) : 0;
    }

    function currentLabKey() {
        return `lab-${String(currentLabNumber()).padStart(2, '0')}`;
    }

    function stageConfirmationKey(stage) {
        return `${STAGE_CONFIRM_PREFIX}:${currentLabKey()}:${stage}`;
    }

    function legacyStageCompletionKeys(stage) {
        const labNumber = currentLabNumber();
        if (!labNumber) return [];
        const prefixPattern = new RegExp(`^smrttech-lab0?${labNumber}(?:[^0-9]|$)`, 'i');
        const suffix = `stage-${stage}-complete`;
        const keys = [];
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (key && prefixPattern.test(key) && key.endsWith(suffix)) keys.push(key);
        }
        return keys;
    }

    function confirmStage(stage) {
        localStorage.setItem(stageConfirmationKey(stage), 'true');
    }

    function stageIsConfirmed(stage) {
        if (localStorage.getItem(stageConfirmationKey(stage)) === 'true') return true;
        const legacyConfirmed = legacyStageCompletionKeys(stage)
            .some(key => localStorage.getItem(key) === 'true');
        if (legacyConfirmed) confirmStage(stage);
        return legacyConfirmed;
    }

    function clearStageConfirmation(stage) {
        localStorage.removeItem(stageConfirmationKey(stage));
        legacyStageCompletionKeys(stage).forEach(key => localStorage.removeItem(key));
    }

    function isEssentialResponseField(field) {
        if (!field?.matches?.('input[data-key], select[data-key], textarea[data-key]')) return false;
        if (field.hasAttribute('data-stage-optional') || field.matches('[data-completion-detail]')) return false;
        if (field.matches('.order-select, input[type="checkbox"], input[type="radio"]')) return false;
        if (field.matches('input[type="file"]')) return field.hasAttribute('data-stage-required');
        return true;
    }

    function setupEssentialResponseFields() {
        document.querySelectorAll('input[data-key], select[data-key], textarea[data-key]').forEach(field => {
            if (!isEssentialResponseField(field)) return;
            field.dataset.stageEssential = 'true';
            field.setAttribute('aria-required', 'true');
        });
    }

    function gateMessage(panel) {
        let message = panel.querySelector('[data-stage-gate-message]');
        if (!message) {
            message = document.createElement('div');
            message.className = 'stage-gate-message';
            message.dataset.stageGateMessage = 'true';
            message.setAttribute('role', 'status');
            message.setAttribute('aria-live', 'polite');
            const footer = panel.querySelector('.stage-footer');
            if (footer) footer.before(message);
            else panel.appendChild(message);
        }
        return message;
    }

    function validatePanelChecks(panel) {
        const unchecked = [...panel.querySelectorAll('.persist-check')]
            .filter(input => !input.checked);
        const unansweredQuiz = [...panel.querySelectorAll('.auto-question')]
            .filter(question => !question.classList.contains('correct'));
        const orderChecks = [...panel.querySelectorAll('.order-grid[data-dnd-order]')]
            .filter((grid, index) => !isOrderGridConfirmed(grid, panel, index));

        function hasRequiredValue(field) {
            if (field.matches('input[type="file"]')) {
                return Boolean(storedEvidenceFileName(field)) && field.validity.valid;
            }
            if (field.matches('input[type="checkbox"], input[type="radio"]')) return field.checked;
            const value = String(field.value || '').trim();
            if (!value) return false;
            if (field.dataset.stageRequiredValue !== undefined) {
                return value === field.dataset.stageRequiredValue.trim();
            }
            if (field.matches('input[type="number"]')) {
                const validity = field.validity;
                if (validity && !validity.valid) return false;
            }
            return true;
        }

        function matchesExpectedValue(field) {
            const actual = String(field.value || '').trim();
            const expected = String(field.dataset.expected || '').trim();
            if (!actual) return false;
            if (field.matches('input[type="number"]')) {
                const actualNumber = Number(actual);
                const expectedNumber = Number(expected);
                return Number.isFinite(actualNumber) && Number.isFinite(expectedNumber) &&
                    Math.abs(actualNumber - expectedNumber) < 0.01;
            }
            if (field.hasAttribute('data-case-sensitive')) return actual === expected;
            return actual.toLowerCase() === expected.toLowerCase();
        }

        const requiredFields = [...new Set([
            ...panel.querySelectorAll('[data-stage-required]'),
            ...panel.querySelectorAll('input[data-key], select[data-key], textarea[data-key]')
        ])].filter(field =>
            (field.hasAttribute('data-stage-required') || isEssentialResponseField(field)) &&
            !field.hasAttribute('data-expected')
        );
        const missingUploads = requiredFields
            .filter(field => field.matches('input[type="file"]') && !hasRequiredValue(field));
        const missingResponses = requiredFields
            .filter(field => !field.matches('input[type="file"]') && !hasRequiredValue(field));
        const requiredGroups = new Map();
        panel.querySelectorAll('[data-stage-required-group]').forEach(field => {
            const group = field.dataset.stageRequiredGroup;
            if (!requiredGroups.has(group)) requiredGroups.set(group, []);
            requiredGroups.get(group).push(field);
        });
        const missingResponseGroups = [...requiredGroups.values()]
            .filter(fields => !fields.some(hasRequiredValue));
        const incorrectExpectedResponses = [...panel.querySelectorAll('[data-expected]')]
            .filter(field => !matchesExpectedValue(field));

        const remaining = unchecked.length + unansweredQuiz.length + orderChecks.length +
            missingUploads.length + missingResponses.length + missingResponseGroups.length +
            incorrectExpectedResponses.length;
        if (remaining === 0) return { ok: true, message: '' };

        const parts = [];
        if (unchecked.length) parts.push(`${unchecked.length} checklist item${unchecked.length === 1 ? '' : 's'}`);
        if (unansweredQuiz.length) parts.push(`${unansweredQuiz.length} knowledge check${unansweredQuiz.length === 1 ? '' : 's'}`);
        if (orderChecks.length) parts.push(`${orderChecks.length} ordering check${orderChecks.length === 1 ? '' : 's'}`);
        if (missingUploads.length) parts.push(`${missingUploads.length} required evidence file${missingUploads.length === 1 ? '' : 's'}`);
        const missingResponseCount = missingResponses.length + missingResponseGroups.length;
        if (missingResponseCount) parts.push(`${missingResponseCount} required response${missingResponseCount === 1 ? '' : 's'}`);
        if (incorrectExpectedResponses.length) parts.push(`${incorrectExpectedResponses.length} knowledge check${incorrectExpectedResponses.length === 1 ? '' : 's'}`);
        return {
            ok: false,
            message: `Complete this page's checks before continuing: ${parts.join(', ')} remain.`
        };
    }

    function isOrderGridCorrect(grid) {
        const selects = [...grid.querySelectorAll('.order-item select')];
        return selects.length > 0 && selects.every((select, index) => select.value === String(index + 1));
    }

    function orderFeedbackForGrid(grid, panel, index) {
        const selector = '[data-order-feedback], [data-monitor-feedback], [data-control-feedback]';
        const localFeedback = [...(grid.parentElement?.querySelectorAll(selector) || [])];
        if (localFeedback.length === 1) return localFeedback[0];
        return [...panel.querySelectorAll(selector)][index] || null;
    }

    function isOrderGridConfirmed(grid, panel, index) {
        const feedback = orderFeedbackForGrid(grid, panel, index);
        return isOrderGridCorrect(grid) && /^Correct\b/i.test(feedback?.textContent.trim() || '');
    }

    function panelControls(panel) {
        return [...panel.querySelectorAll('input, select, textarea, button')];
    }

    function isBackButton(control) {
        return control.matches('button.nav-button.secondary') && /^Back\b/i.test(control.textContent.trim());
    }

    function isPreviewNavigationControl(control) {
        return control.matches('.code-tab, [role="tab"], [data-tab-preview]');
    }

    function isProgressionButton(control) {
        if (!control.matches('button')) return false;
        const text = control.textContent.trim();
        return control.matches('.nav-button.primary') ||
            /^Mark stage complete$/i.test(text) ||
            /^Mark .* Complete/i.test(text) ||
            /^Complete .* Checkpoint/i.test(text);
    }

    function resetOrderFeedback(panel) {
        panel.querySelectorAll('[data-order-feedback], [data-monitor-feedback], [data-control-feedback]').forEach(feedback => {
            if (/^Correct\b/i.test(feedback.textContent.trim())) {
                feedback.textContent = 'Order changed. Check the order again before continuing.';
            }
        });
    }

    function setGateDisabled(control, disabled) {
        if (disabled) {
            if (!control.disabled) {
                control.dataset.stageGateDisabled = 'true';
                control.disabled = true;
            }
            return;
        }
        if (control.dataset.stageGateDisabled === 'true') {
            control.disabled = false;
            delete control.dataset.stageGateDisabled;
        }
    }

    function setDragOrderLocked(panel, locked) {
        panel.querySelectorAll('.drag-order-list').forEach(wrapper => {
            wrapper.setAttribute('aria-disabled', String(locked));
        });
        panel.querySelectorAll('.drag-order-card').forEach(card => {
            card.draggable = !locked;
            card.tabIndex = locked ? -1 : 0;
            card.setAttribute('aria-disabled', String(locked));
        });
    }

    function isStageUnlocked(stage, panelItems) {
        if (stage <= 0) return true;
        return panelItems
            .filter(item => item.stage < stage)
            .every(item => validatePanelChecks(item.panel).ok && stageIsConfirmed(item.stage));
    }

    function reconcileStoredStageCompletion(stageStates) {
        stageStates.forEach(({ stage, complete }) => {
            if (!complete) clearStageConfirmation(stage);
        });
    }

    function syncProgressDisplay(stageStates) {
        const completeCount = stageStates.filter(item => item.complete).length;
        const total = stageStates.length;

        stageStates.forEach(({ stage, complete }) => {
            document.querySelectorAll(`[data-stage="${stage}"], #btn-stage-${stage}`).forEach(button => {
                button.classList.toggle('completed', complete);
            });
        });

        document.querySelectorAll('[data-progress-status]').forEach(status => {
            status.textContent = `${completeCount}/${total}`;
            status.setAttribute('title', `${completeCount} of ${total} pages complete based on current page checks.`);
        });
    }

    function applyStageGate() {
        const items = stagePanels();
        if (!items.length) return;
        const activeStage = Number(currentStage());
        const stageStates = [];

        items.forEach(({ panel, stage }) => {
            const locked = !isStageUnlocked(stage, items);
            const validation = validatePanelChecks(panel);
            stageStates.push({ stage, complete: !locked && validation.ok && stageIsConfirmed(stage) });
            panel.classList.toggle('stage-panel-locked', locked);
            setDragOrderLocked(panel, locked);

            if (locked || !validation.ok) {
                panel.querySelectorAll('.stage-message.success:not([data-order-feedback])').forEach(message => {
                    message.textContent = '';
                    message.className = 'stage-message';
                });
            }

            panelControls(panel).forEach(control => {
                if (isBackButton(control)) {
                    setGateDisabled(control, false);
                    return;
                }
                if (isPreviewNavigationControl(control)) {
                    setGateDisabled(control, false);
                    return;
                }
                if (locked) {
                    setGateDisabled(control, true);
                    return;
                }
                if (isProgressionButton(control)) {
                    setGateDisabled(control, !validation.ok);
                    return;
                }
                // Ordinary activity controls may have been disabled while this stage
                // was locked. Explicitly restore them as soon as the prerequisite
                // stages become complete.
                setGateDisabled(control, false);
            });

            const message = gateMessage(panel);
            if (locked) {
                message.textContent = 'Complete the previous page before entering information on this page.';
                message.className = 'stage-gate-message show locked';
            } else if (!validation.ok) {
                message.textContent = validation.message;
                message.className = 'stage-gate-message show';
            } else {
                message.textContent = '';
                message.className = 'stage-gate-message';
            }

            if (stage === activeStage) {
                panel.querySelectorAll('.nav-button.primary, .stage-footer .nav-button.secondary').forEach(button => {
                    if (isBackButton(button)) return;
                    const reason = locked
                        ? 'Complete the previous page to unlock this control.'
                        : validation.ok
                            ? ''
                            : validation.message;
                    if (reason) button.title = reason;
                    else button.removeAttribute('title');
                });
            }
        });

        syncProgressDisplay(stageStates);
        reconcileStoredStageCompletion(stageStates);

    }

    function setupStageGate() {
        if (!document.querySelector('.stage-panel')) return;

        document.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button || !isProgressionButton(button)) return;
            const panel = button.closest('.stage-panel');
            if (!panel) return;
            const items = stagePanels();
            const stage = stageNumberFromPanel(panel);
            const locked = !isStageUnlocked(stage, items);
            const validation = validatePanelChecks(panel);
            if (!locked && validation.ok) {
                confirmStage(stage);
                window.requestAnimationFrame(applyStageGate);
                return;
            }

            event.preventDefault();
            event.stopImmediatePropagation();
            const message = gateMessage(panel);
            message.textContent = locked
                ? 'Complete the previous page before entering information on this page.'
                : validation.message;
            message.className = `stage-gate-message show ${locked ? 'locked' : ''}`;
            message.scrollIntoView({ behavior: 'smooth', block: 'center' });
            applyStageGate();
        }, true);

        const resyncGate = () => window.requestAnimationFrame(applyStageGate);
        document.addEventListener('input', resyncGate, true);
        document.addEventListener('change', event => {
            if (event.target.matches?.('.order-select')) {
                const panel = event.target.closest('.stage-panel');
                if (panel) resetOrderFeedback(panel);
            }
            resyncGate();
        }, true);
        // Browsers and mobile keyboards do not always emit the same final event.
        // Re-read the live DOM value on blur, autofill, and history restoration.
        document.addEventListener('blur', resyncGate, true);
        document.addEventListener('animationstart', event => {
            if (event.animationName === 'onAutoFillStart') resyncGate();
        }, true);
        window.addEventListener('pageshow', resyncGate);
        document.addEventListener('click', event => {
            if (event.target.closest('button')) {
                window.requestAnimationFrame(applyStageGate);
            }
            if (event.target.closest('[data-stage]')) {
                window.setTimeout(applyStageGate, 0);
            }
        });

        const bodyObserver = new MutationObserver(() => applyStageGate());
        bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        window.requestAnimationFrame(applyStageGate);
    }

    function setupStageNavigationViewport() {
        const navigationSelector = '.stage-btn, button.nav-button';
        document.addEventListener('click', event => {
            if (!event.target.closest(navigationSelector)) return;
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    const stageClass = [...document.body.classList].find(name => /^stage-\d+$/.test(name));
                    const panel = stageClass ? document.querySelector(`.stage-panel.${stageClass}`) : null;
                    if (!panel) return;
                    panel.tabIndex = -1;
                    panel.focus({ preventScroll: true });
                    panel.scrollIntoView({
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                        block: 'start'
                    });
                });
            });
        });
    }

    function setupCodeCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            if (pre.querySelector('[data-copy-code]')) return;
            const code = pre.querySelector('code');
            if (!code) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'utility-button code-copy-button';
            button.dataset.copyCode = 'true';
            button.textContent = 'Copy code';
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent || '');
                    button.textContent = 'Copied';
                    window.setTimeout(() => { button.textContent = 'Copy code'; }, 1500);
                } catch {
                    button.textContent = 'Copy unavailable';
                    window.setTimeout(() => { button.textContent = 'Copy code'; }, 1500);
                }
            });
            pre.before(button);
        });
    }

    function setupDragOrder() {
        document.querySelectorAll('.order-grid[data-dnd-order]').forEach(grid => {
            if (grid.dataset.dndReady === 'true') return;
            grid.dataset.dndReady = 'true';

            const originalItems = [...grid.querySelectorAll('.order-item')];
            if (!originalItems.length) return;
            const selectByKey = new Map();
            const items = originalItems.map(item => {
                const select = item.querySelector('select');
                const label = item.querySelector('span')?.textContent?.trim() || item.textContent.trim();
                const key = select?.dataset.key || label;
                if (select) selectByKey.set(key, select);
                return { key, label };
            });

            const layoutColumn = grid.parentElement;
            const layoutParent = layoutColumn?.parentElement;
            if (layoutParent?.classList.contains('grid-layout') || layoutParent?.classList.contains('grid')) {
                layoutColumn.classList.add('drag-order-wide-column');
            }

            const shuffled = [...items].reverse();
            const savedPositions = items.map(item => ({
                item,
                position: Number(selectByKey.get(item.key)?.value)
            }));
            const savedOrderIsValid = savedPositions.every(({ position }) =>
                Number.isInteger(position) && position >= 1 && position <= items.length
            ) && new Set(savedPositions.map(({ position }) => position)).size === items.length;
            const initialItems = savedOrderIsValid
                ? savedPositions
                    .sort((a, b) => a.position - b.position)
                    .map(({ item }) => item)
                : shuffled;
            const wrapper = document.createElement('div');
            wrapper.className = 'drag-order-list drag-order-snake';
            wrapper.setAttribute('aria-label', 'Drag and drop order activity');

            const intro = document.createElement('p');
            intro.className = 'drag-order-note';
            intro.textContent = 'Drag the blocks into order, then use the Check order button.';
            grid.before(intro);

            const shell = document.createElement('div');
            shell.className = 'drag-order-shell';
            const shellLabel = document.createElement('span');
            shellLabel.className = 'drag-order-shell-label';
            shellLabel.textContent = 'Drag-n-drop';
            const svgNamespace = 'http://www.w3.org/2000/svg';
            const wrapArrowId = `drag-wrap-arrow-${Math.random().toString(36).slice(2)}`;
            const wrapConnectors = document.createElementNS(svgNamespace, 'svg');
            wrapConnectors.classList.add('drag-order-wrap-connectors');
            wrapConnectors.setAttribute('aria-hidden', 'true');

            const hidden = document.createElement('div');
            hidden.className = 'order-grid-fallback';
            originalItems.forEach(item => hidden.appendChild(item));
            hidden.hidden = true;
            grid.appendChild(hidden);
            shell.append(shellLabel, wrapConnectors, wrapper);
            grid.appendChild(shell);

            function syncSelects() {
                [...wrapper.querySelectorAll('.drag-order-card')].forEach((card, index) => {
                    const select = selectByKey.get(card.dataset.key);
                    if (!select) return;
                    const nextValue = String(index + 1);
                    if (select.value === nextValue) return;
                    select.value = nextValue;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                });
            }

            function getSnakeColumnCount() {
                const width = Math.max(
                    wrapper.getBoundingClientRect().width,
                    shell.getBoundingClientRect().width,
                    grid.getBoundingClientRect().width
                );
                // Before the first layout pass, use the desktop arrangement rather than
                // briefly showing a misleading vertical chain. A queued remeasure below
                // selects the responsive layout once dimensions are available.
                if (!width) return 4;
                if (width < 560) return 1;
                if (width < 820) return 2;
                return 4;
            }

            function drawWrapConnectors(cards) {
                wrapConnectors.innerHTML = '';
                const shellRect = shell.getBoundingClientRect();
                if (!shellRect.width || !shellRect.height) return;

                wrapConnectors.setAttribute('viewBox', `0 0 ${shellRect.width} ${shellRect.height}`);

                const defs = document.createElementNS(svgNamespace, 'defs');
                const marker = document.createElementNS(svgNamespace, 'marker');
                marker.setAttribute('id', wrapArrowId);
                marker.setAttribute('viewBox', '0 0 10 10');
                marker.setAttribute('refX', '10');
                marker.setAttribute('refY', '5');
                marker.setAttribute('markerWidth', '6');
                marker.setAttribute('markerHeight', '6');
                marker.setAttribute('orient', 'auto');
                const arrowHead = document.createElementNS(svgNamespace, 'path');
                arrowHead.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
                arrowHead.classList.add('drag-order-wrap-arrowhead');
                marker.appendChild(arrowHead);
                defs.appendChild(marker);
                wrapConnectors.appendChild(defs);

                cards.forEach((card, index) => {
                    if (card.dataset.snakeDirection !== 'wrap') return;
                    const nextCard = cards[index + 1];
                    if (!nextCard) return;

                    const sourceRect = card.getBoundingClientRect();
                    const targetRect = nextCard.getBoundingClientRect();
                    const startX = sourceRect.right - shellRect.left;
                    const startY = sourceRect.top + sourceRect.height / 2 - shellRect.top;
                    const endX = targetRect.left - shellRect.left;
                    const endY = targetRect.top + targetRect.height / 2 - shellRect.top;
                    const routeRightX = Math.min(
                        shellRect.width - 12,
                        Math.max(startX + 12, (startX + shellRect.width) / 2)
                    );
                    const routeLeftX = Math.max(12, endX / 2);
                    const routeY = (sourceRect.bottom + targetRect.top) / 2 - shellRect.top;

                    const path = document.createElementNS(svgNamespace, 'path');
                    path.classList.add('drag-order-wrap-path');
                    path.setAttribute('d', `M ${startX} ${startY} H ${routeRightX} V ${routeY} H ${routeLeftX} V ${endY} H ${endX}`);
                    path.setAttribute('marker-end', `url(#${wrapArrowId})`);
                    wrapConnectors.appendChild(path);
                });
            }

            function syncUniformCardHeight(cards) {
                if (!cards.length) {
                    wrapper.style.removeProperty('--drag-card-height');
                    return;
                }
                const requiredHeights = cards.map(card => {
                    const style = window.getComputedStyle(card);
                    const label = card.querySelector('.drag-order-card-label');
                    const indexBadge = card.querySelector('.drag-order-index');
                    const contentHeight = Math.max(
                        label?.scrollHeight || 0,
                        indexBadge?.offsetHeight || 0
                    );
                    const chromeHeight = ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']
                        .reduce((total, property) => total + (Number.parseFloat(style[property]) || 0), 0);
                    return Math.max(Number.parseFloat(style.minHeight) || 0, contentHeight + chromeHeight);
                });
                const nextHeight = `${Math.ceil(Math.max(...requiredHeights))}px`;
                if (wrapper.style.getPropertyValue('--drag-card-height') !== nextHeight) {
                    wrapper.style.setProperty('--drag-card-height', nextHeight);
                }
            }

            function updateSnakeState(measureCardHeight = false) {
                const cards = [...wrapper.querySelectorAll('.drag-order-card')];
                const snakeColumns = getSnakeColumnCount();
                wrapper.style.setProperty('--snake-columns', String(snakeColumns));
                wrapper.classList.toggle(
                    'has-wrap-connector',
                    snakeColumns > 1 && cards.length > snakeColumns
                );
                cards.forEach((card, index) => {
                    const row = Math.floor(index / snakeColumns);
                    const colInRow = index % snakeColumns;
                    const col = colInRow + 1;
                    const isLast = index === cards.length - 1;
                    const isRowEnd = (index + 1) % snakeColumns === 0;
                    card.style.setProperty('--snake-row', String(row + 1));
                    card.style.setProperty('--snake-col', String(col));
                    card.classList.toggle('is-snake-start', index === 0);
                    card.classList.toggle('is-snake-end', isLast);
                    card.classList.toggle('is-wrap-entry', snakeColumns > 1 && row > 0 && colInRow === 0);
                    card.dataset.snakeDirection = isLast
                        ? 'end'
                        : snakeColumns === 1
                            ? 'down-stack'
                        : isRowEnd
                            ? 'wrap'
                            : 'right';
                    const indexBadge = card.querySelector('.drag-order-index');
                    if (indexBadge) indexBadge.textContent = String(index + 1);
                });
                if (measureCardHeight) syncUniformCardHeight(cards);
                drawWrapConnectors(cards);
                syncSelects();
            }

            function moveCard(card, delta) {
                if (wrapper.closest('.stage-panel')?.classList.contains('stage-panel-locked')) return;
                const cards = [...wrapper.querySelectorAll('.drag-order-card')];
                const index = cards.indexOf(card);
                const swapWith = cards[index + delta];
                if (!swapWith) return;
                if (delta < 0) wrapper.insertBefore(card, swapWith);
                else wrapper.insertBefore(swapWith, card);
                updateSnakeState();
                card.focus();
            }

            function render(list) {
                wrapper.innerHTML = '';
                list.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'drag-order-card';
                    card.draggable = true;
                    card.tabIndex = 0;
                    card.dataset.key = item.key;
                    card.setAttribute('aria-label', `${item.label}. Use arrow keys to move this item.`);
                    const indexBadge = document.createElement('span');
                    indexBadge.className = 'drag-order-index';
                    indexBadge.setAttribute('aria-hidden', 'true');
                    const label = document.createElement('span');
                    label.className = 'drag-order-card-label';
                    label.textContent = item.label;
                    card.append(indexBadge, label);
                    wrapper.appendChild(card);
                });
                updateSnakeState(true);
            }

            let dragging = null;
            let dropPreview = null;
            let pendingDropIntent = null;

            function clearDropPreview() {
                if (dropPreview) {
                    dropPreview.classList.remove('is-drop-preview');
                    delete dropPreview.dataset.dropAxis;
                    delete dropPreview.dataset.dropSide;
                }
                dropPreview = null;
                pendingDropIntent = null;
            }

            function showDropPreview(target, side, axis) {
                clearDropPreview();
                dropPreview = target;
                pendingDropIntent = { target, side, axis };
                target.classList.add('is-drop-preview');
                target.dataset.dropAxis = axis;
                target.dataset.dropSide = side;
            }

            function nearestDropIntent(clientX, clientY) {
                const cards = [...wrapper.querySelectorAll('.drag-order-card')]
                    .filter(card => card !== dragging);
                if (!cards.length) return null;
                const isVertical = Number(wrapper.style.getPropertyValue('--snake-columns')) === 1;
                const axis = isVertical ? 'vertical' : 'horizontal';
                let nearest = null;

                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const crossDistance = isVertical
                        ? clientX < rect.left
                            ? rect.left - clientX
                            : clientX > rect.right
                                ? clientX - rect.right
                                : 0
                        : clientY < rect.top
                            ? rect.top - clientY
                            : clientY > rect.bottom
                                ? clientY - rect.bottom
                                : 0;
                    const anchors = isVertical
                        ? [
                            { side: 'before', mainDistance: Math.abs(clientY - rect.top) },
                            { side: 'after', mainDistance: Math.abs(clientY - rect.bottom) }
                        ]
                        : [
                            { side: 'before', mainDistance: Math.abs(clientX - rect.left) },
                            { side: 'after', mainDistance: Math.abs(clientX - rect.right) }
                        ];

                    anchors.forEach(anchor => {
                        const score = anchor.mainDistance ** 2 + crossDistance ** 2;
                        if (!nearest || score < nearest.score) {
                            nearest = { target: card, side: anchor.side, axis, score };
                        }
                    });
                });

                return nearest;
            }

            function commitDropIntent() {
                if (!dragging || !pendingDropIntent) return;
                const intent = pendingDropIntent;
                const { target, side } = intent;
                const alreadyPlaced = side === 'before'
                    ? dragging.nextElementSibling === target
                    : target.nextElementSibling === dragging;
                if (!alreadyPlaced) {
                    wrapper.insertBefore(dragging, side === 'after' ? target.nextSibling : target);
                }
            }

            function finishDragging(commit = false) {
                if (commit) commitDropIntent();
                clearDropPreview();
                shell.classList.remove('is-drag-active');
                dragging?.classList.remove('is-dragging');
                dragging = null;
                updateSnakeState();
            }

            shell.addEventListener('dragstart', event => {
                if (wrapper.closest('.stage-panel')?.classList.contains('stage-panel-locked')) {
                    event.preventDefault();
                    return;
                }
                dragging = event.target.closest('.drag-order-card');
                if (!dragging) return;
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', dragging.dataset.key || 'drag-order-card');
                shell.classList.add('is-drag-active');
                window.requestAnimationFrame(() => dragging?.classList.add('is-dragging'));
            });
            shell.addEventListener('dragover', event => {
                if (!dragging || wrapper.closest('.stage-panel')?.classList.contains('stage-panel-locked')) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
                const intent = nearestDropIntent(event.clientX, event.clientY);
                if (intent) showDropPreview(intent.target, intent.side, intent.axis);
            });
            shell.addEventListener('dragleave', event => {
                if (!event.relatedTarget || !shell.contains(event.relatedTarget)) clearDropPreview();
            });
            shell.addEventListener('drop', event => {
                if (wrapper.closest('.stage-panel')?.classList.contains('stage-panel-locked')) return;
                event.preventDefault();
                finishDragging(true);
            });
            shell.addEventListener('dragend', () => finishDragging(false));
            wrapper.addEventListener('keydown', event => {
                if (wrapper.closest('.stage-panel')?.classList.contains('stage-panel-locked')) return;
                const card = event.target.closest('.drag-order-card');
                if (!card) return;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveCard(card, -1);
                }
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    moveCard(card, 1);
                }
            });

            const reset = document.createElement('button');
            reset.type = 'button';
            reset.className = 'utility-button';
            reset.textContent = 'Reset drag order';
            reset.addEventListener('click', () => render(shuffled));
            wrapper.after(reset);

            let layoutUpdateQueued = false;
            function scheduleSnakeLayout() {
                if (layoutUpdateQueued) return;
                layoutUpdateQueued = true;
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        layoutUpdateQueued = false;
                        updateSnakeState(true);
                    });
                });
            }

            // Render after the browser has calculated the page width. This prevents the
            // sensing-chain activity from first painting as a vertical mobile stack.
            window.requestAnimationFrame(() => {
                render(initialItems);
                scheduleSnakeLayout();
            });
            window.addEventListener('load', scheduleSnakeLayout, { once: true });
            window.addEventListener('resize', scheduleSnakeLayout);
            if ('ResizeObserver' in window) {
                const layoutObserver = new ResizeObserver(scheduleSnakeLayout);
                layoutObserver.observe(shell);
            }
        });
    }

    function setupTableControlLabels() {
        document.querySelectorAll('table').forEach(table => {
            table.querySelectorAll('thead th').forEach(heading => {
                if (!heading.hasAttribute('scope')) heading.setAttribute('scope', 'col');
            });

            table.querySelectorAll('tbody tr').forEach(row => {
                const cells = [...row.children];
                const rowLabel = cells[0]?.textContent?.trim() || '';
                const headingCells = [...(table.querySelector('thead tr')?.children || [])];
                row.querySelectorAll('input, select, textarea').forEach(control => {
                    if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return;
                    if (control.id && document.querySelector(`label[for="${control.id}"]`)) return;
                    if (control.closest('label') && control.closest('label')?.textContent?.trim()) return;
                    const cell = control.closest('td, th');
                    const column = cells.indexOf(cell);
                    const columnLabel = headingCells[column]?.textContent?.trim() || '';
                    const label = [rowLabel, columnLabel].filter(Boolean).join(' - ');
                    if (label) control.setAttribute('aria-label', label);
                });
            });
        });
    }

    function setupSidebarAccessibility() {
        function setSidebarState(sidebar, open) {
            [...sidebar.children].forEach(child => {
                if (child.classList.contains('sidebar-handle')) return;
                child.inert = !open;
                child.setAttribute('aria-hidden', String(!open));
            });
            document.querySelectorAll(`[data-sidebar-toggle="${sidebar.id}"]`).forEach(button => {
                button.setAttribute('aria-expanded', String(open));
            });
        }

        document.querySelectorAll('[data-sidebar-toggle]').forEach(button => {
            const targetId = button.dataset.sidebarToggle;
            const target = document.getElementById(targetId);
            if (!target) return;
            button.setAttribute('aria-controls', targetId);
            const sync = () => setSidebarState(target, target.classList.contains('active'));
            sync();
            button.addEventListener('click', sync);
        });

        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            const openSidebar = document.querySelector('.sidebar.active');
            if (!openSidebar) return;
            openSidebar.classList.remove('active');
            setSidebarState(openSidebar, false);
            document.querySelector(`[data-sidebar-toggle="${openSidebar.id}"]`)?.focus();
        });
    }

    function removeRedundantStageCompleteButtons() {
        document.querySelectorAll('.stage-footer button').forEach(button => {
            if (/^Mark stage complete$/i.test(button.textContent.trim())) button.remove();
        });
    }

    function setupCheckpointMarkers() {
        document.querySelectorAll('.stage-panel').forEach((panel, index) => {
            if (panel.querySelector('.checkpoint-marker')) return;
            panel.dataset.checkpointNumber = String(index + 1);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        restoreStageFromUrl();
        setupSkillTreeReturnLinks();
        setupGatedHints();
        setupEvidenceFileInputs();
        setupActivityHeadings();
        setupTabbedSubpageContainment();
        setupEssentialResponseFields();
        setupTableControlLabels();
        setupSidebarAccessibility();
        setupDragOrder();
        removeRedundantStageCompleteButtons();
        setupCheckpointMarkers();
        setupStageGate();
        setupStageNavigationViewport();
        setupCodeCopyButtons();
    });
}());
