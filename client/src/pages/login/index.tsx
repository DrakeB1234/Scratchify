import Head from 'next/head'
import Image from 'next/image'

// import styles / components
import LoginForm from '../components/loginForm/loginForm';
import styles from './login.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.LoginParent}>
        <LoginForm type='login' />
      </main>
      <main className={styles.LoginParent}>
        <LoginForm type='' />
      </main>
    </>
  )
}