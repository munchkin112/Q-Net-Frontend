import { useAppContext } from '../AppContext';
import { Button } from '../components/Button';

export default function Related() {
  const { recommendation, go, openDetail } = useAppContext();
  const cards = recommendation?.items.slice(0, recommendation.initial_display_count) ?? [];

  return (
    <main className="related-main">
      <h1>관심분야 관련 자격증</h1>
      <p className="muted">
        저장한 조건으로 생성한 추천 결과입니다. 표시 순서는 응시 가능 여부의 순위가 아닙니다.
      </p>
      {!recommendation ? (
        <section className="related-empty">
          <p>아직 생성한 추천 결과가 없습니다. 내 조건을 입력해 주세요.</p>
          <Button className="primary" onClick={() => go('profile')}>내 조건 입력하기</Button>
        </section>
      ) : recommendation.status === 'no_results' || cards.length === 0 ? (
        <section className="related-empty">
          <p>검증된 자격증 후보를 찾지 못했습니다. 관심 분야나 입력 정보를 다시 확인해 주세요.</p>
          <Button className="primary" onClick={() => go('profile')}>조건 수정하기</Button>
        </section>
      ) : (
        <>
          <div className="related-grid">
            {cards.map((card) => (
              <article className="related-card" key={card.certificate_id}>
                <span className="badge">{card.category_name}</span>
                <h2>{card.name}</h2>
                <p className="description">{card.summary || '공식 요약 정보가 없습니다.'}</p>
                <h3>연관 직무</h3>
                <p className="job-description">
                  {card.related_jobs.length > 0
                    ? card.related_jobs.slice(0, 2).map((job) => job.name).join(' · ')
                    : '검증된 연관 직무 정보가 없습니다.'}
                </p>
                <h3 className="reason">이 자격증을 제시한 이유</h3>
                <p className="review-note">{card.reason}</p>
                <Button
                  className="primary"
                  onClick={() => openDetail(card.name, card.certificate_id)}
                >
                  상세정보 보기
                </Button>
              </article>
            ))}
          </div>
          <div className="related-actions">
            <Button onClick={() => go('profile')}>관심 분야·정보 수정</Button>
            {recommendation.items.length > cards.length && (
              <Button className="primary" onClick={() => go('recommendations')}>
                추천 자격증 더 보기 ({recommendation.items.length - cards.length}개)
              </Button>
            )}
          </div>
        </>
      )}
    </main>
  );
}
