## Features
- Swap between multiple Spotify playlists.
- Add user-requested Spotify tracks to the queue via channel point redemptions.

## Requirements
- Node.js (version 16+ recommended)
- A Twitch Affilate/Partner account (for channel point redemption) and registered application (https://dev.twitch.tv/)
- A Spotify developer application. (https://developer.spotify.com/)


## How to get

Twitch OAuth Token (Access Token): 
https://id.twitch.tv/oauth2/authorize?response_type=token&client_id <YOUR_CLIENT_ID>&redirect_uri=http://localhost&scope=chat:read+chat:write+channel:read:redemptions 
(replace <YOUR_CLIENT_ID> to the client ID Twitch gives you.)

Twitch User ID: https://www.streamweasels.com/tools/convert-twitch-username-%20to-user-id/

Spotify refresh token: https://github.com/alecchendev/spotify-refresh-token (use these scopes: https://i.imgur.com/wsx6Hlf.png)

### **Testing the Setup**
- Install the package locally or globally.
- Create a `.env` file with valid credentials.
- Run the command to verify it works as expected.

Let me know if you encounter any issues or need further assistance! 🚀


