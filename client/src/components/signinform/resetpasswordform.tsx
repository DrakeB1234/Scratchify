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
import {ResetPasswordSend} from '../../supabasehelpers/auth';

export default function ResetPasswordForm(props: any) {
    
    const router = useRouter();

    // typedefs
    type Inputs = {
        email: string,
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

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    // handle save
    const handleSave = async (formVal: Inputs) => {
        // set loading state and reset any form errors generated
        setLoadingState(true);
        setAuthState(prev => ({...prev,
            type: '',
            message: ''
        }));

        const val = await ResetPasswordSend(formVal);
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
                title='Reset Link Sent'
                message={['Check your email for the reset link sent in order to proceed.', 
                'This link will expire']}
                link='/signin'
                linkMessage='Go back'
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

            <button type='submit'>{!loadingState
                ? 'Send'
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