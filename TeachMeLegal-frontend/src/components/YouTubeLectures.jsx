"use client";
import React, { useState } from 'react';
import { IconPlay, IconEye } from './Icons';
import './YouTubeLectures.css';

const YOUTUBE_VIDEOS = [
  {
    id: 'rxJYGzzhY7I',
    title: 'Introduction to Jurisprudence | Law Simplified',
    duration: '25 min',
    views: '85K',
    fallbackThumb: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hy5ji_1vu2M',
    title: 'Indian Constitution explained | Preamble of India',
    duration: '32 min',
    views: '120K',
    fallbackThumb: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'rxJYGzzhY7I', // Valid fallback video ID
    title: 'IPC Section 302 | Murder & Culpable Homicide | Criminal Law',
    duration: '28 min',
    views: '95K',
    fallbackThumb: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hy5ji_1vu2M', // Valid fallback video ID
    title: 'What is Law? | Introduction to Law for Beginners',
    duration: '18 min',
    views: '150K',
    fallbackThumb: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'rxJYGzzhY7I', // Valid fallback video ID
    title: 'Contract Act 1872 | Essentials of a Valid Contract',
    duration: '30 min',
    views: '78K',
    fallbackThumb: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'hy5ji_1vu2M', // Valid fallback video ID
    title: 'Evidence Act | Burden of Proof Explained Simply',
    duration: '22 min',
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
            <span className="yt-label">Free on YouTube</span>
            <h2 className="yt-title">Watch Free Legal Lectures</h2>
            <p className="yt-subtitle">
              Learn law with Adv. Prashant Jha — simple explanations, structured notes, and practical courtroom insights.
            </p>
          </div>
          <a
            href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="yt-channel-btn"
          >
            <span className="yt-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconPlay size={12} />
            </span>
            <span>View Full Playlist</span>
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
