import NavBar from '@/components/NavBar';
import ContactForm from "@/components/ContactForm";
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Contact | Flying Studio',
    description: 'Get in touch with us for consultations.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black text-white-main">
            <NavBar />

            <div className="container max-w-7xl mx-auto pt-48 pb-24 px-6 sm:px-12">
                <header className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
                    <div>
                        <h1 className="text-5xl sm:text-7xl font-black mb-8 uppercase tracking-tighter text-white-main relative inline-block">
                            Contact
                            <span className="text-gold-antique text-4xl absolute -right-8 top-0">.</span>
                        </h1>
                        <div className="h-px w-full bg-white/10 mb-8 max-w-xl"></div>
                        <p className="text-gold-soft text-xl sm:text-2xl uppercase tracking-[0.3em] font-light max-w-2xl leading-relaxed">
                            Start your journey <br /><span className="text-white-dim">with a private consultation</span>
                        </p>
                    </div>

                    {/* Quick Info */}
                    <div className="text-right hidden md:block pb-4 opacity-70">
                        <p className="text-white-dim text-sm uppercase tracking-widest leading-loose">
                            Seoul, South Korea<br />
                            Flying Studio
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-12">
                        <div className="p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent">
                            <div className="bg-black/80 backdrop-blur-xl rounded-[1.8rem] p-8 sm:p-16 border border-white/5">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
