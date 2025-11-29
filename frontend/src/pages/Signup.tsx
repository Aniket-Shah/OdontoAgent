import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const registerHandler = async () => {

  if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
    alert("All fields are required");
    return;
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(form.email)) {
    alert("Invalid email format");
    return;
  }

  if (!/^\d{10,15}$/.test(form.phone)) {
    alert("Phone must be 10-15 digits");
    return;
  }

  if (form.password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  if (form.password !== form.confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (!res.ok) {
        if (data.detail)
            alert(data.detail);
        else
            alert(data.message);
      return;
    }

    alert("Registration successful!");
    navigate("/login");
  } catch (err) {
    // alert("Server not reachable");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <p className="text-sm text-center text-gray-500">
            Fill details to register
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="Your name"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              placeholder="9876543210"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="**********"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              name="confirm"
              type="password"
              placeholder="**********"
              onChange={handleChange}
            />
          </div>

          <Button className="w-full"
                    disabled={
                    !form.name || !form.email || !form.phone ||
                    !form.password || !form.confirm
                    }
                    onClick={registerHandler}>
            Register
            </Button>

          <div className="text-sm text-center text-gray-600">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
