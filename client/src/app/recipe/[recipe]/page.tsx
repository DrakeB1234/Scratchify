import 'server-only';

import Image from 'next/image';
import Link from 'next/link';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../../../styles/Recipe.module.css';

// auth
import { createClient } from 'utils/supabase-server';
// do not cache this page
export const revalidate = 0;

export default async function Home(params: any) {

  // get recipe name from route
  const searchParam = params.params.recipe.replaceAll('%20', ' ');
  
  const supabase = createClient();
  
  const { data: recipeData } = await supabase
    .from('recipe')
    .select('title,course,description,photoUrl,public,source')
    .eq('title', searchParam);

  // if results, return recipe information
  if (recipeData && recipeData?.length > 0) {
    return (
      <div className={styles.RecipeParent}>
          <Navbar />
          <div className={styles.RecipeContentParent}>
            <div className={styles.RecipeTitleCard}>
              <h1>{recipeData?.[0].title}</h1>
              <h2>{recipeData?.[0].course}</h2>
              <h3>Created By:</h3>
              <h3>@DrakeB123</h3>

              <div
              className={styles.DivButton}
              >
                <Image 
                alt='Recipe image'
                src='/icons/actions/icon-savewhite-outline.svg'
                height={50}
                width={50}
                />
                <h1>Save Recipe</h1>
              </div>
              
              {recipeData?.[0].source
              ? <h4>Source: <span>{recipeData?.[0].source}</span></h4>
              : <></>
              }

            </div>
            <div className={styles.RecipeImageParent}>
              <Image 
              className={styles.RecipeImageForeground}
              alt='Recipe image'
              src={recipeData?.[0].photoUrl !== null && recipeData?.[0].photoUrl !== undefined
              ? `${recipeData?.[0].photoUrl}`
              : '/graphics/graphic-recipe.png'
              }
              height={400}
              width={400}
              />
              <Image 
              className={styles.RecipeImageBackground}
              alt='Recipe image'
              src={recipeData?.[0].photoUrl !== null && recipeData?.[0].photoUrl !== undefined
              ? `${recipeData?.[0].photoUrl}`
              : '/graphics/graphic-recipe.png'
              }
              height={400}
              width={400}
              />
            </div>
            <div className={styles.RecipeDescription}>
              <h1>{recipeData?.[0].description}</h1>
            </div>
          </div>
      </div>
    )
  }
  // if no search results, return message of missing recipe
  else {
    return (
      <div className={styles.RecipeParent}>
          <Navbar />
          <div className={styles.RecipeNotFoundParent}>
            <h1>The recipe</h1>
            <h1>'{searchParam}'</h1>
            <h1>does not exist</h1>
          </div>
          <div className={styles.RecipeNotFoundLink}>
            <h1>But you can still find many other great recipes on the search page!</h1>
            <Link href='/search'>Search</Link>
          </div>
      </div>
    )
  }
}