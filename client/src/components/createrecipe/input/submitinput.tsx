'use client'

import React, {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

// import styles / components
import Popup from '@/components/popup/popup';
import styles from './input.module.css';

import { CreateRecipe } from '@/supabasehelpers/database';

export default function SubmitInput(props: any) {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [popUpState, setPopUpState] = useState(false);
    const [errorState, setErrorState] = useState<string>('');

    const handleSave = async () => {
        const result = await CreateRecipe(props.data);
        // close pop up and reset error state
        setErrorState('');
        setPopUpState(false);
        // if there is an error returned from function, set error
        // state
        if (result?.response == 'error') return setErrorState(`${result.type}: ${result.message}`);
        // if recipe created successfully, replace url to myrecipes
        if (result?.response == 'success') return router.replace('/');
    }

    return (
        <>
        {popUpState
            ? <Popup 
                title='Create Recipe?'
                message={['Are you sure you want to create this recipe?', 
                'Recipe can be edited later on if need be.']}
                confirm={true}
                popupToggle={setPopUpState}
                callback={handleSave}
                />
            : <></>
        }
        <div className={styles.InputParent}>
            <form className={styles.FormParent}
            >

                {errorState == ''
                ? <button type='button' className={styles.CreateButton}
                onClick={() => setPopUpState(true)}
                >Create Recipe</button>
                : <button type='button' className={styles.ErrorButton}>Error</button>
                }
                <h1 className={styles.FormInputError}>{errorState}</h1>

            </form>
        </div>
        </>
    )
}