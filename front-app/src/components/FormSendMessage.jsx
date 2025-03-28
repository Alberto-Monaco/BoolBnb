import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useGlobalContext } from '../Context/GlobalContext'

export default function FormSendMessage({
	HandleinputToggle,
	HandleSubMessage,
	emailUser,
	setEmailUser,
	textUser,
	setTextUser,
	fromName,
	setFromName,
	toName,
	setToName,
}) {
	const { property } = useGlobalContext()
	const [send, setSend] = useState('')
	const form = useRef()

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!fromName || !emailUser || !textUser) {
			alert('Per favore compila tutti i campi')
			return
		}

		if (fromName.length < 3 || fromName.length > 50) {
			alert('Per favore compila con dati validi')
			return
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(emailUser) || emailUser.length > 255) {
			alert("Compila l'email in modo valido")
			return
		}

		if (textUser.length < 10 || textUser.length > 500) {
			alert('Il testo deve essere lungo tra i 10 e i 500 caratteri')
			return
		}

		// Parametri per il template per il destinatario
		const templateParamsToRecipient = {
			from_name: fromName,
			to_name: toName,
			user_email: emailUser,
			message: textUser
		}

		// Parametri per il template per il mittente (la tua email)
		const templateParamsToSender = {
			from_name: fromName,
			to_name: toName, // Qui potresti voler personalizzare
			user_email: emailUser,
			message: textUser
		}

		// Invio dell'email al destinatario (usando il template per il destinatario)
		emailjs
			.sendForm('service_o1o92us', 'template_zna5hon', form.current, {
				publicKey: 'mKOnhKruH3ZwuWqlH'
			})
			.then(
				(result) => {
					console.log('SUCCESS!', result.text)
					console.log('Messaggio inviato con successo al destinatario!')
					setSend(true)
					// alert('Messaggio inviato con successo!')
				},
				(error) => {
					console.log('FAILED...', error.text)
					console.log("Errore nell'invio del messaggio al destinatario")
				}
			)

		// Invio dell'email al mittente (usando il template per il mittente)
		emailjs
			.send('service_o1o92us', 'template_7duhytj', templateParamsToSender, {
				publicKey: 'mKOnhKruH3ZwuWqlH'
			})
			.then(
				(result) => {
					console.log('SUCCESS!', result.text)
					console.log(result);

					console.log('Messaggio inviato a te stesso!')
					// Reset dei campi
					setFromName('')
					setEmailUser('')
					setTextUser('')
					// setToName('')
				},
				(error) => {
					console.log('FAILED...', error.text)
					console.log("Errore nell'invio del messaggio a te stesso")
				}
			)
	}

	return (
		<div
			id="newMessage"
			className="d-none vw-100 vh-100 d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 bg-secondary bg-opacity-75">
			<button
				className="text-light position-absolute end-0 top-0 m-4 fs-3 btn d-sm-none"
				onClick={() => HandleinputToggle('newMessage', 'd-none')}>
				<i className="bi bi-x-circle"></i>
			</button>
			<div className="mt-5 rounded col-10 p-4 shadow position-relative" style={{ backgroundColor: '#29B6F6' }}>
				<button
					className="text-light position-absolute end-0 top-0 m-4 fs-3 btn d-none d-sm-block"
					onClick={() => HandleinputToggle('newMessage', 'd-none')}>
					<i className="bi bi-x-circle"></i>
				</button>
				{!send ?
					<>
						<h3 className="mb-4 text-light">Invia un messaggio</h3>
						<form ref={form} onSubmit={handleSubmit}>
							<label htmlFor="from_name" className="form-label text-light">
								Il tuo nome (mittente)
							</label>
							<input
								type="text"
								id="from_name"
								name="from_name"
								value={fromName}
								onChange={(e) => setFromName(e.target.value)}
								className="form-control mb-3"
								placeholder="Nome"
								required
							/>
							<label htmlFor="to_name" className="form-label text-light">
								Email destinatario
							</label>
							<input
								type="email"
								id="to_name"
								name="to_name"
								value={toName}
								readOnly
								className="form-control mb-3"
								placeholder="Inserisci l'email del destinatario"
								required
							/>
							<label htmlFor="email" className="form-label text-light">
								La tua email
							</label>
							<input
								type="email"
								id="email"
								name="user_email"
								value={emailUser}
								onChange={(e) => setEmailUser(e.target.value)}
								className="form-control mb-3"
								placeholder="Email"
								required
							/>
							<label htmlFor="message" className="form-label text-light">
								Messaggio:
							</label>
							<textarea
								rows="5"
								id="message"
								name="message"
								value={textUser}
								onChange={(e) => setTextUser(e.target.value)}
								className="form-control mb-3"
								placeholder="Inserisci il tuo messaggio"
								required
							/>
							<button className="btn btn-light" style={{ color: '#29B6F6' }} type="submit">
								<i className="bi bi-send-fill"></i> Invia!
							</button>
						</form>
					</>
					:
					<h3 className='text-light'>Messaggio inviato con successo! <i className="bi bi-emoji-laughing-fill"></i></h3>
				}

			</div>
		</div>
	)
}
