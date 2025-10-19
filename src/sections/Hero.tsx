import { UnapologeticButton } from '../components/ui/UnapologeticButton';

export const Hero = () => {
    return (
        <section className="bg-yellow-50 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                 
                    <div className="md:hidden">
                        <img 
                            src="/gitmoon.png" 
                            alt="Gitmoon Application Screenshot" 
                            className="rounded-lg w-full max-w-sm mx-auto"
                        />
                    </div>          
                    <div className="text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
                            <span className="block">Commit & Push</span>
                            <span className="block text-orange-500">From Anywhere.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-lg text-slate-600">
                            Stop wrestling with manual commits on mobile. Gitmoon uses AI to generate smart commit messages and pushes your code, so you can focus on what matters.
                        </p>
                        <div className="mt-8">
                            <UnapologeticButton to="/app" bgColor="bg-orange-300">
                                Launch App
                            </UnapologeticButton>
                        </div>
                    </div>              
                    <div className="hidden md:block">
                        <img 
                            src="/gitmoon.png" 
                            alt="Gitmoon Application Screenshot" 
                            className="rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};