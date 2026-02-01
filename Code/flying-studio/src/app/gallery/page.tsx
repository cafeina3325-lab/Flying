import { Suspense } from 'react';
import GalleryContainer from '@/components/gallery/GalleryContainer';

export const metadata = {
    title: 'Gallery | Flying Studio',
    description: 'View our portfolio and upcoming events.',
};

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-stone-950 text-stone-200">
            <div className="container mx-auto py-16 px-6">
                <header className="mb-12">
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter text-white">Gallery</h1>
                    <p className="text-stone-400 text-lg max-w-2xl">
                        Browse our artists' work by genre or style.
                    </p>
                </header>

                <Suspense fallback={<div className="text-amber-500 animate-pulse">Loading Gallery...</div>}>
                    <GalleryContainer />
                </Suspense>
            </div>
        </main>
    );
}
