import Image from 'next/image';
import {useState, useEffect} from 'react';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// styles / components
import LoadingSvg from '/public/graphics/graphic-loading-dots.svg';
import styles from './getrecipes.module.css';

export default function GetRecipes(props: any) {

    const [loadingData, setLoadingData] = useState(true);
    const [recipeData, setRecipeData] = useState<any>([]);
    
    const supabase = useSupabaseClient();

    useEffect(() => {
        loadRecipes();
    }, [])

    const loadRecipes = async () => {
        // set loading container to true
        setLoadingData(true);
        const { data: recipeItems, error } = await supabase
            .from('recipe')
            .select('recipeId, course, title, photoUrl')
            .eq('userId', props.userid);

        setRecipeData(recipeItems);
        setLoadingData(false);

        // error handle
        if (error) {
            return console.error(error);
        };
    }
    
    return (  
            <div className={styles.RecipesContainer}>
                {loadingData
                ? <LoadingSvg />
                : 
                <>
                {recipeData.map((e: any, index: number) => (
                    <div key={index + 'a'} className={styles.RecipeItem}>
                        <div>
                            <div>
                                {e.photoUrl !== null
                                ?
                                    <Image 
                                    alt='image'
                                    src={e.photoUrl}
                                    height={300}
                                    width={300}
                                />
                                :
                                    <Image 
                                    alt='image'
                                    src='/graphics/defaultrecipeimage1.png'
                                    height={300}
                                    width={300}
                                    quality={100}
                                    />
                                }
                            </div>
                            <div>
                                <h1>{e.title}</h1>
                                <h2>{e.course}</h2>
                                <Image 
                                alt='+'
                                src='/icons/edit/icon-edit-outline.svg'
                                height={50}
                                width={50}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                </>
                }
            </div>
    )
  }