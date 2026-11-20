"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBookOpen, IconShoppingBag } from './Icons';
import './PdfPreviewModal.css';

const SAMPLE_PAGES = [
  {
    page: 1,
    title: "Cover & Overview",
    content: "TEACH ME LEGAL — STATUTORY REVISION & EXAM GUIDE\n\nAuthor: Adv. Prashant Jha\nTarget: JAIIB / CAIIB & Law Competitive Exams\n\nKey Highlights:\n• Simplified Section Breakdown\n• Landmark Supreme Court Rulings (2020 - 2026)\n• Exam-oriented Flowcharts & Memory Hacks"
  },
  {
    page: 2,
    title: "Chapter 1: Banking Law Fundamentals",
    content: "SECTION 138 — NEGOTIABLE INSTRUMENTS ACT\n\nEssential Ingredients of Offence:\n1. Drawing of check for discharge of debt/liability.\n2. Presentation within validity period (3 months).\n3. Return of check unpaid by bank ('Insufficient Funds').\n4. Demand notice issued within 30 days of dishonor.\n5. Failure of drawer to pay within 15 days of notice."
  },
  {
    page: 3,
    title: "Chapter 2: Landmark Case Law Analysis",
    content: "CASE STUDY: Dashrath Rupsingh Rathod v. State of Maharashtra (2014)\n\nJurisdiction of Section 138 Complaint:\n• Held: Complaint must be filed at the place where the branch of the bank on which the check was drawn is located.\n\nAMENDMENT NOTE: Subsequent 2015 Amendment specified jurisdiction at the branch where payee maintains account."
  },
  {
    page: 4,
    title: "Sample Question Bank & Quiz",
    content: "Q1. What is the limitation period for issuing a legal notice under Sec 138 NI Act?\n[A] 15 days   [B] 30 days   [C] 45 days   [D] 60 days\n\nCorrect Answer: [B] 30 days from receipt of bank return memo.\n\nUnlock full 150+ pages and question bank by enrolling below!"
  }
];

export default function PdfPreviewModal({ isOpen, onClose, book, onAddToCart }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !book) return null;

  const sample = SAMPLE_PAGES[currentPage];

  return createPortal(
    <AnimatePresence>
      <div className="pdf-modal-overlay" onClick={onClose}>
        <motion.div 
          className="pdf-modal-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Modal Header */}
          <div className="pdf-modal-header">
            <div className="pdf-book-meta">
              <span className="pdf-badge">
                <IconBookOpen size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }} />
                Free Sample Preview
              </span>
              <h3>{book.title}</h3>
            </div>
            <button className="pdf-close-btn" onClick={onClose}>✕</button>
          </div>

          {/* Book Viewer Canvas */}
          <div className="pdf-viewer-canvas">
            <div className="pdf-page-paper">
              <div className="pdf-paper-header">
                <span>Page {sample.page} of {SAMPLE_PAGES.length} (Sample)</span>
                <span className="pdf-chapter-tag">{sample.title}</span>
              </div>
              <div className="pdf-paper-body">
                <pre>{sample.content}</pre>
              </div>
              <div className="pdf-paper-watermark">TeachMeLegal Preview</div>
            </div>
          </div>

          {/* Modal Controls & Footer */}
          <div className="pdf-modal-footer">
            <div className="pdf-nav-controls">
              <button 
                className="btn btn-outline btn-sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ← Previous Page
              </button>
              <span className="pdf-page-indicator">
                {currentPage + 1} / {SAMPLE_PAGES.length}
              </span>
              <button 
                className="btn btn-outline btn-sm"
                disabled={currentPage === SAMPLE_PAGES.length - 1}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next Page →
              </button>
            </div>

            <div className="pdf-action-controls">
              <button 
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  onAddToCart(book);
                  onClose();
                }}
              >
                <IconShoppingBag size={16} />
                <span>Unlock Full Book ({book.salePrice || book.price || '₹99'})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
