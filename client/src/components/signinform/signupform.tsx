'use client'

import Link from 'next/link';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

// import styles / components
import styles from './form.module.css';

export default function SignupForm(props: any) {

    type FormInputs = {
        email: string,
        username: string,
        password: string,
        cpassword: string
    };

    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormInputs>();

    // handle save
    const handleSave = (formVal: FormInputs) => {
        // check if passwords match
        if (formVal.password != formVal.cpassword) return setError('cpassword', {
            message: 'Passwords must match'
        });

        // if pass validation, pass form values to callback function
        props.callback(formVal);
    }
    
    return (
        <form className={styles.FormParent}
        onSubmit={(handleSubmit(handleSave))}
        >
            <label htmlFor='email'>Email</label>
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

            <label htmlFor='password'>Password</label>
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
            />
            <h1 className={styles.FormInputError}>{errors?.cpassword?.message}</h1>

            <button type='submit'>Sign up</button>

            <h1 className={styles.FormText}>Or sign in here</h1>

            <Link
            href='/signin'
            className={styles.LinkMakeAccount}
            >Sign in</Link>

        </form>
    )
}