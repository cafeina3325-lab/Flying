import { Suspense } from 'react';
import GenreInfoContainer from '@/components/genre/GenreInfoContainer';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Genres | Flying Studio',
    description: 'Explore our tattoo styles and genres.',
};

export default function GenrePage() {
    return (
        <main className="min-h-screen bg-black text-white-main">
            <NavBar />

            {/* Agency Hero Section */}
            <div className="container max-w-7xl mx-auto pt-48 pb-24 px-6 sm:px-12">
                <header className="mb-32">
                    <h1 className="text-5xl sm:text-7xl font-black mb-8 uppercase tracking-tighter text-white-main relative inline-block">
                        Archive
                        <span className="text-gold-antique text-4xl absolute -right-8 top-0">.</span>
                    </h1>
                    <div className="h-px w-full bg-white/10 mb-8 max-w-2xl"></div>
                    <p className="text-gold-soft text-xl sm:text-2xl uppercase tracking-[0.3em] font-light max-w-3xl leading-relaxed">
                        Curated collection of <br /><span className="text-white-dim">artistic movements & styles</span>
                    </p>
                </header>

                <Suspense fallback={<div className="text-gold-active animate-pulse tracking-widest uppercase">Loading Collection...</div>}>
                    <GenreInfoContainer />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
