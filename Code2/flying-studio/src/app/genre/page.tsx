import { Suspense } from 'react';
import GenreInfoContainer from '@/components/genre/GenreInfoContainer';
import NavBar from '@/components/NavBar';

export const metadata = {
    title: 'Genres | Flying Studio',
    description: 'Explore our tattoo styles and genres.',
};

export default function GenrePage() {
    return (
        <main className="min-h-screen bg-forest-black text-white-main">
            <NavBar />
            <div className="container mx-auto py-16 px-6">
                <header className="mb-12">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter text-white">Genre</h1>
                    <p className="text-stone-400 text-lg max-w-2xl">
                        Explore our collection by genre.
                    </p>
                </header>

                <Suspense fallback={<div className="text-amber-500 animate-pulse">Loading Genres...</div>}>
                    <GenreInfoContainer />
                </Suspense>
            </div>
        </main>
    );
}
