import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ✅ Imagens locais do projeto
const images = [
  {
    url: '/images/violao-1.jpeg',
    alt: 'Violão Eagle CH888 - Vista frontal',
  },
  {
    url: '/images/violao-2.jpeg',
    alt: 'Violão Eagle CH888 - Vista lateral',
  },
  {
    url: '/images/violao-3.jpeg',
    alt: 'Violão Eagle CH888 - Detalhe',
  },
  {
    url: '/images/violao-4.jpeg',
    alt: 'Violão Eagle CH888 - Vista traseira',
  },
];

function GuitarGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex(prev => (prev + 1) % images.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-10 px-4"
    >
      <div className="max-w-md mx-auto">
        {/* Section Label */}
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">
          O Prêmio
        </p>

        {/* Carousel */}
        <div className="relative rounded-2xl overflow-hidden glass-card-strong">
          <div className="aspect-[4/3] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                alt={images[currentIndex].alt}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-500/80 via-transparent to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-gold-400/20 backdrop-blur-sm rounded-full border border-gold-400/20">
              <span className="text-gold-300 text-[10px] uppercase tracking-wider">Prêmio 2026</span>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-cream" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-cream" />
            </button>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="font-display text-lg text-cream italic">
                  Eagle CH888 • 12 cordas
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  {images[currentIndex].alt}
                </p>
              </div>
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-6 bg-gold-400'
                        : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default GuitarGallery;