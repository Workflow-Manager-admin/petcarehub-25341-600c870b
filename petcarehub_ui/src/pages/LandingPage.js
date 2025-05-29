import React, { useEffect, useRef } from "react";
import styles from "./LandingPage.module.css";

// PUBLIC_INTERFACE
/**
 * PetCareHub Landing Page - Modern, friendly, soft, and engaging pet care landing.
 * Sections: Hero, About Us, Features, Trust, Footer
 */
function LandingPage() {
  // IntersectionObserver for fade-in animation (optional, but for improved landing feel)
  const sectionsRef = useRef([]);

  useEffect(() => {
    const io = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            entry.target.classList.add(styles.visibleSection);
        });
      },
      { threshold: 0.2 }
    );
    sectionsRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Placeholder illustration/image URLs
  const petHero =
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=900&q=80";
  const aboutIllustration =
    "/assets/illustrations/pet-wellness.svg";
  // Use local illustrative PNGs for reliability
  const featureImgs = [
    "/assets/illustrations/routines.png",   // Routine Tracker
    "/assets/illustrations/medical.png",    // Medical Vault
    "/assets/illustrations/reminders.png",  // Reminders
  ];
  const pawIcon = "🐾";
  const heartIcon = "🧡";
  const routineIcon = "⏰";
  const docIcon = "📋";
  const notifIcon = "🔔";

  // --- Sections ---
  return (
    <div className={styles.lpRoot} style={{ fontFamily: 'Poppins, Nunito, Inter, Arial, sans-serif' }}>
      {/* HERO SECTION */}
      <section
        ref={el => sectionsRef.current[0] = el}
        className={`${styles.hero} ${styles.fadeinSection}`}
        id="hero"
      >
        <div className={styles.heroGlassOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.logoPart}>PetCareHub</span>!
          </h1>
          <p className={styles.heroSubtitle}>
            Making pet parenting easy, joyful, and organized.<br />
            <span style={{ opacity: 0.75 }}>Your all-in-one hub for pet routines, health, reminders, and more.</span>
          </p>
          <div className={styles.heroActions}>
            <a href="/auth/signup" className={styles.ctaBtn}>Get Started Free</a>
            <a href="/about" className={styles.ctaBtnGlass}>About Us</a>
          </div>
        </div>
        <img
          src={petHero}
          alt="Happy dog with owner"
          className={styles.heroImg}
          loading="lazy"
        />
        <div className={styles.heroPaw}>{pawIcon}</div>
      </section>

      {/* ABOUT US */}
      <section
        ref={el => sectionsRef.current[1] = el}
        className={`${styles.about} ${styles.fadeinSection}`}
        id="about"
      >
        <div className={styles.aboutGrid}>
          <div>
            <h2 className={styles.sectionTitle}><span role="img" aria-label="info">💡</span> About Us</h2>
            <p className={styles.sectionSubtitle}>
              PetCareHub was built by pet lovers to help you cherish every moment and never miss a beat.
            </p>
            <ul className={styles.aboutBullets}>
              <li><span role="img" aria-label="paw">🐶</span> Multi-pet profiles for every furry friend</li>
              <li><span role="img" aria-label="calendar">📅</span> Effortless routine & appointment tracking</li>
              <li><span role="img" aria-label="heart">❤️</span> Medical & nutrition records at your fingertips</li>
              <li><span role="img" aria-label="notif">🔔</span> Smart, timely reminders you can trust</li>
            </ul>
          </div>
          <img
            src={aboutIllustration}
            alt="Pet wellness illustration"
            className={styles.aboutImg}
            loading="lazy"
          />
        </div>
      </section>

      {/* FEATURES PREVIEW: interactive cards */}
      <section
        ref={el => sectionsRef.current[2] = el}
        className={`${styles.features} ${styles.fadeinSection}`}
        id="features"
      >
        <h2 className={styles.sectionTitle} style={{ marginBottom: 10 }}>
          <span role="img" aria-label="star">🌟</span> Hub Features
        </h2>
        <div className={styles.cardGrid}>
          {/* CARD 1: Routine Scheduler */}
          <div tabIndex={0} className={styles.featureCard}>
            <div className={styles.cardIcon}>{routineIcon}</div>
            <h3 className={styles.cardTitle}>Routine Tracker</h3>
            <p className={styles.cardDesc}>
              Easily schedule and track walks, feeds, play, meds and more.
            </p>
            <img src={featureImgs[0]} alt="Routine" className={styles.cardImg} loading="lazy" />
          </div>
          {/* CARD 2: Medical Records */}
          <div tabIndex={0} className={styles.featureCard}>
            <div className={styles.cardIcon}>{docIcon}</div>
            <h3 className={styles.cardTitle}>Medical Vault</h3>
            <p className={styles.cardDesc}>
              Centralize vet visits, vaccinations, prescriptions, and health notes.
            </p>
            <img src={featureImgs[1]} alt="Medical" className={styles.cardImg} loading="lazy"/>
          </div>
          {/* CARD 3: Reminders & Notifications */}
          <div tabIndex={0} className={styles.featureCard}>
            <div className={styles.cardIcon}>{notifIcon}</div>
            <h3 className={styles.cardTitle}>Smart Reminders</h3>
            <p className={styles.cardDesc}>
              Get notified before every appointment, vaccine, or grooming.
            </p>
            <img src={featureImgs[2]} alt="Reminders" className={styles.cardImg} loading="lazy"/>
          </div>
        </div>
      </section>

      {/* TRUST / WHY-CHOOSE-US */}
      <section
        ref={el => sectionsRef.current[3] = el}
        className={`${styles.trust} ${styles.fadeinSection}`}
        id="trust"
      >
        <h2 className={styles.sectionTitle}>
          <span role="img" aria-label="medal">🏅</span> Why Choose PetCareHub?
        </h2>
        <div className={styles.trustStats}>
          <div className={styles.statBlock}>
            <span className={styles.statEmoji}>🐾</span>
            <div className={styles.statNum}>5,200+</div>
            <div className={styles.statLabel}>Pets Managed</div>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statEmoji}>👪</span>
            <div className={styles.statNum}>4.9/5</div>
            <div className={styles.statLabel}>Avg. User Rating</div>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statEmoji}>❤️</span>
            <div className={styles.statNum}>99%</div>
            <div className={styles.statLabel}>Happy Families</div>
          </div>
          <div className={styles.statBlock}>
            <span className={styles.statEmoji}>🛡️</span>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statLabel}>Data Secure</div>
          </div>
        </div>
        <div className={styles.badgeRibbon}>
          <span>Trusted by pet parents everywhere!</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <span className={styles.logoPartFooter}>🐾 PetCareHub</span>
            <span className={styles.footerTagline}>Pet parenting, made joyful.</span>
          </div>
          <nav className={styles.footerNav}>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/auth/login">Login</a>
          </nav>
          <div className={styles.footerSocials}>
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook"></i></a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter"></i></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram"></i></a>
            <a href="mailto:support@petcarehub.com" aria-label="Email"><i className="fa fa-envelope"></i></a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          &copy; {new Date().getFullYear()} PetCareHub. For pet lovers, by pet lovers 💛
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
