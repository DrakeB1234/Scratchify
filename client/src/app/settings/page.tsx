'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import Popup from '@/components/popup/popup';
import styles from '../../styles/MyRecipes.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { GetUserRecipes, DeleteRecipe } from '@/supabasehelpers/database';

export default function Settings() {

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

  return (
    <>
    
    <div className={styles.SettingsParent}>
        <Navbar />
        <div className={styles.SettingsContentParent}>
          <h1>Settings</h1>
        </div>
    </div>
    </>
  )
}