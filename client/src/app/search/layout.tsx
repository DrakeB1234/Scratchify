// metadata
export const metadata = {
  title: 'Scratchify | My Recipes',
  description: 'Scratchify, your one stop shop for recipes, mealplanning, and grocery list management!',
}

export default function MyRecipesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
        {children}
      </>
  )
}
