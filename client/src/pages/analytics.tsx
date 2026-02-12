import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, BarChart3, Calendar, Sun, Snowflake, Leaf, CloudRain, Target, Receipt, Wallet } from "lucide-react";
import { JOB_CATEGORY_LABELS, type JobCategory } from "@shared/schema";

interface AnalyticsData {
  trend: Array<{ month: string; revenue: number; cost: number; profit: number; jobCount: number; expenses?: number }>;
  categoryBreakdown: Record<string, { revenue: number; cost: number; profit: number; count: number }>;
  seasonal: Record<string, { revenue: number; profit: number; count: number }>;
  totals: { revenue: number; cost: number; profit: number };
  avgMonthlyProfit: number;
  prediction: number;
  totalJobs: number;
  totalExpenses?: number;
  netProfit?: number;
  expensesByCategory?: Record<string, number>;
}

const seasonIcons: Record<string, any> = {
  "Dimër": Snowflake,
  "Pranverë": Leaf,
  "Verë": Sun,
  "Vjeshtë": CloudRain,
};

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/profit"],
  });

  if (isLoading || !analytics) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Duke u ngarkuar...</div>
      </Layout>
    );
  }

  const profitMargin = analytics.totals.revenue > 0
    ? ((analytics.totals.profit / analytics.totals.revenue) * 100).toFixed(1)
    : "0";

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-analytics-title">Analiza e Avancuar e Fitimit</h1>
          <p className="text-muted-foreground">Trende, parashikime dhe analiza sezonal</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-revenue">{analytics.totals.revenue.toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Të ardhura totale</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-total-profit">{analytics.totals.profit.toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Fitim total ({profitMargin}%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-avg-monthly">{analytics.avgMonthlyProfit.toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Mesatare mujore</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-prediction">{analytics.prediction.toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Parashikim mujor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {(analytics.totalExpenses !== undefined && analytics.totalExpenses > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-expenses">{analytics.totalExpenses.toFixed(2)}€</p>
                    <p className="text-sm text-muted-foreground">Shpenzime totale</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold text-emerald-600" data-testid="text-net-profit">{(analytics.netProfit || 0).toFixed(2)}€</p>
                    <p className="text-sm text-muted-foreground">Fitim neto (pas shpenzimeve)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {analytics.expensesByCategory && Object.keys(analytics.expensesByCategory).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Shpenzime sipas kategorisë</p>
                  <div className="space-y-1">
                    {Object.entries(analytics.expensesByCategory).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, amount]) => (
                      <div key={cat} className="flex items-center justify-between text-sm" data-testid={`expense-cat-${cat}`}>
                        <span className="capitalize">{cat}</span>
                        <span className="font-medium">{amount.toFixed(0)}€</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trendi Mujor</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.trend.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Ende nuk ka të dhëna</p>
              ) : (
                <div className="space-y-3">
                  {analytics.trend.map(month => {
                    const maxRevenue = Math.max(...analytics.trend.map(t => t.revenue), 1);
                    const barWidth = (month.revenue / maxRevenue) * 100;
                    return (
                      <div key={month.month} className="space-y-1" data-testid={`trend-month-${month.month}`}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{month.month}</span>
                          <span className="text-muted-foreground">{month.jobCount} punë</span>
                        </div>
                        <div className="h-6 bg-muted rounded-md overflow-hidden relative">
                          <div
                            className="h-full bg-primary/20 rounded-md"
                            style={{ width: `${barWidth}%` }}
                          />
                          <div
                            className="h-full bg-green-500/30 rounded-md absolute top-0 left-0"
                            style={{ width: `${(month.profit / maxRevenue) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between gap-2 flex-wrap text-xs text-muted-foreground">
                          <span>Të ardhura: {month.revenue.toFixed(0)}€</span>
                          {(month.expenses || 0) > 0 && <span className="text-red-500">Shpenzime: {(month.expenses || 0).toFixed(0)}€</span>}
                          <span>Fitim: {month.profit.toFixed(0)}€</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analiza Sezonal</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.seasonal).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Ende nuk ka të dhëna</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics.seasonal).map(([season, data]) => {
                    const SeasonIcon = seasonIcons[season] || Calendar;
                    return (
                      <div key={season} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                        data-testid={`season-${season}`}>
                        <SeasonIcon className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{season}</h4>
                          <p className="text-sm text-muted-foreground">{data.count} punë</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{data.profit.toFixed(0)}€</p>
                          <p className="text-xs text-muted-foreground">fitim</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performanca sipas Kategorisë</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(analytics.categoryBreakdown).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Ende nuk ka të dhëna</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(analytics.categoryBreakdown).map(([category, data]) => {
                  const margin = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : "0";
                  return (
                    <div key={category} className="p-4 rounded-lg bg-muted/30 space-y-2"
                      data-testid={`category-perf-${category}`}>
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline">
                          {JOB_CATEGORY_LABELS[category as JobCategory] || category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{data.count} punë</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-sm font-bold">{data.revenue.toFixed(0)}€</p>
                          <p className="text-xs text-muted-foreground">Të ardhura</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold">{data.cost.toFixed(0)}€</p>
                          <p className="text-xs text-muted-foreground">Kosto</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-600">{data.profit.toFixed(0)}€</p>
                          <p className="text-xs text-muted-foreground">Fitim ({margin}%)</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
