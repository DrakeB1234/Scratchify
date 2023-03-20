import Head from 'next/head'
import Image from 'next/image'
import { useEffect } from 'react';

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
  let data:any = {};

  const loadData = async () => {
    let { data: Recipe, error } = await supabase.from('Recipe').select('*')

    // error handler
    if (error) console.error(error);
    // assign data
    data = Recipe;
    console.log(data)
  };

  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className={styles.HomepageParent}>
        {session ? <Dashboard /> : <></>}
        <RecipeSearch />
      </main>
    </>
  )
}
