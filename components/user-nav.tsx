"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Shield,
  GraduationCap,
  BookOpen
} from "lucide-react"

interface UserNavProps {
  user: {
    id: string
    email: string
    role: string
    first_name?: string
    last_name?: string
    student_id?: number
    lecturer_id?: number
  }
}

export function UserNav({ user }: UserNavProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ callbackUrl: "/auth" })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }
    return user.email[0].toUpperCase()
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'lecturer':
        return <BookOpen className="h-4 w-4" />
      case 'student':
        return <GraduationCap className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case 'admin':
        return 'Administrator'
      case 'lecturer':
        return 'Lecturer'
      case 'student':
        return 'Student'
      default:
        return 'User'
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          3
        </span>
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg" alt={user.email} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}`
                  : user.email
                }
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {getRoleIcon()}
                <Badge variant="secondary" className="text-xs">
                  {getRoleLabel()}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isLoading}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading ? "Signing out..." : "Sign out"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 