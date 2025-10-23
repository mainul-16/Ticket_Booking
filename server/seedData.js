import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/Movie.js';
import Show from './models/Show.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/Project`);
    } catch (error) {
        console.log(error.message);
    }
};

const sampleMovies = [
    {
        _id: "550",
        title: "Fight Club",
        overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdrop_path: "/87hTDiay2N2qWyX4D7cYjH5eJzB.jpg",
        release_date: "1999-10-15",
        original_language: "en",
        tagline: "Mischief. Mayhem. Soap.",
        genres: [
            { id: 18, name: "Drama" }
        ],
        casts: [
            { name: "Brad Pitt", profile_path: "/kc3M04QQAuZ9woUvH3Ju5T7ZqG5.jpg" },
            { name: "Edward Norton", profile_path: "/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg" }
        ],
        vote_average: 8.4,
        runtime: 139
    },
    {
        _id: "13",
        title: "Forrest Gump",
        overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.",
        poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        backdrop_path: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
        release_date: "1994-06-23",
        original_language: "en",
        tagline: "Life is like a box of chocolates... you never know what you're gonna get.",
        genres: [
            { id: 35, name: "Comedy" },
            { id: 18, name: "Drama" },
            { id: 10749, name: "Romance" }
        ],
        casts: [
            { name: "Tom Hanks", profile_path: "/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg" },
            { name: "Robin Wright", profile_path: "/rQMQYQUY9QxVppk8TCRSJvwaT1u.jpg" }
        ],
        vote_average: 8.5,
        runtime: 142
    },
    {
        _id: "238",
        title: "The Godfather",
        overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        release_date: "1972-03-14",
        original_language: "en",
        tagline: "An offer you can't refuse.",
        genres: [
            { id: 18, name: "Drama" },
            { id: 80, name: "Crime" }
        ],
        casts: [
            { name: "Marlon Brando", profile_path: "/fuTEPMsBtV1zE98ujPONbKiYDc2.jpg" },
            { name: "Al Pacino", profile_path: "/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg" }
        ],
        vote_average: 8.7,
        runtime: 175
    }
];

const sampleShows = [
    {
        movie: "550", // Fight Club
        showDateTime: new Date("2024-01-20T18:00:00"),
        showPrice: 12.99,
        occupiedSeats: {}
    },
    {
        movie: "550", // Fight Club
        showDateTime: new Date("2024-01-20T21:00:00"),
        showPrice: 12.99,
        occupiedSeats: {}
    },
    {
        movie: "13", // Forrest Gump
        showDateTime: new Date("2024-01-21T15:00:00"),
        showPrice: 10.99,
        occupiedSeats: {}
    },
    {
        movie: "13", // Forrest Gump
        showDateTime: new Date("2024-01-21T19:00:00"),
        showPrice: 10.99,
        occupiedSeats: {}
    },
    {
        movie: "238", // The Godfather
        showDateTime: new Date("2024-01-22T17:00:00"),
        showPrice: 14.99,
        occupiedSeats: {}
    },
    {
        movie: "238", // The Godfather
        showDateTime: new Date("2024-01-22T20:30:00"),
        showPrice: 14.99,
        occupiedSeats: {}
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        console.log("Clearing existing data...");
        await Movie.deleteMany({});
        await Show.deleteMany({});
        
        console.log("Adding sample movies...");
        await Movie.insertMany(sampleMovies);
        
        console.log("Adding sample shows...");
        await Show.insertMany(sampleShows);
        
        console.log("Database seeded successfully!");
        console.log(`Added ${sampleMovies.length} movies and ${sampleShows.length} shows`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
