'use client'
import Image from 'next/image'
import logoImage from './riverbed-logo.png' // Import the image file

const Logo = () => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={logoImage} // Use the imported image file
        width={200}
        height={92}
        alt="Riverbed"
      />
      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#581c87' }}></span>
    </div>
  )
}

export default Logo
