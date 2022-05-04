import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams, useNavigate} from "react-router-dom";
import noImage from "../img/download.jpeg";
import {
    makeStyles,
    Card,
    CardActionArea,
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

const Library = (props) => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    let {id} = useParams();
    let card = null;
    const history = useNavigate();

    useEffect(() => {
        console.log("useEffect fired");
        async function fetchData() {
            try {
                const url = `http://localhost:4000/library`;
                const {data} = await axios.get(url);
                console.log(data);
                setBookDetailsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, []);

    function alertFunc(date) {
        alert(
            "Book has been rented. Please return it within 30 days. Your end date for return is " +
                date
        );
    }

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

    const buildCard = (book) => {
        return (
            <Grid item xs={10} sm={7} md={5} lg={4} xl={3} key={book._id}>
                <Card className={classes.card} variant='outlined'>
                    <CardActionArea>
                        <Link to={`/books/${book._id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={book.url ? book.url : noImage}
                                title='book image'
                            />

                            <CardContent>
                                <Typography
                                    variant='body2'
                                    color='textSecondary'
                                    component='span'
                                >
                                    <p className='title1'>{book.title}</p>
                                    <dl>
                                        <p>
                                            <dt className='title'>Genre:</dt>
                                            {book && book.genre ? (
                                                <dd>{book.genre}</dd>
                                            ) : (
                                                <dd>N/A</dd>
                                            )}
                                        </p>
                                        <p>
                                            <dt className='title'>Price:</dt>
                                            {book && book.price ? (
                                                <dd>$ {book.price}</dd>
                                            ) : (
                                                <dd>N/A</dd>
                                            )}
                                        </p>
                                    </dl>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                    <button
                        className='button'
                        onClick={() =>
                            rentBook("627161da17f0455539944549", book._id)
                        }
                    >
                        Rent
                    </button>
                </Card>
            </Grid>
        );
    };

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
        card =
            bookDetailsData &&
            bookDetailsData.map((book) => {
                return buildCard(book);
            });
        return (
            <div>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
            </div>
        );
    }
};

export default Library;
