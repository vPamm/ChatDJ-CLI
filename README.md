# ChatDJ

A Twitch bot for managing Spotify playlists and handling song requests via channel point redemptions.

## Features

- **Swap Playlists**: Use a channel point redemption to cycle through multiple predefined Spotify playlists.
- **Song Requests**: Let viewers request songs by submitting Spotify links via channel point redemptions.

---

## Installation

### Prerequisites
- Node.js (version 16+ recommended)
- A Twitch Affilate/Partner account (for channel point redemption) and registered application (https://dev.twitch.tv/)
- A Spotify developer application. (https://developer.spotify.com/)


## How to get

Twitch OAuth Token (Access Token): 
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id <YOUR_CLIENT_ID>&redirect_uri=http://localhost&scope=chat:read+chat:write+channel:read:redemptions 
(replace <YOUR_CLIENT_ID> to the client ID Twitch gives you.)

Twitch User ID: https://www.streamweasels.com/tools/convert-twitch-username-%20to-user-id/

Spotify refresh token: https://github.com/alecchendev/spotify-refresh-token (use these scopes: https://i.imgur.com/wsx6Hlf.png)

---

### Using npm

1. **Install the package globally**:
   
   ```bash
   npm install -g chatdj
   ```

2. **Create a working directory**:

   ```bash
   mkdir twitch-bot
   cd twitch-bot
   ```

3. **Add a .env file**: Inside your working directory, create a `.env` file with the following contents:

   ```env
   BOT_NICK=your_bot_username
   CHANNEL_NAME=your_channel_name
   ACCESS_TOKEN=your_oauth_token
   USER_ID=your_twitch_user_id
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
   PLAYLIST_1_URI=spotify:playlist:your_first_playlist_uri
   PLAYLIST_2_URI=spotify:playlist:your_second_playlist_uri
   PLAYLIST_3_URI=spotify:playlist:your_third_playlist_uri
   SWAP_PLAYLISTS_REDEMPTION=Swap Playlists
   SONG_REQUEST_REDEMPTION=Song Request
   ```

4. **Run the bot**:

   ```bash
   chatdj
   ```

---

## Configuration

### Environment Variables

| Variable                    | Description                                              |
|-----------------------------|----------------------------------------------------------|
| `BOT_NICK`                  | Twitch bot username.                                     |
| `CHANNEL_NAME`              | Twitch channel name.                                     |
| `ACCESS_TOKEN`              | Twitch OAuth token with `chat:read`, `chat:write`, and `channel:read:redemptions` scopes. |
| `USER_ID`                   | Twitch user ID of the bot account.                       |
| `SPOTIFY_CLIENT_ID`         | Spotify Developer Application client ID.                 |
| `SPOTIFY_CLIENT_SECRET`     | Spotify Developer Application client secret.             |
| `SPOTIFY_REFRESH_TOKEN`     | Spotify refresh token for obtaining access tokens.       |
| `PLAYLIST_1_URI`            | Spotify URI for the first playlist.                      |
| `PLAYLIST_2_URI`            | Spotify URI for the second playlist.                     |
| `PLAYLIST_3_URI`            | (Optional) Spotify URI for the third playlist.           |
| `SWAP_PLAYLISTS_REDEMPTION` | Name of the channel point redemption for swapping playlists. |
| `SONG_REQUEST_REDEMPTION`   | Name of the channel point redemption for song requests.  |

---

## Development

### Local Installation

If you want to test or modify the bot locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/chatdj.git
   cd chatdj
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Add a `.env` file** with the required environment variables.

4. **Run the bot**:

   ```bash
   node music.js
   ```

---

## How It Works

### Swap Playlists

When a viewer redeems the channel point for swapping playlists, the bot cycles through the predefined playlist URIs in the `.env` file.

### Song Requests

When a viewer redeems the channel point for song requests, the bot adds the requested Spotify track (submitted as a link) to the Spotify queue.

---

## Contributing

1. **Fork the repository**.
2. **Create a feature branch**:
   
   ```bash
   git checkout -b feature-name
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Description of changes"
   ```

4. **Push the branch**:

   ```bash
   git push origin feature-name
   ```

5. **Open a Pull Request**.

---

## License

This project is licensed under the MIT License.
