'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './input.module.css';

export default function PhotoInput(props: any) {

    // typedefs
    type Inputs = {
        photoFile: any | null
    };

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            photoFile: null
        }
    });

    const [imageOutput, setImageOutput] = useState<string>();
    const [saveInput, setSaveInput] = useState(false);

    const handleSave = (formVal: Inputs) => {
        const file = formVal.photoFile[0];

        // if file not provided
        if(!file) return setError('photoFile', {message: 'If saving photo, file must be provided'});

        // if file size bigger than 30MB set error
        if(file.size > 30000000) return setError('photoFile', {message: 'Photo must can not be larger than 30MB'});

        // file must be jpg, jpeg, or png
        if(!file.name.match(/\.(jpg|jpeg|png)$/i)) return setError('photoFile', {message: 'File must be a JPG, JPEG, or PNG'});
        
        props.setData((prev: Inputs) => ({...prev, 
            photoFile: file
        }));

        // if photo is provided, set state to blob to show image
        if (formVal.photoFile.length > 0) setImageOutput(URL.createObjectURL(file));

        return setSaveInput(true);
    }

    return (
        <div className={styles.InputParent}>
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >
                {imageOutput
                ? <Image 
                    className={styles.InputImage}
                    alt='image'
                    src={imageOutput}
                    height={300}
                    width={300}
                    />
                : props.data.photoFile !== null
                    ? <Image 
                        className={styles.InputImage}
                        alt='image'
                        src={URL.createObjectURL(props.data.photoFile)}
                        height={300}
                        width={300}
                        />
                    : <></>
                }

                <label htmlFor='photoFile'>Upload Photo</label>
                <input {...register('photoFile')}
                autoComplete='off' type='file'
                />
                <h1 className={styles.FormInputError}>{errors?.photoFile?.message}</h1>

                {!saveInput 
                ? <button type='submit' className={styles.SaveButton}>Save Changes</button>
                : <button type='submit' className={styles.SavedButton}>Changes Saved!</button>
                }

            </form>
        </div>
    )
}