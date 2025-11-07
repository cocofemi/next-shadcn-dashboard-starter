'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { formatPeriodLabel } from '@/utils/formatPeriodLabel';

import { getStoreRevenue, getAllRevenue } from '@/utils/analytics';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { UserContext } from '@/context/UserProvider';
import { CurrentUserContextType } from '@/@types/user';
import { CustomTooltip } from '@/components/customTooltip';
import React from 'react';
import { EmptyAnalyticsScreen } from '@/components/emptyAnalytics';
import { Spinner } from '@/components/ui/spinner';
const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 }
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const [storeRevenue, setStoreRevenue] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [period, setPeriod] = useState('weekly');
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

  useEffect(() => {
    setLoading(true);
    if (user?.token && user?.role === 'store') {
      getStoreRevenue(user?.storeId, period, user?.token)
        .then((res) => {
          let formattedData;
          if (period === 'monthly') {
            formattedData = res?.data.map((item: any) => ({
              ...item,
              label: item.month ? monthNames[item.month - 1] : `W${item.week}` // week fallback
            }));
          } else {
            formattedData = res?.data.map((item: any) => ({
              ...item,
              label: `Week ${item.week}`
            }));
          }
          setLoading(false);
          setStoreRevenue(formattedData);
        })
        .catch((e) => {
          console.log('Problem fetching revenue', e);
          setLoading(false);
        });
    } else if (user?.token) {
      getAllRevenue(period, user?.token).then((res) => {
        setLoading(false);
        setStoreRevenue(res?.data);
      });
    }
  }, [user?.token, period]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>

        <div className="flex justify-between">
          <CardDescription>Showing total store revenue</CardDescription>
          <Select onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Filter</SelectLabel> */}
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          {loading ? (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          ) : storeRevenue?.length > 0 ? (
            <AreaChart data={storeRevenue}>
              <XAxis
                dataKey="period"
                tickFormatter={(value) => formatPeriodLabel(value)}
              />

              <XAxis
                dataKey={period === 'monthly' ? 'label' : 'label'}
                tickFormatter={(v) => v}
              />
              <YAxis tickFormatter={(v) => `$${v.toFixed(0)}`} />
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalRevenue"
                stroke="#00B894"
                fill="#00B89433"
              />
            </AreaChart>
          ) : (
            <EmptyAnalyticsScreen />
          )}

          {/* <AreaChart
            accessibilityLayer
            data={storeRevenue}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart> */}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - December
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
