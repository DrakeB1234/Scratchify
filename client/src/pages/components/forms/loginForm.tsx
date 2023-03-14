import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './form.module.css';

export default function LoginForm(props: any) {
    
    // register inputs w/ feedback
    const [loginInput, setLoginInput] = useState({
        email: '',
        password: '',
    });
    const [loginFeedback, setLoginFeedback] = useState({
        email: '',
        password: '',
    });

    // check register input (no checks neccessary, send data)
    const checkLoginInput = () => {
        // reset feedback
        setLoginFeedback(prev => ({...prev, email: '', password: ''}));

        // check email
        if(!loginInput.email){
            return setLoginFeedback(prev => ({...prev, email: 'Required'}));
        } else if (!/^\S+@\S+\.\S+$/.test(loginInput.email)){
            return setLoginFeedback(prev => ({...prev, email: 'Invalid Email'}));
        };
        // check email
        if(!loginInput.password){
            return setLoginFeedback(prev => ({...prev, password: 'Required'}));
        }

        props.callback(loginInput);
    }
    
    return (  
        <div className={styles.FormParent}>
            <form className={styles.FormStyle}>
                <h1>Login</h1>

                <input type='text' autoComplete='off' name='email' placeholder='Email' onChange={(e) => setLoginInput(prev => ({...prev, email: e.target.value}))} />
                <label htmlFor='email'>Email</label>
                <h2>{loginFeedback.email}</h2>

                <input type='password' autoComplete='off' name='password' placeholder='Password' onChange={(e) => setLoginInput(prev => ({...prev, password: e.target.value}))} />
                <label htmlFor='email'>Password</label>
                <h2>{loginFeedback.password}</h2>
                
                <h3 className={props.supabaseMsg.type == 'Error' ? styles.Error : styles.Success}>{props.supabaseMsg.message}</h3>

                <button type='button' onClick={checkLoginInput}>Login</button>
                <Link href='/register'><button type='button'>Register Account</button></Link>
            </form>
        </div>
    )
  }