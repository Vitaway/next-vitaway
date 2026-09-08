'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

/**
 * Light page transition only. Never leave content at opacity 0 waiting on
 * whileInView / AnimatePresence — that caused blank teal screens on FAQs/Support.
 */
function PageEnter({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const reduce = useReducedMotion();

    return (
        <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0.01, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 sm:gap-6 lg:gap-8"
        >
            {children}
        </motion.div>
    );
}

export default PageEnter;
