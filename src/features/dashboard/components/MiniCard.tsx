interface MiniCardProps {
    title: string;
    data: string | number;
    icon: JSX.Element;
}

export default function MiniCard({ title, data, icon }: MiniCardProps) {
  return (
    <article className="mini-card animate__animated animate__fadeIn animate_faster">
        <header className="header">
            <h3 className="title">{title}</h3>
            <span className="icon">{icon}</span>
        </header>
        <h4>{data}</h4>
    </article>
  )
}