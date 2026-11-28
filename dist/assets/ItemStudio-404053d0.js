import{i as Se,j as e,f as N,k as ke,R as c,w as Pe,B as h,C as Ie,g as ze,D as Te}from"./index-95e1507a.js";import{b as Re,a as Ee,d as _e}from"./OpenInNew-41b1d75d.js";import{d as ge}from"./Event-86211efa.js";import{r as je,b as Be,d as Ae,B as P,s as Ne}from"./context-5b9bcba6.js";import{n as $e,a as Oe,u as Fe,b as ue,o as We,q as De,v as Ge}from"./publish-bebbe3fb.js";import{k as He,n as pe,S,T as j,x as he,q as A,C as J,a6 as Le,K as Me,P as oe,L as Ue,v as Ve,r as Ye,E as qe,A as Qe}from"./bits-e092bb0c.js";import{u as Je,P as xe}from"./PublishNowButton-aa87473c.js";import{T as me,a as fe}from"./ToggleButtonGroup-6052aa89.js";import{F as Ke}from"./FormControlLabel-bd70c756.js";import{C as Xe}from"./Checkbox-243b03da.js";import{T as Ze}from"./TextField-f4aaaa6c.js";import"./SwitchBase-373724a6.js";import"./Menu-e8a2e635.js";var ne={},et=Se;Object.defineProperty(ne,"__esModule",{value:!0});var ye=ne.default=void 0,tt=et(je()),st=e;ye=ne.default=(0,tt.default)((0,st.jsx)("path",{d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z"}),"FileDownloadOutlined");let w=[];const I={CATEGORY_VARIETY:15,PRICE_RANGE:10,FABRIC_UNIQUENESS:8,DISCOUNT:12,CATEGORY_POPULARITY:5,SESSION_ROTATION:20,RECENCY_PENALTY:-3,DESCRIPTION_LENGTH:2,COLOR_VARIETY:7},ot=()=>N.all.filter(s=>s.available!==!1),it=s=>["red","blue","green","yellow","purple","pink","orange","black","white","brown","gray","gold","silver","teal","navy","indigo","emerald","crimson","amber","ochre","lavender","mint","olive","burgundy"].filter(a=>s.toLowerCase().includes(a)),nt=(s,t,a)=>{var u,m;let n=0;t.has(s.category_id)||(n+=I.CATEGORY_VARIETY);const g=Math.floor(s.finalPrice/5)*5;if(a.has(g)||(n+=I.PRICE_RANGE),s.discount>0&&(n+=I.DISCOUNT+s.discount/10),(((u=s.fabric)==null?void 0:u.split(/[,& ]/).filter(l=>l.trim().length>0))||[]).length>1&&(n+=I.FABRIC_UNIQUENESS),N.all.filter(l=>l.category_id===s.category_id).length>5&&(n+=I.CATEGORY_POPULARITY),(((m=s.description)==null?void 0:m.length)||0)>150&&(n+=I.DESCRIPTION_LENGTH),it(s.description||"").length>2&&(n+=I.COLOR_VARIETY),w.length>5){const l=w.slice(-5);if(!l.includes(s.id))n+=I.SESSION_ROTATION;else{const v=l.lastIndexOf(s.id);v!==-1&&(n+=I.RECENCY_PENALTY*(5-v))}}return n};function rt(){const s=ot();if(s.length===0)return null;const t=new Set,a=new Set;w.slice(-5).forEach(u=>{const m=s.find(l=>l.id===u);if(m){t.add(m.category_id);const l=Math.floor(m.finalPrice/5)*5;a.add(l)}});const g=s.map(u=>({bag:u,score:nt(u,t,a)}));g.sort((u,m)=>m.score-u.score);const i=g.slice(0,Math.min(5,g.length)),r=i.reduce((u,m)=>u+m.score,0);let f=Math.random()*r,x=null;for(const u of i)if(f-=u.score,f<=0){x=u.bag;break}return!x&&i.length>0&&(x=i[0].bag),x&&(w.push(x.id),w.length>50&&(w=w.slice(-50))),x}function at(){w=[]}function be(){const s=N.all.filter(r=>w.includes(r.id)),t=new Set(s.map(r=>r.category_id)),a=new Map;s.forEach(r=>{const f=a.get(r.category_id)||0;a.set(r.category_id,f+1)});let n=null,g=0;a.forEach((r,f)=>{r>g&&(g=r,n=f)});const i=s.length>0?s.reduce((r,f)=>r+f.finalPrice,0)/s.length:0;return{totalSuggestions:w.length,uniqueCategoriesSuggested:t.size,mostSuggestedCategory:n,averagePrice:i}}const lt=s=>{const t=ke(),[a,n]=c.useState(()=>N.all.find(d=>d.id===Number(s)));c.useEffect(()=>{const d=N.all.find(b=>b.id===Number(s));d&&(n(d),d.backgroundColor&&i(d.backgroundColor))},[s]);const[g,i]=c.useState("#ffffff"),[r,f]=c.useState(null),[x,u]=c.useState(null),[m,l]=c.useState(!1),[v,Z]=c.useState(1),[y,ee]=c.useState(!1),[E,G]=c.useState("image/jpeg"),[H,L]=c.useState("A"),[_,M]=c.useState("insta_feed"),[C,U]=c.useState(()=>Number(localStorage.getItem("studio_custom_w"))||1200),[k,te]=c.useState(()=>Number(localStorage.getItem("studio_custom_h"))||1200),[$,O]=c.useState({insta_feed:!0}),[F,V]=c.useState({front:!0,back:!0});c.useEffect(()=>{localStorage.setItem("studio_custom_w",C.toString()),localStorage.setItem("studio_custom_h",k.toString())},[C,k]);const[Y,q]=c.useState(null),[se,B]=c.useState(null),[Q,W]=c.useState(!1),z=c.useMemo(()=>[{id:"insta_feed",w:1080,h:1350,name:"Instagram Feed (4:5)"},{id:"insta_story",w:1080,h:1920,name:"Story / Reel (9:16)"},{id:"square_post",w:1080,h:1080,name:"Square Grid (1:1)"},{id:"pin",w:1e3,h:1500,name:"Pinterest Pin (2:3)"},{id:"hq_print",w:2160,h:2700,name:"Ultra High-Res (4:5)"},{id:"custom_frame",w:C,h:k,name:"Custom"}],[C,k]),o=c.useMemo(()=>z.find(d=>d.id===_)??z[0],[_,z]),p=(a==null?void 0:a.category_id.toString().padStart(4,"0"))??"0000",T=a?`/gallery/images/${p}/${a.id}${H}.png`:"";return{currentItem:a,navigate:t,paddedCategoryId:p,previewImgSrc:T,getBagThumbnail:d=>{const b=Pe.find(R=>R.id===d.category_id);return`/gallery/thumbnails/${((b==null?void 0:b.id)??0).toString().padStart(4,"0")}/${d.id}A.png`},bgColor:g,setBgColor:i,patternIndex:r,invertPattern:m,setInvertPattern:l,bagScale:v,setBagScale:Z,isTransparent:y,format:E,setFormat:G,customPattern:x,previewSide:H,setPreviewSide:L,previewSizeId:_,setPreviewSizeId:M,livePreview:o,customW:C,setCustomW:U,customH:k,setCustomH:te,checkedSizes:$,sides:F,setSides:V,resolutionDirectory:z,suggestedBag:Y,suggestionStats:se,showSuggestion:Q,handleTransparentToggle:d=>{ee(d),d&&E==="image/jpeg"&&G("image/png")},handleCustomPatternUpload:d=>{var le;const b=(le=d.target.files)==null?void 0:le[0];if(!b)return;const R=new FileReader;R.onload=ce=>{var de;(de=ce.target)!=null&&de.result&&(f(null),u(ce.target.result))},R.readAsDataURL(b)},clearPattern:()=>{f(null),u(null)},selectPresetPattern:d=>{u(null),f(d)},toggleSizeCheckbox:(d,b)=>O(R=>({...R,[d]:b})),handleGetSuggestion:()=>{const d=rt();if(!d){alert("No unsold items available!");return}q(d),W(!0),B(be())},handleResetHistory:()=>{at(),B(be()),W(!1)},handleViewSuggestion:d=>{const b=N.all.find(R=>R.id===d);b&&(n(b),b.backgroundColor&&i(b.backgroundColor),t(`/item/${d}/studio`,{replace:!0}),W(!1))},handleExport:async()=>{if(!a)return;const d=z.filter(b=>$[b.id]);if(!d.length){alert("Select at least one export size.");return}await $e({item:a,bgColor:g,isTransparent:y,bagScale:v,format:E,sides:F,targets:d})}}},ct=h.div`
  color: var(--text);
`,dt=h.div`
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
`;const gt=h.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 900px) {
    grid-row: 2;
  }
`,ut=h.div`
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
`,K=h.div`
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
`,X=h.p`
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
`,we=h.p`
  margin: 0;
  font-size: 0.82rem;
  color: var(--muted);
`,pt=h.button`
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
`,ht=h(pt)`
  background: var(--ok);
  &:hover {
    background: var(--ok-hover);
  }
`,re=h.button`
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
`;h(re)`
  font-weight: 700;
`;const xt=`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="10" height="10" fill="%23ccc"/><rect x="10" y="10" width="10" height="10" fill="%23ccc"/><rect x="10" width="10" height="10" fill="%23fff"/><rect y="10" width="10" height="10" fill="%23fff"/></svg>')`,mt=h.div`
  position: relative;
  width: 100%;
  max-width: ${s=>s.w/s.h*500}px;
  aspect-ratio: ${s=>s.w} / ${s=>s.h};
  background: ${s=>s.transparent?xt:s.bg};
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
`,ft=h.img`
  max-width: ${s=>s.scale*100}%;
  max-height: ${s=>s.scale*100}%;
  object-fit: contain;
  z-index: 2;
  position: relative;
`,bt=h.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-bottom: 16px;
`,ve=h.button`
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
`,vt=h.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,St=h.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
`,jt=h.div`
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
`,yt=h.div`
  font-size: 0.82rem;
  color: var(--muted);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
`,ie=h.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
`,wt=h.div`
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
`,Ct=h.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`,kt=h.div`
  border-top: 1px solid var(--border);
  margin: 4px 0;
`,Pt=({suggestedBag:s,suggestionStats:t,showSuggestion:a,getBagThumbnail:n,onSuggest:g,onReset:i,onViewSuggestion:r})=>{var f,x;return e.jsxs(K,{children:[e.jsx(X,{children:"🎯 Suggestion Engine"}),e.jsx(we,{children:"Recommends bags based on variety, price, and availability."}),e.jsxs("div",{style:{display:"flex",gap:10},children:[e.jsx(ht,{onClick:g,style:{flex:2},children:"✨ Suggest a Bag"}),e.jsx(re,{onClick:i,style:{flex:1},children:"Reset History"})]}),t&&e.jsxs(yt,{children:[e.jsxs("span",{children:["📊 Total: ",t.totalSuggestions]}),e.jsxs("span",{children:["🏷️ Categories: ",t.uniqueCategoriesSuggested]}),e.jsxs("span",{children:["💰 Avg: $",t.averagePrice.toFixed(2)]})]}),a&&s&&e.jsxs(jt,{children:[e.jsxs("h3",{children:["🎁 Suggested — Bag #",s.id]}),e.jsx("div",{style:{display:"flex",justifyContent:"center",margin:"8px 0"},children:e.jsx("img",{src:n(s),alt:`Bag ${s.id}`,style:{maxHeight:140,borderRadius:4,border:"1px solid var(--border)",objectFit:"contain"},onError:u=>{u.target.style.display="none"}})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Category:"})," ",s.category]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Price:"})," ",e.jsxs("span",{style:{fontWeight:700,color:"var(--accent)"},children:["$",(f=s.finalPrice)==null?void 0:f.toFixed(2)]})]}),s.discount>0&&e.jsxs("p",{children:[e.jsx("strong",{children:"Discount:"})," ",s.discount,"% off"]}),e.jsxs("p",{style:{fontSize:"0.82rem",opacity:.8},children:[(x=s.description)==null?void 0:x.substring(0,100),"…"]}),e.jsx("button",{onClick:()=>r(s.id),style:{background:"none",border:"none",padding:0,color:"var(--accent)",textDecoration:"underline",cursor:"pointer",fontSize:"0.9rem",marginTop:8},children:"Open this bag →"})]})]})},It=({resolutionDirectory:s,checkedSizes:t,previewSizeId:a,customW:n,customH:g,sides:i,onToggleSize:r,onSetPreviewSize:f,onSetCustomW:x,onSetCustomH:u,onSetSides:m})=>e.jsxs(K,{children:[e.jsx(X,{children:"Export Sizes & Preview Frame"}),e.jsx(we,{children:"☑ to include in export. ○ to use as the live preview resolution."}),e.jsx(vt,{children:s.map(l=>e.jsxs(St,{children:[e.jsx("input",{type:"checkbox",checked:!!t[l.id],onChange:v=>r(l.id,v.target.checked),title:"Include in export"}),e.jsx("input",{type:"radio",name:"previewSizeSelector",checked:a===l.id,onChange:()=>f(l.id),title:"Show in preview"}),e.jsxs("span",{style:{fontSize:"0.88rem"},children:[e.jsx("strong",{children:l.name})," ",e.jsxs("span",{style:{opacity:.55},children:["(",l.w,"×",l.h,"px)"]})]})]},l.id))}),e.jsxs(Ct,{style:{marginTop:4},children:[e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Width (px)"}),e.jsx("input",{type:"number",value:n,onChange:l=>x(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.8rem",display:"block",marginBottom:3},children:"Custom Height (px)"}),e.jsx("input",{type:"number",value:g,onChange:l=>u(Math.max(100,Number(l.target.value))),style:{width:"100%"}})]})]}),e.jsx(kt,{}),e.jsxs("div",{style:{display:"flex",gap:20},children:[e.jsxs(ie,{children:[e.jsx("input",{type:"checkbox",checked:i.front,onChange:l=>m({...i,front:l.target.checked})}),"Export Front"]}),e.jsxs(ie,{children:[e.jsx("input",{type:"checkbox",checked:i.back,onChange:l=>m({...i,back:l.target.checked})}),"Export Back"]})]})]}),zt=({isTransparent:s,bgColor:t,defaultBgColor:a,onTransparentToggle:n,onBgColorChange:g,onResetBgColor:i})=>e.jsxs(K,{children:[e.jsx(X,{children:"Background"}),e.jsxs(ie,{style:{color:"var(--accent)"},children:[e.jsx("input",{type:"checkbox",checked:s,onChange:r=>n(r.target.checked)}),"Transparent background (PNG/WebP only)"]}),!s&&e.jsx(e.Fragment,{children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("input",{type:"color",value:t,onChange:r=>g(r.target.value),style:{width:48,height:38,padding:0,cursor:"pointer",border:"none"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[e.jsx("span",{style:{fontSize:"0.88rem"},children:"Canvas fill color"}),a&&e.jsx(re,{onClick:i,type:"button",children:"Reset to bag default"})]})]})})]}),Tt=({bagScale:s,format:t,isTransparent:a,onScaleChange:n,onFormatChange:g})=>e.jsxs(K,{children:[e.jsx(X,{children:"Composition & Output"}),e.jsxs(wt,{children:[e.jsxs("div",{className:"label-row",children:[e.jsx("span",{children:"Bag size"}),e.jsxs("strong",{children:[Math.round(s*100),"% of canvas"]})]}),e.jsx("input",{type:"range",min:"0.20",max:"2.00",step:"0.02",value:s,onChange:i=>n(parseFloat(i.target.value))})]}),e.jsxs("div",{children:[e.jsx("label",{style:{fontSize:"0.88rem",display:"block",marginBottom:4,fontWeight:600},children:"File format"}),e.jsxs("select",{value:t,onChange:i=>g(i.target.value),style:{width:"100%"},children:[!a&&e.jsx("option",{value:"image/jpeg",children:"JPEG"}),e.jsx("option",{value:"image/png",children:"PNG (lossless)"}),e.jsx("option",{value:"image/webp",children:"WebP"})]})]})]}),Rt=({previewSide:s,livePreview:t,bgColor:a,isTransparent:n,bagScale:g,previewImgSrc:i,onSideChange:r})=>e.jsxs(ut,{children:[e.jsxs(bt,{children:[e.jsx(ve,{active:s==="A",onClick:()=>r("A"),type:"button",children:"Front"}),e.jsx(ve,{active:s==="B",onClick:()=>r("B"),type:"button",children:"Back"})]}),e.jsx(mt,{w:t.w,h:t.h,bg:a,transparent:n,children:e.jsx(ft,{src:i,scale:g,alt:"Preview"})}),e.jsxs("p",{style:{marginTop:12,fontSize:"0.82rem",opacity:.55,textAlign:"center",lineHeight:1.5},children:[t.name," · ",t.w,"×",t.h,"px"]})]});var ae={},Et=Se;Object.defineProperty(ae,"__esModule",{value:!0});var Ce=ae.default=void 0,_t=Et(je()),Bt=e;Ce=ae.default=(0,_t.default)((0,Bt.jsx)("path",{d:"M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4z"}),"AddPhotoAlternateOutlined");const ss=()=>{const{itemId:s}=Ie(),t=lt(s),{posts:a,settings:n}=Be(),g=Ae(),i=t.currentItem,[r,f]=c.useState(n.captionTone),[x,u]=c.useState(""),[m,l]=c.useState(n.captionLanguage),[v,Z]=c.useState(n.includeFabric),[y,ee]=c.useState(n.defaultPlatforms),E=Oe(),G=He(),{publishNow:H,busyId:L,progress:_}=Je(),M=Fe(i==null?void 0:i.id),[C,U]=c.useState(!0),[k,te]=c.useState(!0),$=i?ze(i):void 0,O=c.useRef(null);if(c.useEffect(()=>{i&&u(pe(i,r,n,m,v))},[i==null?void 0:i.id,r,m,v]),!i)return e.jsxs(S,{spacing:2,alignItems:"flex-start",children:[e.jsx(j,{variant:"h1",children:"Bag not found"}),e.jsx(P,{startIcon:e.jsx(Re,{}),onClick:()=>t.navigate("/studio/library"),children:"Back to library"})]});const F=a.filter(o=>o.bagId===i.id),V=F.filter(o=>o.status==="posted").length,Y=F.filter(o=>o.status==="scheduled").sort((o,p)=>o.scheduledAt.localeCompare(p.scheduledAt))[0],q=()=>({sizeId:t.livePreview.id,sizeName:t.livePreview.name,w:t.livePreview.w,h:t.livePreview.h,side:t.sides.front&&t.sides.back?"both":t.sides.back?"B":"A",bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,format:t.format,includeExtra:C,includeDimensions:k}),se=async o=>{var T;const p=(T=o.target.files)==null?void 0:T[0];if(o.target.value="",!!p)try{De(i.id,await Ge(p)),U(!0),g.toast("Extra photo saved. It will be the last slide of this bag’s posts.")}catch(D){g.toast(D.name==="QuotaExceededError"?"Browser storage is full. Remove extra photos from other bags.":D.message)}},B=[{key:"A",label:"Front",src:he(i,"A"),on:t.sides.front,toggle:()=>t.setSides({...t.sides,front:!t.sides.front||!t.sides.back})},{key:"B",label:"Back",src:he(i,"B"),on:t.sides.back,toggle:()=>t.setSides({...t.sides,back:!t.sides.back||!t.sides.front})},...$?[{key:"D",label:"Size",src:$,on:k,toggle:()=>te(!k),diagram:!0}]:[],{key:"X",label:"Extra photo",src:M,on:!!M&&C,toggle:()=>U(!C),photo:!0}].map((o,p)=>({...o,label:`${p+1} · ${o.label}`})),Q=()=>g.openEditor({bagId:i.id,design:q(),caption:x}),W=ue({platforms:y},E),z=async()=>{const o=W.map(T=>Qe(T).label).join(" + ");if(!confirm(`Publish Bag #${i.id} to ${o} now with this design and caption?`))return;const p=Ne.addPost({bagId:i.id,scheduledAt:new Date().toISOString(),platforms:y,caption:x,status:"scheduled",design:q(),auto:!1,language:m,includeFabric:v});await H(p.id,{confirm:!1})};return e.jsxs(ct,{children:[e.jsxs(S,{direction:{xs:"column",md:"row"},justifyContent:"space-between",alignItems:{xs:"flex-start",md:"center"},gap:2,mb:3,children:[e.jsxs(A,{children:[e.jsxs(S,{direction:"row",alignItems:"center",spacing:1,flexWrap:"wrap",useFlexGap:!0,children:[e.jsxs(j,{variant:"h1",children:["Bag #",i.id]}),e.jsx(J,{size:"small",label:i.category}),e.jsx(J,{size:"small",variant:"outlined",label:Le(i)}),i.available===!1&&e.jsx(J,{size:"small",color:"default",label:"Sold"})]}),e.jsxs(j,{color:"text.secondary",mt:.5,variant:"body2",children:[V?`Posted ${V}×`:"Never posted",Y?` · next post ${Me(Y.scheduledAt)}`:""]})]}),e.jsxs(S,{direction:"row",gap:1,flexWrap:"wrap",children:[e.jsx(P,{color:"inherit",startIcon:e.jsx(Ee,{}),onClick:()=>t.navigate(`/item/${i.id}`),children:"Shop page"}),e.jsx(P,{variant:"outlined",startIcon:e.jsx(ye,{}),onClick:t.handleExport,children:"Export images"}),e.jsx(P,{variant:"outlined",startIcon:e.jsx(ge,{}),onClick:Q,disabled:i.available===!1,sx:{display:{xs:"none",md:"inline-flex"}},children:"Schedule"}),e.jsx(A,{sx:{display:{xs:"none",md:"block"}},children:e.jsx(xe,{platforms:y,onPublish:z,busy:!!L,progress:_,disabled:!x.trim()||i.available===!1})})]})]}),e.jsxs(oe,{elevation:6,sx:{display:{xs:"flex",md:"none"},position:"fixed",left:8,right:8,bottom:"calc(72px + env(safe-area-inset-bottom))",zIndex:15,p:1,gap:1,borderRadius:3,"& > *":{flex:1}},children:[e.jsx(P,{variant:"outlined",startIcon:e.jsx(ge,{}),onClick:Q,disabled:i.available===!1,children:"Schedule"}),e.jsx(xe,{platforms:y,onPublish:z,busy:!!L,progress:_,disabled:!x.trim()||i.available===!1})]}),e.jsxs(dt,{children:[e.jsxs(gt,{children:[e.jsxs(oe,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:.5,children:[e.jsx(j,{variant:"h3",children:"Carousel"}),e.jsxs(j,{variant:"caption",color:"text.secondary",children:[B.filter(o=>o.on).length," slide",B.filter(o=>o.on).length===1?"":"s"," · click to include / exclude"]})]}),e.jsx(j,{variant:"body2",color:"text.secondary",mb:1.5,children:"Posts go out in this order. The size diagram helps buyers judge the bag's size. The extra photo (e.g. the bag being worn) is saved for this bag and used in all its posts."}),e.jsx(S,{direction:"row",spacing:1.5,children:B.map(o=>e.jsxs(A,{sx:{flex:1,minWidth:0},children:[e.jsx(A,{onClick:o.src?o.toggle:()=>{var p;return(p=O.current)==null?void 0:p.click()},sx:{aspectRatio:`${t.livePreview.w} / ${t.livePreview.h}`,bgcolor:o.photo?"action.hover":o.diagram?Te:t.bgColor,borderRadius:2,border:2,borderStyle:o.src?"solid":"dashed",borderColor:o.on?"success.main":"divider",display:"grid",placeItems:"center",overflow:"hidden",cursor:"pointer",opacity:o.src&&!o.on?.4:1,transition:"opacity .15s, border-color .15s"},children:o.src?e.jsx("img",{src:o.src,alt:o.label,style:o.photo?{width:"100%",height:"100%",objectFit:"cover"}:o.diagram?{width:"100%",height:"100%",objectFit:"contain"}:{maxWidth:`${t.bagScale*90}%`,maxHeight:`${t.bagScale*90}%`,objectFit:"contain"}}):e.jsxs(S,{alignItems:"center",spacing:.5,sx:{color:"text.secondary",p:1,textAlign:"center"},children:[e.jsx(Ce,{}),e.jsx(j,{variant:"caption",children:"Add photo"})]})}),e.jsxs(S,{direction:"row",alignItems:"center",justifyContent:"space-between",mt:.5,children:[e.jsx(j,{variant:"caption",fontWeight:600,noWrap:!0,children:o.label}),o.photo&&o.src&&e.jsxs(S,{direction:"row",children:[e.jsx(P,{size:"small",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>{var p;return(p=O.current)==null?void 0:p.click()},children:"Change"}),e.jsx(P,{size:"small",color:"inherit",sx:{minWidth:0,px:.5,fontSize:"0.7rem"},onClick:()=>confirm("Remove the extra photo for this bag?")&&We(i.id),children:"Remove"})]})]})]},o.key))}),e.jsx("input",{ref:O,type:"file",accept:"image/*",hidden:!0,onChange:se})]}),e.jsxs(oe,{variant:"outlined",sx:{p:2.5,borderRadius:3.5},children:[e.jsxs(S,{direction:"row",justifyContent:"space-between",alignItems:"center",mb:1.5,gap:1,flexWrap:"wrap",children:[e.jsx(j,{variant:"h3",children:"Caption"}),e.jsx(me,{size:"small",exclusive:!0,value:m,onChange:(o,p)=>p&&l(p),children:Ue.map(o=>e.jsx(fe,{value:o.id,sx:{px:1.25,py:.4},children:o.label},o.id))}),e.jsx(me,{size:"small",exclusive:!0,value:r,onChange:(o,p)=>p&&f(p),children:Ve.map(o=>e.jsx(fe,{value:o.id,sx:{px:1.25,py:.4},children:o.label},o.id))})]}),e.jsx(Ke,{sx:{mb:.5},control:e.jsx(Xe,{size:"small",checked:v,onChange:o=>Z(o.target.checked)}),label:e.jsx(j,{variant:"body2",children:"Mention material (fabric)"})}),e.jsx(Ze,{value:x,onChange:o=>u(o.target.value),multiline:!0,minRows:6,fullWidth:!0,size:"small"}),e.jsxs(S,{direction:"row",gap:1,mt:1.5,flexWrap:"wrap",alignItems:"center",children:[Ye.map(o=>{const p=y.includes(o.id),T=ue({platforms:[o.id]},E).length>0;return e.jsx(J,{size:"small",label:`${o.label}${T?" ⚡":""}`,...G(o.id,p),onClick:()=>ee(p?y.filter(D=>D!==o.id):[...y,o.id])},o.id)}),e.jsx(j,{variant:"caption",color:"text.secondary",children:"⚡ = publishes automatically"})]}),e.jsxs(S,{direction:"row",spacing:1,mt:1.5,children:[e.jsx(P,{size:"small",variant:"outlined",startIcon:e.jsx(_e,{}),onClick:()=>qe(x).then(()=>g.toast("Caption copied"),()=>g.toast("Copy failed")),children:"Copy"}),e.jsx(P,{size:"small",onClick:()=>u(pe(i,r,n,m,v)),children:"Reset"}),e.jsx(A,{flex:1}),e.jsxs(j,{variant:"caption",color:"text.secondary",alignSelf:"center",children:[x.length,"/2200"]})]})]}),e.jsx(It,{resolutionDirectory:t.resolutionDirectory,checkedSizes:t.checkedSizes,previewSizeId:t.previewSizeId,customW:t.customW,customH:t.customH,sides:t.sides,onToggleSize:t.toggleSizeCheckbox,onSetPreviewSize:t.setPreviewSizeId,onSetCustomW:t.setCustomW,onSetCustomH:t.setCustomH,onSetSides:t.setSides}),e.jsx(zt,{isTransparent:t.isTransparent,bgColor:t.bgColor,defaultBgColor:i.backgroundColor,onTransparentToggle:t.handleTransparentToggle,onBgColorChange:t.setBgColor,onResetBgColor:()=>t.setBgColor(i.backgroundColor??"#ffffff")}),e.jsx(Tt,{bagScale:t.bagScale,format:t.format,isTransparent:t.isTransparent,onScaleChange:t.setBagScale,onFormatChange:t.setFormat}),e.jsx(Pt,{suggestedBag:t.suggestedBag,suggestionStats:t.suggestionStats,showSuggestion:t.showSuggestion,getBagThumbnail:t.getBagThumbnail,onSuggest:t.handleGetSuggestion,onReset:t.handleResetHistory,onViewSuggestion:t.handleViewSuggestion})]}),e.jsx(Rt,{previewSide:t.previewSide,livePreview:t.livePreview,bgColor:t.bgColor,isTransparent:t.isTransparent,bagScale:t.bagScale,previewImgSrc:t.previewImgSrc,onSideChange:t.setPreviewSide})]}),e.jsx(A,{sx:{display:{xs:"block",md:"none"},height:72}})]})};export{ss as ItemStudio};
