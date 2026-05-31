import { create } from 'zustand';

type Role = 'student' | 'teacher';

interface UserInfo {
  id: string;
  name: string;
  role: Role;
}

interface UserState {
  isLoggedIn: boolean;
  role: Role;
  name: string;
  id: string;
  aiHidden: boolean;
  setRole: (role: Role) => void;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  setAiHidden: (hidden: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  role: 'student', 
  name: '',
  id: '',
  aiHidden: false,
  setRole: (role) => set({ role, name: role === 'student' ? '张同学' : '李老师', id: role === 'student' ? '20230001' : 'T8801' }),
  login: (userInfo) => set({ isLoggedIn: true, ...userInfo }),
  logout: () => set({ isLoggedIn: false, role: 'student', name: '', id: '', aiHidden: false }),
  setAiHidden: (hidden) => set({ aiHidden: hidden })
}));
