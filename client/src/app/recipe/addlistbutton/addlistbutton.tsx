'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/navigation';

// import styles / components
import ListPopup from './listPopup';
import Popup from '@/components/popup/popup';
import styles from '@/styles/Recipe.module.css';

// auth
import { RecipeAddListItem } from '@/supabasehelpers/database';

// type def
type inputs = {
    user_id: any,
    category: string | null,
    recipe: string | null,
    item: string | null
}[]


export default function AddListButton(props: any) {

    const router = useRouter();

    const [toggleListPopup, setToggleListPopup] = useState(false);
    const [toggleListErrorPopup, setToggleListErrorPopup] = useState(false);

    const addListFunction = async (formVal: any) => {
        // append values from form into usable objects 
        // for database
        const data: inputs = [];
        formVal.ingredient.map((e: any) => {
            // check if category is none, if so then null value
            if (e.category == 'none') e.category = null;

            data.push({
                user_id: props.userId,
                category: e.category,
                recipe: props.data.title,
                item: e.name
            })
        });

        // call database
        const result = await RecipeAddListItem(data)

        // hide popup
        setToggleListPopup(false);
        // if success, reroute
        if (result.type == 'success') return router.replace('/grocerylist');
        // else, show error popup dialog
        else {
            setToggleListErrorPopup(true)
        }        
    }

    return (      
        <>
            {toggleListPopup
            ? 
                <ListPopup 
                popupToggle={setToggleListPopup}
                data={props.data}
                callback={addListFunction}
                />
            : <></>
            }
            {toggleListErrorPopup
            ? 
                <Popup 
                title='Error'
                message={['There was an error adding list items, please try again later', 'Press ok below to close this message']}
                dialog={true}
                popupToggle={setToggleListErrorPopup}
                />
            : <></>
            }

            <div className={styles.AddListItemsContainer}
            onClick={() => setToggleListPopup(true)}
            >
                <h1>Add to List</h1>
                <Image 
                alt='+'
                src='/icons/actions/icon-plus-outline.svg'
                height={30}
                width={30}
                />
            </div>
        </>   
    )
}