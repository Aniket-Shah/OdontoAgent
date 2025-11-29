import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = () => {
    console.log("Reset link sent to:", email);
    alert("Reset link sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px] p-4">
        <CardHeader className="text-center space-y-1">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-sm text-gray-500">
            Enter your email to receive reset link
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleReset}>
            Send Reset Link
          </Button>

          <div className="text-center text-sm text-gray-600">
            <Link to="/login">Back to Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
