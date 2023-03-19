import Head from 'next/head'
import Image from 'next/image'

// import styles / components
import Dashboard from './components/homepage/dashboard';
import RecipeSearch from './components/homepage/recipeSearch';
import Navbar from './components/navbar/navbar';
import styles from './homepage.module.css';

// auth
import { useSession } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function Home() {

  const session = useSession();
  const supabase = useSupabaseClient();
  
  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.HomepageParent}>
        <Navbar username={'username'}/>
        {session ? <Dashboard /> : <></>}
        <RecipeSearch />
      </main>
    </>
  )
}
