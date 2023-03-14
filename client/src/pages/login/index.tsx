import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react';

// import styles / components
import LoginForm from '../components/forms/loginForm';
import styles from './login.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Login() {

  // auth
  const [supabaseMsg, setSupabaseMsg] = useState({
    type: '',
    message: ''
  });
  const supabase = useSupabaseClient();

  // get data from register form (after input cleanup)
  const loginUser = async (formData: any) => {
    setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: '', message: ''}));

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      console.log(error);
      // invalid username / password
      if (/Invalid login/.test(error.message)) return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Error', message: 'Invalid username / password'}));
      // email not confirmed
      if (/Email not/.test(error.message)) return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Error', message: 'Account not verified, check email'}));
      // catch all
      return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Error', message: 'There was an error processing your request'}));
    } else return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Success', message: 'You good homes!'}));
  }
  
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.LoginParent}>
        <LoginForm 
          callback={loginUser} 
          supabaseMsg={supabaseMsg}
        />
      </main>
    </>
  )
}