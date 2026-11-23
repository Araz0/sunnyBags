import React from 'react';
import { PreviewSide, ResolutionEntry } from '../../types/studio';
import {
  PreviewColumn,
  SideToggle,
  SideTab,
  PreviewCanvas,
  BagImage,
} from './StudioStyles';

interface Props {
  previewSide: PreviewSide;
  livePreview: ResolutionEntry;
  bgColor: string;
  isTransparent: boolean;
  bagScale: number;
  previewImgSrc: string;
  onSideChange: (s: PreviewSide) => void;
}

export const PreviewMonitor: React.FC<Props> = ({
  previewSide,
  livePreview,
  bgColor,
  isTransparent,
  bagScale,
  previewImgSrc,
  onSideChange,
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

  </PreviewColumn>
);
