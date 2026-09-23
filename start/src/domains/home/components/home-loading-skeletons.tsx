import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

function HabitCardSkeleton() {
    return (
        <Card className="habit-card habit-card-skeleton" aria-hidden="true">
            <div className="habit-skeleton-main">
                <Skeleton className="habit-skeleton-check" />
                <Skeleton className="habit-skeleton-name" />
            </div>
            <Skeleton className="habit-skeleton-status" />
            <Skeleton className="habit-skeleton-select" />
        </Card>
    )
}

function HabitCategorySkeleton({ cardCount, categoryKey }: { cardCount: number; categoryKey: string }) {
    return (
        <section className="category-row skeleton-category-row" aria-hidden="true">
            <div className="category-heading">
                <Skeleton className="skeleton-category-title" />
                <Skeleton className="skeleton-category-count" />
            </div>
            <div className="category-habits">
                {Array.from({ length: cardCount }, (_, index) => (
                    <HabitCardSkeleton key={`${categoryKey}-${index}`} />
                ))}
            </div>
        </section>
    )
}

export function HomeHabitListSkeleton() {
    return (
        <div className="home-loading-state" role="status" aria-label="Chargement des habitudes">
            <span className="sr-only">Chargement des habitudes…</span>
            <HabitCategorySkeleton categoryKey="first" cardCount={3} />
            <HabitCategorySkeleton categoryKey="second" cardCount={2} />
        </div>
    )
}

export function CategoryManagerSkeleton() {
    return (
        <Card className="category-manager-card category-manager-skeleton" aria-hidden="true">
            <div className="category-manager-header">
                <div className="category-manager-skeleton-heading">
                    <Skeleton className="skeleton-manager-eyebrow" />
                    <Skeleton className="skeleton-manager-title" />
                </div>
                <Skeleton className="skeleton-manager-count" />
            </div>
            <Skeleton className="skeleton-manager-description" />
            <div className="category-create-form">
                <Skeleton className="skeleton-manager-input" />
                <Skeleton className="skeleton-manager-button" />
            </div>
            <div className="category-manager-list">
                {Array.from({ length: 4 }, (_, index) => (
                    <div className="category-manager-row" key={`category-${index}`}>
                        <div className="category-manager-name">
                            <Skeleton className="skeleton-manager-dot" />
                            <Skeleton className="skeleton-manager-name" />
                            <Skeleton className="skeleton-manager-habit-count" />
                        </div>
                        <Skeleton className="skeleton-manager-actions" />
                    </div>
                ))}
            </div>
        </Card>
    )
}
