import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    username: 'director',
    password: 'password123',
    name: 'Директор магазина',
    role: 'director',
  },
];

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, name: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: mockUsers,
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        const users = get().users;
        const user = users.find(
          (u) => u.username === username && u.password === password
        );
        
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      register: (username: string, password: string, name: string) => {
        const users = get().users;
        
        if (users.some((u) => u.username === username)) {
          return false;
        }
        
        const newUser: User = {
          id: Date.now().toString(),
          username,
          password,
          name,
          role: 'director',
        };
        
        set({ users: [...users, newUser] });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
