'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import FilterPopup from './searchPopup/filterPopup';
import SortPopup from './searchPopup/sortPopup';
import styles from '../../styles/Search.module.css';

// auth
import { SearchRecipes } from '@/supabasehelpers/database';

export default function Recipes() {

  const router = useRouter();
  const params = useSearchParams();

  const [recipeData, setRecipeData] = useState<any>([]);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortPopup, setSortPopup] = useState(false);

  // URL params
  const searchParam = params.get('q');
  const filterCourseParam = params.get('filterCourse');
  const filterTagParam = params.get('filterTag');

  // ref for input
  let searchInput = useRef('');

  // function for adding input into url
  const recipeSearch = async (event: any) => {
    // if key was enter or search icon was pressed, perform search
    if (event.key === 'Enter' || event.type === 'click') {
      // reset input based on function invoker
      if (event.type === 'click') event.target.previousElementSibling.value = '';
      else event.target.value = '';

      // url constructor
      let url: string = '/search';

      // if search input is provided, add to url
      if (searchInput.current !== '') url += `?q=${searchInput.current}`

      // redirect user with url for recipe search if base url is not used
      if (url !== '/search') return router.replace(url);
    }
  }
  
  // only calls function if searchParam changes
  useEffect(() => {
    // function for getting recipe based on search params
    const getRecipes = async () => {
      let data = await SearchRecipes(params);
      if (data.type !== 'success') return;
      else return setRecipeData(data.data);
    }

    // call for recipe on page render if search params are provided
    if (params.get('q') !== null || params.get('filterCourse') !== null || params.get('filterTag') !== null) {
      getRecipes();
    }
  }, [params])

  return (
    <div className={styles.SearchParent}>

        {filterPopup
          ? 
          <FilterPopup 
          popupToggle={setFilterPopup}
          />
          :
          <></>
        }
      
        <Navbar />
        <div className={styles.SearchRecipeParent}>
            <div className={styles.SearchRecipeBar}>
                <input type='text' placeholder='Search Recipes' 
                onChange={(e: any) => {
                  searchInput.current = e.target.value;
                }}
                onKeyDown={(event: any) => recipeSearch(event)}
                />
                <Image 
                alt='o'
                src='/icons/actions/icon-search-outline.svg'
                height={50}
                width={50}
                onClick={recipeSearch}
                tabIndex={0}
                />
            </div>
            <div className={styles.SearchRecipeButtons}>
              <div
              onClick={() => setFilterPopup(true)}
              >
                <h1>Filter</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-filter-outline.svg'
                  height={50}
                  width={50}
                />
              </div>
            </div>
            <div className={styles.RecipeItemContainer}>
            {recipeData && recipeData.map((e: any, index: number) => (
              <Link href={`/recipe/${e.title}`}
              key={index + 'a'}className={styles.RecipeItem}
              >
                <Image 
                className={styles.RecipeImage}
                alt='image'
                src={e.photoUrl !== null && e.photoUrl !== undefined
                ? `${e.photoUrl}`
                : '/graphics/graphic-recipe.png'
                }
                height={300}
                width={300}
                quality={100}
                />
                <h1>{e.title}</h1>
                <div className={styles.RecipeItemInfo}>
                  <h1>@{e.profiles.username}</h1>
                  <div>
                    <h1>{e.recipe_saved.length}</h1>
                    <Image 
                    alt='image'
                    src='/icons/actions/icon-save-outline.svg'
                    height={50}
                    width={50}
                    quality={100}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  )
}