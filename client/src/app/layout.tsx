import 'server-only';

// import styles / components
import { Roboto  } from 'next/font/google';
import '../styles/globals.css';

// auth
import SupabaseListener from '../components/supabase/supabase-listener';
import SupabaseProvider from '../components/supabase/supabase-provider';
import { createClient } from 'utils/supabase-server';

// do not cache this layout
export const revalidate = 0

// font variable
const roboto = Roboto({weight: ['400', '700'], subsets: ['latin']});

// metadata
export const metadata = {
  title: 'Scratchify',
  description: 'Scratchify, your one stop shop for recipes, mealplanning, and grocery list management!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // supabase client for server components
  const supabase = createClient();

  // session data
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/scratchify/applogo.png' />
      </head>
      <body className={roboto.className}>
      <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
