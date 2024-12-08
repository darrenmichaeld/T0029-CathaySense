"use client"

import React from 'react'

import SideNav from './MainPage/Dashboard/components/sideNav'
import KeyMetric from './MainPage/Dashboard/components/keyMetric'

export default function Component() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Navigation Sidebar */}
        <SideNav/>
          <div className="p-4 bg-gray-100 flex-1 text-1.5xl">
        <KeyMetric/>
      </div>
    </div>
  )
}