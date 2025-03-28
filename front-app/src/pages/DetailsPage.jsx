import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DetailsCard from '../components/DetailsCard'
import ReviewsCard from '../components/ReviewsCard'
import FormAddReview from '../components/FormAddReview'
import FormSendMessage from '../components/FormSendMessage'
import Jumbotron from '../components/Jumbotron'
import { useGlobalContext } from '../Context/GlobalContext'

export default function DetailsPage() {
	const { slug } = useParams()

	const { reviews, setReviews, fetchReviews, fetchDataShow, property, services, loading, like, user, send, setSend } =
		useGlobalContext()

	const [nameUser, setNameUser] = useState('')
	const [nights, setNights] = useState('')
	const [review, setReview] = useState('')
	const [emailUser, setEmailUser] = useState('') // Email dell'utente
	const [textUser, setTextUser] = useState('')
	const [toName, setToName] = useState('') // Email destinatario
	const [feedback, setFeedback] = useState('')
	const [showReviewForm, setShowReviewForm] = useState(true)



	const urlShow = `http://localhost:3000/api/properties/${slug}`
	const urlreviews = `http://localhost:3000/api/properties/${slug}/reviews`

	useEffect(() => {
		fetchReviews(urlreviews)
		fetchDataShow(urlShow)
		setToName(property.email_owners)
	}, [slug, like])

	useEffect(() => {
		fetchDataShow(urlShow)
	}, [slug])

	// Gestione invio messaggio
	const HandleSubMessage = async (e) => {
		e.preventDefault()

		const urlPostMessage = 'http://localhost:3000/api/message/send'

		const formMessage = {
			id_property: id,
			email: e.target.email.value, // Email dell'utente
			text_message: e.target.message.value,
			// Email destinatario fissa (email proprietario)
			recipient_email: toName || property.email_owners
		}

		// Controllo email e messaggio
		if (!formMessage.email || !formMessage.text_message) {
			return alert('Tutti i campi sono obbligatori')
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		if (!emailRegex.test(formMessage.email) || formMessage.email.length > 255) {
			return alert('Formato email non valido')
		}

		if (formMessage.text_message.length < 10 || formMessage.text_message.length > 1000) {
			return alert('Il messaggio deve essere tra 10 e 1000 caratteri')
		}

		try {
			const res = await fetch(urlPostMessage, {
				method: 'POST',
				body: JSON.stringify(formMessage),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const data = await res.json()
			console.log(data)
		} catch (err) {
			console.error(err)
		}

		setEmailUser('')
		setTextUser('')

		setToName('')
	}

	// Funzione per toggle visibilità modulo
	const HandleinputToggle = (item, style) => {
		document.getElementById(item).classList.toggle(style)
	}

	// Se i dati non sono ancora caricati, mostriamo il loading
	if (loading) {
		return <div>Loading...</div>
	}

	const HandleSubReview = async (e) => {
		e.preventDefault()

		const userName = e.target.name.value
		const urlPostReview = `http://localhost:3000/api/${slug}/${userName}/add-review`

		const formReview = {
			name: userName,
			text_review: e.target.review.value,
			nights: e.target.nights.value
		}
		if (!userName || !nights || !review) {
			return alert('Per favore compila tutti i campi obbligatori')
		}
		if (
			userName.length < 3 ||
			userName.length > 250 ||
			nights < 1 ||
			nights > 255 ||
			review.length < 10 ||
			review.length > 1000
		) {
			return alert('Per favore compila in base alle indicazioni del form')
		}

		try {
			const res = await fetch(urlPostReview, {
				method: 'POST',
				body: JSON.stringify(formReview),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const data = await res.json()
			console.log(data)

			setFeedback(data?.message)
			setReviews(data.reviews)
			setShowReviewForm(false)

			setTimeout(() => {
				setFeedback('')
			}, 3000)
		} catch (err) {
			console.error(err)
			setFeedback("Errore nell'invio della recensione")
		}

		setNameUser('')
		setNights('')
		setReview('')
	}



	return (
		<div>
			<div className="container position-relative">
				<div className="my-4 align-items-center">
					<Jumbotron title={property?.name} page='Dettails' />

					{property.email_owners !== user.email ? (
						<div>
							<button
								type="button"
								className="btn btn-primary"
								onClick={() => HandleinputToggle('newMessage', 'd-none')}>
								Invia un messaggio
							</button>
						</div>
					) : (
						<div className=" fs-5 badge text-bg-success">Sei il proprietario</div>
					)}
				</div>
			</div>

			<div className="container">
				<DetailsCard property={property} services={services} />

				<div className="reviews mt-5">
					<div className="fs-3">
						{reviews.length} <span className="fs-3">Recensioni</span>
					</div>

					<div className="row g-3">
						<ReviewsCard reviews={reviews} toggle={HandleinputToggle} />
						<div>{feedback && <div className="alert alert-success mt-3">{feedback}</div>}</div>
					</div>


					{property.email_owners !== user.email && showReviewForm && (
						<FormAddReview
							HandleSubReview={HandleSubReview}
							nameUser={nameUser}
							setNameUser={setNameUser}
							nights={nights}
							setNights={setNights}
							review={review}
							setReview={setReview}
						/>
					)}

				</div>
			</div>

			<FormSendMessage
				HandleinputToggle={HandleinputToggle}
				HandleSubMessage={HandleSubMessage}
				emailUser={emailUser} // Passa l'email dell'utente
				setEmailUser={setEmailUser}
				textUser={textUser}
				setTextUser={setTextUser}
				fromName={nameUser}
				setFromName={setNameUser}
				toName={toName} // Gestione dell'email destinatario
				setToName={setToName} // Funzione per impostare l'email destinatario
			/>
		</div>
	)
}
