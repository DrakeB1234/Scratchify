import Image from 'next/image'
import Link from 'next/link';
import {use, useState} from 'react';

import styles from './recipeSearch.module.css';

export default function RecipeSearch(props: any) {

    const search = [
        'Pizza',
        'Yespizza',
        'Lasagna',
        'Flaffel',
        'Pizza',
    ]

    const [searchValue, setSearchValue] = useState('');
    const [searchFound, setSearchFound] = useState(false);
    const [searchAmount, setSearchAmount] = useState(0);

    const searchRecipes = () => {

        setSearchAmount(0);
        setSearchFound(false);
        // if a value is searched
        if (searchValue){
            search.map(e => {
                if (e === searchValue){
                    setSearchFound(true);
                    setSearchAmount(prev => prev + 1);
                }
            });
        }
    }
    
    return (
        <form className={styles.SearchForm}>
            <div className={styles.SearchBar}>
                <input type='text' placeholder='Search Recipes' 
                onClick={(e: any) => {e.target.value = ''; setSearchFound(false); setSearchValue('');}}
                onChange={(e: any) => setSearchValue(e.target.value)} 
                />
                <Image
                alt='0='
                src='/icons/icon-search.svg'
                height={50}
                width={50}
                onClick={searchRecipes}
                />
            </div>
            <div className={styles.SearchResult} style={searchFound ? {display:'flex'} : {display:'none'}}>
                {searchFound ?
                    <>
                        <Link href=''>Found {searchAmount} '{searchValue}' Recipes</Link>
                        <Image
                        alt='=>'
                        src='/icons/navigation/icon-logout-outline.svg'
                        height={50}
                        width={50}
                        />
                    </> :
                    <>
                        <Link href=''>No results</Link>
                    </>
                }

            </div>
        </form>
    )
  }