import { useSupabaseClient } from '@supabase/auth-helpers-react';

export async function getRecipes() {
    const supabase = useSupabaseClient();
    const { data: recipeData, error } = await supabase
      .from('recipe')
      .select('recipeId, course, title, photoUrl');
  
    return recipeData;
}