import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalContext } from '../Context/GlobalContext'
import Jumbotron from '../components/Jumbotron'

// Componente principale per l'aggiunta di nuove proprietà
export default function AddPropertiesPage() {
	// Estrazione dei parametri dall'URL e del contesto globale
	const { owner } = useParams()
	const { user, logged, setLogged } = useGlobalContext()

	// Verifica se l'utente è autorizzato a visualizzare la pagina
	useEffect(() => {
		if (owner && user.id) {
			if (owner === user.id) {
				setLogged(true)
			} else {
				setLogged(false)
			}
		}
	}, [owner, user.id, setLogged])

	// Oggetto che contiene i valori iniziali del form
	const initialFormData = {
		name: '',
		rooms: 0,
		beds: 0,
		bathrooms: 0,
		mq: 0,
		address: '',
		email_owners: '',
		image: null
	}
	const initialAddres = {
		a: '',
		b: '',
		c: '',
		d: ''
	}

	// Stati principali del componente
	const [formData, setFormData] = useState(initialFormData) // Gestisce i dati del form
	const [selectedFile, setSelectedFile] = useState(null) // Gestisce il file dell'immagine selezionata
	const [properties, setProperties] = useState([]) // Contiene tutte le proprietà
	const [filteredProperties, setFilteredProperties] = useState(properties) // Proprietà filtrate
	const [successMessage, setSuccessMessage] = useState('') // Messaggio di successo dopo il salvataggio
	const [showCard, setShowCard] = useState(false) // Aggiungi questo nuovo stato per tracciare quando mostrare la card
	const [savedData, setSavedData] = useState(null) // Aggiungi questo nuovo stato per i dati salvati
	const [address, setAddress] = useState(initialAddres)

	// Funzione per recuperare i dati delle proprietà dal server
	function fetchData(url = 'http://localhost:3000/api/properties') {
		fetch(url)
			.then((res) => res.json())
			.then((response) => {
				setProperties(response.data)
			})
			.catch((error) => {
				console.log('Error fetching data: ', error)
			})
	}
	useEffect(() => {
		fetchData()
	}, [])
	useEffect(() => {
		setFilteredProperties(properties)
	}, [properties])

	function formatAddres() {
		if (!address.a || !address.b || !address.c || !address.d) {
			alert('Per favore compila tutti i campi dell’indirizzo.');
			return '';
		}
		return `${address.a} ${address.b} ${address.c}, ${address.d}`;
	}
	// function handleAddres(e) {
	// 	const { name, value } = e.target
	// 	setAddress((prev) => ({
	// 		...prev,
	// 		[name]: value
	// 	}))


	// }

	// Gestisce i cambiamenti nei campi del form
	function handleFormField(e) {
		const { name, value } = e.target

		if (name === 'image' && e.target.files.length > 0) {
			const fileSelected = e.target.files[0]
			setSelectedFile(fileSelected)
			setFormData((prev) => ({
				...prev,
				image: fileSelected
			}))
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value
			}))
			setAddress((prev) => ({
				...prev,
				[name]: value
			}))
		}
	}

	// Gestisce l'invio del form
	function handleFormSubmit(e) {
		e.preventDefault()

		if (!formData.name) {
			alert('Per favore compila tutti i campi obbligatori');
			return;
		}

		const formattedAddress = formatAddres();
		if (!formattedAddress) {
			// Se l'indirizzo non è valido, interrompi l'esecuzione
			return alert('indirizzo non valido');
		}


		// Crea un FormData object per inviare anche il file
		const formDataToSend = new FormData()
		formDataToSend.append('name', formData.name)
		formDataToSend.append('rooms', formData.rooms)
		formDataToSend.append('beds', formData.beds)
		formDataToSend.append('bathrooms', formData.bathrooms)
		formDataToSend.append('mq', formData.mq)
		formDataToSend.append('address', formattedAddress);
		formDataToSend.append('email_owners', user.email)

		// Aggiungi l'immagine se presente
		if (selectedFile) {
			formDataToSend.append('image', selectedFile)
		}

		// Chiamata API per salvare i dati
		fetch(`http://localhost:3000/api/properties/${owner}`, {
			method: 'POST',
			body: formDataToSend
		})
			.then((res) => res.json())
			.then((response) => {
				setSuccessMessage('Proprietà inserita con successo!')

				// Crea l'oggetto con i dati salvati, includendo l'URL dell'immagine dal server
				setSavedData({
					name: formData.name,
					rooms: formData.rooms,
					beds: formData.beds,
					bathrooms: formData.bathrooms,
					mq: formData.mq,
					address: formattedAddress,
					email_owners: user.email,
					like: 0,
					image: response.imagePath // Usa l'URL dell'immagine restituito dal server
				})

				setShowCard(true)
				setFormData(initialFormData)
				setSelectedFile(null)

				setTimeout(() => {
					setSuccessMessage('')
				}, 5000)

				fetchData()
			})
			.catch((error) => console.log('Errore durante il salvataggio', error))

	}

	// Gestisce la visualizzazione delle proprietà nella console (funzione di debug)
	function showProperties() {
		console.log(properties)
	}

	//id, id_user, name, rooms(int), beds(int), bathrooms(int), mq(int), address, email_owners, like(int), image

	return (
		<>
			{/* Layout principale della pagina */}
			<Jumbotron title={'Aggiungi una nuova proprietà'} page='Dettails' />
			<div className="container py-3">
				{/* Sezione per i messaggi di feedback */}
				{successMessage && <div className="alert alert-success">{successMessage}</div>}

				{/* Card di anteprima della proprietà appena salvata */}
				{showCard && savedData && (
					<div className="card overflow-hidden shadow">
						<div className="row">
							<div className="col-4">
								<img
									src={savedData.image || 'https://placehold.co/300x250/EEE/31343C'}
									alt={savedData.name}
									className="card-img-top p-0"
									style={{ width: '100%', height: '300px', objectFit: 'cover' }}
									onError={(e) => {
										e.target.src = 'https://placehold.co/300x250/EEE/31343C'
									}}
								/>
							</div>
							<div className="col-8">
								<div className="card-title my-2">
									<h2>{savedData.name}</h2>
								</div>
								<div className="mt-5">
									<h3>Caratteristiche della proprietà:</h3>
									<div className="row mt-2 g-3">
										<div className="col-4">
											<strong>Stanze: </strong>
											<span>{savedData.rooms}</span>
										</div>
										<div className="col-4">
											<strong>Letti: </strong>
											<span>{savedData.beds}</span>
										</div>
										<div className="col-4">
											<strong>Bagni: </strong>
											<span>{savedData.bathrooms}</span>
										</div>
										<div className="col-4">
											<i className="bi bi-rulers"> </i>
											{savedData.mq}
										</div>
										<div className="col-4">
											<i className="bi bi-geo-alt"> </i>
											{savedData.address}
										</div>

										<div className="col-4">
											<i className="bi bi-envelope"> </i>
											{savedData.email_owners}
										</div>
										<div className="col-4">
											<i className="bi bi-heart"> </i>
											{savedData.like}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Contenitore del form */}

				{/* Form per l'inserimento della proprietà */}
				<div className="mt-3 mx-auto p-3 border border-primary-subtle rounded shadow col-lg-8 col-xl-6">
					<h3 className="mb-2 text-center">Compila il form</h3>
					{logged ? (
						<form className="my-3 rounded p-4" onSubmit={handleFormSubmit}>
							<div className="form-group">
								<div className="form-group mb-3">
									<label htmlFor="name">Nome Proprietà:</label>
									<input
										className="form-control"
										type="text"
										id="name"
										name="name"
										placeholder="Inserisci il nome della proprietà"
										required
										minLength={3}
										maxLength={100}
										value={formData.name}
										onChange={handleFormField}
									/>
								</div>

								<div className="row mb-3">
									<div className="form-group">
										<label htmlFor="image" className="form-label">
											Carica una foto della proprietà:
										</label>
										<div className="input-group">
											<input
												className="form-control"
												type="file"
												id="image"
												name="image"
												accept="image/*"
												onChange={handleFormField}
											/>
											<label className="input-group-text" htmlFor="image">
												<i className="bi bi-image"></i>
											</label>
										</div>
										{selectedFile && (
											<div className="mt-2">
												<div className="d-flex justify-content-between align-items-center">
													<p className="text-muted small mb-0">Anteprima:</p>
													<button
														type="button"
														className="btn btn-sm btn-outline-danger"
														onClick={() => {
															setSelectedFile(null)
															setFormData((prev) => ({ ...prev, image: null }))
														}}>
														<i className="bi bi-trash"></i> <span className='d-none d-md-inline'>Rimuovi immagine</span>
													</button>
												</div>
												<img
													src={URL.createObjectURL(selectedFile)}
													alt="Anteprima"
													className="img-fluid mt-2 rounded"
													style={{ maxHeight: '200px' }}
												/>
											</div>
										)}
									</div>
								</div>

								<div className="row justify-content-between">

									<div className="mb-3 col-12 col-md-2 h-100">
										<label htmlFor="rooms" className="form-label"><span className='d-none d-md-inline'>Numero</span> Stanze:</label>
										<input
											type="number"
											className="form-control"
											id="rooms"
											name="rooms"
											required
											min={1}
											max={100}
											value={formData.rooms}
											onChange={handleFormField}
										/>
									</div>
									<div className="mb-3 col-12 col-md-2 h-100">
										<label htmlFor="beds" className="form-label"><span className='d-none d-md-inline'>Numero</span> Letti:</label>
										<input
											type="number"
											className="form-control"
											id="beds"
											name="beds"
											required
											min={1}
											max={100}
											value={formData.beds}
											onChange={handleFormField}
										/>
									</div>
									<div className="mb-3 col-12 col-md-2 h-100">
										<label htmlFor="bathrooms" className="form-label"><span className='d-none d-md-inline'>Numero</span> Bagni:</label>
										<input
											type="number"
											className="form-control"
											id="bathrooms"
											name="bathrooms"
											required
											min={1}
											max={100}
											value={formData.bathrooms}
											onChange={handleFormField}
										/>
									</div>
									<div className="mb-3 col-12 col-md-2 h-100">
										<label htmlFor="mq" className="form-label"><span className='d-none d-md-inline'>Superficie in</span> Mq:</label>
										<input
											type="number"
											className="form-control"
											id="mq"
											name="mq"
											required
											min={1}
											max={1000}
											value={formData.mq}
											onChange={handleFormField}
										/>
									</div>


								</div>

								<div className="form-group mb-3">
									<label className="form-label" htmlFor="address">
										<span className='d-none d-md-inline'>Indirizzo</span> Proprietà:
									</label>
									<div className='d-flex flex-column flex-md-row justify-content-between mb-3'>
										<div className='col-12 col-md-2 mb-3'>

											<label className="form-label" htmlFor="address">
												Via...
											</label>
											<select className='form-control' name="a" id="a" value={address.a}
												onChange={handleFormField}>
												<option value="none">--</option>
												<option value="Via">Via</option>
												<option value="Viale">Viale</option>
												<option value="Piazza">Piazza</option>
												<option value="Privata">Privata</option>
											</select>
										</div>

										<div className='col-12 col-md-5 mb-3'>
											<label className="form-label" htmlFor="address">
												indirizzo
											</label>
											<input type="text" placeholder='indirizzo' name="b" id="b" className='form-control' value={address.b} onChange={handleFormField} />

										</div>
										<div className='col-12 col-md-2 d-flex flex-column mb-3'>

											<label className="form-label" htmlFor="address">
												n. Civico
											</label>
											<input type="number" min={0} placeholder='Nc' name="c" id="c" className='form-control d-flex justify-content-end' value={address.c} onChange={handleFormField} />
										</div>

									</div>
									<label className="form-label" htmlFor="address">
										Città:
									</label>
									<input type="text" placeholder='città' name="d" id="d" className='form-control' value={address.d} onChange={handleFormField} />
								</div>
								<button className="btn btn-primary w-100 my-3" type="submit" id="formSubmit" name="submit">
									<span>Salva</span> <i className="bi bi-cloud-arrow-up" />
								</button>
							</div>
						</form>
					) : (
						<h5 className="bg-danger text-warning">Non puoi farlo!</h5>
					)}
				</div>

			</div>
		</>
	)
}
