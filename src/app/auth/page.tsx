import { Suspense } from 'react'
import AuthForm from './auth-form'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  )
}