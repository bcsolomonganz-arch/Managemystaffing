import { useState, useEffect, useCallback, useRef } from "react";

// ═══ ICONS (soft outline + subtle fill accents, matching ref UI) ═══
const _s=(p,d=20)=>({w:p?.s||d,h:p?.s||d,c:p?.c||"currentColor"});
const I={
Dashboard:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/></svg>;},
Users:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1.5A4.5 4.5 0 017.5 15h3A4.5 4.5 0 0115 19.5V21"/><circle cx="17.5" cy="7.5" r="2.5"/><path d="M21 21v-1a3.5 3.5 0 00-2.5-3.36"/></svg>;},
Calendar:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1" fill={c} stroke="none"/><circle cx="12" cy="15" r="1" fill={c} stroke="none"/><circle cx="16" cy="15" r="1" fill={c} stroke="none"/></svg>;},
Clock:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5"/><polyline points="12 7 12 12 15.5 14"/></svg>;},
Person:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-1a5.5 5.5 0 015.5-5.5h3A5.5 5.5 0 0119 20v1"/></svg>;},
Upload:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17v2.5A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5V17"/><polyline points="16 8 12 4 8 8"/><line x1="12" y1="4" x2="12" y2="16"/></svg>;},
Settings:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;},
Billing:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/><path d="M6 15h3" opacity=".5"/><path d="M13 15h3" opacity=".5"/></svg>;},
Shield:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5l7.5 3.5v5.5c0 5-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/></svg>;},
Plus:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;},
Send:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>;},
Check:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;},
X:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;},
Sync:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3v5h-5"/><path d="M3 12a9 9 0 0115.4-6.2L21 8"/><path d="M3 21v-5h5"/><path d="M21 12a9 9 0 01-15.4 6.2L3 16"/></svg>;},
Alert:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".75" fill={c} stroke="none"/></svg>;},
Right:p=>{const{w,h,c}=_s(p,14);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;},
Left:p=>{const{w,h,c}=_s(p,14);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;},
Mail:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M22 6l-10 7L2 6"/></svg>;},
Play:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21"/></svg>;},
File:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13" opacity=".4"/><line x1="8" y1="17" x2="13" y2="17" opacity=".4"/></svg>;},
Video:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="14" height="14" rx="2.5"/><path d="M16 10l5-2.5v9L16 14"/></svg>;},
Grip:p=>{const{w,h,c}=_s(p,14);return<svg width={w} height={h} viewBox="0 0 24 24" fill={c} stroke="none"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>;},
Trash:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-.8 12.2a2 2 0 01-2 1.8H7.8a2 2 0 01-2-1.8L5 6"/><line x1="10" y1="11" x2="10" y2="17" opacity=".5"/><line x1="14" y1="11" x2="14" y2="17" opacity=".5"/></svg>;},
Onboard:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1.5"/><path d="M9 14l2 2 4-4"/></svg>;},
Key:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="15.5" cy="8.5" r="4.5"/><path d="M2 22l9-9"/><path d="M6.5 17.5l2 2"/><path d="M10 14l2 2"/></svg>;},
Logout:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;},
Dollar:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;},
Building:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2.5"/><path d="M9 22V13h6v9"/><circle cx="8" cy="6" r=".75" fill={c} stroke="none"/><circle cx="12" cy="6" r=".75" fill={c} stroke="none"/><circle cx="16" cy="6" r=".75" fill={c} stroke="none"/><circle cx="8" cy="10" r=".75" fill={c} stroke="none"/><circle cx="12" cy="10" r=".75" fill={c} stroke="none"/><circle cx="16" cy="10" r=".75" fill={c} stroke="none"/></svg>;},
Bell:p=>{const{w,h,c}=_s(p,18);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 3.5-1.2 5.8-2.2 7.2A1 1 0 004.6 17h14.8a1 1 0 00.8-1.8C19.2 13.8 18 11.5 18 8z"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;},
Lock:p=>{const{w,h,c}=_s(p,14);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2.5"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16.5" r="1" fill={c} stroke="none"/></svg>;},
Eye:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;},
Save:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;},
Link:p=>{const{w,h,c}=_s(p,16);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;},
Inbox:p=>{const{w,h,c}=_s(p);return<svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>;},
};

// ═══ API LAYER ═══
const SLX={
  async syncEmployee(d){await new Promise(r=>setTimeout(r,1200));return{ok:true,id:`SLX-${Date.now().toString().slice(-6)}`};},
  async fetchSchedule(){await new Promise(r=>setTimeout(r,800));return genSched();},
  async cancelShift(){await new Promise(r=>setTimeout(r,600));return{ok:true};},
  async notify(ids){await new Promise(r=>setTimeout(r,800));return{ok:true,n:ids.length};},
  async requestShift(req){await new Promise(r=>setTimeout(r,600));return{ok:true,id:`REQ-${Date.now()}`};},
  async resolveRequest(id,action){await new Promise(r=>setTimeout(r,400));return{ok:true,action};},
  async requestTimeOff(req){await new Promise(r=>setTimeout(r,600));return{ok:true,id:`TO-${Date.now()}`};},
  async resolveTimeOff(id,action){await new Promise(r=>setTimeout(r,400));return{ok:true,action};},
  async backupToCloud(empId,data){await new Promise(r=>setTimeout(r,1500));return{ok:true,ts:new Date().toISOString()};},
};
function genSched(numDays=14){
  const shifts=[];const types=[
    {n:"Day",s:"7:00a",e:"3:00p",c:"#2563EB"},{n:"Eve",s:"3:00p",e:"11:00p",c:"#7C3AED"},
    {n:"Night",s:"11:00p",e:"7:00a",c:"#475569"},{n:"Day12",s:"7:00a",e:"7:00p",c:"#0891B2"},
    {n:"Nite12",s:"7:00p",e:"7:00a",c:"#1E293B"}];
  const today=new Date();
  for(let i=0;i<numDays;i++){const d=new Date(today);d.setDate(d.getDate()+i);
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
textarea{resize:vertical;font-family:inherit}
.open-slot{border:2px dashed var(--green)!important;cursor:pointer;transition:all .15s}
.open-slot:hover{background:var(--greenL)!important;border-color:#059669!important;transform:translateY(-1px);box-shadow:0 2px 8px rgba(5,150,105,.15)}
.month-nav{display:inline-flex;align-items:center;gap:2px;padding:3px 4px;background:var(--hover);border-radius:var(--rs);border:1px solid var(--brd)}
.month-nav button{padding:6px 14px;border-radius:var(--rs);border:none;background:transparent;font-family:inherit;font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;transition:all .15s}
.month-nav button.active{background:var(--blue);color:#fff;box-shadow:var(--sh)}
.off-req{cursor:pointer;transition:all .15s;position:relative}
.off-req:hover{opacity:.85;box-shadow:0 1px 4px rgba(220,38,38,.2)}`;

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
const FACILITIES=[
  {id:"F001",name:"Tulia Health and Rehabilitation",state:"TX",address:"2510 W 24th Street, Tulia, TX 79088",phone:"806-296-5584"},
  {id:"F002",name:"Oklahoma Care Center",state:"OK",address:"1200 N Main St, Oklahoma City, OK 73102",phone:"405-555-0100"},
];
const getFacility=(id)=>FACILITIES.find(f=>f.id===id)||FACILITIES[0];

const STEPS_TX=[
  {id:"app",label:"Employment Application",desc:"Personal info, education, employment history, references",icon:"File",type:"form"},
  {id:"newhire",label:"New Hire Info",desc:"Demographics, job details, schedule",icon:"Person",type:"form"},
  {id:"emergency",label:"Emergency Contacts",desc:"Primary & secondary emergency contacts, physician",icon:"Bell",type:"form"},
  {id:"w4",label:"Federal W-4",desc:"IRS employee withholding certificate (2026)",icon:"Dollar",type:"form"},
  {id:"i9",label:"Form I-9",desc:"USCIS employment eligibility verification",icon:"Shield",type:"form"},
  {id:"dpscch",label:"TX DPS Background Check",desc:"Texas DPS criminal conviction history verification",icon:"Eye",type:"form"},
  {id:"deposit",label:"Direct Deposit",desc:"Bank routing & account for payroll",icon:"Billing",type:"form"},
  {id:"videos",label:"Training Videos",desc:"Orientation, safety, HIPAA compliance",icon:"Video",type:"video"},
  {id:"policy",label:"Policy Acknowledgment",desc:"Employee handbook, HIPAA confidentiality",icon:"Check",type:"form"},
];
const STEPS_OK=[
  {id:"app",label:"Employment Application",desc:"Personal info, education, employment history, references",icon:"File",type:"form"},
  {id:"newhire",label:"New Hire Info",desc:"Demographics, job details, schedule",icon:"Person",type:"form"},
  {id:"emergency",label:"Emergency Contacts",desc:"Primary & secondary emergency contacts, physician",icon:"Bell",type:"form"},
  {id:"w4",label:"Federal W-4",desc:"IRS employee withholding certificate (2026)",icon:"Dollar",type:"form"},
  {id:"okw4",label:"OK State W-4",desc:"Oklahoma employee withholding allowance certificate",icon:"Dollar",type:"form"},
  {id:"i9",label:"Form I-9",desc:"USCIS employment eligibility verification",icon:"Shield",type:"form"},
  {id:"bgc",label:"OK Background Check",desc:"OK Long Term Care Security Act — consent & fingerprint",icon:"Eye",type:"form"},
  {id:"deposit",label:"Direct Deposit",desc:"Bank routing & account for payroll",icon:"Billing",type:"form"},
  {id:"videos",label:"Training Videos",desc:"Orientation, safety, HIPAA compliance",icon:"Video",type:"video"},
  {id:"policy",label:"Policy Acknowledgment",desc:"Employee handbook, HIPAA confidentiality",icon:"Check",type:"form"},
];
const getStepsForState=(st)=>st==="OK"?STEPS_OK:STEPS_TX;
const getStepsForInvite=(state,inviteType)=>{
  const all=getStepsForState(state);
  if(inviteType==="app_only")return all.filter(s=>s.id==="app");
  if(inviteType==="paperwork")return all.filter(s=>s.id!=="app");
  return all; // "full"
};
const CLOUD_BACKUP={url:null,status:"not_configured"}; // destination TBD
const HANDBOOK_PDF={url:null}; // destination TBD

const INIT_EMP=[
  {id:"E001",name:"Maria Santos",role:"CNA",email:"maria.s@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440122",avatar:"MS",facilityId:"F001",schedType:"scheduled",rotation:"8hr",pattern:"Day",daysOn:5,daysOff:2,formData:null,submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E002",name:"James Wilson",role:"RN",email:"james.w@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440233",avatar:"JW",facilityId:"F001",schedType:"scheduled",rotation:"12hr",pattern:"Day12",daysOn:3,daysOff:4,formData:null,submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E003",name:"Aisha Johnson",role:"LPN",email:"aisha.j@email.com",status:"onboarding",onboardingComplete:false,smartlinxId:null,avatar:"AJ",facilityId:"F002",schedType:null,rotation:null,pattern:null,daysOn:null,daysOff:null,formData:{firstName:"Aisha",lastName:"Johnson"},submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E004",name:"David Chen",role:"CNA",email:"david.c@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440344",avatar:"DC",facilityId:"F001",schedType:"prn",rotation:null,pattern:null,daysOn:null,daysOff:null,formData:null,submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E005",name:"Sarah Kim",role:"RN",email:"sarah.k@email.com",status:"invited",onboardingComplete:false,smartlinxId:null,avatar:"SK",facilityId:"F002",schedType:null,formData:null,submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E006",name:"Tom Rivera",role:"CMA",email:"tom.r@email.com",status:"active",onboardingComplete:true,smartlinxId:"SLX-440455",avatar:"TR",facilityId:"F001",schedType:"scheduled",rotation:"8hr",pattern:"Eve",daysOn:5,daysOff:2,formData:null,submittedDocs:null,cloudBackupAt:null,inviteType:"full",applicationStatus:null},
  {id:"E007",name:"Priya Patel",role:"CMA",email:"priya.p@email.com",status:"review",onboardingComplete:false,smartlinxId:null,avatar:"PP",facilityId:"F001",schedType:null,
    formData:{firstName:"Priya",lastName:"Patel",ssn:"***-**-1234",dob:"1995-03-15",address:"123 Oak St",city:"Austin",state:"TX",zip:"78701",
      app_position:"CMA",app_usCitizen:"yes",app_workAuth:"yes",app_salary:"$15/hr",app_dateAvail:"2026-03-01",
      ec1_name:"Raj Patel",ec1_phone:"(555)111-2222",ec1_relation:"Spouse",
      w4_filingStatus:"married",i9_citizenship:"citizen",
      dps_consent:true,
      dd_bank1Name:"Chase",dd_bank1Routing:"021000021",dd_bank1Account:"****4567",dd_bank1Type:"checking",
      _videosDone:{v1:1,v2:1,v3:1},_policySigned:true},
    submittedDocs:{at:"2026-02-22T14:30:00"},inviteType:"full",applicationStatus:null},
];
const INIT_ADMINS=[
  {id:"A001",name:"Rebecca Torres",email:"rebecca.t@facility.com",status:"active"},
  {id:"A002",name:"Michael Park",email:"michael.p@facility.com",status:"active"},
];
const INIT_SHIFTS=[
  {id:"OS1",date:(()=>{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0]})(),type:"Day",s:"7a",e:"3p",loc:"2A",role:"CNA",need:2,status:"open",notif:[]},
  {id:"OS2",date:(()=>{const d=new Date();d.setDate(d.getDate()+3);return d.toISOString().split("T")[0]})(),type:"Eve",s:"3p",e:"11p",loc:"Main",role:"RN",need:1,status:"open",notif:[]},
  {id:"OS3",date:(()=>{const d=new Date();d.setDate(d.getDate()+5);return d.toISOString().split("T")[0]})(),type:"Night",s:"11p",e:"7a",loc:"3B",role:"CNA",need:1,status:"open",notif:[]},
  {id:"OS4",date:(()=>{const d=new Date();d.setDate(d.getDate()+10);return d.toISOString().split("T")[0]})(),type:"Day12",s:"7a",e:"7p",loc:"MC",role:"CMA",need:2,status:"open",notif:[]},
  {id:"OS5",date:(()=>{const d=new Date();d.setDate(d.getDate()+14);return d.toISOString().split("T")[0]})(),type:"Eve",s:"3p",e:"11p",loc:"2A",role:"CNA",need:1,status:"open",notif:[]},
  {id:"OS6",date:(()=>{const d=new Date();d.setDate(d.getDate()+20);return d.toISOString().split("T")[0]})(),type:"Day",s:"7a",e:"3p",loc:"Main",role:"LPN",need:1,status:"open",notif:[]},
];
const INIT_STEPS={TX:STEPS_TX,OK:STEPS_OK};

// ═══ EMPLOYEE ONBOARDING PORTAL ═══
// State-specific document packages: TX and OK have different forms.
// Shared: Employment App, New Hire Info, Emergency Contacts, Federal W-4, I-9, Direct Deposit, Videos, Policy
// OK only: OK State W-4, BGC (Long Term Care Security Act fingerprint consent)
// TX only: DPS CCH Verification (criminal history)
function OnboardPortal({emp,onSave,onSubmit,steps}){
  const[step,setStep]=useState(0);
  const[fd,setFd]=useState(emp.formData||{});
  const[vids,setVids]=useState(fd._videosDone||{});
  const[signed,setSigned]=useState(!!fd._policySigned);
  const[saving,setSaving]=useState(false);
  const[done,setDone]=useState(false);
  const lastSave=useRef(null);
  const tabsRef=useRef(null);
  const fac=getFacility(emp.facilityId);

  const upd=(k,v)=>setFd(p=>({...p,[k]:v}));
  const Sec=({t})=><p style={{fontSize:13,fontWeight:700,margin:"8px 0 10px",color:"var(--t2)",borderBottom:"1px solid var(--brd2)",paddingBottom:4}}>{t}</p>;
  const PII=()=><div style={{fontSize:10,color:"var(--amber)",display:"flex",alignItems:"center",gap:4,padding:"5px 8px",background:"#FFFBEB",borderRadius:4,border:"1px solid #FDE68A",marginBottom:14}}><I.Lock s={10} c="#D97706"/>PHI/PII — encrypted per HIPAA §164.312</div>;

  const doSave=useCallback(()=>{
    const full={...fd,_videosDone:vids,_policySigned:signed};
    onSave(full);lastSave.current=new Date();
  },[fd,vids,signed,onSave]);

  useEffect(()=>{const t=setInterval(doSave,10000);return()=>clearInterval(t);},[doSave]);
  useEffect(()=>{const el=tabsRef.current?.children[step];if(el)el.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});},[step]);
  // Auto-save on every data change (debounced 2s)
  useEffect(()=>{const t=setTimeout(()=>{setSaving(true);doSave();setTimeout(()=>setSaving(false),400);},2000);return()=>clearTimeout(t);},[fd,vids,signed]);

  const stepOk=(s)=>{
    if(s.id==="app")return!!(fd.firstName&&fd.lastName&&fd.address&&fd.city&&fd.state&&fd.zip&&fd.phone&&fd.ssn&&fd.app_position&&fd.app_usCitizen&&fd.app_workAuth);
    if(s.id==="newhire")return!!(fd.firstName&&fd.lastName&&fd.dob&&fd.nh_hireDate&&fd.nh_title&&fd.nh_status);
    if(s.id==="emergency")return!!(fd.ec1_name&&fd.ec1_phone);
    if(s.id==="w4")return!!fd.w4_filingStatus;
    if(s.id==="okw4")return!!(fd.okw4_filingStatus&&fd.okw4_totalAllowances);
    if(s.id==="i9")return!!fd.i9_citizenship;
    if(s.id==="bgc")return!!fd.bgc_consent;
    if(s.id==="dpscch")return!!fd.dps_consent;
    if(s.id==="deposit")return!!(fd.dd_bank1Name&&fd.dd_bank1Routing&&fd.dd_bank1Account&&fd.dd_bank1Type);
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

  // ─── Employment Application ───
  const FormApp=()=><div className="fi">
    <PII/>
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Employment Application</p>
    <Sec t="Applicant Information"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 14px"}}>
      <Inp label="Last Name" value={fd.lastName||""} onChange={e=>upd("lastName",e.target.value)} req/>
      <Inp label="First Name" value={fd.firstName||""} onChange={e=>upd("firstName",e.target.value)} req/>
      <Inp label="M.I." value={fd.mi||""} onChange={e=>upd("mi",e.target.value)}/>
    </div>
    <Inp label="Street Address" value={fd.address||""} onChange={e=>upd("address",e.target.value)} req/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Apt/Unit" value={fd.apt||""} onChange={e=>upd("apt",e.target.value)}/>
      <Inp label="City" value={fd.city||""} onChange={e=>upd("city",e.target.value)} req/>
      <Inp label="State" value={fd.state||""} onChange={e=>upd("state",e.target.value)} req/>
      <Inp label="ZIP" value={fd.zip||""} onChange={e=>upd("zip",e.target.value)} req/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Phone" value={fd.phone||""} onChange={e=>upd("phone",e.target.value)} placeholder="(555) 123-4567" req/>
      <Inp label="Email" value={fd.email||emp.email||""} disabled/>
      <Inp label="Date Available" type="date" value={fd.app_dateAvail||""} onChange={e=>upd("app_dateAvail",e.target.value)}/>
      <Inp label="Social Security Number" value={fd.ssn||""} onChange={e=>upd("ssn",e.target.value)} placeholder="XXX-XX-XXXX" req note="Encrypted AES-256"/>
      <Inp label="Desired Salary" value={fd.app_salary||""} onChange={e=>upd("app_salary",e.target.value)}/>
      <Inp label="Position Applied For" value={fd.app_position||""} onChange={e=>upd("app_position",e.target.value)} req/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Sel label="US Citizen?" value={fd.app_usCitizen||""} onChange={e=>upd("app_usCitizen",e.target.value)} req><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></Sel>
      <Sel label="Authorized to work in US?" value={fd.app_workAuth||""} onChange={e=>upd("app_workAuth",e.target.value)} req><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></Sel>
      <Sel label="Worked for this company before?" value={fd.app_workedBefore||""} onChange={e=>upd("app_workedBefore",e.target.value)}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></Sel>
      <Sel label="Convicted of a felony?" value={fd.app_felony||""} onChange={e=>upd("app_felony",e.target.value)}><option value="">Select…</option><option value="yes">Yes</option><option value="no">No</option></Sel>
    </div>
    {fd.app_felony==="yes"&&<Inp label="If yes, explain" value={fd.app_felonyExplain||""} onChange={e=>upd("app_felonyExplain",e.target.value)} multiline rows={2}/>}
    <Sec t="Education"/>
    {["High School","College","Other"].map((lv,idx)=><div key={lv}><div style={{fontSize:11,fontWeight:600,color:"var(--t3)",marginBottom:4}}>{lv}</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:"0 8px"}}>
        <Inp label="School/Address" value={fd[`edu${idx}_addr`]||""} onChange={e=>upd(`edu${idx}_addr`,e.target.value)}/>
        <Inp label="From" value={fd[`edu${idx}_from`]||""} onChange={e=>upd(`edu${idx}_from`,e.target.value)}/>
        <Inp label="To" value={fd[`edu${idx}_to`]||""} onChange={e=>upd(`edu${idx}_to`,e.target.value)}/>
        <Sel label="Graduate?" value={fd[`edu${idx}_grad`]||""} onChange={e=>upd(`edu${idx}_grad`,e.target.value)}><option value="">—</option><option>Yes</option><option>No</option></Sel>
        <Inp label="Degree" value={fd[`edu${idx}_deg`]||""} onChange={e=>upd(`edu${idx}_deg`,e.target.value)}/>
      </div></div>)}
    <Sec t="Licenses / Certifications"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:"0 8px"}}>
      <Inp label="Type" value={fd.lic_type||""} onChange={e=>upd("lic_type",e.target.value)} placeholder="CNA, LPN…"/>
      <Inp label="State Issued" value={fd.lic_state||""} onChange={e=>upd("lic_state",e.target.value)}/>
      <Inp label="Issue Date" type="date" value={fd.lic_issue||""} onChange={e=>upd("lic_issue",e.target.value)}/>
      <Inp label="Expiration" type="date" value={fd.lic_exp||""} onChange={e=>upd("lic_exp",e.target.value)}/>
      <Inp label="License #" value={fd.lic_num||""} onChange={e=>upd("lic_num",e.target.value)}/>
    </div>
    <Sec t="References (2 Professional, 1 Personal)"/>
    {[0,1,2].map(i=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0 8px",marginBottom:2}}>
      <Inp label={`Ref ${i+1} Name`} value={fd[`ref${i}_name`]||""} onChange={e=>upd(`ref${i}_name`,e.target.value)} placeholder={i<2?"Professional":"Personal"}/>
      <Inp label="Relationship" value={fd[`ref${i}_rel`]||""} onChange={e=>upd(`ref${i}_rel`,e.target.value)}/>
      <Inp label="Company" value={fd[`ref${i}_co`]||""} onChange={e=>upd(`ref${i}_co`,e.target.value)}/>
      <Inp label="Phone" value={fd[`ref${i}_phone`]||""} onChange={e=>upd(`ref${i}_phone`,e.target.value)}/>
    </div>)}
    <Sec t="Previous Employment"/>
    {[0,1,2].map(i=><Card key={i} style={{padding:12,marginBottom:8,background:"var(--bg)"}}>
      <div style={{fontSize:11,fontWeight:600,color:"var(--t3)",marginBottom:6}}>Employer {i+1}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
        <Inp label="Company" value={fd[`emp${i}_co`]||""} onChange={e=>upd(`emp${i}_co`,e.target.value)}/>
        <Inp label="Phone" value={fd[`emp${i}_phone`]||""} onChange={e=>upd(`emp${i}_phone`,e.target.value)}/>
        <Inp label="Job Title" value={fd[`emp${i}_title`]||""} onChange={e=>upd(`emp${i}_title`,e.target.value)}/>
        <Inp label="Supervisor" value={fd[`emp${i}_super`]||""} onChange={e=>upd(`emp${i}_super`,e.target.value)}/>
        <Inp label="Starting Salary" value={fd[`emp${i}_startPay`]||""} onChange={e=>upd(`emp${i}_startPay`,e.target.value)}/>
        <Inp label="Ending Salary" value={fd[`emp${i}_endPay`]||""} onChange={e=>upd(`emp${i}_endPay`,e.target.value)}/>
        <Inp label="From" type="date" value={fd[`emp${i}_from`]||""} onChange={e=>upd(`emp${i}_from`,e.target.value)}/>
        <Inp label="To" type="date" value={fd[`emp${i}_to`]||""} onChange={e=>upd(`emp${i}_to`,e.target.value)}/>
      </div>
      <Inp label="Responsibilities" value={fd[`emp${i}_resp`]||""} onChange={e=>upd(`emp${i}_resp`,e.target.value)} multiline rows={2}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
        <Inp label="Reason for Leaving" value={fd[`emp${i}_reason`]||""} onChange={e=>upd(`emp${i}_reason`,e.target.value)}/>
        <Sel label="May we contact?" value={fd[`emp${i}_contact`]||""} onChange={e=>upd(`emp${i}_contact`,e.target.value)}><option value="">—</option><option>Yes</option><option>No</option></Sel>
      </div></Card>)}
    <Sec t="Military Service"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:"0 8px"}}>
      <Inp label="Branch" value={fd.mil_branch||""} onChange={e=>upd("mil_branch",e.target.value)}/>
      <Inp label="From" type="date" value={fd.mil_from||""} onChange={e=>upd("mil_from",e.target.value)}/>
      <Inp label="To" type="date" value={fd.mil_to||""} onChange={e=>upd("mil_to",e.target.value)}/>
      <Inp label="Rank at Discharge" value={fd.mil_rank||""} onChange={e=>upd("mil_rank",e.target.value)}/>
      <Sel label="Discharge Type" value={fd.mil_discharge||""} onChange={e=>upd("mil_discharge",e.target.value)}><option value="">—</option><option>Honorable</option><option>General</option><option>Other</option></Sel>
    </div>
    <Sec t="Authorization"/>
    <Card style={{padding:14,fontSize:12,color:"var(--t2)",lineHeight:1.6,marginBottom:10}}>I certify the information in this application is true and complete. I authorize investigation of all statements. Falsification may result in termination. I understand employment is at-will and consent to background checks as required.</Card>
  </div>;

  // ─── New Hire Info (demographics, job details, pay) ───
  const FormNewHire=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>New Hire Form</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>{fac.name} — {fac.address}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Last Name" value={fd.lastName||""} onChange={e=>upd("lastName",e.target.value)} req/>
      <Inp label="First Name" value={fd.firstName||""} onChange={e=>upd("firstName",e.target.value)} req/>
    </div>
    <Inp label="Address" value={fd.address||""} onChange={e=>upd("address",e.target.value)}/>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="City" value={fd.city||""} onChange={e=>upd("city",e.target.value)}/>
      <Inp label="State/ZIP" value={`${fd.state||""} ${fd.zip||""}`} disabled/>
      <Inp label="Phone" value={fd.phone||""} onChange={e=>upd("phone",e.target.value)}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0 10px"}}>
      <Sel label="Gender" value={fd.nh_gender||""} onChange={e=>upd("nh_gender",e.target.value)}><option value="">Select…</option><option>Male</option><option>Female</option></Sel>
      <Inp label="Date of Birth" type="date" value={fd.dob||""} onChange={e=>upd("dob",e.target.value)} req note="PII"/>
      <Inp label="Date of Hire" type="date" value={fd.nh_hireDate||""} onChange={e=>upd("nh_hireDate",e.target.value)} req/>
      <Inp label="SSN" value={fd.ssn||""} onChange={e=>upd("ssn",e.target.value)} note="Encrypted"/>
    </div>
    <Sec t="Position Details"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Job Title" value={fd.nh_title||""} onChange={e=>upd("nh_title",e.target.value)} req/>
      <Inp label="Department" value={fd.nh_dept||""} onChange={e=>upd("nh_dept",e.target.value)}/>
      <Sel label="Status" value={fd.nh_status||""} onChange={e=>upd("nh_status",e.target.value)} req><option value="">Select…</option><option>Full-Time</option><option>Part-Time</option><option>PRN</option><option>Rehire</option></Sel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
      <Inp label="Weekly Scheduled Hours" value={fd.nh_weeklyHrs||""} onChange={e=>upd("nh_weeklyHrs",e.target.value)}/>
      <Inp label="Shift (Daily Hours)" value={fd.nh_shift||""} onChange={e=>upd("nh_shift",e.target.value)} placeholder="7a-3p"/>
    </div>
    <Sec t="Tax Withholding Summary"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Sel label="Marital Status" value={fd.nh_marital||""} onChange={e=>upd("nh_marital",e.target.value)}><option value="">Select…</option><option>Married</option><option>Single</option></Sel>
      <Inp label="# of Exemptions" value={fd.nh_exemptions||""} onChange={e=>upd("nh_exemptions",e.target.value)}/>
      <Sel label="Direct Deposit?" value={fd.nh_ddYes||""} onChange={e=>upd("nh_ddYes",e.target.value)}><option value="">Select…</option><option>Yes</option><option>No</option></Sel>
    </div>
  </div>;

  // ─── Emergency Contacts ───
  const FormEmergency=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Employee Emergency Contact Form</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Employee Name" value={`${fd.firstName||""} ${fd.lastName||""}`} disabled/>
      <Inp label="Home Phone" value={fd.phone||""} onChange={e=>upd("phone",e.target.value)}/>
      <Inp label="Cell Phone" value={fd.ec_cell||""} onChange={e=>upd("ec_cell",e.target.value)}/>
      <Inp label="Email" value={fd.email||emp.email||""} disabled/>
    </div>
    <Sec t="Emergency Contact #1"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Name" value={fd.ec1_name||""} onChange={e=>upd("ec1_name",e.target.value)} req/>
      <Inp label="Relationship" value={fd.ec1_relation||""} onChange={e=>upd("ec1_relation",e.target.value)}/>
      <Inp label="Work Phone" value={fd.ec1_workPhone||""} onChange={e=>upd("ec1_workPhone",e.target.value)}/>
      <Inp label="Cell Phone" value={fd.ec1_phone||""} onChange={e=>upd("ec1_phone",e.target.value)} req/>
    </div>
    <Inp label="Home Address" value={fd.ec1_addr||""} onChange={e=>upd("ec1_addr",e.target.value)}/>
    <Sec t="Emergency Contact #2"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Name" value={fd.ec2_name||""} onChange={e=>upd("ec2_name",e.target.value)}/>
      <Inp label="Relationship" value={fd.ec2_relation||""} onChange={e=>upd("ec2_relation",e.target.value)}/>
      <Inp label="Work Phone" value={fd.ec2_workPhone||""} onChange={e=>upd("ec2_workPhone",e.target.value)}/>
      <Inp label="Cell Phone" value={fd.ec2_phone||""} onChange={e=>upd("ec2_phone",e.target.value)}/>
    </div>
    <Sec t="Physician"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Physician Name" value={fd.ec_physName||""} onChange={e=>upd("ec_physName",e.target.value)}/>
      <Inp label="Phone" value={fd.ec_physPhone||""} onChange={e=>upd("ec_physPhone",e.target.value)}/>
    </div>
    <Sel label="Permission to transport to medical facility?" value={fd.ec_transport||""} onChange={e=>upd("ec_transport",e.target.value)}><option value="">Select…</option><option>Yes</option><option>No</option></Sel>
  </div>;

  // ─── Federal W-4 (2026) ───
  const FormW4=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Form W-4 — Employee's Withholding Certificate (2026)</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>Department of the Treasury — Internal Revenue Service</p>
    <Sec t="Step 1: Personal Info"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="First Name / M.I." value={`${fd.firstName||""} ${fd.mi||""}`} disabled/>
      <Inp label="Last Name" value={fd.lastName||""} disabled/>
      <Inp label="SSN" value={fd.ssn||""} disabled note="From application"/>
    </div>
    <Sel label="Filing Status" value={fd.w4_filingStatus||""} onChange={e=>upd("w4_filingStatus",e.target.value)} req>
      <option value="">Select…</option><option value="single">Single or Married filing separately</option><option value="married">Married filing jointly</option><option value="hoh">Head of household</option></Sel>
    <Sec t="Step 2: Multiple Jobs or Spouse Works"/>
    <Sel label="Multiple Jobs?" value={fd.w4_multipleJobs||""} onChange={e=>upd("w4_multipleJobs",e.target.value)}>
      <option value="">N/A — Only one job</option><option value="yes">Yes — Use worksheet or check box</option></Sel>
    <Sec t="Step 3: Claim Dependents"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Qualifying children under 17 (x $2,200)" type="number" value={fd.w4_dependentsU17||""} onChange={e=>upd("w4_dependentsU17",e.target.value)} placeholder="0"/>
      <Inp label="Other dependents (x $500)" type="number" value={fd.w4_otherDependents||""} onChange={e=>upd("w4_otherDependents",e.target.value)} placeholder="0"/>
    </div>
    <Sec t="Step 4: Other Adjustments (optional)"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="4(a) Other income ($)" value={fd.w4_otherIncome||""} onChange={e=>upd("w4_otherIncome",e.target.value)} placeholder="0"/>
      <Inp label="4(b) Deductions ($)" value={fd.w4_deductions||""} onChange={e=>upd("w4_deductions",e.target.value)} placeholder="0"/>
      <Inp label="4(c) Extra withholding ($/pay)" value={fd.w4_extraWithholding||""} onChange={e=>upd("w4_extraWithholding",e.target.value)} placeholder="0"/>
    </div>
  </div>;

  // ─── OK State W-4 (Oklahoma only) ───
  const FormOKW4=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Form OK-W-4 — Oklahoma Employee's Withholding Allowance Certificate</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>Oklahoma Tax Commission (Revised 3-2021)</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="First Name / M.I." value={`${fd.firstName||""} ${fd.mi||""}`} disabled/>
      <Inp label="Last Name" value={fd.lastName||""} disabled/>
      <Inp label="SSN" value={fd.ssn||""} disabled/>
      <Inp label="Home Address" value={fd.address||""} disabled/>
    </div>
    <Sel label="Filing Status" value={fd.okw4_filingStatus||""} onChange={e=>upd("okw4_filingStatus",e.target.value)} req>
      <option value="">Select…</option><option value="single">Single</option><option value="married">Married</option><option value="married_higher">Married but withhold at higher Single rate</option></Sel>
    <Sec t="Allowances"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Line 1: Yourself (enter 1)" type="number" value={fd.okw4_self||""} onChange={e=>upd("okw4_self",e.target.value)} placeholder="1"/>
      <Inp label="Line 2: Spouse (0 if spouse works)" type="number" value={fd.okw4_spouse||""} onChange={e=>upd("okw4_spouse",e.target.value)} placeholder="0"/>
      <Inp label="Line 3: Dependents" type="number" value={fd.okw4_dependents||""} onChange={e=>upd("okw4_dependents",e.target.value)} placeholder="0"/>
      <Inp label="Line 4: Additional allowances" type="number" value={fd.okw4_additional||""} onChange={e=>upd("okw4_additional",e.target.value)} placeholder="0"/>
    </div>
    <Inp label="Line 5: Total Allowances (sum Lines 1-4)" value={fd.okw4_totalAllowances||""} onChange={e=>upd("okw4_totalAllowances",e.target.value)} req placeholder="1"/>
    <Inp label="Line 6: Additional withholding per pay period ($)" value={fd.okw4_addlWithholding||""} onChange={e=>upd("okw4_addlWithholding",e.target.value)} placeholder="0.00"/>
    <Sel label="Line 7: Exempt from withholding?" value={fd.okw4_exempt||""} onChange={e=>upd("okw4_exempt",e.target.value)}>
      <option value="">No</option><option value="yes">Yes — I claim exemption</option></Sel>
  </div>;

  // ─── Form I-9 ───
  const FormI9=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Form I-9 — Employment Eligibility Verification</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>USCIS · Edition 01/20/25 · Expires 05/31/2027</p>
    <PII/>
    <Sec t="Section 1: Employee Information & Attestation"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Last Name" value={fd.lastName||""} disabled/>
      <Inp label="First Name" value={fd.firstName||""} disabled/>
      <Inp label="Middle Initial" value={fd.mi||""} disabled/>
    </div>
    <Inp label="Other Last Names Used (if any)" value={fd.i9_otherNames||""} onChange={e=>upd("i9_otherNames",e.target.value)}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Date of Birth" value={fd.dob||""} disabled/>
      <Inp label="SSN" value={fd.ssn||""} disabled/>
      <Inp label="Email" value={fd.email||emp.email||""} disabled/>
    </div>
    <Sel label="I attest, under penalty of perjury, that I am:" value={fd.i9_citizenship||""} onChange={e=>upd("i9_citizenship",e.target.value)} req>
      <option value="">Select…</option>
      <option value="citizen">A citizen of the United States</option>
      <option value="noncitizen_national">A noncitizen national of the United States</option>
      <option value="permanent_resident">A lawful permanent resident (Alien Reg. #)</option>
      <option value="alien_authorized">An alien authorized to work until (expiration)</option>
    </Sel>
    {(fd.i9_citizenship==="permanent_resident"||fd.i9_citizenship==="alien_authorized")&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="USCIS A-Number" value={fd.i9_alienNumber||""} onChange={e=>upd("i9_alienNumber",e.target.value)}/>
      <Inp label="I-94 Admission Number" value={fd.i9_i94Number||""} onChange={e=>upd("i9_i94Number",e.target.value)}/>
    </div>}
    <Sec t="Identity & Work Authorization Documents"/>
    <p style={{fontSize:11,color:"var(--t2)",marginBottom:8}}>Provide one List A document OR one List B + one List C document.</p>
    <Sel label="Document Type" value={fd.i9_docType||""} onChange={e=>upd("i9_docType",e.target.value)}>
      <option value="">Select…</option>
      <optgroup label="List A (Identity + Work Auth)"><option value="passport">US Passport</option><option value="passport_card">US Passport Card</option><option value="perm_res_card">Permanent Resident Card</option><option value="foreign_passport">Foreign Passport with I-551</option><option value="ead">Employment Authorization Document</option></optgroup>
      <optgroup label="List B + C"><option value="dl_ssn">Driver License + SSN Card</option><option value="state_id_bc">State ID + Birth Certificate</option><option value="dl_bc">Driver License + Birth Certificate</option></optgroup>
    </Sel>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Document Number" value={fd.i9_docNumber||""} onChange={e=>upd("i9_docNumber",e.target.value)}/>
      <Inp label="Issuing Authority" value={fd.i9_docIssuer||""} onChange={e=>upd("i9_docIssuer",e.target.value)}/>
      <Inp label="Expiration Date" type="date" value={fd.i9_docExpiry||""} onChange={e=>upd("i9_docExpiry",e.target.value)}/>
    </div>
  </div>;

  // ─── OK BGC (Oklahoma Background Check Consent) ───
  const FormBGC=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Oklahoma Long Term Care Security Act</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>Consent & Release for National Background Check (OK-SCREEN / ONBC)</p>
    <PII/>
    <Card style={{padding:14,fontSize:12,color:"var(--t2)",lineHeight:1.6,marginBottom:14,maxHeight:160,overflowY:"auto"}}>
      <p><b>Permanent disqualifiers:</b> Abuse/neglect, rape/incest/sodomy, child abuse, murder, manslaughter, kidnapping, aggravated assault, assault with dangerous weapon, arson 1st degree.</p>
      <p style={{marginTop:8}}><b>7-year disqualifiers:</b> Assault, battery, indecent exposure, burglary 1st/2nd, robbery, arson 2nd, drug offenses, grand/petit larceny, shoplifting.</p>
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="First Name" value={fd.firstName||""} disabled/>
      <Inp label="Middle Name" value={fd.mi||""} onChange={e=>upd("mi",e.target.value)}/>
      <Inp label="Last Name" value={fd.lastName||""} disabled/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Maiden Name" value={fd.bgc_maiden||""} onChange={e=>upd("bgc_maiden",e.target.value)}/>
      <Inp label="Aliases / Other Names" value={fd.bgc_aliases||""} onChange={e=>upd("bgc_aliases",e.target.value)}/>
      <Inp label="Date of Birth" value={fd.dob||""} disabled/>
      <Inp label="SSN" value={fd.ssn||""} disabled note="Encrypted"/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0 8px"}}>
      <Inp label="State of Birth" value={fd.bgc_stateOfBirth||""} onChange={e=>upd("bgc_stateOfBirth",e.target.value)}/>
      <Inp label="Country of Birth" value={fd.bgc_countryOfBirth||""} onChange={e=>upd("bgc_countryOfBirth",e.target.value)} placeholder="USA"/>
      <Sel label="Race" value={fd.bgc_race||""} onChange={e=>upd("bgc_race",e.target.value)}><option value="">Select…</option><option>White</option><option>Black</option><option>Hispanic</option><option>Asian</option><option>Native American</option><option>Other</option></Sel>
      <Sel label="Gender" value={fd.bgc_gender||""} onChange={e=>upd("bgc_gender",e.target.value)}><option value="">Select…</option><option>Male</option><option>Female</option></Sel>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"0 8px"}}>
      <Inp label="Height" value={fd.bgc_height||""} onChange={e=>upd("bgc_height",e.target.value)} placeholder="5'8&quot;"/>
      <Inp label="Weight" value={fd.bgc_weight||""} onChange={e=>upd("bgc_weight",e.target.value)} placeholder="160"/>
      <Inp label="Hair Color" value={fd.bgc_hair||""} onChange={e=>upd("bgc_hair",e.target.value)}/>
      <Inp label="Eye Color" value={fd.bgc_eyes||""} onChange={e=>upd("bgc_eyes",e.target.value)}/>
    </div>
    <Inp label="Other states lived in after age 17" value={fd.bgc_otherStates||""} onChange={e=>upd("bgc_otherStates",e.target.value)}/>
    <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:fd.bgc_consent?"var(--greenL)":"var(--hover)",border:`1px solid ${fd.bgc_consent?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)"}}>
      <input type="checkbox" checked={!!fd.bgc_consent} onChange={e=>upd("bgc_consent",e.target.checked)} style={{marginTop:2,width:18,height:18,accentColor:"var(--green)"}}/>
      <div><div style={{fontSize:13,fontWeight:600}}>I consent to a national criminal background check</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Per the Oklahoma Long Term Care Security Act — {emp.name} — {new Date().toLocaleDateString()}</div></div>
    </label>
  </div>;

  // ─── TX DPS CCH Verification (Texas only) ───
  const FormDPS=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Texas DPS Criminal Conviction History Verification</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>Texas Department of Public Safety</p>
    <PII/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
      <Inp label="Full Legal Name" value={`${fd.firstName||""} ${fd.mi||""} ${fd.lastName||""}`} disabled/>
      <Inp label="Date of Birth" value={fd.dob||""} disabled/>
      <Inp label="SSN" value={fd.ssn||""} disabled note="Encrypted"/>
      <Inp label="Driver License / ID #" value={fd.dps_dlNumber||""} onChange={e=>upd("dps_dlNumber",e.target.value)} placeholder="TX DL Number"/>
    </div>
    <Inp label="Current Address" value={`${fd.address||""}, ${fd.city||""}, ${fd.state||""} ${fd.zip||""}`} disabled/>
    <Inp label="Aliases / Other Names" value={fd.dps_aliases||""} onChange={e=>upd("dps_aliases",e.target.value)}/>
    <Card style={{padding:14,fontSize:12,color:"var(--t2)",lineHeight:1.6,marginBottom:14}}>
      <p>I hereby authorize {fac.name} to obtain a criminal conviction history record check from the Texas Department of Public Safety. I understand that the information obtained may be used to determine my suitability for employment in a long-term care facility.</p>
    </Card>
    <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:fd.dps_consent?"var(--greenL)":"var(--hover)",border:`1px solid ${fd.dps_consent?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)",marginBottom:8}}>
      <input type="checkbox" checked={!!fd.dps_consent} onChange={e=>upd("dps_consent",e.target.checked)} style={{marginTop:2,width:18,height:18,accentColor:"var(--green)"}}/>
      <div><div style={{fontSize:13,fontWeight:600}}>I consent to a Texas DPS criminal history check</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Electronic authorization — {emp.name} — {new Date().toLocaleDateString()}</div></div>
    </label>
    <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"12px 14px",background:fd.dps_ackRights?"var(--greenL)":"var(--hover)",border:`1px solid ${fd.dps_ackRights?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)"}}>
      <input type="checkbox" checked={!!fd.dps_ackRights} onChange={e=>upd("dps_ackRights",e.target.checked)} style={{marginTop:2,width:18,height:18,accentColor:"var(--green)"}}/>
      <div><div style={{fontSize:13,fontWeight:600}}>I acknowledge my right to review and challenge the results</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>Per Texas Government Code §411.085</div></div>
    </label>
  </div>;

  // ─── Direct Deposit ───
  const FormDeposit=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Direct Deposit Agreement</p>
    <p style={{fontSize:11,color:"var(--t3)",marginBottom:14}}>Authorizes {fac.name} for automatic payroll deposits.</p>
    <Sec t="Financial Institution #1 (Primary)"/>
    <Inp label="Bank/Credit Union Name" value={fd.dd_bank1Name||""} onChange={e=>upd("dd_bank1Name",e.target.value)} placeholder="Chase, Wells Fargo…" req/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Routing Number" value={fd.dd_bank1Routing||""} onChange={e=>upd("dd_bank1Routing",e.target.value)} placeholder="9 digits" req note="Encrypted"/>
      <Inp label="Account Number" value={fd.dd_bank1Account||""} onChange={e=>upd("dd_bank1Account",e.target.value)} req note="Encrypted"/>
      <Sel label="Account Type" value={fd.dd_bank1Type||""} onChange={e=>upd("dd_bank1Type",e.target.value)} req><option value="">Select…</option><option value="checking">Checking</option><option value="savings">Savings</option></Sel>
    </div>
    <Inp label="Deposit Amount (or 'Net')" value={fd.dd_bank1Amount||""} onChange={e=>upd("dd_bank1Amount",e.target.value)} placeholder="Net pay or $ amount"/>
    <Sec t="Financial Institution #2 (Optional)"/>
    <Inp label="Bank/Credit Union Name" value={fd.dd_bank2Name||""} onChange={e=>upd("dd_bank2Name",e.target.value)}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 10px"}}>
      <Inp label="Routing Number" value={fd.dd_bank2Routing||""} onChange={e=>upd("dd_bank2Routing",e.target.value)} note="Encrypted"/>
      <Inp label="Account Number" value={fd.dd_bank2Account||""} onChange={e=>upd("dd_bank2Account",e.target.value)} note="Encrypted"/>
      <Sel label="Account Type" value={fd.dd_bank2Type||""} onChange={e=>upd("dd_bank2Type",e.target.value)}><option value="">—</option><option value="checking">Checking</option><option value="savings">Savings</option></Sel>
    </div>
    <div style={{padding:10,background:"var(--blueL)",borderRadius:"var(--rs)",marginTop:8,fontSize:11,color:"var(--blue)"}}><b>Tip:</b> Attach a voided check or deposit slip for verification. Changes take 1-2 pay cycles to take effect.</div>
  </div>;

  // ─── Training Videos ───
  const VIDS=[{id:"v1",t:"Welcome & Orientation",d:"4:32"},{id:"v2",t:"Workplace Safety",d:"8:15"},
    {id:"v3",t:"HIPAA Compliance",d:"12:45"},{id:"v4",t:"Emergency Procedures",d:"6:20"},
    {id:"v5",t:"Resident Care Standards",d:"10:08"}];
  const FormVids=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:4}}>Required Training Videos</p>
    <p style={{fontSize:12,color:"var(--t3)",marginBottom:14}}>Complete at least 3 required videos. Click play to watch. Progress saves automatically.</p>
    {VIDS.map(v=>{const ok=vids[v.id];return <div key={v.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:ok?"var(--greenL)":"#fff",border:`1px solid ${ok?"#A7F3D0":"var(--brd)"}`,borderRadius:"var(--rs)",marginBottom:6}}>
      <div onClick={()=>{if(!ok)setVids(p=>({...p,[v.id]:1}));}} style={{width:36,height:36,borderRadius:"var(--rs)",background:ok?"var(--green)":"var(--purpleL)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        {ok?<I.Check s={16} c="#fff"/>:<I.Play s={16} c="#7C3AED"/>}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:ok?"var(--green)":"var(--t1)"}}>{v.t}</div><div style={{fontSize:11,color:"var(--t3)"}}>{v.d}</div></div>
      {ok&&<Badge v="success">Done</Badge>}
    </div>;})}
  </div>;

  // ─── Policy Acknowledgment ───
  const FormPolicy=()=><div className="fi">
    <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Policy Acknowledgment</p>
    {/* Employee Handbook Download */}
    <div style={{padding:14,background:"var(--bg)",border:"1px solid var(--brd)",borderRadius:"var(--rs)",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:32,height:32,borderRadius:"var(--rs)",background:"var(--blueL)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.File s={16} c="#2563EB"/></div>
      {HANDBOOK_PDF.url?<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Employee Handbook</div><div style={{fontSize:11,color:"var(--t3)"}}>Download and review before signing</div></div>:<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"var(--t3)"}}>Employee Handbook</div><div style={{fontSize:11,color:"var(--t3)"}}>PDF will be available here</div></div>}
      {HANDBOOK_PDF.url&&<a href={HANDBOOK_PDF.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:"var(--rs)",background:"var(--blue)",color:"#fff",fontSize:12,fontWeight:600,textDecoration:"none"}}><I.File s={12} c="#fff"/>Download PDF</a>}
    </div>
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

  const isAppOnly=steps.length===1&&steps[0].id==="app";

  if(done)return <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="su" style={{textAlign:"center",maxWidth:380}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"var(--greenL)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I.Check s={28} c="#059669"/></div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{isAppOnly?"Application Submitted!":"Submitted!"}</h2>
      <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>{isAppOnly?"Your application has been sent to admin for review. You'll be notified once a decision is made.":"Your paperwork has been sent to admin for review. You'll be notified once approved and your schedule will appear here."}</p>
    </div></div>;

  return <div style={{maxWidth:900,margin:"0 auto"}}>
    <HipaaBar/>
    <div style={{padding:"20px 20px 0"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700}}>Welcome, {emp.name.split(" ")[0]}</h1>
          <p style={{fontSize:12,color:"var(--t3)",marginTop:2}}>{fac.name} ({fac.state}) · Complete your onboarding below · saves automatically</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {saving&&<Spinner size={12}/>}
          {lastSave.current&&<span style={{fontSize:10,color:"var(--t3)"}}>{saving?"Saving…":`Auto-saved ${lastSave.current.toLocaleTimeString()}`}</span>}
        </div>
      </div>

      {/* Progress */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <div style={{flex:1,height:5,background:"var(--hover)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:pct===100?"var(--green)":"var(--blue)",borderRadius:3,transition:"width .4s"}}/></div>
        <span style={{fontSize:13,fontWeight:700,color:pct===100?"var(--green)":"var(--blue)"}}>{pct}%</span>
      </div>

      {/* Step tabs */}
      <div ref={tabsRef} style={{display:"flex",gap:3,marginBottom:18,overflowX:"auto",paddingBottom:2,scrollBehavior:"smooth"}}>
        {steps.map((s,i)=>{const ok=stepOk(s);const act=i===step;return <button key={s.id} onClick={()=>setStep(i)} style={{
          display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:"var(--rs)",
          border:act?"2px solid var(--blue)":"1px solid var(--brd)",fontSize:12,fontWeight:600,fontFamily:"inherit",
          background:act?"var(--blueL)":ok?"var(--greenL)":"#fff",cursor:"pointer",
          color:act?"var(--blue)":ok?"var(--green)":"var(--t2)",whiteSpace:"nowrap",flexShrink:0}}>
          {I[s.icon]&&<span style={{display:"flex"}}>{(() => {const Ic=I[s.icon];return <Ic s={14} c={act?"#2563EB":ok?"#059669":"#94A3B8"}/>;})()}</span>}{s.label}{ok&&<I.Check s={12} c="#059669"/>}
        </button>;})}
      </div>

      {/* Form */}
      <Card style={{padding:22,marginBottom:18,maxHeight:"60vh",overflowY:"auto"}}>
        {cur.id==="app"&&<FormApp/>}
        {cur.id==="newhire"&&<FormNewHire/>}
        {cur.id==="emergency"&&<FormEmergency/>}
        {cur.id==="w4"&&<FormW4/>}
        {cur.id==="okw4"&&<FormOKW4/>}
        {cur.id==="i9"&&<FormI9/>}
        {cur.id==="bgc"&&<FormBGC/>}
        {cur.id==="dpscch"&&<FormDPS/>}
        {cur.id==="deposit"&&<FormDeposit/>}
        {cur.id==="videos"&&<FormVids/>}
        {cur.id==="policy"&&<FormPolicy/>}
      </Card>

      {/* Nav + submit */}
      <div style={{display:"flex",justifyContent:"space-between",paddingBottom:28}}>
        <Btn v="secondary" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} icon={<I.Left/>}>Prev</Btn>
        <div style={{display:"flex",gap:8}}>
          {step<steps.length-1&&<Btn v="secondary" onClick={()=>setStep(step+1)}>Next <I.Right c="#475569"/></Btn>}
          {allOk&&<Btn onClick={doSubmit} icon={<I.Send s={14} c="#fff"/>}>{isAppOnly?"Submit Application":"Submit All Paperwork"}</Btn>}
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
        <it.icon s={16} c={a?"#1D4ED8":"#2563EB"}/>{it.label}
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
    {l:"App Approved",v:emps.filter(e=>e.status==="app_approved").length,ic:I.Check,c:"var(--purple)",bg:"var(--purpleL)"},
    {l:"Invited",v:emps.filter(e=>e.status==="invited").length,ic:I.Mail,c:"var(--blue)",bg:"var(--blueL)"},
    {l:"Synced",v:emps.filter(e=>e.smartlinxId).length,ic:I.Sync,c:"var(--cyan)",bg:"var(--cyanL)"},
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
        {emps.filter(e=>!e.onboardingComplete||e.status==="app_approved").map((e,i)=><div key={e.id} className="fi" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:"var(--rs)",marginBottom:3,background:"var(--bg)",border:"1px solid var(--brd2)",animationDelay:`${i*.05}s`}}>
          <Avatar initials={e.avatar} size={28}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{e.role}</div></div>
          <Badge v={e.status==="review"?"danger":e.status==="app_approved"?"purple":e.status==="onboarding"?"warning":"info"}>{e.status==="app_approved"?"App Approved":e.status}</Badge>
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
  const[invF,setInvF]=useState("F001");
  const[invType,setInvType]=useState("full");
  const[sending,setSending]=useState(false);

  const closeInv=()=>{setShowInv(false);setInvN("");setInvE("");setInvType("full");};
  const sendInv=async()=>{if(!invE||!invN)return;setSending(true);await new Promise(r=>setTimeout(r,1000));
    setEmps(p=>[...p,{id:`E${String(p.length+1).padStart(3,"0")}`,name:invN,email:invE,role:invR,status:"invited",onboardingComplete:false,smartlinxId:null,avatar:invN.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),facilityId:invF,formData:null,submittedDocs:null,cloudBackupAt:null,schedType:null,rotation:null,pattern:null,daysOn:null,daysOff:null,inviteType:invType,applicationStatus:null}]);
    setSending(false);closeInv();};

  const sendPaperwork=(empId)=>{setEmps(p=>p.map(e=>e.id===empId?{...e,inviteType:"paperwork",status:"invited",applicationStatus:"approved"}:e));};

  const fl=filter==="all"?emps:emps.filter(e=>e.status===filter||(filter==="app_approved"&&e.status==="app_approved")||(filter==="app_rejected"&&e.status==="app_rejected"));
  const ct=k=>k==="all"?emps.length:emps.filter(e=>e.status===k).length;

  const statusBadge=(e)=>{
    if(e.status==="app_approved")return <Badge v="purple">App Approved</Badge>;
    if(e.status==="app_rejected")return <Badge v="danger">App Rejected</Badge>;
    return <Badge v={e.status==="active"?"success":e.status==="review"?"danger":e.status==="onboarding"?"warning":"info"}>{e.status}</Badge>;
  };
  const progressText=(e)=>{
    if(e.status==="active")return"Complete";
    if(e.status==="review")return"Awaiting review";
    if(e.status==="onboarding")return"Filling forms";
    if(e.status==="app_approved")return null;
    if(e.status==="app_rejected")return"Application rejected";
    return"Invite sent";
  };

  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Employees</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>Invite, track, manage</p></div>
      <Btn onClick={()=>setShowInv(true)} icon={<I.Mail s={14} c="#fff"/>}>Send Invite</Btn>
    </div>
    <div style={{display:"flex",gap:3,marginBottom:14,flexWrap:"wrap"}}>
      {[["all","All"],["invited","Invited"],["onboarding","Filling"],["review","Review"],["app_approved","App Approved"],["active","Active"]].map(([k,l])=>
        <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 12px",borderRadius:"var(--rs)",border:filter===k?"2px solid var(--blue)":"1px solid var(--brd)",background:filter===k?"var(--blueL)":"#fff",fontFamily:"inherit",fontSize:11,fontWeight:600,color:filter===k?"var(--blue)":"var(--t2)",cursor:"pointer"}}>{l} ({ct(k)})</button>)}
    </div>
    <Card style={{overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:"1px solid var(--brd)"}}>
      {["Employee","Role","Facility","Status","Progress","SmartLinx"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",background:"var(--bg)"}}>{h}</th>)}</tr></thead>
      <tbody>{fl.map((e,i)=><tr key={e.id} className="fi" style={{borderBottom:"1px solid var(--brd2)",animationDelay:`${i*.03}s`}}>
        <td style={{padding:"10px 16px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar initials={e.avatar} size={30}/><div><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:10,color:"var(--t3)"}}>{e.email}</div></div></div></td>
        <td style={{padding:"10px 16px",fontSize:12,color:"var(--t2)"}}>{e.role}</td>
        <td style={{padding:"10px 16px",fontSize:11,color:"var(--t2)"}}>{getFacility(e.facilityId).name.split(" ").slice(0,2).join(" ")}</td>
        <td style={{padding:"10px 16px"}}>{statusBadge(e)}</td>
        <td style={{padding:"10px 16px",fontSize:11,color:"var(--t3)"}}>{e.status==="app_approved"?<Btn size="sm" v="primary" icon={<I.Send s={12} c="#fff"/>} onClick={()=>sendPaperwork(e.id)}>Send Paperwork</Btn>:progressText(e)}</td>
        <td style={{padding:"10px 16px"}}>{e.smartlinxId?<span style={{fontSize:11,color:"var(--green)",fontFamily:"monospace"}}>{e.smartlinxId}</span>:<span style={{color:"var(--t3)",fontSize:11}}>—</span>}</td>
      </tr>)}</tbody></table></Card>
    <Modal open={showInv} onClose={closeInv} title="Send Onboarding Invite">
      <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>{invType==="app_only"?"Send only the Employment Application for screening before hiring.":invType==="paperwork"?"Send new hire paperwork (no application) for already-approved applicants.":"New hire receives the full package — application + all paperwork. They can save & resume across sessions."}</p>
      {/* Invite Type Selector */}
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:8}}>Invite Type</label>
        <div style={{display:"flex",gap:6}}>
          {[["full","Full Bundle","Application + all paperwork"],["app_only","Application Only","Screen before hiring"],["paperwork","New Hire Paperwork","Already-approved applicant"]].map(([v,l,d])=>
            <button key={v} onClick={()=>setInvType(v)} style={{flex:1,padding:"10px 8px",borderRadius:"var(--rs)",border:invType===v?"2px solid var(--blue)":"1px solid var(--brd)",background:invType===v?"var(--blueL)":"#fff",fontFamily:"inherit",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:600,color:invType===v?"var(--blue)":"var(--t2)"}}>{l}</div>
              <div style={{fontSize:10,color:invType===v?"var(--blue)":"var(--t3)",marginTop:2}}>{d}</div>
            </button>)}
        </div>
      </div>
      <Inp label="Full Name" value={invN} onChange={e=>setInvN(e.target.value)} placeholder="Jane Smith" req/>
      <Inp label="Email" type="email" value={invE} onChange={e=>setInvE(e.target.value)} placeholder="jane@email.com" req/>
      <Sel label="Role" value={invR} onChange={e=>setInvR(e.target.value)} req>{["CNA","CMA","LPN","RN","Dietary","Housekeeping","Maintenance"].map(r=><option key={r}>{r}</option>)}</Sel>
      <Sel label="Facility" value={invF} onChange={e=>setInvF(e.target.value)} req>{FACILITIES.map(f=><option key={f.id} value={f.id}>{f.name} ({f.state})</option>)}</Sel>
      <div style={{padding:10,background:"var(--blueL)",borderRadius:"var(--rs)",marginBottom:14,fontSize:11,color:"var(--blue)"}}>
        <b>{invType==="app_only"?"Document:":invType==="paperwork"?"Package:":"Full Package:"}</b>{" "}
        {invType==="app_only"?"Employment Application only":invType==="paperwork"?`New hire paperwork — ${getFacility(invF).state==="OK"?"Oklahoma (OK-W-4, Background Check)":"Texas (DPS CCH Verification)"}`:`Application + ${getFacility(invF).state==="OK"?"Oklahoma (OK-W-4, Background Check)":"Texas (DPS CCH Verification)"}`}
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={closeInv}>Cancel</Btn>
        <Btn onClick={sendInv} disabled={!invN||!invE||sending} icon={sending?<Spinner size={12}/>:<I.Send s={13} c="#fff"/>}>{sending?"Sending…":"Send Invite"}</Btn></div>
    </Modal></div>;
}

// ═══ DOC REVIEW QUEUE ═══
function ReviewView({emps,setEmps}){
  const[syncing,setSyncing]=useState(null);const[viewDoc,setViewDoc]=useState(null);
  const[rates,setRates]=useState({});  // {empId: hourlyRate string}
  const pending=emps.filter(e=>e.status==="review");
  const hasRate=(id)=>!!(rates[id]&&rates[id].trim());
  const isAppOnlyEmp=(e)=>e.inviteType==="app_only";

  const upload=async(id)=>{if(!hasRate(id))return;setSyncing(id);const r=await SLX.syncEmployee();
    setEmps(p=>p.map(e=>e.id===id?{...e,status:"active",onboardingComplete:true,smartlinxId:r.id,formData:{...e.formData,admin_hourlyRate:rates[id]}}:e));setSyncing(null);};

  const approveApp=(id)=>{setEmps(p=>p.map(e=>e.id===id?{...e,status:"app_approved",applicationStatus:"approved"}:e));};
  const rejectApp=(id)=>{setEmps(p=>p.map(e=>e.id===id?{...e,status:"app_rejected",applicationStatus:"rejected"}:e));};

  const Row=({l,v})=><div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--brd2)"}}><span style={{fontSize:12,color:"var(--t3)"}}>{l}</span><span style={{fontSize:12,fontWeight:600}}>{v||"—"}</span></div>;

  const subTypeBadge=(e)=>{
    if(e.inviteType==="app_only")return <Badge v="purple">Application Only</Badge>;
    if(e.inviteType==="paperwork")return <Badge v="cyan">Paperwork</Badge>;
    return <Badge v="info">Full Bundle</Badge>;
  };

  return <div className="fi">
    <h1 style={{fontSize:22,fontWeight:700,marginBottom:2}}>Document Review</h1>
    <p style={{color:"var(--t3)",fontSize:12,marginBottom:16}}>Review submitted docs → upload to SmartLinx</p>
    {pending.length===0?<Card style={{padding:40,textAlign:"center"}}><I.Inbox s={36} c="#CBD5E1"/><p style={{marginTop:10,color:"var(--t3)",fontSize:13}}>No documents awaiting review</p></Card>
    :pending.map((e,i)=>{const appOnly=isAppOnlyEmp(e);return <Card key={e.id} className="fi" style={{padding:18,marginBottom:10,borderLeft:`4px solid ${appOnly?"var(--purple)":hasRate(e.id)?"var(--green)":"var(--amber)"}`,animationDelay:`${i*.07}s`}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Avatar initials={e.avatar} size={38}/>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>{e.name} {subTypeBadge(e)}</div><div style={{fontSize:12,color:"var(--t3)"}}>{e.role} · Submitted {e.submittedDocs?.at?new Date(e.submittedDocs.at).toLocaleDateString():""}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {appOnly?<>
            <Btn size="sm" v="secondary" icon={<I.Eye s={13}/>} onClick={()=>setViewDoc(e.id)}>Review</Btn>
            <Btn size="sm" v="success" icon={<I.Check s={12} c="#059669"/>} onClick={()=>approveApp(e.id)}>Approve App</Btn>
            <Btn size="sm" v="danger" icon={<I.X s={12} c="#DC2626"/>} onClick={()=>rejectApp(e.id)}>Reject</Btn>
          </>:<>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <label style={{fontSize:10,fontWeight:600,color:"var(--t2)",whiteSpace:"nowrap"}}>Rate $/hr</label>
              <input type="text" value={rates[e.id]||""} onChange={ev=>setRates(p=>({...p,[e.id]:ev.target.value}))} placeholder="0.00" style={{width:72,padding:"6px 8px",border:`1px solid ${hasRate(e.id)?"var(--green)":"var(--red)"}`,borderRadius:"var(--rs)",fontSize:12,fontFamily:"inherit",fontWeight:600,textAlign:"right"}}/>
            </div>
            <Btn size="sm" v="secondary" icon={<I.Eye s={13}/>} onClick={()=>setViewDoc(e.id)}>Review</Btn>
            <Btn size="sm" icon={syncing===e.id?<Spinner size={12}/>:<I.Upload s={13} c="#fff"/>} onClick={()=>upload(e.id)} disabled={syncing===e.id||!hasRate(e.id)}>{syncing===e.id?"Uploading…":"Upload to SmartLinx"}</Btn>
          </>}
        </div>
      </div>
      {!appOnly&&!hasRate(e.id)&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:10,padding:"8px 12px",background:"var(--redL)",borderRadius:"var(--rs)",border:"1px solid #FECACA",fontSize:11,color:"var(--red)"}}><I.Alert s={13} c="#DC2626"/>Enter hourly rate before uploading to SmartLinx</div>}
    </Card>;})}
    <Modal open={!!viewDoc} onClose={()=>setViewDoc(null)} title="Review Documents" width={640}>
      {viewDoc&&(()=>{const e=emps.find(x=>x.id===viewDoc);if(!e?.formData)return null;const d=e.formData;const fac=getFacility(e.facilityId);const st=fac.state;const appOnly=isAppOnlyEmp(e);const isPaperwork=e.inviteType==="paperwork";
        return <div>
          <div style={{fontSize:10,color:"var(--amber)",display:"flex",alignItems:"center",gap:4,padding:"5px 8px",background:"#FFFBEB",borderRadius:4,border:"1px solid #FDE68A",marginBottom:14}}><I.Lock s={10} c="#D97706"/>PHI/PII — Authorized access logged per HIPAA §164.312(b)</div>
          <div style={{padding:10,background:"var(--blueL)",borderRadius:"var(--rs)",marginBottom:14,fontSize:11,color:"var(--blue)",display:"flex",alignItems:"center",gap:6}}><I.Building s={13} c="#2563EB"/><b>{fac.name}</b> — {st} document package · {subTypeBadge(e)}</div>
          {/* Personal Info + Position — always shown */}
          <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",marginBottom:8,borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Personal Information</p>
          <Row l="Name" v={`${d.firstName||""} ${d.mi?d.mi+". ":""}${d.lastName||""}`}/><Row l="DOB" v={d.dob}/><Row l="SSN" v={d.ssn}/><Row l="Address" v={`${d.address||""}, ${d.city||""} ${d.state||""} ${d.zip||""}`}/><Row l="Phone" v={d.phone}/><Row l="Position" v={d.app_position}/>
          {/* Sections only for paperwork or full */}
          {!appOnly&&<>
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Emergency Contacts</p>
            <Row l="Contact 1" v={d.ec1_name?`${d.ec1_name} (${d.ec1_relation||""}) ${d.ec1_phone||""}`:""}/><Row l="Contact 2" v={d.ec2_name?`${d.ec2_name} (${d.ec2_relation||""}) ${d.ec2_phone||""}`:"—"}/>
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Tax & Eligibility</p>
            <Row l="W-4 Filing" v={d.w4_filingStatus}/>{st==="OK"&&<Row l="OK W-4 Filing" v={d.okw4_filingStatus}/>}{st==="OK"&&<Row l="OK Allowances" v={d.okw4_totalAllowances}/>}
            <Row l="I-9 Citizenship" v={d.i9_citizenship}/>
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Background Check</p>
            {st==="TX"?<Row l="TX DPS CCH" v={d.dps_consent?"Consent Given":"Not Consented"}/>:<Row l="OK BGC" v={d.bgc_consent?"Consent Given":"Not Consented"}/>}
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Direct Deposit</p>
            <Row l="Bank 1" v={d.dd_bank1Name}/><Row l="Routing" v={d.dd_bank1Routing}/><Row l="Account" v={d.dd_bank1Account}/><Row l="Type" v={d.dd_bank1Type}/>
            {d.dd_bank2Name&&<><Row l="Bank 2" v={d.dd_bank2Name}/><Row l="Routing 2" v={d.dd_bank2Routing}/><Row l="Account 2" v={d.dd_bank2Account}/></>}
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Training & Policy</p>
            <Row l="Videos" v={d._videosDone?`${Object.keys(d._videosDone).length}/3 complete`:"Not started"}/><Row l="Policy Signed" v={d._policySigned?"Yes":"No"}/>
            <p style={{fontSize:12,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",margin:"12px 0 8px",borderBottom:"1px solid var(--brd)",paddingBottom:4}}>Compensation (Admin)</p>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",whiteSpace:"nowrap"}}>Hourly Rate ($)</label>
              <input type="text" value={rates[viewDoc]||""} onChange={ev=>setRates(p=>({...p,[viewDoc]:ev.target.value}))} placeholder="0.00" style={{width:120,padding:"8px 12px",border:`1px solid ${hasRate(viewDoc)?"var(--green)":"var(--red)"}`,borderRadius:"var(--rs)",fontSize:14,fontFamily:"inherit",fontWeight:700,textAlign:"right"}}/>
            </div>
            {!hasRate(viewDoc)&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"var(--redL)",borderRadius:"var(--rs)",border:"1px solid #FECACA",fontSize:11,color:"var(--red)",marginBottom:8}}><I.Alert s={13} c="#DC2626"/>Hourly rate is required before uploading to SmartLinx</div>}
          </>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}>
            <Btn v="secondary" onClick={()=>setViewDoc(null)}>Close</Btn>
            {appOnly?<>
              <Btn v="danger" icon={<I.X s={13} c="#DC2626"/>} onClick={()=>{rejectApp(viewDoc);setViewDoc(null);}}>Reject</Btn>
              <Btn v="success" icon={<I.Check s={13} c="#fff"/>} onClick={()=>{approveApp(viewDoc);setViewDoc(null);}}>Approve Application</Btn>
            </>:
              <Btn icon={<I.Upload s={13} c="#fff"/>} disabled={!hasRate(viewDoc)} onClick={()=>{upload(viewDoc);setViewDoc(null);}}>Approve & Upload to SmartLinx</Btn>}
          </div>
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

// ═══ EMPLOYEE SCHEDULE VIEW (Month View + Open Shift Requests + Time-Off Requests) ═══
function EmployeeScheduleView({emps,shifts,shiftReqs,setShiftReqs,timeOffReqs,setTimeOffReqs,myEmpId}){
  const[sched,setSched]=useState([]);const[loading,setLoading]=useState(true);
  const[monthOff,setMonthOff]=useState(0);
  const[confirmShift,setConfirmShift]=useState(null); // for open shift pickup
  const[confirmOff,setConfirmOff]=useState(null);      // for time-off request
  const[offReason,setOffReason]=useState("");
  const[requesting,setRequesting]=useState(false);

  const me=emps.find(e=>e.id===myEmpId);
  const myRole=me?.role||"CNA";

  useEffect(()=>{(async()=>{setLoading(true);await SLX.fetchSchedule();setSched(genSched(62));setLoading(false);})();},[]);

  const today=new Date();
  const viewMonth=new Date(today.getFullYear(),today.getMonth()+monthOff,1);
  const yr=viewMonth.getFullYear();const mo=viewMonth.getMonth();
  const daysInMonth=new Date(yr,mo+1,0).getDate();
  const firstDow=new Date(yr,mo,1).getDay();
  const monthLabel=viewMonth.toLocaleDateString("en-US",{month:"long",year:"numeric"});

  const calDays=[];
  for(let i=0;i<firstDow;i++)calDays.push(null);
  for(let d=1;d<=daysInMonth;d++)calDays.push(d);

  const fmtDate=(d)=>{const mm=String(mo+1).padStart(2,"0");const dd=String(d).padStart(2,"0");return`${yr}-${mm}-${dd}`;};

  // Parse shift start time to compute 72-hour cutoff
  const parseShiftStart=(dateStr,timeStr)=>{
    const m=timeStr.match(/(\d+):?(\d*)([ap])/i);
    if(!m)return new Date(dateStr+"T08:00:00");
    let h=parseInt(m[1]);const min=parseInt(m[2]||"0");
    if(m[3].toLowerCase()==="p"&&h!==12)h+=12;
    if(m[3].toLowerCase()==="a"&&h===12)h=0;
    return new Date(dateStr+`T${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}:00`);
  };

  const shC={Day:"#2563EB",Eve:"#7C3AED",Night:"#475569",Day12:"#0891B2",Nite12:"#1E293B"};
  const todayStr=today.toISOString().split("T")[0];

  // ── Open shift slot status ──
  const getSlotStatus=(sh)=>{
    const myReq=shiftReqs.find(r=>r.shiftId===sh.id&&r.empId===myEmpId&&r.status==="pending");
    if(myReq)return"pending_mine";
    const myApproved=shiftReqs.find(r=>r.shiftId===sh.id&&r.empId===myEmpId&&r.status==="approved");
    if(myApproved)return"approved";
    const pendingCount=shiftReqs.filter(r=>r.shiftId===sh.id&&r.status==="pending").length;
    if(pendingCount>=sh.need)return"pending_full";
    if(pendingCount>0)return"pending_others";
    return"open";
  };

  // ── Time-off status for an assigned shift ──
  const getOffStatus=(sh)=>{
    const req=timeOffReqs.find(r=>r.shiftId===sh.id&&r.empId===myEmpId);
    if(!req)return null;
    return req.status; // "pending"|"approved"|"rejected"
  };

  const canRequestOff=(sh)=>{
    const start=parseShiftStart(sh.date,sh.s);
    const hoursAway=(start-today)/(1000*60*60);
    return hoursAway>=72;
  };

  const doRequest=async(sh)=>{
    setRequesting(true);
    const res=await SLX.requestShift({shiftId:sh.id,empId:myEmpId});
    setShiftReqs(p=>[...p,{id:res.id,shiftId:sh.id,empId:myEmpId,status:"pending",requestedAt:new Date().toISOString(),resolvedAt:null}]);
    setRequesting(false);setConfirmShift(null);
  };

  const doRequestOff=async(sh)=>{
    setRequesting(true);
    const res=await SLX.requestTimeOff({shiftId:sh.id,empId:myEmpId,reason:offReason});
    setTimeOffReqs(p=>[...p,{id:res.id,shiftId:sh.id,empId:myEmpId,status:"pending",reason:offReason,requestedAt:new Date().toISOString(),resolvedAt:null}]);
    setRequesting(false);setConfirmOff(null);setOffReason("");
  };

  return <div className="fi">
    {/* Header — read-only info, no admin controls */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {me&&<Avatar initials={me.avatar} size={38}/>}
        <div>
          <h1 style={{fontSize:20,fontWeight:700}}>{me?.name||"Employee"} <Badge v="cyan">{myRole}</Badge></h1>
          <p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>My Schedule · {monthLabel}</p>
          {me?.schedType&&<p style={{fontSize:11,color:"var(--t3)",marginTop:1}}>
            {me.schedType==="prn"?"PRN (As Needed)":`${me.rotation} · ${me.pattern} · ${me.daysOn}on/${me.daysOff}off`}
          </p>}
        </div>
      </div>
      <div className="month-nav">
        <button className={monthOff===0?"active":""} onClick={()=>setMonthOff(0)}>{new Date(today.getFullYear(),today.getMonth(),1).toLocaleDateString("en-US",{month:"short"})}</button>
        <button className={monthOff===1?"active":""} onClick={()=>setMonthOff(1)}>{new Date(today.getFullYear(),today.getMonth()+1,1).toLocaleDateString("en-US",{month:"short"})}</button>
      </div>
    </div>

    {/* Legend */}
    <div style={{display:"flex",gap:12,marginBottom:12,padding:"8px 14px",background:"#fff",borderRadius:"var(--rs)",border:"1px solid var(--brd)",flexWrap:"wrap"}}>
      {[{n:"Day",c:"#2563EB"},{n:"Eve",c:"#7C3AED"},{n:"Night",c:"#475569"},{n:"Day12",c:"#0891B2"},{n:"Nite12",c:"#1E293B"}].map(s=><div key={s.n} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--t2)"}}><div style={{width:7,height:7,borderRadius:2,background:s.c}}/>{s.n}</div>)}
      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--green)"}}><div style={{width:7,height:7,borderRadius:2,border:"2px dashed var(--green)"}}/>Open Slot</div>
      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--amber)"}}><div style={{width:7,height:7,borderRadius:2,background:"var(--amberL)",border:"1px solid var(--amber)"}}/>Pending</div>
      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--green)"}}><div style={{width:7,height:7,borderRadius:2,background:"var(--greenL)",border:"1px solid var(--green)"}}/>Approved</div>
      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--red)"}}><div style={{width:7,height:7,borderRadius:2,background:"var(--redL)",border:"1px solid var(--red)"}}/>Time Off</div>
    </div>

    {/* Interaction hint */}
    <div style={{padding:"6px 14px",background:"var(--blueL)",borderRadius:"var(--rs)",border:"1px solid #BFDBFE",marginBottom:12,fontSize:11,color:"var(--blue)",display:"flex",alignItems:"center",gap:6}}>
      <I.Alert s={13} c="#2563EB"/>
      Click a <b style={{color:"var(--green)",margin:"0 2px"}}>green dashed</b> slot to pick up an open shift · Click an assigned shift (72h+ advance) to request time off
    </div>

    {loading?<div style={{display:"flex",justifyContent:"center",padding:50}}><Spinner size={24}/></div>:
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",padding:"5px 0"}}>{d}</div>)}
      {calDays.map((day,i)=>{
        if(day===null)return <div key={`p${i}`}/>;
        const dateStr=fmtDate(day);
        const isToday=dateStr===todayStr;
        const isWeekend=new Date(yr,mo,day).getDay()===0||new Date(yr,mo,day).getDay()===6;
        const myShifts=sched.filter(s=>s.date===dateStr);
        const openSlots=shifts.filter(s=>s.date===dateStr&&s.role===myRole&&s.status==="open"&&s.need>0);
        const approvedSlots=shifts.filter(s=>s.date===dateStr&&s.role===myRole&&shiftReqs.some(r=>r.shiftId===s.id&&r.empId===myEmpId&&r.status==="approved"));

        return <Card key={dateStr} className="fi" style={{padding:5,minHeight:85,animationDelay:`${(i%7)*.02}s`,
          background:isToday?"var(--blueL)":isWeekend?"var(--bg)":"#fff",
          border:isToday?"1.5px solid #93C5FD":"1px solid var(--brd)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
            <span style={{fontSize:13,fontWeight:700,color:isToday?"var(--blue)":"var(--t1)"}}>{day}</span>
            {isToday&&<Badge v="info" style={{fontSize:7,padding:"1px 3px"}}>Today</Badge>}
          </div>

          {/* Assigned shifts — clickable for time-off if 72h+ away */}
          {myShifts.map(sh=>{
            const offSt=getOffStatus(sh);
            const canOff=canRequestOff(sh)&&!offSt;
            // Time-off approved
            if(offSt==="approved")return <div key={sh.id} style={{padding:"2px 4px",borderRadius:3,background:"var(--redL)",border:"1px solid #FECACA",marginBottom:2,opacity:.7}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--red)",textDecoration:"line-through"}}>{sh.type}</div>
              <div style={{fontSize:7,color:"var(--red)",fontWeight:600}}>Time Off Approved</div>
            </div>;
            // Time-off pending
            if(offSt==="pending")return <div key={sh.id} style={{padding:"2px 4px",borderRadius:3,background:"var(--amberL)",border:"1px solid #FDE68A",marginBottom:2}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--amber)"}}>{sh.type}</div>
              <div style={{fontSize:7,color:"var(--amber)",fontWeight:600}}>Off Req Pending</div>
            </div>;
            // Time-off rejected — show shift as normal (request was denied)
            // Normal assigned shift — clickable if eligible for time-off
            return <div key={sh.id} className={canOff?"off-req":""} onClick={canOff?()=>setConfirmOff(sh):undefined}
              style={{padding:"2px 4px",borderRadius:3,background:`${sh.c}12`,borderLeft:`3px solid ${sh.c}`,marginBottom:2}}
              title={canOff?"Click to request time off":!offSt&&!canRequestOff(sh)?"Must be 72h+ in advance to request off":""}>
              <div style={{fontSize:9,fontWeight:700,color:sh.c}}>{sh.type}</div>
              <div style={{fontSize:8,color:"var(--t2)"}}>{sh.s}–{sh.e}</div>
            </div>;
          })}

          {/* Approved pickup shifts */}
          {approvedSlots.map(sh=><div key={`a-${sh.id}`} style={{padding:"2px 4px",borderRadius:3,background:"var(--greenL)",border:"1px solid #A7F3D0",marginBottom:2}}>
            <div style={{fontSize:9,fontWeight:700,color:"var(--green)"}}>{sh.type} <span style={{fontSize:7,fontWeight:600}}>APPROVED</span></div>
            <div style={{fontSize:8,color:"var(--t2)"}}>{sh.s}–{sh.e}</div>
          </div>)}

          {/* Open slots */}
          {openSlots.filter(sh=>!approvedSlots.find(a=>a.id===sh.id)).map(sh=>{
            const status=getSlotStatus(sh);
            if(status==="approved")return null;
            if(status==="pending_mine")return <div key={`o-${sh.id}`} style={{padding:"2px 4px",borderRadius:3,background:"var(--amberL)",border:"1px solid #FDE68A",marginBottom:2}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--amber)"}}>{sh.type}</div>
              <div style={{fontSize:7,color:"var(--amber)",fontWeight:600}}>Pickup Pending</div>
            </div>;
            if(status==="pending_full")return <div key={`o-${sh.id}`} style={{padding:"2px 4px",borderRadius:3,background:"var(--hover)",border:"1px solid var(--brd)",marginBottom:2}}>
              <div style={{fontSize:9,fontWeight:600,color:"var(--t3)"}}>{sh.type}</div>
              <div style={{fontSize:7,color:"var(--t3)"}}>Pending</div>
            </div>;
            return <div key={`o-${sh.id}`} className="open-slot" onClick={()=>setConfirmShift(sh)} style={{padding:"2px 4px",borderRadius:3,background:"#fff",marginBottom:2}}>
              <div style={{fontSize:9,fontWeight:700,color:"var(--green)"}}>{sh.type}</div>
              <div style={{fontSize:7,color:"var(--green)"}}>Open · {sh.s}–{sh.e}</div>
            </div>;
          })}
        </Card>;
      })}
    </div>}

    {/* Request Open Shift Modal */}
    <Modal open={!!confirmShift} onClose={()=>setConfirmShift(null)} title="Request Open Shift" width={420}>
      {confirmShift&&<div>
        <Card style={{padding:16,marginBottom:16,borderLeft:`4px solid ${shC[confirmShift.type]||"var(--blue)"}`}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{confirmShift.type} Shift</div>
          <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>
            {new Date(confirmShift.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}<br/>
            {confirmShift.s} – {confirmShift.e} · Floor {confirmShift.loc}<br/>
            Role: {confirmShift.role} · {confirmShift.need} slot{confirmShift.need>1?"s":""} available
          </div>
        </Card>
        <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>Submit a request to pick up this shift. Your admin will review and approve or reject.</p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn v="secondary" onClick={()=>setConfirmShift(null)}>Cancel</Btn>
          <Btn onClick={()=>doRequest(confirmShift)} disabled={requesting} icon={requesting?<Spinner size={12}/>:<I.Send s={13} c="#fff"/>}>{requesting?"Submitting…":"Request This Shift"}</Btn>
        </div>
      </div>}
    </Modal>

    {/* Request Time Off Modal */}
    <Modal open={!!confirmOff} onClose={()=>{setConfirmOff(null);setOffReason("");}} title="Request Time Off" width={420}>
      {confirmOff&&<div>
        <Card style={{padding:16,marginBottom:16,borderLeft:"4px solid var(--red)"}}>
          <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{confirmOff.type} Shift</div>
          <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>
            {new Date(confirmOff.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}<br/>
            {confirmOff.s} – {confirmOff.e}
          </div>
        </Card>
        <div style={{padding:10,background:"var(--amberL)",borderRadius:"var(--rs)",border:"1px solid #FDE68A",marginBottom:14,fontSize:11,color:"var(--amber)",display:"flex",alignItems:"center",gap:6}}>
          <I.Alert s={13} c="#D97706"/>Time-off requests require admin approval. Your shift remains assigned until approved.
        </div>
        <Inp label="Reason (optional)" value={offReason} onChange={e=>setOffReason(e.target.value)} placeholder="e.g. Medical appointment, family obligation…" multiline rows={2}/>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn v="secondary" onClick={()=>{setConfirmOff(null);setOffReason("");}}>Cancel</Btn>
          <Btn v="danger" onClick={()=>doRequestOff(confirmOff)} disabled={requesting} icon={requesting?<Spinner size={12}/>:<I.Send s={13} c="#fff"/>}>{requesting?"Submitting…":"Request Time Off"}</Btn>
        </div>
      </div>}
    </Modal>
  </div>;
}

// ═══ SHIFT BOARD ═══
function ShiftBoardView({emps,shifts,setShifts,shiftReqs,setShiftReqs,timeOffReqs,setTimeOffReqs}){
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
    {/* ── Shift Requests Section ── */}
    {shiftReqs&&shiftReqs.filter(r=>r.status==="pending").length>0&&<>
      <h3 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",margin:"16px 0 8px"}}>Shift Requests</h3>
      {shiftReqs.filter(r=>r.status==="pending").map((req,i)=>{
        const sh=shifts.find(s=>s.id===req.shiftId);const emp=emps.find(e=>e.id===req.empId);
        if(!sh||!emp)return null;const dt=new Date(sh.date+"T12:00:00");const shC2={Day:"#2563EB",Eve:"#7C3AED",Night:"#475569",Day12:"#0891B2",Nite12:"#1E293B"};const c2=shC2[sh.type]||"var(--blue)";
        return <Card key={req.id} className="fi" style={{padding:14,marginBottom:6,borderLeft:"4px solid var(--amber)",animationDelay:`${i*.05}s`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Avatar initials={emp.avatar} size={34}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{emp.name} <Badge v="warning">Pending</Badge></div>
              <div style={{fontSize:11,color:"var(--t2)"}}>Requesting: {sh.type} {sh.s}–{sh.e} · {dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · Fl {sh.loc}</div>
              <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>Requested {new Date(req.requestedAt).toLocaleString()}</div>
            </div>
            <div style={{display:"flex",gap:5}}>
              <Btn size="sm" v="success" icon={<I.Check s={12} c="#059669"/>} onClick={async()=>{
                await SLX.resolveRequest(req.id,"approved");
                const newNeed=sh.need-1;
                setShifts(p=>p.map(s=>s.id===sh.id?{...s,need:newNeed,status:newNeed<=0?"filled":s.status}:s));
                setShiftReqs(p=>p.map(r=>{
                  if(r.id===req.id)return{...r,status:"approved",resolvedAt:new Date().toISOString()};
                  if(r.shiftId===req.shiftId&&r.status==="pending"&&newNeed<=0)return{...r,status:"rejected",resolvedAt:new Date().toISOString()};
                  return r;
                }));
              }}>Approve</Btn>
              <Btn size="sm" v="danger" icon={<I.X s={12} c="#DC2626"/>} onClick={async()=>{
                await SLX.resolveRequest(req.id,"rejected");
                setShiftReqs(p=>p.map(r=>r.id===req.id?{...r,status:"rejected",resolvedAt:new Date().toISOString()}:r));
              }}>Reject</Btn>
            </div>
          </div></Card>;
      })}</>}
    {/* ── Time-Off Requests Section ── */}
    {timeOffReqs&&timeOffReqs.filter(r=>r.status==="pending").length>0&&<>
      <h3 style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"var(--t3)",margin:"16px 0 8px"}}>Time-Off Requests</h3>
      {timeOffReqs.filter(r=>r.status==="pending").map((req,i)=>{
        const emp=emps.find(e=>e.id===req.empId);
        if(!emp)return null;
        // Find the matching assigned shift from sched data (genSched shifts have date/type/time)
        const shiftDate=new Date(req.shiftId.replace("SH",""));
        return <Card key={req.id} className="fi" style={{padding:14,marginBottom:6,borderLeft:"4px solid var(--red)",animationDelay:`${i*.05}s`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Avatar initials={emp.avatar} size={34}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700}}>{emp.name} <Badge v="danger">Time Off</Badge></div>
              <div style={{fontSize:11,color:"var(--t2)"}}>Shift ID: {req.shiftId}</div>
              {req.reason&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,fontStyle:"italic"}}>"{req.reason}"</div>}
              <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>Requested {new Date(req.requestedAt).toLocaleString()}</div>
            </div>
            <div style={{display:"flex",gap:5}}>
              <Btn size="sm" v="success" icon={<I.Check s={12} c="#059669"/>} onClick={async()=>{
                await SLX.resolveTimeOff(req.id,"approved");
                setTimeOffReqs(p=>p.map(r=>r.id===req.id?{...r,status:"approved",resolvedAt:new Date().toISOString()}:r));
              }}>Approve</Btn>
              <Btn size="sm" v="danger" icon={<I.X s={12} c="#DC2626"/>} onClick={async()=>{
                await SLX.resolveTimeOff(req.id,"rejected");
                setTimeOffReqs(p=>p.map(r=>r.id===req.id?{...r,status:"rejected",resolvedAt:new Date().toISOString()}:r));
              }}>Deny</Btn>
            </div>
          </div></Card>;
      })}</>}
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
  const[activeState,setActiveState]=useState("TX");
  const dr=useRef(null);const dv=useRef(null);
  const[showAdd,setShowAdd]=useState(false);
  const[nI,setNI]=useState({label:"",desc:"",type:"form",url:""});
  const stateSteps=steps[activeState]||[];
  const onEnd=()=>{if(dr.current==null||dv.current==null)return;const c=[...stateSteps];const it=c.splice(dr.current,1)[0];c.splice(dv.current,0,it);setSteps({...steps,[activeState]:c});dr.current=null;dv.current=null;};
  const tI={form:I.File,video:I.Video,link:I.Link};
  const stateInfo={TX:{name:"Texas",fac:"Tulia Health and Rehabilitation"},OK:{name:"Oklahoma",fac:"Oklahoma Care Center"}};
  return <div className="fi">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><h1 style={{fontSize:22,fontWeight:700}}>Onboarding Flow</h1><p style={{color:"var(--t3)",fontSize:12,marginTop:2}}>State-specific document packages · drag to reorder</p></div>
      <Btn onClick={()=>setShowAdd(true)} icon={<I.Plus s={14} c="#fff"/>}>Add Step</Btn></div>
    {/* State tabs */}
    <div style={{display:"flex",gap:4,marginBottom:14}}>
      {Object.keys(stateInfo).map(st=><button key={st} onClick={()=>setActiveState(st)} style={{padding:"8px 18px",borderRadius:"var(--rs)",border:activeState===st?"2px solid var(--blue)":"1px solid var(--brd)",background:activeState===st?"var(--blueL)":"#fff",fontFamily:"inherit",fontSize:12,fontWeight:600,color:activeState===st?"var(--blue)":"var(--t2)",cursor:"pointer"}}>{stateInfo[st].name} ({st}) — {(steps[st]||[]).length} steps</button>)}
    </div>
    <Card style={{padding:"10px 16px",marginBottom:10,background:"var(--blueL)",border:"1px dashed #93C5FD"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><I.Building s={16} c="#2563EB"/><div style={{fontSize:12,fontWeight:600,color:"var(--blue)"}}>{stateInfo[activeState].fac} — {stateInfo[activeState].name} document package</div></div></Card>
    {stateSteps.map((s,i)=>{const SIcon=I[s.icon]||tI[s.type]||I.File;return(
      <div key={s.id} draggable onDragStart={()=>{dr.current=i}} onDragEnter={()=>{dv.current=i}} onDragEnd={onEnd} onDragOver={e=>e.preventDefault()}
        style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#fff",border:"1px solid var(--brd)",borderRadius:"var(--rs)",cursor:"grab",boxShadow:"var(--sh)",marginBottom:3}}>
        <I.Grip s={12} c="#CBD5E1"/>
        <div style={{width:28,height:28,borderRadius:"var(--rs)",background:s.type==="video"?"var(--purpleL)":s.type==="link"?"var(--amberL)":"var(--blueL)",display:"flex",alignItems:"center",justifyContent:"center"}}><SIcon s={14} c={s.type==="video"?"#7C3AED":s.type==="link"?"#D97706":"#2563EB"}/></div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>{s.label}<Badge v={s.type==="video"?"purple":s.type==="link"?"warning":"info"} style={{fontSize:8}}>{s.type}</Badge></div><div style={{fontSize:10,color:"var(--t3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.desc}</div></div>
        <span style={{fontSize:10,color:"var(--t3)",fontWeight:600,background:"var(--bg)",padding:"2px 6px",borderRadius:4}}>#{i+1}</span>
        <button onClick={()=>setSteps({...steps,[activeState]:stateSteps.filter(x=>x.id!==s.id)})} style={{background:"none",border:"none",cursor:"pointer",padding:3,display:"flex"}}><I.Trash s={13} c="#DC2626"/></button>
      </div>);})}
    <Modal open={showAdd} onClose={()=>setShowAdd(false)} title={`Add Step — ${stateInfo[activeState].name}`}>
      <Inp label="Name" value={nI.label} onChange={e=>setNI({...nI,label:e.target.value})} placeholder="Safety Training" req/>
      <Inp label="Description" value={nI.desc} onChange={e=>setNI({...nI,desc:e.target.value})}/>
      <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--t2)",marginBottom:6}}>Type</label>
        <div style={{display:"flex",gap:6}}>{[["form","Document",I.File],["video","Video",I.Video],["link","Link",I.Link]].map(([v,l,Ic])=>
          <button key={v} onClick={()=>setNI({...nI,type:v})} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"12px",borderRadius:"var(--rs)",border:nI.type===v?"2px solid var(--blue)":"1px solid var(--brd)",background:nI.type===v?"var(--blueL)":"#fff",cursor:"pointer"}}><Ic s={18} c={nI.type===v?"#2563EB":"#94A3B8"}/><span style={{fontSize:10,fontWeight:600,color:nI.type===v?"var(--blue)":"var(--t3)"}}>{l}</span></button>)}</div></div>
      {(nI.type==="video"||nI.type==="link")&&<Inp label="URL" value={nI.url} onChange={e=>setNI({...nI,url:e.target.value})} placeholder="https://..."/>}
      {nI.type==="form"&&<div style={{padding:20,border:"2px dashed var(--brd)",borderRadius:"var(--r)",textAlign:"center",marginBottom:14,background:"var(--bg)"}}><I.Upload s={20} c="#94A3B8"/><p style={{fontSize:11,color:"var(--t3)",marginTop:6}}>Drag & drop or click (PDF, DOC)</p></div>}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn v="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
        <Btn onClick={()=>{if(!nI.label)return;setSteps({...steps,[activeState]:[...stateSteps,{id:`c${Date.now()}`,label:nI.label,desc:nI.desc||nI.url||"Custom",icon:nI.type==="video"?"🎬":nI.type==="link"?"🔗":"📄",type:nI.type}]});setNI({label:"",desc:"",type:"form",url:""});setShowAdd(false);}} disabled={!nI.label} icon={<I.Plus s={13} c="#fff"/>}>Add</Btn></div>
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
  const[showPay,setShowPay]=useState(false);const[showUpd,setShowUpd]=useState(false);
  const[cardNum,setCardNum]=useState("");const[cardExp,setCardExp]=useState("");const[cardCvc,setCardCvc]=useState("");const[cardName,setCardName]=useState("");const[updSaving,setUpdSaving]=useState(false);
  const[cardInfo,setCardInfo]=useState({last4:"4242",exp:"12/27"});
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
          <I.Billing s={20} c="#2563EB"/><div><div style={{fontSize:13,fontWeight:600}}>•••• {cardInfo.last4}</div><div style={{fontSize:11,color:"var(--t3)"}}>Exp {cardInfo.exp}</div></div><Badge v="success" style={{marginLeft:"auto"}}>Default</Badge></div>
        <Btn onClick={()=>setShowPay(true)} icon={<I.Billing s={14} c="#fff"/>} style={{width:"100%",justifyContent:"center",marginBottom:8}}>Make Payment</Btn>
        <Btn v="secondary" onClick={()=>setShowUpd(true)} style={{width:"100%",justifyContent:"center"}}>Update Method</Btn>
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
      </div></Modal>
    <Modal open={showUpd} onClose={()=>setShowUpd(false)} title="Update Payment Method">
      <div style={{padding:"4px 0"}}>
        <Inp label="Cardholder Name" value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="John Smith" req/>
        <Inp label="Card Number" value={cardNum} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,16);setCardNum(v.replace(/(.{4})/g,"$1 ").trim());}} placeholder="1234 5678 9012 3456" req/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Expiration" value={cardExp} onChange={e=>{let v=e.target.value.replace(/\D/g,"").slice(0,4);if(v.length>2)v=v.slice(0,2)+"/"+v.slice(2);setCardExp(v);}} placeholder="MM/YY" req/>
          <Inp label="CVC" value={cardCvc} onChange={e=>setCardCvc(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="123" req/>
        </div>
        <div style={{padding:10,background:"var(--greenL)",borderRadius:"var(--rs)",marginBottom:14,fontSize:11,color:"var(--green)",display:"flex",alignItems:"center",gap:6}}><I.Shield s={13} c="#059669"/>Card data encrypted — PCI DSS compliant</div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn v="secondary" onClick={()=>{setShowUpd(false);setCardNum("");setCardExp("");setCardCvc("");setCardName("");}}>Cancel</Btn>
          <Btn disabled={!cardNum||!cardExp||!cardCvc||!cardName||updSaving} onClick={async()=>{setUpdSaving(true);await new Promise(r=>setTimeout(r,1200));const last4=cardNum.replace(/\s/g,"").slice(-4);setCardInfo({last4,exp:cardExp});setUpdSaving(false);setShowUpd(false);setCardNum("");setCardExp("");setCardCvc("");setCardName("");}} icon={updSaving?<Spinner size={12}/>:<I.Save s={13} c="#fff"/>}>{updSaving?"Saving…":"Save Card"}</Btn>
        </div>
      </div>
    </Modal></div>;
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
  const[shifts,setShifts]=useState(INIT_SHIFTS);
  const[shiftReqs,setShiftReqs]=useState([]);
  const[timeOffReqs,setTimeOffReqs]=useState([]);
  const[myEmpId]=useState("E001");

  if(!loggedIn) return <><style>{css}</style><LoginScreen onLogin={r=>{setRole(r);setLoggedIn(true);}}/></>;

  // ── NEW HIRE: onboarding portal is their homescreen ──
  if(role==="new_hire"){
    const me=emps.find(e=>e.id==="E003")||emps.find(e=>e.status==="onboarding")||emps.find(e=>e.status==="invited");
    const empState=me?getFacility(me.facilityId).state:"TX";
    const invType=me?.inviteType||"full";
    const filteredSteps=getStepsForInvite(empState,invType);

    // App-only flow: after submission show confirmation screen (not schedule)
    if(me && invType==="app_only" && (me.status==="review"||me.status==="app_approved"||me.status==="app_rejected")){
      return <><style>{css}</style>
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
          <div className="su" style={{textAlign:"center",maxWidth:420}}>
            {me.status==="review"&&<>
              <div style={{width:56,height:56,borderRadius:"50%",background:"var(--amberL)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I.Clock s={28} c="#D97706"/></div>
              <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Application Submitted</h2>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>Your application is under review. You'll be notified once a decision is made.</p>
            </>}
            {me.status==="app_approved"&&<>
              <div style={{width:56,height:56,borderRadius:"50%",background:"var(--greenL)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I.Check s={28} c="#059669"/></div>
              <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,color:"var(--green)"}}>Application Approved!</h2>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>Congratulations! Your application has been approved. You'll receive onboarding paperwork shortly.</p>
            </>}
            {me.status==="app_rejected"&&<>
              <div style={{width:56,height:56,borderRadius:"50%",background:"var(--redL)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><I.X s={28} c="#DC2626"/></div>
              <h2 style={{fontSize:20,fontWeight:700,marginBottom:8,color:"var(--red)"}}>Application Not Approved</h2>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>Thank you for your interest. Unfortunately, we are unable to move forward at this time.</p>
            </>}
            <div style={{marginTop:20}}><button onClick={()=>setLoggedIn(false)} style={{background:"none",border:"none",color:"var(--t3)",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>Sign Out</button></div>
          </div></div></>;
    }

    // Still filling out / not yet submitted
    if(me && !me.onboardingComplete && me.status!=="review"){
      return <><style>{css}</style>
        <OnboardPortal emp={me} steps={filteredSteps}
          onSave={(fd)=>setEmps(p=>p.map(e=>e.id===me.id?{...e,formData:fd,status:"onboarding"}:e))}
          onSubmit={(fd)=>setEmps(p=>p.map(e=>e.id===me.id?{...e,formData:fd,status:"review",submittedDocs:{at:new Date().toISOString()}}:e))}
        /></>;
    }
    // Submitted or approved → show schedule
    return <><style>{css}</style>
      <div style={{maxWidth:960,margin:"0 auto"}}><HipaaBar/>
        <div style={{padding:20}}>
          {me?.status==="review"&&<Card style={{padding:16,marginBottom:16,background:"var(--amberL)",border:"1px solid #FDE68A"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><I.Clock s={16} c="#D97706"/>
              <div><div style={{fontSize:13,fontWeight:600,color:"var(--amber)"}}>Paperwork Under Review</div>
                <div style={{fontSize:12,color:"var(--t2)"}}>Your admin is reviewing your documents. Schedule will appear once approved.</div></div></div></Card>}
          <EmployeeScheduleView emps={emps} shifts={shifts} shiftReqs={shiftReqs} setShiftReqs={setShiftReqs} timeOffReqs={timeOffReqs} setTimeOffReqs={setTimeOffReqs} myEmpId={myEmpId}/>
          <div style={{textAlign:"center",padding:"20px 0"}}><button onClick={()=>setLoggedIn(false)} style={{background:"none",border:"none",color:"var(--t3)",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>Sign Out</button></div>
        </div></div></>;
  }

  // ── EMPLOYEE: schedule is homescreen ──
  if(role==="employee"){
    return <><style>{css}</style>
      <div style={{maxWidth:960,margin:"0 auto"}}><HipaaBar/>
        <div style={{padding:20}}>
          <EmployeeScheduleView emps={emps} shifts={shifts} shiftReqs={shiftReqs} setShiftReqs={setShiftReqs} timeOffReqs={timeOffReqs} setTimeOffReqs={setTimeOffReqs} myEmpId={myEmpId}/>
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
          {view==="shifts"&&<ShiftBoardView emps={emps} shifts={shifts} setShifts={setShifts} shiftReqs={shiftReqs} setShiftReqs={setShiftReqs} timeOffReqs={timeOffReqs} setTimeOffReqs={setTimeOffReqs}/>}
          {view==="onboarding"&&<OnboardFlowView steps={obSteps} setSteps={setObSteps}/>}
          {view==="accounts"&&<AccountsView admins={admins} setAdmins={setAdmins}/>}
          {view==="billing"&&<BillingView/>}
        </div>
      </main>
    </div></>;
}
