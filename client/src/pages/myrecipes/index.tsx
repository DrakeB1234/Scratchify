import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

// import styles / components
import NavBar from '../components/navbar/navbar';
import RecipeCreate from '../components/recipecreate/recipecreate';
import GetRecipes from '../components/myrecipes/getmyrecipes';
import styles from './myrecipes.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSession } from '@supabase/auth-helpers-react';

export default function MyRecipes() {

    const [toggleRecipeCreate, setToggleRecipeCreate] = useState(false);
    const [toggleGetRecipes, setToggleGetRecipes] = useState(false);

    const router = useRouter();
    
    const supabase = useSupabaseClient();
    const session = useSession();

    // protect route from unauthorized users
    useEffect(() => {
        if(!session){
            router.replace('/')
        };

    }, [session]);

  return (
    <>
    <Head>
      <title>My Recipes</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NavBar />
    <main className={styles.MyRecipesParent} style={toggleRecipeCreate ? {display:'none'} : {display:'flex'}}>
        <div className={styles.CreateRecipeParent} onClick={() => setToggleRecipeCreate(!toggleRecipeCreate)}>
            <h1>Create Recipe</h1>
            <h2>0 recipes made</h2>
            <Image 
            alt='+'
            src='/icons/actions/icon-plus.svg'
            height={50}
            width={50}
            />
        </div>

        <div className={styles.CreateRecipeParent} onClick={() => setToggleGetRecipes(true)}>
            <h1>View My Recipes</h1>
        </div>
        {toggleGetRecipes
        ?
            <GetRecipes 
            userid={session?.user.id} 
            />
        :
            <></>
        }

    </main>
    {toggleRecipeCreate
            ?
                <RecipeCreate toggle={setToggleRecipeCreate} />
            :
                <></>
    }
    </>
  )
}