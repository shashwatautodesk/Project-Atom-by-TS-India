/**
 * ACC 3D Viewer Backend Server
 * Handles OAuth authentication and proxies requests to Autodesk APS APIs
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

// In-memory token cache (use Redis in production)
let cachedToken = null;
let tokenExpiry = null;

/**
 * Get 2-legged OAuth token for server-to-server authentication
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Using cached token');
    return cachedToken;
  }

  console.log('Fetching new access token...');
  
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
    // Refresh token 5 minutes before expiry
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - (5 * 60 * 1000);
    
    console.log('New token obtained, expires in', response.data.expires_in, 'seconds');
    return cachedToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Autodesk');
  }
}

/**
 * GET /api/token
 * Returns access token for Forge Viewer
 */
app.get('/api/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    const expiresIn = Math.max(0, Math.floor((tokenExpiry - Date.now()) / 1000));
    
    res.json({
      access_token: token,
      expires_in: expiresIn
    });
  } catch (error) {
    console.error('Token endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to get access token',
      message: error.message 
    });
  }
});

/**
 * GET /api/hubs
 * List all hubs (BIM 360/ACC accounts)
 */
app.get('/api/hubs', async (req, res) => {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      'https://developer.api.autodesk.com/project/v1/hubs',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Found ${response.data.data.length} hubs`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hubs:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch hubs',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/hubs/:hubId/projects
 * List all projects in a hub
 */
app.get('/api/hubs/:hubId/projects', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { hubId } = req.params;
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/project/v1/hubs/${hubId}/projects`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Found ${response.data.data.length} projects in hub ${hubId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch projects',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/projects/:projectId/topFolders
 * Get top-level folders for a project
 */
app.get('/api/projects/:projectId/topFolders', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { projectId } = req.params;
    const { hubId } = req.query;
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/project/v1/hubs/${hubId}/projects/${projectId}/topFolders`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Found ${response.data.data.length} top folders in project ${projectId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top folders:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch folders',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/projects/:projectId/folders/:folderId/contents
 * Get contents of a folder
 */
app.get('/api/projects/:projectId/folders/:folderId/contents', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { projectId, folderId } = req.params;
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${folderId}/contents`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`Found ${response.data.data.length} items in folder ${folderId}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching folder contents:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch folder contents',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/items/:itemId/versions
 * Get version information for an item
 */
app.get('/api/items/:itemId/versions', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { itemId } = req.params;
    const { projectId } = req.query;
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/data/v1/projects/${projectId}/items/${itemId}/versions`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching item versions:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch item versions',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * POST /api/modelderivative/translate
 * Start translation job for a file
 */
app.post('/api/modelderivative/translate', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { urn } = req.body;
    
    const response = await axios.post(
      'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
      {
        input: {
          urn: urn
        },
        output: {
          formats: [
            {
              type: 'svf',
              views: ['2d', '3d']
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-ads-force': 'true'
        }
      }
    );
    
    console.log('Translation job started for URN:', urn);
    res.json(response.data);
  } catch (error) {
    console.error('Error starting translation:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to start translation',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/modelderivative/:urn/manifest
 * Get translation manifest/status
 */
app.get('/api/modelderivative/:urn/manifest', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { urn } = req.params;
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching manifest:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch manifest',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * POST /api/modelderivative/convert-to-ifc
 * Convert model to IFC format
 */
app.post('/api/modelderivative/convert-to-ifc', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { urn } = req.body;
    
    if (!urn) {
      return res.status(400).json({ 
        success: false,
        message: 'URN is required' 
      });
    }

    console.log('Requesting IFC conversion for URN:', urn);
    
    // Request IFC conversion through Model Derivative API
    const response = await axios.post(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/job`,
      {
        input: {
          urn: urn
        },
        output: {
          formats: [
            {
              type: 'ifc',
              views: ['2d', '3d']
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-ads-force': 'true'  // Force new translation even if one exists
        }
      }
    );
    
    console.log('IFC conversion job started:', response.data);
    
    res.json({
      success: true,
      jobId: response.data.urn || urn,
      message: 'IFC conversion job started successfully'
    });
    
  } catch (error) {
    console.error('Error starting IFC conversion:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to start IFC conversion';
    
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.diagnostic) {
      errorMessage = error.response.data.diagnostic;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Check if it's an unsupported format error
    if (errorMessage.includes('not supported') || errorMessage.includes('unsupported')) {
      errorMessage = 'IFC export is not supported for this file type. Only certain Revit and other CAD formats can be exported to IFC.';
    }
    
    res.status(error.response?.status || 500).json({ 
      success: false,
      message: errorMessage
    });
  }
});

/**
 * GET /api/modelderivative/:urn/ifc-status
 * Check IFC conversion status and get download URL
 */
app.get('/api/modelderivative/:urn/ifc-status', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { urn } = req.params;
    
    // Get the manifest to check conversion status
    const manifestResponse = await axios.get(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const manifest = manifestResponse.data;
    
    // Find IFC derivative
    const ifcDerivative = manifest.derivatives?.find(d => 
      d.outputType === 'ifc' || 
      d.children?.some(c => c.type === 'resource' && c.role === 'ifc')
    );
    
    if (!ifcDerivative) {
      return res.json({
        status: 'pending',
        message: 'IFC conversion not found in manifest. It may still be queued.'
      });
    }
    
    // Check status
    const status = ifcDerivative.status || manifest.status;
    
    if (status === 'success' || status === 'complete') {
      // Find the IFC file in the derivative
      let ifcFile = null;
      
      if (ifcDerivative.children) {
        ifcFile = ifcDerivative.children.find(c => 
          c.type === 'resource' && 
          (c.role === 'ifc' || c.mime === 'application/ifc')
        );
      }
      
      if (ifcFile && ifcFile.urn) {
        // Construct download URL
        const downloadUrl = `${req.protocol}://${req.get('host')}/api/modelderivative/download/${encodeURIComponent(urn)}/${encodeURIComponent(ifcFile.urn)}`;
        
        return res.json({
          status: 'success',
          downloadUrl: downloadUrl,
          message: 'IFC conversion completed successfully'
        });
      } else {
        return res.json({
          status: 'complete',
          message: 'IFC conversion completed but download URL not available'
        });
      }
    } else if (status === 'inprogress' || status === 'pending') {
      const progress = ifcDerivative.progress || manifest.progress || '0%';
      return res.json({
        status: 'inprogress',
        progress: progress,
        message: `IFC conversion in progress: ${progress}`
      });
    } else if (status === 'failed') {
      const messages = manifest.derivatives?.map(d => d.messages).flat().filter(Boolean) || [];
      const errorMsg = messages.length > 0 ? messages.join('; ') : 'Conversion failed';
      
      return res.json({
        status: 'failed',
        message: errorMsg
      });
    } else if (status === 'timeout') {
      return res.json({
        status: 'timeout',
        message: 'IFC conversion timed out'
      });
    } else {
      return res.json({
        status: status || 'unknown',
        message: `Unknown conversion status: ${status}`
      });
    }
    
  } catch (error) {
    console.error('Error checking IFC status:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      status: 'error',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * GET /api/modelderivative/download/:urn/:derivativeUrn
 * Download IFC file
 */
app.get('/api/modelderivative/download/:urn/:derivativeUrn', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { urn, derivativeUrn } = req.params;
    
    console.log('Downloading IFC file:', derivativeUrn);
    
    const response = await axios.get(
      `https://developer.api.autodesk.com/modelderivative/v2/designdata/${encodeURIComponent(urn)}/manifest/${encodeURIComponent(derivativeUrn)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'stream'
      }
    );
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/ifc');
    res.setHeader('Content-Disposition', `attachment; filename="model.ifc"`);
    
    // Pipe the response
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Error downloading IFC file:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to download IFC file',
      message: error.response?.data?.detail || error.message
    });
  }
});

/**
 * 4D BIM Database Endpoints
 * In-memory storage for demo (use a real database in production)
 */
const element4DDatabase = new Map();

/**
 * POST /api/4d/properties
 * Save 4D properties to database
 */
app.post('/api/4d/properties', async (req, res) => {
  try {
    const { elementId, properties } = req.body;
    
    if (!elementId || !properties) {
      return res.status(400).json({
        success: false,
        message: 'elementId and properties are required'
      });
    }

    // Generate a record ID
    const recordId = `4D-${elementId}-${Date.now()}`;
    
    // Store in database (in-memory for demo)
    element4DDatabase.set(elementId, {
      ...properties,
      recordId,
      elementId,
      lastUpdated: new Date().toISOString()
    });

    console.log(`Saved 4D properties for element ${elementId}:`, properties);

    res.json({
      success: true,
      recordId,
      message: 'Properties saved successfully'
    });
  } catch (error) {
    console.error('Error saving 4D properties:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/4d/properties/:elementId
 * Get 4D properties for a specific element
 */
app.get('/api/4d/properties/:elementId', (req, res) => {
  try {
    const { elementId } = req.params;
    const properties = element4DDatabase.get(parseInt(elementId));

    if (!properties) {
      return res.status(404).json({
        success: false,
        message: 'No properties found for this element'
      });
    }

    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    console.error('Error getting 4D properties:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/4d/project/:projectId/properties
 * Get all 4D properties for a project
 */
app.get('/api/4d/project/:projectId/properties', (req, res) => {
  try {
    // Return all stored properties (in a real app, filter by projectId)
    const allProperties = Array.from(element4DDatabase.values());

    res.json({
      success: true,
      count: allProperties.length,
      data: allProperties
    });
  } catch (error) {
    console.error('Error getting project 4D properties:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * DELETE /api/4d/properties/:elementId
 * Delete 4D properties for an element
 */
app.delete('/api/4d/properties/:elementId', (req, res) => {
  try {
    const { elementId } = req.params;
    const deleted = element4DDatabase.delete(parseInt(elementId));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'No properties found for this element'
      });
    }

    res.json({
      success: true,
      message: 'Properties deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting 4D properties:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/ai/render
 * AI-powered realistic rendering using Stability AI
 */
app.post('/api/ai/render', async (req, res) => {
  try {
    const { image, prompt, style } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Image and prompt are required'
      });
    }

    // Check if Stability AI API key is configured
    if (!process.env.STABILITY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI rendering requires STABILITY_API_KEY in .env file. Get your API key from https://platform.stability.ai/'
      });
    }

    console.log('Starting AI rendering with style:', style);
    console.log('Prompt:', prompt);

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Create form data
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    
    formData.append('init_image', imageBuffer, {
      filename: 'input.png',
      contentType: 'image/png'
    });
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35'); // Keep some of the original
    formData.append('text_prompts[0][text]', prompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '30');

    // Call Stability AI API
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    if (response.data.artifacts && response.data.artifacts.length > 0) {
      const renderedImage = `data:image/png;base64,${response.data.artifacts[0].base64}`;
      
      console.log('AI rendering completed successfully');
      
      res.json({
        success: true,
        renderedImage
      });
    } else {
      throw new Error('No image generated');
    }

  } catch (error) {
    console.error('AI rendering error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'AI rendering failed. Please check your Stability AI API key and credits.'
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasCredentials: !!(process.env.APS_CLIENT_ID && process.env.APS_CLIENT_SECRET),
    hasAIKey: !!process.env.STABILITY_API_KEY,
    database4DCount: element4DDatabase.size
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'ACC 3D Viewer API',
    version: '1.0.0',
    endpoints: {
      token: 'GET /api/token',
      hubs: 'GET /api/hubs',
      projects: 'GET /api/hubs/:hubId/projects',
      topFolders: 'GET /api/projects/:projectId/topFolders',
      folderContents: 'GET /api/projects/:projectId/folders/:folderId/contents',
      itemVersions: 'GET /api/items/:itemId/versions',
      translate: 'POST /api/modelderivative/translate',
      manifest: 'GET /api/modelderivative/:urn/manifest',
      convertToIfc: 'POST /api/modelderivative/convert-to-ifc',
      ifcStatus: 'GET /api/modelderivative/:urn/ifc-status',
      downloadIfc: 'GET /api/modelderivative/download/:urn/:derivativeUrn',
      save4DProperties: 'POST /api/4d/properties',
      get4DProperties: 'GET /api/4d/properties/:elementId',
      getProject4DProperties: 'GET /api/4d/project/:projectId/properties',
      delete4DProperties: 'DELETE /api/4d/properties/:elementId',
      health: 'GET /health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🚀 ACC 3D Viewer API Server running on port ${PORT}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Local:            http://localhost:${PORT}`);
  console.log(`📍 Health Check:     http://localhost:${PORT}/health`);
  console.log('');
  
  if (!process.env.APS_CLIENT_ID || !process.env.APS_CLIENT_SECRET) {
    console.log('⚠️  WARNING: APS credentials not configured!');
    console.log('   Please set APS_CLIENT_ID and APS_CLIENT_SECRET in .env file');
  } else {
    console.log('✅ APS credentials configured');
  }
  
  console.log('═══════════════════════════════════════════════════════');
});
