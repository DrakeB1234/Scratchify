'server only'

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// import styles / components
import Navbar from '@/components/navbar/navbar';
import styles from '@/styles/SavedRecipes.module.css';

// auth
import { createClient } from '@/../utils/supabase-server';

export default async function SavedRecipes() {

    const supabase = createClient();
    let session: any;

    // checks to see is user has a session
    session = await supabase.auth.getSession();
    session = session.data.session
    
    // if session is null, redirect user to signin
    if (session == null) return redirect('/signin');

    // if user has session, then grab all recipe_ids that are saved
    const { data: savedData, error: savedError } = await supabase
    .from('recipe_saved')
    .select('recipe_id')
    .eq('user_id', session.user.id)
    ;

    // retreive saved recipes based on saved recipe ids retrieved
    const { data: recipeData, error: recipeError } = await supabase
    .from('recipe')
    .select('recipe_id, title, photoUrl, profiles(username), recipe_saved(id)')
    .in('recipe_id', savedData!.map((col) => col.recipe_id))
    ;
    
    return (
        <div className={styles.SavedRecipesParent}>
            <Navbar />
            <h1>Saved Recipes</h1>
            {recipeData!.length > 0
            ?
                <div className={styles.SavedRecipesContentParent}>
                {recipeData!.map((e: any, index: number) => (
                    <Link key={index + 'a'} className={styles.SavedRecipesContentItem}
                    href={'http://localhost:3000/recipe/' + e.title}
                    >
                    <div className={styles.SavedRecipesRow}>
                        <Image 
                        className={styles.SavedRecipesContentRecipeImage}
                        alt='+'
                        src={e.photoUrl !== null
                        ? `${e.photoUrl}`
                        : '/graphics/graphic-recipe.png'
                        }
                        height={120}
                        width={120}
                        />
                        <div className={styles.SavedRecipesText}>
                            <h1>{e.title}</h1>
                            <h2>@{e.profiles.username}</h2>
                            <div className={styles.SaveRecipesSaveContainer}>
                                <h3>{e.recipe_saved.length}</h3>
                                <Image 
                                alt=' '
                                src='/icons/actions/icon-save-outline.svg'
                                height={30}
                                width={30}
                                />
                            </div>
                        </div>
                    </div>

                    </Link>
                ))}
                </div>
            :
                <div className={styles.SavedRecipesEmpty}>
                    <Image 
                        alt=''
                        src='/graphics/graphic-recipe.png'
                        height={200}
                        width={200}
                        quality={100}
                    />
                    <h1>No Saved Recipes!</h1>
                </div>
            }
        </div>
    )
}