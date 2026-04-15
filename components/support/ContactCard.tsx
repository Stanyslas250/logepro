
interface ContactCardProps {
  icon: string
  title: string
  description: string
  action: string
  onClick: () => void
  color?: "primary" | "tertiary" | "secondary"
}

export function ContactCard({
  icon,
  title,
  description,
  action,
  onClick,
  color = "primary",
}: ContactCardProps) {
  const getIconBg = () => {
    switch (color) {
      case "primary":
        return "bg-primary-fixed text-primary"
      case "tertiary":
        return "bg-tertiary-fixed text-tertiary"
      case "secondary":
        return "bg-secondary-fixed text-secondary"
      default:
        return "bg-primary-fixed text-primary"
    }
  }

  return (
    <div
      className="group bg-card p-8 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border-none cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-14 w-14 ${getIconBg()} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
        {description}
      </p>
      <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
        {action} <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  )
}
