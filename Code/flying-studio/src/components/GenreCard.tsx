import Link from 'next/link';
import { Genre } from '@/app/constants';

interface GenreCardProps {
    genre: Genre;
}

export function GenreCard({ genre }: GenreCardProps) {
    // Navigation Rule: /gallery?tab=portfolio&genre=GENRE_KEY
    const href = `/gallery?tab=portfolio&genre=${genre}`;

    // Formatting for display (e.g., "black_and_grey" -> "Black And Grey")
    const displayName = genre
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <Link
            href={href}
            className="block p-6 bg-stone-900 border border-stone-800 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors group"
        >
            <h3 className="text-xl font-bold uppercase tracking-wider text-center text-stone-200 group-hover:text-amber-500">
                {displayName}
            </h3>
        </Link>
    );
}
