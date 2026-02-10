const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const DEFAULT_MODEL = process.env.AI_VIDEO_MODEL ?? 'kwaivgi/kling-v1.6-standard/text-to-video';
const POLL_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 120000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeOutput(output) {
    if (!output) {
        return null;
    }

    if (typeof output === 'string') {
        return output;
    }

    if (Array.isArray(output)) {
        const firstUrl = output.find((item) => typeof item === 'string');
        return firstUrl ?? null;
    }

    if (typeof output === 'object') {
        if (typeof output.url === 'string') {
            return output.url;
        }

        if (Array.isArray(output.videos)) {
            const firstVideo = output.videos.find((item) => typeof item?.url === 'string');
            return firstVideo?.url ?? null;
        }
    }

    return null;
}

function getAngleDescription(angleLevel) {
    if (angleLevel <= 25) return 'low angle, cinematic upward perspective';
    if (angleLevel <= 50) return 'eye-level angle, natural perspective';
    if (angleLevel <= 75) return 'high angle, overlooking perspective';

    return 'top-down drone-style perspective';
}

function getEnvironmentDescription(environmentLevel) {
    if (environmentLevel <= 25) return 'minimal environment with soft neutral details';
    if (environmentLevel <= 50) return 'balanced environment detail with realistic background elements';
    if (environmentLevel <= 75) return 'rich environment detail with layered lighting and textures';

    return 'highly immersive environment with dramatic atmosphere and dense detail';
}

export async function POST(request) {
    const apiKey = process.env.REPLICATE_API_TOKEN;

    if (!apiKey) {
        return Response.json(
            { error: 'Missing REPLICATE_API_TOKEN. Add it to your environment variables first.' },
            { status: 500 }
        );
    }

    let body;

    try {
        body = await request.json();
    } catch {
        return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const { prompt = '', scene = '', environment = 50, angle = 50, story = '' } = body;

    if (!prompt.trim()) {
        return Response.json({ error: 'A prompt is required to generate a video.' }, { status: 400 });
    }

    const angleLevel = Number(angle);
    const environmentLevel = Number(environment);

    const composedPrompt = [
        prompt.trim(),
        scene.trim() ? `Scene: ${scene.trim()}.` : null,
        `Camera: ${getAngleDescription(angleLevel)}.`,
        `Environment style: ${getEnvironmentDescription(environmentLevel)}.`,
        story.trim() ? `Story beat: ${story.trim()}.` : null,
        'Generate smooth cinematic motion, consistent subject continuity, and coherent visual storytelling.'
    ]
        .filter(Boolean)
        .join(' ');

    const createResponse = await fetch(REPLICATE_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            Prefer: 'wait'
        },
        body: JSON.stringify({
            model: DEFAULT_MODEL,
            input: {
                prompt: composedPrompt,
                aspect_ratio: '16:9'
            }
        })
    });

    if (!createResponse.ok) {
        const details = await createResponse.text();

        return Response.json({ error: `Provider error: ${details}` }, { status: createResponse.status });
    }

    let prediction = await createResponse.json();
    const startedAt = Date.now();

    while (prediction?.status === 'starting' || prediction?.status === 'processing') {
        if (Date.now() - startedAt > MAX_WAIT_MS) {
            return Response.json(
                {
                    error: 'Video generation timed out. Try a shorter prompt or check provider status.'
                },
                { status: 504 }
            );
        }

        await sleep(POLL_INTERVAL_MS);

        const pollResponse = await fetch(prediction.urls.get, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!pollResponse.ok) {
            const details = await pollResponse.text();

            return Response.json({ error: `Polling error: ${details}` }, { status: pollResponse.status });
        }

        prediction = await pollResponse.json();
    }

    if (prediction?.status !== 'succeeded') {
        return Response.json(
            {
                error: prediction?.error || 'Video generation failed. Please try again.'
            },
            { status: 500 }
        );
    }

    const videoUrl = normalizeOutput(prediction.output);

    if (!videoUrl) {
        return Response.json(
            {
                error: 'Video generated but no downloadable URL was returned by the provider.'
            },
            { status: 500 }
        );
    }

    return Response.json({ videoUrl, promptUsed: composedPrompt, predictionId: prediction.id });
}
