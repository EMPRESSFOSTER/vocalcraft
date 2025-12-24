'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Music2, AlertCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';

import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleAuthAction = (action: 'signIn' | 'signUp') => {
    setError(null);
    const values = form.getValues();
    const validated = formSchema.safeParse(values);
    if (!validated.success) {
      form.trigger();
      return;
    }

    startTransition(async () => {
      try {
        const userCredential =
          action === 'signIn'
            ? await signInWithEmailAndPassword(auth, values.email, values.password)
            : await createUserWithEmailAndPassword(auth, values.email, values.password);

        if (userCredential.user) {
          router.push('/profile');
        }
      } catch (e: any) {
        handleAuthError(e);
      }
    });
  };

  const handleAnonymousSignIn = () => {
    setError(null);
    startTransition(async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        if (userCredential.user) {
          router.push('/profile');
        }
      } catch (e: any) {
        handleAuthError(e);
      }
    });
  };
  
  const handleAuthError = (e: any) => {
    switch (e.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        setError('Invalid email or password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        setError('An account with this email already exists.');
        break;
      case 'auth/weak-password':
        setError('The password is too weak. Please use at least 6 characters.');
        break;
      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;
      default:
        setError('An unexpected error occurred. Please try again.');
        break;
    }
  }


  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Music2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Welcome to VocalCraft AI</CardTitle>
          <CardDescription>Sign in or create an account to start crafting your music.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <div className="py-6">
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Authentication Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <TabsContent value="signin" className="m-0 p-0">
                    <Button onClick={() => handleAuthAction('signIn')} disabled={isPending} className="w-full">
                      {isPending && <Loader2 className="animate-spin mr-2" />}
                      Sign In
                    </Button>
                  </TabsContent>
                  <TabsContent value="signup" className="m-0 p-0">
                    <Button onClick={() => handleAuthAction('signUp')} disabled={isPending} className="w-full">
                      {isPending && <Loader2 className="animate-spin mr-2" />}
                      Create Account
                    </Button>
                  </TabsContent>
                </form>
              </Form>
            </div>
          </Tabs>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
            Continue as Guest
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
