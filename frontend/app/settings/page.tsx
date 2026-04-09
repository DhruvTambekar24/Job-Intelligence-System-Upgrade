'use client'

import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Shield, LogOut } from 'lucide-react'

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="profile" className="gap-2">
              <User size={18} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell size={18} />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield size={18} />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input defaultValue="Alex Johnson" className="bg-muted border-border" />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" defaultValue="alex.johnson@example.com" className="bg-muted border-border" />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Job Title</FieldLabel>
                  <Input defaultValue="Senior Full Stack Engineer" className="bg-muted border-border" />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Location</FieldLabel>
                  <Input defaultValue="San Francisco, CA" className="bg-muted border-border" />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Bio</FieldLabel>
                  <textarea
                    defaultValue="Passionate about building scalable web applications and exploring AI/ML technologies."
                    className="w-full p-3 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </FieldGroup>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you&apos;d like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: 'Job Recommendations',
                    description: 'Get notified about new job matches',
                    enabled: true,
                  },
                  {
                    title: 'Skill Recommendations',
                    description: 'Receive suggestions for new skills to learn',
                    enabled: true,
                  },
                  {
                    title: 'Market Trends',
                    description: 'Weekly updates on job market trends',
                    enabled: false,
                  },
                  {
                    title: 'Learning Milestones',
                    description: 'Celebrate achievements and milestones',
                    enabled: true,
                  },
                ].map((notif) => (
                  <div key={notif.title} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div>
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-sm text-muted-foreground">{notif.description}</div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-muted cursor-pointer flex items-center transition-colors" style={{background: notif.enabled ? 'var(--primary)' : 'var(--muted)'}}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notif.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium mb-1">Change Password</div>
                      <div className="text-sm text-muted-foreground">Update your password regularly for better security</div>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium mb-1">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium mb-1">Active Sessions</div>
                      <div className="text-sm text-muted-foreground">Manage your active sessions across devices</div>
                    </div>
                    <Button variant="outline">View</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="bg-destructive/5 border-destructive/20 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-destructive">Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="gap-2">
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
