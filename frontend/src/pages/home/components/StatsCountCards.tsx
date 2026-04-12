import { CardWrapper } from '@/components/ui/wrappers/CardWrapper'
import { Typeface } from '@/components/ui/typeface'
import { cn } from '@/lib/utils'

export type StatusCounts = {
  todo: number
  in_progress: number
  done: number
}

type StatsCountCardsProps = {
  counts: StatusCounts
  className?: string
}

const items: { key: keyof StatusCounts; label: string; accent: string }[] = [
  { key: 'todo', label: 'To do', accent: 'border-l-amber-500' },
  { key: 'in_progress', label: 'In progress', accent: 'border-l-blue-500' },
  { key: 'done', label: 'Done', accent: 'border-l-emerald-500' },
]

export function StatsCountCards({ counts, className }: StatsCountCardsProps) {
  return (
    <div className={cn('grid gap-3 sm:grid-cols-3', className)}>
      {items.map(({ key, label, accent }) => (
        <CardWrapper
          key={key}
          className={cn('border-l-4 py-4', accent)}
        >
          <Typeface size="sm" color="secondary" as="p" variant="regular">
            {label}
          </Typeface>
          <Typeface size="2xl" as="p" variant="medium" className="mt-1 tabular-nums">
            {counts[key]}
          </Typeface>
        </CardWrapper>
      ))}
    </div>
  )
}
