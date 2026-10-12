import { useEffect, useState } from 'react';
import { AppContextProvider } from './AppContext';
import {
  AuthApiError,
  clearAccessToken,
  completeGoogleLogin,
  getAccessToken,
  refreshAccessToken,
  saveAccessToken,
} from './api/auth';
import {
  calendarId,
  downloadCalendar,
  exams,
} from './api/calendar';
import type { CalendarEntry } from './api/calendar';
import { certificates, type Page } from './api/certificates';
import { toggleFavorite as updateFavorites } from './api/favorites';
import { initialProfile } from './api/profile';
import type { RecommendationResponse } from './api/recommendations';
import { useStored } from './api/storage';
import Calendar from './pages/Calendar';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import Related from './pages/Related';
import { Header } from './components/Header';
import './styles/common.css';
import './styles/home.css';
import './styles/login.css';
import './styles/profile.css';
import './styles/related.css';
import './styles/recommendations.css';
import './styles/detail.css';
import './styles/mypage.css';
import './styles/favorites.css';
import './styles/calendar.css';
import './styles/recommendation-integration.css';

const pages: Page[] = [
  'home',
  'login',
  'profile',
  'related',
  'recommendations',
  'detail',
  'mypage',
  'favorites',
  'calendar',
];

function route(): Page {
  const path =
    location.hash.slice(1).split('?')[0] ||
    location.pathname.split('/').pop()?.replace(/\.html$/, '') ||
    document.documentElement.dataset.page ||
    'home';
  return pages.includes(path as Page) ? (path as Page) : 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(route);
  const [logged, setLogged] = useState(() => Boolean(getAccessToken()));
  const [selected, setSelected] = useStored('selected', certificates[0].name);
  const [selectedCertificateId, setSelectedCertificateId] = useStored('selected-certificate-id', '');
  const [favorites, setFavorites] = useStored('favorites', certificates.map(({ name }) => name));
  // 이전 데모 기록은 실제 Google 등록 이력으로 표시하지 않는다.
  const [calendar, setCalendar] = useStored<CalendarEntry[]>('calendar-registrations-v1', []);
  const [search, setSearch] = useStored('search', '');
  const [submitted, setSubmitted] = useState(search);
  const [category, setCategory] = useState('전체');
  const [more, setMore] = useState(false);
  const [homeResetKey, setHomeResetKey] = useState(0);
  const [returnPage, setReturnPage] = useStored<Page>('return-page', 'detail');
  const [profile, setProfile] = useStored('profile', initialProfile);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [calendarKey, setCalendarKey] = useState('');
  const [examType, setExamType] = useState('필기');
  const [round, setRound] = useState(2);
  const [toast, setToast] = useState('');
  const [dialog, setDialog] = useState(false);
  const [favoriteSearch, setFavoriteSearch] = useState('');
  const [sort, setSort] = useState('최신 등록순');

  useEffect(() => {
    const onNavigate = () => {
      setPage(route());
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', onNavigate);
    addEventListener('popstate', onNavigate);
    return () => {
      removeEventListener('hashchange', onNavigate);
      removeEventListener('popstate', onNavigate);
    };
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');
    const state = query.get('state');
    const oauthError = query.get('error');
    let cancelled = false;

    if (code || state || oauthError) {
      history.replaceState({}, '', `${location.pathname}${location.hash}`);
      if (oauthError || !code || !state) {
        setToast('Google 로그인에 실패했습니다. 다시 시도해주세요.');
        if (page !== 'login') go('login');
        return;
      }

      void completeGoogleLogin(code, state)
        .then(({ access_token: accessToken }) => {
          if (cancelled) return;
          saveAccessToken(accessToken);
          setLogged(true);
          setToast('Google 로그인에 성공했습니다.');
          go(returnPage);
        })
        .catch((cause: unknown) => {
          if (cancelled) return;
          clearAccessToken();
          setLogged(false);
          setToast(cause instanceof Error ? cause.message : 'Google 로그인에 실패했습니다.');
          if (page !== 'login') go('login');
        });
    } else {
      void refreshAccessToken()
        .then((accessToken) => {
          if (cancelled) return;
          saveAccessToken(accessToken);
          setLogged(true);
        })
        .catch((cause: unknown) => {
          if (cancelled) return;
          if (cause instanceof AuthApiError && cause.status === 401) {
            clearAccessToken();
            setLogged(false);
            return;
          }
          setToast(
            cause instanceof Error ? cause.message : '로그인 상태를 확인하지 못했습니다.',
          );
        });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const go = (to: Page) => {
    if (location.protocol === 'file:') {
      location.hash = to;
    } else {
      history.pushState({}, '', `${to}.html`);
      setPage(to);
      window.scrollTo(0, 0);
    }
  };
  const goHome = () => {
    setSearch('');
    setSubmitted('');
    setCategory('전체');
    setMore(false);
    setHomeResetKey((key) => key + 1);
    go('home');
  };
  const protectedGo = (to: Page) => {
    if (logged) go(to);
    else {
      setReturnPage(to);
      go('login');
    }
  };
  const openDetail = (name: string, certificateId = '') => {
    setSelected(name);
    setSelectedCertificateId(certificateId);
    protectedGo('detail');
  };
  const openCalendar = (name: string, id = '') => {
    setSelected(name);
    setSelectedCertificateId('');
    setCalendarKey(id);
    go('calendar');
  };
  const toggleFavorite = (name: string) =>
    setFavorites((previous) => updateFavorites(previous, name));
  const cert = certificates.find(({ name }) => name === selected) || certificates[0];
  const registered = calendar.some(
    (entry) =>
      entry.name === selected && entry.type === examType && entry.round === round + 1,
  );
  const register = () => {
    if (!registered) {
      const exam = exams[round];
      const entry: CalendarEntry = {
        name: selected,
        type: examType,
        apply: `2026.${exam.apply.replaceAll('월', '').replaceAll('화', '')}`,
        exam: `2026.${exam.exam}`,
        round: round + 1,
      };
      setCalendar((previous) => [...previous, entry]);
    }
    setDialog(false);
    setToast('선택한 일정을 데모 캘린더에 저장했습니다.');
  };
  const small = ['mypage', 'favorites', 'calendar'].includes(page);
  const detail = page === 'detail';

  return (
    <AppContextProvider
      value={{
        page,
        setPage,
        logged,
        setLogged,
        selected,
        setSelected,
        selectedCertificateId,
        setSelectedCertificateId,
        favorites,
        setFavorites,
        calendar,
        setCalendar,
        search,
        setSearch,
        submitted,
        setSubmitted,
        category,
        setCategory,
        more,
        setMore,
        homeResetKey,
        returnPage,
        setReturnPage,
        profile,
        setProfile,
        recommendation,
        setRecommendation,
        calendarKey,
        setCalendarKey,
        examType,
        setExamType,
        round,
        setRound,
        toast,
        setToast,
        dialog,
        setDialog,
        favoriteSearch,
        setFavoriteSearch,
        sort,
        setSort,
        go,
        goHome,
        protectedGo,
        openDetail,
        toggleFavorite,
        openCalendar,
        calendarId,
        cert,
        registered,
        register,
      }}
    >
      <div className={`site ${page}${small ? ' small-site' : ''}${detail ? ' detail-site' : ''}`}>
        <Header />
        {page === 'home' && <Home />}
        {page === 'login' && <Login />}
        {page === 'profile' && <Profile />}
        {page === 'related' && <Related />}
        {page === 'recommendations' && <Recommendations />}
        {page === 'detail' && <Detail />}
        {page === 'mypage' && <Mypage />}
        {page === 'favorites' && <Favorites />}
        {page === 'calendar' && <Calendar />}
        {toast && (
          <div role="status" className="toast">
            {toast}
          </div>
        )}
        {dialog && (
          <div className="modal-backdrop" onClick={() => setDialog(false)}>
            <section
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="calendar-dialog-title"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="calendar-dialog-title">캘린더 일정 추가</h2>
              <p>
                {selected} · 정기 기사 {round + 1}회 · {examType}
              </p>
              <p>
                현재는 데모입니다. 이 브라우저에 일정을 저장하거나, 파일을 내려받아 Google
                Calendar에 직접 가져올 수 있습니다.
              </p>
              <div>
                <button className="button" onClick={() => setDialog(false)}>
                  취소
                </button>
                <button
                  className="button"
                  onClick={() => downloadCalendar(selected, examType, round)}
                >
                  일정 파일 다운로드
                </button>
                <button className="button primary" onClick={register}>
                  {registered ? '저장 완료' : '데모 캘린더에 저장'}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </AppContextProvider>
  );
}
