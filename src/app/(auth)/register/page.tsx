"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (session) {
      router.push("/products");
    }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "حدث خطأ ما");
      }

      toast.success("تم إنشاء الحساب بنجاح!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "فشل إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 rounded">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">إنشاء حساب</CardTitle>
          <CardDescription>أدخل بياناتك لإنشاء حسابك</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="أحمد محمد"
                className="border border-primary rounded bg-white"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="border border-primary rounded bg-white"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                className="border border-primary rounded bg-white"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button
              className="w-full rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              إنشاء الحساب
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            لديك حساب بالفعل؟{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
