import React from 'react';
import './AppPromotion.css';

const AppPromotion = () => {
  return (
    <section className="app-promotion" id="app">
      <div className="container app-container">
        <div className="app-content">
          <h2 className="section-title">Learn On The Go</h2>
          <p className="section-subtitle">
            Download the <strong>Teach Me Legal</strong> app to access your courses, subject-wise notes, and question banks anywhere, anytime.
          </p>
          <ul className="app-features">
            <li><span className="check">✓</span> Offline video downloads</li>
            <li><span className="check">✓</span> Exclusive app-only quizzes</li>
            <li><span className="check">✓</span> Seamless progress syncing</li>
          </ul>
          <div className="store-buttons">
            <button className="btn btn-primary store-btn">
              Download on App Store
            </button>
            <button className="btn btn-secondary store-btn">
              Get it on Google Play
            </button>
          </div>
        </div>
        <div className="app-image">
           <div className="phone-mockup glass">
             <div className="phone-screen">
                <div className="phone-header">Teach Me Legal</div>
                <div className="phone-body">
                  <div className="phone-card"></div>
                  <div className="phone-card"></div>
                  <div className="phone-card"></div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromotion;
