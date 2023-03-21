import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState} from 'react';

// auth
import { useSession } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import styles from './navbar.module.css';

export default function Navbar(props: any) {

    const [toggleMobileNav, setToggleMobileNav] = useState(false);
    
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();

    // function to sign user out
    const SignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };
    
    return (  
        <>
            <div className={styles.DesktopNavbarParent}>
                <Link href='/'>
                    <Image 
                    alt='Home'
                    src='/graphics/appbanner-scratchify.svg'
                    height={200}
                    width={300}
                    />
                </Link>
                <Link href=''>Grocery List</Link>
                <Link href=''>Meal Planner</Link>
                <Link href='/recipes'>Recipes</Link>
                <Link href=''>Settings</Link>
                {session ? <button onClick={SignOut}>Logout</button> : <button onClick={() => router.push('/login')}>Login</button>}
                  
            </div>
            <div className={styles.MobileNavbarParent}>
                <Link href='/'>
                    <Image 
                    alt='Home'
                    src='/graphics/appbanner-scratchify.svg'
                    height={200}
                    width={300}
                    />
                </Link>
                <Image 
                alt='='
                src='/icons/navigation/icon-bars.svg'
                height={50}
                width={50}
                onClick={() => setToggleMobileNav(true)}
                />
                <div className={styles.MobileNavbarContentParent}
                style={toggleMobileNav ? {left: '0'} : {left: '-100vw'}}
                >
                    {session 
                    ?
                    // navbar for logged in users
                    <div className={styles.MobileNavbarContentChild}>
                        <div onClick={() => setToggleMobileNav(false)}>
                            <h1>Hello, {session.user.user_metadata.username}!</h1>
                            <Image 
                            alt='X'
                            src='/icons/navigation/icon-x.svg'
                            height={50}
                            width={50}
                            />
                        </div>
                        <div className={styles.MobileNavbarContent}>
                            <Link href='/' className={router.pathname == '/' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-house-outline.svg'
                                height={50}
                                width={50}
                                />
                                Home
                            </Link>
                            <Link href='/recipes' className={router.pathname == '/recipes' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-recipe-outline.svg'
                                height={50}
                                width={50}
                                />
                                Recipes
                            </Link>
                            <Link href='/myrecipes' className={router.pathname == '/myrecipes' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-recipe-outline.svg'
                                height={50}
                                width={50}
                                />
                                Recipe Manager
                            </Link>
                            <Link href='/' className={router.pathname == '/planner' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-planner-outline.svg'
                                height={50}
                                width={50}
                                />
                                Meal Planner
                            </Link>
                            <Link href='/' className={router.pathname == '/list' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-list-outline.svg'
                                height={50}
                                width={50}
                                />
                                Grocery List
                            </Link>
                            <Link href='/' className={styles.SpaceLink}>                
                                <Image
                                alt=''
                                src='/icons/navigation/icon-settings-outline.svg'
                                height={50}
                                width={50}
                                />
                                Account Settings
                            </Link>
                            <button onClick={SignOut}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-logout-outline.svg'
                                height={50}
                                width={50}
                                />
                                Logout
                            </button>
                        </div>
                    </div>
                    // navbar for unlogged in users
                    :
                    <div className={styles.MobileNavbarContentChild}>
                        <div onClick={() => setToggleMobileNav(false)}>
                            <h1>Hello, Guest!</h1>
                            <Image 
                            alt='X'
                            src='/icons/navigation/icon-x.svg'
                            height={50}
                            width={50}
                            />
                        </div>
                        <div className={styles.MobileNavbarContent}>
                            <Link href='/' className={router.pathname == '/' ? styles.ActiveLink : ''}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-house-outline.svg'
                                height={50}
                                width={50}
                                />
                                Home
                            </Link>
                            <button className={styles.SpaceLink} onClick={() => router.push('/login')}>                
                                <Image 
                                alt=''
                                src='/icons/navigation/icon-logout-outline.svg'
                                height={50}
                                width={50}
                                />
                                Login
                            </button>
                        </div>
                    </div>
                    }
                    </div>
                </div>
        </>
    )
  }