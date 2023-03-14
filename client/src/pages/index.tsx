import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'

// import styles / components
import LoginPage from './login/index';

// auth
import { useSession } from '@supabase/auth-helpers-react'

export default function Home() {

  const router = useRouter();
  const session = useSession();
  
  // redirect unlogged in users
  if (!session){
    return <LoginPage />
  }
  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h1>This is main</h1>
      </main>
    </>
  )
}
