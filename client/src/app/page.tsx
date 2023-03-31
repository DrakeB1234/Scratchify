import 'server-only';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../styles/Home.module.css';

// auth
import { createClient } from '../../utils/supabase-server';

// do not cache this page
export const revalidate = 0;

export default async function Home() {

    const supabase = createClient();
    const session = supabase.auth.getSession();

    // if no session
    if (!session) return console.log('no session found');
    
    const { data } = await supabase.from('recipe').select('*');

  return (
    <div className={styles.HomeParent}>
        <Navbar />
        <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </div>
  )
}