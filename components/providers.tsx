'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarProvider>
  )
}
