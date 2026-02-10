'use client';

import { useState } from 'react';

const defaultValues = {
    prompt: '',
    scene: '',
    story: '',
    angle: 50,
    environment: 50
};

export default function AiVideoPage() {
    const [formValues, setFormValues] = useState(defaultValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const setValue = (key) => (event) => {
        setFormValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/ai-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
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
                    Describe your scene and story, then tune camera angle and environment depth with sliders. The tool uses your API
                    key from server environment variables.
                </p>
            </section>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-md bg-white/95 text-neutral-900">
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
                    {loading ? 'Generating Video...' : 'Generate Video'}
                </button>

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
