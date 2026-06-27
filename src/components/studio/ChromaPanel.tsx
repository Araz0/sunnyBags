import React from 'react';
import {
  ControlGroup,
  GroupLabel,
  CheckRow,
  GhostButton,
} from './StudioStyles';

interface Props {
  isTransparent: boolean;
  bgColor: string;
  defaultBgColor: string | undefined;
  onTransparentToggle: (checked: boolean) => void;
  onBgColorChange: (color: string) => void;
  onResetBgColor: () => void;
}

export const ChromaPanel: React.FC<Props> = ({
  isTransparent,
  bgColor,
  defaultBgColor,
  onTransparentToggle,
  onBgColorChange,
  onResetBgColor,
}:Props) => (
  <ControlGroup>
    <GroupLabel>Background</GroupLabel>

    <CheckRow style={{ color: 'var(--accent)' }}>
      <input
        type="checkbox"
        checked={isTransparent}
        onChange={(e) => onTransparentToggle(e.target.checked)}
      />
      Transparent background (PNG/WebP only)
    </CheckRow>

    {!isTransparent && (
      <>
        {/* Color picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
            style={{ width: 48, height: 38, padding: 0, cursor: 'pointer', border: 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: '0.88rem' }}>Canvas fill color</span>
            {defaultBgColor && (
              <GhostButton onClick={onResetBgColor} type="button">
                Reset to bag default
              </GhostButton>
            )}
          </div>
        </div>
        
      </>
    )}
  </ControlGroup>
);
