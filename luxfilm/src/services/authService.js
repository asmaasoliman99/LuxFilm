/**
 * Local Authentication Service using LocalStorage
 */

const USERS_KEY = 'luxfilm_users';
const SESSION_KEY = 'luxfilm_session';

export const authService = {
  /**
   * Register a new user locally
   */
  registerUser: (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }

      if (userData.userName && users.find(u => u.userName === userData.userName)) {
        throw new Error('Username is already taken');
      }

      // Save new user
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user locally
   */
  loginUser: (email, password) => {

    try {
      // get all users from local storage
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      // find user by email and password
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create session (removing password from session data for safety -- simulated)
      const { password: _, ...sessionUser } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

      return sessionUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Get current logged in user
   */
  getCurrentUser: () => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: () => {
    return !!localStorage.getItem(SESSION_KEY);
  }
};

export default authService;
