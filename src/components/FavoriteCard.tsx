import type { Certificate } from '../api/certificates';
import { useAppContext } from '../AppContext';
import { Button } from './Button';
import { certificates } from '../api/certificates';

export function FavoriteCard({c}:{c:Certificate}){const {openDetail,toggleFavorite,page}=useAppContext();return <article className="favorite-card"><span className="badge">국가기술자격</span><h2>{c.name}</h2><p>{c.job}</p><Button className="primary" onClick={()=>openDetail(c.name)}>상세보기</Button><div className="favorite-footer"><button onClick={()=>toggleFavorite(c.name)}>관심 해제</button>{page==='favorites'&&<span className="registered-on">2026.10.{String(8-certificates.indexOf(c)).padStart(2,'0')} 등록</span>}</div></article>}
