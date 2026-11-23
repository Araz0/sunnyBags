import{i as be,j as e,f as A,h as Ce,R as d,v as ke,A as h,B as Pe}from"./index-9f0cf1f5.js";import{b as Ie,a as ze,d as Te}from"./OpenInNew-f81ba77d.js";import{d as ce}from"./Event-bc21257d.js";import{r as ve,b as Re,d as Ee,B as I,s as _e}from"./context-f0994a70.js";import{n as Be,a as Ae,u as Ne,b as de,o as $e,q as Oe,v as Fe}from"./publish-4f0b792a.js";import{k as We,n as ge,S,T as y,x as ue,q as B,C as Y,a6 as He,K as Ge,P as ee,L as Le,v as De,r as Me,E as Ue,A as Ve}from"./bits-add703cd.js";import{u as Ye,P as pe}from"./PublishNowButton-eaec27c5.js";import{T as he,a as xe}from"./ToggleButtonGroup-5d7b05a3.js";import{F as qe}from"./FormControlLabel-82e19aa9.js";import{C as Qe}from"./Checkbox-598258fc.js";import{T as Je}from"./TextField-0ce7399c.js";import"./SwitchBase-a42634fe.js";import"./Menu-7750dc91.js";var se={},Ke=be;Object.defineProperty(se,"__esModule",{value:!0});var je=se.default=void 0,Xe=Ke(ve()),Ze=e;je=se.default=(0,Xe.default)((0,Ze.jsx)("path",{d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z"}),"FileDownloadOutlined");let C=[];const z={CATEGORY_VARIETY:15,PRICE_RANGE:10,FABRIC_UNIQUENESS:8,DISCOUNT:12,CATEGORY_POPULARITY:5,SESSION_ROTATION:20,RECENCY_PENALTY:-3,DESCRIPTION_LENGTH:2,COLOR_VARIETY:7},et=()=>A.all.filter(s=>s.available!==!1),tt=s=>["red","blue","green","yellow","purple","pink","orange","black","white","brown","gray","gold","silver","teal","navy","indigo","emerald","crimson","amber","ochre","lavender","mint","olive","burgundy"].filter(a=>s.toLowerCase().includes(a)),st=(s,t,a)=>{var u,m;let r=0;t.has(s.category_id)||(r+=z.CATEGORY_VARIETY);const g=Math.floor(s.finalPrice/5)*5;if(a.has(g)||(r+=z.PRICE_RANGE),s.discount>0&&(r+=z.DISCOUNT+s.discount/10),(((u=s.fabric)==null?void 0:u.split(/[,& ]/).filter(l=>l.trim().length>0))||[]).length>1&&(r+=z.FABRIC_UNIQUENESS),A.all.filter(l=>l.category_id===s.category_id).length>5&&(r+=z.CATEGORY_POPULARITY),(((m=s.description)==null?void 0:m.length)||0)>150&&(r+=z.DESCRIPTION_LENGTH),tt(s.description||"").length>2&&(r+=z.COLOR_VARIETY),C.length>5){const l=C.slice(-5);if(!l.includes(s.id))r+=z.SESSION_ROTATION;else{const v=l.lastIndexOf(s.id);v!==-1&&(r+=z.RECENCY_PENALTY*(5-v))}}return r};function ot(){const s=et();if(s.length===0)return null;const t=new Set,a=new Set;C.slice(-5).forEach(u=>{const m=s.find(l=>l.id===u);if(m){t.add(m.category_id);const l=Math.floor(m.finalPrice/5)*5;a.add(l)}});const g=s.map(u=>({bag:u,score:st(u,t,a)}));g.sort((u,m)=>m.score-u.score);const o=g.slice(0,Math.min(5,g.length)),n=o.reduce((u,m)=>u+m.score,0);let f=Math.random()*n,x=null;for(const u of o)if(f-=u.score,f<=0){x=u.bag;break}return!x&&o.length>0&&(x=o[0].bag),x&&(C.push(x.id),C.length>50&&(C=C.slice(-50))),x}function it(){C=[]}function me(){const s=A.all.filter(n=>C.includes(n.id)),t=new Set(s.map(n=>n.category_id)),a=new Map;s.forEach(n=>{const f=a.get(n.category_id)||0;a.set(n.category_id,f+1)});let r=null,g=0;a.forEach((n,f)=>{n>g&&(g=n,r=f)});const o=s.length>0?s.reduce((n,f)=>n+f.finalPrice,0)/s.length:0;return{totalSuggestions:C.length,uniqueCategoriesSuggested:t.size,mostSuggestedCategory:r,averagePrice:o}}const rt=s=>{const t=Ce(),[a,r]=d.useState(()=>A.all.find(c=>c.id===Number(s)));d.useEffect(()=>{const c=A.all.find(b=>b.id===Number(s));c&&(r(c),c.backgroundColor&&o(c.backgroundColor))},[s]);const[g,o]=d.useState("#ffffff"),[n,f]=d.useState(null),[x,u]=d.useState(null),[m,l]=d.useState(!1),[v,J]=d.useState(1),[w,K]=d.useState(!1),[R,W]=d.useState("image/jpeg"),[H,G]=d.useState("A"),[E,L]=d.useState("insta_feed"),[k,D]=d.useState(()=>Number(localStorage.getItem("studio_custom_w"))||1200),[P,M]=d.useState(()=>Number(localStorage.getItem("studio_custom_h"))||1200),[N,U]=d.useState({insta_feed:!0}),[$,X]=d.useState({front:!0,back:!0});d.useEffect(()=>{localStorage.setItem("studio_custom_w",k.toString()),localStorage.setItem("studio_custom_h",P.toString())},[k,P]);const[O,V]=d.useState(null),[Z,F]=d.useState(null),[i,p]=d.useState(!1),j=d.useMemo(()=>[{id:"insta_feed",w:1080,h:1350,name:"Instagram Feed (4:5)"},{id:"insta_story",w:1080,h:1920,name:"Story / Reel (9:16)"},{id:"square_post",w:1080,h:1080,name:"Square Grid (1:1)"},{id:"pin",w:1e3,h:1500,name:"Pinterest Pin (2:3)"},{id:"hq_print",w:2160,h:2700,name:"Ultra High-Res (4:5)"},{id:"custom_frame",w:k,h:P,name:"Custom"}],[k,P]),_=d.useMemo(()=>j.find(c=>c.id===E)??j[0],[E,j]),re=(a==null?void 0:a.category_id.toString().padStart(4,"0"))??"0000",we=a?`/gallery/images/${re}/${a.id}${H}.png`:"";return{currentItem:a,navigate:t,paddedCategoryId:re,previewImgSrc:we,getBagThumbnail:c=>{const b=ke.find(T=>T.id===c.category_id);return`/gallery/thumbnails/${((b==null?void 0:b.id)??0).toString().padStart(4,"0")}/${c.id}A.png`},bgColor:g,setBgColor:o,patternIndex:n,invertPattern:m,setInvertPattern:l,bagScale:v,setBagScale:J,isTransparent:w,format:R,setFormat:W,customPattern:x,previewSide:H,setPreviewSide:G,previewSizeId:E,setPreviewSizeId:L,livePreview:_,customW:k,setCustomW:D,customH:P,setCustomH:M,checkedSizes:N,sides:$,setSides:X,resolutionDirectory:j,suggestedBag:O,suggestionStats:Z,showSuggestion:i,handleTransparentToggle:c=>{K(c),c&&R==="image/jpeg"&&W("image/png")},handleCustomPatternUpload:c=>{var ne;const b=(ne=c.target.files)==null?void 0:ne[0];if(!b)return;const T=new FileReader;T.onload=ae=>{var le;(le=ae.target)!=null&&le.result&&(f(null),u(ae.target.result))},T.readAsDataURL(b)},clearPattern:()=>{f(null),u(null)},selectPresetPattern:c=>{u(null),f(c)},toggleSizeCheckbox:(c,b)=>U(T=>({...T,[c]:b})),handleGetSuggestion:()=>{const c=ot();if(!c){alert("No unsold items available!");return}V(c),p(!0),F(me())},handleResetHistory:()=>{it(),F(me()),p(!1)},handleViewSuggestion:c=>{const b=A.all.find(T=>T.id===c);b&&(r(b),b.backgroundColor&&o(b.backgroundColor),t(`/item/${c}/studio`,{replace:!0}),p(!1))},handleExport:async()=>{if(!a)return;const c=j.filter(b=>N[b.id]);if(!c.length){alert("Select at least one export size.");return}await Be({item:a,bgColor:g,isTransparent:w,bagScale:v,format:R,sides:$,targets:c})}}},nt=h.div`
  color: var(--text);
`,at=h.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;h.div`
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
`;const lt=h.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 900px) {
    grid-row: 2;
  }
`,ct=h.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--panel);
  padding: 20px;
  border-radius: 14px;
  border: 1px solid var(--border);
  height: fit-content;
  position: sticky;
  top: 20px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    position: relative;
    top: 0;
    grid-row: 1;
    padding: 12px;
  }
`,q=h.div`
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
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
`,Q=h.p`
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
`,Se=h.p`
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
`,dt=h.button`
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
`,gt=h(dt)`
  background: var(--ok);
  &:hover {
    background: var(--ok-hover);
  }
`,oe=h.button`
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
`;h(oe)`
  font-weight: 700;
`;const ut=`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23fff"/><rect y="10" width="10" height="10" fill="%23fff"/></svg>')`,pt=h.div`
  position: relative;
  width: 100%;
  max-width: ${s=>s.w/s.h*500}px;
  aspect-ratio: ${s=>s.w} / ${s=>s.h};
  background: ${s=>s.transparent?ut:s.bg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--border);
  box-sizing: border-box;
  transition: background 0.3s;

  @media (max-width: 900px) {
    max-width: min(100%, ${s=>(s.w/s.h*52).toFixed(2)}vh);
  }
`,ht=h.img`
  max-width: ${s=>s.scale*100}%;
  max-height: ${s=>s.scale*100}%;
  object-fit: contain;
  z-index: 2;
  position: relative;
`,xt=h.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`,fe=h.button`
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
  background: ${s=>s.active?"var(--text)":"var(--surface)"};
  color: ${s=>s.active?"var(--bg)":"var(--text)"};
  border-color: ${s=>s.active?"var(--text)":"var(--border)"};
`,mt=h.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,ft=h.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
`,bt=h.div`
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
`,vt=h.div`
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`,te=h.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`,jt=h.div`
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
`,St=h.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`,yt=h.div`
  border-top: 1px solid var(--border);
  margin: 4px 0;
`,wt=({suggestedBag:s,suggestionStats:t,showSuggestion:a,getBagThumbnail:r,onSuggest:g,onReset:o,onViewSuggestion:n})=>{var f,x;return e.jsxs(q,{children:[e.jsx(Q,{children:"🎯 Suggestion Engine"}),e.jsx(Se,{children:"Recommends bags based on variety, price, and availability."}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(gt,{onClick:g,style:{flex:2},children:"✨ Suggest a Bag"}),e.jsx(oe,{onClick:o,style:{flex:1},children:"Reset History"})]}),t&&e.jsxs(vt,{children:[e.jsxs("span",{children:["📊 Total: ",t.totalSuggestions]}),e.jsxs("span",{children:["🏷️ Categories: ",t.uniqueCategoriesSuggested]}),e.jsxs("span",{children:["💰 Avg: $",t.averagePrice.toFixed(2)]})]}),a&&s&&e.jsxs(bt,{children:[e.jsxs("h3",{children:["🎁 Suggested — Bag #",s.id]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",margin:"8px 0"},children:e.jsx("img",{src:r(s),alt:`Bag ${s.id}`,style:{maxHeight:140,borderRadius:4,border:"1px solid var(--border)",objectFit:"contain"},onError:u=>{u.target.style.display="none"}})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Category:"})," ",s.category]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Price:"})," ",e.jsxs("span",{style:{fontWeight:700,color:"var(--accent)"},children:["$",(f=s.finalPrice)==null?void 0:f.toFixed(2)]})]}),s.discount>0&&e.jsxs("p",{children:[e.jsx("strong",{children:"Discount:"})," ",s.discount,"% off"]}),e.jsxs("p",{style:{fontSize:"0.82rem",opacity:.8},children:[(x=s.description)==null?void 0:x.substring(0,100),"…"]}),e.jsx("button",{onClick:()=>n(s.id),style:{background:"none",border:"none",padding:0,color:"var(--accent)",textDecoration:"underline",cursor:"pointer",fontSize:"0.9rem",marginTop:8},children:"Open this bag →"})]})]})},Ct=({resolutionDirectory:s,checkedSizes:t,previewSizeId:a,customW:r,customH:g,sides:o,onToggleSize:n,onSetPreviewSize:f,onSetCustomW:x,onSetCustomH:u,onSetSides:m})=>e.jsxs(q,{children:[e.jsx(Q,{children:"Export Sizes & Preview Frame"}),e.jsx(Se,{children:"☑ to include in export. ○ to use as the live preview resolution."}),e.jsx(mt,{children:s.map(l=>e.jsxs(ft,{children:[e.jsx("input",{type:"checkbox",checked:!!t[l.id],onChange:v=>n(l.id,v.target.checked),title:"Include in export"}),e.jsx("input",{type:"radio",name:"previewSizeSelector",checked:a===l.id,onChange:()=>f(l.id),title:"Show in preview"}),e.jsxs("span",{style:{fontSize:"0.88rem"},children:[e.jsx("strong",{children:l.name})," ",e.jsxs("span",{style:{opacity:.55},children:["(",l.w,"×",l.h,"px)"]})]})]},l.id))}),e.jsxs(St,{style:{marginTop:4},children:[e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Width (px)"}),e.jsx("input",{type:"number",value:r,onChange:l=>x(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Height (px)"}),e.jsx("input",{type:"number",value:g,onChange:l=>u(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]})]}),e.jsx(yt,{}),e.jsxs("div",{style:{display:"flex",gap:20},children:[e.jsxs(te,{children:[e.jsx("input",{type:"checkbox",checked:o.front,onChange:l=>m({...o,front:l.target.checked})}),"Export Front"]}),e.jsxs(te,{children:[e.jsx("input",{type:"checkbox",checked:o.back,onChange:l=>m({...o,back:l.target.checked})}),"Export Back"]})]})]}),kt=({isTransparent:s,bgColor:t,defaultBgColor:a,onTransparentToggle:r,onBgColorChange:g,onResetBgColor:o})=>e.jsxs(q,{children:[e.jsx(Q,{children:"Background"}),e.jsxs(te,{style:{color:"var(--accent)"},children:[e.jsx("input",{type:"checkbox",checked:s,onChange:n=>r(n.target.checked)}),"Transparent background (PNG/WebP only)"]}),!s&&e.jsx(e.Fragment,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("input",{type:"color",value:t,onChange:n=>g(n.target.value),style:{width:48,height:38,padding:0,cursor:"pointer",border:"none"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{style:{fontSize:"0.88rem"},children:"Canvas fill color"}),a&&e.jsx(oe,{onClick:o,type:"button",children:"Reset to bag default"})]})]})})]}),Pt=({bagScale:s,format:t,isTransparent:a,onScaleChange:r,onFormatChange:g})=>e.jsxs(q,{children:[e.jsx(Q,{children:"Composition & Output"}),e.jsxs(jt,{children:[e.jsxs("div",{className:"label-row",children:[e.jsx("span",{children:"Bag size"}),e.jsxs("strong",{children:[Math.round(s*100),"% of canvas"]})]}),e.jsx("input",{type:"range",min:"0.20",max:"2.00",step:"0.02",value:s,onChange:o=>r(parseFloat(o.target.value))})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.88rem",display:"block",marginBottom:4,fontWeight:600},children:"File format"}),e.jsxs("select",{value:t,onChange:o=>g(o.target.value),style:{width:"100%"},children:[!a&&e.jsx("option",{value:"image/jpeg",children:"JPEG"}),e.jsx("option",{value:"image/png",children:"PNG (lossless)"}),e.jsx("option",{value:"image/webp",children:"WebP"})]})]})]}),It=({previewSide:s,livePreview:t,bgColor:a,isTransparent:r,bagScale:g,previewImgSrc:o,onSideChange:n})=>e.jsxs(ct,{children:[e.jsxs(xt,{children:[e.jsx(fe,{active:s==="A",onClick:()=>n("A"),type:"button",children:"Front"}),e.jsx(fe,{active:s==="B",onClick:()=>n("B"),type:"button",children:"Back"})]}),e.jsx(pt,{w:t.w,h:t.h,bg:a,transparent:r,children:e.jsx(ht,{src:o,scale:g,alt:"Preview"})}),e.jsxs("p",{style:{marginTop:12,fontSize:"0.82rem",opacity:.55,textAlign:"center",lineHeight:1.5},children:[t.name," · ",t.w,"×",t.h,"px"]})]});var ie={},zt=be;Object.defineProperty(ie,"__esModule",{value:!0});var ye=ie.default=void 0,Tt=zt(ve()),Rt=e;ye=ie.default=(0,Tt.default)((0,Rt.jsx)("path",{d:"M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4z"}),"AddPhotoAlternateOutlined");const es=()=>{const{itemId:s}=Pe(),t=rt(s),{posts:a,settings:r}=Re(),g=Ee(),o=t.currentItem,[n,f]=d.useState(r.captionTone),[x,u]=d.useState(""),[m,l]=d.useState(r.captionLanguage),[v,J]=d.useState(r.includeFabric),[w,K]=d.useState(r.defaultPlatforms),R=Ae(),W=We(),{publishNow:H,busyId:G,progress:E}=Ye(),L=Ne(o==null?void 0:o.id),[k,D]=d.useState(!0),P=d.useRef(null);if(d.useEffect(()=>{o&&u(ge(o,n,r,m,v))},[o==null?void 0:o.id,n,m,v]),!o)return e.jsxs(S,{spacing:2,alignItems:"flex-start",children:[e.jsx(y,{variant:"h1",children:"Bag not found"}),e.jsx(I,{startIcon:e.jsx(Ie,{}),onClick:()=>t.navigate("/studio/library"),children:"Back to library"})]});const M=a.filter(i=>i.bagId===o.id),N=M.filter(i=>i.status==="posted").length,U=M.filter(i=>i.status==="scheduled").sort((i,p)=>i.scheduledAt.localeCompare(p.scheduledAt))[0],$=()=>({sizeId:t.livePreview.id,sizeName:t.livePreview.name,w:t.livePreview.w,h:t.livePreview.h,side:t.sides.front&&t.sides.back?"both":t.sides.back?"B":"A",bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,format:t.format,includeExtra:k}),X=async i=>{var j;const p=(j=i.target.files)==null?void 0:j[0];if(i.target.value="",!!p)try{Oe(o.id,await Fe(p)),D(!0),g.toast("Extra photo saved. It will be the last slide of this bag’s posts.")}catch(_){g.toast(_.name==="QuotaExceededError"?"Browser storage is full. Remove extra photos from other bags.":_.message)}},O=[{key:"A",label:"1 · Front",src:ue(o,"A"),on:t.sides.front,toggle:()=>t.setSides({...t.sides,front:!t.sides.front||!t.sides.back})},{key:"B",label:"2 · Back",src:ue(o,"B"),on:t.sides.back,toggle:()=>t.setSides({...t.sides,back:!t.sides.back||!t.sides.front})},{key:"X",label:"3 · Extra photo",src:L,on:!!L&&k,toggle:()=>D(!k),photo:!0}],V=()=>g.openEditor({bagId:o.id,design:$(),caption:x}),Z=de({platforms:w},R),F=async()=>{const i=Z.map(j=>Ve(j).label).join(" + ");if(!confirm(`Publish Bag #${o.id} to ${i} now with this design and caption?`))return;const p=_e.addPost({bagId:o.id,scheduledAt:new Date().toISOString(),platforms:w,caption:x,status:"scheduled",design:$(),auto:!1,language:m,includeFabric:v});await H(p.id,{confirm:!1})};return e.jsxs(nt,{children:[e.jsxs(S,{direction:{xs:"column",md:"row"},justifyContent:"space-between",alignItems:{xs:"flex-start",md:"center"},gap:2,mb:3,children:[e.jsxs(B,{children:[e.jsxs(S,{direction:"row",alignItems:"center",spacing:1,flexWrap:"wrap",useFlexGap:!0,children:[e.jsxs(y,{variant:"h1",children:["Bag #",o.id]}),e.jsx(Y,{size:"small",label:o.category}),e.jsx(Y,{size:"small",variant:"outlined",label:He(o)}),o.available===!1&&e.jsx(Y,{size:"small",color:"default",label:"Sold"})]}),e.jsxs(y,{color:"text.secondary",mt:.5,variant:"body2",children:[N?`Posted ${N}×`:"Never posted",U?` · next post ${Ge(U.scheduledAt)}`:""]})]}),e.jsxs(S,{direction:"row",gap:1,flexWrap:"wrap",children:[e.jsx(I,{color:"inherit",startIcon:e.jsx(ze,{}),onClick:()=>t.navigate(`/item/${o.id}`),children:"Shop page"}),e.jsx(I,{variant:"outlined",startIcon:e.jsx(je,{}),onClick:t.handleExport,children:"Export images"}),e.jsx(I,{variant:"outlined",startIcon:e.jsx(ce,{}),onClick:V,disabled:o.available===!1,sx:{display:{xs:"none",md:"inline-flex"}},children:"Schedule"}),e.jsx(B,{sx:{display:{xs:"none",md:"block"}},children:e.jsx(pe,{platforms:w,onPublish:F,busy:!!G,progress:E,disabled:!x.trim()||o.available===!1})})]})]}),e.jsxs(ee,{elevation:6,sx:{display:{xs:"flex",md:"none"},position:"fixed",left:8,right:8,bottom:"calc(72px + env(safe-area-inset-bottom))",zIndex:15,p:1,gap:1,borderRadius:3,"& > *":{flex:1}},children:[e.jsx(I,{variant:"outlined",startIcon:e.jsx(ce,{}),onClick:V,disabled:o.available===!1,children:"Schedule"}),e.jsx(pe,{platforms:w,onPublish:F,busy:!!G,progress:E,disabled:!x.trim()||o.available===!1})]}),e.jsxs(at,{children:[e.jsxs(lt,{children:[e.jsxs(ee,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:.5,children:[e.jsx(y,{variant:"h3",children:"Carousel"}),e.jsxs(y,{variant:"caption",color:"text.secondary",children:[O.filter(i=>i.on).length," slide",O.filter(i=>i.on).length===1?"":"s"," · click to include / exclude"]})]}),e.jsx(y,{variant:"body2",color:"text.secondary",mb:1.5,children:"Posts go out in this order. The extra photo (e.g. the bag being worn) is saved for this bag and used in all its posts."}),e.jsx(S,{direction:"row",spacing:1.5,children:O.map(i=>e.jsxs(B,{sx:{flex:1,minWidth:0},children:[e.jsx(B,{onClick:i.src?i.toggle:()=>{var p;return(p=P.current)==null?void 0:p.click()},sx:{aspectRatio:`${t.livePreview.w} / ${t.livePreview.h}`,bgcolor:i.photo?"action.hover":t.bgColor,borderRadius:2,border:2,borderStyle:i.src?"solid":"dashed",borderColor:i.on?"success.main":"divider",display:"grid",placeItems:"center",overflow:"hidden",cursor:"pointer",opacity:i.src&&!i.on?.4:1,transition:"opacity .15s, border-color .15s"},children:i.src?e.jsx("img",{src:i.src,alt:i.label,style:i.photo?{width:"100%",height:"100%",objectFit:"cover"}:{maxWidth:`${t.bagScale*90}%`,maxHeight:`${t.bagScale*90}%`,objectFit:"contain"}}):e.jsxs(S,{alignItems:"center",spacing:.5,sx:{color:"text.secondary",p:1,textAlign:"center"},children:[e.jsx(ye,{}),e.jsx(y,{variant:"caption",children:"Add photo"})]})}),e.jsxs(S,{direction:"row",alignItems:"center",justifyContent:"space-between",mt:.5,children:[e.jsx(y,{variant:"caption",fontWeight:600,noWrap:!0,children:i.label}),i.photo&&i.src&&e.jsxs(S,{direction:"row",children:[e.jsx(I,{size:"small",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>{var p;return(p=P.current)==null?void 0:p.click()},children:"Change"}),e.jsx(I,{size:"small",color:"inherit",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>confirm("Remove the extra photo for this bag?")&&$e(o.id),children:"Remove"})]})]})]},i.key))}),e.jsx("input",{ref:P,type:"file",accept:"image/*",hidden:!0,onChange:X})]}),e.jsxs(ee,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:1.5,gap:1,flexWrap:"wrap",children:[e.jsx(y,{variant:"h3",children:"Caption"}),e.jsx(he,{size:"small",exclusive:!0,value:m,onChange:(i,p)=>p&&l(p),children:Le.map(i=>e.jsx(xe,{value:i.id,sx:{px:1.25,py:.4},children:i.label},i.id))}),e.jsx(he,{size:"small",exclusive:!0,value:n,onChange:(i,p)=>p&&f(p),children:De.map(i=>e.jsx(xe,{value:i.id,sx:{px:1.25,py:.4},children:i.label},i.id))})]}),e.jsx(qe,{sx:{mb:.5},control:e.jsx(Qe,{size:"small",checked:v,onChange:i=>J(i.target.checked)}),label:e.jsx(y,{variant:"body2",children:"Mention material (fabric)"})}),e.jsx(Je,{value:x,onChange:i=>u(i.target.value),multiline:!0,minRows:6,fullWidth:!0,size:"small"}),e.jsxs(S,{direction:"row",gap:1,mt:1.5,flexWrap:"wrap",alignItems:"center",children:[Me.map(i=>{const p=w.includes(i.id),j=de({platforms:[i.id]},R).length>0;return e.jsx(Y,{size:"small",label:`${i.label}${j?" ⚡":""}`,...W(i.id,p),onClick:()=>K(p?w.filter(_=>_!==i.id):[...w,i.id])},i.id)}),e.jsx(y,{variant:"caption",color:"text.secondary",children:"⚡ = publishes automatically"})]}),e.jsxs(S,{direction:"row",spacing:1,mt:1.5,children:[e.jsx(I,{size:"small",variant:"outlined",startIcon:e.jsx(Te,{}),onClick:()=>Ue(x).then(()=>g.toast("Caption copied"),()=>g.toast("Copy failed")),children:"Copy"}),e.jsx(I,{size:"small",onClick:()=>u(ge(o,n,r,m,v)),children:"Reset"}),e.jsx(B,{flex:1}),e.jsxs(y,{variant:"caption",color:"text.secondary",alignSelf:"center",children:[x.length,"/2200"]})]})]}),e.jsx(Ct,{resolutionDirectory:t.resolutionDirectory,checkedSizes:t.checkedSizes,previewSizeId:t.previewSizeId,customW:t.customW,customH:t.customH,sides:t.sides,onToggleSize:t.toggleSizeCheckbox,onSetPreviewSize:t.setPreviewSizeId,onSetCustomW:t.setCustomW,onSetCustomH:t.setCustomH,onSetSides:t.setSides}),e.jsx(kt,{isTransparent:t.isTransparent,bgColor:t.bgColor,defaultBgColor:o.backgroundColor,onTransparentToggle:t.handleTransparentToggle,onBgColorChange:t.setBgColor,onResetBgColor:()=>t.setBgColor(o.backgroundColor??"#ffffff")}),e.jsx(Pt,{bagScale:t.bagScale,format:t.format,isTransparent:t.isTransparent,onScaleChange:t.setBagScale,onFormatChange:t.setFormat}),e.jsx(wt,{suggestedBag:t.suggestedBag,suggestionStats:t.suggestionStats,showSuggestion:t.showSuggestion,getBagThumbnail:t.getBagThumbnail,onSuggest:t.handleGetSuggestion,onReset:t.handleResetHistory,onViewSuggestion:t.handleViewSuggestion})]}),e.jsx(It,{previewSide:t.previewSide,livePreview:t.livePreview,bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,previewImgSrc:t.previewImgSrc,onSideChange:t.setPreviewSide})]}),e.jsx(B,{sx:{display:{xs:"block",md:"none"},height:72}})]})};export{es as ItemStudio};
