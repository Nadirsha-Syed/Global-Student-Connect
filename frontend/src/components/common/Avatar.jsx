import React from 'react';

export function Avatar({
  src,
  alt = 'Student avatar',
  size = 'md',
  flag,
  isOnline = false,
  className = '',
}) {
  const dimension = {
    sm: 36,
    md: 48,
    lg: 72,
    xl: 96,
  }[size] || 48;

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #ffffff',
            boxShadow: 'var(--shadow-sm)',
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: dimension * 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff',
          }}
        >
          {getInitials(alt)}
        </div>
      )}

      {/* Online indicator dot */}
      {isOnline && (
        <span
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: dimension * 0.22,
            height: dimension * 0.22,
            backgroundColor: 'var(--emerald)',
            borderRadius: '50%',
            border: '2px solid #ffffff',
          }}
        />
      )}

      {/* Optional Country Flag Pill */}
      {flag && (
        <span
          style={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            fontSize: dimension * 0.35,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
          }}
        >
          {flag}
        </span>
      )}
    </div>
  );
}

export default Avatar;
