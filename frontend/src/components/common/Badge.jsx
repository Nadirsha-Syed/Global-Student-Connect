import React from 'react';

export function Badge({
  children,
  variant = 'tag',
  className = '',
  icon: Icon,
  ...props
}) {
  const variantClass = {
    tag: 'badge-tag',
    match: 'badge-match',
    primary: 'badge-primary',
  }[variant] || 'badge-tag';

  return (
    <span className={`badge ${variantClass} ${className}`} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export function MatchScoreBadge({ score }) {
  return (
    <span className="badge badge-match">
      <span style={{ fontSize: '0.85rem' }}>⚡</span>
      {score}% Match
    </span>
  );
}

export default Badge;
