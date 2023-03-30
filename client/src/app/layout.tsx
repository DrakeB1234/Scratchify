// import styles / components
import { Roboto } from 'next/font/google';
import Navbar from '../components/navbar/navbar';
import '../styles/globals.css';

// font variable
const roboto = Roboto({weight: ['400', '700'], subsets: ['latin']});

// metadata
export const metadata = {
  title: 'Scratchify',
  description: 'Scratchify, your one stop shop for recipes, mealplanning, and grocery list management!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel='icon' href='/scratchify/applogo.png' />
      </head>
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  )
}
