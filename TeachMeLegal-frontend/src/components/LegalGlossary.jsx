"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LegalGlossary.css';

const GLOSSARY_TERMS = {
  "mens rea": {
    term: "Mens Rea",
    translation: "Guilty Mind",
    definition: "The mental element or intention to commit a crime, necessary alongside 'Actus Reus' to establish criminal liability under IPC/BNS.",
    reference: "IPC Section 300 / BNS Section 101"
  },
  "sub judice": {
    term: "Sub Judice",
    translation: "Under Judicial Consideration",
    definition: "A case or matter currently under trial or consideration by a court of law. Public discussion that might prejudice proceedings is restricted.",
    reference: "Contempt of Courts Act 1971"
  },
  "estoppel": {
    term: "Estoppel",
    translation: "Prevented from Denying",
    definition: "A legal principle preventing a party from asserting something contrary to what is implied by previous actions, statements, or court rulings.",
    reference: "Indian Evidence Act Sec 115"
  },
  "habeas corpus": {
    term: "Habeas Corpus",
    translation: "You shall have the body",
    definition: "A constitutional writ issued by Supreme Court (Art 32) or High Court (Art 226) ordering an illegal detention to be produced before court.",
    reference: "Constitution of India Art 32/226"
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
    <span className="glossary-term-wrapper" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <span className="glossary-term-text">{children || data.term}</span>
      <span className="glossary-info-icon">💡</span>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="glossary-popover"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glossary-header">
              <span className="glossary-title">{data.term}</span>
              <span className="glossary-sub">"{data.translation}"</span>
            </div>
            <p className="glossary-def">{data.definition}</p>
            <div className="glossary-ref">📍 Ref: {data.reference}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
