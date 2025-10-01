import React, { useState } from 'react';
import { Sparkles, Download, X, Loader2, Camera, Wand2 } from 'lucide-react';

interface AIRendererProps {
  onClose: () => void;
  onCapture: () => Promise<string>;
}

const AIRenderer: React.FC<AIRendererProps> = ({ onClose, onCapture }) => {
  const [step, setStep] = useState<'capture' | 'customize' | 'rendering' | 'result'>('capture');
  const [screenshot, setScreenshot] = useState<string>('');
  const [renderedImage, setRenderedImage] = useState<string>('');
  const [renderStyle, setRenderStyle] = useState<string>('photorealistic');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  const renderStyles = [
    { id: 'photorealistic', name: 'Photorealistic', prompt: 'professional architectural photography, photorealistic, 8k, high detail, natural lighting, professional render' },
    { id: 'cinematic', name: 'Cinematic', prompt: 'cinematic architectural visualization, dramatic lighting, moody atmosphere, ultra realistic, film grain, professional photography' },
    { id: 'modern', name: 'Modern Minimal', prompt: 'modern minimalist architecture, clean lines, bright natural light, professional architectural render, contemporary design' },
    { id: 'luxury', name: 'Luxury', prompt: 'luxury architectural visualization, elegant materials, warm lighting, high-end interior design, premium finishes' },
    { id: 'daytime', name: 'Bright Daytime', prompt: 'bright sunny day, natural daylight, blue sky, architectural photography, vibrant colors, professional render' },
    { id: 'twilight', name: 'Golden Hour', prompt: 'golden hour lighting, sunset, warm tones, dramatic sky, architectural photography, beautiful atmosphere' },
    { id: 'night', name: 'Night Scene', prompt: 'night scene, artificial lighting, ambient glow, dramatic atmosphere, architectural night photography' },
  ];

  const handleCapture = async () => {
    try {
      setError('');
      const imageData = await onCapture();
      setScreenshot(imageData);
      setStep('customize');
    } catch (err) {
      setError('Failed to capture screenshot. Please try again.');
      console.error('Screenshot error:', err);
    }
  };

  const handleRender = async () => {
    try {
      setError('');
      setStep('rendering');
      setProgress(0);

      const selectedStyle = renderStyles.find(s => s.id === renderStyle);
      const enhancementPrompt = prompt || selectedStyle?.prompt || 'photorealistic architectural render';

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/ai/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: screenshot,
          prompt: enhancementPrompt,
          style: renderStyle,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI rendering failed');
      }

      const data = await response.json();
      setRenderedImage(data.renderedImage);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI render. Please check your API key.');
      console.error('AI rendering error:', err);
      setStep('customize');
    }
  };

  const handleDownload = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setStep('capture');
    setScreenshot('');
    setRenderedImage('');
    setError('');
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-autodesk-black border-2 border-hello-yellow rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-autodesk-black to-gray-900 border-b-2 border-hello-yellow p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-hello-yellow" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Realistic Rendering</h2>
              <p className="text-sm text-autodesk-gray-300">
                Powered by Stability AI • Transform your 3D view into photorealistic images
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-autodesk-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-autodesk-gray-700">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'capture' ? 'text-hello-yellow' : 'text-green-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'capture' ? 'bg-hello-yellow text-autodesk-black' : 'bg-green-500 text-white'}`}>
                1
              </div>
              <span className="font-semibold">Capture</span>
            </div>
            <div className="w-12 h-0.5 bg-autodesk-gray-700"></div>
            <div className={`flex items-center gap-2 ${step === 'customize' ? 'text-hello-yellow' : (step === 'rendering' || step === 'result') ? 'text-green-500' : 'text-autodesk-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'customize' ? 'bg-hello-yellow text-autodesk-black' : (step === 'rendering' || step === 'result') ? 'bg-green-500 text-white' : 'bg-autodesk-gray-700 text-white'}`}>
                2
              </div>
              <span className="font-semibold">Customize</span>
            </div>
            <div className="w-12 h-0.5 bg-autodesk-gray-700"></div>
            <div className={`flex items-center gap-2 ${step === 'rendering' ? 'text-hello-yellow' : step === 'result' ? 'text-green-500' : 'text-autodesk-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'rendering' ? 'bg-hello-yellow text-autodesk-black' : step === 'result' ? 'bg-green-500 text-white' : 'bg-autodesk-gray-700 text-white'}`}>
                3
              </div>
              <span className="font-semibold">AI Magic</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Capture */}
          {step === 'capture' && (
            <div className="text-center py-12">
              <Camera className="w-24 h-24 text-hello-yellow mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Capture Current View</h3>
              <p className="text-autodesk-gray-400 mb-8 max-w-2xl mx-auto">
                Take a snapshot of your current 3D model view. Position your camera to get the perfect angle before capturing.
              </p>
              <button
                onClick={handleCapture}
                className="px-8 py-4 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                Capture Screenshot
              </button>
            </div>
          )}

          {/* Step 2: Customize */}
          {step === 'customize' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Original Screenshot</h3>
                <img
                  src={screenshot}
                  alt="Screenshot"
                  className="w-full h-auto rounded-lg border-2 border-autodesk-gray-700"
                />
                <button
                  onClick={handleCapture}
                  className="mt-4 px-4 py-2 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  Retake Screenshot
                </button>
              </div>

              {/* Style Selection */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Select Rendering Style</h3>
                <div className="space-y-3 mb-6">
                  {renderStyles.map((style) => (
                    <label
                      key={style.id}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        renderStyle === style.id
                          ? 'border-hello-yellow bg-yellow-900 bg-opacity-20'
                          : 'border-autodesk-gray-700 hover:border-autodesk-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="style"
                        value={style.id}
                        checked={renderStyle === style.id}
                        onChange={(e) => setRenderStyle(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-white font-semibold">{style.name}</span>
                      <p className="text-xs text-autodesk-gray-400 ml-6 mt-1">{style.prompt}</p>
                    </label>
                  ))}
                </div>

                {/* Custom Prompt */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">
                    Custom Enhancement Prompt (Optional)
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe additional details you want in the rendering..."
                    className="w-full px-4 py-3 bg-autodesk-gray-800 text-white border-2 border-autodesk-gray-700 rounded-lg focus:outline-none focus:border-hello-yellow"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleRender}
                  className="w-full px-6 py-4 bg-gradient-to-r from-hello-yellow to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-autodesk-black font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate AI Render
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Rendering */}
          {step === 'rendering' && (
            <div className="text-center py-12">
              <Loader2 className="w-24 h-24 text-hello-yellow mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-bold text-white mb-4">AI is Creating Magic...</h3>
              <p className="text-autodesk-gray-400 mb-8">
                Stability AI is transforming your screenshot into a photorealistic render
              </p>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-autodesk-gray-800 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-hello-yellow to-yellow-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-hello-yellow font-semibold">{progress}%</p>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 'result' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                <Sparkles className="inline-block w-6 h-6 mr-2 text-hello-yellow" />
                AI Rendered Result
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <h4 className="text-lg font-semibold text-autodesk-gray-400 mb-3">Original</h4>
                  <img
                    src={screenshot}
                    alt="Original"
                    className="w-full h-auto rounded-lg border-2 border-autodesk-gray-700"
                  />
                  <button
                    onClick={() => handleDownload(screenshot, 'original-screenshot.png')}
                    className="mt-3 px-4 py-2 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Original
                  </button>
                </div>

                {/* AI Rendered */}
                <div>
                  <h4 className="text-lg font-semibold text-hello-yellow mb-3">AI Enhanced</h4>
                  <img
                    src={renderedImage}
                    alt="AI Rendered"
                    className="w-full h-auto rounded-lg border-2 border-hello-yellow shadow-lg shadow-yellow-500/20"
                  />
                  <button
                    onClick={() => handleDownload(renderedImage, 'ai-rendered-image.png')}
                    className="mt-3 px-4 py-2 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download AI Render
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded-lg transition-colors"
                >
                  Create Another Render
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRenderer;

