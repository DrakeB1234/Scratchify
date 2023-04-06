'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, {useState} from 'react';

// import styles / components
import SignupForm from '../../components/signinform/signupform';
import styles from '../../styles/signin.module.css';

export default function Signup() {

    const router = useRouter();

    type FormInputs = {
        email: string,
        username: string,
        password: string,
        cpassword: string
    };

    const signUpUser = (formVal: FormInputs) => {
        console.log(formVal)
        return router.replace('/signin');
    };
    
    return (
        <main className={styles.SigninParent}>
            <div className={styles.BannerContainer}>
            </div>
            <SignupForm 
            callback={signUpUser}
            />
        </main>
    )
}