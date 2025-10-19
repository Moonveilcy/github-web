import { Bot } from 'lucide-react';
import { GitHubIcon } from '../ui/Icons';

export const Footer = () => {
    const socialLinks = [
        { name: 'GitHub', href: '#', icon: <GitHubIcon width={24} height={24} /> },
        { name: 'Discord', href: '#', icon: <Bot className="h-6 w-6" /> },
    ];
    const legalLinks = [
        { name: 'Terms of Service', href: '#' },
        { name: 'Privacy Policy', href: '#' },
    ];
    
    return(
        <footer className="bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:order-2">
                        {socialLinks.map((item) => (
                            <a key={item.name} href={item.href} className="text-slate-400 hover:text-slate-500">
                                <span className="sr-only">{item.name}</span>
                                {item.icon}
                            </a>
                        ))}
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-slate-400">&copy; 2025 Gitmoon. All rights reserved.</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                    {legalLinks.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm text-slate-500 hover:text-slate-700">
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};