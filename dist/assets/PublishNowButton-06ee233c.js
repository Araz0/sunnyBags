import{p as N,c as x,_ as P,q as B,r as U,a as q,j as g,R as C,i as z,h as E}from"./index-92f28a8c.js";import{b as A,p as K,m as W,g as G,a as H,c as L,v as O}from"./publish-b4eb8807.js";import{g as T,a as V,b as y,c as Z,d as J,e as Q,A as b}from"./bits-44669b27.js";import{d as I,s as X,r as Y,B as ee}from"./context-419ca5a8.js";function se(e){return T("MuiCircularProgress",e)}V("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const te=["className","color","disableShrink","size","style","thickness","value","variant"];let k=e=>e,_,D,R,M;const h=44,re=N(_||(_=k`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),ae=N(D||(D=k`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),oe=e=>{const{classes:s,variant:t,color:u,disableShrink:f}=e,v={root:["root",t,`color${x(u)}`],svg:["svg"],circle:["circle",`circle${x(t)}`,f&&"circleDisableShrink"]};return Q(v,se,s)},ie=y("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,s)=>{const{ownerState:t}=e;return[s.root,s[t.variant],s[`color${x(t.color)}`]]}})(({ownerState:e,theme:s})=>P({display:"inline-block"},e.variant==="determinate"&&{transition:s.transitions.create("transform")},e.color!=="inherit"&&{color:(s.vars||s).palette[e.color].main}),({ownerState:e})=>e.variant==="indeterminate"&&B(R||(R=k`
      animation: ${0} 1.4s linear infinite;
    `),re)),ne=y("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,s)=>s.svg})({display:"block"}),le=y("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,s)=>{const{ownerState:t}=e;return[s.circle,s[`circle${x(t.variant)}`],t.disableShrink&&s.circleDisableShrink]}})(({ownerState:e,theme:s})=>P({stroke:"currentColor"},e.variant==="determinate"&&{transition:s.transitions.create("stroke-dashoffset")},e.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:e})=>e.variant==="indeterminate"&&!e.disableShrink&&B(M||(M=k`
      animation: ${0} 1.4s ease-in-out infinite;
    `),ae)),ce=U.forwardRef(function(s,t){const u=Z({props:s,name:"MuiCircularProgress"}),{className:f,color:v="primary",disableShrink:p=!1,size:m=40,style:o,thickness:i=3.6,value:n=0,variant:a="indeterminate"}=u,l=q(u,te),c=P({},u,{color:v,disableShrink:p,size:m,thickness:i,value:n,variant:a}),r=oe(c),d={},S={},j={};if(a==="determinate"){const w=2*Math.PI*((h-i)/2);d.strokeDasharray=w.toFixed(3),j["aria-valuenow"]=Math.round(n),d.strokeDashoffset=`${((100-n)/100*w).toFixed(3)}px`,S.transform="rotate(-90deg)"}return g.jsx(ie,P({className:J(r.root,f),style:P({width:m,height:m},S,o),ownerState:c,ref:t,role:"progressbar"},j,l,{children:g.jsx(ne,{className:r.svg,ownerState:c,viewBox:`${h/2} ${h/2} ${h} ${h}`,children:g.jsx(le,{className:r.circle,style:d,ownerState:c,cx:h,cy:h,r:(h-i)/2,fill:"none",strokeWidth:i})})}))}),ue=ce,be=()=>{const e=I(),[s,t]=C.useState(null),[u,f]=C.useState(null);return{publishNow:C.useCallback(async(p,m={})=>{const o=X.exportData().posts.find(l=>l.id===p);if(!o)return!1;const i=G(),n=A(o,i);if(!n.length)return e.toast("None of this post’s platforms are connected. Set them up in Connections."),e.openPublish(p),!1;const a=n.map(l=>b(l).label).join(" + ");if(m.confirm!==!1&&!confirm(`Publish Bag #${o.bagId} to ${a} now?`))return!1;t(p);try{const c=(await K(o,i,f)).filter(d=>!d.ok),r=W(o,i);return c.length?(e.toast(`Failed on ${c.map(d=>b(d.platform).label).join(", ")}: ${c[0].error}`),!1):(e.toast(r.length?`Published to ${a}. ${r.map(d=>b(d).label).join(", ")} still needs posting by hand.`:`Bag #${o.bagId} is live on ${a} 🚀`),!0)}catch(l){return e.toast(`Publishing failed: ${l.message}`),!1}finally{t(null),f(null)}},[e]),busyId:s,progress:u}};var $={},de=z;Object.defineProperty($,"__esModule",{value:!0});var F=$.default=void 0,fe=de(Y()),me=g;F=$.default=(0,fe.default)((0,me.jsx)("path",{d:"M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21"}),"Bolt");const Pe=({platforms:e,onPublish:s,busy:t,progress:u,disabled:f,size:v="medium",variant:p="contained"})=>{const m=H(),o=I(),i=E(),n=e.filter(r=>L(r,m)!=="manual"),a=n.length?n:e.includes("instagram")?["instagram"]:e,l=a.length===1?`Post to ${b(a[0]).label}`:a.length?`Post to ${a.map(r=>b(r).label).join(" + ")}`:"Post now",c=()=>{if(n.length)return s();if(!e.length)return o.toast("Pick at least one platform first");const r=a[0];o.toast(`To post to ${b(r).label} automatically, add in Connections: ${O(r,m).join(", ")}`),i("/studio/connections")};return g.jsx(ee,{size:v,variant:p,color:"success",startIcon:t?g.jsx(ue,{size:14,color:"inherit"}):g.jsx(F,{}),onClick:c,disabled:f||t,sx:{whiteSpace:"nowrap"},children:t?u??"Posting…":l})};export{ue as C,Pe as P,F as d,be as u};
