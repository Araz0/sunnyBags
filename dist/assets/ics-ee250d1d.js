import{m as R,A as d}from"./bits-add703cd.js";const c=t=>t.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""),l=t=>t.replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;"),I=(t,s)=>{const o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SunnyBags//Content Studio//EN","CALSCALE:GREGORIAN","X-WR-CALNAME:SunnyBags posting plan"];return t.forEach(e=>{const n=new Date(e.scheduledAt),E=new Date(n.getTime()+15*6e4),a=R(e.bagId),i=e.platforms.map(A=>d(A).label).join(", "),r=`${s}/studio/queue?post=${e.id}`;o.push("BEGIN:VEVENT",`UID:${e.id}@sunnybags-studio`,`DTSTAMP:${c(new Date)}`,`DTSTART:${c(n)}`,`DTEND:${c(E)}`,`SUMMARY:${l(`📸 Post Bag #${e.bagId} on ${i}`)}`,`DESCRIPTION:${l(`${(a==null?void 0:a.description)??""}

Open the publish assistant: ${r}

---
${e.caption}`)}`,`URL:${r}`,"BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Time to post!","TRIGGER:-PT10M","END:VALARM","END:VEVENT")}),o.push("END:VCALENDAR"),o.join(`\r
`)},N=(t,s,o)=>{const e=URL.createObjectURL(new Blob([t],{type:o})),n=document.createElement("a");n.href=e,n.download=s,n.click(),setTimeout(()=>URL.revokeObjectURL(e),1e3)};export{I as b,N as d};
