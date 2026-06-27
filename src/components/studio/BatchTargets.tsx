import React from 'react';
import { ResolutionEntry, SideState } from '../../types/studio';
import {
  ControlGroup,
  GroupLabel,
  GroupHint,
  SizeList,
  SizeRow,
  CheckRow,
  TwoCol,
  Divider,
} from './StudioStyles';

interface Props {
  resolutionDirectory: ResolutionEntry[];
  checkedSizes: Record<string, boolean>;
  previewSizeId: string;
  customW: number;
  customH: number;
  sides: SideState;
  onToggleSize: (id: string, checked: boolean) => void;
  onSetPreviewSize: (id: string) => void;
  onSetCustomW: (v: number) => void;
  onSetCustomH: (v: number) => void;
  onSetSides: (s: SideState) => void;
}

export const BatchTargets: React.FC<Props> = ({
  resolutionDirectory,
  checkedSizes,
  previewSizeId,
  customW,
  customH,
  sides,
  onToggleSize,
  onSetPreviewSize,
  onSetCustomW,
  onSetCustomH,
  onSetSides,
}: Props) => (
  <ControlGroup>
    <GroupLabel>Export Sizes & Preview Frame</GroupLabel>
    <GroupHint>
      ☑ to include in export. ○ to use as the live preview resolution.
    </GroupHint>

    <SizeList>
      {resolutionDirectory.map((res) => (
        <SizeRow key={res.id}>
          <input
            type="checkbox"
            checked={!!checkedSizes[res.id]}
            onChange={(e) => onToggleSize(res.id, e.target.checked)}
            title="Include in export"
          />
          <input
            type="radio"
            name="previewSizeSelector"
            checked={previewSizeId === res.id}
            onChange={() => onSetPreviewSize(res.id)}
            title="Show in preview"
          />
          <span style={{ fontSize: '0.88rem' }}>
            <strong>{res.name}</strong>{' '}
            <span style={{ opacity: 0.55 }}>({res.w}×{res.h}px)</span>
          </span>
        </SizeRow>
      ))}
    </SizeList>

    <TwoCol style={{ marginTop: 4 }}>
      <div>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: 3 }}>Custom Width (px)</label>
        <input
          type="number"
          value={customW}
          onChange={(e) => onSetCustomW(Math.max(100, Number(e.target.value)))}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: 3 }}>Custom Height (px)</label>
        <input
          type="number"
          value={customH}
          onChange={(e) => onSetCustomH(Math.max(100, Number(e.target.value)))}
          style={{ width: '100%' }}
        />
      </div>
    </TwoCol>

    <Divider />

    <div style={{ display: 'flex', gap: 20 }}>
      <CheckRow>
        <input
          type="checkbox"
          checked={sides.front}
          onChange={(e) => onSetSides({ ...sides, front: e.target.checked })}
        />
        Export Front
      </CheckRow>
      <CheckRow>
        <input
          type="checkbox"
          checked={sides.back}
          onChange={(e) => onSetSides({ ...sides, back: e.target.checked })}
        />
        Export Back
      </CheckRow>
    </div>
  </ControlGroup>
);
