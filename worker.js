// Nas Kat scan proxy — deploy this as a Cloudflare Worker.
// It forwards meal-photo scan requests to Gemini using a secret API key
// that lives only in the Worker's own environment variables — never in
// the public GitHub repo, so it can't be found and revoked like the
// embedded key was.
//
// Setup (see README.md for the full walkthrough):
// 1. Paste this whole file into a new Worker in the Cloudflare dashboard.
// 2. Add a secret environment variable named GEMINI_API_KEY with your key.
// 3. Deploy, copy the worker's URL, and send it back so it can be baked
//    into index.html as SCAN_PROXY_URL.

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }
    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: { message: 'GEMINI_API_KEY is not set on this Worker.' } }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const body = await request.text();
    let upstream;
    try {
      upstream = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY,
          },
          body,
        }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: { message: 'Could not reach Gemini.' } }), {
        status: 502,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const respBody = await upstream.text();
    return new Response(respBody, {
      status: upstream.status,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  },
};
