import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router';
import { useState,useEffect } from 'react';

// import styles / components
import Navbar from './components/navbar/navbar';
import styles from './homepage.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';


export default function Home() {

  const [loadingData, setLoadingData] = useState(false);
  const [recipeData, setRecipeData] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = useSupabaseClient();

  // load in data
  useEffect(() => {
    // loadRecipes();
  }, []);

  const loadRecipes = async () => {
    // set loading container to true
    setLoadingData(true);
    const { data: recipeData, error } = await supabase
      .from('recipe')
      .select('recipeId, course, title, photoUrl');

    setRecipeData(recipeData);

    // error handle
    if (error) {
      setLoadingData(false);
      return console.error(error);
    };
  };

  // handle search bar when enter key is pressed
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      Router.push({
        pathname: '/recipes',
        query: {q: searchQuery}
      });
    }
  };

  return (
    <>
      <Head>
        <title>Homepage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className={styles.HomepageParent}>
        <div className={styles.RecipeSearchBar}>
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
            Router.push({
            pathname: '/recipes',
            query: {q: searchQuery}
          })}
          />
        </div>
        <h1>Trending Recipes</h1>
        {recipeData.map((e: any, index: number) => (
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
