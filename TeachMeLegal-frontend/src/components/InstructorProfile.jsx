import Image from 'next/image';
import Link from 'next/link';
import './InstructorProfile.css';

const InstructorProfile = () => {
  return (
    <section id="about" className="instructor-section">
      <div className="container">
        <div className="instructor-content">
          <div className="instructor-image-wrapper">
            <Image
              src="/prashant-jha.jpg"
              alt="Advocate Prashant Jha at Supreme Court of India"
              width={450}
              height={540}
              className="instructor-photo"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
            <div className="experience-badge">
              <span className="years">5+</span>
              <span className="text">Years of<br/>Legal Practice</span>
            </div>
          </div>
          
          <div className="instructor-info">
            <h2 className="section-title">Meet Your Instructor</h2>
            <h3 className="instructor-name">Advocate Prashant Jha</h3>
            <p className="instructor-bio">
              A practicing lawyer in Delhi, Advocate Prashant Jha appears before the <strong>Supreme Court of India</strong>, the <strong>High Court of Delhi</strong>, District Courts, and various Tribunals. He founded Teachmelegal during the 2020 lockdown to make quality legal education accessible to everyone across India.
            </p>
            
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">30K+</span>
                <span className="stat-label">Enrolled Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Courses & Books</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>

            <div className="instructor-actions">
              <a href="https://www.youtube.com/watch?v=hy5ji_1vu2M" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Watch Free Lectures
              </a>
              <Link href="/about" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorProfile;
