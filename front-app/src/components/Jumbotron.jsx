// Componente Jumbotron che mostra un banner con titolo, sottotitolo opzionale e barra di ricerca

export default function Jumbotron({ title, subtitle, className = '', showSearch = false, onSearchChange, page }) {
	console.log(page);

	return (
		// Container principale del banner con stile bootstrap
		<div className={`banner text-white p-5 mb-3 rounded shadow-lg ${className} jumbotron-bg-${page || 'default'}`}>
			<div className="container">
				{/* Titolo principale */}
				<h3 className="d-inline-block bg-opacity-25 custom-blur py-1 px-2 border-0 rounded">{title}</h3>

				{/* Sottotitolo mostrato solo se presente */}
				{subtitle && <p className="lead mt-3">{subtitle}</p>}

				{/* Barra di ricerca mostrata solo se showSearch è true */}
				{showSearch && (
					<div className="mt-4">
						{/* Input di ricerca che chiama onSearchChange quando modificato */}
						<input
							type="search"
							className="form-control"
							placeholder="Cerca per nome o indirizzo..."
							onChange={(e) => onSearchChange(e.target.value)}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
