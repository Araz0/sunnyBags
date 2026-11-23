import{i as fe,j as e,f as B,h as Ce,R as d,v as ke,A as h,B as Pe}from"./index-92f28a8c.js";import{b as Ie,a as ze,d as Te}from"./OpenInNew-4e3354e0.js";import{d as le}from"./Event-393314be.js";import{r as be,b as Re,d as Ee,B as C,s as _e}from"./context-419ca5a8.js";import{k as Be,a as Ae,u as Ne,b as ce,n as $e,o as Oe,q as We}from"./publish-b4eb8807.js";import{k as Fe,n as de,S,T as j,x as ge,q as _,C as V,a5 as He,K as Ge,P as Z,L as Le,v as De,r as Me,E as Ue,A as Ve}from"./bits-44669b27.js";import{u as Ye,P as ue}from"./PublishNowButton-06ee233c.js";import{T as pe,a as he}from"./ToggleButtonGroup-57612bda.js";import{T as qe}from"./TextField-ac2ea0ab.js";import"./Menu-7a0154ad.js";var te={},Qe=fe;Object.defineProperty(te,"__esModule",{value:!0});var ve=te.default=void 0,Je=Qe(be()),Ke=e;ve=te.default=(0,Je.default)((0,Ke.jsx)("path",{d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z"}),"FileDownloadOutlined");let y=[];const k={CATEGORY_VARIETY:15,PRICE_RANGE:10,FABRIC_UNIQUENESS:8,DISCOUNT:12,CATEGORY_POPULARITY:5,SESSION_ROTATION:20,RECENCY_PENALTY:-3,DESCRIPTION_LENGTH:2,COLOR_VARIETY:7},Xe=()=>B.all.filter(s=>s.available!==!1),Ze=s=>["red","blue","green","yellow","purple","pink","orange","black","white","brown","gray","gold","silver","teal","navy","indigo","emerald","crimson","amber","ochre","lavender","mint","olive","burgundy"].filter(a=>s.toLowerCase().includes(a)),et=(s,t,a)=>{var u,m;let n=0;t.has(s.category_id)||(n+=k.CATEGORY_VARIETY);const g=Math.floor(s.finalPrice/5)*5;if(a.has(g)||(n+=k.PRICE_RANGE),s.discount>0&&(n+=k.DISCOUNT+s.discount/10),(((u=s.fabric)==null?void 0:u.split(/[,& ]/).filter(l=>l.trim().length>0))||[]).length>1&&(n+=k.FABRIC_UNIQUENESS),B.all.filter(l=>l.category_id===s.category_id).length>5&&(n+=k.CATEGORY_POPULARITY),(((m=s.description)==null?void 0:m.length)||0)>150&&(n+=k.DESCRIPTION_LENGTH),Ze(s.description||"").length>2&&(n+=k.COLOR_VARIETY),y.length>5){const l=y.slice(-5);if(!l.includes(s.id))n+=k.SESSION_ROTATION;else{const v=l.lastIndexOf(s.id);v!==-1&&(n+=k.RECENCY_PENALTY*(5-v))}}return n};function tt(){const s=Xe();if(s.length===0)return null;const t=new Set,a=new Set;y.slice(-5).forEach(u=>{const m=s.find(l=>l.id===u);if(m){t.add(m.category_id);const l=Math.floor(m.finalPrice/5)*5;a.add(l)}});const g=s.map(u=>({bag:u,score:et(u,t,a)}));g.sort((u,m)=>m.score-u.score);const o=g.slice(0,Math.min(5,g.length)),r=o.reduce((u,m)=>u+m.score,0);let f=Math.random()*r,x=null;for(const u of o)if(f-=u.score,f<=0){x=u.bag;break}return!x&&o.length>0&&(x=o[0].bag),x&&(y.push(x.id),y.length>50&&(y=y.slice(-50))),x}function st(){y=[]}function xe(){const s=B.all.filter(r=>y.includes(r.id)),t=new Set(s.map(r=>r.category_id)),a=new Map;s.forEach(r=>{const f=a.get(r.category_id)||0;a.set(r.category_id,f+1)});let n=null,g=0;a.forEach((r,f)=>{r>g&&(g=r,n=f)});const o=s.length>0?s.reduce((r,f)=>r+f.finalPrice,0)/s.length:0;return{totalSuggestions:y.length,uniqueCategoriesSuggested:t.size,mostSuggestedCategory:n,averagePrice:o}}const ot=s=>{const t=Ce(),[a,n]=d.useState(()=>B.all.find(c=>c.id===Number(s)));d.useEffect(()=>{const c=B.all.find(b=>b.id===Number(s));c&&(n(c),c.backgroundColor&&o(c.backgroundColor))},[s]);const[g,o]=d.useState("#ffffff"),[r,f]=d.useState(null),[x,u]=d.useState(null),[m,l]=d.useState(!1),[v,Q]=d.useState(1),[A,J]=d.useState(!1),[N,$]=d.useState("image/jpeg"),[O,H]=d.useState("A"),[R,G]=d.useState("insta_feed"),[w,L]=d.useState(()=>Number(localStorage.getItem("studio_custom_w"))||1200),[P,D]=d.useState(()=>Number(localStorage.getItem("studio_custom_h"))||1200),[W,K]=d.useState({insta_feed:!0}),[E,M]=d.useState({front:!0,back:!0});d.useEffect(()=>{localStorage.setItem("studio_custom_w",w.toString()),localStorage.setItem("studio_custom_h",P.toString())},[w,P]);const[X,U]=d.useState(null),[i,p]=d.useState(null),[I,z]=d.useState(!1),F=d.useMemo(()=>[{id:"insta_feed",w:1080,h:1350,name:"Instagram Feed (4:5)"},{id:"insta_story",w:1080,h:1920,name:"Story / Reel (9:16)"},{id:"square_post",w:1080,h:1080,name:"Square Grid (1:1)"},{id:"pin",w:1e3,h:1500,name:"Pinterest Pin (2:3)"},{id:"hq_print",w:2160,h:2700,name:"Ultra High-Res (4:5)"},{id:"custom_frame",w,h:P,name:"Custom"}],[w,P]),ye=d.useMemo(()=>F.find(c=>c.id===R)??F[0],[R,F]),ie=(a==null?void 0:a.category_id.toString().padStart(4,"0"))??"0000",we=a?`/gallery/images/${ie}/${a.id}${O}.png`:"";return{currentItem:a,navigate:t,paddedCategoryId:ie,previewImgSrc:we,getBagThumbnail:c=>{const b=ke.find(T=>T.id===c.category_id);return`/gallery/thumbnails/${((b==null?void 0:b.id)??0).toString().padStart(4,"0")}/${c.id}A.png`},bgColor:g,setBgColor:o,patternIndex:r,invertPattern:m,setInvertPattern:l,bagScale:v,setBagScale:Q,isTransparent:A,format:N,setFormat:$,customPattern:x,previewSide:O,setPreviewSide:H,previewSizeId:R,setPreviewSizeId:G,livePreview:ye,customW:w,setCustomW:L,customH:P,setCustomH:D,checkedSizes:W,sides:E,setSides:M,resolutionDirectory:F,suggestedBag:X,suggestionStats:i,showSuggestion:I,handleTransparentToggle:c=>{J(c),c&&N==="image/jpeg"&&$("image/png")},handleCustomPatternUpload:c=>{var ne;const b=(ne=c.target.files)==null?void 0:ne[0];if(!b)return;const T=new FileReader;T.onload=re=>{var ae;(ae=re.target)!=null&&ae.result&&(f(null),u(re.target.result))},T.readAsDataURL(b)},clearPattern:()=>{f(null),u(null)},selectPresetPattern:c=>{u(null),f(c)},toggleSizeCheckbox:(c,b)=>K(T=>({...T,[c]:b})),handleGetSuggestion:()=>{const c=tt();if(!c){alert("No unsold items available!");return}U(c),z(!0),p(xe())},handleResetHistory:()=>{st(),p(xe()),z(!1)},handleViewSuggestion:c=>{const b=B.all.find(T=>T.id===c);b&&(n(b),b.backgroundColor&&o(b.backgroundColor),t(`/item/${c}/studio`,{replace:!0}),z(!1))},handleExport:async()=>{if(!a)return;const c=F.filter(b=>W[b.id]);if(!c.length){alert("Select at least one export size.");return}await Be({item:a,bgColor:g,isTransparent:A,bagScale:v,format:N,sides:E,targets:c})}}},it=h.div`
  color: var(--text);
`,nt=h.div`
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
`;const rt=h.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 900px) {
    grid-row: 2;
  }
`,at=h.div`
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
`,Y=h.div`
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
`,q=h.p`
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
`,Se=h.p`
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
`,lt=h.button`
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
`,ct=h(lt)`
  background: var(--ok);
  &:hover {
    background: var(--ok-hover);
  }
`,se=h.button`
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
`;h(se)`
  font-weight: 700;
`;const dt=`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23fff"/><rect y="10" width="10" height="10" fill="%23fff"/></svg>')`,gt=h.div`
  position: relative;
  width: 100%;
  max-width: ${s=>s.w/s.h*500}px;
  aspect-ratio: ${s=>s.w} / ${s=>s.h};
  background: ${s=>s.transparent?dt:s.bg};
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
`,ut=h.img`
  max-width: ${s=>s.scale*100}%;
  max-height: ${s=>s.scale*100}%;
  object-fit: contain;
  z-index: 2;
  position: relative;
`,pt=h.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`,me=h.button`
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
`,ht=h.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,xt=h.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
`,mt=h.div`
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
`,ft=h.div`
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`,ee=h.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`,bt=h.div`
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
`,vt=h.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`,St=h.div`
  border-top: 1px solid var(--border);
  margin: 4px 0;
`,jt=({suggestedBag:s,suggestionStats:t,showSuggestion:a,getBagThumbnail:n,onSuggest:g,onReset:o,onViewSuggestion:r})=>{var f,x;return e.jsxs(Y,{children:[e.jsx(q,{children:"🎯 Suggestion Engine"}),e.jsx(Se,{children:"Recommends bags based on variety, price, and availability."}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(ct,{onClick:g,style:{flex:2},children:"✨ Suggest a Bag"}),e.jsx(se,{onClick:o,style:{flex:1},children:"Reset History"})]}),t&&e.jsxs(ft,{children:[e.jsxs("span",{children:["📊 Total: ",t.totalSuggestions]}),e.jsxs("span",{children:["🏷️ Categories: ",t.uniqueCategoriesSuggested]}),e.jsxs("span",{children:["💰 Avg: $",t.averagePrice.toFixed(2)]})]}),a&&s&&e.jsxs(mt,{children:[e.jsxs("h3",{children:["🎁 Suggested — Bag #",s.id]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",margin:"8px 0"},children:e.jsx("img",{src:n(s),alt:`Bag ${s.id}`,style:{maxHeight:140,borderRadius:4,border:"1px solid var(--border)",objectFit:"contain"},onError:u=>{u.target.style.display="none"}})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Category:"})," ",s.category]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Price:"})," ",e.jsxs("span",{style:{fontWeight:700,color:"var(--accent)"},children:["$",(f=s.finalPrice)==null?void 0:f.toFixed(2)]})]}),s.discount>0&&e.jsxs("p",{children:[e.jsx("strong",{children:"Discount:"})," ",s.discount,"% off"]}),e.jsxs("p",{style:{fontSize:"0.82rem",opacity:.8},children:[(x=s.description)==null?void 0:x.substring(0,100),"…"]}),e.jsx("button",{onClick:()=>r(s.id),style:{background:"none",border:"none",padding:0,color:"var(--accent)",textDecoration:"underline",cursor:"pointer",fontSize:"0.9rem",marginTop:8},children:"Open this bag →"})]})]})},yt=({resolutionDirectory:s,checkedSizes:t,previewSizeId:a,customW:n,customH:g,sides:o,onToggleSize:r,onSetPreviewSize:f,onSetCustomW:x,onSetCustomH:u,onSetSides:m})=>e.jsxs(Y,{children:[e.jsx(q,{children:"Export Sizes & Preview Frame"}),e.jsx(Se,{children:"☑ to include in export. ○ to use as the live preview resolution."}),e.jsx(ht,{children:s.map(l=>e.jsxs(xt,{children:[e.jsx("input",{type:"checkbox",checked:!!t[l.id],onChange:v=>r(l.id,v.target.checked),title:"Include in export"}),e.jsx("input",{type:"radio",name:"previewSizeSelector",checked:a===l.id,onChange:()=>f(l.id),title:"Show in preview"}),e.jsxs("span",{style:{fontSize:"0.88rem"},children:[e.jsx("strong",{children:l.name})," ",e.jsxs("span",{style:{opacity:.55},children:["(",l.w,"×",l.h,"px)"]})]})]},l.id))}),e.jsxs(vt,{style:{marginTop:4},children:[e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Width (px)"}),e.jsx("input",{type:"number",value:n,onChange:l=>x(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Height (px)"}),e.jsx("input",{type:"number",value:g,onChange:l=>u(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]})]}),e.jsx(St,{}),e.jsxs("div",{style:{display:"flex",gap:20},children:[e.jsxs(ee,{children:[e.jsx("input",{type:"checkbox",checked:o.front,onChange:l=>m({...o,front:l.target.checked})}),"Export Front"]}),e.jsxs(ee,{children:[e.jsx("input",{type:"checkbox",checked:o.back,onChange:l=>m({...o,back:l.target.checked})}),"Export Back"]})]})]}),wt=({isTransparent:s,bgColor:t,defaultBgColor:a,onTransparentToggle:n,onBgColorChange:g,onResetBgColor:o})=>e.jsxs(Y,{children:[e.jsx(q,{children:"Background"}),e.jsxs(ee,{style:{color:"var(--accent)"},children:[e.jsx("input",{type:"checkbox",checked:s,onChange:r=>n(r.target.checked)}),"Transparent background (PNG/WebP only)"]}),!s&&e.jsx(e.Fragment,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("input",{type:"color",value:t,onChange:r=>g(r.target.value),style:{width:48,height:38,padding:0,cursor:"pointer",border:"none"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{style:{fontSize:"0.88rem"},children:"Canvas fill color"}),a&&e.jsx(se,{onClick:o,type:"button",children:"Reset to bag default"})]})]})})]}),Ct=({bagScale:s,format:t,isTransparent:a,onScaleChange:n,onFormatChange:g})=>e.jsxs(Y,{children:[e.jsx(q,{children:"Composition & Output"}),e.jsxs(bt,{children:[e.jsxs("div",{className:"label-row",children:[e.jsx("span",{children:"Bag size"}),e.jsxs("strong",{children:[Math.round(s*100),"% of canvas"]})]}),e.jsx("input",{type:"range",min:"0.20",max:"2.00",step:"0.02",value:s,onChange:o=>n(parseFloat(o.target.value))})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.88rem",display:"block",marginBottom:4,fontWeight:600},children:"File format"}),e.jsxs("select",{value:t,onChange:o=>g(o.target.value),style:{width:"100%"},children:[!a&&e.jsx("option",{value:"image/jpeg",children:"JPEG"}),e.jsx("option",{value:"image/png",children:"PNG (lossless)"}),e.jsx("option",{value:"image/webp",children:"WebP"})]})]})]}),kt=({previewSide:s,livePreview:t,bgColor:a,isTransparent:n,bagScale:g,previewImgSrc:o,onSideChange:r})=>e.jsxs(at,{children:[e.jsxs(pt,{children:[e.jsx(me,{active:s==="A",onClick:()=>r("A"),type:"button",children:"Front"}),e.jsx(me,{active:s==="B",onClick:()=>r("B"),type:"button",children:"Back"})]}),e.jsx(gt,{w:t.w,h:t.h,bg:a,transparent:n,children:e.jsx(ut,{src:o,scale:g,alt:"Preview"})}),e.jsxs("p",{style:{marginTop:12,fontSize:"0.82rem",opacity:.55,textAlign:"center",lineHeight:1.5},children:[t.name," · ",t.w,"×",t.h,"px"]})]});var oe={},Pt=fe;Object.defineProperty(oe,"__esModule",{value:!0});var je=oe.default=void 0,It=Pt(be()),zt=e;je=oe.default=(0,It.default)((0,zt.jsx)("path",{d:"M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4z"}),"AddPhotoAlternateOutlined");const Qt=()=>{const{itemId:s}=Pe(),t=ot(s),{posts:a,settings:n}=Re(),g=Ee(),o=t.currentItem,[r,f]=d.useState(n.captionTone),[x,u]=d.useState(""),[m,l]=d.useState(n.captionLanguage),[v,Q]=d.useState(n.defaultPlatforms),A=Ae(),J=Fe(),{publishNow:N,busyId:$,progress:O}=Ye(),H=Ne(o==null?void 0:o.id),[R,G]=d.useState(!0),w=d.useRef(null);if(d.useEffect(()=>{o&&u(de(o,r,n,m))},[o==null?void 0:o.id,r,m]),!o)return e.jsxs(S,{spacing:2,alignItems:"flex-start",children:[e.jsx(j,{variant:"h1",children:"Bag not found"}),e.jsx(C,{startIcon:e.jsx(Ie,{}),onClick:()=>t.navigate("/studio/library"),children:"Back to library"})]});const L=a.filter(i=>i.bagId===o.id),P=L.filter(i=>i.status==="posted").length,D=L.filter(i=>i.status==="scheduled").sort((i,p)=>i.scheduledAt.localeCompare(p.scheduledAt))[0],W=()=>({sizeId:t.livePreview.id,sizeName:t.livePreview.name,w:t.livePreview.w,h:t.livePreview.h,side:t.sides.front&&t.sides.back?"both":t.sides.back?"B":"A",bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,format:t.format,includeExtra:R}),K=async i=>{var I;const p=(I=i.target.files)==null?void 0:I[0];if(i.target.value="",!!p)try{Oe(o.id,await We(p)),G(!0),g.toast("Extra photo saved. It will be the last slide of this bag’s posts.")}catch(z){g.toast(z.name==="QuotaExceededError"?"Browser storage is full. Remove extra photos from other bags.":z.message)}},E=[{key:"A",label:"1 · Front",src:ge(o,"A"),on:t.sides.front,toggle:()=>t.setSides({...t.sides,front:!t.sides.front||!t.sides.back})},{key:"B",label:"2 · Back",src:ge(o,"B"),on:t.sides.back,toggle:()=>t.setSides({...t.sides,back:!t.sides.back||!t.sides.front})},{key:"X",label:"3 · Extra photo",src:H,on:!!H&&R,toggle:()=>G(!R),photo:!0}],M=()=>g.openEditor({bagId:o.id,design:W(),caption:x}),X=ce({platforms:v},A),U=async()=>{const i=X.map(I=>Ve(I).label).join(" + ");if(!confirm(`Publish Bag #${o.id} to ${i} now with this design and caption?`))return;const p=_e.addPost({bagId:o.id,scheduledAt:new Date().toISOString(),platforms:v,caption:x,status:"scheduled",design:W(),auto:!1,language:m});await N(p.id,{confirm:!1})};return e.jsxs(it,{children:[e.jsxs(S,{direction:{xs:"column",md:"row"},justifyContent:"space-between",alignItems:{xs:"flex-start",md:"center"},gap:2,mb:3,children:[e.jsxs(_,{children:[e.jsxs(S,{direction:"row",alignItems:"center",spacing:1,flexWrap:"wrap",useFlexGap:!0,children:[e.jsxs(j,{variant:"h1",children:["Bag #",o.id]}),e.jsx(V,{size:"small",label:o.category}),e.jsx(V,{size:"small",variant:"outlined",label:He(o)}),o.available===!1&&e.jsx(V,{size:"small",color:"default",label:"Sold"})]}),e.jsxs(j,{color:"text.secondary",mt:.5,variant:"body2",children:[P?`Posted ${P}×`:"Never posted",D?` · next post ${Ge(D.scheduledAt)}`:""]})]}),e.jsxs(S,{direction:"row",gap:1,flexWrap:"wrap",children:[e.jsx(C,{color:"inherit",startIcon:e.jsx(ze,{}),onClick:()=>t.navigate(`/item/${o.id}`),children:"Shop page"}),e.jsx(C,{variant:"outlined",startIcon:e.jsx(ve,{}),onClick:t.handleExport,children:"Export images"}),e.jsx(C,{variant:"outlined",startIcon:e.jsx(le,{}),onClick:M,disabled:o.available===!1,sx:{display:{xs:"none",md:"inline-flex"}},children:"Schedule"}),e.jsx(_,{sx:{display:{xs:"none",md:"block"}},children:e.jsx(ue,{platforms:v,onPublish:U,busy:!!$,progress:O,disabled:!x.trim()||o.available===!1})})]})]}),e.jsxs(Z,{elevation:6,sx:{display:{xs:"flex",md:"none"},position:"fixed",left:8,right:8,bottom:"calc(72px + env(safe-area-inset-bottom))",zIndex:15,p:1,gap:1,borderRadius:3,"& > *":{flex:1}},children:[e.jsx(C,{variant:"outlined",startIcon:e.jsx(le,{}),onClick:M,disabled:o.available===!1,children:"Schedule"}),e.jsx(ue,{platforms:v,onPublish:U,busy:!!$,progress:O,disabled:!x.trim()||o.available===!1})]}),e.jsxs(nt,{children:[e.jsxs(rt,{children:[e.jsxs(Z,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:.5,children:[e.jsx(j,{variant:"h3",children:"Carousel"}),e.jsxs(j,{variant:"caption",color:"text.secondary",children:[E.filter(i=>i.on).length," slide",E.filter(i=>i.on).length===1?"":"s"," · click to include / exclude"]})]}),e.jsx(j,{variant:"body2",color:"text.secondary",mb:1.5,children:"Posts go out in this order. The extra photo (e.g. the bag being worn) is saved for this bag and used in all its posts."}),e.jsx(S,{direction:"row",spacing:1.5,children:E.map(i=>e.jsxs(_,{sx:{flex:1,minWidth:0},children:[e.jsx(_,{onClick:i.src?i.toggle:()=>{var p;return(p=w.current)==null?void 0:p.click()},sx:{aspectRatio:`${t.livePreview.w} / ${t.livePreview.h}`,bgcolor:i.photo?"action.hover":t.bgColor,borderRadius:2,border:2,borderStyle:i.src?"solid":"dashed",borderColor:i.on?"success.main":"divider",display:"grid",placeItems:"center",overflow:"hidden",cursor:"pointer",opacity:i.src&&!i.on?.4:1,transition:"opacity .15s, border-color .15s"},children:i.src?e.jsx("img",{src:i.src,alt:i.label,style:i.photo?{width:"100%",height:"100%",objectFit:"cover"}:{maxWidth:`${t.bagScale*90}%`,maxHeight:`${t.bagScale*90}%`,objectFit:"contain"}}):e.jsxs(S,{alignItems:"center",spacing:.5,sx:{color:"text.secondary",p:1,textAlign:"center"},children:[e.jsx(je,{}),e.jsx(j,{variant:"caption",children:"Add photo"})]})}),e.jsxs(S,{direction:"row",alignItems:"center",justifyContent:"space-between",mt:.5,children:[e.jsx(j,{variant:"caption",fontWeight:600,noWrap:!0,children:i.label}),i.photo&&i.src&&e.jsxs(S,{direction:"row",children:[e.jsx(C,{size:"small",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>{var p;return(p=w.current)==null?void 0:p.click()},children:"Change"}),e.jsx(C,{size:"small",color:"inherit",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>confirm("Remove the extra photo for this bag?")&&$e(o.id),children:"Remove"})]})]})]},i.key))}),e.jsx("input",{ref:w,type:"file",accept:"image/*",hidden:!0,onChange:K})]}),e.jsxs(Z,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:1.5,gap:1,flexWrap:"wrap",children:[e.jsx(j,{variant:"h3",children:"Caption"}),e.jsx(pe,{size:"small",exclusive:!0,value:m,onChange:(i,p)=>p&&l(p),children:Le.map(i=>e.jsx(he,{value:i.id,sx:{px:1.25,py:.4},children:i.label},i.id))}),e.jsx(pe,{size:"small",exclusive:!0,value:r,onChange:(i,p)=>p&&f(p),children:De.map(i=>e.jsx(he,{value:i.id,sx:{px:1.25,py:.4},children:i.label},i.id))})]}),e.jsx(qe,{value:x,onChange:i=>u(i.target.value),multiline:!0,minRows:6,fullWidth:!0,size:"small"}),e.jsxs(S,{direction:"row",gap:1,mt:1.5,flexWrap:"wrap",alignItems:"center",children:[Me.map(i=>{const p=v.includes(i.id),I=ce({platforms:[i.id]},A).length>0;return e.jsx(V,{size:"small",label:`${i.label}${I?" ⚡":""}`,...J(i.id,p),onClick:()=>Q(p?v.filter(z=>z!==i.id):[...v,i.id])},i.id)}),e.jsx(j,{variant:"caption",color:"text.secondary",children:"⚡ = publishes automatically"})]}),e.jsxs(S,{direction:"row",spacing:1,mt:1.5,children:[e.jsx(C,{size:"small",variant:"outlined",startIcon:e.jsx(Te,{}),onClick:()=>Ue(x).then(()=>g.toast("Caption copied"),()=>g.toast("Copy failed")),children:"Copy"}),e.jsx(C,{size:"small",onClick:()=>u(de(o,r,n,m)),children:"Reset"}),e.jsx(_,{flex:1}),e.jsxs(j,{variant:"caption",color:"text.secondary",alignSelf:"center",children:[x.length,"/2200"]})]})]}),e.jsx(yt,{resolutionDirectory:t.resolutionDirectory,checkedSizes:t.checkedSizes,previewSizeId:t.previewSizeId,customW:t.customW,customH:t.customH,sides:t.sides,onToggleSize:t.toggleSizeCheckbox,onSetPreviewSize:t.setPreviewSizeId,onSetCustomW:t.setCustomW,onSetCustomH:t.setCustomH,onSetSides:t.setSides}),e.jsx(wt,{isTransparent:t.isTransparent,bgColor:t.bgColor,defaultBgColor:o.backgroundColor,onTransparentToggle:t.handleTransparentToggle,onBgColorChange:t.setBgColor,onResetBgColor:()=>t.setBgColor(o.backgroundColor??"#ffffff")}),e.jsx(Ct,{bagScale:t.bagScale,format:t.format,isTransparent:t.isTransparent,onScaleChange:t.setBagScale,onFormatChange:t.setFormat}),e.jsx(jt,{suggestedBag:t.suggestedBag,suggestionStats:t.suggestionStats,showSuggestion:t.showSuggestion,getBagThumbnail:t.getBagThumbnail,onSuggest:t.handleGetSuggestion,onReset:t.handleResetHistory,onViewSuggestion:t.handleViewSuggestion})]}),e.jsx(kt,{previewSide:t.previewSide,livePreview:t.livePreview,bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,previewImgSrc:t.previewImgSrc,onSideChange:t.setPreviewSide})]}),e.jsx(_,{sx:{display:{xs:"block",md:"none"},height:72}})]})};export{Qt as ItemStudio};
