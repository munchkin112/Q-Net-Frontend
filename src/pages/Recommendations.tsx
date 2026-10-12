import { profileFields } from '../api/profile';
import { useAppContext } from '../AppContext';
import { Button } from '../components/Button';

export default function Recommendations() {
  const { recommendation, profile, go, openDetail } = useAppContext();
  const firstCount = recommendation?.initial_display_count ?? 0;
  const additional = recommendation?.items.slice(firstCount) ?? [];

  return (
    <main className="recommendations-main">
      <nav className="recommendations-breadcrumb" aria-label="현재 위치">
        <button aria-label="홈으로" onClick={() => go('home')}>⌂</button>
        <span aria-hidden="true">›</span>
        <button onClick={() => go('profile')}>내 조건으로 찾기</button>
        <span aria-hidden="true">›</span>
        <button onClick={() => go('related')}>관심분야 관련 자격증</button>
        <span aria-hidden="true">›</span>
        <span aria-current="page">추천 자격증 더 보기</span>
      </nav>

      <header className="recommendations-heading">
        <h1>추천 자격증 더 보기</h1>
        <p>앞 화면과 같은 추천 결과에서 추가 후보를 살펴보세요.</p>
      </header>

      {recommendation && (
        <aside className="recommendations-summary" aria-label="추천 목록 안내">
          <span className="recommendations-count">
            {String(profile.field + 1).padStart(2, '0')} {profileFields[profile.field]}
          </span>
          <p>전체 {recommendation.total_count}개 중 추가 {additional.length}개를 표시합니다. 순서는 응시 가능 여부의 순위가 아닙니다.</p>
        </aside>
      )}

      <section className="recommendations-list" aria-labelledby="recommendations-list-title">
        <div className="recommendations-list-heading">
          <h2 id="recommendations-list-title">추가로 살펴볼 자격증</h2>
          <span>{additional.length}개 표시</span>
        </div>
        {additional.length === 0 ? (
          <div className="recommendations-empty">
            <p>{recommendation ? '이 추천 결과에는 추가 후보가 없습니다.' : '먼저 내 조건으로 추천을 생성해 주세요.'}</p>
            <Button className="primary" onClick={() => go(recommendation ? 'related' : 'profile')}>
              {recommendation ? '앞의 추천 보기' : '내 조건 입력하기'}
            </Button>
          </div>
        ) : (
          <div className="recommendations-items">
            {additional.map((card) => (
              <article className="recommendation-card" key={card.certificate_id}>
                <div className="recommendation-copy">
                  <h3>{card.name}</h3>
                  <div className="recommendation-description">
                    <span className="badge">{card.category_name}</span>
                    <p>{card.reason || card.summary}</p>
                  </div>
                </div>
                <Button
                  className="primary"
                  onClick={() => openDetail(card.name, card.certificate_id)}
                >
                  상세정보 보기
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="recommendations-notice">
        <strong>추천은 응시 가능 여부의 확정 판정이 아닙니다.</strong>
        <p>상세 자격 요건과 시험 일정은 공식 안내에서 다시 확인해 주세요.</p>
      </aside>
    </main>
  );
}
