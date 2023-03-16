import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {useState} from 'react';

import styles from './navbar.module.css';

export default function Navbar(props: any) {
    
    return (  
        <>
            {/* <div className={styles.DesktopNavbarParent}>
                <Link href='/'>
                    <Image 
                    alt='Home'
                    src='/graphics/applogo-scratchify.svg'
                    height={100}
                    width={100}
                    />
                </Link>
                <Link href=''>Grocery List</Link>
                <Link href=''>Meal Planner</Link>
                <Link href=''>Recipes</Link>
                <Link href=''>Profile</Link>
            </div> */}
            <div className={styles.MobileNavbarParent}>
                <Link href='/'>
                    <Image 
                    alt='Home'
                    src='/graphics/applogo-scratchify.svg'
                    height={100}
                    width={100}
                    />
                </Link>
                <Image 
                alt='='
                src='/icons/icon-bars.svg'
                height={50}
                width={50}
                />
            </div>
        </>
    )
  }