import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePromoCodeMutation = ({
  applyPromoCode,
  removePromoCode,
}: {
  applyPromoCode: (data: any) => void;
  removePromoCode: () => void;
}) => {
  return useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      applyPromoCode(data);
      toast.success(`Promo "${data.code}" applied successfully`);
    },
    onError: (error: any) => {
      removePromoCode();
      toast.error(error.message || "Failed to apply promo code");
    },
  });
};
