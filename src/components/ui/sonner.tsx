
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  
  const isMobileApp = 
    typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('capacitor') || 
     window.navigator.userAgent.includes('android'));

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: isMobileApp ? {
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        } : {},
      }}
      position="top-center"
      duration={3000}
      {...props}
    />
  )
}

export { Toaster }
