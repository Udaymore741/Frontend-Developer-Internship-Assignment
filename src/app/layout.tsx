import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';
import { TaskProvider } from '@/context/TaskContext';
import { TeamProvider } from '@/context/TeamContext';
import { Toast } from '@/components/ui/Toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Task & Team Dashboard',
  description: 'Manage your tasks and team in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
        <ThemeProvider>
          <AppProvider>
            <TaskProvider>
              <TeamProvider>
                {children}
                <Toast />
              </TeamProvider>
            </TaskProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
