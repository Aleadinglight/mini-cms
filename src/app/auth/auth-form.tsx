'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup } from "@/app/auth/action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const loginFailed = searchParams.get('loginFailed')
    if (loginFailed === 'true') {
      setError('Login failed. Please try again.')
    } else {
      setError('') // Clear the error when the parameter is not present
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Here you would typically call your authentication API
    try {
      // Here you would typically call your authentication API
      // For demonstration, we'll simulate a successful login
      if (isLogin) {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        // Call the login function from the auth action
        const result = await login(formData);

        if (result) {
          // Redirect to user settings page after successful login
          setError('')
          router.push('/user/collections')
        } else {
          // Redirect to login page with error message
          setError('Failed to login. Please try again.')
        }
      } else {
        console.log('Registering...', { email, password })
        // Handle registration logic here
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const result = await signup(formData);
        console.log('result', result)
        if (result) {
          setError('')
          // Redirect to user settings page after successful registration
          router.push('/user/settings')
        } else {
          setError(result || 'Failed to sign up');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something unexpected happened, please try again!');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-[320px] xs:max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[800px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            {isLogin ? 'Login' : 'Register'}
          </CardTitle>
          <CardDescription className="text-center sm:text-lg lg:text-lg">
            {isLogin ? 'Enter your credentials to login' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-semibold">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="link" className="w-full" onClick={() => {
            setError('');
            setIsLogin(!isLogin);
          }}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}