"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { fetchTimeseriesData, fetchTotalData } from "@/lib/tinybird"
import { subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import locations from "@/lib/locations.json"
import birds from "@/lib/birds.json"

interface TimeseriesDataPoint {
  day: string;
  [species: string]: number | string;
}

export default function AnalyticsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesDataPoint[]>([])
  const [totalData, setTotalData] = useState({
    total_birds: 0,
    total_checklists: 0,
    total_locations: 0,
    total_species: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [timeseries, totals] = await Promise.all([
        fetchTimeseriesData(),
        fetchTotalData()
      ])

      // Group the data by day and species
      const groupedData = timeseries.reduce((acc, curr) => {
        const existingDay = acc.find(item => item.day === curr.day)
        if (existingDay) {
          existingDay[curr.species] = (existingDay[curr.species] as number || 0) + curr.birds_count
        } else {
          const newDay: TimeseriesDataPoint = { day: curr.day }
          newDay[curr.species] = curr.birds_count
          acc.push(newDay)
        }
        return acc
      }, [] as TimeseriesDataPoint[])

      setTimeseriesData(groupedData)
      setTotalData(totals)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getBirdLabel = (value: string) => {
    const bird = birds.find(b => b.value === value)
    return bird ? bird.label : value
  }

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
                    <CardTitle className="text-sm font-medium">Total Birds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_birds}</div>
                    <p className="text-xs text-muted-foreground">Total individual birds</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Species</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_species}</div>
                    <p className="text-xs text-muted-foreground">Unique species observed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Checklists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_checklists}</div>
                    <p className="text-xs text-muted-foreground">Checklists submitted</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_locations}</div>
                    <p className="text-xs text-muted-foreground">Unique locations visited</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Bird Sightings Over Time</CardTitle>
                  <CardDescription>Number of birds spotted per day by species</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeseriesData}>
                        <defs>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={`hsl(${i * 36}, 70%, 50%)`} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={`hsl(${i * 36}, 70%, 50%)`} stopOpacity={0} />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="day"
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
                                  <div className="grid gap-2">
                                    <div className="font-medium">Date: {payload[0].payload.day}</div>
                                    {payload.map((entry, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <div>{getBirdLabel(entry.name as string)}: {entry.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          align="left"
                          layout="vertical"
                          height={36}
                          wrapperStyle={{
                            paddingRight: '20px'
                          }}
                          formatter={(value) => getBirdLabel(value)}
                        />
                        {Object.keys(timeseriesData[0] || {})
                          .filter(key => key !== 'day')
                          .slice(0, 10)
                          .map((species, index) => (
                            <Area
                              key={species}
                              type="monotone"
                              dataKey={species}
                              name={species}
                              stroke={`hsl(${index * 36}, 70%, 50%)`}
                              fill={`url(#color${index})`}
                              stackId={undefined}
                            />
                          ))}
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

