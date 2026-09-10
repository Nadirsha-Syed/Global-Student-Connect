import React from 'react';

// Curated list of friendly student emoji characters
const STUDENT_EMOJI_MAP = {
  yuki: '👩‍🎨',
  emma: '👩‍🔬',
  carlos: '🧑‍🌾',
  sofia: '👩‍🎓',
  liam: '🧑‍🚀',
  hiroshi: '👨‍💻',
  ruthvik: '🧑‍💻',
};

const DEFAULT_EMOJIS = ['🧑‍💻', '👩‍🎓', '👨‍🎨', '👩‍🔬', '🧑‍🌾', '👩‍💻', '👨‍🎓', '🧑‍🚀', '👩‍🎨', '👨‍🔬'];

const GRADIENT_PALETTES = [
  'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', // Sky/Blue
  'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', // Purple/Violet
  'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', // Emerald
  'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', // Amber
  'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)', // Rose
  'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)', // Teal
];

// Helper to determine the emoji character for a student
export function getStudentEmoji(nameOrEmoji) {
  if (!nameOrEmoji) return '🧑‍🎓';

  // If it is already an emoji (not a web URL and short length)
  if (typeof nameOrEmoji === 'string' && !nameOrEmoji.startsWith('http') && !nameOrEmoji.startsWith('/')) {
    // If it's 1-4 characters, it's likely an emoji
    if (nameOrEmoji.length <= 6) return nameOrEmoji;
  }

  // If a name string is passed
  const lower = String(nameOrEmoji).toLowerCase();
  for (const [key, emoji] of Object.entries(STUDENT_EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }

  // Deterministic fallback based on string hash
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % DEFAULT_EMOJIS.length;
  return DEFAULT_EMOJIS[idx];
}

// Helper to get background gradient
function getAvatarGradient(nameOrEmoji) {
  const str = String(nameOrEmoji || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
}

export function Avatar({
  src,
  emoji,
  name,
  alt = 'Student avatar',
  size = 'md',
  flag,
  isOnline = false,
  className = '',
  style = {},
}) {
  const dimension = {
    xs: 28,
    sm: 38,
    md: 50,
    lg: 72,
    xl: 96,
  }[size] || 50;

  // Resolve the display emoji character
  const studentIdentifier = emoji || (src && !src.startsWith('http') ? src : (name || alt));
  const characterEmoji = getStudentEmoji(studentIdentifier);
  const background = getAvatarGradient(name || alt || characterEmoji);

  return (
    <div
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: background,
        border: '2px solid #FFFFFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        userSelect: 'none',
        ...style,
      }}
      className={className}
      title={name || alt}
    >
      {/* Emoji Character */}
      <span
        style={{
          fontSize: dimension * 0.54,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateY(-1px)',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
        }}
        role="img"
        aria-label={alt || 'Student emoji avatar'}
      >
        {characterEmoji}
      </span>

      {/* Online indicator dot */}
      {isOnline && (
        <span
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: Math.max(8, dimension * 0.2),
            height: Math.max(8, dimension * 0.2),
            backgroundColor: '#10B981',
            borderRadius: '50%',
            border: '2px solid #FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      )}

      {/* Optional Country Flag Pill */}
      {flag && (
        <span
          style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            fontSize: Math.max(12, dimension * 0.35),
            lineHeight: 1,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))',
          }}
        >
          {flag}
        </span>
      )}
    </div>
  );
}

export default Avatar;
