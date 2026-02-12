import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export function CartItem({ item }: any) {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div key={item.id} className="bg-card rounded-3xl p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-secondary">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium leading-tight mb-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground">
                ج.م{item.price.toFixed(2)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => removeFromCart(item.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">ج.م{item.price.toFixed(2)}</span>

            <div className="flex items-center gap-2 bg-secondary rounded-full px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
