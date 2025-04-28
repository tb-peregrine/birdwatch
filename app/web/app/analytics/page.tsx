"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { fetchTimeseriesData, fetchTotalData, TimeseriesData } from "@/lib/tinybird"
import { subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import locations from "@/lib/locations.json"

export default function AnalyticsPage() {
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesData[]>([])
  const [totalData, setTotalData] = useState({
    total_birds: 0,
    total_checklists: 0,
    total_locations: 0,
    total_species: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [showLocationList, setShowLocationList] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [timeseries, totals] = await Promise.all([
        fetchTimeseriesData({
          startDate,
          endDate,
          location: selectedLocation
        }),
        fetchTotalData({
          startDate,
          endDate,
          location: selectedLocation
        })
      ])

      // Group the data by day and sum the birds_count
      const groupedData = timeseries.reduce((acc, curr) => {
        const existingDay = acc.find(item => item.day === curr.day)
        if (existingDay) {
          existingDay.birds_count += curr.birds_count
        } else {
          acc.push({ ...curr })
        }
        return acc
      }, [] as TimeseriesData[])

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
  }, [startDate, endDate, selectedLocation])

  const selectedLocationLabel = locations.find(
    (loc) => loc.value === selectedLocation
  )?.label

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date)
    }
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

            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Filter your analytics data by date range and location</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search locations..."
                      value={selectedLocationLabel || locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onFocus={() => setShowLocationList(true)}
                      className="w-full"
                    />
                    {showLocationList && (
                      <div className="absolute z-10 w-full mt-1">
                        <Command className="rounded-lg border shadow-md">
                          <CommandList>
                            <CommandEmpty>No locations found.</CommandEmpty>
                            <CommandGroup>
                              {locations
                                .filter((location) =>
                                  location.label
                                    .toLowerCase()
                                    .includes(locationSearch.toLowerCase())
                                )
                                .map((location) => (
                                  <CommandItem
                                    key={location.value}
                                    onSelect={() => {
                                      setSelectedLocation(location.value)
                                      setShowLocationList(false)
                                      setLocationSearch("")
                                    }}
                                  >
                                    {location.label}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  <CardDescription>Number of birds spotted per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeseriesData}>
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
                        <Area type="monotone" dataKey="birds_count" stroke="hsl(var(--primary))" fill="url(#colorCount)" />
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

