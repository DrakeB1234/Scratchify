'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';

// import styles / components
import Popup from '../../components/popup/popup';
import TitleInput from './input/titleinput';
import PhotoInput from './input/photoinput';
import TagsInput from './input/tagsinput';
import IngredientsInput from './input/ingredientsinput';
import InstructionsInput from './input/instructionsinput';
import SubmitInput from './input/submitinput';
import styles from './createrecipe.module.css';

export default function CreateRecipe(props: any) {

    // typedef
    type Inputs = {
        title: string | null,
        course: string | null,
        description: string | null,
        photoFile: any | null,
        tags: string[],
        ingredients: {
            amount: string,
            name: string
        }[],
        instructions: string[]
    }

    const [popUpState, setPopUpState] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('title');
    const [inputData, setInputData] = useState<Inputs>({
        title: null,
        course: null,
        description: null,
        photoFile: null,
        tags: [''],
        ingredients: [{
            amount: '',
            name: ''
        }],
        instructions: ['']
    });

    const exitRecipe = () => {
        return props.setToggle(false);
    }

    return (
        <>
        {popUpState
            ? <Popup 
                title='Exit Recipe Creator'
                message={['Are you sure you want to exit the Recipe Creator?', 
                'This will delete any data saved so far, in order to save this data create this recipe before exiting!']}
                confirm={true}
                popupToggle={setPopUpState}
                callback={exitRecipe}
                />
            : <></>
        }
        <div className={styles.CreateParent}>
            <div className={styles.CreateContentParent}>
                <div className={styles.CreateContentTitle}>
                    <h1>Recipe Creator</h1>
                    <Image 
                    alt='+'
                    src='/icons/actions/icon-plus-outline.svg'
                    height={50}
                    width={50}
                    onClick={() => setPopUpState(true)}
                    />
                </div>
                <div className={styles.CreateContentNavBar}>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'title' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('title')}
                    >
                        <h1>Title</h1>
                    </div>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'photo' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('photo')}
                    >
                        <h1>Photo</h1>
                    </div>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'tags' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('tags')}
                    >
                        <h1>Tags</h1>
                    </div>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'ingredients' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('ingredients')}
                    >                    
                        <h1>Ingredients</h1>
                    </div>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'instructions' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('instructions')}
                    >                     
                        <h1>Instructions</h1>
                    </div>

                    <div
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'submit' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('submit')}
                    >                     
                        <h1>Submit</h1>
                    </div>

                </div>
                {activeTab === 'title'
                ? 
                <TitleInput
                data={inputData} 
                setData={setInputData}
                />

                : activeTab === 'photo'
                ?
                <PhotoInput
                data={inputData} 
                setData={setInputData}
                />

                : activeTab === 'tags'
                ?
                <TagsInput
                data={inputData} 
                setData={setInputData}
                />

                : activeTab === 'ingredients'
                ?
                <IngredientsInput
                data={inputData} 
                setData={setInputData}
                />

                : activeTab === 'instructions'
                ?
                <InstructionsInput
                data={inputData} 
                setData={setInputData}
                />

                : activeTab === 'submit'
                ?
                <SubmitInput
                data={inputData} 
                setData={setInputData}
                />

                : <></> 

                }
            </div>
        </div>
        </>
    )
}