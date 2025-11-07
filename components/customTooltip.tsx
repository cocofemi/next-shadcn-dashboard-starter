const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const period = payload[0]?.payload?.period || ''; // e.g. "3-2025" or "45-2025"

    // Format the period label
    let formattedPeriod = '';
    if (period.includes('-')) {
      const [num, year] = period.split('-');
      const numeric = Number(num);
      // If between 1–12 → month, else week
      formattedPeriod =
        numeric >= 1 && numeric <= 12
          ? `${monthNames[numeric - 1]}-${year}` // e.g. "Mar-2025"
          : `Wk${numeric}-${year}`; // e.g. "Wk45-2025"
    }

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-1">
          <p className="text-sm font-medium leading-none">
            {formattedPeriod && formattedPeriod}
          </p>

          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <span className="capitalize text-muted-foreground">
                {entry.name === 'totalRevenue'
                  ? 'Total Revenue'
                  : entry.name === 'totalOrders'
                    ? 'Total Orders'
                    : entry.name}
              </span>

              <span className="font-mono font-medium tabular-nums text-foreground">
                {entry.name === 'totalRevenue' || entry.name === 'Revenue'
                  ? `$${entry.value.toLocaleString()}` // 💰
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
