"use client";
import React, { useState } from 'react';
import { IconPlay, IconEye } from './Icons';
import './YouTubeLectures.css';

const YOUTUBE_VIDEOS = [
  {
    id: 'rxJYGzzhY7I',
    title: 'Charter of 1600 | Establishment of East India Company & Legal History',
    duration: '25 min',
    views: '85K',
    fallbackThumb: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hy5ji_1vu2M',
    title: 'Sir Henry Maine & Historical School of Jurisprudence',
    duration: '35 min',
    views: '120K',
    fallbackThumb: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'czGgMUU0ukM',
    title: 'Analytical School of Jurisprudence | Austin, Bentham, Hart & Kelsen',
    duration: '46 min',
    views: '92K',
    fallbackThumb: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dapZlSgL_S4',
    title: 'John Austin & Command Theory of Law | Complete Revision',
    duration: '1 hr 14 min',
    views: '150K',
    fallbackThumb: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'VMcdDDPwhoo',
    title: 'Immanuel Kant | Philosophical School of Jurisprudence & Justice',
    duration: '52 min',
    views: '78K',
    fallbackThumb: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'MLCFRb16bo8',
    title: 'Max Weber | Sociological School of Jurisprudence | Law & Authority',
    duration: '41 min',
    views: '65K',
    fallbackThumb: 'https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=800'
  },
];

const PLAYLIST_ID = 'PLiMMBEhj4gTH4_z0pXwEBv3jEzO1k_2er';

const YouTubeLectures = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="yt-section">
      <div className="container">
        <div className="yt-header">
          <div>
            <span className="capsule-badge-gold mb-3">
              <span className="badge-icon"><IconPlay size={11} /></span>
              <span>SUPREME COURT MASTERCLASSES</span>
            </span>
            <h2 className="yt-title">Watch Free Legal Masterclasses</h2>
            <p className="yt-subtitle">
              Learn jurisprudence with Adv. Prashant Jha — structured statutory explanations, exam-oriented frameworks, and practical courtroom insights.
            </p>
          </div>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-cinema-btn"
          >
            <span className="yt-play-bubble">
              <IconPlay size={13} />
            </span>
            <span>Access Complete Playlist</span>
          </a>
        </div>

        {/* Featured / Active Video Player */}
        {activeVideo && (
          <div className="yt-player-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="yt-player"
            />
            <button className="yt-close-btn" onClick={() => setActiveVideo(null)}>✕ Close</button>
          </div>
        )}

        {/* Videos Grid */}
        <div className="yt-grid">
          {YOUTUBE_VIDEOS.map((video, idx) => (
            <div key={`${video.id}-${idx}`} className="yt-card" onClick={() => setActiveVideo(video.id)}>
              <div className="yt-thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = video.fallbackThumb;
                  }}
                />
                <div className="yt-play-overlay">
                  <span className="yt-play-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPlay size={16} />
                  </span>
                </div>
                <span className="yt-duration">{video.duration}</span>
              </div>
              <div className="yt-card-info">
                <h4 className="yt-card-title">{video.title}</h4>
                <div className="yt-card-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <IconEye size={14} style={{ color: 'var(--accent-gold)' }} />
                    {video.views} views
                  </span>
                  <span className="yt-free-badge">FREE</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="yt-cta">
          <a
            href="https://www.youtube.com/@teachmelegal"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary yt-subscribe-btn"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <IconPlay size={14} />
            <span>Subscribe on YouTube</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeLectures;
