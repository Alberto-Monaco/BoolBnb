import { Link } from 'react-router-dom'
import { useGlobalContext } from '../Context/GlobalContext'
import PropertyCard from '../components/PropertyCard'
import Jumbotron from '../components/Jumbotron'
import { useState } from 'react'

export default function Homepage() {
	const { user } = useGlobalContext() // Ottieni il contesto globale per verificare se l'utente è loggato
	const [searchText, setSearchText] = useState('') // Aggiungi questo stato

	// Funzione che gestisce la ricerca
	// Aggiorna lo stato searchText con il valore inserito dall'utente
	// Questo valore viene poi passato al componente PropertyCard per filtrare le proprietà
	const handleSearch = (value) => {
		setSearchText(value)
	}

	return (
		<>
			<div className="container py-3">
				{/* Contenitore per il pulsante "Aggiungi Proprietà" se l'utente è loggato */}
				{user !== 'Guest' && user?.id && (
					<div className="mb-3">
						<Link to={`/add/properties/${user.id}`} className="btn btn-primary">
							Aggiungi una nuova proprietà
						</Link>
					</div>
				)}
				{/* Componente Jumbotron che mostra il titolo e la barra di ricerca */}
				{/* <Jumbotron title={'Lista proprietà disponibili'} showSearch={true} onSearchChange={handleSearch} page='home' /> */}
				<Jumbotron title={'Lista proprietà disponibili'} page='home' />

				{/* Componente PropertyCard che mostra la lista delle proprietà filtrate in base al testo di ricerca */}
				<PropertyCard searchText={searchText} />
			</div>
		</>
	)
}
