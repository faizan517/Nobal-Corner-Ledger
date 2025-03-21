
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api";
import { Fonts } from "@/utils/Font.jsx";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      userApi.login(credentials),
    onSuccess: (data) => {
      // Use the AuthContext login function instead of directly setting localStorage
      login(data.token, email);
      
      navigate("/dashboard");
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-gray-100 p-4">
      <Card className="w-full max-w-md glassmorphism">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight" style={{...Fonts.Poppins}}>
            Ledger Dashboard
          </CardTitle>
          <p className="text-sm text-muted-foreground" style={{...Fonts.Inter}}>
            Enter your credentials to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" style={{...Fonts.Poppins}}>
            <div className="space-y-2">
              <Input
                type="email"  // Change input type to email for better validation
                placeholder="Email"  // Change placeholder to reflect email
                value={email}  // Bind value to email state
                onChange={(e) => setEmail(e.target.value)}  // Update state on change
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-black text-white" style={{...Fonts.Poppins}} disabled={!email || !password}>
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
