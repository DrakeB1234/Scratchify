'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import LoadingSvg from '/public/graphics/graphic-loading-dots.svg';
import CreateRecipe from '@/components/createrecipe/createrecipe';
import EditRecipe from '@/components/createrecipe/editrecipe';
import Popup from '@/components/popup/popup';
import styles from '../../styles/MyRecipes.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { GetUserRecipes, DeleteRecipe } from '@/supabasehelpers/database';

export default function MyRecipes() {

    const router = useRouter();
    const session = useRef<any>();

    const [toggleRecipeCreator, setToggleRecipeCreator] = useState(false);
    const [toggleRecipeEditor, setToggleRecipeEditor] = useState(false);
    const [popupConfirmDelete, setPopupConfirmDelete] = useState(false);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [recipeData, setRecipeData] = useState<any>([]);
    const recipeIdRef = useRef(0);

    // checks to see is user has a session
    useEffect(() => {
      const getSession = async () => {
        session.current = await GetSessionAuth()
        session.current = session.current.data.session;
        
        // if session is null, redirect user to signin
        if (session.current == null) return router.replace('/signin');
        // else return getRecipes();
      };
      getSession();
    }, []);

    // edit function
    const editRecipe = (recipeId: number) => {
      // sets current recipeId to transfer to edit component
      recipeIdRef.current = recipeId;
      setToggleRecipeEditor(true);
    }

    // confirm delete recipe function
    const confirmDeleteRecipe = (recipeId: number) => {
      // sets current recipeId to transfer to delete confirm component
      recipeIdRef.current = recipeId;
      setPopupConfirmDelete(true);
    }

    // delete recipe function
    const deleteRecipe = async () => {
      // call delete recipe
      let result = await DeleteRecipe(session.current.user.id, recipeIdRef.current);

      setPopupConfirmDelete(false);

      if (result.response != "success") return;
      // if recipe deleted successfully, replace url to homepage
      else router.replace('/');
    }

    const getRecipes = async () => {
        // if no session set, return nothing
        if (session.current === null) return;
        // set loading container
        setLoadingData(true);
        let data = await GetUserRecipes(session.current.user.id);
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

    {toggleRecipeEditor
      ? <EditRecipe 
        setToggle={setToggleRecipeEditor}
        userId={session.current.user.id}
        recipeId={recipeIdRef.current}
        />
      : <></>
    }

    {popupConfirmDelete
      ? <Popup 
        popupToggle={setPopupConfirmDelete}
        title="Confirm Recipe Deletion"
        message={["Are you sure you want to delete this recipe?", `This action CAN NOT be undone. If you do not wish to delete this recipe,
        then please press the cancel button below, otherwise continue with the yes button`]}
        confirm={true}
        callback={deleteRecipe}
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
            <div key={index + 'a'} className={styles.MyRecipesContentItem}
            >
              <div className={styles.MyRecipesRow}>
                <Image 
                className={styles.MyRecipesContentRecipeImage}
                alt='+'
                src={e.photoUrl !== null
                ? `${e.photoUrl}`
                : '/graphics/graphic-recipe.png'
                }
                height={120}
                width={120}
                />
                <h1>{e.title}</h1>
              </div>
              <div className={styles.MyRecipesRowButtons}>
                <div
                onClick={() => editRecipe(e.recipe_id)}
                >
                  <Image 
                  alt='edit'
                  src='/icons/actions/icon-edit-outline.svg'
                  height={25}
                  width={25}
                  />
                </div>
                <div
                onClick={() => confirmDeleteRecipe(e.recipe_id)}
                >
                  <Image 
                  alt='edit'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={25}
                  width={25}
                  />
                </div>
              </div>

            </div>
          ))}
          </>
        </div>
    </div>
    </>
  )
}