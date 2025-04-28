"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import locations from "@/lib/locations.json"
import { fetchTimeseriesData, fetchTotalData } from "@/lib/tinybird"

interface TimeseriesData {
  day: string
  species: string
  species_count: number
  birds_count: number
}

interface TotalData {
  total_birds?: number
  total_checklists?: number
  total_locations?: number
  total_species?: number
}

export default function AnalyticsPage() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [showLocationList, setShowLocationList] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(new Date().setHours(0, 0, 0, 0)), // today
  })
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([])
  const [totalData, setTotalData] = useState<TotalData>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [timeseries, totals] = await Promise.all([
          fetchTimeseriesData({
            startDate: dateRange.from,
            endDate: dateRange.to,
            locations: selectedLocations,
          }),
          fetchTotalData({
            startDate: dateRange.from,
            endDate: dateRange.to,
            locations: selectedLocations,
          }),
        ])
        setTimeseriesData(timeseries)
        setTotalData(totals)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange.from, dateRange.to, selectedLocations])

  // Transform timeseries data for the chart
  const chartData = timeseriesData.reduce((acc, curr) => {
    const existingDay = acc.find((item) => item.day === curr.day)
    if (existingDay) {
      existingDay.count += curr.birds_count
    } else {
      acc.push({
        day: curr.day,
        count: curr.birds_count,
      })
    }
    return acc
  }, [] as { day: string; count: number }[])

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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Locations</label>
                <Popover open={showLocationList} onOpenChange={setShowLocationList}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={showLocationList}
                      className="w-full justify-between"
                    >
                      {selectedLocations.length > 0
                        ? `${selectedLocations.length} locations selected`
                        : "Select locations..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search locations..."
                        value={locationSearch}
                        onValueChange={setLocationSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No locations found.</CommandEmpty>
                        <CommandGroup>
                          {locations
                            .filter((location) =>
                              location.label.toLowerCase().includes(locationSearch.toLowerCase())
                            )
                            .map((location) => (
                              <CommandItem
                                key={location.value}
                                onSelect={() => {
                                  setSelectedLocations((prev) =>
                                    prev.includes(location.value)
                                      ? prev.filter((value) => value !== location.value)
                                      : [...prev, location.value]
                                  )
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedLocations.includes(location.value) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {location.label}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Species</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_species || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Individuals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_birds || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Checklists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_checklists || 0}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalData.total_locations || 0}</div>
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
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
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
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="font-medium">Date:</div>
                                    <div>{payload[0].payload.day}</div>
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

