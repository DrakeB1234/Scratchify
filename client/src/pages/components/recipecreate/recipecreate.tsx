import Image from 'next/image'
import Link from 'next/link';
import {use, useState} from 'react';

// import styles / components
import TitleInput from './input/titleinput';
import TagsInput from './input/tagsinput';
import PhotoInput from './input/photoinput';
import InstructionsInput from './input/instructionsinput';
import IngredientsInput from './input/ingredientsinput';
import SubmitInput from './input/submitinput';
import styles from './recipecreate.module.css';

export default function RecipeCreate(props: any) {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<String>('title');

    // interface / state for recipeInput
    interface ingredientObj {
        amount: string,
        ingredient: string
    }
    interface rInput {
        title: string,
        course: string,
        description: string,
        tags: string[],
        instructions: string[],
        ingredients: ingredientObj[],
    }

    const [recipeInput, setRecipeInput] = useState<rInput>({
        title: '',
        course: '',
        description: '',
        tags: [''],
        instructions: [''],
        ingredients: [{amount: '', ingredient: ''}]
    });

    // function to change tabs
    const changeTab = (tab: String) => {
        // reset active tab
        setActiveTab('title');
        // set active tab to passed value
        return setActiveTab(tab);
    };

    return (
        <div className={styles.RecipeCreateParent}>
            <div className={styles.RecipeCreateContainer}>
                <div className={toggleSidebar ? styles.RecipeCreateSidebar : styles.RecipeCreateSidebar + ' ' + styles.HideSidebar}>
                    
                    <div onClick={() => setToggleSidebar(!toggleSidebar)}>
                        <Image 
                        alt=''
                        src='/icons/navigation/icon-left-arrow.svg'
                        height={50}
                        width={50}
                        />
                    </div>

                    <div className={activeTab == 'title' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('title')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-text.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Title, Description, and Course</h1>
                    </div>

                    <div className={activeTab == 'tags' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('tags')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-tags.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Tags</h1>
                    </div>

                    <div className={activeTab == 'picture' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('picture')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-image.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Upload Picture</h1>
                    </div>

                    <div className={activeTab == 'ingredients' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('ingredients')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-ingredients.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Ingredients</h1>
                    </div>


                    <div className={activeTab == 'instructions' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('instructions')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-instruction.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Instructions</h1>
                    </div>

                    <div className={activeTab == 'submit' ? styles.ActiveDiv : ''}
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : changeTab('submit')}
                    >
                        <Image 
                        alt=''
                        src='/icons/edit/icon-submit.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Review and Submit</h1>
                    </div>

                    <div
                    onClick={() => !toggleSidebar ? setToggleSidebar(true) : props.toggle(false)}
                    >
                        <Image 
                        alt=''
                        src='/icons/navigation/icon-x.svg'
                        height={50}
                        width={50}
                        />
                        <h1>Exit</h1>
                    </div>

                </div>
                <div className={styles.RecipeCreateInputParent}>
                    {activeTab == 'title' ? <TitleInput setData={setRecipeInput} data={recipeInput}/>
                    : activeTab == 'tags' ? <TagsInput setData={setRecipeInput} data={recipeInput} /> 
                    : activeTab == 'picture' ? <PhotoInput setData={setRecipeInput} data={recipeInput} /> 
                    : activeTab == 'instructions' ? <InstructionsInput setData={setRecipeInput} data={recipeInput} /> 
                    : activeTab == 'ingredients' ? <IngredientsInput setData={setRecipeInput} data={recipeInput} /> 
                    : activeTab == 'submit' ? <SubmitInput setData={setRecipeInput} data={recipeInput} /> 
                    : <></>
                    }
                </div>
            </div>
        </div>
    )
  }