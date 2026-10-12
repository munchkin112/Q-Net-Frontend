import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CalendarEntry } from './api/calendar';
import type { Certificate, Page } from './api/certificates';
import type { Profile } from './api/profile';

export type AppContextValue = {
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
  logged: boolean;
  setLogged: Dispatch<SetStateAction<boolean>>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  favorites: string[];
  setFavorites: Dispatch<SetStateAction<string[]>>;
  calendar: CalendarEntry[];
  setCalendar: Dispatch<SetStateAction<CalendarEntry[]>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  submitted: string;
  setSubmitted: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  more: boolean;
  setMore: Dispatch<SetStateAction<boolean>>;
  homeResetKey: number;
  returnPage: Page;
  setReturnPage: Dispatch<SetStateAction<Page>>;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  calendarKey: string;
  setCalendarKey: Dispatch<SetStateAction<string>>;
  examType: string;
  setExamType: Dispatch<SetStateAction<string>>;
  round: number;
  setRound: Dispatch<SetStateAction<number>>;
  toast: string;
  setToast: Dispatch<SetStateAction<string>>;
  dialog: boolean;
  setDialog: Dispatch<SetStateAction<boolean>>;
  favoriteSearch: string;
  setFavoriteSearch: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  go: (to: Page) => void;
  goHome: () => void;
  protectedGo: (to: Page) => void;
  openDetail: (name: string) => void;
  toggleFavorite: (name: string) => void;
  openCalendar: (name: string, id?: string) => void;
  calendarId: (entry: CalendarEntry) => string;
  cert: Certificate;
  registered: boolean;
  register: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppContextProvider = AppContext.Provider;

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}
