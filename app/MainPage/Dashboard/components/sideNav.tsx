'use client'
import { useState } from "react"
import {Home, TrendingUp} from 'lucide-react'
import { Button } from "../../../../components/ui/button"
import Link from 'next/link'
import { Plane} from 'lucide-react'

export default function SideNav(){
const navigation = [
    { name: 'Dashboard', icon: Home, id: '' },
    { name: 'Insights', icon: TrendingUp, id: 'insights' },
    { name: 'Alerts', icon: TrendingUp, id: 'alerts' },
    ]
    const [activePage, setActivePage] = useState('dashboard')

return(
    <nav className="w-90 bg-gray-800 p-6 hidden md:block text-gray-100">
    <div className="flex items-center justify-center mb-8 mt-4">
        <Plane className="h-11 w-11 text-blue-400 ml-4 mr-3" />
        <span className="text-3xl font-bold mr-4">Cathay Cargo</span>
    </div>
    <ul className="space-y-2">
        {navigation.map((item) => (
        <li key={item.id}>
            <Link href={`/${item.id}`}>
            <Button
            variant={activePage === item.id ? "secondary" : "ghost"}
            className="w-full justify-start h-14 text-1xl"
            onClick={() => setActivePage(item.id)}
            >
            <item.icon className="mr-2 h-4 w-4 text-white" />
            {item.name}
            </Button>
            </Link>
        </li>
        ))}
    </ul>
    </nav>

)
}