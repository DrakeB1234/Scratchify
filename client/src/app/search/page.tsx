'use client';

import Image from 'next/image';
import {useSearchParams} from 'next/navigation'
import {useRef} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../../styles/Search.module.css';

// auth
import { createClient } from 'utils/supabase-browser';
import { SearchRecipes } from '@/supabasehelpers/database';

export default function Recipes() {

    const supabase = createClient();
    const params = useSearchParams();

    // URL params
    const searchParam = params.get('q');
    console.log(searchParam)

    // ref for input
    let searchInput = useRef('');

    // function for performing database search
    const attemptDataSearch = async () => {
      alert('searcg')
    };

  return (
    <div className={styles.SearchParent}>
        <Navbar />
        <div className={styles.SearchRecipeParent}>
            <div className={styles.SearchRecipeBar}>
                <input type='text' placeholder='Search Recipes' 
                onChange={(e: any) => {
                  searchInput.current = e.target.value;
                }}
                />
                <Image 
                alt='o'
                src='/icons/actions/icon-search-outline.svg'
                height={50}
                width={50}
                onClick={attemptDataSearch}
                />
            </div>
        </div>
    </div>
  )
}