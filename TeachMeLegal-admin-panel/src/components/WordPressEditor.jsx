"use client";
import React, { useState, useRef, useEffect } from 'react';
import './WordPressEditor.css';

const FONTS_LIST = [
  { name: 'Inter', family: 'Inter, sans-serif', category: 'Modern Clean Sans', preview: 'Statutory provisions and courtroom ratio' },
  { name: 'Roboto', family: 'Roboto, sans-serif', category: 'Most Popular Web Sans', preview: 'High-legibility legal case brief text' },
  { name: 'Poppins', family: 'Poppins, sans-serif', category: 'Premium Geometric Sans', preview: 'Authoritative analysis of landmark statutes' },
  { name: 'Merriweather', family: 'Merriweather, serif', category: 'Judicial & Editorial Serif', preview: 'Supreme Court ratio decidendi & precedents' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Luxury Courtroom Serif', preview: 'Constitution Bench Judgment Summary' },
  { name: 'Georgia', family: 'Georgia, serif', category: 'Classic Editorial Serif', preview: 'Jurisprudence & statutory interpretations' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'Authoritative Heading Sans', preview: 'Procedural rules and judicial guidelines' },
  { name: 'Times New Roman', family: "'Times New Roman', serif", category: 'Formal Court & Statutory', preview: 'High Court filing and affidavit standard' },
  { name: 'Open Sans', family: "'Open Sans', sans-serif", category: 'Clear & Balanced Sans', preview: 'Universal readable text for exam notes' },
  { name: 'Lato', family: 'Lato, sans-serif', category: 'Warm & Contemporary Sans', preview: 'Practical student learning materials' },
  { name: 'Garamond', family: 'Garamond, serif', category: 'Traditional Supreme Court Serif', preview: 'Historic legal doctrines and maxims' },
  { name: 'Courier New', family: "'Courier New', monospace", category: 'Bare Act Code & Monospace', preview: 'Section 138 (b) Proviso: Within 15 days' }
];

const SIZES_LIST = [
  { label: '13px', px: '13px', desc: 'Footnote / Statutory Proviso' },
  { label: '14px', px: '14px', desc: 'Metadata / Annotation' },
  { label: '16px', px: '16px', desc: 'Standard Article Body' },
  { label: '18px', px: '18px', desc: 'Medium Lead Paragraph' },
  { label: '20px', px: '20px', desc: 'Sub-heading / Section Note' },
  { label: '24px', px: '24px', desc: 'H3 Subsection Title' },
  { label: '28px', px: '28px', desc: 'H2 Main Section Title' },
  { label: '32px', px: '32px', desc: 'H1 Chapter Header' }
];

export default function WordPressEditor({ value = '', onChange }) {
  // 'split' | 'visual' | 'code' | 'preview'
  const [activeTab, setActiveTab] = useState('split');
  const [content, setContent] = useState(value);

  // Popover menus state
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [currentFontLabel, setCurrentFontLabel] = useState('Font Family');
  const [currentSizeLabel, setCurrentSizeLabel] = useState('Size');
  const [showTableModal, setShowTableModal] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const [showNumberMenu, setShowNumberMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  // Table generator state
  const [tableCols, setTableCols] = useState(3);
  const [tableRows, setTableRows] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);

  // Fullscreen Canvas mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  const visualRef = useRef(null);
  const textareaRef = useRef(null);
  const savedRange = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

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
      default:
        replacement = selected;
    }

    const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    updateContent(newText);
  };

  // ── Font Family Application (12 Most Used Fonts) ──
  const applyFontFamily = (font) => {
    setCurrentFontLabel(font.name);
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontFamily = font.family;
        span.appendChild(range.extractContents());
        range.insertNode(span);

        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRange.current = newRange.cloneRange();
        handleVisualInput();
      } else if (sel && sel.rangeCount > 0) {
        const anchor = sel.anchorNode;
        let block = anchor;
        while (block && block !== visualRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'LI', 'TD', 'TH', 'BLOCKQUOTE'].includes(block.nodeName)) {
          block = block.parentNode;
        }
        if (block && block !== visualRef.current) {
          block.style.fontFamily = font.family;
          handleVisualInput();
        } else {
          insertHtmlAtCursor(`<span style="font-family: ${font.family};">&#8203;</span>`);
        }
      }
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end) || 'Sample Text';
        const replacement = `<span style="font-family: ${font.family};">${selected}</span>`;
        const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        updateContent(newText);
      }
    }
    setShowFontMenu(false);
  };

  // ── Font Size Application ──
  const applyFontSize = (size) => {
    setCurrentSizeLabel(size.label);
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = size.px;
        span.appendChild(range.extractContents());
        range.insertNode(span);

        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedRange.current = newRange.cloneRange();
        handleVisualInput();
      } else if (sel && sel.rangeCount > 0) {
        const anchor = sel.anchorNode;
        let block = anchor;
        while (block && block !== visualRef.current && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'LI', 'TD', 'TH', 'BLOCKQUOTE'].includes(block.nodeName)) {
          block = block.parentNode;
        }
        if (block && block !== visualRef.current) {
          block.style.fontSize = size.px;
          handleVisualInput();
        }
      }
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end) || 'Sample Text';
        const replacement = `<span style="font-size: ${size.px};">${selected}</span>`;
        const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        updateContent(newText);
      }
    }
    setShowSizeMenu(false);
  };

  // ── Text Color & Highlighter ──
  const handleTextColor = (color) => {
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      document.execCommand('foreColor', false, color);
      handleVisualInput();
    }
    setShowColorPicker(false);
  };

  const handleHighlightColor = (color) => {
    if (activeTab === 'visual' || activeTab === 'split') {
      restoreRange();
      try {
        document.execCommand('hiliteColor', false, color);
      } catch (e) {
        document.execCommand('backColor', false, color);
      }
      handleVisualInput();
    }
    setShowHighlightPicker(false);
  };

  // ── All Bullet List Types ──
  const insertBulletList = (styleType) => {
    let listHtml = '';
    switch (styleType) {
      case 'disc':
        listHtml = `<ul style="list-style-type: disc; margin: 16px 0 20px 28px;">\n  <li>First statutory principle...</li>\n  <li>Second key judicial point...</li>\n  <li>Third courtroom consideration...</li>\n</ul><p><br></p>`;
        break;
      case 'circle':
        listHtml = `<ul style="list-style-type: circle; margin: 16px 0 20px 28px;">\n  <li>General statutory condition...</li>\n  <li>Ancillary provision...</li>\n  <li>Procedural formality...</li>\n</ul><p><br></p>`;
        break;
      case 'square':
        listHtml = `<ul style="list-style-type: square; margin: 16px 0 20px 28px;">\n  <li>Mandatory compliance requirement...</li>\n  <li>Regulatory disclosure obligation...</li>\n  <li>Statutory authority oversight...</li>\n</ul><p><br></p>`;
        break;
      case 'arrow':
        listHtml = `<ul class="legal-list-arrow">\n  <li>Core legal argument & statutory basis...</li>\n  <li>Appellate court ratio decidendi...</li>\n  <li>Binding precedent under Article 141...</li>\n</ul><p><br></p>`;
        break;
      case 'check':
        listHtml = `<ul class="legal-list-check">\n  <li>Requisite locus standi established;</li>\n  <li>Pre-institution notice duly served and acknowledged;</li>\n  <li>Cause of action within statutory limitation period.</li>\n</ul><p><br></p>`;
        break;
      case 'cross':
        listHtml = `<ul class="legal-list-cross">\n  <li>Barred under Section 9 of the Code of Civil Procedure;</li>\n  <li>Expressly excluded by special statutory enactment;</li>\n  <li>Relief disallowed due to suppression of material facts.</li>\n</ul><p><br></p>`;
        break;
      case 'star':
        listHtml = `<ul class="legal-list-star">\n  <li>Landmark Constitution Bench judgment ratio;</li>\n  <li>Doctrine of severability successfully applied;</li>\n  <li>Prospective overruling of previous authority.</li>\n</ul><p><br></p>`;
        break;
      default:
        listHtml = `<ul>\n  <li>Point 1</li>\n  <li>Point 2</li>\n</ul><p><br></p>`;
    }
    insertHtmlAtCursor(listHtml);
    setShowBulletMenu(false);
  };

  // ── All Numbered List & Statutory Clause Types ──
  const insertNumberedList = (styleType) => {
    let listHtml = '';
    switch (styleType) {
      case 'decimal':
        listHtml = `<ol style="list-style-type: decimal; margin: 16px 0 20px 28px;">\n  <li>Filing of original plaint with requisite court fee;</li>\n  <li>Issuance of summons to the contesting defendant;</li>\n  <li>Filing of written statement within thirty days.</li>\n</ol><p><br></p>`;
        break;
      case 'alpha-lower':
        listHtml = `<ol style="list-style-type: lower-alpha; margin: 16px 0 20px 28px;">\n  <li>Whether the civil court possesses subject-matter jurisdiction;</li>\n  <li>Whether the suit is hit by the principles of res judicata;</li>\n  <li>Whether the plaintiff is entitled to injunctive relief.</li>\n</ol><p><br></p>`;
        break;
      case 'alpha-upper':
        listHtml = `<ol style="list-style-type: upper-alpha; margin: 16px 0 20px 28px;">\n  <li>Primary statutory grounds of appeal;</li>\n  <li>Substantial questions of law formulated;</li>\n  <li>Interim protection pending final hearing.</li>\n</ol><p><br></p>`;
        break;
      case 'roman-lower':
        listHtml = `<ol style="list-style-type: lower-roman; margin: 16px 0 20px 28px;">\n  <li>Prima facie case in favor of applicant;</li>\n  <li>Balance of convenience tilting towards plaintiff;</li>\n  <li>Irreparable injury if ad-interim injunction refused.</li>\n</ol><p><br></p>`;
        break;
      case 'roman-upper':
        listHtml = `<ol style="list-style-type: upper-roman; margin: 16px 0 20px 28px;">\n  <li>Preliminary Objections as to Maintainability;</li>\n  <li>Merits of the Substantive Claims;</li>\n  <li>Directions & Consequential Relief Granted.</li>\n</ol><p><br></p>`;
        break;
      default:
        listHtml = `<ol>\n  <li>Step 1</li>\n  <li>Step 2</li>\n</ol><p><br></p>`;
    }
    insertHtmlAtCursor(listHtml);
    setShowNumberMenu(false);
  };

  // ── Table Templates ──
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
        <td>Key operational definitions, terms, and regulatory references.</td>
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
        <td>Statutory right of banker set-off cannot be exercised arbitrarily without due notice to account holder.</td>
      </tr>
      <tr>
        <td><strong>Standard Chartered Bank v. Directorate of Enforcement</strong></td>
        <td>Constitution Bench (5 Judges)</td>
        <td>Corporate criminal liability applies even where statutory penal sanction specifies mandatory imprisonment.</td>
      </tr>
    </tbody>
  </table>
</div>
<p><br></p>
`;
    insertHtmlAtCursor(tableHtml);
    setShowTableModal(false);
  };

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

  const handleTabSwitch = (tab) => {
    if ((tab === 'visual' || tab === 'split') && activeTab === 'code') {
      if (visualRef.current) {
        visualRef.current.innerHTML = content;
      }
    }
    setActiveTab(tab);
    // Close popovers
    setShowFontMenu(false);
    setShowSizeMenu(false);
    setShowTableModal(false);
    setShowBulletMenu(false);
    setShowNumberMenu(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
  };

  // Close all popovers on outside click
  const closeAllPopovers = () => {
    setShowFontMenu(false);
    setShowSizeMenu(false);
    setShowTableModal(false);
    setShowBulletMenu(false);
    setShowNumberMenu(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
  };

  const cleanText = content.replace(/<[^>]+>/g, ' ').trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const readTimeEst = Math.max(1, Math.ceil(wordCount / 200));
  const tableCount = (content.match(/<table/g) || []).length;
  const listCount = (content.match(/<(ul|ol)/g) || []).length;

  return (
    <div className={`wp-editor-wrapper ${isFullscreen ? 'wp-fullscreen-mode' : ''}`} onClick={closeAllPopovers}>
      {/* WordPress Editor Header & Mode Tabs */}
      <div className="wp-editor-header" onClick={(e) => e.stopPropagation()}>
        <div className="wp-editor-title-row">
          <span className="wp-badge">WORDPRESS ARTICLE BUILDER</span>
          <span className="wp-hint">
            {isFullscreen ? 'FULLSCREEN CANVAS MODE • 100% monitor width for editing legal statutes and tables without clipping.' : 'Full-width canvas • Insert legal fonts, statutory bullets, and interactive tables anywhere in paragraphs.'}
          </span>
        </div>

        <div className="wp-tabs">
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('split')}
            title="Side-by-side editing and real-time live student reader preview"
          >
            Split View (Editor + Live Preview)
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('visual')}
            title="Full-width visual WYSIWYG rich text editor"
          >
            Visual Editor
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
            Full Reader Preview
          </button>

          {/* Fullscreen Canvas Toggle */}
          <button
            type="button"
            className={`wp-tab-btn wp-tab-btn-fullscreen ${isFullscreen ? 'active' : ''}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen Canvas (Esc)" : "Expand Canvas to 100% Fullscreen"}
            style={{
              marginLeft: 'auto',
              background: isFullscreen ? 'var(--admin-gold, #cfa856)' : 'rgba(207, 168, 86, 0.1)',
              color: isFullscreen ? '#ffffff' : 'var(--admin-gold, #cfa856)',
              borderColor: 'var(--admin-gold, #cfa856)',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px'
            }}
          >
            {isFullscreen ? (
              <>
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>⤓</span>
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>⛶</span>
                <span>Fullscreen Canvas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* WordPress Toolbar */}
      {activeTab !== 'preview' && (
        <div className="wp-toolbar" onClick={(e) => e.stopPropagation()}>
          {/* Format (H2, H3, P) */}
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
              title="Heading & Paragraph Formatting"
            >
              <option value="" disabled>Format...</option>
              <option value="p">Paragraph Text</option>
              <option value="h2">Section Heading (H2)</option>
              <option value="h3">Sub-Heading (H3)</option>
              <option value="h4">Minor Clause (H4)</option>
            </select>
          </div>

          {/* ── Font Family & Size Popover Pickers ── */}
          <div className="wp-toolbar-group">
            {/* Font Family Popover Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn wp-btn-font"
                title="Choose from 12 Most Used Typography Fonts"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateSavedRange();
                }}
                onClick={() => {
                  setShowFontMenu(!showFontMenu);
                  setShowSizeMenu(false);
                  setShowBulletMenu(false);
                  setShowNumberMenu(false);
                  setShowTableModal(false);
                  setShowColorPicker(false);
                  setShowHighlightPicker(false);
                }}
              >
                <span>{currentFontLabel}</span>
              </button>

              {showFontMenu && (
                <div className="wp-popover-menu wp-popover-fonts">
                  <div className="wp-popover-header">
                    <strong>12 Most Popular & Used Fonts:</strong>
                    <button type="button" onClick={() => setShowFontMenu(false)} className="wp-popover-close">✕</button>
                  </div>
                  <div className="wp-font-scroll-list">
                    {FONTS_LIST.map((font) => (
                      <button
                        key={font.name}
                        type="button"
                        className="wp-font-card"
                        onClick={() => applyFontFamily(font)}
                      >
                        <div className="wp-font-card-left">
                          <span className="wp-font-badge" style={{ fontFamily: font.family }}>Aa</span>
                          <div>
                            <div className="wp-font-name" style={{ fontFamily: font.family }}>{font.name}</div>
                            <div className="wp-font-cat">{font.category}</div>
                          </div>
                        </div>
                        <div className="wp-font-preview" style={{ fontFamily: font.family }}>
                          {font.preview}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font Size Popover Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn wp-btn-size"
                title="Choose Font Size"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateSavedRange();
                }}
                onClick={() => {
                  setShowSizeMenu(!showSizeMenu);
                  setShowFontMenu(false);
                  setShowBulletMenu(false);
                  setShowNumberMenu(false);
                  setShowTableModal(false);
                  setShowColorPicker(false);
                  setShowHighlightPicker(false);
                }}
              >
                <span>{currentSizeLabel}</span>
              </button>

              {showSizeMenu && (
                <div className="wp-popover-menu wp-popover-sizes">
                  <div className="wp-popover-header">
                    <strong>Select Font Size:</strong>
                    <button type="button" onClick={() => setShowSizeMenu(false)} className="wp-popover-close">✕</button>
                  </div>
                  <div className="wp-size-list">
                    {SIZES_LIST.map((size) => (
                      <button
                        key={size.label}
                        type="button"
                        className="wp-size-card"
                        onClick={() => applyFontSize(size)}
                      >
                        <span className="wp-size-val" style={{ fontSize: size.px }}>{size.label}</span>
                        <span className="wp-size-desc">{size.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

            {/* Text Color Picker */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn"
                title="Text Color"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
              >
                <span style={{ borderBottom: '3px solid #cfa856', paddingBottom: '1px', fontWeight: 800 }}>A</span>
              </button>

              {showColorPicker && (
                <div className="wp-popover-palette">
                  <div className="wp-popover-title">Text Color:</div>
                  <div className="wp-color-grid">
                    <button type="button" style={{ background: '#09131e' }} title="Navy / Charcoal" onClick={() => handleTextColor('#09131e')} />
                    <button type="button" style={{ background: '#cfa856' }} title="Luxury Gold" onClick={() => handleTextColor('#cfa856')} />
                    <button type="button" style={{ background: '#2563eb' }} title="Royal Blue" onClick={() => handleTextColor('#2563eb')} />
                    <button type="button" style={{ background: '#059669' }} title="Emerald Green" onClick={() => handleTextColor('#059669')} />
                    <button type="button" style={{ background: '#dc2626' }} title="Crimson Red" onClick={() => handleTextColor('#dc2626')} />
                    <button type="button" style={{ background: '#64748b' }} title="Slate Gray" onClick={() => handleTextColor('#64748b')} />
                    <button type="button" style={{ background: '#ffffff', border: '1px solid #ccc' }} title="White" onClick={() => handleTextColor('#ffffff')} />
                  </div>
                </div>
              )}
            </div>

            {/* Highlighter Marker */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn"
                title="Statutory Text Highlighter"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
              >
                <span style={{ background: 'rgba(207, 168, 86, 0.25)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Highlight</span>
              </button>

              {showHighlightPicker && (
                <div className="wp-popover-palette">
                  <div className="wp-popover-title">Highlighter Marker:</div>
                  <div className="wp-color-grid">
                    <button type="button" style={{ background: 'rgba(207, 168, 86, 0.4)' }} title="Gold Marker" onClick={() => handleHighlightColor('rgba(207, 168, 86, 0.4)')} />
                    <button type="button" style={{ background: '#fef08a' }} title="Pastel Yellow" onClick={() => handleHighlightColor('#fef08a')} />
                    <button type="button" style={{ background: '#bbf7d0' }} title="Mint Green" onClick={() => handleHighlightColor('#bbf7d0')} />
                    <button type="button" style={{ background: '#bae6fd' }} title="Sky Blue" onClick={() => handleHighlightColor('#bae6fd')} />
                    <button type="button" style={{ background: '#fecdd3' }} title="Rose Pink" onClick={() => handleHighlightColor('#fecdd3')} />
                    <button type="button" className="btn-clear-highlight" title="Clear Marker" onClick={() => handleHighlightColor('transparent')}>✕</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── ALL BULLETS POPUP & QUICK BUTTONS ── */}
          <div className="wp-toolbar-group">
            {/* All Bullets Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn wp-btn-list"
                title="Choose from all types of bullet lists"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateSavedRange();
                }}
                onClick={() => {
                  setShowBulletMenu(!showBulletMenu);
                  setShowNumberMenu(false);
                  setShowTableModal(false);
                }}
              >
                Bullets
              </button>

              {showBulletMenu && (
                <div className="wp-popover-menu wp-popover-wide">
                  <div className="wp-popover-header">
                    <strong>Select Bullet List Style:</strong>
                    <button type="button" onClick={() => setShowBulletMenu(false)} className="wp-popover-close">✕</button>
                  </div>
                  <div className="wp-popover-grid">
                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('disc')}>
                      <span className="wp-bullet-sample">•</span>
                      <div>
                        <div className="wp-bullet-title">Standard Disc Bullet</div>
                        <div className="wp-bullet-sub">Default solid black dot</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('circle')}>
                      <span className="wp-bullet-sample">○</span>
                      <div>
                        <div className="wp-bullet-title">Circle Ring Bullet</div>
                        <div className="wp-bullet-sub">Hollow round outline</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('square')}>
                      <span className="wp-bullet-sample">■</span>
                      <div>
                        <div className="wp-bullet-title">Solid Square Bullet</div>
                        <div className="wp-bullet-sub">Sharp regulatory square</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('arrow')}>
                      <span className="wp-bullet-sample" style={{ color: 'var(--admin-gold)' }}>➔</span>
                      <div>
                        <div className="wp-bullet-title">Legal Arrow Pointer</div>
                        <div className="wp-bullet-sub">Directional legal takeaways</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('check')}>
                      <span className="wp-bullet-sample" style={{ color: '#10b981' }}>✓</span>
                      <div>
                        <div className="wp-bullet-title">Verified Checklist</div>
                        <div className="wp-bullet-sub">Essential statutory conditions</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('cross')}>
                      <span className="wp-bullet-sample" style={{ color: '#ef4444' }}>✗</span>
                      <div>
                        <div className="wp-bullet-title">Barred / Prohibitions</div>
                        <div className="wp-bullet-sub">Negative statutory covenants</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertBulletList('star')}>
                      <span className="wp-bullet-sample" style={{ color: 'var(--admin-gold)' }}>★</span>
                      <div>
                        <div className="wp-bullet-title">Landmark Star Ratio</div>
                        <div className="wp-bullet-sub">Precedent & pivotal ratios</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* All Numbers & Clauses Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="wp-tool-btn wp-btn-list"
                title="Choose from all numbered & clause styles"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateSavedRange();
                }}
                onClick={() => {
                  setShowNumberMenu(!showNumberMenu);
                  setShowBulletMenu(false);
                  setShowTableModal(false);
                }}
              >
                Numbers & Clauses
              </button>

              {showNumberMenu && (
                <div className="wp-popover-menu wp-popover-wide">
                  <div className="wp-popover-header">
                    <strong>Select Numbering / Clause Style:</strong>
                    <button type="button" onClick={() => setShowNumberMenu(false)} className="wp-popover-close">✕</button>
                  </div>
                  <div className="wp-popover-grid">
                    <button type="button" className="wp-menu-item" onClick={() => insertNumberedList('decimal')}>
                      <span className="wp-bullet-sample">1.</span>
                      <div>
                        <div className="wp-bullet-title">1., 2., 3. Decimal Numbers</div>
                        <div className="wp-bullet-sub">Procedural steps & sequence</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertNumberedList('alpha-lower')}>
                      <span className="wp-bullet-sample">(a)</span>
                      <div>
                        <div className="wp-bullet-title">(a), (b), (c) Statutory Clauses</div>
                        <div className="wp-bullet-sub">Sections & legislative subsections</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertNumberedList('alpha-upper')}>
                      <span className="wp-bullet-sample">(A)</span>
                      <div>
                        <div className="wp-bullet-title">(A), (B), (C) Capital Schedules</div>
                        <div className="wp-bullet-sub">Statutory appendixes & divisions</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertNumberedList('roman-lower')}>
                      <span className="wp-bullet-sample">(i)</span>
                      <div>
                        <div className="wp-bullet-title">(i), (ii), (iii) Judicial Sub-clauses</div>
                        <div className="wp-bullet-sub">Court judgment ingredients</div>
                      </div>
                    </button>

                    <button type="button" className="wp-menu-item" onClick={() => insertNumberedList('roman-upper')}>
                      <span className="wp-bullet-sample">I.</span>
                      <div>
                        <div className="wp-bullet-title">I., II., III. Major Parts / Acts</div>
                        <div className="wp-bullet-sub">Chapters & overarching parts</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick 1-Click Bullets */}
            <button
              type="button"
              className="wp-tool-btn"
              title="Quick Checkmark Conditions"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertBulletList('check')}
            >
              Conditions
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Quick Legal Arrow Pointer"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertBulletList('arrow')}
            >
              Takeaways
            </button>
          </div>

          {/* ── TABLES INSERTION ── */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn wp-btn-table"
              title="Choose or create a custom table"
              onMouseDown={(e) => {
                e.preventDefault();
                updateSavedRange();
              }}
              onClick={() => {
                setShowTableModal(!showTableModal);
                setShowBulletMenu(false);
                setShowNumberMenu(false);
              }}
            >
              Tables
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click 3-Column Statutory Section Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertSectionTable}
            >
              Section Table
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click Landmark Case Law Summary Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertCaseLawTable}
            >
              Case Table
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="One-click Legal Comparison Table"
              onMouseDown={(e) => e.preventDefault()}
              onClick={insertComparisonTable}
            >
              Compare
            </button>
          </div>

          {/* ── QUOTES, CALLOUTS & DIVIDERS ── */}
          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Insert Judicial Quote Block"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const quoteHtml = `<blockquote>"The rule of law permeates the entire fabric of our Constitution. Any arbitrary executive action is inherently vulnerable to judicial review under Article 226."</blockquote><p><br></p>`;
                insertHtmlAtCursor(quoteHtml);
              }}
            >
              Quote
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Insert Statutory Ratio Callout Box"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const callout = '<div class="statutory-callout"><strong>STATUTORY RATIO:</strong> Enter pivotal legal principle, test of admissibility, or courtroom practice advice...</div><p><br></p>';
                insertHtmlAtCursor(callout);
              }}
            >
              Callout Box
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
              Line
            </button>
          </div>
        </div>
      )}

      {/* Table Generator Modal */}
      {showTableModal && (
        <div className="wp-table-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ margin: 0 }}>Insert Table in Middle of Paragraph</h4>
            <button 
              type="button" 
              onClick={() => setShowTableModal(false)}
              className="wp-popover-close"
            >
              ✕
            </button>
          </div>

          <div className="wp-table-templates-bar">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-gold)' }}>One-Click Presets:</span>
            <button type="button" className="btn-preset-pill" onClick={insertSectionTable}>
              Section Table (3 Cols)
            </button>
            <button type="button" className="btn-preset-pill" onClick={insertCaseLawTable}>
              Case Law Summary Table
            </button>
            <button type="button" className="btn-preset-pill" onClick={insertComparisonTable}>
              Legal Comparison Table
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--admin-border, #e2e8f0)', paddingTop: '14px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
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
                Insert Custom Table at Cursor
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
                <span>VISUAL WYSIWYG CANVAS (Edit paragraphs, legal fonts, tables & bullets here)</span>
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
              <span>LIVE READER PREVIEW • Real-time student view with TeachMeLegal styling</span>
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
          {activeTab === 'split' ? 'Dual-Pane Live Mode Active' : activeTab === 'preview' ? 'Previewing Full Layout' : 'Edit Mode Active'}
        </span>
      </div>
    </div>
  );
}
