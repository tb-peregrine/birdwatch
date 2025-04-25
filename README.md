# eBird Clone

A modern web application for birdwatchers to record and track their bird sightings, inspired by eBird. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Bird Checklist Creation**: Create detailed checklists of bird sightings
- **Location Selection**: Choose from a predefined list of birding locations
- **Bird Counting**: Track both species and individual bird counts
- **Date Selection**: Record sightings with specific dates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/yourusername/ebird-clone.git
cd ebird-clone
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

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

- `app/` - Next.js app router pages and components
- `components/` - Reusable UI components
- `lib/` - Utility functions and data
- `public/` - Static assets

## Data

The application uses two main data files:
- `lib/birds.json` - List of bird species with common names
- `lib/locations.json` - List of birding locations

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Next.js project
6. Click "Deploy"

Your site will be deployed at `https://your-project-name.vercel.app`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
