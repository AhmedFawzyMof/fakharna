"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!session) return;

    const callbackUrl = searchParams.get("callbackUrl");
    router.replace(callbackUrl || "/products");
  }, [session, searchParams, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: searchParams.get("callbackUrl") || "/products",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 rounded">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="border border-primary rounded"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal text-xs text-muted-foreground"
                >
                  نسيت كلمة المرور؟
                </Button>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                className="border border-primary rounded bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تسجيل الدخول
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-primary bg-card">
                أو المتابعة باستخدام
              </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            className="w-full rounded"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Google
          </Button>

          {/* Facebook Login */}
          <Button
            className="w-full rounded"
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
          >
            Facebook
          </Button>
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            ليس لديك حساب؟{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              <Link href="/register">إنشاء حساب</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
