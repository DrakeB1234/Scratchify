'use client'

import React, {useEffect, useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import Popup from '@/components/popup/popup';
import styles from './input.module.css';

export default function SubmitInput(props: any) {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [popUpState, setPopUpState] = useState(false);
    const [saveInput, setSaveInput] = useState(false);

    const handleSave = () => {
        console.log(props.data);
        return setPopUpState(false);
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

                {!saveInput 
                ? <button type='button' className={styles.CreateButton}
                onClick={() => setPopUpState(true)}
                >Create Recipe</button>
                : <button type='button' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
        </>
    )
}