import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Context/GlobalContext' // Assicurati di avere il context

export default function AppHeader() {
	const { user, setUser, setLogged } = useGlobalContext() // Usa il context per recuperare l'utente loggato
	const navigate = useNavigate() // Per fare il redirect

	// Funzione di logout
	const handleLogout = () => {
		setUser('Guest') // Resetta l'utente nel contesto
		setLogged(false)
		localStorage.removeItem('user') // Rimuovi l'utente dal localStorage
		navigate('/') // Redirigi alla homepage
	}

	return (
		<header className=" py-1 " style={{ backgroundColor: '#29B6F6' }}>
			<div className="container d-flex justify-content-between align-items-center">
				<div className="d-flex align-items-center">
					<NavLink to="/" className="text-white text-decoration-none">
						<img className="logo mw-100" src="/logo.png" alt="Logo" />
					</NavLink>
				</div>

				<nav className="d-flex">
					<ul className="list-unstyled d-flex gap-4 mb-0">
						<li>
							<NavLink to="/" className=" text-decoration-none fs-6 d-none d-md-block">
								Home
							</NavLink>
							<NavLink to="/" className="text-decoration-none fs-6 d-md-none">
								<i className="bi bi-house-door-fill"></i>
							</NavLink>
						</li>
						<li>
							<NavLink to="/search" className="text-decoration-none fs-6 d-none d-md-block">
								Ricerca avanzata
							</NavLink>
							<NavLink to="/search" className="text-decoration-none fs-6 d-md-none">
								<i className="bi bi-search"></i>
							</NavLink>
						</li>
						<li>
							<NavLink to="/about" className="text-decoration-none fs-6 d-none d-md-block">
								Chi Siamo
							</NavLink>
							<NavLink to="/about" className="text-decoration-none fs-6 d-md-none">
								<i className="bi bi-people-fill"></i>
							</NavLink>
						</li>
						<li>
							<NavLink to="/contact" className="text-decoration-none fs-6 d-none d-md-block">
								Contatti
							</NavLink>
							<NavLink to="/contact" className="text-decoration-none fs-6 d-md-none">
								<i className="bi bi-headset"></i>
							</NavLink>
						</li>

						{/* Mostra il nome dell'utente e il pulsante di logout se l'utente è loggato */}
						{user !== 'Guest' ? (
							<>
								<li className="d-none d-sm-block">
									<div className="text-white fs-6 me-1 ">
										<span className="d-none d-md-inline ">USER: </span>

										<span className='d-none d-sm-inline'>{user.user_name}</span>

									</div>
								</li>
								<li>
									<button onClick={handleLogout} className="btn btn-danger btn-sm fs-6 d-none d-md-block">
										Logout
									</button>
									<button onClick={handleLogout} className="btn btn-danger btn-sm fs-6 d-md-none">
										<i className="bi bi-box-arrow-left"></i>
									</button>
								</li>
							</>
						) : (
							<li>
								<Link to="/login" className="btn btn-success btn-sm fs-6 d-none d-md-block">
									Login
								</Link>
								<Link
									to="/login"
									className="bg-success text-decoration-none text-light py-1 px-2 rounded  fs-6 d-md-none text-center">
									<i className="bi bi-box-arrow-in-right"></i>
								</Link>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	)
}
