'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import SettingsChangePopup from './settingsChangePopup/settingsChangePopup';
import ConfirmPasswordPopup from './confirmPasswordPopup/confirmPasswordPopup';
import Popup from '@/components/popup/popup';
import styles from '../../styles/Settings.module.css';

// auth
import { GetSessionAuth, UpdateEmailSend, UpdatePasswordSend, UpdateUsernameSend } from '@/supabasehelpers/auth';
import { GetUserRecipes, DeleteRecipe } from '@/supabasehelpers/database';

export default function Settings() {

  const router = useRouter();
  const session = useRef<any>();

  const [toggleSettingsChange, setToggleSettingsChange] = useState(false);
  const [togglePasswordConfirm, setTogglePasswordConfirm] = useState(false);
  const [toggleDialog, setToggleDialog] = useState(false);
  const [toggleErrorDialog, setToggleErrorDialog] = useState(false);
  const settingsChangeType = useRef<string>('');
  const currentChangeData = useRef<any>();
  const changeErrorMessage = useRef('');

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

  // function to change account information
  const changeEmail = () => {
    // set settings change type to username
    settingsChangeType.current = 'email'
    setToggleSettingsChange(true)
  }

  // callback function to change password
  const changeEmailCallback = (formVal: any) => {
    // set change data
    currentChangeData.current = formVal;
    // close previous popup and open confirm password
    setToggleSettingsChange(false)
    setTogglePasswordConfirm(true);
  }

  // function to change account information
  const changeUsername = () => {
    // set settings change type to username
    settingsChangeType.current = 'username'
    setToggleSettingsChange(true)
  }

  // callback function to change password
  const changeUsernameCallback = async (formVal: any) => {
    // set change data
    currentChangeData.current = formVal;
    // close previous popup and open confirm password
    setToggleSettingsChange(false)
    setTogglePasswordConfirm(true);
  }

  // function to change account information
  const changePassword = () => {
    // set settings change type to username
    settingsChangeType.current = 'password'
    setToggleSettingsChange(true)
  }

  // callback function to change password
  const changePasswordCallback = (formVal: any) => {
    // set change data
    currentChangeData.current = formVal;
    // close previous popup and open confirm password
    setToggleSettingsChange(false)
    setTogglePasswordConfirm(true);
  }

  // callback function for confirming password
  const confirmPasswordCallback = async () => {    
    // close password confirm popup
    setTogglePasswordConfirm(false);
    // determine what function to commit
    if (currentChangeData.current.password){
      // change password
      const result = await UpdatePasswordSend({password: currentChangeData.current.password})

      // if error
      // if error show message in dialog
      if (result.type !== 'success') {
        // set error message
        changeErrorMessage.current = 'Could not change password.'
        return setToggleErrorDialog(true);
      };
      // else, show popup dialog
      return setToggleDialog(true);
    }

    if (currentChangeData.current.username){
      // change username
      const result = await UpdateUsernameSend({username: currentChangeData.current.username}, session.current.user.id)

      // if error show message in dialog
      if (result.type !== 'success') {
        // set error message
        // if error is due to unique username
        if (result.message.includes('duplicate key value violates unique constraint')) {
          changeErrorMessage.current = 'Username Taken'
        }
        else {
          changeErrorMessage.current = 'Could not change username.'
        }
        return setToggleErrorDialog(true);
      };

      // if no error, refresh page
      router.refresh();
      return setToggleDialog(true);
    }

    if (currentChangeData.current.email){
      // change username
      const result = await UpdateEmailSend({email: currentChangeData.current.email})

      // if error
      // if error show message in dialog
      if (result.type !== 'success') {
        // set error message
        // if error is due to unique username
        if (result.message.includes('A user with this email address has already been registered')) {
          changeErrorMessage.current = 'Email Taken'
        }
        else {
          changeErrorMessage.current = 'Could not change email.'
        }
        return setToggleErrorDialog(true);
      };

      // if no error, refresh page
      router.refresh();
      return setToggleDialog(true);
    }
  }

  return (
    <>
    
    <div className={styles.SettingsParent}>
        <Navbar />

        {toggleSettingsChange
        ?
        <SettingsChangePopup 
        popupToggle={setToggleSettingsChange}
        type={settingsChangeType.current}
        emailCallback={changeEmailCallback}
        usernameCallback={changeUsernameCallback}
        passwordCallback={changePasswordCallback}
        />
        : <></>
        }
        {togglePasswordConfirm
        ?
        <ConfirmPasswordPopup 
        popupToggle={setTogglePasswordConfirm}
        callback={confirmPasswordCallback}
        email={session.current.user.email}
        />
        : <></>
        }
        {toggleDialog
        ?
        <Popup 
        title={'Successfully Changed!'}
        message={['Click the ok button below to continue.', 'This can take a few minutes to update.']}
        dialog={true}
        popupToggle={setToggleDialog}
        />   
        : <></>
        }
        {toggleErrorDialog
        ?
        <Popup 
        title={changeErrorMessage.current}
        message={['Click the ok button below to continue.']}
        dialog={true}
        popupToggle={setToggleErrorDialog}
        />   
        : <></>
        }

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
              onClick={() => changeEmail()}
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
              onClick={() => changeUsername()}
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
              onClick={() => changePassword()}
            />
          </div>
        </div>
    </div>
    </>
  )
}