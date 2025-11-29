import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;

        if (!emailRegex.test(email)) {
            alert("Invalid email address");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
            alert(data.message || data.detail || "Login failed");
            return;
            }

            navigate("/");
        } catch {
            alert("Server not reachable");
        }
        };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Welcome to Odonto Agent</h2>
          <p className="text-sm text-center text-gray-500">
            Login to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

            <Button
                className="w-full"
                disabled={!email || !password}
                onClick={loginHandler}
                >
            Login
            </Button>

          <div className="text-sm flex justify-between text-gray-600">
            <Link to="/signup">Create Account</Link>
            {/* <Link to="/forgot-password">Forgot Password?</Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
