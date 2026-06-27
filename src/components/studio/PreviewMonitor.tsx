import React from 'react';
import { PreviewSide, ResolutionEntry } from '../../types/studio';
import {
  PreviewColumn,
  SideToggle,
  SideTab,
  PreviewCanvas,
  BagImage,
  PrimaryButton,
} from './StudioStyles';

interface Props {
  previewSide: PreviewSide;
  livePreview: ResolutionEntry;
  bgColor: string;
  isTransparent: boolean;
  bagScale: number;
  previewImgSrc: string;
  itemId: number;
  onSideChange: (s: PreviewSide) => void;
  onCopyPostText: () => void;
  onGoToItem: () => void;
}

export const PreviewMonitor: React.FC<Props> = ({
  previewSide,
  livePreview,
  bgColor,
  isTransparent,
  bagScale,
  previewImgSrc,
  itemId,
  onSideChange,
  onCopyPostText,
  onGoToItem,
}:Props) => (
  <PreviewColumn>
    <SideToggle>
      <SideTab active={previewSide === 'A'} onClick={() => onSideChange('A')} type="button">
        Front
      </SideTab>
      <SideTab active={previewSide === 'B'} onClick={() => onSideChange('B')} type="button">
        Back
      </SideTab>
    </SideToggle>

    <PreviewCanvas
      w={livePreview.w}
      h={livePreview.h}
      bg={bgColor}
      transparent={isTransparent}
    >
      <BagImage src={previewImgSrc} scale={bagScale} alt="Preview" />
    </PreviewCanvas>

    <p
      style={{
        marginTop: 12,
        fontSize: '0.82rem',
        opacity: 0.55,
        textAlign: 'center',
        lineHeight: 1.5,
      }}
    >
      {livePreview.name} · {livePreview.w}×{livePreview.h}px
    </p>

    <PrimaryButton onClick={onCopyPostText} style={{ marginTop: 12 }}>
      📋 Copy post text
    </PrimaryButton>

    <button
      onClick={onGoToItem}
      style={{
        marginTop: 8,
        width: '100%',
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '10px 0',
        cursor: 'pointer',
        color: 'var(--text)',
        fontSize: '0.9rem',
      }}
    >
      🔗 Bag #{itemId} catalog page
    </button>
  </PreviewColumn>
);
