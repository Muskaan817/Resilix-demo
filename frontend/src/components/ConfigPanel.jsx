import React, { useState, useEffect } from 'react';

export default function ConfigPanel({ currentConfig, onUpdateConfig, isUpdating }) {
  const [form, setForm] = useState({
    maxRetries: 3,
    initialDelay: 300,
    maxDelay: 5000,
    factor: 2,
    strategy: 'exponential',
    jitter: true,
    timeout: 4000,
    failureProbability: 0.6,
    scenario: 'probabilistic',
  });
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (currentConfig) {
      setForm({
        maxRetries: currentConfig.maxRetries ?? 3,
        initialDelay: currentConfig.initialDelay ?? 300,
        maxDelay: currentConfig.maxDelay ?? 5000,
        factor: currentConfig.factor ?? 2,
        strategy: currentConfig.strategy ?? 'exponential',
        jitter: currentConfig.jitter ?? true,
        timeout: currentConfig.timeout ?? 4000,
        failureProbability: currentConfig.failureProbability ?? 0.6,
        scenario: currentConfig.scenario ?? 'probabilistic',
      });
    }
  }, [currentConfig]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    try {
      await onUpdateConfig({
        maxRetries: parseInt(form.maxRetries, 10),
        initialDelay: parseInt(form.initialDelay, 10),
        maxDelay: parseInt(form.maxDelay, 10),
        factor: parseFloat(form.factor),
        strategy: form.strategy,
        jitter: Boolean(form.jitter),
        timeout: parseInt(form.timeout, 10),
        failureProbability: parseFloat(form.failureProbability),
        scenario: form.scenario,
      });
      setFeedback({ type: 'success', message: 'Retry configuration updated dynamically!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleResetDefaults = async () => {
    setFeedback(null);
    try {
      await onUpdateConfig({
        maxRetries: 3,
        initialDelay: 300,
        maxDelay: 5000,
        factor: 2,
        strategy: 'exponential',
        jitter: true,
        timeout: 4000,
        failureProbability: 0.6,
        scenario: 'probabilistic',
      });
      setFeedback({ type: 'success', message: 'Restored default configuration' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="panel-box">
      <div className="panel-header">
        <h2 className="panel-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Resilix Configuration
        </h2>
        <button
          type="button"
          className="btn btn-subtle"
          onClick={handleResetDefaults}
          disabled={isUpdating}
        >
          Reset Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Max Retries</label>
            <input
              type="number"
              name="maxRetries"
              value={form.maxRetries}
              min="0"
              max="10"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Backoff Strategy</label>
            <select
              name="strategy"
              value={form.strategy}
              onChange={handleChange}
              className="form-select"
            >
              <option value="exponential">Exponential (delay * factor^n)</option>
              <option value="fixed">Fixed Delay</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Delay (ms)</label>
            <input
              type="number"
              name="initialDelay"
              value={form.initialDelay}
              min="0"
              step="50"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Max Delay Cap (ms)</label>
            <input
              type="number"
              name="maxDelay"
              value={form.maxDelay}
              min="100"
              step="100"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Exponential Factor</label>
            <input
              type="number"
              name="factor"
              value={form.factor}
              min="1"
              max="5"
              step="0.1"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Timeout Limit (ms)</label>
            <input
              type="number"
              name="timeout"
              value={form.timeout}
              min="500"
              step="500"
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Failure Probability ({Math.round(form.failureProbability * 100)}%)</label>
            <input
              type="range"
              name="failureProbability"
              min="0"
              max="1"
              step="0.05"
              value={form.failureProbability}
              onChange={handleChange}
              style={{ width: '100%', accentColor: 'var(--color-cyan)', marginTop: '6px' }}
            />
          </div>

          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '14px' }}>
              <input
                type="checkbox"
                name="jitter"
                checked={form.jitter}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }}
              />
              <span>Enable Full Jitter (Prevents thundering herds)</span>
            </label>
          </div>
        </div>

        {feedback && (
          <div style={{
            marginTop: '14px',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: feedback.type === 'success' ? 'var(--color-emerald)' : 'var(--color-rose)',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          }}>
            {feedback.message}
          </div>
        )}

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={isUpdating}>
            {isUpdating ? 'Applying...' : 'Apply Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
