import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react';

// import styles / components
import RegisterForm from '../components/forms/registerForm';
import VerifyAccount from '../components/verifyaccount/verifyaccount';
import styles from './register.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Register() {

  // auth
  const [supabaseMsg, setSupabaseMsg] = useState({
    type: '',
    message: ''
  });
  const supabase = useSupabaseClient();

  // get data from register form (after input cleanup)
  const registerUser = async (formData: any) => {
    setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: '', message: ''}));

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username
          }
        }
      }
    );

    if (error) {
      console.log(error);
      return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Error', message: 'Could not create account, try again later!'}));
    } else return setSupabaseMsg(supabaseMsg => ({...supabaseMsg, type: 'Success', message: 'Account created, awaiting verfication!'}));
  }

  return (
    <>
    <Head>
      <title>Register</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    {(supabaseMsg.type != 'Success') ?
      <main className={styles.LoginParent}>
        <RegisterForm 
          callback={registerUser} 
          supabaseMsg={supabaseMsg}
        />
      </main>
    :
    <main className={styles.LoginParent}>
      <VerifyAccount />
    </main>
    }
    </>
  )
}