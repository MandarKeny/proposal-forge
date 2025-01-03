"use client";

import { motion } from 'framer-motion';

const logos = [
  { name: 'Apple', logo: '/images/apple.png' },
  { name: 'Amazon', logo: '/images/amazon.png' },
  { name: 'Google', logo: '/images/google.png' },
  { name: 'Meta', logo: '/images/meta.png' },
  { name: 'Netflix', logo: '/images/netflix.png' }
];

export function ClientLogos() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-8"
        >
          Trusted by leading companies worldwide
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-12">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={logo.logo}
                alt={logo.name}
                className="h-8 md:h-10"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}