import React, {useState} from "react" ;
import '../styles/login.css'
import '../App.css' ;
import { auth } from '../functions/firebase.js' ;


const Login = ( { history }) => {

    const [email, setEmail] = useState('') ;
    const [password, setPassword] = useState('') ;
    const [error, setError] = useState(null) ;

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault() ;
        auth.signInWithEmailAndPassword(email, password)
        .then( () => {
            console.log('Logged in') ;
            setTimeout(() => {
                history.push('/live') ;                
            }, 5000) ;
        })
        .catch(error => {
            setError("Error signing in with password and email!") ;
            console.error("Error signing in with password and email", error) ;
        }) ;
    } ;

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget ;

        if(name === 'userEmail') {
            setEmail(value) ;
        }
        else if(name === 'userPassword') {
            setPassword(value) ;
        }
    } ;

    return (
        <div className = 'loginPageContainer'>

            <h1 className = 'loginTitle'>Please log into your account</h1>
            
            <div className = "loginContainer">

                {error !== null &&
                    <div className = "loginErrorMessage">{error}</div>
                }
                
                <form className = "loginForm">
                    <label htmlFor = "userEmail" className = "loginLabel">
                        Email
                    </label>
                    <input
                        type = "email"
                        className = "loginInput"
                        name = "userEmail"
                        value = {email}
                        placeholder = "E.g: armelleauclair@agon-league.com"
                        id = "userEmail"
                        onChange = {(event) => onChangeHandler(event)}
                    />
            
                    <label htmlFor = "userPassword" className = "loginLabel">
                        Password
                    </label>
                    <input
                        type = "password"
                        className = "loginInput"
                        name = "userPassword"
                        value = {password}
                        placeholder = "Your Password"
                        id = "userPassword"
                        onChange = {(event) => onChangeHandler(event)}
                    />

                    <button
                        className = "loginSubmit"
                        onClick = {(event) => {
                            signInWithEmailAndPasswordHandler(event, email, password)
                            }}
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
  ) ;
} ;

export default Login ;