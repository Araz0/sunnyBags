import React from 'react';
import { ImageFormat } from '../../types/studio';
import { ControlGroup, GroupLabel, SliderRow } from './StudioStyles';

interface Props {
  bagScale: number;
  format: ImageFormat;
  isTransparent: boolean;
  onScaleChange: (v: number) => void;
  onFormatChange: (f: ImageFormat) => void;
}

export const CompositionPanel: React.FC<Props> = ({
  bagScale,
  format,
  isTransparent,
  onScaleChange,
  onFormatChange,
}:Props) => (
  <ControlGroup>
    <GroupLabel>Composition & Output</GroupLabel>

    <SliderRow>
      <div className="label-row">
        <span>Bag size</span>
        <strong>{Math.round(bagScale * 100)}% of canvas</strong>
      </div>
      <input
        type="range"
        min="0.20"
        max="2.00"
        step="0.02"
        value={bagScale}
        onChange={(e) => onScaleChange(parseFloat(e.target.value))}
      />
    </SliderRow>

    <div>
      <label style={{ fontSize: '0.88rem', display: 'block', marginBottom: 4, fontWeight: 600 }}>
        File format
      </label>
      <select
        value={format}
        onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
        style={{ width: '100%' }}
      >
        {!isTransparent && <option value="image/jpeg">JPEG</option>}
        <option value="image/png">PNG (lossless)</option>
        <option value="image/webp">WebP</option>
      </select>
    </div>
  </ControlGroup>
);
