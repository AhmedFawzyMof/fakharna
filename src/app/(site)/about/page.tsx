import { Button } from "@/components/ui/button";
import { Leaf, Heart, Sparkles, Award, Users, Globe } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-balance">
            Crafted from Earth, Made into Art
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fakharna is a pottery brand rooted in tradition and shaped by hand.
            From raw clay to timeless pieces, we transform the earth into
            functional art for everyday living.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-secondary">
            <img
              src="/pottery-workshop.jpg"
              alt="Fakharna Pottery Workshop"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Our Story
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Fakharna was born from a deep appreciation for clay and the
                stories it carries. Inspired by generations of pottery
                craftsmanship, we set out to preserve this heritage while
                presenting it in a modern, refined form.
              </p>

              <p>
                Each piece is handmade by skilled artisans who shape, fire, and
                finish every item with patience and care. No molds, no shortcuts
                — just honest craftsmanship that gives every product its own
                character.
              </p>

              <p>
                From kitchens to living spaces, Fakharna pottery is designed to
                be used, cherished, and passed down — celebrating beauty in
                imperfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Our Values
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide every piece we create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            icon={<Leaf className="h-8 w-8" />}
            title="Natural Materials"
            text="We use high-quality natural clay, responsibly sourced and shaped without harmful additives."
          />

          <ValueCard
            icon={<Heart className="h-8 w-8" />}
            title="Handcrafted"
            text="Every item is made by hand, ensuring uniqueness and authenticity in every piece."
          />

          <ValueCard
            icon={<Sparkles className="h-8 w-8" />}
            title="Timeless Design"
            text="Our designs blend traditional pottery techniques with modern aesthetics."
          />

          <ValueCard
            icon={<Globe className="h-8 w-8" />}
            title="Sustainable"
            text="We respect the earth we create from, focusing on sustainable production practices."
          />

          <ValueCard
            icon={<Award className="h-8 w-8" />}
            title="Quality First"
            text="Each piece is carefully inspected to meet our standards for durability and finish."
          />

          <ValueCard
            icon={<Users className="h-8 w-8" />}
            title="Supporting Artisans"
            text="We proudly support local artisans and keep traditional pottery alive."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-secondary rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat value="10K+" label="Pottery Pieces Crafted" />
            <Stat value="100%" label="Handmade" />
            <Stat value="50+" label="Unique Designs" />
            <Stat value="5★" label="Customer Satisfaction" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            From Clay to Your Home
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Discover pottery shaped by hand, inspired by heritage, and made to
            last.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/products">Shop Collection</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent"
              asChild
            >
              <Link href="/search">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------ Components ------------------ */

function ValueCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center space-y-4 p-6 rounded-2xl bg-secondary/50">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-4xl md:text-5xl font-bold mb-2">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
