"use client";
import React, { useState, useRef, useEffect } from 'react';
import './WordPressEditor.css';

export default function WordPressEditor({ value = '', onChange }) {
  // 'split' | 'visual' | 'code' | 'preview'
  const [activeTab, setActiveTab] = useState('split');
  const [content, setContent] = useState(value);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableCols, setTableCols] = useState(3);
  const [tableRows, setTableRows] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);

  const visualRef = useRef(null);
  const textareaRef = useRef(null);
  const savedRange = useRef(null);

  useEffect(() => {
    setContent(value);
    if (visualRef.current && visualRef.current.innerHTML !== value) {
      visualRef.current.innerHTML = value;
    }
  }, [value]);

  const updateContent = (newHtml) => {
    setContent(newHtml);
    if (onChange) {
      onChange(newHtml);
    }
  };

  const handleVisualInput = () => {
    if (visualRef.current) {
      updateContent(visualRef.current.innerHTML);
    }
    updateSavedRange();
  };

  const updateSavedRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && visualRef.current && visualRef.current.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection before executing an action
  const restoreRange = () => {
    if (visualRef.current) {
      visualRef.current.focus();
      const sel = window.getSelection();
      if (savedRange.current && visualRef.current.contains(savedRange.current.commonAncestorContainer)) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
        return savedRange.current;
      } else {
        const range = document.createRange();
        range.selectNodeContents(visualRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        return range;
      }
    }
    return null;
  };

  const executeCommand = (command, val = null) => {
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      document.execCommand(command, false, val);
      handleVisualInput();
    } else {
      insertIntoTextarea(command, val);
    }
  };

  const insertHtmlAtCursor = (htmlToInsert) => {
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      try {
        const success = document.execCommand('insertHTML', false, htmlToInsert);
        if (!success) throw new Error('execCommand returned false');
      } catch (e) {
        // Fallback manual DOM insertion
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const temp = document.createElement('div');
          temp.innerHTML = htmlToInsert;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = temp.firstChild)) {
            frag.appendChild(node);
          }
          range.insertNode(frag);
        } else if (visualRef.current) {
          visualRef.current.innerHTML += htmlToInsert;
        }
      }
      handleVisualInput();
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = textarea.value.substring(0, start) + htmlToInsert + textarea.value.substring(end);
        updateContent(newText);
      } else {
        updateContent(content + htmlToInsert);
      }
    }
  };

  const insertIntoTextarea = (type, val = null) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = '';

    switch (type) {
      case 'bold':
        replacement = `<strong>${selected || 'Bold Text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selected || 'Italic Text'}</em>`;
        break;
      case 'underline':
        replacement = `<u>${selected || 'Underlined Text'}</u>`;
        break;
      case 'strikeThrough':
        replacement = `<s>${selected || 'Strikethrough Text'}</s>`;
        break;
      case 'formatBlock':
        replacement = `<${val}>${selected || 'Heading'}</${val}>`;
        break;
      case 'insertUnorderedList':
        replacement = `\n<ul>\n  <li>${selected || 'First key legal point...'}</li>\n  <li>Second key legal point...</li>\n</ul>\n<p><br></p>\n`;
        break;
      case 'insertOrderedList':
        replacement = `\n<ol>\n  <li>${selected || 'First procedural step...'}</li>\n  <li>Second procedural step...</li>\n</ol>\n<p><br></p>\n`;
        break;
      case 'insertClauseList':
        replacement = `\n<ol type="a" style="list-style-type: lower-alpha;">\n  <li>${selected || 'Whether the jurisdiction was properly invoked;'}</li>\n  <li>Whether the statutory notice was duly served;</li>\n</ol>\n<p><br></p>\n`;
        break;
      case 'blockquote':
        replacement = `\n<blockquote>${selected || 'Enter Supreme Court or High Court quote...'}</blockquote>\n<p><br></p>\n`;
        break;
      case 'callout':
        replacement = `\n<div class="statutory-callout">\n  <strong>📌 STATUTORY NOTE:</strong> ${selected || 'Key ratio decidendi or legal analysis...'}\n</div>\n<p><br></p>\n`;
        break;
      case 'hr':
        replacement = `\n<hr class="section-divider" />\n<p><br></p>\n`;
        break;
      default:
        replacement = selected;
    }

    const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    updateContent(newText);
  };

  // Custom Table Generator
  const insertCustomTable = () => {
    let tableHtml = '\n<div class="table-responsive">\n  <table class="blog-table">\n';
    
    if (tableHeader) {
      tableHtml += '    <thead>\n      <tr>\n';
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `        <th>Header ${c}</th>\n`;
      }
      tableHtml += '      </tr>\n    </thead>\n';
    }

    tableHtml += '    <tbody>\n';
    for (let r = 1; r <= tableRows; r++) {
      tableHtml += '      <tr>\n';
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `        <td>Row ${r}, Col ${c}</td>\n`;
      }
      tableHtml += '      </tr>\n';
    }
    tableHtml += '    </tbody>\n  </table>\n</div>\n<p><br></p>\n';

    insertHtmlAtCursor(tableHtml);
    setShowTableModal(false);
  };

  // Statutory 3-Column Section Table
  const insertSectionTable = () => {
    const tableHtml = `
<div class="table-responsive">
  <table class="blog-table">
    <thead>
      <tr>
        <th style="width: 15%;">Sec. No.</th>
        <th style="width: 30%;">Section Title</th>
        <th>Core Statutory Provision / Courtroom Meaning</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Sec. 1</strong></td>
        <td>Short Title & Commencement</td>
        <td>Extends to the whole of India; appointed date for enforcement.</td>
      </tr>
      <tr>
        <td><strong>Sec. 2</strong></td>
        <td>Statutory Definitions</td>
        <td>Key operational definitions and regulatory references.</td>
      </tr>
      <tr>
        <td><strong>Sec. 3</strong></td>
        <td>Substantive Legal Provision</td>
        <td>Defines core liabilities, legal remedies, and statutory duties.</td>
      </tr>
    </tbody>
  </table>
</div>
<p><br></p>
`;
    insertHtmlAtCursor(tableHtml);
    setShowTableModal(false);
  };

  // Case Law Table
  const insertCaseLawTable = () => {
    const tableHtml = `
<div class="table-responsive">
  <table class="blog-table">
    <thead>
      <tr>
        <th style="width: 32%;">Case Law & Citation</th>
        <th style="width: 26%;">Bench / Coram</th>
        <th>Landmark Supreme Court Ratio & Principles</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>State Bank of India v. Radhey Shyam (2025)</strong></td>
        <td>Hon'ble Supreme Court of India</td>
        <td>Held that statutory right of set-off cannot be exercised arbitrarily without due notice to account holder.</td>
      </tr>
      <tr>
        <td><strong>Standard Chartered Bank v. Directorate of Enforcement</strong></td>
        <td>Constitution Bench (5 Judges)</td>
        <td>Corporate criminal liability applies even where statutory penal sanction specifies imprisonment.</td>
      </tr>
    </tbody>
  </table>
</div>
<p><br></p>
`;
    insertHtmlAtCursor(tableHtml);
    setShowTableModal(false);
  };

  // Difference / Comparison Table
  const insertComparisonTable = () => {
    const tableHtml = `
<div class="table-responsive">
  <table class="blog-table">
    <thead>
      <tr>
        <th style="width: 25%;">Legal Parameter</th>
        <th style="width: 37%;">Concept / Section A</th>
        <th style="width: 38%;">Concept / Section B</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Statutory Source</strong></td>
        <td>Governed by Section X of the Act</td>
        <td>Governed by Section Y of the Act</td>
      </tr>
      <tr>
        <td><strong>Nature of Remedy</strong></td>
        <td>Civil restitution & monetary relief</td>
        <td>Criminal penalty / statutory forfeiture</td>
      </tr>
      <tr>
        <td><strong>Standard of Proof</strong></td>
        <td>Preponderance of probabilities</td>
        <td>Proof beyond reasonable doubt</td>
      </tr>
    </tbody>
  </table>
</div>
<p><br></p>
`;
    insertHtmlAtCursor(tableHtml);
    setShowTableModal(false);
  };

  // Bullet insertion helpers
  const insertBulletsAtCursor = () => {
    if (activeTab === 'visual' || activeTab === 'split') {
      executeCommand('insertUnorderedList');
    } else {
      insertIntoTextarea('insertUnorderedList');
    }
  };

  const insertNumberedAtCursor = () => {
    if (activeTab === 'visual' || activeTab === 'split') {
      executeCommand('insertOrderedList');
    } else {
      insertIntoTextarea('insertOrderedList');
    }
  };

  const insertLegalClauseList = () => {
    const clauseHtml = `
<ol type="a" style="list-style-type: lower-alpha; margin: 16px 0 16px 28px; line-height: 1.8;">
  <li>Whether the trial court had competent subject-matter jurisdiction to adjudicate the dispute;</li>
  <li>Whether the pre-institution statutory conciliation notice was duly delivered;</li>
  <li>Whether the petition is barred by the statutory period of limitation prescribed under Article 54.</li>
</ol>
<p><br></p>
`;
    insertHtmlAtCursor(clauseHtml);
  };

  const handleTabSwitch = (tab) => {
    if ((tab === 'visual' || tab === 'split') && activeTab === 'code') {
      if (visualRef.current) {
        visualRef.current.innerHTML = content;
      }
    }
    setActiveTab(tab);
  };

  // Calculate stats
  const cleanText = content.replace(/<[^>]+>/g, ' ').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));
  const tableCount = (content.match(/<table/g) || []).length;
  const listCount = (content.match(/<(ul|ol)/g) || []).length;

  return (
    <div className="wp-editor-wrapper">
      {/* WordPress Editor Header & Mode Tabs */}
      <div className="wp-editor-header">
        <div className="wp-editor-title-row">
          <span className="wp-badge">WORDPRESS ARTICLE BUILDER</span>
          <span className="wp-hint">
            Insert tables, bullet lists & statutory notes directly in the middle of your paragraphs.
          </span>
        </div>

        <div className="wp-tabs">
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('split')}
            title="Side-by-side editing and live student reader preview (Recommended for widescreen)"
          >
            ⚡ Split View (Editor + Live Preview)
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('visual')}
            title="Full-width WYSIWYG rich text editor"
          >
            ✏️ Visual Editor
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('code')}
            title="Edit raw HTML code"
          >
            {'</>'} HTML Code
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('preview')}
            title="Full-width simulated student reader view"
          >
            👁️ Full Reader Preview
          </button>
        </div>
      </div>

      {/* WordPress Toolbar */}
      {activeTab !== 'preview' && (
        <div className="wp-toolbar">
          {/* Text Format Dropdown */}
          <div className="wp-toolbar-group">
            <select
              className="wp-select"
              onMouseDown={(e) => updateSavedRange()}
              onChange={(e) => {
                if (e.target.value) {
                  executeCommand('formatBlock', e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Format...</option>
              <option value="p">Paragraph Text</option>
              <option value="h2">Section Heading (H2)</option>
              <option value="h3">Sub-Heading (H3)</option>
              <option value="h4">Minor Clause (H4)</option>
            </select>
          </div>

          {/* Typography Styles */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Bold (Ctrl+B)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeCommand('bold')}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Italic (Ctrl+I)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeCommand('italic')}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Underline (Ctrl+U)"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeCommand('underline')}
            >
              <u>U</u>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Strikethrough"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeCommand('strikeThrough')}
            >
              <s>S</s>
            </button>
          </div>

          {/* Bullets & Lists in middle of paragraph */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn wp-btn-list"
              title="Insert Bullet List in Paragraph"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertBulletsAtCursor}
            >
              • Bullet List
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-list"
              title="Insert Numbered List in Paragraph"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertNumberedAtCursor}
            >
              1. Numbered List
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-list"
              title="Insert (a), (b), (c) Statutory Clauses"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertLegalClauseList}
            >
              (a) Legal Clauses
            </button>
          </div>

          {/* Tables Insertion in middle of paragraph */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn wp-btn-table"
              title="Choose or create a custom table"
              onMouseDown={(e) => {
                e.preventDefault();
                updateSavedRange();
              }}
              onClick={() => setShowTableModal(!showTableModal)}
            >
              ⊞ Insert Table ▾
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click 3-Column Statutory Section Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertSectionTable}
            >
              ⚖️ Section Table
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click Landmark Case Law Summary Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertCaseLawTable}
            >
              📜 Case Law Table
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click Difference / Comparison Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertComparisonTable}
            >
              📊 Comparison Table
            </button>
          </div>

          {/* Quotes, Callouts & Dividers */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Insert Judicial Quote Block"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const quoteHtml = `<blockquote>"The rule of law permeates the entire fabric of our Constitution. Any arbitrary executive action is inherently vulnerable to judicial review."</blockquote><p><br></p>`;
                insertHtmlAtCursor(quoteHtml);
              }}
            >
              ❝ Quote
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Insert Statutory Ratio Callout Box"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const callout = '<div class="statutory-callout"><strong>📌 STATUTORY RATIO:</strong> Enter pivotal legal principle, test of admissibility, or courtroom practice advice...</div><p><br></p>';
                insertHtmlAtCursor(callout);
              }}
            >
              📌 Callout Box
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Insert Section Divider Line"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const hrHtml = '<hr class="section-divider" /><p><br></p>';
                insertHtmlAtCursor(hrHtml);
              }}
            >
              ― Line
            </button>
          </div>
        </div>
      )}

      {/* Table Dropdown Customizer & Template Picker */}
      {showTableModal && (
        <div className="wp-table-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ margin: 0 }}>⊞ Insert Table in Middle of Paragraph</h4>
            <button 
              type="button" 
              onClick={() => setShowTableModal(false)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>

          <div className="wp-table-templates-bar">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-gold)' }}>Quick Templates:</span>
            <button type="button" className="btn-preset-pill" onClick={insertSectionTable}>
              ⚖️ Statutory Section Table (3 Cols)
            </button>
            <button type="button" className="btn-preset-pill" onClick={insertCaseLawTable}>
              📜 Case Law Summary Table
            </button>
            <button type="button" className="btn-preset-pill" onClick={insertComparisonTable}>
              📊 Legal Comparison Table
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Or Create Custom Grid Table:
            </span>
            <div className="wp-table-inputs">
              <div>
                <label>Columns (1-8)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
                />
              </div>
              <div>
                <label>Rows (1-30)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 3)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                <input
                  type="checkbox"
                  id="th-toggle"
                  checked={tableHeader}
                  onChange={(e) => setTableHeader(e.target.checked)}
                />
                <label htmlFor="th-toggle" style={{ cursor: 'pointer', margin: 0 }}>Include Header Row</label>
              </div>
            </div>
            <div className="wp-table-actions">
              <button type="button" className="btn-table-cancel" onClick={() => setShowTableModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn-table-insert" onClick={insertCustomTable}>
                ✓ Insert Custom Table at Cursor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editing Canvas Area */}
      <div className={`wp-canvas-container ${activeTab === 'split' ? 'split-mode' : ''}`}>
        {/* Visual / WYSIWYG Editor (Used in Visual mode and left half of Split mode) */}
        {(activeTab === 'visual' || activeTab === 'split') && (
          <div className="wp-pane wp-pane-editor">
            {activeTab === 'split' && (
              <div className="wp-pane-label">
                <span>✏️ VISUAL WYSIWYG CANVAS (Edit paragraphs, tables & lists here)</span>
              </div>
            )}
            <div
              ref={visualRef}
              className="wp-visual-canvas post-content"
              contentEditable
              onInput={handleVisualInput}
              onBlur={handleVisualInput}
              onKeyUp={updateSavedRange}
              onMouseUp={updateSavedRange}
              onSelect={updateSavedRange}
              suppressContentEditableWarning
              placeholder="Click here and begin writing your legal article. Insert tables, bullet points, and statutory notes at any point in the text..."
            />
          </div>
        )}

        {/* HTML / Code Editor (Used in Code mode) */}
        {activeTab === 'code' && (
          <div className="wp-pane wp-pane-code">
            <textarea
              ref={textareaRef}
              className="wp-code-textarea"
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Type or paste your HTML article content with tables and lists here..."
            />
          </div>
        )}

        {/* Live Reader Preview (Used in Preview mode and right half of Split mode) */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="wp-pane wp-pane-preview">
            <div className="wp-preview-notice">
              <span>👁️ LIVE READER PREVIEW • Real-time student view with TeachMeLegal styling</span>
            </div>
            <article className="post-content prose" dangerouslySetInnerHTML={{ __html: content || '<p style="color: #94a3b8; font-style: italic;">Live article preview will render here as you type...</p>' }} />
          </div>
        )}
      </div>

      {/* Editor Footer Stats */}
      <div className="wp-editor-footer">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span><strong>Words:</strong> ~{wordCount} words</span>
          <span><strong>Est. Read Time:</strong> ~{readTimeEst} min read</span>
          <span><strong>Tables:</strong> {tableCount}</span>
          <span><strong>Lists:</strong> {listCount}</span>
          <span><strong>HTML:</strong> {content.length} chars</span>
        </div>
        <span style={{ color: 'var(--admin-gold)', fontWeight: 700 }}>
          {activeTab === 'split' ? '⚡ Dual-Pane Live Mode Active' : activeTab === 'preview' ? '👁️ Previewing Full Layout' : '✏️ Edit Mode Active'}
        </span>
      </div>
    </div>
  );
}
