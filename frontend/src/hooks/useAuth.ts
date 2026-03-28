export interface AuthState {
  token: string | null;
  username: string | null;
  fullName: string | null;
  userId: number | null;
  profilePhoto: string | null;
  isLoggedIn: boolean;
}

export function useAuth(): AuthState {
  return {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    fullName: localStorage.getItem('fullName'),
    userId: localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null,
    profilePhoto: localStorage.getItem('profilePhoto'),
    isLoggedIn: !!localStorage.getItem('token'),
  };
}
