'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart, Cell, Tooltip, Legend } from 'recharts';

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

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { UserContext } from '@/context/UserProvider';
import { CurrentUserContextType } from '@/@types/user';
import { getAllFulfillments, getStoreFulfillments } from '@/utils/analytics';
import { CustomTooltip } from '@/components/customTooltip';
import { EmptyAnalyticsScreen } from '@/components/emptyAnalytics';
import { Spinner } from '@/components/ui/spinner';
const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-other)' }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))'
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))'
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))'
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))'
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const [data, setData] = React.useState<{ value: number }[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [days, setDays] = React.useState('30');
  const COLORS = ['#00B894', 'hsl(var(--chart-5))'];

  React.useEffect(() => {
    setLoading(true);
    if (user?.token && user?.role === 'store') {
      getStoreFulfillments(user?.storeId, Number(days), user?.token)
        .then((res) => {
          setLoading(false);
          setData(res?.data);
        })
        .catch((e) => {
          console.log('Problem fetching revenue', e);
          setLoading(false);
        });
    } else if (user?.token) {
      getAllFulfillments(Number(days), user?.token)
        .then((res) => {
          setLoading(false);
          setData(res?.data);
        })
        .catch((e) => {
          console.log('Problem fetching revenue', e);
          setLoading(false);
        });
    }
  }, [user?.token, days]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut interactive</CardTitle>
        <CardDescription>Showing fulfilments</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex w-10 justify-start">
          <Select onValueChange={setDays}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Filter</SelectLabel> */}
                <SelectItem value="7">7d</SelectItem>
                <SelectItem value="30">30d</SelectItem>
                <SelectItem value="60">60d</SelectItem>
                <SelectItem value="90">90d</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          {loading ? (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          ) : data?.some((d) => d?.value > 0) ? (
            <PieChart width={250} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={5}
                dataKey="value"
              >
                {data?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : (
            <EmptyAnalyticsScreen />
          )}

          {/* <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart> */}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {data?.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              {(() => {
                const left = data[0]?.value ?? 0;
                const right = data[1]?.value ?? 0;
                const denom = left + right || 1;
                return ((left / denom) * 100).toFixed(1);
              })()}
              % of orders fulfilled so far
            </p>
          )}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total fulfillments for period of time.
        </div>
      </CardFooter>
    </Card>
  );
}
