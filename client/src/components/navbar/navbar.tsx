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

    const [toggleDesktop, setToggleDesktop] = useState(false);
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
                <button className={styles.NavbarImageBars}
                onClick={() => setToggleDesktop(!toggleDesktop)}
                >
                    <Image
                    className={styles.NavbarImageIcon}
                    alt='logo'
                    src='/icons/navbar/icon-bars.svg'
                    height={50}
                    width={50}
                    quality={100}
                    />
                </button>
                <Image
                className={styles.NavbarImageBannerDesktop}
                alt='logo'
                src='/scratchify/appbanner.png'
                height={100}
                width={300}
                quality={100}
                />
                <div className={styles.NavbarDesktopContent}
                style={toggleDesktop ? {left: '0'} : {left: '-30vw'}}
                >
                    <Link href='/' className={styles.DesktopLink + ' ' + (pathname === '/' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-house-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Home
                    </Link>
                    <Link href='/search' className={styles.DesktopLink + ' ' + (pathname === '/search' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-recipe-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Recipes
                    </Link>
                    {session
                    ?
                    <>
                    <Link href='/myrecipes' className={styles.DesktopLink + ' ' + styles.DesktopLinkSpaced + ' ' + (pathname === '/myrecipes' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-myrecipes-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        My Recipes
                    </Link>
                    <Link href='/savedrecipes' className={styles.DesktopLink + ' ' + (pathname === '/savedrecipes' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/actions/icon-save-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Saved Recipes
                    </Link>
                    <Link href='/mealplanner' className={styles.DesktopLink + ' ' + (pathname === '/mealplanner' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-myrecipes-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Meal Planner
                    </Link>
                    <Link href='/grocerylist' className={styles.DesktopLink + ' ' + (pathname === '/grocerylist' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-list-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Grocery List
                    </Link>
                    <Link href='/settings' className={styles.DesktopLink + ' ' + styles.DesktopLinkSpaced + ' ' + (pathname === '/settings' ?  styles.ActiveLink : ' ')}>                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/navbar/icon-settings-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Settings
                    </Link>
                    <button className={styles.DesktopLink}
                    onClick={() => {
                        SignoutAuth();
                        router.replace('/signin');
                    }}
                    >                
                        <Image
                        className={styles.NavbarImageIcon}
                        alt='logo'
                        src='/icons/actions/icon-logout-outline.svg'
                        height={50}
                        width={50}
                        quality={100}
                        />
                        Sign out
                    </button>
                    </>
                    :
                    <Link href='/signin' className={styles.DesktopLink + ' ' + styles.DesktopLinkSign}>                
                        Sign in
                    </Link>
                    }
                </div>
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
                            className={styles.NavbarMobileImageBanner}
                            alt='logo'
                            src='/scratchify/appbanner.png'
                            height={100}
                            width={300}
                            quality={100}
                            />
                            {session
                            ? <h1>Hello, {session.user.user_metadata.username}</h1>
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
                        <Link href='/search' className={pathname === '/search' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
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
                        <Link href='/myrecipes' className={pathname === '/myrecipes' ? styles.MobileLink + ' ' + styles.MobileLinkSpaced + ' ' + styles.ActiveLink : styles.MobileLink + ' ' + styles.MobileLinkSpaced}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-myrecipes-outline.svg'
                            height={50}
                            width={50}
                            />
                            My Recipes
                        </Link>
                        <Link href='/savedrecipes' className={pathname === '/savedrecipes' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/actions/icon-save-outline.svg'
                            height={50}
                            width={50}
                            />
                            Saved Recipes
                        </Link>
                        <Link href='/mealplanner' className={pathname === '/mealplanner' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-planner-outline.svg'
                            height={50}
                            width={50}
                            />
                            Meal Planner
                        </Link>
                        <Link href='/grocerylist' className={pathname === '/grocerylist' ? styles.MobileLink + ' ' + styles.ActiveLink : styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/navbar/icon-list-outline.svg'
                            height={50}
                            width={50}
                            />
                            Grocery List
                        </Link>
                        <Link href='/settings' className={pathname === '/settings' ? styles.MobileLink + ' ' + styles.MobileLinkSpaced + ' ' + styles.ActiveLink : styles.MobileLink + ' ' + styles.MobileLinkSpaced}>                
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