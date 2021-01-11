import React from 'react';
import { motion } from 'framer-motion';

const pageTransition = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: '-100vh' },
};

const Home = () => (
  <motion.div initial="out" animate="in" exit="out" variants={pageTransition}>
    Welcome to my drawguess
  </motion.div>
);

export default Home;
