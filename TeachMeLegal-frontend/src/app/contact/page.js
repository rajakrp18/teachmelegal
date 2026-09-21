import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ContactForm from '../../components/ContactForm';
import './contact.css';

export const metadata = {
  title: 'Contact Us | Teach Me Legal',
  description: 'Get in touch with Advocate Prashant Jha and the Teach Me Legal team for legal courses and inquiries.',
};

export default function ContactPage() {
  return (
    <main className="contact-page-wrapper">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="contact-hero">
        <div className="container contact-hero-container">
          <span className="capsule-badge-gold mb-3">⚖️ DIRECT CHAMBER INQUIRIES</span>
          <h1 className="contact-hero-title">
            Get In Touch With <span className="gold-text">Our Chambers</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions regarding legal courses, judicial examination notes, or professional legal consultations? Reach out directly to Advocate Prashant Jha.
          </p>
        </div>
      </section>

      <ContactForm />

      {/* Google Maps Embed Container */}
      <section className="map-section">
        <div className="container">
          <div className="map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.1234567890123!2d77.0369!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05da8b4c5555%3A0xb0987a1234567890!2sDwarka%2C%20Delhi%2C%20110059!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Teach Me Legal Office Location"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
