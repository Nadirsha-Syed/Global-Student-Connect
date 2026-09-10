import { UserCheck, Send } from 'lucide-react';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Badge, { MatchScoreBadge } from '../common/Badge';
import Button from '../common/Button';

export function MatchCard({
  match,
  onViewProfile,
  onConnect,
  isConnecting = false,
  hasConnected = false,
  compact = false,
}) {
  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: compact ? '1.25rem' : '1.5rem',
        height: '100%',
      }}
    >
      <div>
        {/* Top Header: Avatar + Score */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <Avatar
            src={match.avatar}
            alt={match.name}
            size={compact ? 'md' : 'lg'}
            flag={match.flag}
            isOnline={true}
          />
          <MatchScoreBadge score={match.matchScore} />
        </div>

        {/* Student Name & Country */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h4
            style={{
              fontSize: compact ? '1.05rem' : '1.2rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0 0 0.2rem',
            }}
          >
            {match.name}
          </h4>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              margin: 0,
            }}
          >
            <span>{match.country}</span>
            <span>•</span>
            <span>{match.age} yrs</span>
            {match.educationLevel && (
              <>
                <span>•</span>
                <span>{match.educationLevel}</span>
              </>
            )}
          </p>
          {match.institution && (
            <p
              style={{
                fontSize: '0.775rem',
                color: 'var(--text-light)',
                marginTop: '0.2rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              🎓 {match.institution}
            </p>
          )}
        </div>

        {/* Bio Snippet */}
        {match.bio && (
          <p
            style={{
              fontSize: '0.825rem',
              color: 'var(--text-body)',
              lineHeight: 1.45,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: compact ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            "{match.bio}"
          </p>
        )}

        {/* Interest Tags */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {match.interests?.slice(0, compact ? 2 : 4).map((interest) => (
              <Badge key={interest} variant="tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                {interest}
              </Badge>
            ))}
            {match.interests?.length > (compact ? 2 : 4) && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', alignSelf: 'center' }}>
                +{match.interests.length - (compact ? 2 : 4)} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
          gap: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
        }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile?.(match)}
          style={{ width: '100%' }}
        >
          View Profile
        </Button>

        {!compact && (
          <Button
            variant={hasConnected ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onConnect?.(match)}
            loading={isConnecting}
            disabled={hasConnected}
            icon={hasConnected ? UserCheck : Send}
            style={{ width: '100%' }}
          >
            {hasConnected ? 'Connected' : 'Connect'}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default MatchCard;
