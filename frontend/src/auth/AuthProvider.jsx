import React, { createContext, useState, useEffect } from 'react';
 import axios from 'axios';
 
 export const AuthContext = createContext({
   user: null,
   login: async () => {},
   logout: () => {}
 });
 
 export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
 
   useEffect(() => {
     const token = localStorage.getItem('token');
     if (token) {
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       axios
         .get('/api/users/me')
         .then(res => setUser(res.data))
         .catch(() => {
           localStorage.removeItem('token');
         });
     }
   }, []);
 
   const login = async (email, password) => {
     const res = await axios.post('/api/auth/login', { email, password });
     const { token, user: u } = res.data;
     localStorage.setItem('token', token);
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
     setUser(u);
     return u;
   };
 
   const logout = () => {
     localStorage.removeItem('token');
     delete axios.defaults.headers.common['Authorization'];
     setUser(null);
   };
 
   return (
     <AuthContext.Provider value={{ user, login, logout }}>
       {children}
     </AuthContext.Provider>
   );
 }