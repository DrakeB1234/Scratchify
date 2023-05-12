'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from '../settingsChangePopup/popup.module.css';

// auth
import { SigninAuth } from '@/supabasehelpers/auth';
import { SignoutAuth } from '@/supabasehelpers/auth';


// typedef
type Props = {
    popupToggle: any,
    callback?: any,
    email: any

}

export default function ConfirmPasswordPopup(props: Props) {
    
    // typedefs
    type Inputs = {
        password: string,
    };

    const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>();

    const router = useRouter();
    const passwordCheck = useRef(1);

    const handleSave = async (formVal: Inputs) => {
        // ensure user only is able to check password 3 times
        if (passwordCheck.current >= 3) {
            // log user out
            SignoutAuth();
            // return user to sign in page
            return router.replace('/signin');
        };
        // increment password check var
        passwordCheck.current = passwordCheck.current + 1;

        // check if password matches
        const result = await SigninAuth({email: props.email, password: formVal.password})

        // if user does not type in correct password, show error
        if (result.type !== 'success') return setError('password', {message: 'Incorrect Password'})
        // if password is correct, call callback function
        props.callback();
        
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Confirm Current Password</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={50}
                  width={50}
                />
            </div>

            <h2>Enter your accounts current password before continuing</h2>

            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='password'>Password</label>
                <input {...register('password', {
                    required: {
                        value: true,
                        message: 'Required'
                    }
                })}
                autoComplete='off'
                type='password'
                />
                    
                <h1 className={styles.FormInputError}>{errors?.password?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Submit</button>

            </form>
        </div>
    </div>
  )
}
