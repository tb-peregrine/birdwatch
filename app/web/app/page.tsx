import Image from "next/image"
import Link from "next/link"
import { Bird, ListChecks, Map, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 relative">
        <div className="absolute inset-0 min-h-[800px]">
          <Image
            src="/images/hero.jpg"
            alt="Purple Sandpiper in flight"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
        </div>
        <div className="relative px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left py-32 md:py-48 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover a new world of
              <span className="text-primary block">birding</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Track your bird sightings, explore new species, and connect with fellow birders. Start your birding
              journey today.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/checklist">Submit Checklist</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/analytics">View Your Analytics</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <section className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <ListChecks className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Create Checklists</h3>
            <p className="text-muted-foreground">
              Log your bird sightings with detailed checklists including location and species information.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Map className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Explore Locations</h3>
            <p className="text-muted-foreground">
              Discover popular birding spots and track where you&apos;ve seen different species.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              View detailed analytics of your birding journey and track species over time.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t py-6 md:py-0">
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
            <Bird className="h-6 w-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                BirdWatch
              </a>
              . The source code is available on{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

