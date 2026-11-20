"use client";
import React, { useState } from 'react';
import { 
  IconMapPin, 
  IconPhone, 
  IconMail, 
  IconClock, 
  IconMessageCircle, 
  IconShieldCheck, 
  IconCheckCircle, 
  IconArrowUpRight 
} from './Icons';
import './ContactForm.css';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section className="contact-section">
      <div className="container contact-layout">

        {/* Left Info Column */}
        <div className="contact-info-col">
          <span className="capsule-badge-gold mb-3">
            <span className="badge-icon"><IconMessageCircle size={13} /></span>
            <span>LEGAL CHAMBERS CONSULTATION</span>
          </span>
          <h2 className="contact-info-title">Keep In Touch With Us</h2>
          <div className="contact-info-divider" />
          <p className="contact-info-desc">
            For all inquiries or assistance, please contact us using the form. Our team is dedicated to responding promptly and professionally.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-icon-bubble">
                <IconMapPin size={22} />
              </div>
              <div>
                <strong>OUR ADDRESS</strong>
                <p>Nawada Housing Complex, Vipin Garden,<br/>Dwarka Mor, Delhi - 110059</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon-bubble">
                <IconPhone size={22} />
              </div>
              <div>
                <strong>DIRECT PHONE</strong>
                <p>+91 94725 68264</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon-bubble">
                <IconMail size={22} />
              </div>
              <div>
                <strong>OFFICIAL EMAIL</strong>
                <p>info@teachmelegal.com<br/>prashant@teachmelegal.com</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-icon-bubble">
                <IconClock size={22} />
              </div>
              <div>
                <strong>CHAMBER HOURS</strong>
                <p>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="guarantee-trust-card">
            <div className="guarantee-icon-wrap">
              <IconShieldCheck size={20} />
            </div>
            <div className="guarantee-text">
              <strong>Chamber Response Guarantee</strong>
              <span>Direct response from Advocate Prashant Jha&apos;s chambers within 24 business hours.</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="contact-form-col">
          <div className="contact-form-card">
            <h3 className="form-card-title">Get in Touch</h3>
            <div className="form-card-divider" />
            <p className="form-card-sub">Fill in your details below and we will get back to you promptly.</p>

            {submitted && (
              <div className="form-success-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconCheckCircle size={18} style={{ flexShrink: 0 }} />
                <span>Message sent! Advocate Prashant Jha's team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject / Topic *"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <textarea
                name="message"
                placeholder="How can we assist you with legal learning or courses? *"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="form-input form-textarea"
              />
              <button type="submit" className="btn btn-gold form-submit-btn">
                <span>Send Message</span>
                <span className="btn-arrow-icon">
                  <IconArrowUpRight size={13} />
                </span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactForm;
