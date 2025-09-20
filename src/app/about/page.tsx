import Container from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <Container className="py-12 space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight">About Us</h1>
      <p className="max-w-3xl text-neutral-700">
        We are a modern furniture studio focused on functional, sustainable and
        timeless designs. Our team curates premium pieces and creates bespoke
        interiors for homes and offices.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-[#FAFAFA] p-6">
          <h3 className="font-semibold">Our Mission</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Bring quality design to everyday spaces.
          </p>
        </div>
        <div className="rounded-xl border bg-[#FAFAFA] p-6">
          <h3 className="font-semibold">Our Values</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Craftsmanship, simplicity, longevity.
          </p>
        </div>
        <div className="rounded-xl border bg-[#FAFAFA] p-6">
          <h3 className="font-semibold">Location</h3>
          <p className="mt-2 text-sm text-neutral-600">
            Serving clients worldwide.
          </p>
        </div>
      </div>
    </Container>
  );
}
