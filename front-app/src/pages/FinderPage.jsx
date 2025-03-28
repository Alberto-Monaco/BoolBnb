import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Jumbotron from '../components/Jumbotron';
import { useGlobalContext } from '../Context/GlobalContext';


export default function FinderPage() {
    const navigate = useNavigate();
    const { rooms, setRooms,
        destination, setDestination,
        bathrooms, setBathrooms,
        mq, setMq,
        beds, setBeds } = useGlobalContext()

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [queryUpdated, setQueryUpdated] = useState(false)


    useEffect(() => {
        const newRooms = searchParams.get('rooms') || '';
        const newBeds = searchParams.get('beds') || '';
        const newBathrooms = searchParams.get('bathrooms') || '';
        const newMq = searchParams.get('mq') || '';
        const newDestination = searchParams.get('location') || '';

        if (
            newRooms !== rooms ||
            newBeds !== beds ||
            newBathrooms !== bathrooms ||
            newMq !== mq ||
            newDestination !== destination
        ) {
            setRooms(newRooms);
            setBeds(newBeds);
            setBathrooms(newBathrooms);
            setMq(newMq);
            setDestination(newDestination);
        }
    }, [location.search]);

    useEffect(() => {
        // Costruisci l'URL della query per il backend
        const apiUrl = `http://127.0.0.1:3000/api/search?${searchParams.toString()}`;

        // Effettua la richiesta
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Errore durante il recupero dei dati');
                }
                return response.json();
            })
            .then((data) => {
                setProperties(data.properties); // Supponendo che il backend restituisca `properties`
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [location.search]);

    function handleSubmitResearch(e) {
        e.preventDefault()

        // Costruisce la query string dai parametri
        const queryParams = new URLSearchParams({
            rooms: rooms || '',
            beds: beds || '',
            bathrooms: bathrooms || '',
            mq: mq || '',
            location: destination || ''
        }).toString()

        const currentSearch = location.search.substring(1); // Rimuove il "?" iniziale
        if (currentSearch !== queryParams) {
            navigate(`/search/finder?${queryParams}`);
        }

        // Naviga alla URL con i parametri
    }
    if (loading) {
        return <p>Caricamento...</p>;
    }

    if (error) {
        return <p>Errore: {error}</p>;
    }
    function handletoggleSearch() {

        document.getElementById('form-search').classList.toggle('d-none');
        document.getElementById('more').classList.toggle('d-none');
        document.getElementById('less').classList.toggle('d-none');





    }

    return (
        <>
            <section className="container">
                <div className="container-fluid">
                    <Jumbotron title={'Spero tu abbia trovato ciò che cercavi'} page='search' />
                </div>
                <div className="container-fluid">
                    <div className="d-flex justify-content-between d-md-block">
                        <button className='btn btn-primary d-md-none' id='more' onClick={(e) => handletoggleSearch(e)}>Aggiorna <i className="bi bi-arrow-down-circle-fill"></i></button>
                        <button className='btn btn-primary d-none' id='less' onClick={(e) => handletoggleSearch(e)}><i className="bi bi-arrow-up-circle-fill"></i> Chiudi</button>

                    </div>
                    <form onSubmit={handleSubmitResearch} id='form-search' className="p-4 shadow-sm d-md-flex justify-content-between align-items-center d-none d-md-block">
                        <div className="mb-3 col-md-2">
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

                        <div className="mb-3 col-md-2">
                            <label htmlFor="minRooms" className="form-label">
                                Min. stanze
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

                        <div className="mb-3 col-md-2">
                            <label htmlFor="minBeds" className="form-label">
                                Min. letti
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
                        <div className="mb-3 col-md-2">
                            <label htmlFor="minBathrooms" className="form-label">
                                Min. Bagni
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
                        <div className="mb-3 col-md-2">
                            <label htmlFor="minmq" className="form-label">
                                Min. Mq
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

                        <div className="mt-3">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!beds && !rooms && !location && !mq && !bathrooms} // Disabilita se tutti i campi sono vuoti
                            >
                                Cerca
                            </button>

                        </div>
                    </form>
                    <h1 className={`text-${properties.length ? 'success' : 'danger'}`}>{properties.length} Risultati trovati </h1>
                    {properties.length > 0 ?
                        <div >
                            {properties.map(property =>



                                <div className="card overflow-hidden shadow mb-3" key={property?.id}>
                                    <div className="row">

                                        <div className="col-12 col-md-12 col-lg-4">
                                            <img
                                                src={`http://localhost:3000/uploads/${property.image}` || 'https://placehold.co/300x250/EEE/31343C'}
                                                alt={property.name}
                                                style={{ width: '100%', maxHeight: '270px' }}
                                                className="object-fit-cover"

                                            />
                                        </div>
                                        {/* Colonna destra con i dettagli */}
                                        <div className="col-md-12 col-lg-8">
                                            {/* Intestazione con il nome della proprietà */}
                                            <div className="card-title my-4 d-flex justify-content-between px-2 ">
                                                <h2>{property.name}</h2>
                                                <div className='px-2'>

                                                    <Link to={`/properties/${property.slug}`} className="text-decoration-none text-light btn btn-primary">Dettagli</Link>
                                                </div>
                                            </div>
                                            {/* Griglia delle caratteristiche della proprietà */}
                                            <div className="mt-3 px-2">
                                                <h3>Caratteristiche della proprietà:</h3>
                                                <div className="row mt-2 g-3 ">
                                                    <div className="col-6">
                                                        <strong>Stanze: </strong>
                                                        <span>{property.rooms}</span>
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Letti: </strong>
                                                        <span>{property.beds}</span>
                                                    </div>
                                                    <div className="col-6">
                                                        <strong>Bagni: </strong>
                                                        <span>{property.bathrooms}</span>
                                                    </div>
                                                    <div className="col-6">
                                                        <i className="bi bi-rulers"> </i>
                                                        {property.mq}
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <i className="bi bi-geo-alt"> </i>
                                                        {property.address}
                                                    </div>
                                                    <div className="col-12 col-lg-6">
                                                        <i className="bi bi-envelope"> </i>
                                                        {property.email_owners}
                                                    </div>
                                                    <div className="col-6 pb-2">
                                                        <i className="bi bi-heart-fill"> </i>
                                                        <span className='mb-2'> Likes: {property.like}
                                                        </span>
                                                    </div>
                                                    {/* <div className="col-4">
									<i className="bi bi-tools"> </i>
									{services.join(', ')}
								</div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div> : (
                            <Link to={'/search'} className='bg-danger btn text-light'><span>Mi spiace non abbiamo trovato nulla effettua una nuova ricerca</span> <i className="bi bi-emoji-frown-fill"></i></Link>
                        )}
                </div>

            </section>
        </>
    );
};

