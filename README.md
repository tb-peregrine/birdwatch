# Birdwatch (eBird Clone)

A demo web application for birdwatchers to record and track their bird sightings, inspired by eBird. Built with Next.js, TypeScript, and Tinybird.

## Features

- **Bird Checklist Creation**: Create detailed checklists of bird sightings
- **Location Selection**: Choose from a predefined list of birding locations
- **Bird Counting**: Track both species and individual bird counts
- **Date Selection**: Record sightings with specific dates
- **Analytics Dashboard**: View bird sighting trends over time
  - Timeseries charts showing species counts by day
  - Total counts for birds, species, checklists, and locations
  - Filter by date range and location
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [Tinybird](https://www.tinybird.co/) - Real-time analytics and data processing
- [Recharts](https://recharts.org/) - Charting library for React

## Getting Started

First, fork the repository.

```bash
git clone https://github.com/yourusername/birdwatch.git
cd birdwatch
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Install the Tinybird CLI and login:
```bash
curl https://tinybird.co | sh
tb login
```

Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:
- `NEXT_PUBLIC_TINYBIRD_API_URL`: Your Tinybird API URL
- `NEXT_PUBLIC_TINYBIRD_API_TOKEN`: Your Tinybird API token

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/web/` - Next.js app router pages, components, utilities, etc.
- `tinybird/` - Tinybird data sources and endpoints

## Data

- Tinybird data sources:
  - `bird_sightings` - Stores checklist data
- Tinybird endpoint pipes:
  - `timeseries_species_by_day` - Aggregates sightings by species and day
  - `get_totals` - Calculates total counts for birds, species, checklists, and locations

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add your Tinybird environment variables
6. Vercel will automatically detect it's a Next.js project
7. Click "Deploy"

Your site will be deployed at `https://your-project-name.vercel.app`

### Deploying to Tinybird

From the `tinybird` directory, run `tb --cloud deploy` to deploy your API to the TInybird workspace. Update your environment variables in Vercel with your host and token.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
