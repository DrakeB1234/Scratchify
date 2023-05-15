'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';
import { useRouter } from 'next/navigation';

// import styles / components
import Popup from '@/components/popup/popup';
import styles from '@/styles/Recipe.module.css';

// auth
import { SaveRecipe } from '@/supabasehelpers/database';
import { GetSessionAuth } from '@/supabasehelpers/auth';


export default function SocialButtons(props: any) {

    const [savePopupState, setSavePopupState] = useState(false);
    const [sharePopupState, setSharePopupState] = useState(false);
    const saveMessage = useRef('');

    const router = useRouter();

    const SaveRecipeFunction = async () => {
        // ensure that user is logged in
        if (props.userId === undefined) {
            // call refresh function
            return router.replace('/signin');
            
        } else {
            const result = await SaveRecipe(props.userId, props.recipeId);
            setSavePopupState(true);
            // set dialog depending on message from result
            if (result.type == 'Removed Saved Recipe'){
                saveMessage.current = 'Unsaved Recipe!';
            } else {
                saveMessage.current = 'Saved Recipe!';
            }
            // call refresh function
            return router.refresh();
        }
    }

    const ShareRecipeFunction = () => {
        navigator.clipboard.writeText('https://scratchifyhub.com/recipe/' + props.recipeTitle);
        setSharePopupState(true);
    }

    return (
        <>     
            {savePopupState
            ?
                <Popup 
                title={saveMessage.current}
                message={['Click the ok button below to continue.']}
                dialog={true}
                popupToggle={setSavePopupState}
                />   
            : <></>

            }

            {sharePopupState
            ?
                <Popup 
                title='Link Copied!'
                message={['Click the ok button below to continue.']}
                dialog={true}
                popupToggle={setSharePopupState}
                />   
            : <></>

            }

            <div className={styles.RecipeSocialButtons}>
                
                {!props.isSaved || props.isSaved.length == 0
                ?
                    <div
                    className={styles.SaveRecipeButtonUnsaved}
                    onClick={() => SaveRecipeFunction()}
                    >
                        <h1>{props.amountSaved.length}</h1>
                        <Image 
                        alt='Saves'
                        src='/icons/actions/icon-save-outline.svg'
                        height={50}
                        width={50}
                        />
                    </div>
                :
                    <div
                    className={styles.SaveRecipeButtonSaved}
                    onClick={() => SaveRecipeFunction()}
                    >
                        <h1>{props.amountSaved.length}</h1>
                        <Image 
                        alt='Saves'
                        src='/icons/actions/icon-save-outline.svg'
                        height={50}
                        width={50}
                        />
                    </div>
                }
                
                <div
                onClick={() => ShareRecipeFunction()}
                >
                    <Image 
                    alt='Share'
                    src='/icons/actions/icon-share-outline.svg'
                    height={50}
                    width={50}
                    />
                </div>

                <div>
                    <Image 
                    alt='Report'
                    src='/icons/actions/icon-report-outline.svg'
                    height={50}
                    width={50}
                    />
                </div>
            </div>
        </>
    )
}