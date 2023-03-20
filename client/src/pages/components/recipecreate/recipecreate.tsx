import Image from 'next/image'
import Link from 'next/link';
import {use, useState} from 'react';

import styles from './recipecreate.module.css';

export default function RecipeCreate(props: any) {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<String>('title');
    const [recipeInput, setRecipeInput] = useState({
        title: '',
        course: '',
        description: '',
        tags: ['', ''],
    })

    // function to change tabs
    const changeTab = (tab: String) => {
        // reset active tab
        setActiveTab('title');
        // set active tab to passed value
        setActiveTab(tab);
    };
    
    return (
        <div className={styles.RecipeCreateParent}>
            <div className={styles.RecipeCreateContainer}>
                <div className={toggleSidebar ? styles.RecipeCreateSidebar : styles.RecipeCreateSidebar + ' ' + styles.HideSidebar}>
                    
                    <div 
                    onClick={() => setToggleSidebar(!toggleSidebar)}
                    >
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
                    {activeTab == 'title'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1>Title</h1>

                            <label htmlFor='title'>Title</label>
                            <input name='title' type='text' />
                            <label htmlFor='course'>Course</label>
                            <input name='course' type='text' />
                            <label htmlFor='description'>Description</label>
                            <textarea name='description' />

                        </div>
                    : activeTab == 'tags'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1>Tags</h1>

                            {recipeInput.tags.map((e, index) => (
                                <>
                                    <label htmlFor='tags'>Tag {index + 1}</label>
                                    <input name='tags' type='text' value={e} />
                                </>
                            ))}


                        </div>
                    : activeTab == 'picture'
                    ?
                        <div className={styles.RecipeCreateInput}>
                        </div>
                    :
                        <>
                        </>
                    }
                </div>
            </div>
        </div>
    )
  }