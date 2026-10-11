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

export default function Login(){const {page,logged,setLogged,selected,setSelected,favorites,setFavorites,calendar,setCalendar,search,setSearch,submitted,setSubmitted,category,setCategory,more,setMore,returnPage,setReturnPage,profile,setProfile,calendarKey,setCalendarKey,examType,setExamType,round,setRound,toast,setToast,dialog,setDialog,favoriteSearch,setFavoriteSearch,sort,setSort,go,protectedGo,openDetail,toggleFavorite,openCalendar,calendarId,cert,registered,register}=useAppContext();
return <main className="login-main"><section className="login-panel"><span className="login-chip">선택한 자격증을 이어서 확인</span><h1>로그인하고<br/>계속 이용하세요.</h1><p>Google 계정으로 로그인하면 자격증 상세정보와 내 조건에 맞는 추천을 확인할 수 있어요.</p><div className="login-hint">{'검색어와 선택한 자격증은 그대로 유지됩니다.\n나에게 맞는 자격증을 AI가 추천드려요.\n관심 자격증과 일정을 한곳에서 관리할 수 있어요.'}</div><Button className="primary" onClick={()=>{setLogged(true);go(returnPage);setToast('데모 로그인되었습니다.')}}>Google 계정으로 계속하기</Button><button className="text-button" onClick={()=>go('home')}>로그인 없이 둘러보기</button><small>로그인과 캘린더 권한 동의는 별도입니다. 로그인만으로 일정이 추가되지 않습니다.</small></section></main>}
