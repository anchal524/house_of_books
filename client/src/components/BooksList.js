import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
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
        height: "100%",
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

const BooksList = () => {
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [bookDetailsData, setBookDetailsData] = useState(undefined);
    let card = null;
    const history = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `http://localhost:4000/books`;
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

    const buildCard = (book) => {
        return (
            <Grid
                item
                xs={10}
                sm={7}
                md={5}
                lg={4}
                xl={3}
                height={45}
                key={book._id}
            >
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
                                                <dd>{book.price}</dd>
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
                        type='button'
                        className='button'
                        onClick={() =>
                            buyBook(
                                "627161da17f0455539944549",
                                book._id,
                                2,
                                book.price
                            )
                        }
                    >
                        Buy
                    </button>
                </Card>
            </Grid>
        );
    };

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
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

export default BooksList;
