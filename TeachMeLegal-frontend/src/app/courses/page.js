import React from 'react';
import Navbar from '../../components/Navbar';
import Courses from '../../components/Courses';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Courses & Books | Teach Me Legal',
  description: 'Explore comprehensive Indian legal courses, statutory study books, and judiciary exam charts by Advocate Prashant Jha.',
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-main)] pt-28">
      <Navbar />
      
      {/* Standalone Courses Page Header */}
      <section className="bg-[var(--bg-hero)] text-white py-16 px-4 text-center relative overflow-hidden mb-8">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="capsule-badge mb-4">📚 EXPLORE OUR LEGAL LIBRARY</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Master Indian Law with <span className="gold-text">Structured Courses</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Practical video lectures, exam revision charts, and courtroom case study guides created by practicing Advocate Prashant Jha.
          </p>
        </div>
      </section>

      {/* Courses Grid Section */}
      <div className="pb-16">
        <Courses />
      </div>

      <Footer />
    </main>
  );
}
