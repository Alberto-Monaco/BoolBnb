import { useEffect, useState } from 'react';
import Jumbotron from '../components/Jumbotron'
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../Context/GlobalContext';

export default function SearchPage() {


	const navigate = useNavigate();
	const { rooms, setRooms,
		destination, setDestination,
		bathrooms, setBathrooms,
		mq, setMq,
		beds, setBeds
	} = useGlobalContext()

	useEffect(() => {

		setBathrooms('')
		setDestination('')
		setRooms('')
		setMq('')
		setBeds('')
	}, [])


	function handleSubmitSearch(e) {
		e.preventDefault()

		// Costruisce la query string dai parametri
		const queryParams = new URLSearchParams({
			rooms: rooms || '',
			beds: beds || '',
			bathrooms: bathrooms || '',
			mq: mq || '',
			location: destination || ''
		}).toString()



		// Naviga alla URL con i parametri
		navigate(`/search/finder?${queryParams}`);
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<Jumbotron title="Cerca appartamenti" page='search' />

					<form onSubmit={handleSubmitSearch} className="card p-4 shadow-sm">
						<div className="mb-3">
							<label htmlFor="city" className="form-label">
								Località
							</label>
							<input
								type="text"
								id="city"
								className="form-control"
								placeholder="Inserisci la città..."
								value={destination}
								onChange={(e) => setDestination(e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="minRooms" className="form-label">
								Numero minimo di stanze
							</label>
							<input
								type="number"
								id="minRooms"
								className="form-control"
								min="1"
								placeholder="Es: 2"
								value={rooms}
								onChange={(e) => setRooms(e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<label htmlFor="minBeds" className="form-label">
								Numero minimo di letti
							</label>
							<input
								type="number"
								id="minBeds"
								className="form-control"
								min="1"
								placeholder="Es: 3"
								value={beds}
								onChange={(e) => setBeds(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="minBathrooms" className="form-label">
								Numero minimo di Bagni
							</label>
							<input
								type="number"
								id="minBathrooms"
								className="form-control"
								min="1"
								placeholder="Es: 1"
								value={bathrooms}
								onChange={(e) => setBathrooms(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="minmq" className="form-label">
								Numero minimo di Mq
							</label>
							<input
								type="number"
								id="minmq"
								className="form-control"
								min="1"
								placeholder="Es: 1"
								value={mq}
								onChange={(e) => setMq(e.target.value)}
							/>
						</div>

						<div className="d-flex justify-content-start">
							<button
								type="submit"
								className="btn btn-primary px-4 py-2"
								disabled={!beds && !rooms && !location && !mq && !bathrooms} // Disabilita se tutti i campi sono vuoti
							>
								Cerca
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
