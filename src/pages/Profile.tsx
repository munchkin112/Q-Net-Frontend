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

export default function Profile() {
  const {
    page, logged, setLogged, selected, setSelected, favorites, setFavorites,
    calendar, setCalendar, search, setSearch, submitted, setSubmitted,
    category, setCategory, more, setMore, returnPage, setReturnPage, profile,
    setProfile, calendarKey, setCalendarKey, examType, setExamType, round,
    setRound, toast, setToast, dialog, setDialog, favoriteSearch,
    setFavoriteSearch, sort, setSort, go, protectedGo, openDetail,
    toggleFavorite, openCalendar, calendarId, cert, registered, register,
  } = useAppContext();
  const fields = profileFields;

  return (
    <main className="profile-main">
      <h1>내 조건으로 찾기</h1>
      <p className="muted">별도 추가 질문 화면 없이 필요한 입력을 이 화면에서 펼쳐 보여줍니다.</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!profile.education.trim()) {
            setToast('최종 학력·졸업 상태를 입력해 주세요.');
            return;
          }
          if (profile.experience && !profile.years) {
            setToast('관련 직무 년차를 입력해 주세요.');
            return;
          }
          go('related');
        }}
      >
        <label className="field-label">관심 분야 *</label>
        <div className="field-placeholder">
          {`${String(profile.field + 1).padStart(2, '0')} ${fields[profile.field]}`}
        </div>
        <div className="field-grid" role="radiogroup" aria-label="관심 분야">
          {fields.map((f, i) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={profile.field === i}
              className={profile.field === i ? 'chosen' : ''}
              onClick={() => setProfile({ ...profile, field: i })}
            >
              {String(i + 1).padStart(2, '0')} {f}
            </button>
          ))}
        </div>
        <div className="profile-grid">
          <label>
            최종 학력·졸업 상태 *
            <input
              required
              value={profile.education}
              onChange={e => setProfile({ ...profile, education: e.target.value })}
              placeholder="고졸 / 전문대 / 대학 / 기타 · 졸업 / 재학 등"
            />
          </label>
          <label>
            전공 · 선택
            <input
              value={profile.major}
              onChange={e => setProfile({ ...profile, major: e.target.value })}
              placeholder="직접 입력 / 해당 없음 / 잘 모르겠어요"
            />
          </label>
          <fieldset>
            <legend>관련 경력 *</legend>
            <div className="experience">
              {[true, false].map(v => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={profile.experience === v}
                  className={profile.experience === v ? 'chosen' : ''}
                  onClick={() => setProfile({ ...profile, experience: v })}
                >
                  {v ? '있어요' : '없어요'}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            관련 직무 년차 *
            <div className="years">
              <input
                aria-label="관련 직무 년차"
                type="number"
                min="0"
                max="80"
                placeholder="ex) 3"
                disabled={!profile.experience}
                value={profile.years}
                onChange={e => setProfile({ ...profile, years: e.target.value })}
              />
              <span>년(연)</span>
            </div>
          </label>
        </div>
        <Button type="submit" className="primary profile-submit">
          저장하고 관련 자격증 보기
        </Button>
      </form>
    </main>
  );
}
