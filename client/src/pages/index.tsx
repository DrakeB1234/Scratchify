import Head from 'next/head'
import Image from 'next/image'

// import styles / components
import LoginPage from './login/index';
import MealCalendar from './components/homepage/mealcalendar';
import Navbar from './components/navbar/navbar';
import styles from './homepage.module.css';

// auth
import { useSession } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function Home() {

  const session = useSession();
  const supabase = useSupabaseClient();
  let userData = {
    username: ''
  };
  
  // redirect unlogged in users, otherwise collect userdata
  if (!session){
    return <LoginPage />
  } else {
    userData = {
      username: session!.user.user_metadata.username,
    }
  }
  
  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.HomepageParent}>
        <Navbar username={userData.username}/>
        <MealCalendar />
      </main>
    </>
  )
}
