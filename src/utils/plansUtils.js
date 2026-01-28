export function transformPlansBySlug(plans) {
  if (!plans || !plans.length) return [];

  const findBySlug = (slug) => plans.find((p) => p.slug === slug);

  const proMonthly = findBySlug("plan1-monthly");
  const proYearly = findBySlug("plan1-yearly");

  const premiumMonthly = findBySlug("plan2-monthly");
  const premiumYearly = findBySlug("plan2-yearly");

  const result = [];

  if (proMonthly || proYearly) {
    result.push({
      name: proMonthly?.name || proYearly?.name,
      monthly: proMonthly || null,
      yearly: proYearly || null,
    });
  }

  if (premiumMonthly || premiumYearly) {
    result.push({
      name: premiumMonthly?.name || premiumYearly?.name,
      monthly: premiumMonthly || null,
      yearly: premiumYearly || null,
    });
  }

  return result;
}
