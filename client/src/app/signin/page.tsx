'use client'

import Image from 'next/image';
import React, {useState} from 'react';

// import styles / components
import SigninForm from '../../components/signinform/signinform';
import styles from '../../styles/signin.module.css';

export default function Signin() {
    
    return (
        <main className={styles.SigninParent}>
            <div className={styles.BannerContainer}>
                <Image
                className={styles.ImageBanner}
                alt='logo'
                src='/scratchify/appbanner.png'
                height={100}
                width={300}
                quality={100}
                />
            </div>
            <SigninForm />
        </main>
    )
}