'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import ListComponent from './ListComponent/ListComponent';
import styles from '@/styles/Grocerylist.module.css';

// auth
import { GetSessionAuth } from '@/supabasehelpers/auth';

export default function Grocerylist() {

  const router = useRouter();
  const [session, setSession] = useState<any>();
      
  // checks to see is user has a session
  useEffect(() => {
    const getSession = async () => {
      const result = await GetSessionAuth();
      setSession(result);
      
      // if session is null, redirect user to signin
      if (result?.data.session == null) return router.replace('/signin');

    };

    getSession();
  }, []);

  return (
    <div className={styles.ListParent}>
      <Navbar />
      <ListComponent 
      userId={session?.data.session?.user.id ?? null}
      />
    </div>
  )
}