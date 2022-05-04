import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams, useNavigate} from "react-router-dom";
import noImage from "../img/download.jpeg";
import {
    makeStyles,
    Card,
    Grid,
    CardContent,
    CardMedia,
    Typography,
    CardHeader,
} from "@material-ui/core";
import "../App.css";
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 5,
        border: "1px solid #222",
        boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        color: "#222",
    },
    titleHead: {
        borderBottom: "1px solid #222",
        fontWeight: "bold",
        color: "#222",
        fontSize: "large",
    },
    grid: {
        flexGrow: 1,
        flexDirection: "row",
    },
    media: {
        height: "100%",
        width: "100%",
    },
    button: {
        color: "#222",
        fontWeight: "bold",
        fontSize: 12,
    },
});

const BookDetails = (props) => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    let {id} = useParams();
    const history = useNavigate();

    function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }
    function formatDate(date) {
        return [
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join("-");
    }

    function formatDateNextMonth(date) {
        return [
            padTo2Digits(date.getMonth() + 2),
            padTo2Digits(date.getDate()),
            date.getFullYear(),
        ].join("-");
    }

    function alertFunc(date) {
        alert(
            "Book has been rented. Please return it within 30 days. Your end date for return is " +
                date
        );
    }
    const buyBook = (customerId, bookId, quantity, price) => {
        let todayDate = formatDate(new Date());
        console.log(todayDate);
        console.log(customerId, bookId);
        let dataBody = {
            customerId: customerId,
            bookId: bookId,
            quantity: quantity,
            totalPrice: quantity * price,
        };
        axios
            .post("http://localhost:4000/books/purchase", {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                history("/", {replace: true}); //to be changed to cart
            });
    };

    const rentBook = (customerId, bookId) => {
        let todayDate = formatDate(new Date());
        let endDate = formatDateNextMonth(new Date());
        console.log(todayDate);
        let dataBody = {
            customerId: customerId,
            bookId: bookId,
            startDate: todayDate,
            endDate: endDate,
            rentedFlag: true,
        };
        axios
            .post("http://localhost:4000/library", {
                data: dataBody,
            })
            .then(function (response) {
                console.log(response.data);
                alertFunc(endDate);
                history("/", {replace: true}); //to be changed to cart
            });
    };

    useEffect(() => {
        console.log("useEffect fired");
        async function fetchData() {
            try {
                const url = `http://localhost:4000/books/${id}`;
                const {data} = await axios.get(url);
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div>
                {isNaN(bookDetailsData) ? (
                    <p>
                        <h1>Error 404: Page not found</h1>
                    </p>
                ) : (
                    <div>
                        <h2>Loading....</h2>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <Grid
                item
                xs={20}
                sm={11}
                md={5}
                lg={5}
                xl={9}
                key={bookDetailsData._id}
            >
                <Card className={classes.card} variant='outlined'>
                    <CardMedia
                        className={classes.media}
                        component='img'
                        image={
                            bookDetailsData.url ? bookDetailsData.url : noImage
                        }
                        title='book image'
                    />

                    <CardContent>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            component='span'
                        >
                            <p className='title1'>{bookDetailsData.title}</p>
                            <dl>
                                <p>
                                    <dt className='title'>Description:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.description ? (
                                        <dd>{bookDetailsData.description}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Author:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.author ? (
                                        <dd>{bookDetailsData.author}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>ISBN:</dt>
                                    {bookDetailsData && bookDetailsData.ISBN ? (
                                        <dd>{bookDetailsData.ISBN}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Average Rating:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.averageRating ? (
                                        <dd>{bookDetailsData.averageRating}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Publisher:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.publisher ? (
                                        <dd>{bookDetailsData.publisher}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Genre:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.genre ? (
                                        <dd>{bookDetailsData.genre}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Number of pages:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.numberofPages ? (
                                        <dd>{bookDetailsData.numberofPages}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>
                                        Original Publication Year:
                                    </dt>
                                    {bookDetailsData &&
                                    bookDetailsData.originalPublicationYear ? (
                                        <dd>
                                            {
                                                bookDetailsData.originalPublicationYear
                                            }
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Price:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.price ? (
                                        <dd>$ {bookDetailsData.price}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Year Published:</dt>
                                    {bookDetailsData &&
                                    bookDetailsData.yearPublished ? (
                                        <dd>{bookDetailsData.yearPublished}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                            </dl>
                        </Typography>
                    </CardContent>
                    <button
                        type='button'
                        className='button'
                        onClick={() =>
                            buyBook(
                                "627161da17f0455539944549",
                                bookDetailsData._id,
                                2,
                                bookDetailsData.price
                            )
                        }
                    >
                        Buy
                    </button>
                    <br></br>
                    <br></br>
                    <button
                        className='button'
                        onClick={() =>
                            rentBook(
                                "627161da17f0455539944549",
                                bookDetailsData._id
                            )
                        }
                    >
                        Rent
                    </button>
                </Card>
            </Grid>
        );
    }
};

export default BookDetails;
