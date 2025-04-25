"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = []

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto py-12">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-lg text-muted-foreground">Track your birding progress and insights</p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Species</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">X</div>
                    <p className="text-xs text-muted-foreground">+X from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Checklists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">X</div>
                    <p className="text-xs text-muted-foreground">+X from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">X</div>
                    <p className="text-xs text-muted-foreground">+X from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">X</div>
                    <p className="text-xs text-muted-foreground">+X from last month</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Bird Sightings Over Time</CardTitle>
                  <CardDescription>Number of birds spotted per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "hsl(var(--foreground))" }}
                          tickLine={{ stroke: "hsl(var(--foreground))" }}
                        />
                        <YAxis
                          tick={{ fill: "hsl(var(--foreground))" }}
                          tickLine={{ stroke: "hsl(var(--foreground))" }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-medium">Date:</div>
                                    <div>{payload[0].payload.date}</div>
                                    <div className="font-medium">Count:</div>
                                    <div>{payload[0].value}</div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

