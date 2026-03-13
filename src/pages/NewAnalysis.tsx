import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewAnalysis({ user }: { user: any }) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setError('Could not access camera. Please check permissions.');
        });
    }
  }, [isCameraOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Please drop a valid image file.');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      setError('');
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const startAnalysis = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', user.id.toString());

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      setError('Network error during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
    stopCamera();
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">New Skin Analysis</h1>
        <p className="text-neutral-500 mt-2">Upload a clear, well-lit photo of your face for the best results.</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!result ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {isCameraOpen ? (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-96 mx-auto flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={capturePhoto}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
            </div>
          ) : !previewUrl ? (
            <div className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center hover:bg-neutral-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-1">Click or drag image here</h3>
                <p className="text-neutral-500 text-sm mb-6">Supports JPG, PNG, WEBP</p>

                <button className="bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm">
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink-0 mx-4 text-neutral-400 text-sm">or</span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>
              <button
                onClick={startCamera}
                className="w-full bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Camera className="w-5 h-5" />
                Use Webcam
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-square max-h-96 mx-auto">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={resetAnalysis}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing your skin...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Start AI Analysis
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">Analysis Complete</h2>
            <p className="text-emerald-700 max-w-lg mx-auto">{result.overall_condition}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Acne', score: result.acne_score, color: 'bg-red-500' },
              { label: 'Dryness', score: result.dryness_score, color: 'bg-blue-500' },
              { label: 'Oiliness', score: result.oiliness_score, color: 'bg-yellow-500' },
              { label: 'Pigmentation', score: result.pigmentation_score, color: 'bg-purple-500' },
              { label: 'Wrinkles', score: result.wrinkle_score, color: 'bg-indigo-500' },
              { label: 'Redness', score: result.redness_score, color: 'bg-rose-500' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                  <p className="text-sm font-semibold text-neutral-900">{item.score}/10</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{ width: `${item.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personalized Recommendations</h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 bg-neutral-50 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-neutral-700">{rec}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetAnalysis}
              className="flex-1 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 py-3 rounded-xl font-medium transition-colors"
            >
              Analyze Another Photo
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
