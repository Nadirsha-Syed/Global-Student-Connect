import React from 'react';

export function Card({
  children,
  hoverable = false,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  return (
    <div
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      className={className}
    >
      <div>
        {title && <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{title}</h3>}
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default Card;
