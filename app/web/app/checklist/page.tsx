"use client"

import { useState } from "react"
import { CalendarIcon, MapPin, Plus, X, Minus } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SiteHeader } from "@/components/site-header"
import { cn } from "@/lib/utils"
import birds from "@/lib/birds.json"
import locations from "@/lib/locations.json"
import { sendChecklistData } from "@/lib/tinybird"

interface Bird {
  label: string
  value: string
}

interface Location {
  label: string
  value: string
}

interface SelectedBird {
  value: string
  label: string
  count: number
}

export default function ChecklistPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [selectedBirds, setSelectedBirds] = useState<SelectedBird[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [showLocationList, setShowLocationList] = useState(false)
  const [showBirdList, setShowBirdList] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")
  const [birdSearch, setBirdSearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [openDate, setOpenDate] = useState(false)

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setOpenDate(false)
    }
  }

  const handleAddBird = (bird: Bird) => {
    setSelectedBirds((prev) => {
      const existingBird = prev.find((b) => b.value === bird.value)
      if (existingBird) {
        return prev.map((b) =>
          b.value === bird.value ? { ...b, count: b.count + 1 } : b
        )
      }
      return [...prev, { ...bird, count: 1 }]
    })
    setShowBirdList(false)
    setBirdSearch("")
  }

  const handleIncrementBird = (birdValue: string) => {
    setSelectedBirds((prev) =>
      prev.map((b) =>
        b.value === birdValue ? { ...b, count: b.count + 1 } : b
      )
    )
  }

  const handleDecrementBird = (birdValue: string) => {
    setSelectedBirds((prev) =>
      prev.map((b) =>
        b.value === birdValue ? { ...b, count: Math.max(0, b.count - 1) } : b
      )
    )
  }

  const handleRemoveBird = (birdValue: string) => {
    setSelectedBirds((prev) => prev.filter((b) => b.value !== birdValue))
  }

  const selectedLocationLabel = locations.find(
    (loc) => loc.value === selectedLocation
  )?.label

  const handleSubmit = async () => {
    if (!date || !selectedLocation || selectedBirds.length === 0) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const checklistId = uuidv4()
      const sightings = selectedBirds.map(bird => ({
        timestamp: date.toISOString(),
        location: selectedLocation,
        species: bird.value,
        quantity: bird.count,
        checklist_id: checklistId
      }))

      await sendChecklistData(sightings)
      setMessage({ type: "success", text: "Checklist submitted successfully!" })
      setTimeout(() => {
        router.push(`/analytics?location=${encodeURIComponent(selectedLocation)}`)
      }, 1500)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit checklist" })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto py-12">
          <Card>
            <CardHeader>
              <CardTitle>Create a Checklist</CardTitle>
              <CardDescription>Record your bird sightings for today</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
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
                              .map((location: Location) => (
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

              <div className="grid gap-2">
                <Label>Date</Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>Birds</Label>
                <div className="relative">
                  <Input
                    placeholder="Search birds..."
                    value={birdSearch}
                    onChange={(e) => setBirdSearch(e.target.value)}
                    onFocus={() => setShowBirdList(true)}
                    className="w-full"
                  />
                  {showBirdList && (
                    <div className="absolute z-10 w-full mt-1">
                      <Command className="rounded-lg border shadow-md">
                        <CommandList>
                          <CommandEmpty>No birds found.</CommandEmpty>
                          <CommandGroup>
                            {birds
                              .filter((bird) =>
                                bird.label.toLowerCase().includes(birdSearch.toLowerCase())
                              )
                              .map((bird: Bird) => (
                                <CommandItem
                                  key={bird.value}
                                  onSelect={() => {
                                    handleAddBird(bird)
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddBird(bird)
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                    <span>{bird.label}</span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>

                {selectedBirds.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedBirds.map((bird) => (
                      <div
                        key={bird.value}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleIncrementBird(bird.value)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDecrementBird(bird.value)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground w-8 text-center">
                            {bird.count}
                          </span>
                          <span>{bird.label}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveBird(bird.value)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Species: {selectedBirds.length}</span>
                      <span>Individuals: {selectedBirds.reduce((sum, bird) => sum + bird.count, 0)}</span>
                    </div>
                  </div>
                )}
              </div>

              {message && (
                <div className={cn(
                  "p-3 rounded-md",
                  message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !date || !selectedLocation || selectedBirds.length === 0}
              >
                {isSubmitting ? "Submitting..." : "Save Checklist"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

