import { useGlobalContext } from '../Context/GlobalContext'
import { useEffect, useState } from 'react'

// Componente per visualizzare i dettagli di una proprietà
export default function DetailsCard({ property, services }) {
	const { handleLikeIncrement, fetchData } = useGlobalContext()
	const [likes, setLikes] = useState(property.like)
	useEffect(() => {
		fetchData()
	}, [likes])

	return (
		<>
			{/* Card principale con layout a griglia */}
			<div className="card overflow-hidden shadow">
				<div className="row">
					{/* Colonna sinistra con l'immagine */}
					<div className="col-12 col-md-12 col-lg-4">
						<img
							src={
								property?.image
									? `http://localhost:3000/uploads/${property.image}`
									: 'https://placehold.co/300x250/EEE/31343C'
							}
							alt={property?.name}
							className="card-img-top p-0"
							style={{ width: '100%', height: '305px', objectFit: 'cover' }}
							onError={(e) => {
								console.log('Errore caricamento immagine, uso placeholder')
								e.target.src = 'https://placehold.co/300x250/EEE/31343C'
								e.target.onerror = null // Previene loop infiniti
							}}
						/>
					</div>
					{/* Colonna destra con i dettagli */}
					<div className="col-md-12 col-lg-8">
						{/* Intestazione con il nome della proprietà */}
						<div className="card-title my-2 px-2">
							<h2>{property?.name}</h2>
						</div>
						{/* Griglia delle caratteristiche della proprietà */}
						<div className="mt-3 px-2">
							<h3>Caratteristiche della proprietà:</h3>
							<div className="row mt-2 g-3 ">
								<div className="col-6">
									<strong>Stanze: </strong>
									<span>{property?.rooms}</span>
								</div>
								<div className="col-6">
									<strong>Letti: </strong>
									<span>{property?.beds}</span>
								</div>
								<div className="col-6">
									<strong>Bagni: </strong>
									<span>{property?.bathrooms}</span>
								</div>
								<div className="col-6">
									<i className="bi bi-rulers"> </i>
									{property?.mq}
								</div>
								<div className="col-12 col-lg-6">
									<i className="bi bi-geo-alt"> </i>
									{property?.address}
								</div>
								<div className="col-12 col-lg-6">
									<i className="bi bi-envelope"> </i>
									{property?.email_owners}
								</div>
								<div className="col-12">
									<i className="bi bi-tools"> </i>
									{services.join(', ')}
								</div>
								<div className="col-6">
									<button
										onClick={() => handleLikeIncrement(property.slug)}
										className="position-absolute top-0 end-0 p-2 bg-white bg-opacity-25 custom-blur  border-0 rounded">
										<span style={{ fontSize: '1.2rem' }}>❤️ {property.like}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
