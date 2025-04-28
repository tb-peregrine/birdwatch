import { forwardRef, ReactNode, HTMLAttributes } from "react"

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Chart = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
Chart.displayName = "Chart"

export const ChartContainer = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartContainer.displayName = "ChartContainer"

export const ChartCursor = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartCursor.displayName = "ChartCursor"

export const ChartGrid = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartGrid.displayName = "ChartGrid"

export const ChartGroup = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartGroup.displayName = "ChartGroup"

export const ChartLine = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartLine.displayName = "ChartLine"

export const ChartLinear = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartLinear.displayName = "ChartLinear"

export const ChartTimeAxis = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartTimeAxis.displayName = "ChartTimeAxis"

export const ChartValueAxis = forwardRef<HTMLDivElement, ChartProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
ChartValueAxis.displayName = "ChartValueAxis"

