import Head from 'next/head'
import Link from 'next/link';

import GraphicEmailVerify from '/public/graphics/graphic-email-verify.svg';
import styles from './verifyaccount.module.css';

export default function VerifyAccount() {
    return (  
        <div className={styles.VerifyAccountParent}>
            <GraphicEmailVerify />
            <h1>Account created, Now just verify through email!</h1>
            <Link href='/login'>Login</Link>
        </div>
    )
  }