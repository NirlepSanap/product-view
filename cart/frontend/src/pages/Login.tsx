import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { login, TEST_CREDENTIALS, type LoginCredentials } from "utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: TEST_CREDENTIALS.username,
    password: TEST_CREDENTIALS.password,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    } else if (credentials.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const authData = await login(credentials);
      
      // Show success message with user name
      toast.success(`Welcome back, ${authData.firstName}!`, {
        description: "Login successful. Redirecting to dashboard...",
      });

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error("Authentication Failed", {
        description: errorMessage,
      });
      
      // Clear password on error for security
      setCredentials(prev => ({ ...prev, password: "" }));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Fill with demo credentials
  const fillDemoCredentials = () => {
    setCredentials(TEST_CREDENTIALS);
    setErrors({});
    toast.info("Demo credentials loaded", {
      description: "Ready to login with test account",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cyan-400/20 transform rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-600/10 transform -rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-pink-400/30 transform rotate-12"></div>
        <div className="absolute top-60 left-1/2 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-purple-600/10 transform -rotate-45"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl shadow-purple-500/25">
          <CardHeader className="space-y-4 text-center">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 transform rotate-45 rounded-sm"></div>
              <h1 className="text-2xl font-bold text-white tracking-wider">ViewCraft</h1>
            </div>
            
            <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 text-sm font-mono mx-auto">
              SECURE ACCESS
            </Badge>
            
            <CardTitle className="text-3xl font-black text-white">
              SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">LOGIN</span>
            </CardTitle>
            
            <CardDescription className="text-slate-300">
              Enter your credentials to access the ViewCraft platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200 font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 ${
                    errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-red-400 text-sm font-medium">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200 font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 ${
                    errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm font-medium">{errors.password}</p>
                )}
              </div>

              {/* Demo Credentials Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={fillDemoCredentials}
                className="w-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30 font-mono text-sm"
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Load Demo Credentials
              </Button>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access System
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </Button>
            </form>

            {/* Back to Home */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-300 text-sm"
                disabled={isLoading}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm font-mono">
            Demo: {TEST_CREDENTIALS.username} / {TEST_CREDENTIALS.password}
          </p>
        </div>
      </div>

      {/* Footer accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
    </div>
  );
}