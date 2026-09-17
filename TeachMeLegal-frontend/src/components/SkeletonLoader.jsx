"use client";
import React from 'react';
import './SkeletonLoader.css';

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-shimmer" />
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-title skeleton-shimmer" />
        <div className="skeleton-line skeleton-subtitle skeleton-shimmer" />
        <div className="skeleton-footer">
          <div className="skeleton-line skeleton-price skeleton-shimmer" />
          <div className="skeleton-btn skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
