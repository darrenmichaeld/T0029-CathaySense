'use client'

import { useState } from 'react'
import { Plane } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'
import { Toaster } from "@/components/ui/toaster"
import SideNav from '@/app/MainPage/Dashboard/components/sideNav'

export default function PriceAlertPage() {
  const [flightOrigin, setFlightOrigin] = useState('')
  const [flightDestination, setFlightDestination] = useState('')
  const [threshold, setThreshold] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/price-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ flight_route: flightOrigin, threshold: parseFloat(threshold) }),
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Price alert set successfully!",
          duration: 5000,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "An error occurred while setting the price alert.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while setting the price alert.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Plane className="h-6 w-6" />
              Set Price Alert
            </CardTitle>
            <CardDescription className="text-center">
              Get notified when flight prices change significantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Origin</Label>
                <Input
                  type="text"
                  id="flightNumber"
                  value={flightOrigin}
                  onChange={(e) => setFlightOrigin(e.target.value)}
                  placeholder="e.g. Hong Kong"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Destination</Label>
                <Input
                  type="text"
                  id="flightNumber"
                  value={flightDestination}
                  onChange={(e) => setFlightDestination(e.target.value)}
                  placeholder="e.g. Los Angeles"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Price Change Threshold ($)</Label>
                <Input
                  type="number"
                  id="threshold"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder="e.g. 50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Setting Alert...' : 'Set Alert'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}