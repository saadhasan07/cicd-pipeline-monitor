import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-new";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { login, register, user, isLoading } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login(values);
  };

  // Handle register submission
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    await register(values);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column: Auth Forms */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-10 animate-fadeIn">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6 text-center gradient-text">
            CI/CD Pipeline Monitor
          </h1>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 overflow-hidden rounded-full shadow-md">
              <TabsTrigger value="login" className="font-medium py-2.5 button-hover-effect">Login</TabsTrigger>
              <TabsTrigger value="register" className="font-medium py-2.5 button-hover-effect">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="animate-slideInUp">
              <Card className="card-hover-effect border-t-4 border-t-primary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account to manage CI/CD pipelines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your username" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full py-6 rounded-lg font-medium text-md button-hover-effect animate-pulse-subtle" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="animate-slideInUp">
              <Card className="card-hover-effect border-t-4 border-t-secondary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                  <CardDescription>
                    Register to start managing your CI/CD pipelines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Full Name (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="transition-all duration-200 focus-within:scale-105">
                            <FormLabel className="font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Create a password" 
                                className="rounded-lg" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full py-6 rounded-lg font-medium text-md button-hover-effect animate-pulse-subtle"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Right Column: Hero/Info */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-10 gradient-bg text-white animate-fadeIn">
        <div className="max-w-md">
          <h2 className="text-5xl font-bold mb-6 animate-slideInUp">CI/CD Pipeline Monitor</h2>
          <p className="text-xl mb-8 opacity-90 animate-slideInUp" style={{animationDelay: "0.1s"}}>
            A powerful platform for monitoring and managing your CI/CD pipelines.
          </p>
          <ul className="space-y-6 mb-10">
            <li className="flex items-start animate-slideInUp" style={{animationDelay: "0.2s"}}>
              <div className="mr-3 mt-1 bg-white/20 rounded-full p-1.5 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span className="text-lg">Track deployments across environments</span>
            </li>
            <li className="flex items-start animate-slideInUp" style={{animationDelay: "0.3s"}}>
              <div className="mr-3 mt-1 bg-white/20 rounded-full p-1.5 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span className="text-lg">Monitor build statuses and metrics</span>
            </li>
            <li className="flex items-start animate-slideInUp" style={{animationDelay: "0.4s"}}>
              <div className="mr-3 mt-1 bg-white/20 rounded-full p-1.5 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span className="text-lg">Manage approvals for production deployments</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}