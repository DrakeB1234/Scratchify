import React, {useState} from 'react';
import Router from 'next/router';
import Image from 'next/image';
import {useForm} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

// styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import Popup from '../../../components/popup/popup';
import styles from './input.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSession } from '@supabase/auth-helpers-react';
import PhotoInput from './photoinput';

export default function SubmitInput(props: any) {

    const session = useSession();
    const supabase = useSupabaseClient();

    const [loadingInput, setLoadingInput] = useState(false)
    const [successInput, setSuccessInput] = useState(false)
    const [errorInput, setErrorInput] = useState({
        message: ''
    })
    const [togglePopupCreate, setTogglePopupCreate] = useState(false);

    const { handleSubmit } = useForm({});

    const handleSave = (formVal: any) => {
        // reset success state to false, reset error
        setSuccessInput(false);
        setErrorInput(prev => ({...prev, message: ''}));
        let pass = true;

        // running validation on each input to ensure correctness
        if(!/^[^\s][a-zA-Z\s]{3,50}$/.test(props.data.title)) return setErrorInput(prev => ({...prev, message: 'Title must be (3 - 30) characters, only letters and spaces'}));
        if(!/^Breakfast|Lunch|Dinner|Dessert|Snack$/.test(props.data.course)) return setErrorInput(prev => ({...prev, message: 'Course must be Breakfast, Lunch, Dinner, Dessert, or Snack'}));
        if(!/^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{3,500}$/.test(props.data.description)) return setErrorInput(prev => ({...prev, message: 'Description must be (3 - 300) characters, no emojis or starting with a space'}));

        props.data.tags.map((e: any) => {
            if(!e.name || !/^[^\s][a-zA-Z\s]{3,20}$/.test(e.name)) {
                pass = false;
                return setErrorInput(prev => ({...prev, message: 'Tags must be (3 - 20) characters, only letters and spaces'}));
            }
        });
        props.data.ingredients.map((e: any) => {
            if(!e.amount || !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{0,30}$/.test(e.amount)) {
                pass = false;
                console.log(e.amount)
                return setErrorInput(prev => ({...prev, message: 'Ingredient amount must be (1 - 30) characters, no emojis or starting with a space'}));
            } 
            if(!e.name || !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{0,40}$/.test(e.name)) {
                pass = false;
                return setErrorInput(prev => ({...prev, message: 'Ingredient name must be (1 - 40) characters, no emojis or starting with a space'}));
            }
        });
        props.data.instructions.map((e: any) => {
            if(!e.name || !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{3,500}$/.test(e.name)) {
                pass = false;
                return setErrorInput(prev => ({...prev, message: 'Instructions must be (3 - 300) characters, no emojis or starting with a space'}));
            }
        });

        // if validated data, call pop to ensure action from user
        if(pass) return setTogglePopupCreate(true);
    }

    const postData = async () => {

        try {
            setLoadingInput(true);

            // upload image to bucket if photo provided through input
            let url: string | null = null;
            if (props.data.photoFile.name != undefined){
                // make url
                url = 'public/' + props.data.title + '-' + uuidv4();

                const { data: photoFileData, error: photoError } = await supabase
                .storage
                .from('recipe-images')
                // uploaded files will be recipe-images/TheBestLasagna-randomid123123
                .upload(url, props.data.photoFile, {
                    cacheControl: '3600',
                    upsert: false
                });
                // error handle
                if (photoError) throw photoError;

                // if no errors, set url to public url for getting image
                url = encodeURI('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/' + url);
            };

            // insert data into 'recipe' table
            const { data, error: recipeError } = await supabase
            .from('recipe')
            .insert({ 
                userId: session?.user.id, 
                title: props.data.title,
                course: props.data.course,
                description: props.data.description,
                photoUrl: url
            })
            .select('recipeId');
            // after insert, select returns recipe id for referencing other tables data
            const recipeId = data?.[0].recipeId;
            // error handle
            if (recipeError) throw recipeError;

            // insert data into 'recipe_tags' table
            const tagsArray: any = [];
            props.data.tags.map((e: any) => {
                tagsArray.push({
                    recipeId: recipeId,
                    tag: e.name
                })
            });
            const { error: tagsError } = await supabase
            .from('recipe_tags')
            .insert(tagsArray);
            // error handle
            if (tagsError) throw tagsError;

            // insert data into 'recipe_ingredients' table
            const ingredientsArray: any = [];
            props.data.ingredients.map((e: any) => {
                ingredientsArray.push({
                    recipeId: recipeId,
                    amount: e.amount,
                    ingredient: e.name
                })
            });
            const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsArray);
            // error handle
            if (ingredientsError) throw ingredientsError;

            // insert data into 'recipe_instructions' table
            const instructionsArray: any = [];
            props.data.instructions.map((e: any) => {
                instructionsArray.push({
                    recipeId: recipeId,
                    instruction: e.name,
                })
            });
            const { error: instructionsError } = await supabase
            .from('recipe_instructions')
            .insert(instructionsArray);
            // error handle
            if (instructionsError) throw instructionsError;

            // if all successful, redirect user to homepage
            Router.push('/');

        } catch (error){
            setLoadingInput(false);
            console.error(error)
            return setErrorInput({message: 'Problem creating recipe, try again later'});
        };

        // set success state to display success message, reset loading state
        setLoadingInput(false);
        setSuccessInput(true);

      };

      const uploadImage = async () => {

      }

    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <h1 
            onClick={() => uploadImage()}>Review</h1>
            {togglePopupCreate
            ?
                <Popup 
                title='Confirm Recipe Creation'
                message='Are you sure you want to create this Recipe?'
                active='true'
                toggle={setTogglePopupCreate}
                callback={postData}
                />
            : <></>
            }
            <div className={styles.InputReviewParent}>
                <h1>{props.data.title}</h1>
                <h2>{props.data.course}</h2>
                {props.data.photoFile !== ''
                ? <Image 
                    alt='image'
                    src={URL.createObjectURL(props.data.photoFile)}
                    height={300}
                    width={300}
                    />
                : <></>}

                <div className={styles.InputReviewContainerRow}>
                    {props.data.tags.map((e: any, index: number) => (
                        <h2 key={index + 'a'}>{e.name}</h2>
                    ))}
                </div>

                <h3>{props.data.description}</h3>

                <div className={styles.InputReviewContainerCol}>
                    <h1>Ingredients:</h1>
                    {props.data.ingredients.map((e: any, index: number) => (
                        <h2 key={index + 'b'}>{e.amount} of {e.name}</h2>
                    ))}
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Instructions:</h1>
                    {props.data.instructions.map((e: any, index: number) => (
                        <h2 key={index + 'c'}>Step {index + 1}: {e.name}</h2>
                    ))}
                </div>
            </div>

            {errorInput.message != ''
            ?
                <>
                    <button className={styles.SaveErrorButton} type='submit'>Error</button>
                    <h2 className={styles.ErrorText}>{errorInput.message}</h2>
                </>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Creation Successful</button>
            :
                loadingInput 
                ? 
                    <button className={styles.SaveSuccessButton} type='button'><LoadingSvg /></button>
                : 
                    <button className={styles.SaveSuccessButton} type='submit'>Create Recipe</button>
            }

        </form>

    )
  }