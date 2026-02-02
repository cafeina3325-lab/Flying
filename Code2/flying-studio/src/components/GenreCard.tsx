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
            className="block p-6 bg-card-dark border border-soft rounded-lg hover:border-gold-antique hover:text-gold-antique transition-colors group"
        >
            <h3 className="text-xl font-bold uppercase tracking-wider text-center text-white-muted group-hover:text-gold-antique">
                {displayName}
            </h3>
        </Link>
    );
}
