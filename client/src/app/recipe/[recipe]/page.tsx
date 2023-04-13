import 'server-only';

import Image from 'next/image';
import Link from 'next/link';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '../../../styles/Recipe.module.css';

// auth
import { createClient } from 'utils/supabase-server';
// cache this page
export const revalidate = 90;

export default async function Home(params: any) {

  // get recipe name from route
  const searchParam = params.params.recipe.replaceAll('%20', ' ');
  
  const supabase = createClient();

  // grab recipe data from database
  const { data: recipeData } = await supabase
    .from('recipe')
    .select('recipeId, title,course,description,photoUrl,public,source')
    .eq('title', searchParam);
  // set recipeId for whole page
  const recipeId = recipeData?.[0]?.recipeId

  // grab tag data
  const { data: tagsData } = await supabase
    .from('recipe_tags')
    .select('tag')
    .eq('recipeId', recipeId);

  // grab ingredients data
  const { data: ingredientsData } = await supabase
    .from('recipe_ingredients')
    .select('amount, ingredient')
    .eq('recipeId', recipeId);

  // grab spices data
  const { data: spicesData } = await supabase
    .from('recipe_spices')
    .select('spice')
    .eq('recipeId', recipeId);

  // grab instructions data
  const { data: instructionsData } = await supabase
  .from('recipe_instructions')
  .select('instruction')
  .eq('recipeId', recipeId);

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

            <div className={styles.RecipeTagsParent}>
              {tagsData?.map((e: any, index: number) => (
                <h1 key={index + 'a'}>{e.tag}</h1>
              ))}
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

            <div className={styles.RecipeIngredientsParent}>
              <h1>Ingredients</h1>
              {ingredientsData?.map((e: any, index: number) => (
                <h2 key={index + 'a'}>{e.amount}, {e.ingredient}</h2>
              ))}
              
              {spicesData
              ?
                <>
                  <h3>Spices</h3>
                  {spicesData?.map((e: any, index: number) => (
                    <h2 key={index + 'a'}>{e.spice}</h2>
                  ))}
                </>
              : <></>
              }

            </div>

            <div className={styles.RecipeInstructionsParent}>
              <h1>Instructions</h1>
              {instructionsData?.map((e: any, index: number) => (
                <h2 key={index + 'a'}><span>Step {index + 1}:</span>{e.instruction}</h2>
              ))}
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