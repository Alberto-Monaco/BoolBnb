import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const type = 'UP'
        const userData = { name, surname, userName, password, email, phone, type };
        console.log(userData);


        fetch("http://localhost:3000/api/user/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    navigate("/login"); // Redirect to login after successful registration
                }
            })
            .catch((err) => {
                console.error(err);
                setError("An error occurred. Please try again.");
            });
        console.log(userData);

    };

    return (
        <div className="d-flex justify-content-center">
            <div className="col-8 col-sm-6 col-lg-4 col-xl-3">
                <h2 className="mb-4">Registrati</h2>
                {error && <div className="bg-danger p-2 mb-2 text-light rounded text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="surname">Cognome</label>
                        <input
                            type="text"
                            id="surname"
                            className="form-control"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userName">Nome Utente</label>
                        <input
                            type="text"
                            id="userName"
                            className="form-control"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone">Telefono</label>
                        <input
                            type="text"
                            id="phone"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">
                            Registrati
                        </button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <small>
                        Hai già un account? <a href="/login">Accedi qui</a>
                    </small>
                </div>
            </div>
        </div>
    );
}
