// Static example data used while the backend/database is not ready.
// You can later remove this and switch MoviesView back to real API data.

export const exampleMovies = [
    {
        id: "m1",
        title: "Inception",
        description:
            "A skilled thief is given a chance at redemption if he can successfully perform inception: planting an idea in someone's subconscious.",
        director: "Christopher Nolan",
        releaseYear: 2010,
        genres: ["Sci-Fi", "Thriller"],
        averageRating: 4.8,
        reviewCount: 3,
    },
    {
        id: "m2",
        title: "The Shawshank Redemption",
        description:
            "Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.",
        director: "Frank Darabont",
        releaseYear: 1994,
        genres: ["Drama"],
        averageRating: 4.9,
        reviewCount: 2,
    },
    {
        id: "m3",
        title: "Spirited Away",
        description:
            "A young girl enters a magical world of spirits and must work in a bathhouse to free herself and her parents.",
        director: "Hayao Miyazaki",
        releaseYear: 2001,
        genres: ["Animation", "Fantasy"],
        averageRating: 4.7,
        reviewCount: 2,
    },
];

export const exampleReviewsByMovieId = {
    m1: [
        {
            id: "r1",
            reviewerName: "Alice",
            rating: 5,
            comment: "Mind-bending and emotional. A masterpiece.",
        },
        {
            id: "r2",
            reviewerName: "Bob",
            rating: 4,
            comment: "A bit confusing at first but very rewarding.",
        },
        {
            id: "r3",
            reviewerName: "Charlie",
            rating: 5,
            comment: "I notice something new every rewatch.",
        },
    ],
    m2: [
        {
            id: "r4",
            reviewerName: "Dana",
            rating: 5,
            comment: "One of the greatest films ever made.",
        },
        {
            id: "r5",
            reviewerName: "Eli",
            rating: 5,
            comment: "Powerful story and unforgettable characters.",
        },
    ],
    m3: [
        {
            id: "r6",
            reviewerName: "Faye",
            rating: 5,
            comment: "Magical and beautiful animation.",
        },
        {
            id: "r7",
            reviewerName: "George",
            rating: 4,
            comment: "Great world-building and atmosphere.",
        },
    ],
};
