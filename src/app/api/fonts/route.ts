import { NextResponse } from 'next/server'

export async function GET() {
  const fonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Oswald',
    'Source Sans Pro',
    'Slabo 27px',
    'Raleway',
    'PT Sans',
    'Merriweather',
    'Noto Sans',
    'Playfair Display',
    'Poppins'
  ]
  return NextResponse.json(fonts)
}
