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

  // grab recipe id from database if recipe is public
  const { data: recipeId } = await supabase
    .from('recipe')
    .select(`recipe_id`)
    .eq('title', searchParam)
    .eq('public', true);
    
  // grab recipe data if recipe id was able to be retrieved
  const { data: recipeData } = await supabase
    .from('recipe')
    .select(`title, course, description, photoUrl, source,
    profiles(username),
    recipe_tags(tag),
    recipe_ingredients(amount, ingredient),
    recipe_spices(spice),
    recipe_instructions(instruction)`)
    .eq('recipe_id', recipeId?.[0]?.recipe_id ?? null)
    .eq('recipe_tags.recipe_id', recipeId?.[0]?.recipe_id ?? null)
    .eq('recipe_ingredients.recipe_id', recipeId?.[0]?.recipe_id ?? null)
    .eq('recipe_spices.recipe_id', recipeId?.[0]?.recipe_id ?? null)
    .eq('recipe_instructions.recipe_id', recipeId?.[0]?.recipe_id ?? null)
    ;

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
              <h3>@{Array.isArray(recipeData?.[0].profiles) ? recipeData?.[0].profiles?.map((e: any) => (e.username)) : recipeData?.[0].profiles?.username}</h3>

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
              {Array.isArray(recipeData?.[0].recipe_tags) && recipeData?.[0].recipe_tags?.map((e: any, index: number) => (
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
              {Array.isArray(recipeData?.[0].recipe_ingredients) && recipeData?.[0].recipe_ingredients?.map((e: any, index: number) => (
                <h2 key={index + 'a'}>{e.amount}, {e.ingredient}</h2>
              ))}
              
              {Array.isArray(recipeData?.[0].recipe_spices) && recipeData?.[0].recipe_spices[0]
              ?
                <>
                  <h3>Spices</h3>
                  {Array.isArray(recipeData?.[0].recipe_spices) && recipeData?.[0].recipe_spices?.map((e: any, index: number) => (
                    <h2 key={index + 'a'}>{e.spice}</h2>
                  ))}
                </>
              : <></>
              }

            </div>

            <div className={styles.RecipeInstructionsParent}>
              <h1>Instructions</h1>
              {Array.isArray(recipeData?.[0].recipe_instructions) && recipeData?.[0].recipe_instructions?.map((e: any, index: number) => (
                <h2 key={index + 'a'}><span>Step {index + 1}<br></br></span>{e.instruction}</h2>
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
            <h1>&apos;{searchParam}&apos;</h1>
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