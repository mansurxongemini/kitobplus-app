import React, { useEffect, useState, useCallback } from 'react';
import { get as getPlans, set as setPlan } from '../lib/plans';

/**
 * PremiumPlans
 * - Loads plans on mount via getPlans()
 * - Renders accessible controls per plan:
 *   * Checkbox to enable/disable with label associated by htmlFor/id
 *   * Number input for price with label associated by htmlFor/id
 * - Persists changes immediately by calling setPlan(id, enabled, price)
 * - Basic optimistic UI with per-plan saving/error state
 */
const PremiumPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState({}); // { [id]: boolean }
  const [errors, setErrors] = useState({}); // { [id]: string }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setLoadError('');
    getPlans()
      .then((data) => {
        if (!mounted) return;
        // Expecting array of objects: { id, name, enabled, price }
        setPlans(Array.isArray(data?.plans) ? data.plans : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setLoadError(e?.message || 'Не удалось загрузить планы');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const updatePlanRemote = useCallback(async (id, enabled, price) => {
    setSaving((s) => ({ ...s, [id]: true }));
    setErrors((e) => ({ ...e, [id]: '' }));
    try {
      await setPlan(id, enabled, price);
    } catch (e) {
      setErrors((prev) => ({ ...prev, [id]: e?.message || 'Ошибка сохранения' }));
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  }, []);

  const onToggleEnabled = useCallback(
    (id) => (e) => {
      const enabled = e.target.checked;
      setPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enabled } : p))
      );
      const plan = plans.find((p) => p.id === id);
      const price = plan ? plan.price : 0;
      updatePlanRemote(id, enabled, price);
    },
    [plans, updatePlanRemote]
  );

  const onPriceChange = useCallback(
    (id) => (e) => {
      // Accept only non-negative integers for now
      const value = e.target.value;
      const parsed = value === '' ? '' : Number(value);
      // Optimistically update local state
      setPlans((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, price: value === '' ? '' : isNaN(parsed) ? p.price : Math.max(0, Math.trunc(parsed)) } : p
        )
      );
    },
    []
  );

  const onPriceBlur = useCallback(
    (id) => (e) => {
      const value = e.target.value;
      const plan = plans.find((p) => p.id === id);
      if (!plan) return;
      const enabled = plan.enabled;
      // Normalize/commit numeric price on blur
      const parsed = Number(value);
      const price = value === '' || isNaN(parsed) ? 0 : Math.max(0, Math.trunc(parsed));
      // ensure UI reflects normalized price
      setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, price } : p)));
      updatePlanRemote(id, enabled, price);
    },
    [plans, updatePlanRemote]
  );

  if (loading) {
    return <div role="status" aria-live="polite">Загрузка тарифных планов…</div>;
  }

  if (loadError) {
    return (
      <div role="alert" style={{ color: 'red' }}>
        Ошибка загрузки: {loadError}
      </div>
    );
  }

  if (!plans.length) {
    return <div role="status" aria-live="polite">Планы отсутствуют</div>;
  }

  return (
    <section aria-labelledby="premium-plans-heading">
      <h1 id="premium-plans-heading">Настройка премиум-планов</h1>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {plans.map((plan) => {
          const checkboxId = `plan-enabled-${plan.id}`;
          const priceId = `plan-price-${plan.id}`;
          const helpId = `plan-help-${plan.id}`;
          return (
            <li key={plan.id} style={{ borderBottom: '1px solid #ddd', padding: '12px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <span id={helpId} className="sr-only">
                    {`Настройки плана ${plan.name}`}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={!!plan.enabled}
                      onChange={onToggleEnabled(plan.id)}
                      aria-describedby={helpId}
                    />
                    <label htmlFor={checkboxId}>{plan.name}</label>
                    {saving[plan.id] && (
                      <span role="status" aria-live="polite" style={{ marginLeft: 8 }}>
                        Сохранение…
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label htmlFor={priceId}>Цена</label>
                  <input
                    id={priceId}
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    value={plan.price === '' ? '' : plan.price}
                    onChange={onPriceChange(plan.id)}
                    onBlur={onPriceBlur(plan.id)}
                    aria-describedby={helpId}
                  />
                  <span aria-hidden="true">₽</span>
                </div>

                {errors[plan.id] && (
                  <div role="alert" style={{ color: 'red' }}>
                    {errors[plan.id]}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default PremiumPlans;
