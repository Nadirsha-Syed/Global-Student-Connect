import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Users,
  MessageCircle,
  Video,
  Sparkles,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Award,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';

export function Landing() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Identity',
      desc: 'Tell us about your university, cultural background, spoken languages, and what you love learning about.',
      icon: Users,
      badge: 'Quick Setup',
    },
    {
      num: '02',
      title: 'Smart Cultural Matching',
      desc: 'Our AI pairs you with enthusiastic students across 100+ countries with complementary interests and language goals.',
      icon: Compass,
      badge: 'AI Powered',
    },
    {
      num: '03',
      title: 'Pick Inspiring Topics',
      desc: 'Choose from 50+ guided icebreaker conversation prompts from university life and food traditions to technology and music.',
      icon: MessageCircle,
      badge: 'Icebreakers',
    },
    {
      num: '04',
      title: 'Video Call & Reflections',
      desc: 'Hop on a safe 1-on-1 video call, exchange cultural stories, and log key insights in your student reflection journal.',
      icon: Video,
      badge: 'Lifelong Friends',
    },
  ];

  const studentSpotlights = [
    {
      name: 'Yuki Sato',
      country: 'Japan',
      flag: '🇯🇵',
      uni: 'Tokyo University',
      avatar: '👩‍🎨',
      interests: ['Anime & Manga', 'Robotics', 'Tea Culture'],
      quote: 'Talking with students in India and Canada helped me gain confidence in conversational English while sharing Tokyo campus culture!',
    },
    {
      name: 'Carlos Silva',
      country: 'Brazil',
      flag: '🇧🇷',
      uni: 'University of São Paulo',
      avatar: '🧑‍🌾',
      interests: ['Environmental Tech', 'Samba', 'Football'],
      quote: 'I made genuine friendships with engineering students across the ocean. We even collaborate on global climate hackathons now.',
    },
    {
      name: 'Sofia Martinez',
      country: 'Spain',
      flag: '🇪🇸',
      uni: 'Autonomous Univ. of Madrid',
      avatar: '👩‍🎓',
      interests: ['Architecture', 'Flamenco', 'Culinary Arts'],
      quote: 'The guided topic cards made our first conversation so natural and warm. It feels like travelling without leaving your dorm room.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary) 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Globe2 size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-dark)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Global Student Connect
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Different Cultures. Same Curiosity.
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
              fontWeight: 600,
              fontSize: '0.925rem',
              color: 'var(--text-muted)',
            }}
            className="landing-nav-desktop"
          >
            <a href="#how-it-works" style={{ color: 'var(--text-main)', textDecoration: 'none', transition: 'color 0.15s' }}>
              How It Works
            </a>
            <a href="#spotlights" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Student Stories
            </a>
            <a href="#safety" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Safety & Standards
            </a>
            <Link to="/matching" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}>
              Find Matches
            </Link>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" style={{ fontWeight: 600 }}>
                Log In
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm" style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem', fontWeight: 600 }}>
                Get Started
                <ArrowRight size={15} style={{ marginLeft: 4 }} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section (Section 1.1 of reference design) */}
      <section
        style={{
          padding: '4rem 1.5rem 5rem',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column Text & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(37, 99, 235, 0.15)',
              }}
            >
              <Sparkles size={16} />
              <span>The Premier Global Cross-Cultural Student Network</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
                marginBottom: '1.5rem',
              }}
            >
              Students. Cultures.{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Conversations
              </span>{' '}
              Without Borders.
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                lineHeight: 1.65,
                color: 'var(--text-muted)',
                marginBottom: '2.25rem',
                maxWidth: 540,
              }}
            >
              Meet amazing university students from around the world, share authentic personal stories, practice languages, and broaden your worldview through safe 1-on-1 cultural video exchanges.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.85rem 2rem',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  Get Started!
                  <ArrowRight size={18} style={{ marginLeft: 6 }} />
                </Button>
              </Link>
              <a href="#how-it-works" style={{ textDecoration: 'none' }}>
                <Button
                  variant="secondary"
                  size="lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.85rem 1.75rem',
                    fontSize: '1.05rem',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  Learn More
                </Button>
              </a>
            </div>

            {/* Quick Stats Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '1.25rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>10K+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Students Active</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981' }}>100+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Countries</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F59E0B' }}>50+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Culture Topics</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6366F1' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Safe & Verified</div>
              </div>
            </div>
          </div>

          {/* Right Column Hero Graphic / Visual Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.25)',
                border: '3px solid #FFFFFF',
                background: 'linear-gradient(145deg, #EFF6FF 0%, #E0E7FF 100%)',
                padding: '2rem 1.5rem',
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header inside the stage */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Globe2 size={14} />
                  <span>Tokyo ⇄ New Delhi Cultural Exchange</span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
                </div>

                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  ⚡ 92% Match Score
                </div>
              </div>

              {/* Character 1 (Ruthvik) and Speech Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <Avatar emoji="🧑‍💻" name="Ruthvik Reddy" flag="🇮🇳" size="lg" isOnline={true} />
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '0.85rem 1rem',
                    borderRadius: '0 16px 16px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    maxWidth: 320,
                    fontSize: '0.875rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem', fontSize: '0.8rem' }}>
                    Ruthvik Reddy <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>• India 🇮🇳</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-body)', lineHeight: 1.4 }}>
                    "Namaste! Excited for our chat about campus tech clubs and sharing North vs South Indian food!"
                  </p>
                </div>
              </div>

              {/* Character 2 (Yuki) and Speech Bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', alignSelf: 'flex-end', flexDirection: 'row-reverse', marginBottom: '1.5rem' }}>
                <Avatar emoji="👩‍🎨" name="Yuki Sato" flag="🇯🇵" size="lg" isOnline={true} />
                <div
                  style={{
                    backgroundColor: '#EFF6FF',
                    padding: '0.85rem 1rem',
                    borderRadius: '16px 0 16px 16px',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                    maxWidth: 320,
                    fontSize: '0.875rem',
                    border: '1px solid rgba(37,99,235,0.2)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem', fontSize: '0.8rem', textAlign: 'right' }}>
                    Yuki Sato <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>• Japan 🇯🇵</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    "Kon'nichiwa! Can't wait to share autumn festival traditions in Tokyo and talk about robotics clubs!"
                  </p>
                </div>
              </div>

              {/* Active Global Student Community Bar */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Avatar emoji="🧑‍🌾" size="sm" flag="🇧🇷" />
                  <Avatar emoji="👩‍🔬" size="sm" flag="🇨🇦" />
                  <Avatar emoji="👩‍🎓" size="sm" flag="🇪🇸" />
                  <Avatar emoji="🧑‍🚀" size="sm" flag="🇮🇪" />
                  <Avatar emoji="👨‍💻" size="sm" flag="🇯🇵" />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <ShieldCheck size={14} color="#10B981" />
                    <span>Verified Students</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>10,000+ Cross-Cultural Friends</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '5rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 4rem' }}>
            <Badge variant="primary" style={{ marginBottom: '0.75rem' }}>
              Simple 4-Step Journey
            </Badge>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              How Global Student Connect Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We make it effortless to meet culturally curious peers, schedule friendly video exchanges, and expand your international perspective.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <Card
                  key={st.num}
                  style={{
                    padding: '2rem 1.5rem',
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  className="interactive-step-card"
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 'var(--radius-xl)',
                        backgroundColor: 'var(--primary-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={26} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(37, 99, 235, 0.18)' }}>
                      {st.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    {st.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {st.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student Stories / Spotlights */}
      <section
        id="spotlights"
        style={{
          padding: '5rem 1.5rem',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3.5rem' }}>
          <Badge variant="warning" style={{ marginBottom: '0.75rem' }}>
            Real Student Voices
          </Badge>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Connections That Inspire
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Hear how students are turning 30-minute video calls into lasting global friendships and cultural discoveries.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {studentSpotlights.map((student, idx) => (
            <Card key={idx} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <Avatar emoji={student.avatar} name={student.name} flag={student.flag} size="lg" />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{student.name}</span>
                      <span>{student.flag}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {student.uni}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  "{student.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                {student.interests.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-muted)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section
        id="safety"
        style={{
          backgroundColor: '#F0FDF4',
          borderTop: '1px solid #DCFCE7',
          borderBottom: '1px solid #DCFCE7',
          padding: '4rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, marginBottom: '0.5rem' }}>
              <ShieldCheck size={22} />
              <span>Safe, Respectful, Educational Community</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532D', marginBottom: '0.75rem' }}>
              A Protected Environment Built Just For Students
            </h3>
            <p style={{ color: '#166534', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Every student is authenticated through university verification. All video interactions adhere to our strict Community Code of Honor to promote empathy, kindness, and cultural appreciation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                style={{
                  backgroundColor: '#16A34A',
                  borderColor: '#16A34A',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.75rem 1.75rem',
                  fontWeight: 600,
                }}
              >
                Join Our Safe Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-color)', padding: '3.5rem 1.5rem 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe2 size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>Global Student Connect</span>
            </div>

            <div style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              "Students today, a kinder tomorrow."
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
              <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/matching" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Find Matches
              </Link>
              <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Student Dashboard
              </Link>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            <div>© 2026 Global Student Connect. Built with empathy for global education.</div>
            <div>Frontend Developer 1 — Student Platform UI</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
