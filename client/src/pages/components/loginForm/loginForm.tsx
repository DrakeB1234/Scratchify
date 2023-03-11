import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react';

import styles from './loginForm.module.css';

export default function LoginForm() {
    
    const [focusEmailInput, setFocusEmailInput] = useState(false);
    const [focusPasswordInput, setFocusPasswordInput] = useState(false);
    
    return (
        <div className={styles.LoginFormParent}>
            <form className={styles.LoginForm}>
                <h1>Login!</h1>
                <label htmlFor='email' style={focusEmailInput ? {opacity:'1', transform: 'translatey(12px)'} : {opacity:'0', transform: 'translatey(36px)'}}>Email or Username</label>
                <input type='text' placeholder='Email or Username' autoComplete='off' onFocus={() => setFocusEmailInput(true)} onBlur={() => setFocusEmailInput(false)} name='email' />
                <label htmlFor='email' style={focusPasswordInput ? {opacity:'1', transform: 'translatey(12px)'} : {opacity:'0', transform: 'translatey(36px)'}}>Password</label>
                <input type='password' placeholder='Password' autoComplete='off' onFocus={() => setFocusPasswordInput(true)} onBlur={() => setFocusPasswordInput(false)} name='password' />
                <button type='button'>Login</button>
            </form>
        </div>
    )
  }