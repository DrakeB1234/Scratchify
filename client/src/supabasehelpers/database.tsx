// auth
import { v4 as uuidv4 } from 'uuid';
import { createClient } from 'utils/supabase-browser';
import { GetSessionAuth } from '@/supabasehelpers/auth';
const supabase = createClient();

export async function GetUserRecipes(userid: any) {
    const { data, error } = await supabase
    .from('recipe')
    .select('recipeId, title, photoUrl')
    .eq('userId', userid);
    
    if (error) return {
        type: 'error',
        message: `${error.message}`,
        data: null
    }; else return {
        type: 'success',
        message: '',
        data: data
    };
}

// typedef
type recipeEditData = {
    type: string | null,
    message: string | null,
    titleData: {
        recipeId: string,
        title: string,
        course: string,
        description: string,
        source: string,
        public: boolean | null,
    }[] | null,

    tagsData: {
        tag: string
    }[] | null,

    ingredientsData: {
        amount: string,
        ingredient: string
    }[] | null,

    spicesData: {
        spice: string
    }[] | null,

    instructionsData: {
        instruction: string
    }[] | null,

}

export async function GetRecipeById(userid: any, recipeId: any) {
    let payload: recipeEditData = {
        type: null,
        message: null,
        titleData: null,
        tagsData: null,
        ingredientsData: null,
        spicesData: null,
        instructionsData: null
    }
    
    // get title data
    const { data: titleData, error: titleError } = await supabase
        .from('recipe')
        .select('recipeId, title, course, description, public, source')
        .eq('recipeId', recipeId);

    // if no errors, set payload to include title data
    if (titleError) {
        payload.type = "error"
        payload.message = titleError.message
        payload.titleData, payload.tagsData, payload.ingredientsData, payload.spicesData, payload.instructionsData  = null
        return payload;
    }; 

    payload.titleData = titleData;

    // get tags data
    const { data: tagsData, error: tagsError } = await supabase
        .from('recipe_tags')
        .select('tag')
        .eq('recipeId', recipeId);

    // if no errors, set payload to include tags data
    if (tagsError) {
        payload.type = "error"
        payload.message = tagsError.message
        payload.titleData, payload.tagsData, payload.ingredientsData, payload.spicesData, payload.instructionsData  = null
        return payload;
    }; 

    payload.tagsData = tagsData;

    // get ingredients data
    const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select('amount, ingredient')
        .eq('recipeId', recipeId);

    // if no errors, set payload to include indredients data
    if (ingredientsError) {
        payload.type = "error"
        payload.message = ingredientsError.message
        payload.titleData, payload.tagsData, payload.ingredientsData, payload.spicesData, payload.instructionsData  = null
        return payload;
    }; 

    payload.ingredientsData = ingredientsData;

    // get spices data
    const { data: spicesData, error: spicesError } = await supabase
        .from('recipe_spices')
        .select('spice')
        .eq('recipeId', recipeId);

    // if no errors, set payload to include spices data
    if (spicesError) {
        payload.type = "error"
        payload.message = spicesError.message
        payload.titleData, payload.tagsData, payload.ingredientsData, payload.spicesData, payload.instructionsData  = null
        return payload;
    }; 

    payload.spicesData = spicesData;

    // get instructions data
    const { data: instructionsData, error: instructionsError } = await supabase
        .from('recipe_instructions')
        .select('instruction')
        .eq('recipeId', recipeId);

    // if no errors, set payload to include instructions data
    if (instructionsError) {
        payload.type = "error"
        payload.message = instructionsError.message
        payload.titleData, payload.tagsData, payload.ingredientsData, payload.spicesData, payload.instructionsData  = null
        return payload;
    }; 

    payload.instructionsData = instructionsData;

    // return payload if no errors
    payload.type = "success"
    return payload;
}

export async function SearchRecipes(searchParam: string | null) {
    // performs search if params are provided
    if (searchParam != null) {

        let query = supabase
        .from('recipe')
        .select('recipeId, title, photoUrl');
  
        // searches with provided search query
        if (searchParam) { query = query.like('title', `%${searchParam}%`) }
        
        const { data, error } = await query;
    
        if (error) return {
            type: 'error',
            message: `${error.message}`,
            data: null
        }; else return {
            type: 'success',
            message: '',
            data: data
        };
    }
    // else if no params provided return error
    else return {
        type: 'error',
        message: `input error`,
        data: null
    }
}

// typedef
type RecipeInputs = {
    title: string | null,
    course: string | null,
    description: string | null,
    source: string | null,
    public: boolean,
    photoFile: any | null,
    tags: string[],
    ingredients: {
        amount: string,
        name: string
    }[],
    spices: string[],
    instructions: string[]
}

export async function CreateRecipe(data: RecipeInputs) {

    // validating user inpuit
    if (data.title == null || !/^[^\s][\w\s-]{2,40}$/.test(data.title)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Title'
    };
    if (data.course == null || !/^Breakfast|Lunch|Dinner|Dessert|Snack$/.test(data.course)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Course'
    };
    if (data.description == null || !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{2,500}$/.test(data.description)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Description'
    };
    if (data.source != null && !/^[^\s][\w\s!@#$%^&*()-~`_+{}|/°:;"<>?\[\]\',.\/\\]{2,200}$/.test(data.source)) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Source'
    };

    let failure = false;
    // tags input validation
    if(data.tags[0] != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][a-zA-Z\s]{2,30}$/.test(e.name)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one Tag'
    };
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Tags Format'
    };

    // ingredients input validation
    if(data.ingredients[0].name != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,30}$/.test(e.amount) || !/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,50}$/.test(e.name)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one ingredient'
    };
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Ingredients Format'
    };

    // spices input validation (optional)
    if(data.spices[0] != ''){
        data.tags.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\',.\/\\]{2,30}$/.test(e.name)) return failure = true;
        });
    }
    // check if map of tags failed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Spices Format'
    };

    // instructions input validation
    if(data.instructions[0] != ''){
        data.instructions.map((e: any) => {
            if(!/^[^\s][\w\s!@#$%^&*()-~`'_+{}|/:;"<>?\[\]\,.\/\\]{2,500}$/.test(e)) return failure = true;
        });
    } else return {
        response: 'error',
        type: 'Invalid input',
        message: 'Need at least one instruction'
    };
    // check if map of tags fail`ed
    if (failure) return {
        response: 'error',
        type: 'Invalid input',
        message: 'Instructions Format'
    };

    // if photo is provided, make sure it matches validation (30MB max and JPG, JPEG, PNG)
    if (data.photoFile != null && (data.photoFile.size > 30000000 || !data.photoFile.name.match(/\.(jpg|jpeg|png)$/i)))return {
        response: 'error',
        type: 'Invalid input',
        message: 'Photo'
    };

    // if all input validation passes, then start uploading data to supabase
    let recipeId: any;
    let url: string | null = null;
    // get user session
    let session: any = await GetSessionAuth();
    session = session.data.session

    // upload image to bucket if photo provided through input
    if (data.photoFile != null){
        // make url
        url = 'public/' + data.title + '-' + uuidv4();

        const { data: photoFileData, error: photoError } = await supabase
        .storage
        .from('recipe-images')
        // uploaded files will be recipe-images/TheBestLasagna-randomid123123
        .upload(url, data.photoFile, {
            cacheControl: '3600',
            upsert: false
        });
        // error handle
        if (photoError) throw photoError;

        // if no errors, set url to public url for getting image
        url = encodeURI('https://wsgtwhbvwnftxaqiogud.supabase.co/storage/v1/object/public/recipe-images/' + url);
    };

    // query database to create recipe and return its recipe ID
    try {
        const { data: recipeData, error: recipeError } = await supabase
        .from('recipe')
        .insert({ 
            userId: session?.user.id, 
            title: data.title,
            course: data.course,
            description: data.description,
            source: data.source,
            public: data.public,
            photoUrl: url
        })
        .select('recipeId');
        // after insert, select returns recipe id for referencing other tables data
        recipeId = recipeData?.[0].recipeId;
        // error handle
        if (recipeError) throw recipeError;
    } catch(error: any) {
        // check if failure is due to unique title names
        if (error.message.includes('duplicate key value violates unique constraint')) return {
            response: 'error',
            type: 'Database error',
            message: 'Title name is taken, try another!'
        }

        // if no other error is specfied, return generic error message to user
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add tags
    try {
        const tagsArray: any = [];
        data.tags.map((e: any) => {
            tagsArray.push({
                recipeId: recipeId,
                tag: e.name
            })
        });
        const { error: tagsError } = await supabase
            .from('recipe_tags')
            .insert(tagsArray);

        // error handle
        if (tagsError) throw tagsError;
    } catch(error) {
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add ingredients
    try {
        const ingredientsArray: any = [];
        data.ingredients.map((e: any) => {
            ingredientsArray.push({
                recipeId: recipeId,
                amount: e.amount,
                ingredient: e.name
            })
        });
        const { error: ingredientsError } = await supabase
            .from('recipe_ingredients')
            .insert(ingredientsArray);

        // error handle
        if (ingredientsError) throw ingredientsError;
    } catch(error) {
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add spices if added by user
    try {
        if (data.spices[0] !== ''){
            const spicesArray: any = [];
            data.spices.map((e: any) => {
                spicesArray.push({
                    recipeId: recipeId,
                    spice: e.name
                })
            });
            const { error: spicesError } = await supabase
                .from('recipe_spices')
                .insert(spicesArray);
    
            // error handle
            if (spicesError) throw spicesError;
        }
    } catch(error: any) {
        console.error(error)
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // query database to add instructions
    try {
        const instructionsArray: any = [];
        data.instructions.map((e: any) => {
            instructionsArray.push({
                recipeId: recipeId,
                instruction: e.name,
            })
        });
        const { error: instructionsError } = await supabase
            .from('recipe_instructions')
            .insert(instructionsArray);

        // error handle
        if (instructionsError) throw instructionsError;
    } catch(error) {
        return {
        response: 'error',
        type: 'Database error',
        message: 'Try again later!'
        }
    };

    // if all is successful, return success message
    return {
        response: 'success',
        type: '',
        message: 'Recipe Created'
    }
}
