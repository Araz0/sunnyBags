import styled from '@emotion/styled'

// ── Layout ─────────────────────────────────────────────────────────────────

export const StudioWrapper = styled.div`
  --bg: #ffffff;
  --text: #333333;
  --panel: #f9f9f9;
  --surface: #ffffff;
  --border: #eeeeee;
  --input-border: #cccccc;
  --accent: #df4b4b;
  --accent-hover: #c03939;
  --ok: #27ae60;
  --ok-hover: #229954;
  --muted: rgba(0, 0, 0, 0.45);

  @media (prefers-color-scheme: dark) {
    --bg: #121212;
    --text: #f0f0f0;
    --panel: #1e1e1e;
    --surface: #2a2a2a;
    --border: #333333;
    --input-border: #444444;
    --muted: rgba(255, 255, 255, 0.45);
  }

  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  padding-bottom: 50px;
  transition:
    background 0.3s,
    color 0.3s;
`

export const StudioContainer = styled.div`
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
`

export const PageHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 15px;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    h1 {
      font-size: 1.3rem;
    }
  }
`

export const ControlsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 800px) {
    grid-row: 2;
  }
`

export const PreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--panel);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
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
`

// ── Cards / Groups ─────────────────────────────────────────────────────────

export const ControlGroup = styled.div`
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--surface);
  box-sizing: border-box;

  select,
  input[type='text'],
  input[type='number'],
  input[type='color'],
  input[type='range'] {
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--input-border);
    border-radius: 4px;
    padding: 8px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 15px;
  }
`

export const GroupLabel = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
`

export const GroupHint = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
`

// ── Buttons ────────────────────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: var(--accent);
  color: #fff;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover {
    background: var(--accent-hover);
  }
`

export const OkButton = styled(PrimaryButton)`
  background: var(--ok);
  &:hover {
    background: var(--ok-hover);
  }
`

export const GhostButton = styled.button`
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.75;
  }
`

export const BackButton = styled(GhostButton)`
  font-weight: 700;
`

// ── Preview canvas ─────────────────────────────────────────────────────────

const checkerBg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23fff"/><rect y="10" width="10" height="10" fill="%23fff"/></svg>')`

export const PreviewCanvas = styled.div<{
  w: number
  h: number
  bg: string
  transparent: boolean
}>`
  position: relative;
  width: 100%;
  max-width: ${(p) => (p.w / p.h) * 500}px;
  aspect-ratio: ${(p) => p.w} / ${(p) => p.h};
  background: ${(p) => (p.transparent ? checkerBg : p.bg)};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--border);
  box-sizing: border-box;
  transition: background 0.3s;
`

export const BagImage = styled.img<{ scale: number }>`
  max-width: ${(p) => p.scale * 100}%;
  max-height: ${(p) => p.scale * 100}%;
  object-fit: contain;
  z-index: 2;
  position: relative;
`

// ── Side toggle ────────────────────────────────────────────────────────────

export const SideToggle = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`

export const SideTab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.9rem;
  transition:
    background 0.15s,
    color 0.15s;
  background: ${(p) => (p.active ? 'var(--text)' : 'var(--surface)')};
  color: ${(p) => (p.active ? 'var(--bg)' : 'var(--text)')};
  border-color: ${(p) => (p.active ? 'var(--text)' : 'var(--border)')};
`

// ── Resolution matrix ──────────────────────────────────────────────────────

export const SizeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SizeRow = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
`

// ── Suggestion card ────────────────────────────────────────────────────────

export const SuggestionCard = styled.div`
  background: var(--bg);
  border: 2px solid var(--ok);
  border-radius: 8px;
  padding: 15px;
  margin-top: 4px;

  h3 {
    margin: 0 0 8px 0;
    color: var(--ok);
    font-size: 1rem;
  }
  p {
    margin: 4px 0;
    font-size: 0.88rem;
  }
`

export const SuggestionStats = styled.div`
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`

// ── Misc ───────────────────────────────────────────────────────────────────

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`

export const SliderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
  }

  input[type='range'] {
    width: 100%;
  }
`

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

export const Divider = styled.div`
  border-top: 1px solid var(--border);
  margin: 4px 0;
`
