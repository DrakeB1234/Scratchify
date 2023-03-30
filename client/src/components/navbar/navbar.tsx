'use client'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, {useState} from 'react';

// import styles / components
import styles from './navbar.module.css';

export default function Navbar() {

    const [toggleMobile, setToggleMobile] = useState(false);
    const pathname = usePathname();
    
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
                            <h1>Hello, DrakeB123!</h1>
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
                        <Link href='/signin' className={styles.MobileLink}>                
                            <Image 
                            className={styles.NavbarImageLinkIcon}
                            alt=''
                            src='/icons/actions/icon-logout-outline.svg'
                            height={50}
                            width={50}
                            />
                            Sign out
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}