'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPriceAlert } from '../action'

export default function PriceAlertForm() {
  const [threshold, setThreshold] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPriceAlert({ threshold: parseFloat(threshold), userEmail: email })
      alert('Price alert created successfully!')
      setThreshold('')
      setEmail('')
      router.refresh() // Refresh the page to show the new alert
    } catch (error) {
      console.error('Error creating price alert:', error)
      alert('Failed to create price alert. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="threshold">Price Threshold (per kg)</Label>
        <Input
          id="threshold"
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          placeholder="Enter price threshold"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <Button type="submit">Create Price Alert</Button>
    </form>
  )
}