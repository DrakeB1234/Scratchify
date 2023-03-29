import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import {useEffect, useState} from 'react';

// import styles / components
import NavBar from '../components/navbar/navbar';
import LoadingSvg from '/public/graphics/graphic-loading-dots.svg';
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
  // get query params from URL
  const { q: searchParam } = router.query;

  // load in data
  useEffect(() => {
    // only load recipes if a search param is provided, if that param is not left empty
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
        {loadingData
          ? <LoadingSvg />
          : recipeData.length > 0
            ?
            <div className={styles.RecipesContainer}>
              {recipeData.map((e: any, index: number) => (
                <div key={index + 'a'} className={styles.RecipeItem}>
                  {e.photoUrl !== null
                    ?
                        <Image 
                        alt='image'
                        src={e.photoUrl}
                        height={400}
                        width={400}
                        quality={100}
                    />
                    :
                        <Image 
                        alt='image'
                        src='/graphics/defaultrecipeimage1.png'
                        height={400}
                        width={400}
                        quality={100}
                        />
                    }
                    <div>
                        <h1>{e.title}</h1>
                        <h2>@DrakeB123</h2>
                        <h3>7 Likes</h3>
                    </div>
                </div>
              ))}
            </div>
            :
            <h1>Nothing Found</h1>
        }
    </main>
    </>
  )
}