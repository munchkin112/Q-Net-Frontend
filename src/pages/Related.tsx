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

export default function Related(){const {page,logged,setLogged,selected,setSelected,favorites,setFavorites,calendar,setCalendar,search,setSearch,submitted,setSubmitted,category,setCategory,more,setMore,returnPage,setReturnPage,profile,setProfile,calendarKey,setCalendarKey,examType,setExamType,round,setRound,toast,setToast,dialog,setDialog,favoriteSearch,setFavoriteSearch,sort,setSort,go,protectedGo,openDetail,toggleFavorite,openCalendar,calendarId,cert,registered,register}=useAppContext();
return <main className="related-main"><h1>관심분야 관련 자격증</h1><p className="muted">선택한 분야와 입력 정보를 참고한 목록입니다. 카드 순서는 우선순위가 아닙니다.</p><div className="related-grid">{certificates.slice(0,3).map(c=><article className="related-card" key={c.name}><span className="badge">국가기술자격</span><h2>{c.name}</h2><p className="description">{c.description}</p><h3>활용할 수 있는 직군·직업</h3><p className="job-description">{c.job} 관련 직무</p><h3 className="reason">이 자격증들을 제시한 이유</h3><p className="review-note">직업 연결 문구는 검토 전 예시입니다.</p><Button className="primary" onClick={()=>openDetail(c.name)}>상세정보 보기</Button></article>)}</div><div className="related-actions"><Button onClick={()=>go('profile')}>관심 분야·정보 수정</Button><Button className="primary" onClick={()=>go('recommendations')}>추천 자격증 더 보기</Button></div></main>}
