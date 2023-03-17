import Head from 'next/head'
import Image from 'next/image'
import {useState} from 'react';

// import styles / components
import RegisterForm from '../components/forms/registerForm';
import VerifyAccount from '../components/verifyaccount/verifyaccount';
import Navbar from '../components/navbar/navbar';
import styles from './recipes.module.css';

// auth
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Recipes() {

  return (
    <>
    <Head>
      <title>Scratchify | Recipes</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <main className={styles.RecipeParent}>
      <Navbar />
      recipes
    </main>
    </>
  )
}