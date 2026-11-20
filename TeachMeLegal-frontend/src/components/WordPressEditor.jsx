"use client";
import React, { useState, useRef, useEffect } from 'react';
import './WordPressEditor.css';

export default function WordPressEditor({ value = '', onChange }) {
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'code' | 'preview'
  const [content, setContent] = useState(value);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableCols, setTableCols] = useState(2);
  const [tableRows, setTableRows] = useState(3);
  const [tableHeader, setTableHeader] = useState(true);

  const visualRef = useRef(null);
  const textareaRef = useRef(null);

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
  };

  const executeCommand = (command, val = null) => {
    if (activeTab === 'visual') {
      document.execCommand(command, false, val);
      handleVisualInput();
    } else {
      // In code mode, wrap selection
      insertIntoTextarea(command, val);
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
      case 'formatBlock':
        replacement = `<${val}>${selected || 'Heading'}</${val}>`;
        break;
      case 'insertUnorderedList':
        replacement = `\n<ul>\n  <li>${selected || 'Bullet item 1'}</li>\n  <li>Bullet item 2</li>\n</ul>\n`;
        break;
      case 'insertOrderedList':
        replacement = `\n<ol>\n  <li>${selected || 'Numbered step 1'}</li>\n  <li>Numbered step 2</li>\n</ol>\n`;
        break;
      case 'blockquote':
        replacement = `\n<blockquote>${selected || 'Enter quote or legal ruling...'}</blockquote>\n`;
        break;
      case 'callout':
        replacement = `\n<div class="statutory-callout">\n  <strong>STATUTORY NOTE:</strong> ${selected || 'Key ratio or legal analysis...'}\n</div>\n`;
        break;
      case 'hr':
        replacement = `\n<hr class="section-divider" />\n`;
        break;
      default:
        replacement = selected;
    }

    const newText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    updateContent(newText);
  };

  const insertTable = () => {
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
    tableHtml += '    </tbody>\n  </table>\n</div>\n';

    if (activeTab === 'visual') {
      document.execCommand('insertHTML', false, tableHtml);
      handleVisualInput();
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = textarea.value.substring(0, start) + tableHtml + textarea.value.substring(end);
        updateContent(newText);
      } else {
        updateContent(content + tableHtml);
      }
    }

    setShowTableModal(false);
  };

  const insertStatutoryTemplateTable = () => {
    const legalTableHtml = `
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
        <td>Establishment & Incorporation</td>
        <td>Body corporate with perpetual succession and common seal.</td>
      </tr>
    </tbody>
  </table>
</div>
`;
    if (activeTab === 'visual') {
      document.execCommand('insertHTML', false, legalTableHtml);
      handleVisualInput();
    } else {
      updateContent(content + legalTableHtml);
    }
  };

  const handleTabSwitch = (tab) => {
    if (tab === 'visual' && activeTab === 'code') {
      // sync code changes to visual
      if (visualRef.current) {
        visualRef.current.innerHTML = content;
      }
    }
    setActiveTab(tab);
  };

  return (
    <div className="wp-editor-wrapper">
      {/* WordPress Style Mode Header Tabs */}
      <div className="wp-editor-header">
        <div className="wp-editor-title-row">
          <span className="wp-badge">WORDPRESS ARTICLE BUILDER</span>
          <span className="wp-hint">Insert tables, bullet lists & statutory notes in the middle of paragraphs</span>
        </div>

        <div className="wp-tabs">
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('visual')}
          >
            ✏️ Visual (WYSIWYG)
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('code')}
          >
            {'</>'} Text / HTML Code
          </button>
          <button
            type="button"
            className={`wp-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('preview')}
          >
            👁️ Live Reader Preview
          </button>
        </div>
      </div>

      {/* WordPress Toolbar */}
      {activeTab !== 'preview' && (
        <div className="wp-toolbar">
          <div className="wp-toolbar-group">
            <select
              className="wp-select"
              onChange={(e) => {
                if (e.target.value) {
                  executeCommand('formatBlock', e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Format...</option>
              <option value="p">Paragraph</option>
              <option value="h2">Heading 2 (H2)</option>
              <option value="h3">Heading 3 (H3)</option>
              <option value="h4">Heading 4 (H4)</option>
            </select>
          </div>

          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Bold (Ctrl+B)"
              onClick={() => executeCommand('bold')}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Italic (Ctrl+I)"
              onClick={() => executeCommand('italic')}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Underline (Ctrl+U)"
              onClick={() => executeCommand('underline')}
            >
              <u>U</u>
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Strikethrough"
              onClick={() => executeCommand('strikeThrough')}
            >
              <s>S</s>
            </button>
          </div>

          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Bullet List"
              onClick={() => executeCommand('insertUnorderedList')}
            >
              • Bullet List
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Numbered List"
              onClick={() => executeCommand('insertOrderedList')}
            >
              1. Numbered List
            </button>
          </div>

          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn wp-btn-table"
              title="Insert Table in Text"
              onClick={() => setShowTableModal(!showTableModal)}
            >
              ⊞ Insert Table
            </button>
            <button
              type="button"
              className="wp-tool-btn wp-btn-legal"
              title="Insert 3-Column Statutory Table"
              onClick={insertStatutoryTemplateTable}
            >
              ⚖️ Section Table
            </button>
          </div>

          <div className="wp-toolbar-group">
            <button
              type="button"
              className="wp-tool-btn"
              title="Judicial Quote"
              onClick={() => {
                if (activeTab === 'visual') {
                  executeCommand('formatBlock', 'blockquote');
                } else {
                  insertIntoTextarea('blockquote');
                }
              }}
            >
              ❝ Quote
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Statutory Note Callout Box"
              onClick={() => {
                const callout = '<div class="statutory-callout"><strong>STATUTORY NOTE:</strong> Enter critical legal principle or ratio decidendi...</div>';
                if (activeTab === 'visual') {
                  document.execCommand('insertHTML', false, callout);
                  handleVisualInput();
                } else {
                  insertIntoTextarea('callout');
                }
              }}
            >
              📌 Callout Box
            </button>
            <button
              type="button"
              className="wp-tool-btn"
              title="Divider Line"
              onClick={() => {
                if (activeTab === 'visual') {
                  document.execCommand('insertHorizontalRule');
                  handleVisualInput();
                } else {
                  insertIntoTextarea('hr');
                }
              }}
            >
              ― Line
            </button>
          </div>
        </div>
      )}

      {/* Inline Table Generator Dropdown */}
      {showTableModal && (
        <div className="wp-table-modal">
          <h4>⊞ Insert Custom Table</h4>
          <div className="wp-table-inputs">
            <div>
              <label>Columns</label>
              <input
                type="number"
                min="1"
                max="8"
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 2)}
              />
            </div>
            <div>
              <label>Rows</label>
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
              <label htmlFor="th-toggle" style={{ cursor: 'pointer' }}>Include Header Row</label>
            </div>
          </div>
          <div className="wp-table-actions">
            <button type="button" className="btn-table-cancel" onClick={() => setShowTableModal(false)}>
              Cancel
            </button>
            <button type="button" className="btn-table-insert" onClick={insertTable}>
              ✓ Insert Into Paragraph
            </button>
          </div>
        </div>
      )}

      {/* Main Editing Canvas */}
      <div className="wp-canvas-container">
        {activeTab === 'visual' && (
          <div
            ref={visualRef}
            className="wp-visual-canvas post-content"
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            suppressContentEditableWarning
          />
        )}

        {activeTab === 'code' && (
          <textarea
            ref={textareaRef}
            className="wp-code-textarea"
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Type or paste your HTML article content with tables and lists here..."
          />
        )}

        {activeTab === 'preview' && (
          <div className="wp-preview-pane">
            <div className="wp-preview-notice">
              <span>👁️ LIVE PREVIEW (As displayed to students on TeachMeLegal)</span>
            </div>
            <article className="post-content prose" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>

      <div className="wp-editor-footer">
        <span>Word Count: ~{content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length} words</span>
        <span>HTML Length: {content.length} characters</span>
      </div>
    </div>
  );
}
