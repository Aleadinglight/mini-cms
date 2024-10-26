'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/utils/supabase/client'
import { Bell, Lock, User, LogOut } from 'lucide-react'
import { logout } from "@/app/auth/action"
import { useRouter } from 'next/navigation'

// Create the Supabase client outside the component
const supabase = createClient()

export default function UserSettings() {
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) throw error

          if (data) {
            setFullName(data.full_name || '')
            setUsername(data.username || '')
            setBio(data.bio || '')
            setAvatarUrl(data.avatar_url || '')
            setEmail(user.email || '')
            setPhone(user.phone || '')
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        // You might want to show an error message to the user here
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, []) //

  const handleSave = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          username,
          bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
      alert('An error occurred while logging out. Please try again.')
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">User Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
            <User className="h-4 w-4 hidden sm:inline" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center justify-center gap-2">
            <Bell className="h-4 w-4 hidden sm:inline" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 hidden sm:inline" />
            Account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl ?? "/placeholder.svg?height=80&width=80"} alt="User avatar" />
                  <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button>Change Avatar</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <Button variant="outline" onClick={handleLogout} className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button onClick={handleSave} disabled={loading}
                className="w-full sm:w-auto"> {loading ? 'Saving...' : 'Save Changes'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <Select>
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language Preference</Label>
                <Select>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <Button variant="outline" className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-600 hover:text-white">Delete Account</Button>
              <Button className="w-full sm:w-auto">Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}