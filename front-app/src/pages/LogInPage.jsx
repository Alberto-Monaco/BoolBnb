import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Context/GlobalContext'
import { useState } from 'react'
import Jumbotron from '../components/Jumbotron'
export default function LogInPage() {
    const [errorLog, setErrorLog] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { user, setUser } = useGlobalContext()
    const navigate = useNavigate() // Aggiungi useNavigate per il redirect
    const urlLogIn = 'http://localhost:3000/api/user/logIn'

    function HandleUser(e) {
        e.preventDefault()
        const formLogIn = {
            email,
            password
        }

        fetch(urlLogIn, {
            method: 'POST',
            body: JSON.stringify(formLogIn),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.user) {
                    setUser(data.user)
                    setErrorLog(null)

                    // Dopo il login, fai il redirect alla homepage
                    navigate('/') // Redirige alla homepage
                } else {
                    setErrorLog(data?.error)
                }
            })
            .catch((err) => console.error(err))
    }


    return (
        <>
            <div className="d-flex justify-content-center  text-md-start ">
                <div className="col-8 col-sm-6 col-lg-4 col-xl-3">
                    <h2 className="mb-4">Effettua il log in:</h2>
                    <form onSubmit={HandleUser}>
                        {errorLog && <div className="bg-danger p-2 mb-2 text-light rounded text-center">{errorLog}</div>}
                        <label htmlFor="email" className='form-label'>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-3"
                        />
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-control mb-5"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="text-center">
                            {!user?.id ? (
                                <button type="submit" className="btn btn-primary">
                                    LOG IN
                                </button>
                            ) : (
                                <Link to={`/add/properties/${user.id}`} className="btn btn-primary">
                                    Aggiungi proprietà
                                </Link>
                            )}
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <small>
                            Non hai un account? <Link to="/registration">Registrati qui</Link>
                        </small>
                    </div>
                </div>
            </div>
        </>
    );

}
