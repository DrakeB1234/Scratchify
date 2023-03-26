import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

// styles / components
import LoadingSvg from '/public/graphics/icon-loading.svg';
import Popup from '../../../components/popup/popup';
import styles from './input.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSession } from '@supabase/auth-helpers-react';

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

        // running validation on each input to ensure correctness
        if(!/^[^\s][a-zA-Z\s]{3,30}$/.test(props.data.title)) return setErrorInput(prev => ({...prev, message: 'Title must be (3 - 30) characters, only letters and spaces'}));
        if(!/^Breakfast|Lunch|Dinner|Dessert|Snack$/.test(props.data.course)) return setErrorInput(prev => ({...prev, message: 'Course must be Breakfast, Lunch, Dinner, Dessert, or Snack'}));
        if(!/^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{3,300}$/.test(props.data.description)) return setErrorInput(prev => ({...prev, message: 'Description must be (3 - 300) characters, no emojis or starting with a space'}));

        props.data.tags.map((e: any) => {
            if(!/^[^\s][a-zA-Z\s]{3,20}$/.test(e.name)) return setErrorInput(prev => ({...prev, message: 'Tags must be (3 - 20) characters, only letters and spaces'}));
        });
        props.data.ingredients.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{1,30}$/.test(e.amount)) return setErrorInput(prev => ({...prev, message: 'Ingredient amount must be (1 - 30) characters, no emojis or starting with a space'}));
            if(!/^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{1,40}$/.test(e.name)) return setErrorInput(prev => ({...prev, message: 'Ingredient name must be (1 - 40) characters, no emojis or starting with a space'}));
        });
        props.data.instructions.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{3,300}$/.test(e.name)) return setErrorInput(prev => ({...prev, message: 'Instructions must be (3 - 300) characters, no emojis or starting with a space'}));
        });

        // if validated data, call pop to ensure action from user
        setTogglePopupCreate(true);
    }

    const loadData = async () => {
        let data: any;

        try {
            setLoadingInput(true);

            let { data: Recipe, error } = await supabase
            .from('Recipe')
            .select('*')
            .eq('userId', session?.user.id)

            // error handler
            if (error) throw error;

            // assign data
            data = Recipe;
            console.log(data);

        } catch (error){
            setLoadingInput(false);
            return setErrorInput({message: 'Could not Fetch Data, try again'});
        };

        // set success state to display success message, reset loading state
        setLoadingInput(false);
        setSuccessInput(true);

      };
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            {togglePopupCreate
            ?
                <Popup 
                title='Confirm Recipe Creation'
                message='Are you sure you want to create this Recipe?'
                active='true'
                toggle={setTogglePopupCreate}
                callback={loadData}
                />
            : <></>
            }
            <div className={styles.InputReviewParent}>
                <h1>{props.data.title}</h1>
                <h2>{props.data.course}</h2>

                <div className={styles.InputReviewContainerRow}>
                    {props.data.tags.map((e: any) => (
                        <h2>{e.name}</h2>
                    ))}
                </div>

                <h3>{props.data.description}</h3>

                <div className={styles.InputReviewContainerCol}>
                    <h1>Ingredients:</h1>
                    {props.data.ingredients.map((e: any, index: number) => (
                        <h2 key={index}>{e.amount} of {e.name}</h2>
                    ))}
                </div>
                <div className={styles.InputReviewContainerCol}>
                    <h1>Instructions:</h1>
                    {props.data.instructions.map((e: any, index: number) => (
                        <h2 key={index}>Step {index + 1}: {e.name}</h2>
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