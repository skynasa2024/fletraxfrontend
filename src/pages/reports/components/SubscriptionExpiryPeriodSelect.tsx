import { useIntl } from 'react-intl';
import { useState } from 'react';

export function SubscriptionExpiryPeriodSelect() {
  const intl = useIntl();

  return (
    <select name="period" className="select">
      <option value="">Select period</option>
      <option value="today">Today</option>
      <option value="this_week">This Week</option>
      <option value="this_month">This Month</option>
      <option value="this_year">This Year</option>
    </select>
  );
}
