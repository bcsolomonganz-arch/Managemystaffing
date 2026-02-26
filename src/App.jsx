import { useState, useEffect, useCallback, useRef } from "react";

// ═══ ICONS (1.5px thin stroke, lean modern) ═══
const I={
Dashboard:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
Users:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1"/><circle cx="18" cy="8" r="2.5"/><path d="M22 21v-.5a4 4 0 00-3-3.87"/></svg>,
Calendar:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
Clock:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
Person:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg>,
Upload:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
Settings:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.82.33v.12a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00-.33-2.82H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 002.82-.33V3a2 2 0 114 0v.09c.2.63.77 1.08 1.43 1.08.26 0 .52-.06.74-.18a1.65 1.65 0 00.33-.15l.06-.06a2 2 0 112.83 2.83l-.06.06c-.33.44-.5.98-.33 1.54.1.33.35.63.66.82H21a2 2 0 110 4h-.09c-.63.2-1.08.77-1.08 1.43 0 .26.06.52.18.74z"/></svg>,
Billing:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
Shield:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5.25-3.5 8.75-8 10-4.5-1.25-8-4.75-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
Plus:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
Send:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>,
Check:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
X:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
Sync:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/></svg>,
Alert:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
Right:p=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
Left:p=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
Mail:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>,
Play:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21"/></svg>,
File:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
Video:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="15" height="16" rx="2"/><path d="M17 10l5-3v10l-5-3"/></svg>,
Grip:p=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill={p?.c||"currentColor"} stroke="none"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>,
Trash:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
Onboard:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
Key:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="16" cy="8" r="5"/><path d="M2 22l10-10M6 18l2 2M10 14l2 2"/></svg>,
Logout:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
Dollar:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
Building:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/></svg>,
Bell:p=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
Lock:p=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
Eye:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
Save:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
Link:p=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
Inbox:p=><svg width={p?.s||20} height={p?.s||20} viewBox="0 0 24 24" fill="none" stroke={p?.c||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
};

// ═══ API LAYER ═══
const SLX={
  async syncEmployee(d){await new Promise(r=>setTimeout(r,1200));return{ok:true,id:`SLX-${Date.now().toString().slice(-6)}`};},
  async fetchSchedule(){await new Promise(r=>setTimeout(r,800));return genSched();},
  async cancelShift(){await new Promise(r=>setTimeout(r,600));return{ok:true};},
  async notify(ids){await new Promise(r=>setTimeout(r,800));return{ok:true,n:ids.length};},
};
function genSched(){
  const shifts=[];const types=[
    {n:"Day",s:"7:00a",e:"3:00p",c:"#2563EB"},{n:"Eve",s:"3:00p",e:"11:00p",c:"#7C3AED"},
    {n:"Night",s:"11:00p",e:"7:00a",c:"#475569"},{n:"Day12",s:"7:00a",e:"7:00p",c:"#0891B2"},
    {n:"Nite12",s:"7:00p",e:"7:00a",c:"#1E293B"}];
  const today=new Date();
  for(let i=0;i<14;i++){const d=new Date(today);d.setDate(d.getDate()+i);
    if(Math.random()>.3){const t=types[Math.floor(Math.random()*types.length)];
    shifts.push({id:`SH${i}`,date:d.toISOString().split("T")[0],type:t.n,s:t.s,e:t.e,c:t.c,
      loc:["2A","Main","3B","MC"][Math.floor(Math.random()*4)]});}}
  return shifts;
}

// ═══ CSS ═══
const css=`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
:root{--bg:#F8FAFB;--card:#fff;--hover:#F1F5F9;--brd:#E2E8F0;--brd2:#F1F5F9;
--t1:#1E293B;--t2:#475569;--t3:#94A3B8;
--blue:#2563EB;--blueL:#EEF4FF;--blueM:#DBEAFE;
--green:#059669;--greenL:#ECFDF5;--amber:#D97706;--amberL:#FFFBEB;
--red:#DC2626;--redL:#FEF2F2;--purple:#7C3AED;--purpleL:#F5F3FF;
--cyan:#0891B2;--cyanL:#ECFEFF;--r:10px;--rs:6px;--rl:14px;
--sh:0 1px 3px rgba(0,0,0,.04);--shm:0 4px 12px rgba(0,0,0,.06);--shl:0 10px 30px rgba(0,0,0,.08);}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased}
@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.fi{animation:fi .3s ease-out both}.su{animation:su .35s ease-out both}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:var(--brd);border-radius:3px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue)!important;box-shadow:0 0 0 3px var(--blueL)}
textarea{resize:vertical;font-family:inherit}`;

// ═══ SHARED COMPONENTS ═══
function Badge({children,v="default",style:st}){
  const m={default:{b:"var(--hover)",c:"var(--t2)"},success:{b:"var(--greenL)",c:"var(--green)"},
    warning:{b:"var(--amberL)",c:"var(--amber)"},danger:{b:"var(--redL)",c:"var(--red)"},
    info:{b:"var(--blueL)",c:"var(--blue)"},purple:{b:"var(--purpleL)",c:"var(--purple)"},
    cyan:{b:"var(--cyanL)",c:"var(--cyan)"}};const t=m[v]||m.default;
  return <span style={{display:"inline-flex",alignItems:"center",padding:"3px 10px",borderRadius:20,
    fontSize:11,fontWeight:600,letterSpacing:".02em",textTransform:"uppercase",background:t.b,color:t.c,...st}}>
    {children}</span>;
}
function Btn({children,v="primary",onClick,disabled:dis,style:st,icon,size="md"}){
  const[h,sH]=useState(false);
  const vs={primary:{bg:"var(--blue)",bgH:"#1D4ED8",c:"#fff",bd:"none"},
    secondary:{bg:"#fff",bgH:"var(--hover)",c:"var(--t2)",bd:"1px solid var(--brd)"},
    danger:{bg:"var(--redL)",bgH:"#FECACA",c:"var(--red)",bd:"1px solid #FECACA"},
    success:{bg:"var(--greenL)",bgH:"#A7F3D0",c:"var(--green)",bd:"1px solid #A7F3D0"},
    ghost:{bg:"transparent",bgH:"var(--hover)",c:"var(--t2)",bd:"none"}};
  const sz={sm:{p:"6px 12px",f:12},md:{p:"9px 18px",f:13},lg:{p:"12px 24px",f:14}};const t=vs[v];
  return <button onClick={onClick} disabled={dis} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
    style={{display:"inline-flex",alignItems:"center",gap:7,borderRadius:"var(--rs)",fontFamily:"inherit",
    fontWeight:600,cursor:dis?"not-allowed":"pointer",transition:"all .15s",opacity:dis?.5:1,
    background:h&&!dis?t.bgH:t.bg,color:t.c,border:t.bd,padding:sz[size].p,fontSize:sz[size].f,...st}}>
    {icon&&<span style={{display:"flex"}}>{icon}</span>}{children}</button>;
}
function Card({children,style:st,className:cn}){
  return <div className={cn} style={{background:"var(--card)",border:"1px solid var(--brd)",
    borderRadius:"var(--r)",boxShadow:"var(--sh)",...st}}>{children}</div>;
}
function Avatar({initials:ini,size:sz=36}){
  const cs=[["#DBEAFE","#2563EB"],["#F5F3FF","#7C3AED"],["#ECFDF5","#059669"],
    ["#FFFBEB","#D97706"],["#FEF2F2","#DC2626"],["#ECFEFF","#0891B2"]];
  const[bg,fg]=cs[ini.charCodeAt(0)%cs.length];
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:bg,display:"flex",
    alignItems:"center",justifyContent:"center",fontSize:sz*.35,fontWeight:700,color:fg,flexShrink:0}}>{ini}</div>;
}
function Modal({open,onClose,title,children,width:w=520}){
  if(!open)return null;
  return <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{position:"absolute",inset:0,background:"rgba(15,23,42,.3)",backdropFilter:"blur(4px)"}}/>
    <div className="su" onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#fff",
      border:"1px solid var(--brd)",borderRadius:"var(--rl)",width:`min(${w}px,94vw)`,maxHeight:"88vh",
      overflow:"auto",boxShadow:"var(--shl)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",
        borderBottom:"1px solid var(--brd)"}}>
        <h3 style={{fontSize:16,fontWeight:700}}>{title}</h3>
        <button onClick={onClose} style={{background:"var(--hover)",border:"none",color:"var(--t3)",
          cursor:"pointer",borderRadius:8,padding:6,display:"flex"}}><I.X/></button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div></div>;
}
function Inp({label,type="text",value,onChange,placeholder:ph,required:req,disabled:dis,note,multiline,rows=3}){
  const s={width:"100%",padding:"10px 14px",background:dis?"var(--hover)":"#fff",border:"1px solid var(--brd)",
    borderRadius:"var(--rs)",color:"var(--t1)",fontFamily:"inherit",fontSize:14,transition:"all .15s"};
  return <div style={{marginBottom:16}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:6}}>
      {label} {req&&<span style={{color:"var(--red)"}}>*</span>}</label>}
    {multiline?<textarea value={value} onChange={onChange} placeholder={ph} disabled={dis} rows={rows} style={s}/>
    :<input type={type} value={value} onChange={onChange} placeholder={ph} disabled={dis} style={s}/>}
    {note&&<div style={{fontSize:10,color:"var(--amber)",display:"flex",alignItems:"center",gap:4,
      marginTop:4,padding:"4px 8px",background:"#FFFBEB",borderRadius:4,border:"1px solid #FDE68A"}}>
      <I.Lock s={10} c="#D97706"/>{note}</div>}
  </div>;
}
function Sel({label,value,onChange,children,required:req}){
  return <div style={{marginBottom:16}}>
    {label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:6}}>
      {label} {req&&<span style={{color:"var(--red)"}}>*</span>}</label>}
    <select value={value} onChange={onChange} style={{width:"100%",padding:"10px 14px",background:"#fff",
      border:"1px solid var(--brd)",borderRadius:"var(--rs)",color:"var(--t1)",fontFamily:"inherit",fontSize:14}}>
      {children}</select></div>;
}
function Spinner({size:sz=20}){return <div style={{width:sz,height:sz,border:"2px solid var(--brd)",
  borderTopColor:"var(--blue)",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;}
function HipaaBar(){
  return <div style={{background:"#FFFBEB",borderBottom:"1px solid #FDE68A",padding:"5px 20px",
    display:"flex",alignItems:"center",gap:8,fontSize:11,color:"var(--amber)"}}>
    <I.Shield s={12} c="#D97706"/><span style={{fontWeight:600}}>HIPAA Protected</span>
    <span style={{color:"var(--t3)"}}>— Encrypted in transit & at rest · Auto-lock 15 min</span>
  </div>;
}

// ═══ DATA ═══
const INIT_EMP=[
  {id:"E001",name:"Maria Santos",role:"CNA",email:"maria.s@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440122",avatar:"MS",schedType:"scheduled",rotation:"8hr",pattern:"Day",daysOn:5,daysOff:2,formData:null,submittedDocs:null},
  {id:"E002",name:"James Wilson",role:"RN",email:"james.w@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440233",avatar:"JW",schedType:"scheduled",rotation:"12hr",pattern:"Day12",daysOn:3,daysOff:4,formData:null,submittedDocs:null},
  {id:"E003",name:"Aisha Johnson",role:"LPN",email:"aisha.j@email.com",status:"onboarding",onboardingComplete:false,smartlinxId:null,avatar:"AJ",schedType:null,rotation:null,pattern:null,daysOn:null,daysOff:null,formData:{firstName:"Aisha",lastName:"Johnson"},submittedDocs:null},
  {id:"E004",name:"David Chen",role:"CNA",email:"david.c@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440344",avatar:"DC",schedType:"prn",rotation:null,pattern:null,daysOn:null,daysOff:null,formData:null,submittedDocs:null},
  {id:"E005",name:"Sarah Kim",role:"RN",email:"sarah.k@email.com",status:"invited",onboardingComplete:false,smartlinxId:null,avatar:"SK",schedType:null,formData:null,submittedDocs:null},
  {id:"E006",name:"Tom Rivera",role:"CMA",email:"tom.r@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440455",avatar:"TR",schedType:"scheduled",rotation:"8hr",pattern:"Eve",daysOn:5,daysOff:2,formData:null,submittedDocs:null},
  {id:"E007",name:"Priya Patel",role:"CMA",email:"priya.p@email.com",status:"review",onboardingComplete:false,smartlinxId:null,avatar:"PP",schedType:null,
    formData:{firstName:"Priya",lastName:"Patel",ssn:"***-**-1234",dob:"1995-03-15",address:"123 Oak St",city:"Austin",state:"TX",zip:"78701",emergName:"Raj Patel",emergPhone:"(555)111-2222",emergRelation:"Spouse",w4Status:"married",w4Allowances:"2",i9DocType:"passport",i9DocNumber:"X12345678",bankName:"Chase",routingNumber:"021000021",accountNumber:"****4567",accountType:"checking",_videosDone:{v1:1,v2:1,v3:1},_policySigned:true},
    submittedDocs:{at:"2026-02-22T14:30:00"}},
];
const INIT_ADMINS=[
  {id:"A001",name:"Rebecca Torres",email:"rebecca.t@facility.com",status:"active"},
  {id:"A002",name:"Michael Park",email:"michael.p@facility.com",status:"active"},
];
const INIT_STEPS=[
  {id:"personal",label:"Personal Information",desc:"Legal name, DOB, SSN, address, emergency contacts",icon:"📋",type:"form"},
  {id:"tax",label:"Tax Forms (W-4 / I-9)",desc:"Federal withholding, employment eligibility",icon:"📄",type:"form"},
  {id:"banking",label:"Direct Deposit",desc:"Bank routing & account number",icon:"🏦",type:"form"},
  {id:"videos",label:"Training Videos",desc:"Orientation, safety, HIPAA compliance",icon:"🎬",type:"video"},
  {id:"policy",label:"Policy Acknowledgment",desc:"Employee handbook, HIPAA confidentiality",icon:"✅",type:"form"},
];

// ═══ EMPLOYEE ONBOARDING PORTAL ═══
// This IS the homescreen for new hires. Fillable forms, persists across sessions, submit to admin.
function OnboardPortal({emp,onSave,onSubmit,steps}){
  const[step,setStep]=useState(0);
  const[fd,setFd]=useState(emp.formData||{});
  const[vids,setVids]=useState(fd._videosDone||{});
  const[signed,setSigned]=useState(!!fd._policySigned);
  const[saving,setSaving]=useState(false);
  const[done,setDone]=useState(false);
  const lastSave=useRef(null);

  const upd=(k,v)=>setFd(p=>({...p,[k]:v}));

  const doSave=useCallback(()=>{
    const full={...fd,_videosDone:vids,_policySigned:signed};
    onSave(full);lastSave.current=new Date();
  },[fd,vids,signed,onSave]);

  // Auto-save every 30s
  useEffect(()=>{const t=setInterval(doSave,30000);return()=>clearInterval(t);},[doSave]);

  const manSave=async()=>{setSaving(true);doSave();await new Promise(r=>setTimeout(r,500));setSaving(false);};

  const stepOk=(s)=>{
    if(s.id==="personal")return!!(fd.firstName&&fd.lastName&&fd.dob&&fd.ssn&&fd.address&&fd.city&&fd.state&&fd.zip&&fd.emergName&&fd.emergPhone);
    if(s.id==="tax")return!!(fd.w4Status&&fd.w4Allowances&&fd.i9DocType&&fd.i9DocNumber);
    if(s.id==="banking")return!!(fd.bankName&&fd.routingNumber&&fd.accountNumber&&fd.accountType);
    if(s.id==="videos")return Object.keys(vids).length>=3;
    if(s.id==="policy")return signed;
    return false;
  };
  const allOk=steps.every(s=>stepOk(s));
  const doneN=steps.filter(s=>stepOk(s)).length;
  const pct=Math.round((doneN/steps.length)*100);

  const doSubmit=async()=>{if(!allOk)return;doSave();setDone(true);await new Promise(r=>setTimeout(r,800));
    onSubmit({...fd,_videosDone:vids,_policySigned:signed});};

  const cur=steps[step];

  // ─── Form renderers ───
  const FormPersonal=()=><div className="fi">
    <div style={{fontSize:10,color:"var(--amber)",display:"flex",alignItems:"center",gap:4,padding:"5px 8px",background:"#FFFBEB",borderRadius:4,border:"1px solid #FDE68A",marginBottom:14}}><I.Lock s={10} c="#D97706"/>PHI/PII — encrypted per HIPAA §164.312</div>
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Personal Information</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Legal First Name" value={fd.firstName||""} onChange={e=>upd("firstName",e.target.value)} placeholder="Jane" req/>
      <Inp label="Legal Last Name" value={fd.lastName||""} onChange={e=>upd("lastName",e.target.value)} placeholder="Smith" req/>
      <Inp label="Date of Birth" type="date" value={fd.dob||""} onChange={e=>upd("dob",e.target.value)} req note="PII"/>
      <Inp label="Social Security Number" value={fd.ssn||""} onChange={e=>upd("ssn",e.target.value)} placeholder="XXX-XX-XXXX" req note="Encrypted AES-256"/>
      <Inp label="Phone" value={fd.phone||""} onChange={e=>upd("phone",e.target.value)} placeholder="(555) 123-4567"/>
      <Inp label="Email" value={fd.email||emp.email||""} disabled/>
    </div>
    <p style={{fontSize:13,fontWeight:700,margin:"4px 0 10px",color:"var(--t2)"}}>Mailing Address</p>
    <Inp label="Street" value={fd.address||""} onChange={e=>upd("address",e.target.value)} placeholder="123 Main St" req/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="City" value={fd.city||""} onChange={e=>upd("city",e.target.value)} req/>
      <Inp label="State" value={fd.state||""} onChange={e=>upd("state",e.target.value)} placeholder="TX" req/>
      <Inp label="ZIP" value={fd.zip||""} onChange={e=>upd("zip",e.target.value)} req/>
    </div>
    <p style={{fontSize:13,fontWeight:700,margin:"4px 0 10px",color:"var(--t2)"}}>Emergency Contact</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Name" value={fd.emergName||""} onChange={e=>upd("emergName",e.target.value)} req/>
      <Inp label="Phone" value={fd.emergPhone||""} onChange={e=>upd("emergPhone",e.target.value)} req/>
      <Inp label="Relationship" value={fd.emergRelation||""} onChange={e=>upd("emergRelation",e.target.value)}/>
    </div>
  </div>;

  const FormTax=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>W-4 — Withholding Certificate</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Sel label="Filing Status" value={fd.w4Status||""} onChange={e=>upd("w4Status",e.target.value)} req>
        <option value="">Select…</option><option>single</option><option>married</option><option>head_of_household</option></Sel>
      <Inp label="Allowances" value={fd.w4Allowances||""} onChange={e=>upd("w4Allowances",e.target.value)} placeholder="0" req/>
    </div>
    <Inp label="Additional Withholding ($/pay)" value={fd.w4Extra||""} onChange={e=>upd("w4Extra",e.target.value)} placeholder="0.00"/>
    <p style={{fontSize:14,fontWeight:700,margin:"8px 0 14px"}}>I-9 — Employment Eligibility</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Sel label="Document Type" value={fd.i9DocType||""} onChange={e=>upd("i9DocType",e.target.value)} req>
        <option value="">Select…</option><option value="passport">US Passport</option><option value="perm_res">Perm Resident Card</option><option value="dl_ssn">Driver License + SSN Card</option><option value="state_id">State ID + Birth Cert</option></Sel>
      <Inp label="Document Number" value={fd.i9DocNumber||""} onChange={e=>upd("i9DocNumber",e.target.value)} placeholder="ID #" req note="Verified by employer"/>
    </div>
  </div>;

  const FormBank=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Direct Deposit</p>
    <Inp label="Bank Name" value={fd.bankName||""} onChange={e=>upd("bankName",e.target.value)} placeholder="Chase, Wells Fargo…" req/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Routing Number" value={fd.routingNumber||""} onChange={e=>upd("routingNumber",e.target.value)} placeholder="9 digits" req note="Encrypted"/>
      <Inp label="Account Number" value={fd.accountNumber||""} onChange={e=>upd("accountNumber",e.target.value)} req note="Encrypted"/>
    </div>
    <Sel label="Account Type" value={fd.accountType||""} onChange={e=>upd("accountType",e.target.value)} req>
      <option value="">Select…</option><option value="checking">Checking</option><option value="savings">Savings</option></Sel>
  </div>;

  const VIDS=[{id:"v1",t:"Welcome & Orientation",d:"4:32"},{id:"v2",t:"Workplace Safety",d:"8:15"},
    {id:"v3",t:"HIPAA Compliance",d:"12:45"},{id:"v4",t:"Emergency Procedures",d:"6:20"},
    {id:"v5",t:"Resident Care Standards",d:"10:08"}];

  const FormVids=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Required Training Videos</p>
    <p style={{fontSize:12,color:"var(--t3)",marginBottom:14}}>Click play to watch. Progress saves automatically.</p>
    {VIDS.map(v=>{const ok=vids[v.id];return <div key={v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:ok?"var(--greenL)":"#fff",border:`1px solid ${ok?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)",marginBottom:6}}>
      <div onClick={()=>{if(!ok)setVids(p=>({...p,[v.id]:1}));}} style={{width:36,height:36,borderRadius:"var(--rs)",background:ok?"var(--green)":"var(--purpleL)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        {ok?<I.Check s={16} c="#fff"/>:<I.Play s={16} c="#7C3AED"/>}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:ok?"var(--green)":"var(--t1)"}}>{v.t}</div><div style={{fontSize:11,color:"var(--t3)"}}>{v.d}</div></div>
      {ok&&<Badge v="success">Done</Badge>}
    </div>;})}
  </div>;

  const FormPolicy=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Policy Acknowledgment</p>
    <Card style={{padding:18,maxHeight:260,overflowY:"auto",marginBottom:14,fontSize:13,color:"var(--t2)",lineHeight:1.7}}>
      <p><b>Employee Handbook:</b> I acknowledge receipt of the Employee Handbook and agree to abide by all policies.</p>
      <p style={{marginTop:10}}><b>HIPAA Confidentiality:</b> I agree to maintain confidentiality of all Protected Health Information (PHI) per 45 CFR Parts 160 and 164. Unauthorized disclosure may result in disciplinary action and/or penalties.</p>
      <p style={{marginTop:10}}><b>Workplace Safety:</b> I acknowledge my responsibility to maintain a safe work environment and follow infection control procedures.</p>
    </Card>
    <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:signed?"var(--greenL)":"var(--hover)",border:`1px solid ${signed?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)"}}>
      <input type="checkbox" checked={signed} onChange={e=>setSigned(e.target.checked)} style={{marginTop:2,width:18,height:18,accentColor:"var(--green)"}}/>
      <div><div style={{fontSize:13,fontWeight:600}}>I acknowledge and agree to all policies</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Electronic signature — {emp.name} — {new Date().toLocaleDateString()}</div></div>
    </label>
  </div>;

  if(done)return <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="su" style={{textAlign:"center",maxWidth:380}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"var(--greenL)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I.Check s={28} c="#059669"/></div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Submitted!</h2>
      <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>Your paperwork has been sent to admin for review. You'll be notified once approved and your schedule will appear here.</p>
    </div></div>;

  return <div style={{maxWidth:860,margin:"0 auto"}}>
    <HipaaBar/>
    <div style={{padding:"20px 20px 0"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700}}>Welcome, {emp.name.split(" ")[0]}</h1>
          <p style={{fontSize:12,color:"var(--t3)",marginTop:2}}>Complete your onboarding below · saves automatically</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Btn v="secondary" size="sm" icon={saving?<Spinner size={12}/>:<I.Save s={13}/>} onClick={manSave} disabled={saving}>{saving?"Saving…":"Save"}</Btn>
          {lastSave.current&&<span style={{fontSize:10,color:"var(--t3)"}}>Saved {lastSave.current.toLocaleTimeString()}</span>}
        </div>
      </div>

      {/* Progress */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <div style={{flex:1,height:5,background:"var(--hover)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:pct===100?"var(--green)":"var(--blue)",borderRadius:3,transition:"width .4s"}}/></div>
        <span style={{fontSize:13,fontWeight:700,color:pct===100?"var(--green)":"var(--blue)"}}>{pct}%</span>
      </div>

      {/* Step tabs */}
      <div style={{display:"flex",gap:3,marginBottom:18,overflowX:"auto",paddingBottom:2}}>
        {steps.map((s,i)=>{const ok=stepOk(s);const act=i===step;return <button key={s.id} onClick={()=>setStep(i)} style={{
          display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:"var(--rs)",
          border:act?"2px solid var(--blue)":"1px solid var(--brd)",fontSize:12,fontWeight:600,fontFamily:"inherit",
          background:act?"var(--blueL)":ok?"var(--greenL)":"#fff",cursor:"pointer",
          color:act?"var(--blue)":ok?"var(--green)":"var(--t2)",whiteSpace:"nowrap",flexShrink:0}}>
          <span style={{fontSize:14}}>{s.icon}</span>{s.label}{ok&&<I.Check s={12} c="#059669"/>}
        </button>;})}
      </div>

      {/* Form */}
      <Card style={{padding:22,marginBottom:18}}>
        {cur.id==="personal"&&<FormPersonal/>}
        {cur.id==="tax"&&<FormTax/>}
        {cur.id==="banking"&&<FormBank/>}
        {cur.id==="videos"&&<FormVids/>}
        {cur.id==="policy"&&<FormPolicy/>}
      </Card>

      {/* Nav + submit */}
      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:28}}>
        <Btn v="secondary" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} icon={<I.Left/>}>Prev</Btn>
        <div style={{display:"flex",gap:8}}>
          {step<steps.length-1&&<Btn v="secondary" onClick={()=>setStep(step+1)}>Next <I.Right c="#475569"/></Btn>}
          {allOk&&<Btn onClick={doSubmit} icon={<I.Send s={14} c="#fff"/>}>Submit All Paperwork</Btn>}
        </div>
      </div>
    </div>
  </div>;
}

// ═══ SIDEBAR ═══
function Sidebar({view,setView,role,onLogout}){
  const items=[
    {id:"dashboard",label:"Dashboard",icon:I.Dashboard,r:["super_admin","admin"]},
    {id:"employees",label:"Employees",icon:I.Users,r:["super_admin","admin"]},
    {id:"review",label:"Doc Review",icon:I.Inbox,r:["super_admin","admin"]},
    {id:"schedule",label:"Schedule",icon:I.Calendar,r:["super_admin","admin","employee"]},
    {id:"shifts",label:"Shift Board",icon:I.Clock,r:["super_admin","admin"]},
    {id:"onboarding",label:"Onboarding Flow",icon:I.Onboard,r:["super_admin","admin"]},
    {id:"accounts",label:"Accounts",icon:I.Shield,r:["super_admin"]},
    {id:"billing",label:"Billing",icon:I.Billing,r:["super_admin","admin"]},
  ];
  return <div style={{width:210,background:"#fff",borderRight:"1px solid var(--brd)",display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:100}}>
    <div style={{padding:"18px 14px",borderBottom:"1px solid var(--brd)"}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,borderRadius:"var(--rs)",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Building s={16} c="#fff"/></div>
        <div><div style={{fontSize:14,fontWeight:700}}>StaffHub</div><div style={{fontSize:9,color:"var(--t3)",display:"flex",alignItems:"center",gap:3}}><span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)"}}/>SmartLinx</div></div>
      </div></div>
    <nav style={{flex:1,padding:"6px 5px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
      {items.filter(i=>i.r.includes(role)).map(it=>{const a=view===it.id;return <button key={it.id} onClick={()=>setView(it.id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 11px",borderRadius:"var(--rs)",border:"none",background:a?"var(--blueL)":"transparent",color:a?"var(--blue)":"var(--t2)",fontFamily:"inherit",fontSize:12,fontWeight:a?600:500,cursor:"pointer",textAlign:"left"}}>
        <it.icon s={16} c={a?"#2563EB":"#94A3B8"}/>{it.label}
      </button>;})}
    </nav>
    <div style={{padding:10,borderTop:"1px solid var(--brd)"}}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
        <Avatar initials={role==="super_admin"?"SA":"AD"} size={26}/>
        <div style={{fontSize:11,fontWeight:600}}>{role==="super_admin"?"Super Admin":"Admin"}</div>
      </div>
      <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:5,width:"100%",padding:"6px 8px",borderRadius:"var(--rs)",border:"none",background:"transparent",color:"var(--t3)",fontFamily:"inherit",fontSize:11,cursor:"pointer"}}><I.Logout s={13} c="#94A3B8"/>Sign Out</button>
    </div></div>;
}

// ═══ ADMIN DASHBOARD ═══
function DashboardView({emps,setView}){
  const stats=[
    {l:"Active",v:emps.filter(e=>e.status==="active").length,ic:I.Users,c:"var(--green)",bg:"var(--greenL)"},
    {l:"Onboarding",v:emps.filter(e=>e.status==="onboarding").length,ic:I.Onboard,c:"var(--amber)",bg:"var(--amberL)"},
    {l:"Review",v:emps.filter(e=>e.status==="review").length,ic:I.Inbox,c:"var(--red)",bg:"var(--redL)"},
    {l:"Invited",v:emps.filter(e=>e.status==="invited").length,ic:I.Mail,c:"var(--blue)",bg:"var(--blueL)"},
    {l:"Synced",v:emps.filter(e=>e.smartlinxId).length,ic:I.Sync,c:"var(--purple)",bg:"var(--purpleL)"},
  ];
  return <div className="fi">
    <h1 style={{fontSize:22,fontWeight:700,marginBottom:2}}>Dashboard</h1>
    <p style={{color:"var(--t3)",fontSize:13,marginBottom:20}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
    <div style={{display:"grid",gridTemplateColumns:`repeat(${stats.length},1fr)`,gap:10,marginBottom:20}}>
      {stats.map((s,i)=><Card key={i} className="fi" style={{padding:16,animationDelay:`${i*.05}s`}}>
        <div style={{width:32,height:32,borderRadius:"var(--rs)",background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><s.ic s={16} c={s.c}/></div>
        <div style={{fontSize:26,fontWeight:700}}>{s.v}</div><div style={{fontSize:11,color:"var(--t3)",marginTop:1}}>{s.l}</div>
      </Card>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
      <Card style={{padding:18}}><h3 style={{fontSize:12,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",marginBottom:12}}>Pipeline</h3>
        {emps.filter(e=>!e.onboardingComplete).map((e,i)=><div key={e.id} className="fi" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:"var(--rs)",marginBottom:3,background:"var(--bg)",border:"1px solid var(--brd2)",animationDelay:`${i*.05}s`}}>
          <Avatar initials={e.avatar} size={28}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{e.role}</div></div>
          <Badge v={e.status==="review"?"danger":e.status==="onboarding"?"warning":"info"}>{e.status}</Badge>
        </div>)}</Card>
      <Card style={{padding:18}}><h3 style={{fontSize:12,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",marginBottom:12}}>Quick Actions</h3>
        {[{l:"Send Invite",ic:I.Mail,a:()=>setView("employees"),c:"var(--blue)",bg:"var(--blueL)"},
          {l:"Review Docs",ic:I.Inbox,a:()=>setView("review"),c:"var(--red)",bg:"var(--redL)"},
          {l:"Shift Board",ic:I.Clock,a:()=>setView("shifts"),c:"var(--purple)",bg:"var(--purpleL)"}].map((a,i)=>
          <button key={i} onClick={a.a} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#fff",border:"1px solid var(--brd)",borderRadius:"var(--rs)",fontFamily:"inherit",fontSize:12,fontWeight:500,cursor:"pointer",textAlign:"left",width:"100%",marginBottom:5,color:"var(--t1)"}}>
            <div style={{width:28,height:28,borderRadius:"var(--rs)",background:a.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><a.ic s={14} c={a.c}/></div><span style={{flex:1}}>{a.l}</span><I.Right c="#CBD5E1"/>
          </button>)}</Card>
    </div></div>;
}

// ═══ EMPLOYEES (invite, filter, view progress) ═══
function EmployeesView({emps,setEmps}){
  const[filter,setFilter]=useState("all");
  const[showInv,setShowInv]=useState(false);
  const[invN,setInvN]=useState("");const[invE,setInvE]=useState("");const[invR,setInvR]=useState("CNA");
  const[sending,setSending]=useState(false);

  const sendInv=async()=>{if(!invE||!invN)return;setSending(true);await new Promise(r=>setTimeout(r,1000));
    setEmps(p=>[...p,{id:`E${String(p.length+1).padStart(3,"0")}`,name:invN,email:invE,role:invR,status:"invited",onboardingComplete:false,smartlinxId:null,avatar:invN.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),formData:null,submittedDocs:null,schedType:null,rotation:null,pattern:null,daysOn:null,daysOff:null}]);
    setInvN("");setInvE("");setSending(false);setShowInv(false);};

  const fl=filter==="all"?emps:emps.filter(e=>e.status===filter);
  const ct=k=>k==="all"?emps.length:emps.filter(e=>e.status===k).length;

  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Employees</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>Invite, track, manage</p></div>
      <Btn onClick={()=>setShowInv(true)} icon={<I.Mail s={14} c="#fff"/>}>Send Invite</Btn>
    </div>
    <div style={{display:"flex",gap:3,marginBottom:14}}>
      {[["all","All"],["invited","Invited"],["onboarding","Filling"],["review","Review"],["active","Active"]].map(([k,l])=>
        <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 12px",borderRadius:"var(--rs)",border:filter===k?"2px solid var(--blue)":"1px solid var(--brd)",background:filter===k?"var(--blueL)":"#fff",fontFamily:"inherit",fontSize:11,fontWeight:600,color:filter===k?"var(--blue)":"var(--t2)",cursor:"pointer"}}>{l} ({ct(k)})</button>)}
    </div>
    <Card style={{overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:"1px solid var(--brd)"}}>
      {["Employee","Role","Status","Progress","SmartLinx"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",background:"var(--bg)"}}>{h}</th>)}</tr></thead>
      <tbody>{fl.map((e,i)=><tr key={e.id} className="fi" style={{borderBottom:"1px solid var(--brd2)",animationDelay:`${i*.03}s`}}>
        <td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials={e.avatar} size={30}/><div><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{e.email}</div></div></div></td>
        <td style={{padding:"10px 16px",fontSize:12,color:"var(--t2)"}}>{e.role}</td>
        <td style={{padding:"10px 16px"}}><Badge v={e.status==="active"?"success":e.status==="review"?"danger":e.status==="onboarding"?"warning":"info"}>{e.status}</Badge></td>
        <td style={{padding:"10px 16px",fontSize:11,color:"var(--t3)"}}>{e.status==="active"?"Complete":e.status==="review"?"Awaiting review":e.status==="onboarding"?"Filling forms":"Invite sent"}</td>
        <td style={{padding:"10px 16px"}}>{e.smartlinxId?<span style={{fontSize:11,color:"var(--green)",fontFamily:"monospace"}}>{e.smartlinxId}</span>:<span style={{color:"var(--t3)",fontSize:11}}>—</span>}</td>
      </tr>)}</tbody></table></Card>
    <Modal open={showInv} onClose={()=>setShowInv(false)} title="Send Onboarding Invite">
      <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>New hire receives a secure link to fill out paperwork on their device. They can save & resume across sessions. Once submitted, docs appear in your Review queue.</p>
      <Inp label="Full Name" value={invN} onChange={e=>setInvN(e.target.value)} placeholder="Jane Smith" req/>
      <Inp label="Email" type="email" value={invE} onChange={e=>setInvE(e.target.value)} placeholder="jane@email.com" req/>
      <Sel label="Role" value={invR} onChange={e=>setInvR(e.target.value)} req>{["CNA","CMA","LPN","RN","Dietary","Housekeeping","Maintenance"].map(r=><option key={r}>{r}</option>)}</Sel>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowInv(false)}>Cancel</Btn>
        <Btn onClick={sendInv} disabled={!invN||!invE||sending} icon={sending?<Spinner size={12}/>:<I.Send s={13} c="#fff"/>}>{sending?"Sending…":"Send Invite"}</Btn></div>
    </Modal></div>;
}

// ═══ DOC REVIEW QUEUE ═══
function ReviewView({emps,setEmps}){
  const[syncing,setSyncing]=useState(null);const[viewDoc,setViewDoc]=useState(null);
  const pending=emps.filter(e=>e.status==="review");

  const upload=async(id)=>{setSyncing(id);const r=await SLX.syncEmployee();
    setEmps(p=>p.map(e=>e.id===id?{...e,status:"active",onboardingComplete:true,smartlinxId:r.id}:e));setSyncing(null);};

  const Row=({l,v})=><div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--brd2)"}}><span style={{fontSize:12,color:"var(--t3)"}}>{l}</span><span style={{fontSize:12,fontWeight:600}}>{v||"—"}</span></div>;

  return <div className="fi">
    <h1 style={{fontSize:22,fontWeight:700,marginBottom:2}}>Document Review</h1>
    <p style={{color:"var(--t3)",fontSize:12,marginBottom:16}}>Review submitted docs → upload to SmartLinx</p>
    {pending.length===0?<Card style={{padding:40,textAlign:"center"}}><I.Inbox s={36} c="#CBD5E1"/><p style={{marginTop:10,color:"var(--t3)",fontSize:13}}>No documents awaiting review</p></Card>
    :pending.map((e,i)=><Card key={e.id} className="fi" style={{padding:18,marginBottom:10,borderLeft:"4px solid var(--amber)",animationDelay:`${i*.07}s`}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Avatar initials={e.avatar} size={38}/>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{e.name}</div><div style={{fontSize:12,color:"var(--t3)"}}>{e.role} · Submitted {e.submittedDocs?.at?new Date(e.submittedDocs.at).toLocaleDateString():""}</div></div>
        <Btn size="sm" v="secondary" icon={<I.Eye s={13}/>} onClick={()=>setViewDoc(e.id)}>Review</Btn>
        <Btn size="sm" icon={syncing===e.id?<Spinner size={12}/>:<I.Upload s={13} c="#fff"/>} onClick={()=>upload(e.id)} disabled={syncing===e.id}>{syncing===e.id?"Uploading…":"Upload to SmartLinx"}</Btn>
      </div></Card>)}
    <Modal open={!!viewDoc} onClose={()=>setViewDoc(null)} title="Review Documents" width={600}>
      {viewDoc&&(()=>{const e=emps.find(x=>x.id===viewDoc);if(!e?.formData)return null;const d=e.formData;
        return <div>
          <div style={{fontSize:10,color:"var(--amber)",display:"flex",alignItems:"center",gap:4,padding:"5px 8px",background:"#FFFBEB",borderRadius:4,border:"1px solid #FDE68A",marginBottom:14}}><I.Lock s={10} c="#D97706"/>PHI/PII — Authorized access logged per HIPAA §164.312(b)</div>
          <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",marginBottom:8,borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Personal</p>
          <Row l="Name" v={`${d.firstName||""} ${d.lastName||""}`}/><Row l="DOB" v={d.dob}/><Row l="SSN" v={d.ssn}/><Row l="Address" v={`${d.address||""}, ${d.city||""} ${d.state||""} ${d.zip||""}`}/><Row l="Emergency" v={`${d.emergName||""} ${d.emergPhone||""}`}/>
          <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Tax</p>
          <Row l="Filing" v={d.w4Status}/><Row l="Allowances" v={d.w4Allowances}/><Row l="I-9 Doc" v={d.i9DocType}/><Row l="I-9 #" v={d.i9DocNumber}/>
          <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Banking</p>
          <Row l="Bank" v={d.bankName}/><Row l="Routing" v={d.routingNumber}/><Row l="Account" v={d.accountNumber}/><Row l="Type" v={d.accountType}/>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}><Btn v="secondary" onClick={()=>setViewDoc(null)}>Close</Btn>
            <Btn icon={<I.Upload s={13} c="#fff"/>} onClick={()=>{upload(viewDoc);setViewDoc(null);}}>Approve & Upload</Btn></div>
        </div>;})()}
    </Modal></div>;
}

// ═══ SCHEDULE (rotation-based, 8hr/12hr, PRN vs Scheduled) ═══
function ScheduleView({emps,setEmps}){
  const[viewE,setViewE]=useState(emps.find(e=>e.status==="active")?.id||"E001");
  const[sched,setSched]=useState([]);const[loading,setLoading]=useState(true);
  const[showCfg,setShowCfg]=useState(null);
  const[cfgT,setCfgT]=useState("scheduled");const[cfgR,setCfgR]=useState("8hr");
  const[cfgP,setCfgP]=useState("Day");const[cfgOn,setCfgOn]=useState(5);const[cfgOff,setCfgOff]=useState(2);

  const load=useCallback(async()=>{setLoading(true);const s=await SLX.fetchSchedule();setSched(s);setLoading(false);},[viewE]);
  useEffect(()=>{load();},[load]);

  const emp=emps.find(e=>e.id===viewE);
  const today=new Date();
  const days=Array.from({length:14},(_,i)=>{const d=new Date(today);d.setDate(d.getDate()+i);
    return{dt:d.toISOString().split("T")[0],dow:d.toLocaleDateString("en-US",{weekday:"short"}),
      num:d.getDate(),mon:d.toLocaleDateString("en-US",{month:"short"}),
      isT:i===0,isW:d.getDay()===0||d.getDay()===6};});

  const openCfg=(id)=>{const e=emps.find(x=>x.id===id);
    setCfgT(e?.schedType||"scheduled");setCfgR(e?.rotation||"8hr");setCfgP(e?.pattern||"Day");setCfgOn(e?.daysOn||5);setCfgOff(e?.daysOff||2);setShowCfg(id);};
  const saveCfg=()=>{setEmps(p=>p.map(e=>e.id===showCfg?{...e,schedType:cfgT,rotation:cfgT==="prn"?null:cfgR,pattern:cfgT==="prn"?null:cfgP,daysOn:cfgT==="prn"?null:cfgOn,daysOff:cfgT==="prn"?null:cfgOff}:e));setShowCfg(null);};

  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Schedule</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>2-week view · SmartLinx</p></div>
      <div style={{display:"flex",gap:6}}>
        <select value={viewE} onChange={e=>setViewE(e.target.value)} style={{padding:"8px 12px",background:"#fff",border:"1px solid var(--brd)",borderRadius:"var(--rs)",fontFamily:"inherit",fontSize:12}}>
          {emps.filter(e=>e.status==="active").map(e=><option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}</select>
        <Btn v="secondary" size="sm" onClick={()=>openCfg(viewE)} icon={<I.Settings s={13}/>}>Rotation</Btn>
        <Btn v="secondary" size="sm" icon={<I.Sync s={13}/>} onClick={load}>Refresh</Btn>
      </div></div>
    {emp&&<Card style={{padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <Avatar initials={emp.avatar} size={34}/>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{emp.name} <Badge v={emp.schedType==="prn"?"warning":"cyan"} style={{marginLeft:4}}>{emp.schedType==="prn"?"PRN":emp.rotation||"—"}</Badge></div>
        <div style={{fontSize:11,color:"var(--t3)"}}>{emp.role}{emp.schedType==="scheduled"?` · ${emp.pattern} · ${emp.daysOn}on/${emp.daysOff}off`:""}</div></div>
      <div style={{display:"flex",gap:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"var(--blue)"}}>{sched.length}</div><div style={{fontSize:9,color:"var(--t3)",fontWeight:600,textTransform:"uppercase"}}>Shifts</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"var(--green)"}}>{sched.length*(emp.rotation==="12hr"?12:8)}h</div><div style={{fontSize:9,color:"var(--t3)",fontWeight:600,textTransform:"uppercase"}}>Hours</div></div>
      </div></Card>}
    {loading?<div style={{display:"flex",justifyContent:"center",padding:50}}><Spinner size={24}/></div>:
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
      {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",padding:"5px 0"}}>{d}</div>)}
      {Array.from({length:today.getDay()},(_,i)=><div key={`p${i}`}/>)}
      {days.map((day,i)=>{const sh=sched.find(s=>s.date===day.dt);return <Card key={day.dt} className="fi" style={{padding:7,minHeight:90,animationDelay:`${i*.02}s`,background:day.isT?"var(--blueL)":day.isW?"var(--bg)":"#fff",border:day.isT?"1.5px solid #93C5FD":"1px solid var(--brd)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <span style={{fontSize:15,fontWeight:700,color:day.isT?"var(--blue)":"var(--t1)"}}>{day.num}</span>
          {day.isT&&<Badge v="info" style={{fontSize:8,padding:"1px 4px"}}>Today</Badge>}</div>
        <div style={{fontSize:9,color:"var(--t3)",marginBottom:2}}>{day.mon}</div>
        {sh?<div style={{padding:"3px 5px",borderRadius:4,background:`${sh.c}12`,borderLeft:`3px solid ${sh.c}`}}>
          <div style={{fontSize:10,fontWeight:700,color:sh.c}}>{sh.type}</div>
          <div style={{fontSize:9,color:"var(--t2)"}}>{sh.s}–{sh.e}</div>
          <div style={{fontSize:8,color:"var(--t3)"}}>Fl {sh.loc}</div></div>
        :<div style={{fontSize:9,color:"var(--t3)",fontStyle:"italic"}}>Off</div>}
      </Card>;})}
    </div>}
    <div style={{display:"flex",gap:12,marginTop:10,padding:"8px 14px",background:"#fff",borderRadius:"var(--rs)",border:"1px solid var(--brd)"}}>
      {[{n:"Day",c:"#2563EB"},{n:"Eve",c:"#7C3AED"},{n:"Night",c:"#475569"},{n:"Day12",c:"#0891B2"},{n:"Nite12",c:"#1E293B"}].map(s=><div key={s.n} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--t2)"}}><div style={{width:7,height:7,borderRadius:2,background:s.c}}/>{s.n}</div>)}</div>
    <Modal open={!!showCfg} onClose={()=>setShowCfg(null)} title="Schedule Configuration">
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:8}}>Type</label>
        <div style={{display:"flex",gap:6}}>
          {[["scheduled","Scheduled (Rotation)"],["prn","PRN (As Needed)"]].map(([v,l])=><button key={v} onClick={()=>setCfgT(v)} style={{flex:1,padding:12,borderRadius:"var(--rs)",border:cfgT===v?"2px solid var(--blue)":"1px solid var(--brd)",background:cfgT===v?"var(--blueL)":"#fff",fontFamily:"inherit",fontSize:12,fontWeight:600,color:cfgT===v?"var(--blue)":"var(--t2)",cursor:"pointer"}}>{l}</button>)}</div></div>
      {cfgT==="scheduled"&&<>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:8}}>Shift Length</label>
          <div style={{display:"flex",gap:6}}>
            {[["8hr","8-Hour"],["12hr","12-Hour"]].map(([v,l])=><button key={v} onClick={()=>setCfgR(v)} style={{flex:1,padding:10,borderRadius:"var(--rs)",border:cfgR===v?"2px solid var(--blue)":"1px solid var(--brd)",background:cfgR===v?"var(--blueL)":"#fff",fontFamily:"inherit",fontSize:12,fontWeight:600,color:cfgR===v?"var(--blue)":"var(--t2)",cursor:"pointer"}}>{l}</button>)}</div></div>
        <Sel label="Pattern" value={cfgP} onChange={e=>setCfgP(e.target.value)} req>
          {cfgR==="8hr"?["Day","Eve","Night"].map(v=><option key={v}>{v}</option>):["Day12","Nite12"].map(v=><option key={v}>{v}</option>)}</Sel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Days On" type="number" value={cfgOn} onChange={e=>setCfgOn(+e.target.value)} req/>
          <Inp label="Days Off" type="number" value={cfgOff} onChange={e=>setCfgOff(+e.target.value)} req/></div>
        <div style={{padding:10,background:"var(--blueL)",borderRadius:"var(--rs)",marginBottom:12,fontSize:12,color:"var(--blue)"}}><b>Rotation:</b> {cfgP} ({cfgR}) — {cfgOn}on/{cfgOff}off — auto-populates</div>
      </>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowCfg(null)}>Cancel</Btn><Btn onClick={saveCfg}>Save</Btn></div>
    </Modal></div>;
}

// STAGE3_COMPLETE

// ═══ SHIFT BOARD ═══
function ShiftBoardView({emps}){
  const[shifts,setShifts]=useState([
    {id:"OS1",date:(()=>{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0]})(),type:"Day",s:"7a",e:"3p",loc:"2A",role:"CNA",need:2,status:"open",notif:[]},
    {id:"OS2",date:(()=>{const d=new Date();d.setDate(d.getDate()+3);return d.toISOString().split("T")[0]})(),type:"Eve",s:"3p",e:"11p",loc:"Main",role:"RN",need:1,status:"open",notif:[]},
  ]);
  const[showCreate,setShowCreate]=useState(false);
  const[showNotify,setShowNotify]=useState(null);
  const[sel,setSel]=useState([]);
  const[sending,setSending]=useState(false);
  const[nS,setNS]=useState({date:"",type:"Day",s:"7a",e:"3p",loc:"Main",role:"CNA",need:1});
  const byRole=r=>emps.filter(e=>e.status==="active"&&e.role===r);
  const roles=[{r:"CNA",min:2,max:10},{r:"CMA",min:1,max:6},{r:"RN",min:1,max:3},{r:"LPN",min:1,max:3}];
  const shC={Day:"#2563EB",Eve:"#7C3AED",Night:"#475569",Day12:"#0891B2",Nite12:"#1E293B"};
  const notify=async(id)=>{if(!sel.length)return;setSending(true);await SLX.notify(sel);setShifts(p=>p.map(s=>s.id===id?{...s,status:"notified",notif:sel}:s));setSending(false);setShowNotify(null);setSel([]);};
  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Shift Board</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>Staffing grid · open shifts · notifications</p></div>
      <Btn onClick={()=>setShowCreate(true)} icon={<I.Plus s={14} c="#fff"/>}>Create Open Shift</Btn></div>
    <Card style={{padding:16,marginBottom:16}}>
      <h3 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",marginBottom:10}}>Today — {new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</h3>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${roles.length},1fr)`,gap:10}}>
        {roles.map(r=>{const staff=byRole(r.r);return <div key={r.r} style={{background:"var(--bg)",borderRadius:"var(--rs)",padding:12,border:"1px solid var(--brd)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:700}}>{r.r}</span><Badge v={staff.length>=r.min?"success":"danger"}>{staff.length}/{r.min}-{r.max}</Badge></div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {staff.slice(0,r.max).map(e=><div key={e.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 7px",background:"#fff",borderRadius:4,border:"1px solid var(--brd2)",fontSize:11}}>
              <Avatar initials={e.avatar} size={18}/><span style={{fontWeight:500}}>{e.name.split(" ")[0]}</span>
              <Badge v={e.schedType==="prn"?"warning":"info"} style={{marginLeft:"auto",fontSize:8,padding:"1px 4px"}}>{e.schedType==="prn"?"PRN":"REG"}</Badge></div>)}
            {Array.from({length:Math.max(0,r.min-staff.length)},(_,j)=><div key={`e${j}`} style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"4px",background:"var(--redL)",borderRadius:4,border:"1px dashed #FECACA",fontSize:10,color:"var(--red)",fontWeight:600}}>OPEN</div>)}
          </div></div>;})}
      </div></Card>
    <h3 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",marginBottom:8}}>Open Shifts</h3>
    {shifts.filter(s=>s.status!=="cancelled").map((sh,i)=>{const c=shC[sh.type]||"var(--blue)";const dt=new Date(sh.date+"T12:00:00");return(
      <Card key={sh.id} className="fi" style={{padding:14,marginBottom:6,borderLeft:`4px solid ${c}`,animationDelay:`${i*.05}s`}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{textAlign:"center",minWidth:42}}><div style={{fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase"}}>{dt.toLocaleDateString("en-US",{weekday:"short"})}</div><div style={{fontSize:22,fontWeight:700}}>{dt.getDate()}</div></div>
          <div style={{width:1,height:36,background:"var(--brd)"}}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:14,fontWeight:700}}>{sh.type}</span><Badge v={sh.status==="open"?"warning":"purple"}>{sh.status}</Badge><Badge v="danger">{sh.need} need</Badge></div>
            <div style={{fontSize:11,color:"var(--t2)"}}>{sh.s}–{sh.e} · Fl {sh.loc} · {sh.role}</div>
            {sh.notif.length>0&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:3,fontSize:10,color:"var(--t3)"}}>Notified: {sh.notif.map(id=>{const e=emps.find(x=>x.id===id);return e?<Avatar key={id} initials={e.avatar} size={16}/>:null;})}</div>}</div>
          <div style={{display:"flex",gap:5}}>
            {sh.status==="open"&&<Btn size="sm" icon={<I.Bell s={12} c="#fff"/>} onClick={()=>{setShowNotify(sh.id);setSel([]);}}>Notify</Btn>}
            <Btn size="sm" v="danger" onClick={()=>setShifts(p=>p.map(s=>s.id===sh.id?{...s,status:"cancelled"}:s))}>Cancel</Btn></div>
        </div></Card>);})}
    <Modal open={!!showNotify} onClose={()=>setShowNotify(null)} title="Notify Staff">
      <p style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>Push notification to selected employees.</p>
      {emps.filter(e=>e.status==="active").map(e=>{const m=!shifts.find(s=>s.id===showNotify)||e.role===shifts.find(s=>s.id===showNotify)?.role;const s2=sel.includes(e.id);return(
        <div key={e.id} onClick={()=>setSel(s2?sel.filter(x=>x!==e.id):[...sel,e.id])} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:s2?"var(--blueL)":"#fff",border:`1px solid ${s2?"#93C5FD":"var(--brd)"}`,borderRadius:"var(--rs)",cursor:"pointer",marginBottom:3}}>
          <div style={{width:15,height:15,borderRadius:4,background:s2?"var(--blue)":"transparent",border:s2?"none":"2px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"center"}}>{s2&&<I.Check s={9} c="#fff"/>}</div>
          <Avatar initials={e.avatar} size={22}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{e.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{e.role}</div></div>
          {m&&<Badge v="success" style={{fontSize:8}}>Match</Badge>}</div>);})}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}><Btn v="secondary" onClick={()=>setShowNotify(null)}>Cancel</Btn>
        <Btn onClick={()=>notify(showNotify)} disabled={!sel.length||sending} icon={sending?<Spinner size={12}/>:<I.Bell s={13} c="#fff"/>}>{sending?"…":`Notify ${sel.length}`}</Btn></div>
    </Modal>
    <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Create Open Shift">
      <Inp label="Date" type="date" value={nS.date} onChange={e=>setNS({...nS,date:e.target.value})} req/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <Sel label="Shift" value={nS.type} onChange={e=>{const m={Day:["7a","3p"],Eve:["3p","11p"],Night:["11p","7a"],Day12:["7a","7p"],Nite12:["7p","7a"]};const v=m[e.target.value];setNS({...nS,type:e.target.value,s:v[0],e:v[1]});}}>{["Day","Eve","Night","Day12","Nite12"].map(v=><option key={v}>{v}</option>)}</Sel>
        <Sel label="Role" value={nS.role} onChange={e=>setNS({...nS,role:e.target.value})}>{["CNA","CMA","LPN","RN"].map(v=><option key={v}>{v}</option>)}</Sel>
        <Inp label="Slots" type="number" value={nS.need} onChange={e=>setNS({...nS,need:+e.target.value})} req/></div>
      <Sel label="Floor" value={nS.loc} onChange={e=>setNS({...nS,loc:e.target.value})}>{["Main","2A","3B","MC"].map(v=><option key={v}>{v}</option>)}</Sel>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowCreate(false)}>Cancel</Btn>
        <Btn onClick={()=>{if(!nS.date)return;setShifts(p=>[...p,{id:`OS${Date.now()}`,...nS,status:"open",notif:[]}]);setNS({date:"",type:"Day",s:"7a",e:"3p",loc:"Main",role:"CNA",need:1});setShowCreate(false);}} disabled={!nS.date} icon={<I.Plus s={13} c="#fff"/>}>Create</Btn></div>
    </Modal>
  </div>;
}

// ═══ ONBOARDING FLOW BUILDER ═══
function OnboardFlowView({steps,setSteps}){
  const dr=useRef(null);const dv=useRef(null);
  const[showAdd,setShowAdd]=useState(false);
  const[nI,setNI]=useState({label:"",desc:"",type:"form",url:""});
  const onEnd=()=>{if(dr.current==null||dv.current==null)return;const c=[...steps];const it=c.splice(dr.current,1)[0];c.splice(dv.current,0,it);setSteps(c);dr.current=null;dv.current=null;};
  const tI={form:I.File,video:I.Video,link:I.Link};
  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Onboarding Flow</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>Drag to reorder · add docs, videos, links</p></div>
      <Btn onClick={()=>setShowAdd(true)} icon={<I.Plus s={14} c="#fff"/>}>Add Step</Btn></div>
    <Card style={{padding:"12px 16px",marginBottom:10,background:"var(--blueL)",border:"1px dashed #93C5FD"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><I.Upload s={16} c="#2563EB"/><div style={{fontSize:12,fontWeight:600,color:"var(--blue)"}}>Drag & drop to reorder — new hires see this order</div></div></Card>
    {steps.map((s,i)=>{const TI=tI[s.type]||I.File;return(
      <div key={s.id} draggable onDragStart={()=>{dr.current=i}} onDragEnter={()=>{dv.current=i}} onDragEnd={onEnd} onDragOver={e=>e.preventDefault()}
        style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#fff",border:"1px solid var(--brd)",borderRadius:"var(--rs)",cursor:"grab",boxShadow:"var(--sh)",marginBottom:3}}>
        <I.Grip s={12} c="#CBD5E1"/>
        <div style={{width:28,height:28,borderRadius:"var(--rs)",background:s.type==="video"?"var(--purpleL)":s.type==="link"?"var(--amberL)":"var(--blueL)",display:"flex",alignItems:"center",justifyContent:"center"}}><TI s={14} c={s.type==="video"?"#7C3AED":s.type==="link"?"#D97706":"#2563EB"}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>{s.label}<Badge v={s.type==="video"?"purple":s.type==="link"?"warning":"info"} style={{fontSize:8}}>{s.type}</Badge></div><div style={{fontSize:10,color:"var(--t3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.desc}</div></div>
        <span style={{fontSize:10,color:"var(--t3)",fontWeight:600,background:"var(--bg)",padding:"2px 6px",borderRadius:4}}>#{i+1}</span>
        <button onClick={()=>setSteps(steps.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",cursor:"pointer",padding:3,display:"flex"}}><I.Trash s={13} c="#DC2626"/></button>
      </div>);})}
    <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Step">
      <Inp label="Name" value={nI.label} onChange={e=>setNI({...nI,label:e.target.value})} placeholder="Safety Training" req/>
      <Inp label="Description" value={nI.desc} onChange={e=>setNI({...nI,desc:e.target.value})}/>
      <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:6}}>Type</label>
        <div style={{display:"flex",gap:6}}>{[["form","Document",I.File],["video","Video",I.Video],["link","Link",I.Link]].map(([v,l,Ic])=>
          <button key={v} onClick={()=>setNI({...nI,type:v})} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"12px",borderRadius:"var(--rs)",border:nI.type===v?"2px solid var(--blue)":"1px solid var(--brd)",background:nI.type===v?"var(--blueL)":"#fff",cursor:"pointer"}}><Ic s={18} c={nI.type===v?"#2563EB":"#94A3B8"}/><span style={{fontSize:10,fontWeight:600,color:nI.type===v?"var(--blue)":"var(--t3)"}}>{l}</span></button>)}</div></div>
      {(nI.type==="video"||nI.type==="link")&&<Inp label="URL" value={nI.url} onChange={e=>setNI({...nI,url:e.target.value})} placeholder="https://..."/>}
      {nI.type==="form"&&<div style={{padding:20,border:"2px dashed var(--brd)",borderRadius:"var(--r)",textAlign:"center",marginBottom:14,background:"var(--bg)"}}><I.Upload s={20} c="#94A3B8"/><p style={{fontSize:11,color:"var(--t3)",marginTop:6}}>Drag & drop or click (PDF, DOC)</p></div>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
        <Btn onClick={()=>{if(!nI.label)return;setSteps(p=>[...p,{id:`c${Date.now()}`,label:nI.label,desc:nI.desc||nI.url||"Custom",icon:nI.type==="video"?"🎬":nI.type==="link"?"🔗":"📄",type:nI.type}]);setNI({label:"",desc:"",type:"form",url:""});setShowAdd(false);}} disabled={!nI.label} icon={<I.Plus s={13} c="#fff"/>}>Add</Btn></div>
    </Modal></div>;
}
// ═══ ACCOUNTS (Super Admin) ═══
function AccountsView({admins,setAdmins}){
  const[showAdd,setShowAdd]=useState(false);const[n,setN]=useState("");const[e,setE]=useState("");
  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h1 style={{fontSize:22,fontWeight:700}}>Manage Accounts</h1>
      <Btn onClick={()=>setShowAdd(true)} icon={<I.Plus s={14} c="#fff"/>}>Add Admin</Btn></div>
    <Card style={{overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:"1px solid var(--brd)"}}>
      {["Account","Status","Actions"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",background:"var(--bg)"}}>{h}</th>)}</tr></thead>
      <tbody>
        <tr style={{borderBottom:"1px solid var(--brd2)",background:"var(--blueL)"}}><td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials="SA" size={28}/><div><div style={{fontSize:12,fontWeight:600}}>Super Admin</div><div style={{fontSize:10,color:"var(--t3)"}}>Owner</div></div></div></td><td style={{padding:"10px 16px"}}><Badge v="success">Active</Badge></td><td style={{padding:"10px 16px",fontSize:11,color:"var(--t3)"}}>Owner</td></tr>
        {admins.map(a=><tr key={a.id} style={{borderBottom:"1px solid var(--brd2)"}}>
          <td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials={a.name.split(" ").map(x=>x[0]).join("")} size={28}/><div><div style={{fontSize:12,fontWeight:600}}>{a.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{a.email}</div></div></div></td>
          <td style={{padding:"10px 16px"}}><Badge v={a.status==="active"?"success":"danger"}>{a.status}</Badge></td>
          <td style={{padding:"10px 16px"}}><Btn size="sm" v={a.status==="active"?"danger":"success"} onClick={()=>setAdmins(p=>p.map(x=>x.id===a.id?{...x,status:x.status==="active"?"suspended":"active"}:x))}>{a.status==="active"?"Suspend":"Activate"}</Btn></td>
        </tr>)}</tbody></table></Card>
    <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Admin">
      <Inp label="Name" value={n} onChange={ev=>setN(ev.target.value)} req/>
      <Inp label="Email" type="email" value={e} onChange={ev=>setE(ev.target.value)} req/>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
        <Btn onClick={()=>{if(!n||!e)return;setAdmins(p=>[...p,{id:`A${Date.now()}`,name:n,email:e,status:"active"}]);setN("");setE("");setShowAdd(false);}} disabled={!n||!e}>Create</Btn></div>
    </Modal></div>;
}

// ═══ BILLING ═══
function BillingView(){
  const[showPay,setShowPay]=useState(false);
  const inv=[{id:"INV-2026-02",d:"Feb 1, 2026",a:"$299.00"},{id:"INV-2026-01",d:"Jan 1, 2026",a:"$299.00"},{id:"INV-2025-12",d:"Dec 1, 2025",a:"$299.00"}];
  return <div className="fi">
    <h1 style={{fontSize:22,fontWeight:700,marginBottom:16}}>Billing</h1>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
      <Card style={{padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}><div style={{width:38,height:38,borderRadius:"var(--rs)",background:"var(--blueL)",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Building s={20} c="#2563EB"/></div><div><div style={{fontSize:16,fontWeight:700}}>StaffHub Pro</div><div style={{fontSize:12,color:"var(--t3)"}}>Up to 100 employees</div></div></div>
        <div style={{marginBottom:16}}><span style={{fontSize:32,fontWeight:700}}>$299</span><span style={{color:"var(--t3)"}}>/mo</span></div>
        {["SmartLinx Integration","Unlimited Onboarding","Shift Management","HIPAA Compliant"].map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--t2)",marginBottom:4}}><I.Check s={12} c="#059669"/>{f}</div>)}
      </Card>
      <Card style={{padding:20}}>
        <h3 style={{fontSize:13,fontWeight:700,marginBottom:14}}>Payment</h3>
        <div style={{padding:14,background:"var(--bg)",borderRadius:"var(--rs)",border:"1px solid var(--brd)",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <I.Billing s={20} c="#2563EB"/><div><div style={{fontSize:13,fontWeight:600}}>•••• 4242</div><div style={{fontSize:11,color:"var(--t3)"}}>Exp 12/27</div></div><Badge v="success" style={{marginLeft:"auto"}}>Default</Badge></div>
        <Btn onClick={()=>setShowPay(true)} icon={<I.Billing s={14} c="#fff"/>} style={{width:"100%",justifyContent:"center",marginBottom:8}}>Make Payment</Btn>
        <Btn v="secondary" style={{width:"100%",justifyContent:"center"}}>Update Method</Btn>
      </Card></div>
    <Card style={{overflow:"hidden"}}><div style={{padding:"12px 18px",borderBottom:"1px solid var(--brd)"}}><h3 style={{fontSize:13,fontWeight:700}}>Invoices</h3></div>
      <table style={{width:"100%",borderCollapse:"collapse"}}><tbody>{inv.map(i=><tr key={i.id} style={{borderBottom:"1px solid var(--brd2)"}}>
        <td style={{padding:"10px 18px",fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{i.id}</td>
        <td style={{padding:"10px 18px",fontSize:12,color:"var(--t2)"}}>{i.d}</td>
        <td style={{padding:"10px 18px",fontSize:12,fontWeight:600}}>{i.a}</td>
        <td style={{padding:"10px 18px"}}><Badge v="success">Paid</Badge></td></tr>)}</tbody></table></Card>
    <Modal open={showPay} onClose={()=>setShowPay(false)} title="Make a Payment">
      <div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:34,fontWeight:700,marginBottom:16}}>$299.00</div>
        <Btn style={{width:"100%",justifyContent:"center"}} size="lg" onClick={()=>setShowPay(false)} icon={<I.Check s={15} c="#fff"/>}>Process Payment</Btn>
      </div></Modal></div>;
}

// ═══ LOGIN ═══
function LoginScreen({onLogin}){
  const[email,setEmail]=useState("");const[pw,setPw]=useState("");const[role,setRole]=useState("super_admin");
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"var(--bg)"}}>
    <HipaaBar/>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div className="su" style={{width:400,background:"#fff",borderRadius:"var(--rl)",border:"1px solid var(--brd)",boxShadow:"var(--shl)"}}>
        <div style={{padding:"32px 32px 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{width:38,height:38,borderRadius:"var(--r)",background:"var(--blue)",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Building s={20} c="#fff"/></div>
            <div><div style={{fontSize:20,fontWeight:700}}>StaffHub</div><div style={{fontSize:10,color:"var(--t3)"}}>HIPAA-Compliant Workforce Mgmt</div></div></div>
          <p style={{fontSize:13,color:"var(--t2)",margin:"16px 0 20px"}}>Sign in to your account.</p></div>
        <div style={{padding:"0 32px 28px"}}>
          <Inp label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@facility.com"/>
          <Inp label="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"/>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"var(--t2)",marginBottom:6}}>Demo Role</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>
              {[["super_admin","Super Admin",I.Shield],["admin","Admin",I.Key],["employee","Employee",I.Person],["new_hire","New Hire",I.Onboard]].map(([v,l,Ic])=>
                <button key={v} onClick={()=>setRole(v)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 4px",borderRadius:"var(--rs)",border:role===v?"2px solid var(--blue)":"1px solid var(--brd)",background:role===v?"var(--blueL)":"#fff",cursor:"pointer"}}>
                  <Ic s={14} c={role===v?"#2563EB":"#94A3B8"}/><span style={{fontSize:9,fontWeight:600,color:role===v?"var(--blue)":"var(--t3)"}}>{l}</span></button>)}</div></div>
          <Btn onClick={()=>onLogin(role)} style={{width:"100%",justifyContent:"center",padding:"11px"}} size="lg">Sign In</Btn>
        </div></div></div></div>;
}

// ═══ MAIN APP — routing logic ═══
// New Hire: homescreen = onboarding portal (fillable forms, multi-session)
//           after submit → schedule
// Employee: homescreen = 2-week schedule
// Admin/Super Admin: full sidebar navigation
export default function StaffHubApp(){
  const[loggedIn,setLoggedIn]=useState(false);
  const[role,setRole]=useState("super_admin");
  const[view,setView]=useState("dashboard");
  const[emps,setEmps]=useState(INIT_EMP);
  const[admins,setAdmins]=useState(INIT_ADMINS);
  const[obSteps,setObSteps]=useState(INIT_STEPS);

  if(!loggedIn) return <><style>{css}</style><LoginScreen onLogin={r=>{setRole(r);setLoggedIn(true);}}/></>;

  // ── NEW HIRE: onboarding portal is their homescreen ──
  if(role==="new_hire"){
    const me=emps.find(e=>e.id==="E003")||emps.find(e=>e.status==="onboarding");
    // Still filling out / not yet submitted
    if(me && !me.onboardingComplete && me.status!=="review"){
      return <><style>{css}</style>
        <OnboardPortal emp={me} steps={obSteps}
          onSave={(fd)=>setEmps(p=>p.map(e=>e.id===me.id?{...e,formData:fd,status:"onboarding"}:e))}
          onSubmit={(fd)=>setEmps(p=>p.map(e=>e.id===me.id?{...e,formData:fd,status:"review",submittedDocs:{at:new Date().toISOString()}}:e))}
        /></>;
    }
    // Submitted or approved → show schedule
    return <><style>{css}</style>
      <div style={{maxWidth:860,margin:"0 auto"}}><HipaaBar/>
        <div style={{padding:20}}>
          {me?.status==="review"&&<Card style={{padding:16,marginBottom:16,background:"var(--amberL)",border:"1px solid #FDE68A"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><I.Clock s={16} c="#D97706"/>
              <div><div style={{fontSize:13,fontWeight:600,color:"var(--amber)"}}>Paperwork Under Review</div>
                <div style={{fontSize:12,color:"var(--t2)"}}>Your admin is reviewing your documents. Schedule will appear once approved.</div></div></div></Card>}
          <ScheduleView emps={emps} setEmps={setEmps}/>
          <div style={{textAlign:"center",padding:"20px 0"}}><button onClick={()=>setLoggedIn(false)} style={{background:"none",border:"none",color:"var(--t3)",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>Sign Out</button></div>
        </div></div></>;
  }

  // ── EMPLOYEE: schedule is homescreen ──
  if(role==="employee"){
    return <><style>{css}</style>
      <div style={{maxWidth:860,margin:"0 auto"}}><HipaaBar/>
        <div style={{padding:20}}>
          <ScheduleView emps={emps} setEmps={setEmps}/>
          <div style={{textAlign:"center",padding:"20px 0"}}><button onClick={()=>setLoggedIn(false)} style={{background:"none",border:"none",color:"var(--t3)",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>Sign Out</button></div>
        </div></div></>;
  }

  // ── ADMIN / SUPER ADMIN: full sidebar + all views ──
  return <><style>{css}</style>
    <div style={{display:"flex",minHeight:"100vh",background:"var(--bg)"}}>
      <Sidebar view={view} setView={setView} role={role} onLogout={()=>setLoggedIn(false)}/>
      <main style={{marginLeft:210,flex:1,padding:"20px 28px",maxWidth:"calc(100vw - 210px)"}}>
        <HipaaBar/>
        <div style={{paddingTop:14}}>
          {view==="dashboard"&&<DashboardView emps={emps} setView={setView}/>}
          {view==="employees"&&<EmployeesView emps={emps} setEmps={setEmps}/>}
          {view==="review"&&<ReviewView emps={emps} setEmps={setEmps}/>}
          {view==="schedule"&&<ScheduleView emps={emps} setEmps={setEmps}/>}
          {view==="shifts"&&<ShiftBoardView emps={emps}/>}
          {view==="onboarding"&&<OnboardFlowView steps={obSteps} setSteps={setObSteps}/>}
          {view==="accounts"&&<AccountsView admins={admins} setAdmins={setAdmins}/>}
          {view==="billing"&&<BillingView/>}
        </div>
      </main>
    </div></>;
}
