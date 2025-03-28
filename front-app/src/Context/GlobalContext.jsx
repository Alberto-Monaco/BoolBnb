import { createContext, useContext, useEffect, useState } from "react"




const GlobalContext = createContext()

function GlobalContextProvider({ children }) {
    const [user, setUser] = useState('Guest')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [logged, setLogged] = useState(false)
    const [services, setServices] = useState([])
    const [properties, setProperties] = useState([])
    const [reviews, setReviews] = useState([])
    const [property, setProperty] = useState({})
    const [like, setLike] = useState('')
    const [rooms, setRooms] = useState('')
    const [beds, setBeds] = useState('');
    const [destination, setDestination] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [mq, setMq] = useState('');
    const [page, setPage] = useState('')
    const [send, setSend] = useState('')








    // const urlreviews = `http://localhost:3000/api/${id}/reviews`

    const urlIndex = 'http://localhost:3000/api/properties'



    // Recuperare user e logged dallo localStorage
    useEffect(() => {
        const user = localStorage.getItem('user')

        const logIn = localStorage.getItem('logged')


        if (user) {
            setUser(user)
        }

        if (logIn === 'true') {  // Verifica che logIn sia 'true' (memorizzato come stringa)
            setLogged(true)
        } else {
            setLogged(false)
        }

        setLoading(false) // Una volta caricati i dati, settiamo loading a false
    }, [])

    // Salvataggio di user e logged su localStorage ogni volta che cambiano
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', user)
        } else {
            localStorage.removeItem('user')
        }

        if (logged) {
            localStorage.setItem('logged', 'true') // Memorizza 'true' come stringa
        } else {
            localStorage.removeItem('logged')
        }
    }, [user, logged])

    async function fetchData() {
        try {
            const response = await fetch(urlIndex)
            if (!response.ok) {
                throw new Error('Failed to fetch properties')
            }
            const data = await response.json()
            // Aggiorna lo stato con i dati ricevuti
            setProperties(data?.data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function fetchReviews(urlreviews) {

        try {
            const res = await fetch(urlreviews)
            const data = await res.json()
            setReviews(data.reviews)
        } catch (err) {
            console.error(err)
        }
    }

    async function fetchDataShow(urlShow) {

        try {
            const propertyRes = await fetch(urlShow)
            const propertyData = await propertyRes.json()
            setProperty(propertyData.property)
            setServices(propertyData.property.services)
            setLike(propertyData.property.like)
        } catch (err) {
            console.error(err)
        }

        setLoading(false)
    }



    async function handleLikeIncrement(propertyId) {
        try {
            const response = await fetch(`http://localhost:3000/api/like/${propertyId}`, {
                method: 'PUT',
            });

            if (response.ok) {
                const data = await response.json()
                console.log(data.likes);
                setLike(data.likes)

                // Ricarica tutti i dati dopo l'aggiornamento del like
                fetchData();
            } else {
                console.error('Errore nella risposta:', response.statusText);
            }
        } catch (err) {
            console.error('Errore durante l\'aggiornamento del like:', err);
        }
    }




    const values = {
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        logged,
        setLogged,
        services,
        setServices,
        handleLikeIncrement,
        fetchData,
        properties,
        setProperties,
        reviews,
        setReviews,
        fetchReviews,
        fetchDataShow,
        property,
        setProperty,
        like, setLike,
        rooms, setRooms,
        destination, setDestination,
        bathrooms, setBathrooms,
        mq, setMq,
        beds, setBeds,
        page, setPage,
        send, setSend
    }

    return (
        <GlobalContext.Provider value={values}>
            {children}
        </GlobalContext.Provider>
    )
}

function useGlobalContext() {
    return useContext(GlobalContext)
}

export { GlobalContextProvider, useGlobalContext }


