import React, { useEffect, useState, createContext, useContext } from 'react' ;
import { auth } from "./functions/firebase.js" ;

export const AuthContext = React.createContext() ;

export const useAuth = () => {
  return useContext(AuthContext) ;
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null) ;
  const [pending, setPending] = useState(true) ;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    }) ;

    return unsubscribe ;

  }, [] ) ;

  if(pending) {
    return <>Please wait...</>
  }

  return (
    <AuthContext.Provider
        value = {{
            currentUser
        }}
    >
        {children}
    </AuthContext.Provider>
  ) ;
} ;