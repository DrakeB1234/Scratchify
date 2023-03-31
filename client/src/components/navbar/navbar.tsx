'use client'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, {useEffect, useState, useRef} from 'react';

// import styles / components
import styles from './navbar.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';
import { SignoutAuth } from '@/supabasehelpers/auth';

export default function Navbar() {

    const [toggleMobile, setToggleMobile] = useState(false);
    const pathname = usePathname();
    const [session, setSession] = useState<any>();
    const router = useRouter();
    
    // calls get session from auth helpers to display apporiate data for user
    useEffect(() => {
        const getSession = async () => {
            const session = await GetSessionAuth();
            setSession(session.data.session);
        };
        getSession();
    }, []);

    return (
        <div className={styles.NavbarParent}>
            <div className={styles.NavbarDesktopParent}>
                <Image
                className={styles.NavbarImageBanner}
                alt='logo'
                src='/scratchify/appbanner.png'
                height={100}
                width={300}
                quality={100}
                />
                Im the navbar
            </div>

            <div className={styles.NavbarMobileParent}>
                <Image
                className={styles.NavbarImageLogo}
                alt='logo'
                src='/scratchify/applogo.png'
                height={100}
                width={300}
                quality={100}
                />
                <Image
                className={styles.NavbarImageHamburger}
                alt='logo'
                src='/icons/navbar/icon-bars.svg'
                height={50}
                width={50}
                onClick={() => {
                    setToggleMobile(!toggleMobile)
                }}
                />
                 <div className={styles.NavbarMobileContent}
                style={toggleMobile ? {left: '0'} : {left: '-100vw'}}
                onClick={() => setToggleMobile(false)}
                >
                    <div className={styles.NavbarMobileContentChild}>
                        <div className={styles.NavbarMobileContentWelcome}>
                            <Image
                            className={styles.NavbarImageBanner}
                            alt='logo'
                            src='/scratchify/appbanner.png'
                            height={100}
                            width={300}
                            quality={100}
                            />
                            {session
                            ? <h1>Hello, DrakeB123!</h1>
                            : <h1>Hello, Guest!</h1>
                            }
                        </div>
                        <Link href='/' className={pathname === '/' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-house-outline.svg'
                            height={50}
                            width={50}
                            />
                            Home
                        </Link>
                        <Link href='/' className={pathname === '/recipes' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-recipe-outline.svg'
                            height={50}
                            width={50}
                            />
                            Recipes
                        </Link>

                        {session
                        ?
                        <>
                        <Link href='/' className={pathname === '/myrecipes' ? styles.MobileLink + ' ' + styles.MobileLinkSpaced + ' ' + styles.ActiveLink : styles.MobileLink + ' ' + styles.MobileLinkSpaced}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-myrecipes-outline.svg'
                            height={50}
                            width={50}
                            />
                            My Recipes
                        </Link>
                        <Link href='/' className={pathname === '/mealplanner' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-planner-outline.svg'
                            height={50}
                            width={50}
                            />
                            Meal Planner
                        </Link>
                        <Link href='/' className={pathname === '/grocerylist' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-list-outline.svg'
                            height={50}
                            width={50}
                            />
                            Grocery List
                        </Link>
                        <Link href='/' className={pathname === '/recipes' ? styles.MobileLink + ' ' + styles.MobileLinkSpaced + ' ' + styles.ActiveLink : styles.MobileLink + ' ' + styles.MobileLinkSpaced}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-settings-outline.svg'
                            height={50}
                            width={50}
                            />
                            Settings
                        </Link>
                        <button className={styles.MobileLink}
                        onClick={() => {
                            SignoutAuth();
                            router.replace('/signin');
                        }}
                        >                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/actions/icon-logout-outline.svg'
                            height={50}
                            width={50}
                            />
                            Sign out
                        </button>
                        </>
                    : 
                    <>
                    <Link href='/signin' className={styles.MobileLink + ' ' + styles.MobileLinkSpaced}>                
                        <Image 
                        className={styles.NavbarImageLinkIcon}
                        alt=''
                        src='/icons/actions/icon-logout-outline.svg'
                        height={50}
                        width={50}
                        />
                        Sign in
                    </Link>
                    </>
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}