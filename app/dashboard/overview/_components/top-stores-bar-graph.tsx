'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, Legend } from 'recharts';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { getTopStores } from '@/utils/analytics';
import { UserContext } from '@/context/UserProvider';
import { CurrentUserContextType } from '@/@types/user';

export const description = 'An interactive bar chart';
const chartConfig = {
  totalRevenue: {
    label: 'Total Revenue',
    color: '#E66100'
  },
  totalOrders: {
    label: 'Total Orders',
    color: '#E66100'
  }
} satisfies ChartConfig;

import { CustomTooltip } from '@/components/customTooltip';
import { Spinner } from '@/components/ui/spinner';

export function TopStoresBarGraph() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [days, setDays] = React.useState('10');

  React.useEffect(() => {
    setLoading(true);
    if (user?.token) {
      getTopStores(Number(days), user?.token)
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
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <div className="flex justify-between">
            <CardDescription>
              Highest performing stores by revenue.
            </CardDescription>
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
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig}>
          {loading ? (
            <div className="flex h-screen items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <BarChart layout="vertical" data={data}>
              <XAxis type="number" />
              <YAxis dataKey="storeName" type="category" width={70} />
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Legend />

              <Bar
                dataKey="totalRevenue"
                name="Revenue"
                fill="#0984E3"
                barSize={40}
                radius={2}
              />
              <Bar
                dataKey="totalOrders"
                name="Orders"
                fill="#00B894"
                barSize={40}
                radius={2}
              />
            </BarChart>
          )}

          {/* <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="storeName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="totalRevenue" stackId="a" fill="#0C7BDC" radius={4} />
            <Bar dataKey="totalOrders" stackId="a" fill="#E66100" radius={4} />
          </BarChart> */}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
