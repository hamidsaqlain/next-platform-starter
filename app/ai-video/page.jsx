'use client';

import { useEffect, useMemo, useState } from 'react';

const defaultValues = {
    apiKey: '',
    prompt: '',
    scene: '',
    story: '',
    angle: 50,
    environment: 50
};

const STORAGE_KEY = 'replicate_api_key';

function maskKey(value) {
    if (!value) {
        return '';
    }

    if (value.length <= 8) {
        return '********';
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export default function AiVideoPage() {
    const [formValues, setFormValues] = useState(defaultValues);
    const [savedApiKey, setSavedApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [notice, setNotice] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedKey = window.localStorage.getItem(STORAGE_KEY) ?? '';

        if (storedKey) {
            setSavedApiKey(storedKey);
        }
    }, []);

    const activeApiKey = useMemo(() => formValues.apiKey.trim() || savedApiKey, [formValues.apiKey, savedApiKey]);

    const setValue = (key) => (event) => {
        setFormValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const saveApiKey = () => {
        const candidateKey = formValues.apiKey.trim();

        if (!candidateKey) {
            setNotice('Enter an API key first, then click Save API Key.');
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, candidateKey);
        setSavedApiKey(candidateKey);
        setNotice('API key saved in this browser. Now click Generate Video.');
    };

    const clearSavedApiKey = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setSavedApiKey('');
        setNotice('Saved API key was removed from this browser.');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setNotice('');
        setResult(null);

        if (!activeApiKey) {
            setLoading(false);
            setError('Paste your Replicate API key in the API Key section (or save one) before generating.');
            return;
        }

        try {
            const response = await fetch('/api/ai-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formValues, apiKey: activeApiKey })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unexpected error while generating video.');
            }

            setResult(data);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl pb-20 mx-auto">
            <section className="mb-8">
                <h1 className="mb-4">AI Video Generator Tool</h1>
                <p className="text-lg text-blue-100/90">
                    Add your API key, write your prompt and story details, adjust sliders, then generate your video.
                </p>
            </section>

            <section className="mb-6 p-6 rounded-md bg-white/95 text-neutral-900">
                <h2 className="mb-3 text-2xl">1) API Key Setup</h2>
                <p className="mb-3 text-sm text-neutral-700">
                    Paste your Replicate API key here. You can save it locally in your browser for repeated use.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="flex flex-col gap-2 sm:flex-1">
                        Replicate API Key
                        <input
                            type="password"
                            className="input"
                            value={formValues.apiKey}
                            onChange={setValue('apiKey')}
                            placeholder="r8_..."
                        />
                    </label>
                    <button type="button" className="btn" onClick={saveApiKey}>
                        Save API Key
                    </button>
                    <button type="button" className="btn" onClick={clearSavedApiKey}>
                        Clear Saved Key
                    </button>
                </div>
                <p className="mt-3 text-sm text-neutral-700">
                    Active key: {activeApiKey ? `ready (${maskKey(activeApiKey)})` : 'not set'}
                </p>
            </section>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-md bg-white/95 text-neutral-900">
                <h2 className="text-2xl">2) Video Prompt Setup</h2>

                <label className="flex flex-col gap-2">
                    Prompt
                    <textarea
                        className="input min-h-28"
                        value={formValues.prompt}
                        onChange={setValue('prompt')}
                        placeholder="A cyberpunk detective walking through rainy neon streets at night"
                        required
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Scene Details
                    <textarea
                        className="input min-h-24"
                        value={formValues.scene}
                        onChange={setValue('scene')}
                        placeholder="Environment mood, colors, weather, props"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Story Beat
                    <textarea
                        className="input min-h-20"
                        value={formValues.story}
                        onChange={setValue('story')}
                        placeholder="What should happen in this moment of the story?"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Camera Angle Intensity ({formValues.angle})
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={formValues.angle}
                        onChange={setValue('angle')}
                    />
                </label>

                <label className="flex flex-col gap-2">
                    Environment Richness ({formValues.environment})
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={formValues.environment}
                        onChange={setValue('environment')}
                    />
                </label>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Generating Video...' : '3) Generate Video'}
                </button>

                {notice ? <p className="font-medium text-green-700">{notice}</p> : null}
                {error ? <p className="font-medium text-red-700">{error}</p> : null}
            </form>

            {result ? (
                <section className="p-6 mt-8 bg-white rounded-md text-neutral-900">
                    <h2 className="mb-3 text-2xl">Generated Video</h2>
                    <video controls className="w-full rounded-sm" src={result.videoUrl} />
                    <p className="mt-4 text-sm break-all">Prediction ID: {result.predictionId}</p>
                    <p className="mt-2 text-sm text-neutral-700">Prompt sent to provider: {result.promptUsed}</p>
                </section>
            ) : null}
        </div>
    );
}
