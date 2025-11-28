import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Received upload request');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate file size (max 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      console.error(`File too large: ${file.size} bytes`);
      return new Response(
        JSON.stringify({ error: 'File size exceeds 20MB limit' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.dcm', '.webp'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      console.error(`Invalid file extension: ${fileName}`);
      return new Response(
        JSON.stringify({ 
          error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get file extension
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Create new filename with timestamp
    const timestamp = Date.now();
    const newFileName = `odontoagent_${timestamp}${extension}`;
    
    console.log(`Processing file: ${fileName} -> ${newFileName}`);

    // Convert file to blob for forwarding
    const fileBuffer = await file.arrayBuffer();
    const blob = new Blob([fileBuffer], { type: file.type });

    // Create form data for webhook
    const webhookFormData = new FormData();
    webhookFormData.append('file', blob, newFileName);
    webhookFormData.append('originalName', file.name);
    webhookFormData.append('size', file.size.toString());
    webhookFormData.append('timestamp', timestamp.toString());

    // Get webhook URL from environment variable
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.error('WEBHOOK_URL not configured');
      throw new Error('Webhook URL not configured. Please set WEBHOOK_URL in secrets.');
    }
    
    console.log(`Sending to webhook: ${webhookUrl}`);
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      body: webhookFormData,
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error(`Webhook error: ${webhookResponse.status} - ${errorText}`);
      throw new Error(`Webhook failed: ${webhookResponse.status}`);
    }

    const webhookData = await webhookResponse.json();
    console.log('Webhook success:', webhookData);

    return new Response(
      JSON.stringify({ 
        success: true,
        fileName: newFileName,
        originalName: file.name,
        size: file.size,
        webhookResponse: webhookData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});