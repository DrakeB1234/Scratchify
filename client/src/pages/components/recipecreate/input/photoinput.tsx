import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {useForm} from 'react-hook-form';

import styles from './input.module.css';

export default function PhotoInput(props: any) {

    const [successInput, setSuccessInput] = useState(false);
    const [imageOutput, setImageOutput] = useState<string>();

    const { register, handleSubmit, formState: {errors}, setError } = useForm({});

    const handleSave = (formVal: any) => {
        // reset success state to false
        setSuccessInput(false);

        // if file size is bigger than 30mb, set error
        if (formVal.photo.length > 0 && formVal.photo[0].size > 20000000) {
            return setError('photo', {message: 'File size must be less than 20MB'})
        }

        // only accept jpg, jpeg, png
        if (formVal.photo.length > 0 && !(formVal.photo[0].type === 'image/png' || formVal.photo[0].type === 'image/jpg' || formVal.photo[0].type === 'image/jpeg')) {
            return setError('photo', {message: 'File must be .png, .jpg, or .jpeg'})
        }

        // set state from props to uploaded image
        props.setData((prev: any) => ({...prev, photoFile: formVal.photo[0]}));

        // if photo is provided, set state to blob to show image
        if (formVal.photo.length > 0) setImageOutput(URL.createObjectURL(formVal.photo[0]));

        // set success state to display success message if image was provided
        if (formVal.photo.length > 0) return setSuccessInput(true);
    };

    return ( 
        <form className={styles.InputParent} onSubmit={handleSubmit(handleSave)}>
            <h1>Photo</h1>
            {imageOutput
            ? <Image 
                className={styles.InputImage}
                alt='image'
                src={imageOutput}
                height={300}
                width={300}
                />
            : props.data.photoFile !== ''
                ? <Image 
                    className={styles.InputImage}
                    alt='image'
                    src={URL.createObjectURL(props.data.photoFile)}
                    height={300}
                    width={300}
                    />
                : <></>
            }
            <label htmlFor='photo'>
                <h1>Upload Photo</h1>
            </label>
            <input type='file' {...register('photo')}
            />
            <h2>{errors.photo?.message?.toString()}</h2>

            {errors.photo
            ?
                <button className={styles.SaveErrorButton} type='submit'>Error</button>
            : successInput
            ?
                <button className={styles.SaveSuccessButton} type='submit'>Upload Successful</button>
            :
                <button className={styles.SaveButton} type='submit'>Upload Image</button>
            }


        </form>
    )
  }