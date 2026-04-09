import { Button } from "@/components/ui/button"

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-background py-32">
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h2 className="mb-8 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-6xl">
          Transformez l&apos;expérience{" "}
          <br />
          <span className="italic text-primary">de vos clients</span> dès
          aujourd&apos;hui.
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
          Rejoignez les établissements qui redéfinissent l&apos;avenir de
          l&apos;hôtellerie en Afrique et dans le monde.
        </p>
        <Button
          size="lg"
          className="px-12 py-6 text-lg shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1"
        >
          Demander une démo privée
        </Button>
      </div>

      <div className="absolute -bottom-48 -right-48 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-(--success)/5 blur-[100px]" />
    </section>
  )
}
