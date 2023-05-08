'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import Popup from '@/components/popup/popup';
import styles from '../../styles/Settings.module.css';

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
        // else refresh component to show session data
        router.refresh();
      };
      getSession();
    }, []);

  return (
    <>
    
    <div className={styles.SettingsParent}>
        <Navbar />
        <div className={styles.SettingsContentParent}>
          <div className={styles.SettingsHeaderContainer}>
            <h1>Account Settings</h1>
          </div>
          <div className={styles.SettingsItem}>
            <h1>Email</h1>
            <h2>{session.current && session.current.user.email}</h2>
            <Image 
              alt='change'
              src='/icons/actions/icon-edit-outline.svg'
              height={30}
              width={30}
              quality={100}
            />
          </div>
          <div className={styles.SettingsItem}>
            <h1>Username</h1>
            <h2>{session.current && session.current.user.user_metadata.username}</h2>
            <Image 
              alt='change'
              src='/icons/actions/icon-edit-outline.svg'
              height={30}
              width={30}
              quality={100}
            />
          </div>
          <div className={styles.SettingsItem}>
            <h1>Password</h1>
            <h2>{session.current ? '*******' : ''}</h2>
            <Image 
              alt='change'
              src='/icons/actions/icon-edit-outline.svg'
              height={30}
              width={30}
              quality={100}
            />
          </div>
        </div>
    </div>
    </>
  )
}