-- Create Users table
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE
);

-- Create Artists table
CREATE TABLE artists (
    artist_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(255)
);

-- Create Album table
CREATE TABLE album (
    album_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    album_name VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    duration INTERVAL NOT NULL,
    cover_image_url VARCHAR(255) NOT NULL
);

-- Create Songs table
CREATE TABLE songs (
    song_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    song_title VARCHAR(150) NOT NULL,
    song_duration INTERVAL NOT NULL,
    album_id INTEGER REFERENCES album(album_id),
    artist_id INTEGER REFERENCES artists(artist_id),
    cover_image_url VARCHAR(255) NOT NULL,
    audio_url VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL
);

-- Create Playlists table
CREATE TABLE playlists (
    playlist_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE
);

-- Create Playlist Songs junction table
CREATE TABLE playlist_songs (
    playlist_id INTEGER REFERENCES playlists(playlist_id),
    song_id INTEGER REFERENCES songs(song_id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id)
);

-- Create User Favorites table
CREATE TABLE user_favorites (
    user_id INTEGER REFERENCES users(user_id),
    song_id INTEGER REFERENCES songs(song_id),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id)
);

-- Create Blog Posts table
CREATE TABLE blog_posts (
    post_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Create Payment Transactions table
CREATE TABLE payment_transactions (
    transaction_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(100) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50)
);
