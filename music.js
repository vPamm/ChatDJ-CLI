#!/usr/bin/env node
require('dotenv').config();
const WebSocket = require('ws');
const SpotifyWebApi = require('spotify-web-api-node');
const tmi = require('tmi.js');

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
});

// Load environment variables
const BOT_NICK = process.env.BOT_NICK;
const CHANNEL_NAME = process.env.CHANNEL_NAME;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Twitch OAuth token
const USER_ID = process.env.USER_ID; // Twitch User ID
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN; // Spotify refresh token
const SWAP_PLAYLISTS_REDEMPTION = process.env.SWAP_PLAYLISTS_REDEMPTION;
const SONG_REQUEST_REDEMPTION = process.env.SONG_REQUEST_REDEMPTION;
const PLAYLISTS = [
    process.env.PLAYLIST_1_URI,
    process.env.PLAYLIST_2_URI,
    process.env.PLAYLIST_3_URI // Add more playlists here
];

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost'
});

// Set Spotify Refresh Token
spotifyApi.setRefreshToken(SPOTIFY_REFRESH_TOKEN);

// Keep track of the current playlist index
let currentPlaylistIndex = 0;

class TwitchBot {
    constructor() {
        this.ws = null;

        // Initialize TMI.js chat client
        this.chatClient = new tmi.Client({
            options: { debug: true },
            identity: {
                username: BOT_NICK,
                password: ACCESS_TOKEN // OAuth token for chat
            },
            channels: [CHANNEL_NAME]
        });

        this.chatClient.connect()
            .then(() => console.log("Chat client connected!"))
            .catch((err) => console.error("Error connecting chat client:", err));
    }

    connect() {
        console.log("Connecting to Twitch PubSub...");
        this.ws = new WebSocket('wss://pubsub-edge.twitch.tv');

        this.ws.on('open', () => {
            console.log("Connected to Twitch PubSub!");
            this.listenToRewards();
        });

        this.ws.on('message', (data) => {
            this.handleMessage(JSON.parse(data));
        });

        this.ws.on('error', (error) => {
            console.error(`WebSocket error: ${error}`);
        });

        this.ws.on('close', () => {
            console.log("Disconnected from Twitch PubSub. Reconnecting in 10 seconds...");
            setTimeout(() => this.connect(), 10000);
        });
    }

    listenToRewards() {
        const topic = `channel-points-channel-v1.${USER_ID}`;
        console.log(`Subscribing to topic: ${topic}`);

        const message = {
            type: 'LISTEN',
            nonce: this.generateNonce(),
            data: {
                topics: [topic],
                auth_token: ACCESS_TOKEN
            }
        };

        this.ws.send(JSON.stringify(message));
        console.log("Listening for channel point redemptions...");
    }

    async swapPlaylists() {
        try {
            const data = await spotifyApi.refreshAccessToken();
            spotifyApi.setAccessToken(data.body['access_token']);

            // Get the next playlist in the rotation
            currentPlaylistIndex = (currentPlaylistIndex + 1) % PLAYLISTS.length;
            const newPlaylist = PLAYLISTS[currentPlaylistIndex];

            await spotifyApi.play({
                context_uri: newPlaylist
            });

            console.log(`Switched to playlist: ${newPlaylist}`);
            await this.chatClient.say(
                CHANNEL_NAME,
                `Switched to a new playlist! 🎵`
            );
        } catch (error) {
            console.error(`Error swapping playlists: ${error.message}`);
            if (error.response) {
                console.error(`Spotify API error details:`, error.response.body);
            }
            await this.chatClient.say(
                CHANNEL_NAME,
                `Unable to swap playlists. Please try again later.`
            );
        }
    }

    async addSongToQueue(query, user) {
        try {
            console.log(`Received Spotify link: ${query}`);

            const match = query.match(/spotify:track:([a-zA-Z0-9]+)|spotify\.com\/track\/([a-zA-Z0-9]+)/);
            if (!match) {
                console.error("Invalid Spotify track link provided.");
                await this.chatClient.say(
                    CHANNEL_NAME,
                    `@${user}, the provided Spotify link is invalid. Please try again with a valid link.`
                );
                return;
            }

            const trackId = match[1] || match[2];
            const trackUri = `spotify:track:${trackId}`;
            console.log(`Parsed track URI: ${trackUri}`);

            const data = await spotifyApi.refreshAccessToken();
            spotifyApi.setAccessToken(data.body['access_token']);
            console.log("Spotify access token refreshed.");

            await spotifyApi.addToQueue(trackUri);
            console.log(`Successfully added to queue: ${trackUri}`);

            const trackInfo = await spotifyApi.getTrack(trackId);
            const trackName = trackInfo.body.name;
            const trackArtist = trackInfo.body.artists.map((a) => a.name).join(", ");
            await this.chatClient.say(
                CHANNEL_NAME,
                `@${user}, added "${trackName}" by ${trackArtist} to the queue! 🎶`
            );
        } catch (error) {
            console.error(`Error adding song to queue: ${error.message}`);
            if (error.response) {
                console.error(`Spotify API error details:`, error.response.body);
            }
            await this.chatClient.say(
                CHANNEL_NAME,
                `@${user}, there was an error adding your song to the queue. Please try again later.`
            );
        }
    }

    handleMessage(message) {
        if (message.type === 'MESSAGE') {
            const topic = message.data.topic;
            const payload = JSON.parse(message.data.message);
    
            if (topic.startsWith(`channel-points-channel-v1.`)) {
                const user = payload.data.redemption.user.display_name;
                const reward = payload.data.redemption.reward.title;
    
                console.log(`[REWARD REDEEMED] ${user} redeemed: ${reward}`);
    
                if (reward === SWAP_PLAYLISTS_REDEMPTION) {
                    console.log("Swapping playlists...");
                    this.swapPlaylists();
                }
    
                if (reward === SONG_REQUEST_REDEMPTION) {
                    const spotifyLink = payload.data.redemption.user_input;
                    console.log(`Song request by ${user}: ${spotifyLink}`);
                    this.addSongToQueue(spotifyLink, user);
                }
            }
        }
    }

    generateNonce() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    run() {
        this.connect();
    }
}

const bot = new TwitchBot();
bot.run();
