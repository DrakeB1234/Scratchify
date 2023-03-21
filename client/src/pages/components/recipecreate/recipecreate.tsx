import Image from 'next/image'
import Link from 'next/link';
import {use, useState} from 'react';

import styles from './recipecreate.module.css';

export default function RecipeCreate(props: any) {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<String>('title');

    // interface / state for recipeInput
    interface rInput {
        title: string,
        course: string,
        description: string,
        tags: string[],
        instructions: string[],
        ingredients: string[],
    }
    const [recipeInput, setRecipeInput] = useState<rInput>({
        title: '',
        course: '',
        description: '',
        tags: [''],
        instructions: [''],
        ingredients: ['']
    });

    // function to change tabs
    const changeTab = (tab: String) => {
        // reset active tab
        setActiveTab('title');
        // set active tab to passed value
        setActiveTab(tab);
    };

    // function to add additional input
    const addInput = (type: String) => {
        // add tag input
        if (type === 'tags'){
            if (!(recipeInput.tags.length >= 4)){
                return setRecipeInput(prev => ({...prev, tags: prev.tags.concat('')}))
            }
        }

        // add instructions input
        else if (type === 'instructions'){
            if (!(recipeInput.instructions.length >= 10)){
                return setRecipeInput(prev => ({...prev, instructions: prev.instructions.concat('')}))
            }
        }

        // add ingredients input
        else if (type === 'ingredients'){
            if (!(recipeInput.ingredients.length >= 10)){
                return setRecipeInput(prev => ({...prev, ingredients: prev.ingredients.concat('')}))
            }
        }
    };

    // function to add additional input
    const removeInput = (type: String, index: number) => {
        // remove tag input
        if (type === 'tags'){
            if (recipeInput.tags.length > 1){
                // copy original state
                let data = recipeInput.tags;
                data.splice(index, 1);
                return setRecipeInput(prev => ({...prev, tags: data}))
            }
        }

        // remove instructions input
        else if (type === 'instructions'){
            if (recipeInput.instructions.length > 1){
                // copy original state
                let data = recipeInput.instructions;
                data.splice(index, 1);
                return setRecipeInput(prev => ({...prev, instructions: data}))            
            }
        }

        // remove ingredients input
        else if (type === 'ingredients'){
            if (recipeInput.ingredients.length > 1){
                // copy original state
                let data = recipeInput.ingredients;
                data.splice(index, 1);
                return setRecipeInput(prev => ({...prev, ingredients: data}))     
            }
        }
    };

    // function to update input arrays
    const handleInputChange = (type: string, target: any, index: number) => {
        // handle type of input
        if (type == 'tags'){
            // copy original state
            let data = recipeInput.tags;
            data[index] = target.value;
            return setRecipeInput(prev => ({...prev, tags: data}));
        }

        else if (type == 'instructions'){
            // copy original state
            let data = recipeInput.instructions;
            data[index] = target.value;
            return setRecipeInput(prev => ({...prev, instructions: data}));
        }

        else if (type == 'ingredients'){
            // copy original state
            let data = recipeInput.ingredients;
            data[index] = target.value;
            return setRecipeInput(prev => ({...prev, ingredients: data}));
        }
    };

    const checkInputValidation = () => {
        let valid = true;

        // check tags
        recipeInput.tags.map((e) => {
            if (!/^[\w\s]{3,20}$/.test(e)){
                return valid = false;
            }});
        if (!valid) return console.log('Tags Error');
        
        // check instructions
        recipeInput.instructions.map((e) => {
            if (!/^[\w\s!@#$%^&*()-~`_+{}|:"<>?\[\]\;',.\/\\]{1,500}$/.test(e)){
                return valid = false;
            }});
        if (!valid) return console.log('Instructions Error');

        
        console.log('Youre Good!')
    }
    
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

                            <div><label htmlFor='title'>Title</label></div>
                            <input name='title' type='text' />
                            <div><label htmlFor='course'>Course</label></div>
                            <input name='course' type='text' />
                            <div><label htmlFor='description'>Description</label></div>
                            <textarea name='description' />

                        </div>
                    : activeTab == 'tags'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1 onClick={checkInputValidation}>Tags</h1>

                            {recipeInput.tags.map((e, index) => (
                                <>
                                    <div>
                                        <label key={index + 'a'} htmlFor='tags'>Tag {index + 1}</label>
                                        <Image 
                                        alt='x'
                                        src='/icons/navigation/icon-x-orange.svg'
                                        height={50}
                                        width={50}
                                        onClick={() => removeInput('tags', index)}
                                        />
                                    </div>                                    
                                    <input key={`key${index}`} name='tags' type='text' value={e}
                                    onChange={(e:any) => handleInputChange('tags', e.target, index)}
                                    minLength={3} maxLength={20}
                                    />
                                </>
                            ))}
                            <button className={styles.AddButton} onClick={() => addInput('tags')}>Add Tag</button>

                        </div>
                    : activeTab == 'picture'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1>Upload Photo</h1>

                            <div><label htmlFor='picture'>Picture</label></div>
                            <input name='picture' type='file' />

                        </div>
                    : activeTab == 'instructions'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1>Instructions</h1>

                            {recipeInput.instructions.map((e, index) => (
                                <>
                                    <div>
                                        <label key={index + 'a'} htmlFor='instructions'>Step {index + 1}</label>
                                        <Image 
                                        alt='x'
                                        src='/icons/navigation/icon-x-orange.svg'
                                        height={50}
                                        width={50}
                                        onClick={() => removeInput('instructions', index)}
                                        />
                                    </div>
                                    <textarea key={index} name='instructions' value={e}
                                    onChange={(e:any) => handleInputChange('instructions', e.target, index)}
                                    minLength={1} maxLength={500}
                                    />
                                </>
                            ))}
                            <button className={styles.AddButton} onClick={() => addInput('instructions')}>Add Step</button>

                        </div>
                    : activeTab == 'ingredients'
                    ?
                        <div className={styles.RecipeCreateInput}>
                            <h1>Ingredients</h1>

                            {recipeInput.ingredients.map((e, index) => (
                                <>
                                    <div>
                                        <label key={index + 'a'} htmlFor='ingredients'>Ingredient {index + 1}</label>
                                        <Image 
                                        alt='x'
                                        src='/icons/navigation/icon-x-orange.svg'
                                        height={50}
                                        width={50}
                                        onClick={() => removeInput('ingredients', index)}
                                        />
                                    </div>                                    
                                    <textarea key={index} name='ingredients' 
                                    onChange={(e:any) => handleInputChange('ingredients', e.target, index)}
                                    />
                                </>
                            ))}
                            <button className={styles.AddButton} onClick={() => addInput('ingredients')}>Add Ingredient</button>

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