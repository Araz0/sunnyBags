import React from 'react';
import { useParams } from 'react-router-dom';

import { useStudio } from '../hooks/useStudio';
import { SuggestionEngine } from '../components/studio/SuggestionEngine';
import { BatchTargets } from '../components/studio/BatchTargets';
import { ChromaPanel } from '../components/studio/ChromaPanel';
import { CompositionPanel } from '../components/studio/CompositionPanel';
import { PreviewMonitor } from '../components/studio/PreviewMonitor';

import {
  StudioWrapper,
  StudioContainer,
  PageHeader,
  ControlsColumn,
  BackButton,
  PrimaryButton,
} from '../components/studio/StudioStyles';

export const ItemStudio: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const s = useStudio(itemId);

  if (!s.currentItem) {
    return (
      <StudioWrapper>
        <StudioContainer>
          <PageHeader>
            <BackButton onClick={() => s.navigate(-1)}>← Back</BackButton>
            <h1>Item not found</h1>
          </PageHeader>
        </StudioContainer>
      </StudioWrapper>
    );
  }

  return (
    <StudioWrapper>
      <StudioContainer>
        <PageHeader>
          <BackButton onClick={() => s.navigate(`/item/${s.currentItem!.id}`)}>← Catalog</BackButton>
          <h1>Studio · Bag #{s.currentItem.id}</h1>
        </PageHeader>

        {/* ── Left column ──────────────────────────────────────── */}
        <ControlsColumn>
          <SuggestionEngine
            suggestedBag={s.suggestedBag}
            suggestionStats={s.suggestionStats}
            showSuggestion={s.showSuggestion}
            getBagThumbnail={s.getBagThumbnail}
            onSuggest={s.handleGetSuggestion}
            onReset={s.handleResetHistory}
            onViewSuggestion={s.handleViewSuggestion}
          />

          <BatchTargets
            resolutionDirectory={s.resolutionDirectory}
            checkedSizes={s.checkedSizes}
            previewSizeId={s.previewSizeId}
            customW={s.customW}
            customH={s.customH}
            sides={s.sides}
            onToggleSize={s.toggleSizeCheckbox}
            onSetPreviewSize={s.setPreviewSizeId}
            onSetCustomW={s.setCustomW}
            onSetCustomH={s.setCustomH}
            onSetSides={s.setSides}
          />

          <ChromaPanel
            isTransparent={s.isTransparent}
            bgColor={s.bgColor}
            defaultBgColor={s.currentItem.backgroundColor}
            onTransparentToggle={s.handleTransparentToggle}
            onBgColorChange={s.setBgColor}
            onResetBgColor={() => s.setBgColor(s.currentItem!.backgroundColor ?? '#ffffff')}
          />

          <CompositionPanel
            bagScale={s.bagScale}
            format={s.format}
            isTransparent={s.isTransparent}
            onScaleChange={s.setBagScale}
            onFormatChange={s.setFormat}
          />

          <PrimaryButton onClick={s.handleExport}>
            ⬇ Export assets
          </PrimaryButton>
        </ControlsColumn>

        {/* ── Right column ─────────────────────────────────────── */}
        <PreviewMonitor
          previewSide={s.previewSide}
          livePreview={s.livePreview}
          bgColor={s.bgColor}
          isTransparent={s.isTransparent}
          bagScale={s.bagScale}
          previewImgSrc={s.previewImgSrc}
          itemId={s.currentItem.id}
          onSideChange={s.setPreviewSide}
          onCopyPostText={s.handleCopyPostText}
          onGoToItem={() => s.navigate(`/item/${s.currentItem!.id}`)}
        />
      </StudioContainer>
    </StudioWrapper>
  );
};