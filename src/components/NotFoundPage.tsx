import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div>
        <h2>404 Not Found</h2>
        <Link to="/">Volver a la página de inicio</Link>
    </div>
  )
}