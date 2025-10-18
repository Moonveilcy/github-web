import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Build Something Amazing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
          >
            Create modern, responsive applications with the latest technologies.
            Start your journey today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          >
            <button className="px-8 py-4 bg-white text-slate-900 font-semibold text-lg rounded-lg transition-all duration-300 hover:bg-slate-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
