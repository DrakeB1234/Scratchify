'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import LoadingSvg from '/public/graphics/graphic-loading-dots.svg';
import CreateRecipe from '@/components/createrecipe/createrecipe';
import styles from '../../styles/MyRecipes.module.css';

// auth
import { createClient } from 'utils/supabase-browser';
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { GetUserRecipes } from '@/supabasehelpers/database';

export default function MyRecipes() {

    const router = useRouter();
    let session: any = null;

    const [toggleRecipeCreator, setToggleRecipeCreator] = useState(false);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [recipeData, setRecipeData] = useState<any>([]);

    // checks to see is user has a session
    useEffect(() => {
      const getSession = async () => {
        session = await GetSessionAuth()
        session = session.data.session;
        // if session is null, redirect user to signin
        if (session == null) return router.replace('/signin');
        // else return getRecipes();
      };
      getSession();
    }, []);

    const getRecipes = async () => {
        // if no session set, return nothing
        if (session === null) return;
        // set loading container
        setLoadingData(true);
        let data = await GetUserRecipes(session.user.id);
        setLoadingData(false);

        // if data was unsucessful, reutn
        if (data.type !== 'success') return console.log(data)
        return setRecipeData(data.data);
    }

  return (
    <>
    {toggleRecipeCreator
      ? <CreateRecipe 
        setToggle={setToggleRecipeCreator}
        />
      : <></>
    }
    <div className={styles.MyRecipesParent}>
        <Navbar />
        <div className={styles.MyRecipesDashboardParent}>
          <div className={styles.MyRecipesDashboardContent}>

            <div className={styles.MyRecipesDashboardItem}            
            onClick={() => setToggleRecipeCreator(true)}
            >
              <div>
                <h1>Create Recipe</h1>
                <h2>0 Recipes made</h2>
              </div>
              <Image 
              alt='+'
              src='/icons/actions/icon-plus-outline.svg'
              height={50}
              width={50}
              />
            </div>

            <div className={styles.MyRecipesDashboardItem}
            onClick={() => getRecipes()}
            >
              <div>
                <h1>View My Recipes</h1>
              </div>
              <Image 
              alt='+'
              src='/icons/actions/icon-view-outline.svg'
              height={50}
              width={50}
              />
            </div>
            
          </div>
        </div>

        <div className={styles.MyRecipesContentParent}>
          <>
          {loadingData
          ? <LoadingSvg />
          : <></>
          }
          {recipeData.map((e: any, index: number) => (
            <div key={index + 'a'} className={styles.MyRecipesContentItem}>
              <Image 
              className={styles.MyRecipesContentRecipeImage}
              alt='+'
              src={e.photoUrl !== null
              ? `${e.photoUrl}`
              : '/graphics/graphic-recipe.png'
              }
              height={150}
              width={150}
              />
              <div>
                <h1>{e.title}</h1>
                <Image 
                alt='+'
                src='/icons/actions/icon-edit-outline.svg'
                height={50}
                width={50}
                />
              </div>
            </div>
          ))}
          </>
        </div>
    </div>
    </>
  )
}