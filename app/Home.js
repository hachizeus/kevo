// Home.js
import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Jewelry Management System Solutions</h1>
        <nav className="nav nav-tabs justify-content-end p-4">
          {['Home', 'Solutions', 'Applications', 'Case-studies', 'Methodology', 'Recommendation', 'References', 'Appendices', 'Portfolio'].map((item, index) => (
            <a key={index} className="nav-link" href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a>
          ))}
        </nav>
      </header>

      {/* Solutions Section */}
      <section id="solutions" className="section">
        <h2>Proposed Solutions</h2>
        <ul>
          <li>Implementing comprehensive Jewelry Management Systems</li>
          <li>Streamlining operations by automating routine tasks</li>
          <li>Improving customer experience</li>
          <li>Enhancing decision making</li>
          <li>Implementing strict security measures</li>
          <li>Generating detailed financial reports</li>
          <li>Compliance and quality control</li>
          <li>Monitoring sales performance</li>
        </ul>
      </section>

      {/* Application Systems Section */}
      <section id="applications" className="section">
        <h2>Application Systems Used</h2>
        <h3>Point of Sale (POS) Systems</h3>
        <p>Automates sales transactions, manages customer data, and tracks inventory in real-time.</p>
        {/* Additional subsections for CRM, Inventory, Financial Management, etc. */}
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="section">
        <h2>Case Studies</h2>
        <article className="case-study">
          <h3>Case Study 1: ORIX Gems and Jewelers - Local System</h3>
          <p>Focused on comprehensive requirement analysis and detailed system design.</p>
        </article>
        {/* More case studies */}
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section">
        <h2>Image Portfolio</h2>
        <div className="portfolio-gallery">
          {/* Images with src and alt can be mapped from an array if dynamic */}
          <img src="./assets/images/12.png" alt="Beautiful necklace" onClick={() => openModal('./assets/images/12.png')} />
          {/* Add more images as needed */}
        </div>
      </section>

      {/* Modal for Image Preview */}
      <div id="imageModal" className="modal" onClick={closeModal}>
        <span className="close" onClick={closeModal}>&times;</span>
        <img className="modal-content" id="modalImage" />
        <div id="caption"></div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2024 Jewelry Management Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

// JavaScript functions for image modal behavior
const openModal = (src) => {
  document.getElementById('imageModal').style.display = 'block';
  document.getElementById('modalImage').src = src;
};

const closeModal = () => {
  document.getElementById('imageModal').style.display = 'none';
};

// Inline styles for basic layout
const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(135deg, #1f1f1f, #313131)',
    color: '#fff'
  },
  header: {
    padding: '40px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    color: '#0ff',
    textShadow: '0 2px 10px rgba(0, 255, 255, 0.7)'
  },
  footer: {
    textAlign: 'center',
    padding: '20px 0',
    backgroundColor: '#222'
  }
};

export default Home;
