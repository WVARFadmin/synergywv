import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SCALES } from '../data/surveys.js';
import { loadProfile, saveProfile, submitSurvey } from '../data/surveyStore.js';

// A row of numbered buttons (radios) with the end labels underneath. The
// chosen option's full wording is shown, and each radio carries its full
// wording for screen readers.
function Scale({ name, labels, value, onChange, numbered = true, extra, ends }) {
  return (
    <div className="sv-scale-wrap">
      <div className={`sv-scale${labels.length > 7 ? ' is-wide' : ''}`}>
        {labels.map((lab, i) => {
          const v = numbered ? String(i + (labels.length === 11 ? 0 : 1)) : lab;
          const on = value === v;
          return (
            <label key={lab} className={`sv-scale-btn${on ? ' on' : ''}`}>
              <input type="radio" name={name} value={v} checked={on} onChange={() => onChange(v)}
                aria-label={labels.length === 11 ? `${v} out of 10` : lab} />
              <span aria-hidden="true">{numbered ? v : lab}</span>
            </label>
          );
        })}
        {extra && (
          <label className={`sv-scale-btn sv-na${value === extra ? ' on' : ''}`}>
            <input type="radio" name={name} value={extra} checked={value === extra} onChange={() => onChange(extra)} />
            <span>{extra}</span>
          </label>
        )}
      </div>
      <div className="sv-scale-ends" aria-hidden="true">
        <span>{ends ? ends[0] : labels[0]}</span>
        <span className="sv-scale-picked">
          {value && value !== extra && labels.length !== 11 ? labels[+value - 1] : ''}
        </span>
        <span>{ends ? ends[1] : labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}

function Question({ q, value, onChange }) {
  const id = useId();
  const set = (v) => onChange(q.id, v);

  if (q.type === 'text' || q.type === 'short' || q.type === 'email') {
    return (
      <div className="sv-q">
        <label className="sv-label" htmlFor={id}>{q.label}</label>
        {q.type === 'text'
          ? <textarea id={id} name={q.id} rows={3} value={value || ''} onChange={e => set(e.target.value)} />
          : <input id={id} name={q.id} type={q.type === 'email' ? 'email' : 'text'} autoComplete={q.autoComplete}
              value={value || ''} onChange={e => set(e.target.value)} />}
      </div>
    );
  }

  if (q.type === 'grid') {
    const labels = q.scale.slice(0, -1);
    const extra = q.scale[q.scale.length - 1];
    return (
      <fieldset className="sv-q sv-grid">
        <legend className="sv-label">{q.label}</legend>
        {q.rows.map(r => {
          const key = `${q.id}_${r.id}`;
          return (
            <fieldset key={r.id} className="sv-grid-row">
              <legend>{r.label}</legend>
              <Scale name={key} labels={labels} extra={extra} value={value?.[key]} onChange={v => onChange(key, v)} />
            </fieldset>
          );
        })}
      </fieldset>
    );
  }

  let body;
  if (SCALES[q.type]) {
    body = <Scale name={q.id} labels={SCALES[q.type]} value={value} onChange={set} />;
  } else if (q.type === 'nps') {
    const labels = Array.from({ length: 11 }, (_, i) => String(i));
    body = <Scale name={q.id} labels={labels} value={value} onChange={set} ends={['Not at all likely', 'Extremely likely']} />;
  } else if (q.type === 'choice') {
    body = (
      <div className="sv-options">
        {q.options.map(o => (
          <label key={o} className={`sv-opt${value === o ? ' on' : ''}`}>
            <input type="radio" name={q.id} value={o} checked={value === o} onChange={() => set(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    );
  } else if (q.type === 'multi') {
    const list = value || [];
    body = (
      <div className="sv-options sv-multi">
        {q.options.map(o => {
          const on = list.includes(o);
          return (
            <label key={o} className={`sv-opt${on ? ' on' : ''}`}>
              <input type="checkbox" name={q.id} value={o} checked={on}
                onChange={() => set(on ? list.filter(x => x !== o) : [...list, o])} />
              <span>{o}</span>
            </label>
          );
        })}
      </div>
    );
  }
  return (
    <fieldset className={`sv-q${q.type === 'nps' ? ' sv-nps' : ''}`}>
      <legend className="sv-label">{q.label}</legend>
      {body}
    </fieldset>
  );
}

/**
 * Renders a survey from surveys.js and sends it.
 * `hidden` is extra data sent with the answers (e.g. which session).
 */
export function SurveyForm({ survey, heading, subheading, hidden = {}, onDone, onCancel }) {
  const remembered = survey.sections.flatMap(s => s.questions).filter(q => q.remember).map(q => q.id);
  const [answers, setAnswers] = useState(() => {
    const p = loadProfile();
    return Object.fromEntries(remembered.filter(k => p[k]).map(k => [k, p[k]]));
  });
  const [state, setState] = useState('editing'); // editing | sending | sent | queued

  const onChange = (k, v) => setAnswers(a => ({ ...a, [k]: v }));
  const answered = Object.entries(answers).some(([k, v]) => !remembered.includes(k) && v && v.length !== 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!answered || state === 'sending') return;
    setState('sending');
    saveProfile({ ...loadProfile(), ...Object.fromEntries(remembered.map(k => [k, answers[k] || ''])) });
    // Scale answers are sent as "4 - Agree" so the export reads on its own
    // and can still be sorted or averaged by the leading number.
    const payload = { ...answers };
    for (const q of survey.sections.flatMap(sec => sec.questions)) {
      const labels = SCALES[q.type] || (q.type === 'grid' ? q.scale.slice(0, -1) : null);
      if (!labels) continue;
      const keys = q.type === 'grid' ? q.rows.map(r => `${q.id}_${r.id}`) : [q.id];
      for (const k of keys) {
        const v = payload[k];
        if (v && /^\d+$/.test(v)) payload[k] = `${v} - ${labels[+v - 1]}`;
      }
    }
    const result = await submitSurvey(survey.formName, { ...hidden, ...payload });
    setState(result);
    onDone?.(result);
    window.scrollTo(0, 0);
  };

  if (state === 'sent' || state === 'queued') {
    return (
      <div className="sv-thanks" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h3>Thank you!</h3>
        <p>{state === 'sent'
          ? 'Your feedback was sent. It helps us plan sessions that are more useful to you.'
          : 'You seem to be offline. Your answers are saved on this phone and will send automatically when you’re back online.'}</p>
        <button type="button" className="sv-secondary" onClick={onCancel}>Back to feedback</button>
      </div>
    );
  }

  return (
    <form className="sv-form" onSubmit={submit} name={survey.formName} noValidate>
      <div className="sv-head">
        <h2>{heading || survey.title}</h2>
        {subheading && <p className="sv-sub">{subheading}</p>}
        <p className="sv-intro">{survey.intro}</p>
      </div>
      {survey.sections.map(sec => (
        <section key={sec.title} className="sv-section">
          <h3>{sec.title}</h3>
          {sec.note && <p className="sv-note">{sec.note}</p>}
          {sec.questions.map(q => (
            <Question key={q.id} q={q} value={q.type === 'grid' ? answers : answers[q.id]} onChange={onChange} />
          ))}
        </section>
      ))}
      <div className="sv-actions">
        <button type="submit" className="sv-submit" disabled={!answered || state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send feedback'}
        </button>
        {!answered && <p className="sv-hint">Answer at least one question to send.</p>}
        <button type="button" className="sv-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
