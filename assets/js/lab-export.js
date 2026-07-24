(() => {
    'use strict';

    const SCHEMA_VERSION = '3cc3-lab-completion-v1';
    const COURSE = {
        code: 'SMRTTECH 3CC3',
        title: 'Cloud Computing and Internet of Things'
    };
    const DETAILS_PREFIX = 'smrttech:completion-details:v1';
    const CHECKPOINT_PREFIX = 'smrttech:completion-record:v1';
    const STAGE_CONFIRM_PREFIX = 'smrttech:stage-confirmed:v1';
    const REQUIRED_STUDENT_DETAILS = [
        { key: 'name_or_team', label: 'Name' },
        { key: 'student_numbers', label: 'Student Number' },
        { key: 'lab_section', label: 'Lab Section' },
        { key: 'instructor_or_ta', label: 'Lab Instructor or TA' }
    ];

    function text(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function labNumber() {
        const match = window.location.pathname.match(/lab-(\d+)/i);
        return match ? Number(match[1]) : 0;
    }

    function labKey() {
        return `lab-${String(labNumber()).padStart(2, '0')}`;
    }

    function storageKey(prefix) {
        return `${prefix}:${labKey()}`;
    }

    function localTimestamp(date = new Date()) {
        const part = value => String(value).padStart(2, '0');
        return `${date.getFullYear()}-${part(date.getMonth() + 1)}-${part(date.getDate())}_${part(date.getHours())}${part(date.getMinutes())}`;
    }

    function safeFilenamePart(value) {
        return text(value)
            .replace(/[^a-z0-9]+/gi, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 60) || 'unidentified';
    }

    function stageNumber(panel, index) {
        const className = [...panel.classList].find(name => /^stage-\d+$/.test(name));
        return className ? Number(className.slice(6)) : index;
    }

    function stagePanels() {
        return [...document.querySelectorAll('.stage-panel')]
            .map((panel, index) => ({ panel, stage: stageNumber(panel, index) }))
            .sort((a, b) => a.stage - b.stage);
    }

    function stageTitle(stage, panel) {
        const navigation = [...document.querySelectorAll(`[data-stage="${stage}"], #btn-stage-${stage}`)]
            .find(button => text(button.textContent));
        if (navigation) return text(navigation.textContent);
        return text(panel.querySelector('h1, h2, h3')?.textContent) || `Stage ${stage + 1}`;
    }

    function removeControlText(element) {
        const clone = element.cloneNode(true);
        clone.querySelectorAll('input, select, textarea, button, small, output').forEach(node => node.remove());
        return text(clone.textContent);
    }

    function labelFor(control) {
        if (control.dataset.exportLabel) return text(control.dataset.exportLabel);
        if (control.id) {
            const explicit = [...document.querySelectorAll('label[for]')]
                .find(label => label.htmlFor === control.id);
            if (explicit) return removeControlText(explicit);
        }

        const wrappingLabel = control.closest('label');
        if (wrappingLabel) {
            const titledChild = wrappingLabel.querySelector(':scope > span, :scope > strong');
            return text(titledChild?.textContent) || removeControlText(wrappingLabel);
        }

        const ariaLabel = text(control.getAttribute('aria-label'));
        if (ariaLabel) return ariaLabel;

        const cell = control.closest('td, th');
        const row = control.closest('tr');
        if (cell && row) {
            const cells = [...row.children];
            const column = cells.indexOf(cell);
            const rowLabel = text(cells[0]?.textContent);
            const table = row.closest('table');
            const headingRow = table?.querySelector('thead tr');
            const columnLabel = text(headingRow?.children[column]?.textContent);
            return [rowLabel, columnLabel].filter(Boolean).join(' - ');
        }

        return text(control.placeholder) || control.dataset.key || control.name || control.id || 'Unlabelled response';
    }

    function unitFor(label) {
        const explicit = label.match(/\(([^()]{1,16})\)/);
        if (explicit && /^(%|v|mv|a|ma|ohm|kohm|mohm|rpm|ms|s|c|f|k|cm|mm|m|deg|degrees?|count)$/i.test(text(explicit[1]).replace(/Ω/g, 'ohm'))) {
            return text(explicit[1]);
        }
        const known = label.match(/\b(k?ohm|mohm|volts?|millivolts?|amps?|milliamps?|rpm|milliseconds?|seconds?|celsius|fahrenheit|kelvin|percent)\b/i);
        return known ? text(known[1]) : '';
    }

    function fieldId(control, index) {
        return control.dataset.key || control.dataset.questionId || control.id || control.name || `response-${index + 1}`;
    }

    function evidenceFileStorageKey(input) {
        return `smrttech:evidence-file:${window.location.pathname}:${input.dataset.key}`;
    }

    function evidenceFileIsAccepted(input, fileOrName) {
        const tokens = String(input.accept || '')
            .split(',')
            .map(token => token.trim().toLowerCase())
            .filter(Boolean);
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

    function stageConfirmationKey(stage) {
        return `${STAGE_CONFIRM_PREFIX}:${labKey()}:${stage}`;
    }

    function legacyStageCompletionKeys(stage) {
        const number = labNumber();
        if (!number) return [];
        const prefixPattern = new RegExp(`^smrttech-lab0?${number}(?:[^0-9]|$)`, 'i');
        const suffix = `stage-${stage}-complete`;
        const keys = [];
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (key && prefixPattern.test(key) && key.endsWith(suffix)) keys.push(key);
        }
        return keys;
    }

    function stageIsConfirmed(stage) {
        if (localStorage.getItem(stageConfirmationKey(stage)) === 'true') return true;
        const legacyConfirmed = legacyStageCompletionKeys(stage)
            .some(key => localStorage.getItem(key) === 'true');
        if (legacyConfirmed) localStorage.setItem(stageConfirmationKey(stage), 'true');
        return legacyConfirmed;
    }

    function isEssentialResponseField(control) {
        if (!control?.matches?.('input[data-key], select[data-key], textarea[data-key]')) return false;
        if (control.hasAttribute('data-stage-optional') || control.matches('[data-completion-detail]')) return false;
        if (control.matches('.order-select, input[type="checkbox"], input[type="radio"]')) return false;
        if (control.matches('input[type="file"]')) return control.hasAttribute('data-stage-required');
        return true;
    }

    function isSensitiveControl(control) {
        if (!control) return false;
        if (control.hasAttribute('data-sensitive')) return true;
        const identity = [
            control.dataset?.key,
            control.id,
            control.name,
            control.getAttribute?.('autocomplete')
        ].filter(Boolean).join(' ');
        return /(?:access[-_ ]?token|api[-_ ]?token|password|credential|client[-_ ]?secret|private[-_ ]?key)/i.test(identity);
    }

    function isIndividuallyRequired(control) {
        return Boolean(
            control.required ||
            control.classList.contains('persist-check') ||
            control.hasAttribute('data-stage-required') ||
            control.hasAttribute('data-expected') ||
            isEssentialResponseField(control)
        );
    }

    function matchesExpectedValue(control) {
        const actual = String(control.value || '').trim();
        const expected = String(control.dataset.expected || '').trim();
        if (!actual) return false;
        if (control.matches('input[type="number"]')) {
            const actualNumber = Number(actual);
            const expectedNumber = Number(expected);
            return Number.isFinite(actualNumber) && Number.isFinite(expectedNumber) &&
                Math.abs(actualNumber - expectedNumber) < 0.01;
        }
        if (control.hasAttribute('data-case-sensitive')) return actual === expected;
        return actual.toLowerCase() === expected.toLowerCase();
    }

    function hasRequiredValue(control) {
        if (control.matches('input[type="file"]')) {
            const file = control.files?.[0];
            const saved = localStorage.getItem(evidenceFileStorageKey(control)) || '';
            const candidate = file || saved;
            return Boolean(file?.name || saved) && evidenceFileIsAccepted(control, candidate) && control.validity.valid;
        }
        if (control.matches('input[type="checkbox"], input[type="radio"]')) return control.checked;
        const value = String(control.value || '').trim();
        if (!value) return false;
        if (control.dataset.stageRequiredValue !== undefined) {
            return value === control.dataset.stageRequiredValue.trim();
        }
        if (control.hasAttribute('data-expected')) return matchesExpectedValue(control);
        if (control.matches('input[type="number"]')) {
            const validity = control.validity;
            if (validity && !validity.valid) return false;
        }
        return true;
    }

    function responseType(control) {
        if (control.tagName === 'TEXTAREA') return 'text';
        if (control.tagName === 'SELECT') return 'choice';
        if (control.type === 'checkbox') return 'checkbox';
        if (control.type === 'number') return 'number';
        if (control.type === 'file') return 'file';
        return control.type || 'text';
    }

    function knownMeasurementValidation(control, value) {
        if (!/^t1-r-/.test(control.dataset.key || '') || value === null) return null;
        const inRange = value >= 100 && value <= 2000000;
        return {
            status: inRange ? 'pass' : 'warning',
            rule: 'Photoresistor resistance should be between 100 ohm and 2,000,000 ohm.',
            message: inRange
                ? 'Value is within the Lab 1 photoresistor measurement range.'
                : 'Value is outside the Lab 1 photoresistor measurement range and should be reviewed.'
        };
    }

    function validationFor(control, value) {
        if (control.type === 'checkbox') {
            return {
                status: control.checked ? 'pass' : 'fail',
                rule: 'Required checklist confirmation.',
                message: control.checked ? 'Checklist item confirmed.' : 'Checklist item was not confirmed.'
            };
        }

        if (control.hasAttribute('data-expected')) {
            const matches = matchesExpectedValue(control);
            return {
                status: matches ? 'pass' : 'fail',
                rule: control.matches('input[type="number"]')
                    ? `Required value must be within 0.01 of ${control.dataset.expected}.`
                    : control.hasAttribute('data-case-sensitive')
                        ? `Required value must exactly match ${control.dataset.expected}.`
                        : `Required value must match ${control.dataset.expected} (case-insensitive).`,
                message: matches
                    ? 'Validated response is correct.'
                    : 'Validated response is missing or incorrect.'
            };
        }

        if (isIndividuallyRequired(control) && !hasRequiredValue(control)) {
            return {
                status: 'fail',
                rule: control.dataset.stageRequiredValue !== undefined
                    ? `Required response must equal ${control.dataset.stageRequiredValue}.`
                    : 'Required response must be present and valid.',
                message: 'A required response was missing or invalid.'
            };
        }

        if (control.type === 'number' && value !== null) {
            const knownRule = knownMeasurementValidation(control, value);
            if (knownRule) return knownRule;
            if (control.validity?.rangeUnderflow || control.validity?.rangeOverflow) {
                return {
                    status: isIndividuallyRequired(control) ? 'fail' : 'warning',
                    rule: 'Browser numeric range validation.',
                    message: 'Value is outside the range configured for this field and should be reviewed.'
                };
            }
        }

        if (isIndividuallyRequired(control)) {
            return {
                status: 'pass',
                rule: 'Required response must be present and valid.',
                message: 'Required response was provided and passed its configured validation.'
            };
        }

        return {
            status: 'not_checked',
            rule: 'No automated validation rule is configured for this response.',
            message: value === '' || value === null
                ? 'No response was recorded; instructor review may be needed.'
                : 'This response requires instructor review.'
        };
    }

    function responseFor(control, index) {
        const label = labelFor(control);
        const type = responseType(control);
        const rawValue = control.type === 'checkbox'
            ? control.checked
            : text(control.value);
        const value = type === 'number'
            ? (rawValue === '' ? null : Number(rawValue))
            : rawValue;
        const unit = unitFor(label);
        return {
            id: fieldId(control, index),
            label,
            type,
            value,
            display_value: type === 'number' && rawValue !== ''
                ? `${rawValue}${unit ? ` ${unit}` : ''}`
                : rawValue,
            unit,
            required: isIndividuallyRequired(control),
            required_group: control.dataset.stageRequiredGroup || null,
            validation: validationFor(control, value)
        };
    }

    function responseControls(panel) {
        return [...panel.querySelectorAll('input[data-key]:not([type="file"]), select[data-key], textarea[data-key]')]
            .filter(control => !control.matches('[data-completion-detail]') && !isSensitiveControl(control));
    }

    function evidenceFor(panel) {
        return [...panel.querySelectorAll('input[type="file"][data-key]')].map(input => {
            const file = input.files?.[0];
            const storedName = localStorage.getItem(evidenceFileStorageKey(input)) || '';
            const label = labelFor(input);
            const filename = file?.name || storedName;
            const required = isIndividuallyRequired(input);
            const valid = hasRequiredValue(input);
            const accepted = Boolean(filename) && evidenceFileIsAccepted(input, file || storedName);
            return {
                id: input.dataset.key,
                label,
                type: 'file',
                filename,
                mime_type: file?.type || '',
                size_bytes: file?.size ?? null,
                last_modified: file?.lastModified ? new Date(file.lastModified).toISOString() : null,
                provided: accepted,
                required,
                required_group: input.dataset.stageRequiredGroup || null,
                validation: {
                    status: required ? (valid ? 'pass' : 'fail') : accepted ? 'pass' : 'not_checked',
                    rule: required ? 'An accepted required evidence filename must be recorded.' : 'Optional evidence.',
                    message: required
                        ? (valid ? 'Required evidence was selected in the browser.' : 'Required evidence is missing or has an unsupported file type.')
                        : (accepted ? 'Optional evidence was selected in the browser.' : filename ? 'Optional evidence has an unsupported file type.' : 'No optional evidence was selected.')
                },
                included_in_export: false,
                message: filename
                    ? 'The selected filename is recorded locally. File contents are not uploaded or embedded in this JSON.'
                    : 'No file was selected in the browser.'
            };
        });
    }

    function questionResponses(panel) {
        return [...panel.querySelectorAll('.auto-question')].map((question, index) => {
            const selected = question.querySelector('input:checked');
            const id = question.dataset.questionId || `knowledge-check-${index + 1}`;
            const label = text(question.querySelector('legend, h3, h4, .quiz-title')?.textContent) || `Knowledge check ${index + 1}`;
            const correct = question.classList.contains('correct');
            return {
                id,
                label,
                type: 'choice',
                value: selected?.value || '',
                display_value: text(selected?.closest('label')?.textContent) || selected?.value || '',
                unit: '',
                required: true,
                validation: {
                    status: correct ? 'pass' : selected ? 'fail' : 'not_checked',
                    rule: 'Auto-graded knowledge check.',
                    message: correct
                        ? 'Knowledge check answered correctly.'
                        : selected
                            ? 'Knowledge check is not yet correct.'
                            : 'Knowledge check was not answered.'
                }
            };
        });
    }

    function checkpointCriteria(panel, stage) {
        const claimedControls = new Set();
        const checks = [...panel.querySelectorAll('.persist-check')].map((input, index) => ({
            id: fieldId(input, index),
            label: labelFor(input),
            type: 'checklist',
            complete: input.checked,
            message: input.checked ? 'Checklist item confirmed.' : 'Checklist item is incomplete.'
        }));
        panel.querySelectorAll('.persist-check').forEach(input => claimedControls.add(input));

        panel.querySelectorAll('.auto-question').forEach((question, index) => {
            checks.push({
                id: question.dataset.questionId || `knowledge-check-${index + 1}`,
                label: text(question.querySelector('legend, h3, h4, .quiz-title')?.textContent) || `Knowledge check ${index + 1}`,
                type: 'knowledge_check',
                complete: question.classList.contains('correct'),
                message: question.classList.contains('correct') ? 'Knowledge check passed.' : 'Knowledge check is incomplete or incorrect.'
            });
        });

        const orderFeedback = [...panel.querySelectorAll('[data-order-feedback], [data-monitor-feedback], [data-control-feedback]')];
        panel.querySelectorAll('.order-grid[data-dnd-order]').forEach((grid, index) => {
            const localFeedback = grid.parentElement?.querySelectorAll('[data-order-feedback], [data-monitor-feedback], [data-control-feedback]') || [];
            const feedback = localFeedback.length === 1 ? localFeedback[0] : orderFeedback[index];
            const selects = [...grid.querySelectorAll('.order-item select')];
            const complete = selects.length > 0
                ? selects.every((select, selectIndex) => select.value === String(selectIndex + 1))
                : /^Correct\b/i.test(text(feedback?.textContent));
            checks.push({
                id: grid.dataset.key || `ordering-check-${index + 1}`,
                label: `Ordering activity ${index + 1}`,
                type: 'ordering_check',
                complete,
                message: complete ? 'Ordering activity passed.' : 'Ordering activity has not been confirmed as correct.'
            });
        });

        panel.querySelectorAll('input[data-key], select[data-key], textarea[data-key]').forEach((control, index) => {
            if (!isIndividuallyRequired(control)) return;
            if (claimedControls.has(control)) return;
            claimedControls.add(control);
            const evidence = control.matches('input[type="file"]');
            const complete = hasRequiredValue(control);
            checks.push({
                id: fieldId(control, index),
                label: labelFor(control),
                type: evidence ? 'required_evidence' : 'required_response',
                complete,
                message: complete
                    ? `${evidence ? 'Required evidence' : 'Required response'} is complete.`
                    : `${evidence ? 'Required evidence' : 'Required response'} is missing or invalid.`
            });
        });

        panel.querySelectorAll('[data-expected]').forEach((control, index) => {
            if (claimedControls.has(control)) return;
            claimedControls.add(control);
            const complete = matchesExpectedValue(control);
            checks.push({
                id: fieldId(control, index),
                label: labelFor(control),
                type: 'validated_response',
                complete,
                message: complete ? 'Validated response is correct.' : 'Validated response is missing or incorrect.'
            });
        });

        const groups = new Map();
        panel.querySelectorAll('[data-stage-required-group]').forEach(control => {
            const group = control.dataset.stageRequiredGroup;
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group).push(control);
        });
        groups.forEach((controls, group) => {
            const complete = controls.some(hasRequiredValue);
            checks.push({
                id: `required-group-${group}`,
                label: controls[0]?.dataset.exportLabel || `Required response group: ${group}`,
                type: 'required_response_group',
                complete,
                message: complete
                    ? 'At least one valid response was provided for this required group.'
                    : 'At least one valid response is required for this group.'
            });
        });

        const confirmed = stageIsConfirmed(stage);
        checks.push({
            id: `stage-${stage}-confirmation`,
            label: 'Next/Finish stage confirmation',
            type: 'stage_confirmation',
            complete: confirmed,
            message: confirmed
                ? 'The student confirmed this stage with its Next or Finish action.'
                : 'Use the enabled Next or Finish action to confirm this stage.'
        });

        return checks;
    }

    function readLedger() {
        try {
            return JSON.parse(localStorage.getItem(storageKey(CHECKPOINT_PREFIX)) || '{}');
        } catch {
            return {};
        }
    }

    function writeLedger(ledger) {
        if (Object.keys(ledger).length) {
            localStorage.setItem(storageKey(CHECKPOINT_PREFIX), JSON.stringify(ledger));
        } else {
            localStorage.removeItem(storageKey(CHECKPOINT_PREFIX));
        }
    }

    function checkpointState({ panel, stage }, index, trackTimestamp = false) {
        const criteria = checkpointCriteria(panel, stage);
        const required = criteria.length > 0;
        const complete = criteria.every(item => item.complete);
        const id = panel.id || `stage-${stage}`;
        const ledger = readLedger();

        if (trackTimestamp && required) {
            if (complete && !ledger[id]) ledger[id] = new Date().toISOString();
            if (!complete && ledger[id]) delete ledger[id];
            writeLedger(ledger);
        }

        const responses = responseControls(panel).map(responseFor).concat(questionResponses(panel));
        const evidence = evidenceFor(panel);
        const title = stageTitle(stage, panel);
        const completedAt = readLedger()[id] || null;
        return {
            id,
            title,
            required,
            status: complete ? 'complete' : 'incomplete',
            completed_at: completedAt,
            score_hint: {
                category: title,
                possible_marks: null,
                autograde_ready: required
            },
            completion_checks: criteria,
            responses,
            evidence,
            human_readable_summary: required
                ? (complete
                    ? `All ${criteria.length} required browser check${criteria.length === 1 ? '' : 's'} are complete.`
                    : `${criteria.filter(item => !item.complete).length} of ${criteria.length} required browser check${criteria.length === 1 ? '' : 's'} remain incomplete.`)
                : 'No browser completion check is associated with this page.'
        };
    }

    function missingStudentDetails(details) {
        return REQUIRED_STUDENT_DETAILS.filter(field => !text(details[field.key]));
    }

    function buildStatus(trackTimestamp = false) {
        const checkpoints = stagePanels().map((item, index) => checkpointState(item, index, trackTimestamp));
        const requiredCheckpoints = checkpoints.filter(checkpoint => checkpoint.required);
        const missing = requiredCheckpoints.filter(checkpoint => checkpoint.status !== 'complete');
        const details = readStudentDetails();
        const missingDetails = missingStudentDetails(details);
        const studentComplete = missingDetails.length === 0;
        return {
            checkpoints,
            totalRequired: requiredCheckpoints.length,
            completedRequired: requiredCheckpoints.length - missing.length,
            missing,
            missingDetails,
            labComplete: requiredCheckpoints.length > 0 && missing.length === 0,
            studentComplete,
            ready: requiredCheckpoints.length > 0 && missing.length === 0 && studentComplete
        };
    }

    function readStudentDetails() {
        const values = {};
        document.querySelectorAll('[data-completion-detail]').forEach(input => {
            values[input.dataset.completionDetail] = text(input.value);
        });
        return {
            name_or_team: values.name_or_team || '',
            student_numbers: values.student_numbers || '',
            group_number: values.group_number || '',
            lab_section: values.lab_section || '',
            instructor_or_ta: values.instructor_or_ta || ''
        };
    }

    function saveStudentDetail(input) {
        localStorage.setItem(`${storageKey(DETAILS_PREFIX)}:${input.dataset.completionDetail}`, input.value);
    }

    function createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    function addDetailField(grid, { labelText, key, helper, placeholder = '', required = false }) {
        const label = createElement('label', 'completion-detail-field');
        const title = createElement('span', 'completion-detail-label', labelText);
        const input = document.createElement('input');
        input.type = 'text';
        input.autocomplete = key === 'name_or_team' ? 'name' : 'off';
        input.dataset.completionDetail = key;
        input.id = `completion-detail-${labKey()}-${key}`;
        input.placeholder = placeholder;
        input.required = required;
        input.setAttribute('aria-required', String(required));
        input.value = localStorage.getItem(`${storageKey(DETAILS_PREFIX)}:${key}`) || '';
        input.addEventListener('input', () => {
            saveStudentDetail(input);
            scheduleSync();
        });
        label.append(title, input);
        const describedBy = [];
        if (required) {
            const error = createElement('small', 'completion-detail-error', `${labelText} is required.`);
            error.id = `${input.id}-error`;
            error.hidden = true;
            error.setAttribute('role', 'alert');
            describedBy.push(error.id);
            label.append(error);
        }
        if (helper) {
            const help = createElement('small', 'completion-detail-help', helper);
            help.id = `${input.id}-help`;
            describedBy.push(help.id);
            label.append(help);
        }
        if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));
        grid.appendChild(label);
    }

    function renderStudentDetailValidation(status, { focusFirst = false, showErrors = status.labComplete } = {}) {
        const missingKeys = new Set(status.missingDetails.map(field => field.key));
        REQUIRED_STUDENT_DETAILS.forEach(field => {
            const input = document.querySelector(`[data-completion-detail="${field.key}"]`);
            if (!input) return;
            const missing = showErrors && missingKeys.has(field.key);
            input.setAttribute('aria-invalid', String(missing));
            input.closest('.completion-detail-field')?.classList.toggle('is-invalid', missing);
            const error = document.getElementById(`${input.id}-error`);
            if (error) error.hidden = !missing;
        });

        if (focusFirst && status.missingDetails.length) {
            const firstKey = status.missingDetails[0].key;
            const firstInput = document.querySelector(`[data-completion-detail="${firstKey}"]`);
            firstInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.setTimeout(() => firstInput?.focus({ preventScroll: true }), 250);
        }
    }

    function addCompletionCard() {
        if (document.querySelector('[data-completion-export-card]')) return;
        const panels = stagePanels();
        const finalPanel = panels.at(-1)?.panel;
        if (!finalPanel) return;

        const card = createElement('section', 'completion-export-card');
        card.dataset.completionExportCard = 'true';
        card.setAttribute('aria-labelledby', 'completion-file-title');
        card.append(createElement('p', 'completion-export-eyebrow', 'Final submission'));
        const heading = createElement('h2', 'completion-export-title', 'Lab Completion File');
        heading.id = 'completion-file-title';
        card.append(heading);
        card.append(createElement('p', 'completion-export-copy', 'After the required checkpoints are complete, download this completion JSON and submit it as instructed by your instructor. Evidence choosers on the page store filenames only; they do not upload or embed the selected files. Submit the actual VI, report, code, and evidence artifacts through the Avenue to Learn location or other instructor-approved channel specified for your lab section.'));

        const details = createElement('div', 'completion-details');
        details.append(createElement('h3', 'completion-details-title', 'Submission Details'));
        details.append(createElement('p', 'completion-details-copy', 'Enter all four required details before downloading: Name, Student Number, Lab Section, and Lab Instructor or TA.'));
        const grid = createElement('div', 'completion-details-grid');
        addDetailField(grid, {
            labelText: 'Name',
            key: 'name_or_team',
            placeholder: 'e.g., Alex Chen',
            helper: 'Required. Enter the name used for this submission.',
            required: true
        });
        addDetailField(grid, {
            labelText: 'Student Number',
            key: 'student_numbers',
            placeholder: 'e.g., 400123456',
            helper: 'Required. Use comma-separated student numbers for an approved team submission.',
            required: true
        });
        addDetailField(grid, {
            labelText: 'Group Number',
            key: 'group_number',
            placeholder: 'e.g., Group 3',
            helper: 'Optional. Enter this only when your lab uses group numbers.'
        });
        addDetailField(grid, {
            labelText: 'Lab Section',
            key: 'lab_section',
            placeholder: 'e.g., L01',
            helper: 'Required.',
            required: true
        });
        addDetailField(grid, {
            labelText: 'Lab Instructor or TA',
            key: 'instructor_or_ta',
            placeholder: 'e.g., Dr. Chen or Sam Lee',
            helper: 'Required.',
            required: true
        });
        details.append(grid);
        card.append(details);

        const status = createElement('p', 'completion-export-status');
        status.dataset.completionExportStatus = 'true';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        card.append(status);

        const remaining = createElement('ul', 'completion-export-remaining');
        remaining.dataset.completionExportRemaining = 'true';
        card.append(remaining);

        const actions = createElement('div', 'completion-export-actions');
        const download = createElement('button', 'nav-button primary completion-export-button', 'Download Completion File');
        download.type = 'button';
        download.dataset.labExport = 'final';
        actions.append(download);
        card.append(actions);
        card.append(createElement('p', 'completion-export-note', 'This file is intended for instructor review or automated grading. Keep the file unchanged after downloading. It is generated in the browser and is not tamper-proof.'));

        const footer = finalPanel.querySelector('.stage-footer');
        if (footer) footer.before(card);
        else finalPanel.appendChild(card);

        const oldFinalButton = [...finalPanel.querySelectorAll('[data-lab-export]')]
            .find(button => !button.closest('[data-completion-export-card]'));
        if (oldFinalButton && oldFinalButton !== download) oldFinalButton.hidden = true;
    }

    function updateExportButtons(status) {
        document.querySelectorAll('[data-export], [data-lab-export]').forEach(button => {
            const isFinalButton = button.closest('[data-completion-export-card]');
            if (!isFinalButton && button.hidden) return;
            button.disabled = !status.ready;
            button.setAttribute('aria-disabled', String(!status.ready));
            button.textContent = status.ready
                ? 'Download Completion File'
                : 'Completion file locked';
            button.title = status.ready
                ? 'Download the instructor grading file.'
                : 'Complete the required checkpoints and submission details to unlock the completion file.';
        });
    }

    function updateCompletionCard(status) {
        const statusMessage = document.querySelector('[data-completion-export-status]');
        const remaining = document.querySelector('[data-completion-export-remaining]');
        if (!statusMessage || !remaining) return;

        remaining.innerHTML = '';
        if (!status.labComplete) {
            const count = status.missing.length;
            statusMessage.textContent = `Completion file locked. Complete ${count} required checkpoint${count === 1 ? '' : 's'} to unlock it.`;
            statusMessage.className = 'completion-export-status is-locked';
            status.missing.forEach(checkpoint => remaining.appendChild(createElement('li', '', checkpoint.title)));
            remaining.hidden = false;
            return;
        }

        if (!status.studentComplete) {
            statusMessage.textContent = 'Lab checks are complete. Enter your submission details to unlock the completion file.';
            statusMessage.className = 'completion-export-status is-details-needed';
            status.missingDetails.forEach(field => {
                remaining.appendChild(createElement('li', '', `${field.label} is required.`));
            });
            remaining.hidden = false;
            return;
        }

        statusMessage.textContent = 'Lab complete. Download your completion file now.';
        statusMessage.className = 'completion-export-status is-ready';
        remaining.hidden = true;
    }

    function syncCompletionUI() {
        const status = buildStatus(true);
        updateExportButtons(status);
        updateCompletionCard(status);
        renderStudentDetailValidation(status);
        return status;
    }

    function flag(checkpointId, fieldId, severity, message) {
        return { checkpoint_id: checkpointId, field_id: fieldId, severity, message };
    }

    function collectPotentialMarkLossFlags(checkpoints, student, status) {
        const flags = [];
        missingStudentDetails(student).forEach(field => {
            flags.push(flag('submission-details', field.key, 'warning', `${field.label} was not entered.`));
        });

        status.missing.forEach(checkpoint => {
            flags.push(flag(checkpoint.id, '', 'warning', `Required checkpoint is incomplete: ${checkpoint.title}.`));
        });

        checkpoints.forEach(checkpoint => {
            checkpoint.responses.forEach(response => {
                if (response.validation.status === 'fail' || response.validation.status === 'warning') {
                    flags.push(flag(checkpoint.id, response.id, response.validation.status, response.validation.message));
                }
                if (response.required && (response.value === '' || response.value === null)) {
                    flags.push(flag(checkpoint.id, response.id, 'warning', 'Required response is missing.'));
                }
                if ((/reflect|reflection/i.test(checkpoint.title) || /^\d+\.\s/.test(response.label)) && response.type === 'text' && text(response.value).length < 12) {
                    flags.push(flag(checkpoint.id, response.id, 'warning', 'Reflection response is missing or too short for instructor review.'));
                }
            });
            checkpoint.evidence.forEach(evidence => {
                if (!evidence.provided && /(screenshot|evidence|photo|diagram)/i.test(evidence.label)) {
                    flags.push(flag(checkpoint.id, evidence.id, 'warning', `${evidence.label} was not selected in the browser.`));
                }
            });
        });
        return flags;
    }

    function reflectionResponses(checkpoints) {
        return checkpoints.flatMap(checkpoint => checkpoint.responses
            .filter(response => /reflect|reflection/i.test(checkpoint.title) || /^\d+\.\s/.test(response.label))
            .filter(response => response.type === 'text')
            .map(response => ({ question: response.label, answer: response.display_value })));
    }

    async function sha256(value) {
        if (!window.crypto?.subtle || !window.TextEncoder) return '';
        try {
            const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
            return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
        } catch {
            return '';
        }
    }

    async function buildExportData(status) {
        const student = readStudentDetails();
        const flags = collectPotentialMarkLossFlags(status.checkpoints, student, status);
        const validationWarnings = flags
            .filter(item => item.severity === 'warning' || item.severity === 'fail')
            .map(item => item.message);
        const generatedAt = new Date().toISOString();
        const completedAt = status.checkpoints
            .map(checkpoint => checkpoint.completed_at)
            .filter(Boolean)
            .sort()
            .at(-1) || null;
        const data = {
            schema_version: SCHEMA_VERSION,
            course: COURSE,
            lab: {
                lab_number: labNumber(),
                lab_title: text(document.querySelector('h1')?.textContent) || `Lab ${labNumber()}`,
                page_url: window.location.href,
                export_generated_at: generatedAt,
                date_completed: completedAt,
                completion_status: status.labComplete ? 'complete' : 'incomplete',
                completion_percent: status.totalRequired
                    ? Math.round((status.completedRequired / status.totalRequired) * 100)
                    : 0
            },
            student,
            grading_summary: {
                total_required_checkpoints: status.totalRequired,
                completed_required_checkpoints: status.completedRequired,
                missing_required_checkpoints: status.missing.map(checkpoint => ({ id: checkpoint.id, title: checkpoint.title })),
                validation_passed: status.labComplete && validationWarnings.length === 0,
                validation_warnings: validationWarnings,
                potential_mark_loss_flags: flags
            },
            checkpoints: status.checkpoints,
            reflection: reflectionResponses(status.checkpoints),
            integrity_notice: {
                client_side_export: true,
                tamper_proof: false,
                message: 'This file was generated in the browser from recorded lab inputs. It is intended for instructor review or autograding, but it is not cryptographically tamper-proof.'
            }
        };
        const hash = await sha256(JSON.stringify(data));
        if (hash) {
            data.export_hash = hash;
            data.export_hash_algorithm = 'SHA-256';
            data.export_hash_scope = 'JSON content excluding the export_hash fields.';
        }
        return data;
    }

    async function download() {
        const status = syncCompletionUI();
        if (!status.ready) {
            if (status.labComplete && status.missingDetails.length) {
                renderStudentDetailValidation(status, { focusFirst: true, showErrors: true });
            } else {
                document.querySelector('[data-completion-export-card]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        const data = await buildExportData(status);
        const student = readStudentDetails();
        const identifier = safeFilenamePart(student.name_or_team || student.group_number || 'unidentified');
        const filename = `3CC3_Lab${String(labNumber()).padStart(2, '0')}_Completion_${identifier}_${localTimestamp()}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
        return true;
    }

    function clearStoredData() {
        const evidenceNamespace = 'smrttech:evidence-file:';
        const labPathToken = `/labs/${labKey()}`;
        const detailsPrefix = `${storageKey(DETAILS_PREFIX)}:`;
        const ledgerKey = storageKey(CHECKPOINT_PREFIX);
        const confirmationPrefix = `${STAGE_CONFIRM_PREFIX}:${labKey()}:`;
        const keys = [];
        for (let index = 0; index < localStorage.length; index += 1) {
            const key = localStorage.key(index);
            if (key) keys.push(key);
        }
        keys.forEach(key => {
            const normalizedKey = key.replace(/\\/g, '/').toLowerCase();
            const isCurrentLabEvidence = key.startsWith(evidenceNamespace) && normalizedKey.includes(labPathToken);
            if (isCurrentLabEvidence || key.startsWith(detailsPrefix) || key === ledgerKey || key.startsWith(confirmationPrefix)) {
                localStorage.removeItem(key);
            }
        });
        document.querySelectorAll('input[type="file"][data-key]').forEach(input => {
            input.value = '';
            input.setCustomValidity('');
            input.setAttribute('aria-invalid', 'false');
            const preview = document.querySelector(`[data-file-name-for="${input.dataset.key}"]`);
            if (preview) {
                preview.textContent = 'No file selected.';
                preview.classList.remove('is-success', 'is-error');
            }
        });
    }

    let syncQueued = false;
    function scheduleSync() {
        if (syncQueued) return;
        syncQueued = true;
        window.requestAnimationFrame(() => {
            syncQueued = false;
            syncCompletionUI();
        });
    }

    function setup() {
        if (!document.querySelector('[data-export], [data-lab-export]')) return;
        addCompletionCard();
        document.addEventListener('click', event => {
            const button = event.target.closest('[data-export], [data-lab-export]');
            if (!button) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            download();
        }, true);
        document.addEventListener('input', scheduleSync, true);
        document.addEventListener('change', scheduleSync, true);
        document.addEventListener('click', () => window.setTimeout(scheduleSync, 0));
        syncCompletionUI();
    }

    window.LabCompletionExport = {
        buildExportData,
        download,
        getStatus: () => buildStatus(false),
        clearStoredData
    };
    document.addEventListener('DOMContentLoaded', setup);
})();
