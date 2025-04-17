import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import EmpowermentSection from './components/EmpowermentSection';
import ImpactOverview from './components/ImpactOverview';
import SDGPreview from './components/SDGPreview';
import CallToAction from './components/CallToAction';
import './HomePage.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const fadeScaleVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const slideUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const slideInLeftVariant = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const slideInBottomVariant = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function HomePage() {
  return (
    <div className="homepage">
      <motion.div
        className="homepage-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section (full-screen) */}
        <motion.div variants={fadeScaleVariant}>
          <HeroSection />
        </motion.div>

        {/* Empowerment Section */}
        <motion.div variants={slideUpVariant}>
          <EmpowermentSection />
        </motion.div>

        {/* Impact Overview */}
        <motion.div variants={fadeScaleVariant}>
          <ImpactOverview />
        </motion.div>

        {/* SDG Preview */}
        <motion.div variants={slideInLeftVariant}>
          <SDGPreview />
        </motion.div>

        {/* Call To Action */}
        <motion.div variants={slideInBottomVariant}>
          <CallToAction />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;
