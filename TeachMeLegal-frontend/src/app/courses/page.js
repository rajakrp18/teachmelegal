import React from 'react';
import Navbar from '../../components/Navbar';
import Courses from '../../components/Courses';
import Footer from '../../components/Footer';

export default function CoursesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <Courses />
      </div>
      <Footer />
    </main>
  );
}
