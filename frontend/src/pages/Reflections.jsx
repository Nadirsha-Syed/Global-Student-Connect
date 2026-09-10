import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Globe2,
  Plus,
  Calendar,
  CheckCircle2,
  Heart,
  Quote,
  Lightbulb,
  Tag,
  Search,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const INITIAL_REFLECTIONS = [
  {
    id: 'ref-1',
    title: 'Robotics, Tea Culture, & Campus Clubs in Tokyo',
    partner: 'Yuki Sato',
    country: 'Japan',
    flag: '🇯🇵',
    avatar: '👩‍🎨',
    date: 'Sep 8, 2026',
    duration: '45 mins',
    tags: ['Robotics', 'TokyoLife', 'TeaCeremony', 'Tech'],
    culturalSurprise:
      'I was fascinated to learn that Tokyo University students dedicate intense hours to formal campus clubs ("bukatsu"), where juniors and seniors maintain deep lifelong mentorship relationships.',
    keyTakeaway:
      'Global tech challenges look identical across borders, but cultural values deeply shape how student teams communicate and innovate together.',
    rating: 5,
  },
  {
    id: 'ref-2',
    title: 'Amazon Conservation & Open-Source Drone Projects',
    partner: 'Carlos Silva',
    country: 'Brazil',
    flag: '🇧🇷',
    avatar: '🧑‍🌾',
    date: 'Sep 7, 2026',
    duration: '45 mins',
    tags: ['Environment', 'Brazil', 'Coffee', 'OpenSource'],
    culturalSurprise:
      'Carlos shared how university engineering students in São Paulo build open-source drone firmware that local communities use to detect illegal deforestation in real-time.',
    keyTakeaway:
      'Environmental engineering is not just theory for Brazilian youth—it is direct grassroots action combining technology with community stewardship.',
    rating: 5,
  },
  {
    id: 'ref-3',
    title: 'Architecture & Plaza Culture in Madrid',
    partner: 'Sofia Martinez',
    country: 'Spain',
    flag: '🇪🇸',
    avatar: '👩‍🎓',
    date: 'Sep 2, 2026',
    duration: '40 mins',
    tags: ['Architecture', 'Spain', 'ArtHistory', 'PlazaLife'],
    culturalSurprise:
      'Sofia explained the social ritual of the Spanish "sobremesa"—spending an hour conversing at the table after a shared meal rather than rushing back to work.',
    keyTakeaway:
      'Urban architecture in Spain is designed around human conversation and outdoor squares, emphasizing relationships over pure speed.',
    rating: 5,
  },
  {
    id: 'ref-4',
    title: 'Sub-Zero Campus Life & Indigenous Storytelling',
    partner: 'Emma Wilson',
    country: 'Canada',
    flag: '🇨🇦',
    avatar: '👩‍🔬',
    date: 'Aug 28, 2026',
    duration: '50 mins',
    tags: ['Canada', 'WinterSports', 'Literature', 'Storytelling'],
    culturalSurprise:
      'University campuses in Montreal have underground heated tunnel networks connecting libraries and dorms during harsh minus 20-degree winter days!',
    keyTakeaway:
      'Adaptability to extreme weather creates unique social warmth and indoor creative traditions.',
    rating: 5,
  },
  {
    id: 'ref-5',
    title: 'Gaelic Hurling, Folklore, and Dublin Startups',
    partner: 'Liam O’Connor',
    country: 'Ireland',
    flag: '🇮🇪',
    avatar: '🧑‍🚀',
    date: 'Aug 22, 2026',
    duration: '45 mins',
    tags: ['Ireland', 'Folklore', 'Hurling', 'Startups'],
    culturalSurprise:
      'Hurling is one of the oldest and fastest field sports in the world, deeply rooted in Irish Celtic mythology and played strictly without professional wages for community pride.',
    keyTakeaway:
      'Amateur community sports can generate as much national passion and identity as multi-million dollar global leagues.',
    rating: 5,
  },
  {
    id: 'ref-6',
    title: 'Robotics Competitions & Akihabara Subcultures',
    partner: 'Hiroshi Tanaka',
    country: 'Japan',
    flag: '🇯🇵',
    avatar: '👨‍💻',
    date: 'Aug 15, 2026',
    duration: '35 mins',
    tags: ['Japan', 'Robotics', 'Anime', 'Manga'],
    culturalSurprise:
      'Engineering students frequently visit Akihabara to buy surplus electronic components directly from specialist vintage component stalls.',
    keyTakeaway:
      'Hobby culture and academic engineering work hand-in-hand to inspire Japanese tech innovation.',
    rating: 4,
  },
];

export function Reflections() {
  const [reflections, setReflections] = useState(INITIAL_REFLECTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New reflection draft
  const [newTitle, setNewTitle] = useState('');
  const [newPartner, setNewPartner] = useState('Yuki Sato');
  const [newCountry, setNewCountry] = useState('Japan');
  const [newSurprise, setNewSurprise] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [newTag, setNewTag] = useState('');

  const filteredReflections = reflections.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.partner.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleCreateReflection = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTakeaway.trim()) {
      alert('Please provide a title and your key takeaway.');
      return;
    }

    const created = {
      id: `ref-${Date.now()}`,
      title: newTitle,
      partner: newPartner,
      country: newCountry,
      flag: newCountry === 'Japan' ? '🇯🇵' : newCountry === 'Brazil' ? '🇧🇷' : '🌐',
      avatar: newCountry === 'Japan' ? '👩‍🎨' : newCountry === 'Brazil' ? '🧑‍🌾' : '🧑‍🎓',
      date: 'Today, Sep 10, 2026',
      duration: '40 mins',
      tags: newTag ? newTag.split(',').map((s) => s.trim().replace(/^#/, '')) : ['CulturalExchange'],
      culturalSurprise: newSurprise || 'Discovered new perspectives on student daily life.',
      keyTakeaway: newTakeaway,
      rating: 5,
    };

    setReflections([created, ...reflections]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewSurprise('');
    setNewTakeaway('');
    setNewTag('');

    setToastMessage('Cultural reflection logged successfully to your portfolio!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '2rem 1.5rem', minWidth: 0 }}>
          {/* Header Banner */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <BookOpen size={24} color="var(--primary)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Cultural Reflections
                </h1>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Your personal journal of cross-cultural discoveries, memorable stories, and mutual learnings.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              style={{ borderRadius: 'var(--radius-full)', fontWeight: 600 }}
            >
              <Plus size={16} style={{ marginRight: 6 }} />
              Write Reflection
            </Button>
          </div>

          {/* Toast alert */}
          {toastMessage && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#ECFDF5',
                border: '1px solid #10B981',
                borderRadius: 'var(--radius-lg)',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              <CheckCircle2 size={18} color="#10B981" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Overview Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            <Card style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Reflections Logged
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {reflections.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600, marginTop: '0.25rem' }}>
                +2 this week
              </div>
            </Card>

            <Card style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Countries Explored
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
                8
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Across 4 Continents
              </div>
            </Card>

            <Card style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Exchange Hours
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.25rem' }}>
                18.5
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Meaningful Dialogue
              </div>
            </Card>

            <Card style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Cultural Empathy
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366F1', marginTop: '0.25rem' }}>
                98%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Mutual Understanding
              </div>
            </Card>
          </div>

          {/* Search bar */}
          <div style={{ marginBottom: '1.75rem', position: 'relative', maxWidth: 450 }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search reflections by topic, country, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Reflections Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredReflections.map((ref) => (
              <Card
                key={ref.id}
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-xl)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  {/* Top Partner and Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar src={ref.avatar} name={ref.partner} flag={ref.flag} size="md" />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{ref.partner}</span>
                          <span>{ref.flag}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ref.country} • {ref.date}
                        </div>
                      </div>
                    </div>
                    <Badge variant="neutral" style={{ fontSize: '0.7rem' }}>
                      {ref.duration}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.875rem', lineHeight: 1.35 }}>
                    {ref.title}
                  </h3>

                  {/* Cultural Surprise Block */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-main)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '0.875rem',
                      borderLeft: '3px solid #F59E0B',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#B45309', marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <Lightbulb size={13} />
                      <span>Cultural Discovery</span>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-muted)' }}>
                      {ref.culturalSurprise}
                    </p>
                  </div>

                  {/* Key Takeaway */}
                  <div
                    style={{
                      backgroundColor: 'var(--primary-subtle)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.25rem',
                      borderLeft: '3px solid var(--primary)',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <Quote size={13} />
                      <span>Key Takeaway</span>
                    </div>
                    <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-main)', fontWeight: 500 }}>
                      "{ref.keyTakeaway}"
                    </p>
                  </div>
                </div>

                {/* Bottom Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
                  {ref.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-muted)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Modal: Write New Reflection */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log a Cultural Reflection" size="md">
        <form onSubmit={handleCreateReflection} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              Reflection Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Japanese Campus Culture & Robotics"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                Partner Name
              </label>
              <input
                type="text"
                value={newPartner}
                onChange={(e) => setNewPartner(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                Country
              </label>
              <input
                type="text"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              What surprised you culturally?
            </label>
            <textarea
              rows={2}
              placeholder="e.g. How study hours and club activities differ between campuses..."
              value={newSurprise}
              onChange={(e) => setNewSurprise(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              Your Key Takeaway / Life Insight *
            </label>
            <textarea
              rows={3}
              placeholder="What did this conversation teach you about global empathy or worldview?"
              value={newTakeaway}
              onChange={(e) => setNewTakeaway(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Technology, CampusLife, Japan"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Reflection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Reflections;
