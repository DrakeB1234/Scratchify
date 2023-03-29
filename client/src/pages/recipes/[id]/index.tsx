import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// import styles / components
import NavBar from '../../components/navbar/navbar';
import LoadingSvg from '/public/graphics/graphic-loading-dots.svg';
import styles from './recipe.module.css';

// import fetch and react query
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { getRecipes } from '../../../helpers/fetchhelpers';

export default function Recipe(props: any) {

  return (
    <>
    <Head>
      <title>Recipe</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NavBar />
    <main className={styles.RecipesParent}>
        <h1>Recipe</h1>
    </main>
    </>
  )
}