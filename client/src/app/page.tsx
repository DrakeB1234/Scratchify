import 'server-only';

import Image from 'next/image';
import Link from 'next/link';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../styles/Home.module.css';

// auth
import { createClient } from '../../utils/supabase-server';
import { GetSessionAuth } from '@/supabasehelpers/auth';

// do not cache this page
export const revalidate = 90;

export default async function Home() {

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('recipe')
      .select('title, photoUrl, profiles(username), recipe_saved(id)')
      .order('recipe_id', {
        ascending: false
      }
      )
      .limit(6)
    ;

    // checks to see is user has a session
    let session: any = await supabase.auth.getSession();
    session = session.data.session
    
    return (
      <div className={styles.HomeParent}>
          <Navbar />
          <div className={styles.BannerContainer}>
              <Image 
              alt=''
              src='/scratchify/appbanner.png'
              height={70}
              width={340}
              quality={100}
              />
            </div>
  
          {!session
          ?
          <div className={styles.AccountCreationContainer}>
            <h1>Having an account with us gives you access to:</h1>
            <ul>
              <li>Save Recipes</li>
              <li>Make Recipes</li>
              <li>Grocery List</li>
              <li>Meal Planner</li>
            </ul>
            <Link href='/signup'>Signup Here!</Link>
          </div>
          :
          <div className={styles.AccountContainer}>
            <h1>Make sure to check out these features included with your account!</h1>
            <ul>
              <li>Save Recipes</li>
              <li>Make Recipes</li>
              <li>Grocery List</li>
              <li>Meal Planner</li>
            </ul>
          </div>
          }
  
          <h1>Recent Recipes</h1>
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
  
          <h1>Explore by Course!</h1>
          <div className={styles.ExploreContainer}>
            <Link href='/search?filterCourse=Breakfast' className={styles.ExploreItemParent}>
              <h1>Breakfast</h1>
            </Link>
            <Link href='/search?filterCourse=Lunch' className={styles.ExploreItemParent}>
              <h1>Lunches</h1>
            </Link>
          </div>
          <div className={styles.ExploreContainer}>
            <Link href='/search?filterCourse=Dinner' className={styles.ExploreItemParent}>
              <h1>Dinner</h1>
            </Link>
            <Link href='/search?filterCourse=Dessert' className={styles.ExploreItemParent}>
              <h1>Desserts</h1>
            </Link>
          </div>
  
          <h1>Explore by Popular Tags!</h1>
          <div className={styles.ExploreContainer}>
            <Link href='/search?filterTag=Italian' className={styles.ExploreItemParent}>
              <h1>Italian</h1>
            </Link>
            <Link href='/search?filterTag=Mexican' className={styles.ExploreItemParent}>
              <h1>Mexican</h1>
            </Link>
            <Link href='/search?filterTag=American' className={styles.ExploreItemParent}>
              <h1>American</h1>
            </Link>
          </div>
          <div className={styles.ExploreContainer}>
            <Link href='/search?filterTag=Healthy' className={styles.ExploreItemParent}>
              <h1>Healthy</h1>
            </Link>
            <Link href='/search?filterTag=Easy' className={styles.ExploreItemParent}>
              <h1>Easy</h1>
            </Link>
            <Link href='/search?filterTag=Cheesy' className={styles.ExploreItemParent}>
              <h1>Cheesy</h1>
            </Link>
          </div>
  
      </div>
    )
}