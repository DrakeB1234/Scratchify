'use client'

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';

// import styles / components
import Popup from '../popup/popup';
import LoadingSvg from '/public/graphics/icon-loading.svg';
import styles from '../signinform/form.module.css';

// auth server function
import {UpdatePasswordSend} from '../../supabasehelpers/auth';

export default function UpdatePasswordForm(props: any) {
    
    const router = useRouter();

    // typedefs
    type Inputs = {
        password: string,
        cpassword: string
    };
    type AuthState = {
        type: string,
        message: string,
    };

    const [popUpState, setPopUpState] = useState(false);
    const [loadingState, setLoadingState] = useState(false);
    const [authState, setAuthState] = useState<AuthState>({
        type: '',
        message: ''
    });

    const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>();

    // handle save
    const handleSave = async (formVal: Inputs) => {
        // reset any form errors generated
        setAuthState(prev => ({...prev,
            type: '',
            message: ''
        }));

        // make sure new passwords match
        if (formVal.password !== formVal.cpassword) return setError('cpassword', {message: 'Passwords do not match'});

        // set loading state
        setLoadingState(true);
        const val = await UpdatePasswordSend(formVal);
        // remove loading state, set auth state with value passed from auth server component
        setLoadingState(false);

        // check if val passed from auth is error, if so set auth
        // state
        if (val.type == 'error') return setAuthState(prev => ({...prev, 
            type: val.type,
            message: val.message
        }));

        // open pop to show successful account creation
        return setPopUpState(true);
    }
    
    return (
        <form className={styles.FormParent}
        onSubmit={(handleSubmit(handleSave))}
        >

            {popUpState
            ? <Popup 
                title='Password Updated!'
                message={['You may now go back to the sign in page.']}
                link='/signin'
                linkMessage='Sign in'
                />
            : <></>
            }

            {authState.type == 'error'
            ?
                <h1 
                className={styles.FormError}
                onClick={() => {setAuthState(prev => ({...prev, type: '', message: ''}))}}
                >{authState.message}<span>X</span></h1>
            :   <></>
            }

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
            autoComplete='off' type='password'
            />
            <h1 className={styles.FormInputError}>{errors?.password?.message}</h1>

            <label htmlFor='cpassword'>Confirm Password</label>
            <input {...register('cpassword', {
                required: {
                    value: true,
                    message: 'Required'
                }
            })}
            autoComplete='off' type='password'
            />
            <h1 className={styles.FormInputError}>{errors?.cpassword?.message}</h1>

            <button type='submit'>{!loadingState
                ? 'Update Password'
                :  <LoadingSvg />
            }</button>

            <h1 className={styles.FormText}>Or go back to</h1>

            <Link
            href='/signin'
            className={styles.LinkMakeAccount}
            >Sign in</Link>

        </form>
    )
}