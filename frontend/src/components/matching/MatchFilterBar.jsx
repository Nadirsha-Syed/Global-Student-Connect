import React, { useState } from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export function MatchFilterBar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedInterest,
  onInterestChange,
  onClearFilters,
  totalResults,
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const countries = ['All Countries', 'Japan', 'Canada', 'Brazil', 'Spain', 'Ireland', 'India'];
  const interests = [
    'All Interests',
    'Technology',
    'Science',
    'Sports',
    'Music',
    'Art',
    'Travel',
    'Anime',
    'Culture',
    'Food & Cooking',
  ];

  const hasActiveFilters =
    (selectedCountry && selectedCountry !== 'All Countries') ||
    (selectedInterest && selectedInterest !== 'All Interests') ||
    searchQuery;

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Top Row: Tabs + Search + Filter Button */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* For You / All Students Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            type="button"
            onClick={() => onTabChange('for-you')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'for-you' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'for-you' ? '#ffffff' : 'var(--text-body)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={15} />
            <span>For You</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.875rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'all' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'all' ? '#ffffff' : 'var(--text-body)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>All Students</span>
          </button>
        </div>

        {/* Right side: Search bar & Filters toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 320px', maxWidth: 480 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
              }}
            />
            <input
              type="text"
              placeholder="Search by student, country, or interest..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: '2.5rem',
                paddingTop: '0.55rem',
                paddingBottom: '0.55rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.875rem',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-light)',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`btn ${showFilterDropdown || hasActiveFilters ? 'btn-primary' : 'btn-outline-neutral'} btn-sm`}
            style={{ padding: '0.55rem 0.95rem' }}
          >
            <Filter size={15} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter Options Tray */}
      {showFilterDropdown && (
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          {/* Country Filter */}
          <div style={{ minWidth: 180 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="input-field"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Interest Filter */}
          <div style={{ minWidth: 180 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Interest Topic
            </label>
            <select
              value={selectedInterest}
              onChange={(e) => onInterestChange(e.target.value)}
              className="input-field"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            >
              {interests.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div style={{ alignSelf: 'flex-end' }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                icon={X}
                style={{ fontSize: '0.825rem' }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results counter indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>
          Showing <strong>{totalResults}</strong> international student{totalResults === 1 ? '' : 's'}
        </span>
        {activeTab === 'for-you' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--emerald)', fontWeight: 600 }}>
            <Sparkles size={14} />
            Sorted by highest shared interests
          </span>
        )}
      </div>
    </div>
  );
}

export default MatchFilterBar;
