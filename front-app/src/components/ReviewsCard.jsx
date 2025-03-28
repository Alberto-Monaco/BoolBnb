import { useEffect, useState } from "react";

export default function ReviewsCard({ reviews, toggle }) {
    // Stato per il caricamento
    const [loading, setLoading] = useState(true);
    const [clicked, setCliked] = useState({})


    useEffect(() => {
        // Quando le recensioni sono caricate, imposta lo stato di caricamento a false
        if (reviews && reviews.length > 0) {
            setLoading(false);
        }
    }, [reviews]);

    if (loading) {
        if (reviews.length == 0) {
            return <div>Nessuna recensione presente</div>
        }

        return <div>Caricamento recensioni...</div>;
    }

    function handletoggle(idTruncate, id) {

        document.getElementById(idTruncate).classList.toggle('text-truncate');
        setCliked((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Inverte lo stato corrente per l'id
        }));

    }

    return (
        reviews.map((review) => {
            const isClicked = clicked[review.id] || false
            return (
                <div className="col-sm-12 col-md-6 col-lg-4" key={review?.id}>
                    <div
                        className="card my-3 shadow"
                        onClick={() =>
                            handletoggle(`text-truncate-${review?.id}`, review?.id)
                        }
                    >

                        <div className="card-body d-flex flex-column justify-content-between">
                            <div
                                id={`text-truncate-${review.id}`}
                                className="fs-5 text-truncate w-100 mb-4"
                            >
                                {review.text_review}
                            </div>
                            <div>
                                <div>
                                    <span className="text-muted">
                                        Data recensione:{" "}
                                    </span>
                                    <span>{review.date_review?.slice(0, 10)}</span>
                                </div>
                                <span className="text-muted">Lasciata da: </span>
                                {review.name === "" || !review.name ? (
                                    <span>Guest</span>
                                ) : (
                                    <span>{review.name}</span>
                                )}
                                <div className="position-relative">
                                    <span className="text-muted">Notti: </span>
                                    {review.nights}
                                </div>
                                {review.text_review?.length > 45 && (
                                    <div className="position-absolute end-0 bottom-0 px-3 py-2">
                                        <i
                                            className={`bi ${isClicked
                                                ? "bi-caret-up"
                                                : "bi-caret-down"
                                                }`}
                                        ></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
        )
    )

}


