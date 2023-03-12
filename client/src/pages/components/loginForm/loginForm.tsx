import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './loginForm.module.css';

export default function LoginForm(props: any) {
    
    const [loginFeedback, setLoginFeedback] = useState('Invalid username/password');
    // register inputs w/ feedback
    const [registerInput, setRegisterInput] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [registerFeedback, setRegisterFeedback] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    // check register input
    const checkRegisterInput = () => {

        // check email
        if(!registerInput.email){
            return setRegisterFeedback(prev => ({...prev, email: 'Required'}));
        } else if (!/^\S+@\S+\.\S+$/.test(registerInput.email)){
            return setRegisterFeedback(prev => ({...prev, email: 'Invalid Email'}));
        };
        // check username input (a-Z 0-9 and -) and at 3-30 characters
        if(!registerInput.username){
            return setRegisterFeedback(prev => ({...prev, username: 'Required'}));
        } else if (!/^[\w-]{3,30}$/.test(registerInput.username)){
            return setRegisterFeedback(prev => ({...prev, username: '3-30 characters, letters, numbers, -'}));
        };
        // check password input (all characters allowed, except spaces and unicode) 5-100 characters
        if(!registerInput.password){
            return setRegisterFeedback(prev => ({...prev, password: 'Required'}));
        } else if (!/^[\w:'",.?<>!@#$|%^&*()_\-+=,.\/\{\}\[\]\\]{5,100}$/.test(registerInput.password)){
            return setRegisterFeedback(prev => ({...prev, password: '5-100 characters, letters, numbers, -'}));
        };
        // check if password matches
        if(!registerInput.confirmPassword){
            return setRegisterFeedback(prev => ({...prev, confirmPassword: 'Required'}));
        } else if (registerInput.password != registerInput.confirmPassword){
            return setRegisterFeedback(prev => ({...prev, confirmPassword: 'Passwords do not match' }));
        };

        // if no feedback, then input is cleared
        if(registerFeedback.email == '' && registerFeedback.username == '' && registerFeedback.password == '' && registerFeedback.confirmPassword == ''){
            alert('Good Job');
        }
    }
    
    return (
        <>
        {(props.type === 'login') 
        ?        
        <div className={styles.LoginFormParent}>
            <form className={styles.LoginForm}>
                <h1>Login</h1>
                <input type='text' autoComplete='off' name='email' placeholder='Email or Username' />
                <label htmlFor='email'>Email or Username</label>
                <input type='password' autoComplete='off' name='password' placeholder='Password' />
                <label htmlFor='email'>Password</label>
                <h3>{loginFeedback}</h3>
                <button type='button'>Login</button>
            </form>
        </div>
        :
        <div className={styles.LoginFormParent}>
            <form className={styles.LoginForm}>
                <h1>Register</h1>

                <input type='text' autoComplete='off' name='email' placeholder='Email' onChange={
                    (e) => { setRegisterInput(prev => ({...prev, email: e.target.value})); 
                    setRegisterFeedback(prev => ({...prev, email: ''}))}} 
                    style={registerFeedback.email != '' ? {border: '1px solid var(--red-color)'} : {}}/>
                <label htmlFor='email'>Email</label>
                <h2>{registerFeedback.email}</h2>

                <input type='text' autoComplete='off' name='username' placeholder='Username' onChange={
                    (e) => { setRegisterInput(prev => ({...prev, username: e.target.value})); 
                    setRegisterFeedback(prev => ({...prev, username: ''}))}} 
                    style={registerFeedback.username != '' ? {border: '1px solid var(--red-color)'} : {}}/>
                <label htmlFor='username'>Username</label>
                <h2>{registerFeedback.username}</h2>

                <input type='password' autoComplete='off' name='password' placeholder='Password' onChange={
                    (e) => { setRegisterInput(prev => ({...prev, password: e.target.value})); 
                    setRegisterFeedback(prev => ({...prev, password: ''}))}} 
                    style={registerFeedback.password != '' ? {border: '1px solid var(--red-color)'} : {}}/>
                <label htmlFor='password'>Password</label>
                <h2>{registerFeedback.password}</h2>

                <input type='password' autoComplete='off' name='confirmPassword' placeholder='Confirm Password' onChange={
                    (e) => { setRegisterInput(prev => ({...prev, confirmPassword: e.target.value})); 
                    setRegisterFeedback(prev => ({...prev, confirmPassword: ''}))}} 
                    style={registerFeedback.confirmPassword != '' ? {border: '1px solid var(--red-color)'} : {}}/>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <h2>{registerFeedback.confirmPassword}</h2>

                <button type='button' onClick={checkRegisterInput}>Register Account</button>
                <Link href='/'><button type='button'>Back to Login</button></Link>
            </form>
        </div>
        }
        </>
    )
  }