"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMapPin } from './Icons';
import './LegalGlossary.css';

export const GLOSSARY_TERMS = {
  "mens rea": {
    term: "Mens Rea",
    translation: "Guilty Mind",
    definition: "The mental element or intention to commit a crime, necessary alongside 'Actus Reus' to establish criminal liability under IPC/BNS.",
    reference: "IPC Sec 300 / BNS Sec 101"
  },
  "sub judice": {
    term: "Sub Judice",
    translation: "Under Trial",
    definition: "A case or matter currently under judicial consideration by a court of law. Public discussion that might prejudice proceedings is restricted.",
    reference: "Contempt of Courts Act 1971"
  },
  "estoppel": {
    term: "Estoppel",
    translation: "Preclusion",
    definition: "A rule of evidence preventing a party from asserting a contrary position to their earlier representation, action, or admission.",
    reference: "Indian Evidence Act Sec 115"
  },
  "habeas corpus": {
    term: "Habeas Corpus",
    translation: "Produce Body",
    definition: "A prerogative constitutional writ commanding the authority holding an individual in custody to produce them to evaluate the legality of detention.",
    reference: "Constitution of India Art 32 / 226"
  }
};

export default function LegalGlossary({ termKey, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const data = GLOSSARY_TERMS[termKey.toLowerCase()] || {
    term: children || termKey,
    translation: "Legal Concept",
    definition: `Detailed legal definition for ${children || termKey}.`,
    reference: "Indian Law Codex"
  };

  return (
    <div 
      className="glossary-term-wrapper" 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="glossary-term-row">
        <span className="glossary-term-text">{children || data.term}</span>
        <span className="glossary-translation-badge">{data.translation}</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="glossary-popover"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <div className="glossary-popover-header">
              <span className="glossary-popover-title">{data.term}</span>
              <span className="glossary-popover-sub">"{data.translation}"</span>
            </div>
            <p className="glossary-popover-def">{data.definition}</p>
            <div className="glossary-popover-ref">
              <IconMapPin size={12} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
              <span>Ref: {data.reference}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
