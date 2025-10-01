/**
 * Example Backend Server for ACC 3D Viewer
 * 
 * This is a simple Express server that handles OAuth authentication
 * and proxies requests to Autodesk APS APIs.
 * 
 * To use this:
 * 1. Install dependencies: npm install express cors axios dotenv
 * 2. Create a .env file with APS_CLIENT_ID and APS_CLIENT_SECRET
 * 3. Run: node server-example.js
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store access token in memory (use Redis or similar in production)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get Forge Access Token
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await axios.post(
      'https://developer.api.autodesk.com/authentication/v2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'data:read data:write bucket:read bucket:create viewables:read'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        auth: {
          username: process.env.APS_CLIENT_ID,
          password: process.env.APS_CLIENT_SECRET
        }
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min early
    
    return cachedToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
}

/**
 * Endpoint: Get Access Token for Viewer
 */
app.get('/api/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    const expiresIn = Math.floor((tokenExpiry - Date.now()) / 1000);
    
    res.json({
      access_token: token,
      expires_in: expiresIn
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

/**
 * Endpoint: List ACC Projects
 */
app.get('/api/projects', async (req, res) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://developer.api.autodesk.com/project/v1/hubs',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

/**
 * Endpoint: List Project Files
 */
app.get('/api/projects/:projectId/files', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { projectId } = req.params;
    const { folderId } = req.query;
    
    // Get project hub first
    const hubId = `b.${projectId}`; // Simplified - adjust based on your needs
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/project/v1/hubs/${hubId}/projects/${projectId}/folders/${folderId || 'root'}/contents`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching files:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

/**
 * Health Check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Make sure you have set APS_CLIENT_ID and APS_CLIENT_SECRET in .env`);
});
