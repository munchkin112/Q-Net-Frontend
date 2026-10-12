import { Button } from './Button';
import { useAppContext } from '../AppContext';

export function Header() {
  const { page, logged, go, goHome, protectedGo, setReturnPage } = useAppContext();
  const showAccountButton = !['profile', 'related'].includes(page);

  const openAccount = () => {
    if (logged) {
      go('mypage');
      return;
    }
    setReturnPage('mypage');
    go('login');
  };

  return (
    <header className="header">
      <button className="brand" onClick={goHome}>
        <span className="brand-mark">자</span>
        <strong>자격잇다</strong>
      </button>
      <nav aria-label="주요 메뉴">
        <button onClick={() => go('home')}>자격증 탐색</button>
        <button onClick={() => protectedGo('profile')}>내 조건으로 찾기</button>
      </nav>
      {showAccountButton && (
        <Button
          className={logged ? 'account' : 'login-button'}
          onClick={openAccount}
        >
          {logged ? '마이페이지' : 'Google 로그인'}
        </Button>
      )}
    </header>
  );
}
