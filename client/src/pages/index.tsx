import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';

// import styles / components
import Dashboard from './components/homepage/dashboard';
import RecipeSearch from './components/homepage/recipeSearch';
import Navbar from './components/navbar/navbar';
import Popup from './components/popup/popup';
import styles from './homepage.module.css';

// auth
import { useSession } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function Home() {

  const session = useSession();

  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      {session ? <Dashboard /> : <></>}
      <main className={styles.HomepageParent}>
        <RecipeSearch />
      </main>
    </>
  )
}
