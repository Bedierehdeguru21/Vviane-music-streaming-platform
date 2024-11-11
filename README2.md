# Music Platform Database

This repository contains the database schema for a music streaming platform built with PostgreSQL.

## Database Structure

The database consists of the following tables:
- Users: Store user information and authentication details
- Artists: Manage artist profiles and information
- Albums: Store album details
- Songs: Manage individual song entries
- Playlists: Handle user-created playlists
- Playlist Songs: Junction table for playlist-song relationships
- User Favorites: Track user's favorite songs
- Blog Posts: Manage blog content
- Payment Transactions: Handle payment records

## Schema Details

The complete schema can be found in `db/schema.sql`

## Setup Instructions

1. Install PostgreSQL
2. Create a new database
3. Run the schema file using psql or pgAdmin

## Tables Description

### Users
- Stores basic user information
- Handles authentication
- Tracks premium status

### Artists
- Stores artist information
- Links to songs and albums

[Continue with other tables...]
