import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import apiClient from '../lib/api';

export default function Home() {
  const [text, setText] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Enhanced Typewriter effect
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showCursor, setShowCursor] = useState(true);

  const words = ['Elegant.', 'Sophisticated.', 'Bespoke.', 'Timeless.', 'Luxurious.'];

  // Enhanced product data for carousel
  const carouselProducts = featuredProducts.length > 0 ? featuredProducts : [
    {
      id: 1,
      name: 'Crimson Elegance',
      category: 'Evening Wear',
      price: 494983,
      description: 'A stunning evening gown that embodies sophistication and grace',
      image: '/images/dress1.svg',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Ocean Breeze',
      category: 'Cocktail Dress',
      price: 389985,
      description: 'Perfect for cocktail parties with its flowing silhouette',
      image: '/images/dress2.svg',
      badge: 'New Arrival'
    },
    {
      id: 3,
      name: 'Rose Mystique',
      category: 'Party Dress',
      price: 449984,
      description: 'Enchanting party dress with intricate floral details',
      image: '/images/dress3.svg',
      badge: 'Limited Edition'
    },
    {
      id: 4,
      name: 'Midnight Sapphire',
      category: 'Formal Dress',
      price: 549982,
      description: 'Luxurious formal wear for the most special occasions',
      image: '/images/dress4.svg',
      badge: 'Premium'
    },
    {
      id: 5,
      name: 'Golden Aurora',
      category: 'Gala Dress',
      price: 649981,
      description: 'Radiant gala dress that captures the essence of luxury',
      image: '/images/dress1.svg',
      badge: 'Exclusive'
    }
  ];

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(50);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100 + Math.random() * 100);
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextSlide();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentSlide, isAutoPlaying]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorTimer);
  }, []);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, socialResponse] = await Promise.all([
          apiClient.getFeaturedProducts(),
          apiClient.getSocialLinks()
        ]);

        setFeaturedProducts(productsResponse.products || []);
        setSocialLinks(socialResponse.socialLinks || {});
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMessage('');

    try {
      await apiClient.sendContactMessage(contactForm);
      setContactMessage('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setContactMessage('Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className={styles.preloaderContainer}>
        <div className={styles.preloader}>
          {/* Advanced Fashion-themed Preloader */}
          <div className={styles.fashionLoader}>
            <div className={styles.dressIcon}>
              <svg viewBox="0 0 100 100" className={styles.dressSvg}>
                <path d="M30 20 L35 15 L65 15 L70 20 L75 30 L75 85 L25 85 L25 30 Z"
                      className={styles.dressPath} />
                <circle cx="50" cy="12" r="8" className={styles.dressHead} />
              </svg>
            </div>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className={styles.loadingText}>
            <h2>MideAtelier</h2>
            <p>Crafting Elegance...</p>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>MideAtelier - Elegant Fashion Studio</title>
      </Head>
      <div className={styles.container}>
      {/* NAVIGATION */}
      <nav className={styles.navigation}>
        <div className={styles.nav}>
          <a href="#" className={styles.logo}>
            <svg className={styles.logoIcon} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c2185b" />
                  <stop offset="100%" stopColor="#e91e63" />
                </linearGradient>
              </defs>
              {/* Elegant M */}
              <path d="M8 32V8h4l6 16 6-16h4v24h-3V14l-5 14h-2l-5-14v18H8z" fill="url(#logoGradient)" />
              {/* Stylized A */}
              <path d="M38 32l8-24h3l8 24h-3l-1.5-4.5h-9l-1.5 4.5h-3zm5.5-7h7l-3.5-10.5L42.5 25z" fill="url(#logoGradient)" />
              {/* Fashion needle accent */}
              <circle cx="65" cy="20" r="2" fill="url(#logoGradient)" />
              <path d="M65 18v4M63 20h4" stroke="url(#logoGradient)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Brand text */}
              <text x="75" y="16" fontSize="8" fontFamily="serif" fontWeight="600" fill="#333">MideAtelier</text>
              <text x="75" y="26" fontSize="5" fontFamily="sans-serif" fontWeight="400" fill="#666">Fashion Studio</text>
            </svg>
          </a>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={mobileMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
          </button>

          {/* Navigation Links */}
          <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksOpen : ''}`}>
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#collections" onClick={() => setMobileMenuOpen(false)}>Collections</a></li>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
            <li><a href="#custom" onClick={() => setMobileMenuOpen(false)}>Custom</a></li>
            <li><a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Reviews</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className={styles.hero}>
        <h1>Elegance Redefined</h1>
        <p className={styles.typewriter}>
          {text}
          <span className={`${styles.cursor} ${showCursor ? styles.cursorVisible : ''}`}>|</span>
        </p>
        <button className={styles.cta}>Discover Collection</button>
      </section>

      {/* FEATURED COLLECTIONS - DYNAMIC CAROUSEL */}
      <section id="collections" className={styles.carousel}>
        {/* Professional Cover Image */}
        <div className={styles.carouselCover}>
          <img
            src="/images/carousel-cover.svg"
            alt="Curated Collections Cover"
            className={styles.coverImage}
          />
        </div>

        <div className={styles.carouselContainer}>
          {/* Carousel Track */}
          <div
            className={styles.carouselTrack}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {carouselProducts.map((product, index) => (
              <div className={styles.carouselSlide} key={product.id || index}>
                <div className={styles.slideCard}>
                  <div className={styles.slideImageContainer}>
                    <img
                      src={product.image || '/images/placeholder.svg'}
                      alt={product.name}
                      className={styles.slideImage}
                    />
                    <div className={styles.slideOverlay}>
                      <span className={styles.slideBadge}>{product.badge || product.category}</span>
                    </div>
                    <div className={styles.slideActions}>
                      <button className={styles.quickView}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button className={styles.addToWishlist}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.slideContent}>
                    <div className={styles.slideCategory}>{product.category}</div>
                    <h3 className={styles.slideTitle}>{product.name}</h3>
                    <p className={styles.slideDescription}>{product.description}</p>
                    <div className={styles.priceContainer}>
                      <span className={styles.currentPrice}>₦{product.price?.toLocaleString()}</span>
                      <span className={styles.originalPrice}>₦{((product.price || 0) * 1.3).toLocaleString()}</span>
                    </div>
                    <button className={styles.viewProductBtn}>
                      <span>View Details</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className={`${styles.carouselNav} ${styles.carouselPrev}`}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button
            className={`${styles.carouselNav} ${styles.carouselNext}`}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className={styles.carouselIndicators}>
          {carouselProducts.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>



        <div className={styles.collectionsFooter}>
          <button className={styles.viewAllButton}>
            View All Collections
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h2>Our Story</h2>
            <p>Founded in 2020, MideAtelier represents the pinnacle of contemporary fashion design. We believe that every woman deserves to feel extraordinary, and our mission is to create pieces that celebrate individuality while maintaining timeless elegance.</p>
            <p>Our team of expert designers and craftspeople work tirelessly to ensure each garment meets our exacting standards of quality, fit, and style. From concept to creation, every piece tells a story of passion, precision, and artistry.</p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <h3>500+</h3>
                <p>Happy Customers</p>
              </div>
              <div className={styles.stat}>
                <h3>1000+</h3>
                <p>Dresses Created</p>
              </div>
              <div className={styles.stat}>
                <h3>50+</h3>
                <p>Custom Designs</p>
              </div>
            </div>
          </div>
          <div className={styles.aboutLogoContainer}>
            <div className={styles.logoShowcase}>
              <img src="/images/logo.jpeg" alt="MideAtelier Logo" className={styles.aboutLogo} />
              <div className={styles.logoGlow}></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className={styles.services}>
        <h2>Our Services</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>👗</div>
            <h3>Ready-to-Wear</h3>
            <p>Curated collections of contemporary dresses designed for the modern woman.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>✂️</div>
            <h3>Custom Design</h3>
            <p>Bespoke creations tailored to your unique style, measurements, and preferences.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📏</div>
            <h3>Alterations</h3>
            <p>Professional alterations to ensure the perfect fit for any garment.</p>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>💎</div>
            <h3>Styling Consultation</h3>
            <p>Personal styling sessions to help you discover your signature look.</p>
          </div>
        </div>
      </section>

      {/* CUSTOM MADE SECTION */}
      <section id="custom" className={styles.custom}>
        <h2>Bespoke Couture</h2>
        <p>Where your vision meets our craftsmanship. Every piece is meticulously designed and tailored to your unique style and measurements.</p>

        <div className={styles.customContent}>
          <div className={styles.customText}>
            <h3>Why Choose Custom?</h3>
            <ul>
              <li>Perfect fit guaranteed</li>
              <li>Premium fabrics and materials</li>
              <li>Unique design consultation</li>
              <li>Expert craftsmanship</li>
              <li>Lifetime alterations</li>
            </ul>
            <button className={styles.customButton}>Start Your Design</button>
          </div>
          <div className={styles.customImageContainer}>
            <img src="/images/graphic.jpeg" alt="MideAtelier Brand Graphic" className={styles.customImage} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className={styles.testimonials}>
        <h2>What Our Clients Say</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p>"Absolutely stunning! The custom dress exceeded all my expectations. The attention to detail and quality is unmatched."</p>
            <div className={styles.testimonialAuthor}>
              <strong>Sarah Johnson</strong>
              <span>Bride</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p>"Professional service and beautiful designs. I've ordered multiple dresses and each one is perfect. Highly recommend!"</p>
            <div className={styles.testimonialAuthor}>
              <strong>Emily Chen</strong>
              <span>Fashion Enthusiast</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
            <p>"I got a lot of compliments on my clothes, your hands are really blessed. Thank you for styling me, I couldn't have wished for another brand to trust my dress with, cheers to more"</p>
            <div className={styles.testimonialAuthor}>
              <strong>Oluwanifemi Adewakun</strong>
              <span>Satisfied Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className={styles.contact}>
        <h2>Let's Create Together</h2>
        <div className={styles.contactContent}>
          <div className={styles.contactForm}>
            <form onSubmit={handleContactSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={handleContactChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={handleContactChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={contactForm.message}
                onChange={handleContactChange}
                required
              ></textarea>
              <button type="submit" disabled={contactLoading}>
                {contactLoading ? 'Sending...' : 'Send Message'}
              </button>
              {contactMessage && (
                <p className={contactMessage.includes('success') ? styles.successMessage : styles.errorMessage}>
                  {contactMessage}
                </p>
              )}
            </form>
          </div>
          <div className={styles.socialLinks}>
            <h3>Follow Us</h3>
            <div className={styles.socials}>
              <a href={socialLinks.whatsapp?.url || "https://wa.me/1234567890"} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={socialLinks.twitter?.url || "https://twitter.com/mideatelier"} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <a href={socialLinks.instagram?.url || "https://instagram.com/mideatelier"} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>MideAtelier</h3>
            <p>Crafting elegance, one dress at a time. Where luxury meets personal style.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#custom">Custom</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact Info</h4>
            <p>Email: info@mideatelier.com</p>
            <p>Phone: +2349164638685</p>
            <p>Address: No 1 Fashion Ave, Abeokuta Ogun state</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 MideAtelier Fashion. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
