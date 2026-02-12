'use client'
import {useState, useMemo} from 'react';

export function useLastModifiedSort<T extends {updatedAt: number}>(items: T[]) {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const handleSort = () => {
        if (sortDirection === null) {
            setSortDirection('desc');
        } else if (sortDirection === 'desc') {
            setSortDirection('asc');
        } else {
            setSortDirection('desc');
        }
    };

    const sortedItems = useMemo(() => {
        if (!sortDirection) return items;

        return [...items].sort((a, b) => {
            const comparison = a.updatedAt - b.updatedAt;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [items, sortDirection]);

    return {
        sortDirection,
        handleSort,
        sortedItems,
    };
}
