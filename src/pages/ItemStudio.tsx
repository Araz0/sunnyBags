import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { allBags, categories, ExtendedBag } from '../data';
import { suggestBag, resetSuggestionHistory, getSuggestionStats } from '../utils/suggest';

// --- STYLES (Full Light & Dark Mode Compliance + Fluid Mobile Adaptation) ---
const StudioWrapper = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  padding-bottom: 50px;
  transition: background-color 0.3s ease, color 0.3s ease;

  --bg-color: #ffffff;
  --text-color: #333333;
  --panel-bg: #f9f9f9;
  --control-bg: #ffffff;
  --border-color: #eeeeee;
  --input-border: #cccccc;
  --accent-color: #df4b4b;
  --accent-hover: #c03939;
  --success-color: #27ae60;
  --success-hover: #229954;

  @media (prefers-color-scheme: dark) {
    --bg-color: #121212;
    --text-color: #f0f0f0;
    --panel-bg: #1e1e1e;
    --control-bg: #2a2a2a;
    --border-color: #333333;
    --input-border: #444444;
  }
`;

const StudioContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px 12px;
  }
`;

const Header = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const BackButton = styled.button`
  background: var(--control-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
  
  &:hover {
    background: var(--border-color);
  }
`;

const ControlsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 800px) {
    grid-row: 2;
  }
`;

const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--panel-bg);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  height: fit-content;
  position: sticky;
  top: 20px;
  box-sizing: border-box;

  @media (max-width: 800px) {
    position: relative;
    top: 0;
    grid-row: 1;
    padding: 12px;
  }
`;

const ControlGroup = styled.div`
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--control-bg);
  box-sizing: border-box;

  select, input[type="text"], input[type="number"], input[type="color"], input[type="range"] {
    background: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 8px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Button = styled.button`
  background: var(--accent-color);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  font-size: 1.1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: var(--accent-hover);
  }
`;

const SuggestionButton = styled(Button)`
  background: var(--success-color);
  
  &:hover {
    background: var(--success-hover);
  }
`;

const InlineButton = styled.button`
  background: var(--border-color);
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  align-self: flex-start;
  
  &:hover { opacity: 0.9; }
`;

const ClearPatternBtn = styled.button`
  background: var(--border-color);
  color: var(--text-color);
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-top: 5px;
  
  &:hover { opacity: 0.9; }
`;

const SizeMatrixTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
`;

const SizeRow = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
`;

const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 10px;
  margin-top: 5px;
`;

const PatternOption = styled.button<{ bg: string; active: boolean; invert: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 6px;
  border: 2px solid ${(props) => (props.active ? 'var(--accent-color)' : 'var(--input-border)')};
  background-image: url("${(props) => props.bg}");
  background-repeat: repeat;
  background-color: ${(props) => (props.invert ? '#1a1a1a' : '#ffffff')};
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s, border-color 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const transparentBg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23fff"/><rect y="10" width="10" height="10" fill="%23fff"/></svg>')`;

const PreviewContainer = styled.div<{ w: number; h: number; bg: string; isTransparent: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${(props) => (props.w / props.h) * 500}px;
  aspect-ratio: ${(props) => props.w} / ${(props) => props.h};
  height: auto;
  background: ${(props) => (props.isTransparent ? transparentBg : props.bg)};
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
`;

const PreviewPattern = styled.div<{ pattern: string | null; visible: boolean; opacity: number }>`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: ${(props) => (props.visible && props.pattern ? `url("${props.pattern}")` : 'none')};
  background-repeat: repeat;
  opacity: ${(props) => props.opacity};
  pointer-events: none;
  z-index: 1;
`;

const PreviewImage = styled.img<{ scale: number }>`
  max-width: ${(props) => props.scale * 100}%;
  max-height: ${(props) => props.scale * 100}%;
  object-fit: contain;
  z-index: 2;
  position: relative;
`;

const SideToggle = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;

  button {
    flex: 1;
    padding: 10px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    background: var(--control-bg);
    color: var(--text-color);
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.9rem;
    
    &.active {
      background: var(--text-color);
      color: var(--bg-color);
      border-color: var(--text-color);
    }
  }

  @media (max-width: 400px) {
    button {
      font-size: 0.8rem;
      padding: 8px;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
`;

const SuggestionCard = styled.div`
  background: var(--bg-color);
  border: 2px solid var(--success-color);
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
  display: ${(props: { visible: boolean }) => props.visible ? 'block' : 'none'};
  
  h3 {
    margin: 0 0 8px 0;
    color: var(--success-color);
    font-size: 1.1rem;
  }
  
  p {
    margin: 5px 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .highlight {
    font-weight: bold;
    color: var(--accent-color);
  }
  
  .view-link {
    display: inline-block;
    margin-top: 10px;
    color: var(--accent-color);
    text-decoration: underline;
    cursor: pointer;
    
    &:hover {
      opacity: 0.8;
    }
  }

  .thumbnail-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .thumbnail-image {
    max-width: 100%;
    max-height: 150px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    object-fit: contain;
  }
`;

const SuggestionStats = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  
  span {
    display: inline-block;
    margin-right: 15px;
  }
`;

// --- DYNAMIC PATTERN GENERATION FACTORY ---
const generatePresetPatterns = (invertColor: boolean) => {
  const fill = invertColor ? 'white' : 'black';
  const stroke = invertColor ? 'white' : 'black';
  
  return [
    { name: 'Dots', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Ccircle cx='3' cy='3' r='2' fill='${fill}'/%3E%3C/svg%3E` },
    { name: 'Grid', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' fill='none' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` },
    { name: 'Stripes', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15'%3E%3Cpath d='M0 15L15 0' stroke='${stroke}' stroke-width='1.5'/%3E%3C/svg%3E` },
    { name: 'Diagonal Cross', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M0 0L14 14M14 0L0 14' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` },
    { name: 'Waves', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='15'%3E%3Cpath d='M0 10 Q 7.5 0, 15 10 T 30 10' fill='none' stroke='${stroke}' stroke-width='1.5'/%3E%3C/svg%3E` },
    { name: 'Chevron', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10'%3E%3Cpath d='M0 10 L10 2 L20 10' fill='none' stroke='${stroke}' stroke-width='1.5'/%3E%3C/svg%3E` },
    { name: 'Diamonds', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 0 L24 12 L12 24 L0 12 Z' fill='none' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` },
    { name: 'Checkerboard', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='${fill}'/%3E%3Crect x='10' y='10' width='10' height='10' fill='${fill}'/%3E%3C/svg%3E` },
    { name: 'Stars', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpolygon points='10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7' fill='${fill}'/%3E%3C/svg%3E` },
    { name: 'Large Polka', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ccircle cx='15' cy='15' r='6' fill='${fill}'/%3E%3C/svg%3E` },
    { name: 'Vertical Lines', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath d='M5 0 V10' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` },
    { name: 'Triangles', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cpolygon points='10,4 16,14 4,14' fill='none' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` },
    { name: 'Concentric', value: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30'%3E%3Ccircle cx='15' cy='15' r='12' fill='none' stroke='${stroke}' stroke-width='1'/%3E%3Ccircle cx='15' cy='15' r='6' fill='none' stroke='${stroke}' stroke-width='1'/%3E%3C/svg%3E` }
  ];
};

export const ItemStudio = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  // Current item state - can be updated without navigation
  const [currentItem, setCurrentItem] = useState(() => {
    return allBags.all.find((b) => b.id === Number(itemId));
  });

  // Update current item when URL param changes
  useEffect(() => {
    const newItem = allBags.all.find((b) => b.id === Number(itemId));
    if (newItem) {
      setCurrentItem(newItem);
      // Reset background color to new item's default
      if (newItem.backgroundColor) {
        setBgColor(newItem.backgroundColor);
      }
    }
  }, [itemId]);

  // Persistent Custom Sizing Arrays via Storage APIs
  const [customW, setCustomW] = useState<number>(() => Number(localStorage.getItem('studio_custom_w')) || 1200);
  const [customH, setCustomH] = useState<number>(() => Number(localStorage.getItem('studio_custom_h')) || 1200);

  // Styling States
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [patternIndex, setPatternIndex] = useState<number | null>(null);
  const [customPattern, setCustomPattern] = useState<string | null>(null);
  const [invertPattern, setInvertPattern] = useState<boolean>(false);
  const [patternOpacity, setPatternOpacity] = useState<number>(0.12);
  const [bagScale, setBagScale] = useState<number>(0.80);
  const [previewSide, setPreviewSide] = useState<'A' | 'B'>('A');

  // Resolution Handling Toggles
  const [checkedSizes, setCheckedSizes] = useState<Record<string, boolean>>({ insta_feed: true });
  const [previewSizeId, setPreviewSizeId] = useState<string>('insta_feed');
  
  const [sides, setSides] = useState({ front: true, back: true });
  const [isTransparent, setIsTransparent] = useState(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  // Suggestion States
  const [suggestedBag, setSuggestedBag] = useState<any>(null);
  const [suggestionStats, setSuggestionStats] = useState<any>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Fallback default asset extraction configuration logic
  useEffect(() => {
    if (currentItem?.backgroundColor) {
      setBgColor(currentItem.backgroundColor);
    }
  }, [currentItem]);

  useEffect(() => {
    localStorage.setItem('studio_custom_w', customW.toString());
    localStorage.setItem('studio_custom_h', customH.toString());
  }, [customW, customH]);

  const presetPatterns = useMemo(() => generatePresetPatterns(invertPattern), [invertPattern]);

  const activePatternValue = useMemo(() => {
    if (customPattern) return customPattern;
    if (patternIndex !== null && presetPatterns[patternIndex]) return presetPatterns[patternIndex].value;
    return null;
  }, [customPattern, patternIndex, presetPatterns]);

  const resolutionDirectory = useMemo(() => {
    return [
      { id: 'insta_feed', w: 1080, h: 1350, name: 'Instagram Feed (4:5)' },
      { id: 'insta_story', w: 1080, h: 1920, name: 'Story / Vertical Reel (9:16)' },
      { id: 'square_post', w: 1080, h: 1080, name: 'Standard Grid Square (1:1)' },
      { id: 'hq_print', w: 2160, h: 2700, name: 'Ultra High-Res Display (4:5)' },
      { id: 'custom_frame', w: customW, h: customH, name: 'Custom User Mapping' }
    ];
  }, [customW, customH]);

  const livePreviewResolution = useMemo(() => {
    return resolutionDirectory.find((r: typeof resolutionDirectory[0]) => r.id === previewSizeId) || resolutionDirectory[0];
  }, [previewSizeId, resolutionDirectory]);

  const getThumbnailPath = (
        categoryId: number,
        itemId: number,
        side: 'A' | 'B',
      ) => {
          const paddedCategoryId = categoryId.toString().padStart(4, '0')
          return `/gallery/thumbnails/${paddedCategoryId}/${itemId}${side}.png`
      }

  // Helper to get thumbnail for a bag
  const getBagThumbnail = (bag: ExtendedBag) => {
    const category = categories.find(cat => cat.id === bag.category_id);
    return getThumbnailPath(category?.id || 0, bag.id, 'A');
  };

  // Suggestion Handlers
  const handleGetSuggestion = () => {
    const bag = suggestBag();
    if (bag) {
      setSuggestedBag(bag);
      setShowSuggestion(true);
      
      // Update stats
      const stats = getSuggestionStats();
      setSuggestionStats(stats);
    } else {
      alert('No unsold items available!');
    }
  };

  const handleResetHistory = () => {
    resetSuggestionHistory();
    setSuggestionStats(getSuggestionStats());
    setShowSuggestion(false);
  };

  const handleViewSuggestion = (id: number) => {
    // Find the suggested bag in the data
    const bag = allBags.all.find((b) => b.id === id);
    if (bag) {
      // Update the current item without navigation
      setCurrentItem(bag);
      // Update background color to match the new item
      if (bag.backgroundColor) {
        setBgColor(bag.backgroundColor);
      }
      // Update URL to reflect the new item without full reload
      navigate(`/item/${id}/studio`, { replace: true });
      // Hide the suggestion card after viewing
      setShowSuggestion(false);
    }
  };

  const goToItemPage = (id: number) => {
    navigate(`/item/${id}`, { replace: true });
  }

  if (!currentItem) {
    return (
      <StudioWrapper>
        <StudioContainer>
          <Header>
            <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
            <h1>Item Matrix Entry Not Found</h1>
          </Header>
        </StudioContainer>
      </StudioWrapper>
    );
  }

  const paddedCategoryId = currentItem.category_id.toString().padStart(4, '0');
  const previewImgSrc = `/gallery/images/${paddedCategoryId}/${currentItem.id}${previewSide}.png`;

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const handleCustomPatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPatternIndex(null);
          setCustomPattern(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransparentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsTransparent(checked);
    if (checked && format === 'image/jpeg') {
      setFormat('image/png');
    }
  };

  const toggleSizeCheckbox = (id: string, checked: boolean) => {
    setCheckedSizes(prev => ({ ...prev, [id]: checked }));
  };

  const generateAssets = async () => {
    const sidesToProcess: ('A' | 'B')[] = [];
    if (sides.front) sidesToProcess.push('A');
    if (sides.back) sidesToProcess.push('B');

    const selectedTargets = resolutionDirectory.filter(res => checkedSizes[res.id]);

    if (selectedTargets.length === 0) {
      alert("Please select at least one output resolution mapping target checkbox.");
      return;
    }

    for (const target of selectedTargets) {
      for (const side of sidesToProcess) {
        const canvas = document.createElement('canvas');
        canvas.width = target.w;
        canvas.height = target.h;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        if (!isTransparent) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          if (activePatternValue) {
            const patImg = new Image();
            patImg.src = activePatternValue;
            await new Promise((r) => { patImg.onload = r; });
            
            ctx.globalAlpha = patternOpacity;
            const repeatPattern = ctx.createPattern(patImg, 'repeat');
            if (repeatPattern) {
                ctx.fillStyle = repeatPattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.globalAlpha = 1.0;
          }
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = `/gallery/images/${paddedCategoryId}/${currentItem.id}${side}.png`;
        await new Promise((r) => { img.onload = r; });

        const maxDimW = canvas.width * bagScale;
        const maxDimH = canvas.height * bagScale;
        const ratio = Math.min(maxDimW / img.width, maxDimH / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        ctx.drawImage(
          img,
          (canvas.width - newWidth) / 2,
          (canvas.height - newHeight) / 2,
          newWidth,
          newHeight
        );

        const sideName = side === 'A' ? 'front' : 'back';
        const extension = format.split('/')[1];
        const transparencyLabel = isTransparent ? 'transparent_' : '';
        
        downloadFile(
          canvas.toDataURL(format, 0.95),
          `${currentItem.id}_${sideName}_${transparencyLabel}${target.id}.${extension === 'jpeg' ? 'jpg' : extension}`
        );
      }
    }
  };

  return (
    <StudioWrapper>
      <StudioContainer>
        <Header>
          <BackButton onClick={() => navigate(`/item/${currentItem.id}`)}>← Return to Catalog</BackButton>
          <h1>Studio Frame Control · Bag #{currentItem.id}</h1>
        </Header>

        <ControlsColumn>
          {/* SUGGESTION ENGINE SECTION */}
          <ControlGroup>
            <label><strong>🎯 Smart Suggestion Engine</strong></label>
            <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', opacity: 0.7 }}>
              Get personalized recommendations based on variety, price, and availability
            </p>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <SuggestionButton onClick={handleGetSuggestion} style={{ flex: 2 }}>
                ✨ Suggest a Bag
              </SuggestionButton>
              <Button onClick={handleResetHistory} style={{ flex: 1, background: 'var(--border-color)', color: 'var(--text-color)' }}>
                Reset History
              </Button>
            </div>

            {suggestionStats && (
              <SuggestionStats>
                <span>📊 Total: {suggestionStats.totalSuggestions}</span>
                <span>🏷️ Categories: {suggestionStats.uniqueCategoriesSuggested}</span>
                <span>💰 Avg: ${suggestionStats.averagePrice.toFixed(2)}</span>
              </SuggestionStats>
            )}

            <SuggestionCard visible={showSuggestion && !!suggestedBag}>
              <h3>🎁 Suggested Bag #{suggestedBag?.id}</h3>
              
              {/* Thumbnail Image */}
              {suggestedBag && (
                <div className="thumbnail-container">
                  <img 
                    src={getBagThumbnail(suggestedBag)} 
                    alt={`Bag ${suggestedBag.id}`}
                    className="thumbnail-image"
                    onError={(e) => {
                      // Fallback if thumbnail fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <p><strong>Category:</strong> {suggestedBag?.category}</p>
              <p><strong>Price:</strong> <span className="highlight">${suggestedBag?.finalPrice?.toFixed(2)}</span></p>
              {suggestedBag?.discount > 0 && (
                <p><strong>Discount:</strong> {suggestedBag.discount}% off!</p>
              )}
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '8px' }}>
                {suggestedBag?.description?.substring(0, 100)}...
              </p>
              <div 
                className="view-link" 
                onClick={() => suggestedBag && handleViewSuggestion(suggestedBag.id)}
              >
                View this bag →
              </div>
            </SuggestionCard>
          </ControlGroup>

          {/* BATCH TARGET SELECTION RESOLUTION LIST */}
          <ControlGroup>
            <label><strong>Batch Targets & Monitor Frame Size:</strong></label>
            <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', opacity: 0.7 }}>
              Check boxes to export multiple items at once. Select radio to change live preview.
            </p>
            <SizeMatrixTable>
              {resolutionDirectory.map((res) => (
                <SizeRow key={res.id}>
                  <input 
                    type="checkbox" 
                    checked={!!checkedSizes[res.id]} 
                    onChange={(e) => toggleSizeCheckbox(res.id, e.target.checked)}
                    title="Include in export bundle"
                  />
                  <input 
                    type="radio" 
                    name="previewSizeSelector" 
                    checked={previewSizeId === res.id} 
                    onChange={() => setPreviewSizeId(res.id)}
                    title="Render in preview monitor"
                  />
                  <span style={{ fontSize: '0.9rem' }}>
                    <strong>{res.name}</strong> <span style={{ opacity: 0.6 }}>({res.w} × {res.h}px)</span>
                  </span>
                </SizeRow>
              ))}
            </SizeMatrixTable>

            {/* PERSISTENT STORAGE CUSTOM SIZING PANEL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '5px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Custom Width (px):</label>
                <input 
                  type="number" 
                  value={customW} 
                  onChange={(e) => setCustomW(Math.max(100, Number(e.target.value)))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Custom Height (px):</label>
                <input 
                  type="number" 
                  value={customH} 
                  onChange={(e) => setCustomH(Math.max(100, Number(e.target.value)))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '5px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <CheckboxLabel>
                <input type="checkbox" checked={sides.front} onChange={(e) => setSides((prev) => ({ ...prev, front: e.target.checked }))} /> Batch Front Asset
              </CheckboxLabel>
              <CheckboxLabel>
                <input type="checkbox" checked={sides.back} onChange={(e) => setSides((prev) => ({ ...prev, back: e.target.checked }))} /> Batch Back Asset
              </CheckboxLabel>
            </div>
          </ControlGroup>

          {/* BACKDROP CHROMA AND VECTOR CONFIGURATION MAP */}
          <ControlGroup>
            <label><strong>Chroma & Pattern Configurations:</strong></label>
            
            <CheckboxLabel style={{ color: 'var(--accent-color)', marginBottom: '5px' }}>
              <input type="checkbox" checked={isTransparent} onChange={handleTransparentToggle} />
              Enforce Transparent Alphachannel (Disables Backdrops)
            </CheckboxLabel>

            {!isTransparent && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: '50px', height: '40px', padding: 0, cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Canvas Base Fill Color</span>
                    {currentItem.backgroundColor && (
                      <InlineButton onClick={() => setBgColor(currentItem.backgroundColor || '#ffffff')} type="button">
                        Reset to Bag Default
                      </InlineButton>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
                    <label style={{ fontSize: '0.9rem' }}>Select Preset Texture Vector:</label>
                    <CheckboxLabel style={{ fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={invertPattern} 
                        onChange={(e) => setInvertPattern(e.target.checked)} 
                      /> Invert Pattern Color (White lines)
                    </CheckboxLabel>
                  </div>

                  <PatternGrid>
                    {presetPatterns.map((p, idx) => (
                      <PatternOption
                        key={p.name}
                        bg={p.value}
                        active={patternIndex === idx && !customPattern}
                        invert={invertPattern}
                        onClick={() => {
                          setCustomPattern(null);
                          setPatternIndex(idx);
                        }}
                        title={p.name}
                        type="button"
                      />
                    ))}
                  </PatternGrid>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Pattern Opacity Intensity:</span>
                    <span style={{ fontWeight: 'bold' }}>{Math.round(patternOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.01" 
                    max="0.80" 
                    step="0.01" 
                    value={patternOpacity} 
                    onChange={(e) => setPatternOpacity(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>Upload Custom Overlay Matrix Pattern:</div>
                <input type="file" accept="image/png, image/jpeg" onChange={handleCustomPatternUpload} style={{ fontSize: '0.85rem', width: '100%' }}/>
                
                {activePatternValue && (
                  <ClearPatternBtn onClick={() => {
                    setPatternIndex(null);
                    setCustomPattern(null);
                  }} type="button">
                    ✕ Flush Active Texture Overlay
                  </ClearPatternBtn>
                )}
              </>
            )}
          </ControlGroup>

          {/* ASSET SCALING BOUNDARIES & CONTAINER TARGETS */}
          <ControlGroup>
            <label><strong>Composition Layout & Sizing Bounds:</strong></label>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '2px' }}>
              <span>Bag Boundary Scale Factor:</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(bagScale * 100)}% of Canvas Size</span>
            </div>
            <input 
              type="range" 
              min="0.20" 
              max="2.00" 
              step="0.02" 
              value={bagScale} 
              onChange={(e) => setBagScale(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />

            <label style={{ marginTop: '10px' }}><strong>Container Mime Type Target:</strong></label>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value as string)}
            >
              {!isTransparent && <option value="image/jpeg">JPEG Baseline Optimization</option>}
              <option value="image/png">PNG-24 Lossless Array Structure</option>
              <option value="image/webp">WebP High Density Vector Stream</option>
            </select>
          </ControlGroup>

          <Button onClick={generateAssets}>Compile & Export Digital Assets</Button>
        </ControlsColumn>

        {/* MONITOR COMPOSITOR MONITOR BLOCK */}
        <PreviewColumn>
          <SideToggle>
            <button type="button" className={previewSide === 'A' ? 'active' : ''} onClick={() => setPreviewSide('A')}>Front Vector Target</button>
            <button type="button" className={previewSide === 'B' ? 'active' : ''} onClick={() => setPreviewSide('B')}>Back Vector Target</button>
          </SideToggle>

          <PreviewContainer w={livePreviewResolution.w} h={livePreviewResolution.h} bg={bgColor} isTransparent={isTransparent}>
            <PreviewPattern pattern={activePatternValue} visible={!isTransparent} opacity={patternOpacity} />
            <PreviewImage src={previewImgSrc} scale={bagScale} alt="Dynamic Live Preview Frame" />
          </PreviewContainer>
          
          <p style={{ marginTop: '15px', color: 'var(--text-color)', opacity: 0.6, fontSize: '0.9rem', textAlign: 'center', marginGrid: '0' }}>
            Compositor Output Matrix Monitor <br />
            Resolution Mapping: {livePreviewResolution.w} x {livePreviewResolution.h} px ({livePreviewResolution.name})
          </p>
          <button onClick={() => goToItemPage(currentItem.id)} style={{ marginTop: '10px', width: '100%' }}>
            🔗 Return to Bag #{currentItem.id} Catalog Page
          </button>
        </PreviewColumn>

      </StudioContainer>
    </StudioWrapper>
  );
};