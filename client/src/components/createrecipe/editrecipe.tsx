'use client'

import Image from 'next/image';
import React, {useEffect, useState, useRef} from 'react';

// import styles / components
import Popup from '../../components/popup/popup';
import TitleInput from './editinput/titleinputedit';
import PhotoInput from './editinput/photoinputedit';
import TagsInput from './editinput/tagsinputedit';
import IngredientsInput from './editinput/ingredientsinputedit';
import SpicesInput from './editinput/spicesinputedit';
import InstructionsInput from './editinput/instructionsinputedit';
import SubmitInput from './editinput/submitinputedit';
import styles from './createrecipe.module.css';

// auth
import { GetRecipeById } from '@/supabasehelpers/database';

export default function EditRecipe(props: any) {

    // typedef
    type Inputs = {
        title: string | null,
        course: string | null,
        description: string | null,
        source: string | null,
        public: boolean | null,
        photoFile: any | null,
        tags: {
            tag: string
        }[] | null,
        ingredients: {
            amount: string,
            ingredient: string
        }[] | null,
        spices: {
            spice: string | null
        }[] | null,
        instructions: {
            instruction: string
        }[] | null,
    }

    const [popUpState, setPopUpState] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('title');
    const [inputEditData, setInputEditData] = useState<Inputs>({
        title: null,
        course: null,
        description: null,
        source: null,
        public: null,
        photoFile: null,
        tags: null,
        ingredients: null,
        spices: null,
        instructions: null,
    });

    const [inputData, setInputData] = useState<Inputs>({
        title: null,
        course: null,
        description: null,
        source: null,
        public: null,
        photoFile: null,
        tags: [{tag: ''}],
        ingredients: [{
            amount: '',
            ingredient: ''
        }],
        spices: [{spice: ''}],
        instructions: [{instruction: ''}],
    });

    // function to get recipe data by passed id from props
    const getRecipeData = async () => {
        setActiveTab('photo');
        const data = await GetRecipeById(props.userId, props.recipeId);
        if (data.type !== "success") return;
        // if data is successful, set input state
        setInputData(prev => ({...prev,
            title: data.data[0].title,
            course: data.data[0].course,
            description: data.data[0].description,
            source: data.data[0].source,
            public: data.data[0].public,
            tags: data.data[0].recipe_tags,
            photoFile: data.data[0].photoUrl,
            ingredients: data.data[0].recipe_ingredients,
            spices: data.data[0].recipe_spices,
            instructions: data.data[0].recipe_instructions
        }));

        setActiveTab('title');
    }

    // call get recipe function on recipeid
    useEffect(() => {
        getRecipeData();
    }, [props.recipeId])

    const exitRecipe = () => {
        return props.setToggle(false);
    }

    return (
        <>
        {popUpState
            ? <Popup 
                title='Exit Recipe Editor'
                message={['Are you sure you want to exit the Recipe Editor?', 
                'This will delete any changes made so far!']}
                confirm={true}
                popupToggle={setPopUpState}
                callback={exitRecipe}
                />
            : <></>
        }
        <div className={styles.CreateParent}>
            <div className={styles.CreateContentParent}>
                <div className={styles.CreateContentTitle}>
                    <h1>Recipe Editor</h1>
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
                    className={styles.CreateContentNavBarItem + ' ' + (activeTab === 'spices' ? styles.NavBarActive : ' ')}
                    onClick={() => setActiveTab('spices')}
                    >                    
                        <h1>Spices</h1>
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
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'photo'
                ?
                <PhotoInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'tags'
                ?
                <TagsInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'ingredients'
                ?
                <IngredientsInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'spices'
                ?
                <SpicesInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'instructions'
                ?
                <InstructionsInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                />

                : activeTab === 'submit'
                ?
                <SubmitInput
                data={inputData} 
                setData={setInputEditData}
                editData={inputEditData}
                userId={props.userId}
                recipeId={props.recipeId}
                />

                : <></> 

                }
            </div>
        </div>
        </>
    )
}