'use client'
import React from 'react'
import Link from 'next/link'
import { NavGroup } from '@payloadcms/ui'
import { MessageSquare } from 'lucide-react'

// Since we can't easily import and wrap the existing Nav from the package (it might have internal logic)
// We will try to see if we can just add a side-car Nav or if we must replace it.
// In Payload 3.0, if you provide a Nav component, it REPLACES the default one.
// The user has '@shefing/quickfilter/nav' currently.

const CustomNav = () => {
  return (
    <div className="custom-nav">
      {/* This is a bit tricky because we want to KEEP the quickfilter nav but ADD a link */}
      {/* If we can't wrap it, we might have to re-implement it or find where it is */}
      <NavGroup label="Custom">
        <Link href="/end-user-comm" className="nav__link">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} />
            <span>End-user Comm</span>
          </div>
        </Link>
      </NavGroup>
    </div>
  )
}

export default CustomNav
