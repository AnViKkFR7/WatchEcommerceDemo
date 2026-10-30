import { useState } from 'react';
import { useI18n } from '../lib/i18n/index.jsx';
import PageHero from '../components/PageHero.jsx';
import heroImage from '../assets/hero-1.jpg';
import Reveal from '../components/ui/Reveal.jsx';
import './About.css';

const VALUE_KEYS = ['authenticity', 'curation', 'service'];
const PROCESS_KEYS = ['01', '02', '03', '04'];
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

const HERO_IMAGE = heroImage;
const STORY_IMAGE = 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1200&q=75&auto=format&fit=crop';

function FaqItem({ number, question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-card ${open ? 'is-open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="faq-number">{number}</span>
        <span className="faq-question-text">{question}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="faq-chevron">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <div className="about">
      <PageHero eyebrow={t('about.hero.eyebrow')} title={t('about.hero.title')} subtitle={t('about.hero.subtitle')} image={HERO_IMAGE} />

      <section className="section">
        <div className="container about-story">
          <Reveal className="about-story-text">
            <p className="eyebrow">{t('about.story.eyebrow')}</p>
            <h2>{t('about.story.title')}</h2>
            <p>{t('about.story.p1')}</p>
            <p>{t('about.story.p2')}</p>
            <div className="about-stats">
              <div className="about-stat">
                <strong>{t('about.story.stat1.value')}</strong>
                <span>{t('about.story.stat1.label')}</span>
              </div>
              <div className="about-stat">
                <strong>{t('about.story.stat2.value')}</strong>
                <span>{t('about.story.stat2.label')}</span>
              </div>
              <div className="about-stat">
                <strong>{t('about.story.stat3.value')}</strong>
                <span>{t('about.story.stat3.label')}</span>
              </div>
            </div>
          </Reveal>
          <div className="about-story-media">
            <img src={STORY_IMAGE} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section about-process-section">
        <div className="container">
          <div className="section-heading about-process-heading">
            <div>
              <p className="eyebrow">{t('about.process.eyebrow')}</p>
              <h2>{t('about.process.title')}</h2>
            </div>
            <p className="about-process-subtitle">{t('about.process.subtitle')}</p>
          </div>
          <div className="about-process-grid">
            {PROCESS_KEYS.map((key, i) => (
              <div className="about-process-card" key={key}>
                <span className="about-process-number">{key}</span>
                <h3>{t(`about.process.${key}.title`)}</h3>
                <p>{t(`about.process.${key}.body`)}</p>
                {i < PROCESS_KEYS.length - 1 && <span className="about-process-connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <div className="section-heading">
            <h2>{t('about.values.title')}</h2>
          </div>
          <div className="about-values-grid">
            {VALUE_KEYS.map((key) => (
              <Reveal className="about-value-card" key={key}>
                <h3>{t(`about.values.${key}.title`)}</h3>
                <p>{t(`about.values.${key}.body`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-faq-section" id="faq">
        <div className="container about-faq-container">
          <div className="section-heading">
            <h2>{t('about.faq.title')}</h2>
          </div>
          <div className="faq-grid">
            {FAQ_KEYS.map((key, i) => (
              <FaqItem
                key={key}
                number={String(i + 1).padStart(2, '0')}
                question={t(`about.faq.${key}`)}
                answer={t(`about.faq.a${key.slice(1)}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
