import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ContactForm from '../../components/ContactForm';
import './contact.css';

export const metadata = {
  title: 'Contact Us | Teach Me Legal',
  description: 'Get in touch with Advocate Prashant Jha and the Teach Me Legal team.',
};

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Contact</h1>
        </div>
      </section>

      <ContactForm />

      {/* Google Maps Embed */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.1234567890123!2d77.0369!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05da8b4c5555%3A0xb0987a1234567890!2sDwarka%2C%20Delhi%2C%20110059!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Teach Me Legal Office Location"
        />
      </div>

      <Footer />
    </main>
  );
}
