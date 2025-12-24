'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0][0];
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (userError) {
      // you can add a more specific error message here
      router.push('/login');
      return null;
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.displayName || 'Anonymous User'}</h2>
              <p className="text-muted-foreground">{user.email || 'No email provided'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">User Information</h3>
            <div className="rounded-md border bg-muted/50 p-4 space-y-2 text-sm">
                <p><strong>User ID:</strong> {user.uid}</p>
                <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                <p><strong>Account Created:</strong> {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                 <p><strong>Last Sign In:</strong> {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">My Projects</h3>
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>You don&apos;t have any saved projects yet.</p>
                <Button variant="link" asChild className="mt-2">
                    <a href="/#create">Start creating your first song</a>
                </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
