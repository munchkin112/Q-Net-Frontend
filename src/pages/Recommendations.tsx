import { useAppContext } from '../AppContext';
import { Button } from '../components/Button';

const recommendations = [
  {
    name: '기계정비산업기사',
    description: '기계 설비의 유지·보수에 관심이 있다면 살펴볼 수 있는 자격증입니다.',
  },
  {
    name: '컴퓨터응용가공산업기사',
    description: '기계 가공과 컴퓨터 기반 제작 분야를 탐색할 때 참고할 수 있습니다.',
  },
  {
    name: '생산자동화산업기사',
    description: '생산설비 자동화 분야에 관심이 있다면 살펴볼 수 있습니다.',
  },
  {
    name: '설비보전기사',
    description: '설비 관리와 보전 분야를 알아볼 때 참고할 수 있는 자격증입니다.',
  },
  {
    name: '기계가공기능사',
    description: '기계 가공·조립 분야를 탐색할 때 살펴볼 수 있습니다.',
  },
  {
    name: '전산응용기계제도기능사',
    description: '기계 도면과 CAD 관련 분야에 관심이 있다면 살펴볼 수 있습니다.',
  },
  {
    name: '컴퓨터응용선반기능사',
    description: '기계 가공과 선반 작업 분야를 알아볼 때 참고할 수 있습니다.',
  },
];

export default function Recommendations() {
  const { go, openDetail } = useAppContext();

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
        <p>같은 추천 결과에서 자격증을 더 살펴보세요.</p>
      </header>

      <aside className="recommendations-summary" aria-label="추천 목록 안내">
        <span className="recommendations-count">15+ 기계</span>
        <p>최대 10개까지 표시됩니다. 표시 순서는 점수 순위가 아닙니다.</p>
      </aside>

      <section className="recommendations-list" aria-labelledby="recommendations-list-title">
        <div className="recommendations-list-heading">
          <h2 id="recommendations-list-title">추가로 살펴볼 자격증</h2>
          <span>{recommendations.length}개 표시 · UI 예시</span>
        </div>
        <div className="recommendations-items">
          {recommendations.map(({ name, description }) => (
            <article className="recommendation-card" key={name}>
              <div className="recommendation-copy">
                <h3>{name}</h3>
                <div className="recommendation-description">
                  <span className="badge">국가기술자격</span>
                  <p>{description}</p>
                </div>
              </div>
              <Button className="primary" onClick={() => openDetail(name)}>
                상세정보 보기
              </Button>
            </article>
          ))}
        </div>
      </section>

      <aside className="recommendations-notice">
        <strong>추천은 응시 가능 여부의 확정 판정이 아닙니다.</strong>
        <p>추가 후보가 개별 자격 요건을 만족한다는 뜻은 아닙니다. 후보가 없으면 안내 영역은 숨깁니다.</p>
      </aside>
    </main>
  );
}
