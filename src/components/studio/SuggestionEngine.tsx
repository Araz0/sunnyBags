import React from 'react';
import { ExtendedBag } from '../../data';
import { getSuggestionStats } from '../../utils/suggest';
import {
  ControlGroup,
  GroupLabel,
  GroupHint,
  OkButton,
  GhostButton,
  SuggestionCard,
  SuggestionStats,
} from './StudioStyles';

interface Props {
  suggestedBag: ExtendedBag | null;
  suggestionStats: ReturnType<typeof getSuggestionStats> | null;
  showSuggestion: boolean;
  getBagThumbnail: (bag: ExtendedBag) => string;
  onSuggest: () => void;
  onReset: () => void;
  onViewSuggestion: (id: number) => void;
}

export const SuggestionEngine: React.FC<Props> = ({
  suggestedBag,
  suggestionStats,
  showSuggestion,
  getBagThumbnail,
  onSuggest,
  onReset,
  onViewSuggestion,
}: Props) => (
  <ControlGroup>
    <GroupLabel>🎯 Suggestion Engine</GroupLabel>
    <GroupHint>Recommends bags based on variety, price, and availability.</GroupHint>

    <div style={{ display: 'flex', gap: 10 }}>
      <OkButton onClick={onSuggest} style={{ flex: 2 }}>✨ Suggest a Bag</OkButton>
      <GhostButton onClick={onReset} style={{ flex: 1 }}>Reset History</GhostButton>
    </div>

    {suggestionStats && (
      <SuggestionStats>
        <span>📊 Total: {suggestionStats.totalSuggestions}</span>
        <span>🏷️ Categories: {suggestionStats.uniqueCategoriesSuggested}</span>
        <span>💰 Avg: ${suggestionStats.averagePrice.toFixed(2)}</span>
      </SuggestionStats>
    )}

    {showSuggestion && suggestedBag && (
      <SuggestionCard>
        <h3>🎁 Suggested — Bag #{suggestedBag.id}</h3>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
          <img
            src={getBagThumbnail(suggestedBag)}
            alt={`Bag ${suggestedBag.id}`}
            style={{ maxHeight: 140, borderRadius: 4, border: '1px solid var(--border)', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <p><strong>Category:</strong> {suggestedBag.category}</p>
        <p>
          <strong>Price:</strong>{' '}
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${suggestedBag.finalPrice?.toFixed(2)}</span>
        </p>
        {suggestedBag.discount > 0 && (
          <p><strong>Discount:</strong> {suggestedBag.discount}% off</p>
        )}
        <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>
          {suggestedBag.description?.substring(0, 100)}…
        </p>
        <button
          onClick={() => onViewSuggestion(suggestedBag.id)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--accent)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginTop: 8,
          }}
        >
          Open this bag →
        </button>
      </SuggestionCard>
    )}
  </ControlGroup>
);
