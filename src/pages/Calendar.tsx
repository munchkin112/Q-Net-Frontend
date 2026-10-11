import React from 'react';
import assets from '../assets.json';
import { certificates } from '../api/certificates';
import { exams, initialCalendar } from '../api/calendar';
import { profileFields } from '../api/profile';
import { useAppContext } from '../AppContext';
import { Button } from '../components/Button';
import { Icon, OutlineIcon } from '../components/Icons';
import { FavoriteCard } from '../components/FavoriteCard';
import { CalendarRows, SmallTitle } from '../components/PageHelpers';

export default function Calendar(){const {page,logged,setLogged,selected,setSelected,favorites,setFavorites,calendar,setCalendar,search,setSearch,submitted,setSubmitted,category,setCategory,more,setMore,returnPage,setReturnPage,profile,setProfile,calendarKey,setCalendarKey,examType,setExamType,round,setRound,toast,setToast,dialog,setDialog,favoriteSearch,setFavoriteSearch,sort,setSort,go,protectedGo,openDetail,toggleFavorite,openCalendar,calendarId,cert,registered,register}=useAppContext();const c=calendar.find(c=>calendarId(c)===calendarKey)||calendar.find(c=>c.name===selected)||calendar[0];return <main className="small-main calendar-main"><SmallTitle title="캘린더 등록 자격증" count={calendar.length} sub="캘린더에 등록한 자격증의 상세 정보를 확인하세요."/><div className="calendar-detail-grid"><div className="calendar-list">{calendar.map((item,i)=><button key={item.name+':'+i} className={c&&calendarId(c)===calendarId(item)?'selected':''} onClick={()=>{setSelected(item.name);setCalendarKey(calendarId(item))}}><strong>{item.name}</strong><span className="badge">{item.type}</span><small>2026년 정기 기사 {item.round}회</small><span>›</span></button>)}</div>{c?<section className="calendar-detail"><span className="badge">국가기술자격</span><h2>{c.name}</h2><div className="calendar-detail-tags"><span className="badge">{c.type}</span><span className="badge">✓ Google Calendar 등록 완료</span></div><p>2026년 정기 기사 {c.round}회</p>{[['원서접수 기간',c.apply],['시험일',c.exam],['등록된 일정','원서접수 · 시험']].map(([k,v])=><div className="calendar-detail-line" key={k}><OutlineIcon kind={k==='등록된 일정'?'list':'calendar'}/><strong>{k}</strong><span>{v}</span></div>)}<a className="button primary" href="https://calendar.google.com/calendar/u/0/r" target="_blank" rel="noreferrer">캘린더에서 보기 ↗</a></section>:<p className="empty">등록된 일정이 없습니다.</p>}</div></main>}
