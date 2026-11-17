import crypto from 'crypto';

/**
 * Reusable robust fetch wrapper for Nyumbani Bill (M-Pesa, PesaLink, & payment gateways)
 * 
 * @param {string} url - The target API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {Object} config - Custom configuration (retries, timeout, idempotency)
 * @returns {Promise<any>} - JSON response from the API
 */
export async function secureApiFetch(url, options = {}, config = {}) {
  const timeoutMs = config.timeoutMs || Number(process.env.API_REQUEST_TIMEOUT_MS) || 15000;
  const maxRetries = config.maxRetries !== undefined ? config.maxRetries : (Number(process.env.MAX_API_RETRIES) || 3);
  const backoffMs = config.backoffMs || Number(process.env.RETRY_BACKOFF_MS) || 2000;
  
  // Enforce Idempotency for POST/PUT requests to prevent double-charging on network glitches
  const isMutatingMethod = ['POST', 'PUT', 'PATCH'].includes((options.method || 'GET').toUpperCase());
  const useIdempotency = config.useIdempotency !== undefined ? config.useIdempotency : (process.env.ENABLE_IDEMPOTENCY_KEYS === 'true');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (isMutatingMethod && useIdempotency) {
    // Generate or pass a unique Idempotency Key so payment gateways ignore duplicate retries
    const idempotencyKey = options.idempotencyKey || `nyumbani_${crypto.randomUUID()}`;
    headers['X-Idempotency-Key'] = idempotencyKey;
    headers['Idempotency-Key'] = idempotencyKey; // Standardized header fallback
  }

  let attempt = 0;

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response body safely
      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') 
        ? await response.json() 
        : await response.text();

      // If HTTP status is successful (2xx), return data
      if (response.ok) {
        return data;
      }

      // Handle server errors (5xx) or rate limits (429) as retryable
      const isRetryableStatus = response.status >= 500 || response.status === 429;
      if (!isRetryableStatus || attempt > maxRetries) {
        throw new Error(`API Error [${response.status}]: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
      }

      console.warn(`[Nyumbani Bill] Request failed with status ${response.status}. Retrying attempt ${attempt}/${maxRetries}...`);

    } catch (error) {
      clearTimeout(timeoutId);

      const isTimeout = error.name === 'AbortError';
      const isNetworkError = error.message.includes('fetch failed') || isTimeout;

      // Retry only on network drops, timeouts, or server glitches
      if ((isNetworkError || attempt <= maxRetries) && attempt <= maxRetries) {
        const delay = backoffMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`[Nyumbani Bill] ${isTimeout ? 'Request timed out' : 'Network error'}: ${error.message}. Retrying in ${delay}ms (Attempt ${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      console.error(`[Nyumbani Bill] API request permanently failed for ${url}:`, error.message);
      throw error;
    }
  }

  throw new Error('[Nyumbani Bill] Maximum retry attempts reached without success.');
}
