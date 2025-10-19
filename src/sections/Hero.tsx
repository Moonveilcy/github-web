import { Link } from 'react-router-dom';
import { GitHubIcon } from '../components/ui/Icons';

export const Hero = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
            <div className="text-center max-w-2xl">
                <div className="inline-block p-4 bg-yellow-100 rounded-lg border-2 border-black mb-6">
                    <GitHubIcon width="48" height="48" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                    Gitmoon
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                    Effortless GitHub commits, right from your mobile browser.
                    Powered by AI to make your workflow faster and smarter.
                </p>
                <div className="mt-8">
                    <Link
                        to="/app"
                        className="inline-block bg-slate-900 text-white font-bold py-3 px-8 rounded-lg border-2 border-black shadow-[4px_4px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
                    >
                        Launch App
                    </Link>
                </div>
            </div>
            <footer className="absolute bottom-4 text-sm text-slate-500">
                Made with ❤️ for the mobile dev community.
            </footer>
        </div>
    );
};