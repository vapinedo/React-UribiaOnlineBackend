import 'animate.css';

export default function BoxShadow({children}) {
  return (
    <div className="box-shadow-layout animate__animated animate__fadeIn animate_faster">{children}</div>
  )
}