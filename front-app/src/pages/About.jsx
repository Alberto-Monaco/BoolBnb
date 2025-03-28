import { useEffect, useState } from 'react'
import Jumbotron from '../components/Jumbotron'
import { useGlobalContext } from '../Context/GlobalContext'
export default function About() {


	return (
		<>
			<div className="container">

				<Jumbotron title="Chi siamo" className="mb-5" page='about' />

				<div className="row">
					<div className="ps-4 col-12">
						<p className=" fw-bold">
							BoolB&B è la tua piattaforma di fiducia per trovare e prenotare alloggi unici in tutta Italia.
						</p>
						<p className=" fw-bold">
							La nostra missione è connettere viaggiatori e host per creare esperienze indimenticabili.
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
