import { useState } from 'react';
import {
  profileFields, educationOptions, educationStatusOptions, getProfilePayload,
} from '../api/profile';
import {
  createRecommendations, getSavedProfile, RecommendationApiError, updateSavedProfile,
} from '../api/recommendations';
import { useAppContext } from '../AppContext';
import { Button } from '../components/Button';

export default function Profile() {
  const { profile, setProfile, setRecommendation, go } = useAppContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fields = profileFields;

  return (
    <main className="profile-main">
      <h1>내 조건으로 찾기</h1>
      <p className="muted">별도 추가 질문 화면 없이 필요한 입력을 이 화면에서 펼쳐 보여줍니다.</p>
      <form
        onSubmit={async e => {
          e.preventDefault();
          if (busy) return;
          setError('');
          try {
            getProfilePayload(profile);
            setBusy(true);
            setRecommendation(null);
            const current = await getSavedProfile();
            const saved = await updateSavedProfile(profile, current.profile_version);
            if (!saved.profile_completed) {
              throw new Error('프로필에 필요한 정보를 모두 입력해 주세요.');
            }
            const results = await createRecommendations();
            setRecommendation(results);
            go('related');
          } catch (cause) {
            if (cause instanceof RecommendationApiError && cause.status === 409) {
              setError('다른 화면에서 프로필이 변경됐습니다. 입력 내용을 확인하고 다시 시도해 주세요.');
            } else {
              setError(cause instanceof Error ? cause.message : '추천 결과를 불러오지 못했습니다.');
            }
          } finally {
            setBusy(false);
          }
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
            최종 학력 *
            <select
              required
              value={educationOptions.some(option => option.value === profile.education) ? profile.education : ''}
              onChange={e => setProfile({ ...profile, education: e.target.value })}
            >
              <option value="" disabled>최종 학력을 선택해주세요</option>
              {educationOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label>
            졸업 상태 *
            <select required value={profile.educationStatus || ''}
              onChange={e => setProfile({ ...profile, educationStatus: e.target.value })}>
              <option value="" disabled>졸업 상태를 선택해주세요</option>
              {educationStatusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
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
                  onClick={() => setProfile({ ...profile, experience: v, years: v ? profile.years : '' })}
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
                step="0.1"
                required={profile.experience}
                placeholder="ex) 3"
                disabled={!profile.experience}
                value={profile.years}
                onChange={e => setProfile({ ...profile, years: e.target.value })}
              />
              <span>년(연)</span>
            </div>
          </label>
        </div>
        <Button type="submit" className="primary profile-submit" disabled={busy}>
          {busy ? '프로필 저장·추천 생성 중…' : '저장하고 관련 자격증 보기'}
        </Button>
        {error && <p role="alert" className="profile-error">{error}</p>}
      </form>
    </main>
  );
}
