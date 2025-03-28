import Jumbotron from '../components/Jumbotron'
export default function Contact() {
	return (
		<>
			<div className="container">
				<Jumbotron title="Contattaci" className="mb-5" page='call' />
				<div className="row">
					<div className="ps-4 col-12">
						<p className=" fw-bold">Hai domande o suggerimenti? Siamo qui per aiutarti!</p>
						<p className=" fw-bold">Email: info@boolbnb.it | Telefono: +39 02 1234567</p>
					</div>
				</div>
			</div>
		</>
	)
}
