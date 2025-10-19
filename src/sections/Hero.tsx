import { UnapologeticButton } from '../components/ui/UnapologeticButton';

export const Hero = () => {
    return (
        <section className="bg-yellow-50 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    
                    {/* Kolom Teks (otomatis jadi full width di mobile) */}
                    <div className="md:w-1/2 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
                            <span className="block">Commit & Push</span>
                            <span className="block text-orange-500">From Anywhere.</span>
                        </h1>
                        <p className="mt-4 max-w-md mx-auto md:mx-0 text-lg text-slate-600">
                            Stop wrestling with manual commits on mobile. Gitmoon uses AI to generate smart commit messages and pushes your code, so you can focus on what matters.
                        </p>
                        <div className="mt-8 flex justify-center md:justify-start">
                            <UnapologeticButton to="/app" bgColor="bg-orange-300">
                                Launch App
                            </UnapologeticButton>
                        </div>
                    </div>
                    
                    {/* Kolom Gambar (otomatis pindah ke atas di mobile) */}
                    <div className="md:w-1/2 flex justify-center md:justify-end">
                         <img 
                            src="/gitmoon.png" 
                            alt="Gitmoon Application Screenshot" 
                            className="rounded-lg max-w-sm md:max-w-md w-full shadow-2xl transform transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};