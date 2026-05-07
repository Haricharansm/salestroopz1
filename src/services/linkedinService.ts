
export interface LinkedInProspect {
    id: string;
    firstName: string;
    lastName: string;
    headline: string;
    company: string;
    location: string;
}

export async function searchLinkedInProspects(query: string): Promise<LinkedInProspect[]> {
    const response = await fetch('/api/linkedin/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    if (!response.ok) throw new Error('Failed to search LinkedIn');
    return response.json();
}

export async function enrichProspectData(linkedInId: string): Promise<any> {
    const response = await fetch(`/api/linkedin/enrich/${linkedInId}`);
    if (!response.ok) throw new Error('Failed to enrich prospect');
    return response.json();
}

export async function sendInMail(linkedInId: string, message: string): Promise<void> {
    const response = await fetch('/api/linkedin/inmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedInId, message })
    });
    if (!response.ok) throw new Error('Failed to send InMail');
}
