'use client'

import React, {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

// import styles / components
import Popup from '@/components/popup/popup';
import styles from './inputedit.module.css';

import { EditRecipe } from '@/supabasehelpers/database';

export default function SubmitInputEdit(props: any) {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [popUpState, setPopUpState] = useState(false);
    const [errorState, setErrorState] = useState<string>('');

    console.log(props.editData)

    const handleSave = async () => {
        const result = await EditRecipe(props.editData, props.userId, props.recipeId, props.data.photoFile, props.data.title);
        // close pop up and reset error state
        setErrorState('');
        setPopUpState(false);
        // if there is an error returned from function, set error
        // state
        if (result?.response == 'error') return setErrorState(`${result.type}: ${result.message}`);
        // if recipe edited successfully, replace url to homepage
        if (result?.response == 'success') return router.replace('/');
    }

    return (
        <>
        {popUpState
            ? <Popup 
                title='Edit This Recipe?'
                message={['Are you sure you want to edit this recipe?', 
                'Any changes submitted now will reflect soon on your recipe, these can be changed again later on.']}
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
                >Edit Recipe</button>
                : <button type='button' className={styles.ErrorButton}>Error</button>
                }
                <h1 className={styles.FormInputError}>{errorState}</h1>

            </form>
        </div>
        </>
    )
}