import 'server-only';

import Image from 'next/image';
import Link from 'next/link';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../styles/Home.module.css';

// auth
import { createClient } from '../../utils/supabase-server';

// do not cache this page
export const revalidate = 90;

export default async function Home() {

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('recipe')
      .select('title, photoUrl, profiles(username), recipe_saved(id)')
    ;

  return (
    <div className={styles.HomeParent}>
        <Navbar />
        <div className={styles.RecipeParent}>
          <h1 className={styles.RecipeTitle}>Trending Recipes</h1>
          <div className={styles.RecipeItemContainer}>
            {data && data.map((e: any, index: number) => (
              <Link href={`/recipe/${e.title}`}
              key={index + 'a'} className={styles.RecipeItem}
              >
                <Image 
                className={styles.RecipeImage}
                alt='image'
                src={e.photoUrl !== null
                ? `${e.photoUrl}`
                : '/graphics/graphic-recipe.png'
                }
                height={300}
                width={300}
                quality={100}
                />
                <h1>{e.title}</h1>
                <div className={styles.RecipeItemInfo}>
                  <h1>@{e.profiles.username}</h1>
                  <div>
                    <h1>{e.recipe_saved.length}</h1>
                    <Image 
                    alt='image'
                    src='/icons/actions/icon-save-outline.svg'
                    height={50}
                    width={50}
                    quality={100}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  )
}