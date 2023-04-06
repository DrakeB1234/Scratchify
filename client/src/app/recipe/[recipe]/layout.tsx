// metadata
export const metadata = {
  title: 'Scratchify | Recipe',
  description: 'Scratchify, your one stop shop for recipes, mealplanning, and grocery list management!',
}

export default function RecipeLayout({
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
