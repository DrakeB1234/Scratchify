import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '@/styles/Grocerylist.module.css';

// auth
import { createClient } from 'utils/supabase-server';

export default async function Grocerylist() {

    return (
      <div className={styles.ListParent}>
          <Navbar />
          <div className={styles.ListContentParent}>
            <div>
              <input type='text' />
            </div>
          </div>
      </div>
    )
  }