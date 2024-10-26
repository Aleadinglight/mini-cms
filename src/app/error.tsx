'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const errorMessage = error?.message || "An unexpected error occurred"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle className="text-2xl font-bold">Oops! Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We apologize for the inconvenience. An error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Error details: {errorMessage}
          </p>
          {error?.digest && (
            <p className="text-sm text-gray-600 mb-4">
              Error ID: {error.digest}
            </p>
          )}
          <p className="text-sm text-gray-600">
            If this problem persists, please contact our support team.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Button>
          <Button onClick={() => reset()} className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}