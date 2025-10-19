import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../sections/Hero';
import { Footer } from '../components/layout/Footer';

export const HomePage = () => {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
            </main>
            <Footer />
        </>
    );
};