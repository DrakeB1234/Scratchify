'use client'

import Link from 'next/link';
import Image from 'next/image';
import React, {useState, useRef} from 'react';
import { useForm } from 'react-hook-form';

// import styles / components
import styles from './popup.module.css';

// typedef
type Props = {
    popupToggle: any,
    emailCallback?: any,
    usernameCallback?: any,
    passwordCallback?: any,
    type: string
}

export default function SettingsChangePopup(props: Props) {

    // typedefs
    type Inputs = {
        email: string,
        username: string,
        password: string,
        cpassword: string
    };

    const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>();

    const handleSave = (formVal: Inputs) => {
        // if email is provided, use email callback
        if (formVal.email) {
            return props.emailCallback(formVal);
        }

        // else if username is provided, use username callback
        if (formVal.username) {
            return props.usernameCallback(formVal);
        }

        // else if password, check if two inputs match
        if (formVal.password && formVal.password != formVal.cpassword){
            return setError('password', {message: 'Passwords must match'})
        }
        else {
            return props.passwordCallback(formVal);
        }
    }

  return (
    <div className={styles.PopupParent}>
        <div className={styles.PopupChildContainer}>
            <div className={styles.PopupExitContainer}
            onClick={() => props.popupToggle(false)}
            >
                <h1>Change {props.type.charAt(0).toUpperCase() + props.type.slice(1)}</h1>
                <Image 
                  alt='o'
                  src='/icons/actions/icon-plusred-outline.svg'
                  height={50}
                  width={50}
                />
            </div>

            {props.type == 'username'
            ?
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='username'>Username</label>
                <input {...register('username', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    minLength: {
                        value: 3,
                        message: 'Must be at least 3 characters'
                    },
                    maxLength: {
                        value: 30,
                        message: 'Must be less than 30 characters'
                    },
                    pattern: {
                        value: /^[^\s][\w-]{0,}$/,
                        message: 'Can have letters, numbers, and -'
                    }
                })}
                autoComplete='off'
                />
                    
                <h1 className={styles.FormInputError}>{errors?.username?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Submit</button>

            </form>

            : props.type == 'password'
            ?
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='password'>New Password</label>
                <input {...register('password', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    minLength: {
                        value: 7,
                        message: 'Must be at least 7 characters'
                    },
                    maxLength: {
                        value: 100,
                        message: 'Must be less than 100 characters'
                    },
                    pattern: {
                        value: /^[^\s][\w\s!@#$%^&*()-~`_+{}|:;"<>?\[\]\',.\/\\]{0,}$/,
                        message: 'No emojis and can not start with space'
                    }
                })}
                autoComplete='off'
                />
                <h1 className={styles.FormInputError}>{errors?.password?.message}</h1>

                <label htmlFor='cpassword'>Confirm Password</label>
                <input {...register('cpassword', {
                    required: {
                        value: true,
                        message: 'Required'
                    }
                })}
                autoComplete='off'
                type='password'
                />
                <h1 className={styles.FormInputError}>{errors?.cpassword?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Submit</button>

            </form>
            : props.type == 'email'
            ?
            <form className={styles.FormParent}
            onSubmit={(handleSubmit(handleSave))}
            >

                <label htmlFor='email'>New Email</label>
                <input {...register('email', {
                    required: {
                        value: true,
                        message: 'Required'
                    },
                    pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Invalid Email Address'
                    }
                })}
                autoComplete='off'
                />
                <h1 className={styles.FormInputError}>{errors?.email?.message}</h1>

                <button type='submit' className={styles.SaveButton}>Submit</button>

            </form>
            : <></>}
        </div>
    </div>
  )
}
