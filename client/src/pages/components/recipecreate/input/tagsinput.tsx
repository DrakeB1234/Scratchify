import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function TagsInput(props: any) {

    const [successInput, setSuccessInput] = useState(false)

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: {
        title: props.data.title,
        course: props.data.course,
        description: props.data.description
    }
    }
    );

    const handleSave = (formVal: any) => {
        // reset success state to false
        setSuccessInput(!successInput);
        // save values into state passed by props
        props.setData((prev: any) => ({...prev, 
            title: formVal.title, 
            course: formVal.course,
            description: formVal.description
        }));

        // set success state to display success message
        setSuccessInput(true);
    }
    
    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>

            {errors.title || errors.course || errors.description
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Save Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Save Changes</button>
            }


        </form>
    )
  }