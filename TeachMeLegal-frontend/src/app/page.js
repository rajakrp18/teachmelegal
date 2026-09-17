"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InstructorProfile from '../components/InstructorProfile';
import Courses from '../components/Courses';
import YouTubeLectures from '../components/YouTubeLectures';
import Reviews from '../components/Reviews';
import BlogPreview from '../components/BlogPreview';
import AppPromotion from '../components/AppPromotion';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <InstructorProfile />
      <Courses />
      <YouTubeLectures />
      <Reviews />
      <BlogPreview />
      <AppPromotion />
      <Footer />
    </main>
  );
}
