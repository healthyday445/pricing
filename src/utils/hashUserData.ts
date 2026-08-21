async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Google Enhanced Conversions normalization: phone must already be E.164, name lowercased + trimmed, then SHA-256 hashed.
export const hashPhoneNumber = (phone: string): Promise<string> => sha256Hex(phone.trim());

export const hashName = (name: string): Promise<string> => sha256Hex(name.trim().toLowerCase());
