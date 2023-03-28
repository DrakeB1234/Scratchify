import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';

// import styles / components
import NavBar from '../components/navbar/navbar';
import styles from './recipes.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Recipes() {
    
    const [loadingData, setLoadingData] = useState(false);
    const [recipeData, setRecipeData] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const supabase = useSupabaseClient();
    const router = useRouter();
    const { push } = useRouter();

      // load in data
  useEffect(() => {
    // get query params from URL
    const { q: searchParam } = router.query;

    if (searchParam != undefined && searchParam != ''){
        loadRecipes(searchParam);
    }
  }, [push]);

  const loadRecipes = async (searchParam: any) => {
    // set loading container to true
    setLoadingData(true);

    let query = supabase
        .from('recipe')
        .select('recipeId, course, title, photoUrl');
  
    // searches with provided search query
    if (searchParam) { query = query.like('title', `%${searchParam}%`) }
    
    const { data, error } = await query;
    // set loading container to false
    setLoadingData(false);
    // set data to state
    setRecipeData(data);

    // error handle
    if (error) {
      setLoadingData(false);
      return console.error(error);
    };
  };

    // handle search bar when enter key is pressed
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
        router.replace({
            pathname: '/recipes',
            query: {q: searchQuery}
        });
        }
    };

  return (
    <>
    <Head>
      <title>Recipes</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NavBar />
    <main className={styles.RecipesParent}>
        <div className={styles.RecipeSearchBarParent}>
            <div>
                <input type='text' placeholder='Search for Recipes'
                onChange={(e: any) => setSearchQuery(e.target.value)}
                onKeyDown={(event: any) => handleKeyDown(event)}
                />
                <Image 
                alt=''
                src='/icons/actions/icon-search.svg'
                height={50}
                width={50}
                onClick={() => 
                    router.replace({
                    pathname: '/recipes',
                    query: {q: searchQuery}
                })}
                onKeyDown={(event: any) => handleKeyDown(event)}
                tabIndex={0}
                />
            </div>
            <div className={styles.SortFilterContainer}>
                <div>
                    <h1>Filters</h1>
                    <Image 
                    alt=''
                    src='/icons/navigation/icon-filter-outline.svg'
                    height={50}
                    width={50}
                    />
                </div>
                <div>
                    <h1>Sort</h1>
                    <Image 
                    alt=''
                    src='/icons/navigation/icon-sort-outline.svg'
                    height={50}
                    width={50}
                    />
                </div>
            </div>
        </div>
        {recipeData != null && recipeData.map((e: any, index: number) => (
          <div key={index + 'as'}>
            <h1>{e.title}</h1>
            <h1>{e.course}</h1>
            {e.photoUrl != null
            ?
              <img src={e.photoUrl} />
            :
              <h1>Image not found</h1>
            }
          </div>
        ))}
    </main>
    </>
  )
}