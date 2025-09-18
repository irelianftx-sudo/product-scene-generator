
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { UploadedImage, HistoryEntry } from './types';
import { generateScene } from './services/geminiService';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { ImageCard } from './components/ImageCard';
import { HistorySection } from './components/HistorySection';
import { HistoryModal } from './components/HistoryModal';
import { ClearIcon, GenerateIcon, LibraryIcon } from './components/Icons';
import { compressImage } from './utils';
import { PromptDrawer } from './components/PromptDrawer';

const PREDEFINED_PROMPTS = [
  {
    title: "Escreva seu prompt ou selecione um estilo...",
    prompt: ""
  },
  {
    title: "Hiper-Realista (Padrão)",
    prompt: `Create a hyper-realistic, premium product photo using my exact product from the uploaded image. Do not change, edit, or distort the product’s original color, material, texture, label, logo, or any design details — they must stay 100% identical and crystal clear. Position the product at a slight diagonal tilt, as if floating above a smooth, slightly reflective surface, inspired by the reference image. Use a strong, warm side light that enhances the natural tones and textures of the product, but make the overall scene slightly brighter and more luminous than the previous version — just enough to bring out elegant highlights and subtle details without losing the dramatic shadows. The light should cast a crisp shadow and a soft, clear reflection on the surface. Keep the background clean, dark, and minimal, but allow a soft warm glow to spread more light into the surrounding space to enhance the atmosphere. The final image must look luxurious, natural, and polished like a high-end magazine shoot, with perfectly sharp details and no changes to the original product.`
  },
  {
    title: "Luz Dramática e Luxo Editorial",
    prompt: `Create a hyper-realistic, luxury product photo of the uploaded item. Keep all colors, textures, and logos exactly the same, without alterations. Place the product on a glossy black surface with soft reflections. Use a single dramatic side light to enhance textures, edges, and fine details. Keep the background minimal and dark, with subtle warm highlights fading into the shadows. The final image should look elegant, cinematic, and premium — like a high-end fashion magazine shot.`
  },
  {
    title: "Ambiente Clean e Minimalista",
    prompt: `Generate a hyper-realistic photo of the uploaded product. Do not alter its original details, colors, or logos. Place it on a smooth, bright surface with subtle reflections. Use soft daylight-style lighting from above and the side to create gentle highlights and natural shadows. Keep the background clean white or light neutral tones for a modern, minimal look. The image should feel fresh, sharp, and premium, highlighting every detail clearly.`
  },
  {
    title: "Reflexo Sofisticado",
    prompt: `Produce a realistic, premium photo of the uploaded product. Maintain all original design, colors, and logos with absolute accuracy. Position the product above a glossy reflective surface, capturing a clear mirror-like reflection beneath it. Use warm, directional lighting that enhances the depth, shine, and contours. Keep the background dark and minimal, with just enough glow to separate the product from the background. Final result must look luxurious and bold.`
  },
  {
    title: "Iluminação Suave e Natural",
    prompt: `Create a natural-looking, realistic product photo of the uploaded item. Do not modify its colors, textures, or logos. Place it on a matte neutral surface, with soft diffused light from multiple angles. The shadows should be gentle and the highlights subtle, simulating daylight from a window. Keep the background clean and minimal, slightly blurred to keep focus on the product. The result should feel approachable, modern, and elegant.`
  },
  {
    title: "Estilo Tecnológico e Futurista",
    prompt: `Generate a hyper-realistic photo of the uploaded product. Keep every detail accurate — no changes to logos, labels, or colors. Place it on a sleek metallic or glass-like surface with glowing reflections. Use strong, cool-toned side lighting with neon accents (blue or cyan glow) to create a futuristic, high-tech atmosphere. Background should stay minimal, with subtle gradients of light that emphasize innovation and performance.`
  },
  {
    title: "Close-up com Foco em Detalhes",
    prompt: `Create a sharp, hyper-realistic close-up photo of the uploaded product. Keep all details — texture, stitching, logos, and material — 100% identical. Use strong side lighting to bring out fine textures and edges. Position the camera close enough to highlight premium craftsmanship and unique design details. Keep the background minimal and blurred, with light softly illuminating the edges. The final image should feel luxurious, tactile, and high-end.`
  },
  {
    title: "Efeito Água Splash (Impacto Refrescante)",
    prompt: "Create a hyper-realistic 4K product photo of the uploaded item. Keep the exact shape, logos, text, and details unchanged. Surround the product with dynamic water splash and droplets, with realistic liquid textures and crisp refractions. Place it above a subtle reflective surface for depth. No studio, no visible camera. Final result: cinematic, sharp, and premium — perfect for beauty or hydration-themed products."
  },
  {
    title: "Explosão de Pó Colorido (Energia Vibrante)",
    prompt: "Generate a hyper-realistic 4K photo of the uploaded product. Keep all proportions, logos, and surface details exactly as they are. Place the product in front of a burst of colorful powder (like Holi dust), frozen mid-air with fine particles surrounding it. Use bright highlights to make the colors pop against a clean, minimal background. No studio, no props. Final image: bold, modern, and high-impact."
  },
  {
    title: "Efeito Fumaça e Luz (Luxo Dramático)",
    prompt: "Produce a hyper-realistic 4K image of the uploaded item. Keep the shape, logos, and details completely untouched. Add soft smoke swirls and glowing light rays behind the product, giving a mysterious and luxurious vibe. Shadows and highlights should create depth while the background stays dark and minimal. No studio, no visible camera. Final result: cinematic and high-end."
  },
  {
    title: "Partículas Douradas (Luxo e Sofisticação)",
    prompt: "Create a hyper-realistic 4K product photo of the uploaded item. Preserve every detail, shape, and logo without changes. Surround the product with floating golden dust particles and subtle sparkles, as if glowing in luxury. The background should stay minimal, with warm gradients enhancing elegance. No studio, no props. Final look: premium, polished, and aspirational."
  },
  {
    title: "Fogo e Energia (Impacto Ousado)",
    prompt: "Generate a hyper-realistic 4K visual of the uploaded product. Keep the exact product form, colors, and logos intact. Add dynamic fire streaks or sparks swirling around the product, creating a sense of raw power and energy. Place it above a reflective surface with sharp highlights. No studio, no camera setup. The final result: bold, cinematic, and striking."
  },
  {
    title: "Estilo Aquarela (Arte Delicada)",
    prompt: "Create a hyper-realistic 4K photo of the uploaded product. Keep the shape, colors, and logos unchanged. Surround the product with watercolor-style splashes and painted textures, blending soft pastel tones that look artistic and elegant. Background should feel like a luxury illustration, minimal and refined. No studio, no visible camera. The final result: creative, premium, and artistic."
  },
  {
    title: "Fundo de Galáxia (Cosmos Sofisticado)",
    prompt: "Generate a hyper-realistic 4K image of the uploaded item. Do not change the product’s proportions, text, or surface details. Place it floating against a galaxy-inspired background with stars, nebulae, and cosmic gradients. Add subtle glowing reflections to suggest depth and infinity. No studio, no props. Final look: futuristic, dreamy, and powerful."
  },
  {
    title: "Minimalista em Tons Pastel (Leve e Moderno)",
    prompt: "Produce a hyper-realistic 4K photo of the uploaded product. Keep every detail intact — logos, colors, and textures. Position it on a soft pastel-toned surface (light pink, mint, beige, or baby blue), with smooth lighting and minimal shadows. Background must be clean, airy, and modern. No studio, no visible camera. Final result: fresh, elegant, and Instagram-ready."
  },
  {
    title: "Estilo Cyberpunk (Futurismo Urbano)",
    prompt: "Create a hyper-realistic 4K render of the uploaded product. Preserve the exact shape, text, and details. Place it in a neon-lit cyberpunk environment, with glowing accents in purple, cyan, and magenta reflecting on the product surface. Background should suggest a futuristic city vibe, blurred and abstract. No studio, no props. Final image: edgy, bold, and high-tech."
  },
  {
    title: "Natureza Viva (Orgânico e Natural)",
    prompt: "Generate a hyper-realistic 4K photo of the uploaded product. Keep all logos, shapes, and colors unchanged. Place it surrounded by natural elements — leaves, flowers, or flowing water — arranged in a minimal and artistic composition. Lighting should be soft, like daylight through trees. No studio, no visible camera. Final look: organic, fresh, and harmonious."
  },
];


const ASPECT_RATIOS = ['9:16', '16:9', '1:1', '4:3', '3:4'];

const generateTransparentCanvas = (aspectRatio: string): UploadedImage => {
  const [width, height] = aspectRatio.split(':').map(Number);
  const baseSize = 512;
  let canvasWidth, canvasHeight;

  if (width > height) {
    canvasWidth = baseSize;
    canvasHeight = Math.round(baseSize * (height / width));
  } else {
    canvasHeight = baseSize;
    canvasWidth = Math.round(baseSize * (width / height));
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  const dataUrl = canvas.toDataURL('image/png');
  const base64 = dataUrl.split(',')[1];

  return {
    base64,
    mimeType: 'image/png',
    dataUrl,
    width: canvasWidth,
    height: canvasHeight,
  };
};

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(PREDEFINED_PROMPTS[1].prompt);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [aspectRatioCanvas, setAspectRatioCanvas] = useState<UploadedImage | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAspectRatioCanvas(generateTransparentCanvas('9:16'));
    try {
      const savedHistory = localStorage.getItem('nano-banana-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nano-banana-history', JSON.stringify(history));
  }, [history]);


  const handleImageUpload = useCallback(async (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato de arquivo inválido. Por favor, use JPG, PNG ou WebP.');
      return;
    }
    setError(null);
    setIsProcessingImage(true);
    setUploadedImage(null);
    setGeneratedImage(null);

    try {
      const compressedImage = await compressImage(file);
      setUploadedImage(compressedImage);
    } catch (e) {
      setError("Falha ao processar a imagem.");
      console.error(e);
    } finally {
      setIsProcessingImage(false);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError('Por favor, envie uma imagem primeiro.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      const response = await generateScene(uploadedImage.base64, uploadedImage.mimeType, prompt, aspectRatio, aspectRatioCanvas);
      const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
      
      if (imagePart && imagePart.inlineData) {
        const newImageDataUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        setGeneratedImage(newImageDataUrl);

        const newHistoryEntry: HistoryEntry = {
          id: `gen_${Date.now()}`,
          generatedImage: newImageDataUrl,
          originalImage: uploadedImage,
          prompt: prompt,
          aspectRatio: aspectRatio,
          timestamp: Date.now(),
        };
        setHistory(prev => [newHistoryEntry, ...prev].slice(0, 20));

      } else {
        let errorMessage = 'Não foi possível gerar a imagem. A resposta da API não continha uma imagem.';
        const finishReason = response.candidates?.[0]?.finishReason;
        const blockReason = response.promptFeedback?.blockReason;

        if (blockReason === 'SAFETY' || finishReason === 'SAFETY') {
            errorMessage = 'Geração bloqueada por segurança. O prompt ou a imagem podem ter violado as políticas de conteúdo. Tente ser mais específico ou use uma imagem diferente.';
        } else if (blockReason) {
             errorMessage = `Geração bloqueada por um motivo não especificado (${blockReason}). Tente novamente ou ajuste seu prompt.`;
        } else if (finishReason) {
             errorMessage = `Geração finalizada inesperadamente: ${finishReason}.`;
        } else {
            const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
            if (textPart?.text) {
              errorMessage = `Não foi possível gerar a imagem. Resposta da IA: ${textPart.text}`;
            }
        }
        
        setError(errorMessage);
        console.error("API Response did not contain an image:", response);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt, aspectRatio, aspectRatioCanvas]);

  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setGeneratedImage(null);
    setPrompt(PREDEFINED_PROMPTS[1].prompt);
    setError(null);
    setIsLoading(false);
    setAspectRatio('9:16');
    setAspectRatioCanvas(generateTransparentCanvas('9:16'));
  }, []);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'cenario-produto-nanobanana.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    setAspectRatioCanvas(generateTransparentCanvas(ratio));
  };

  const handleReuseHistory = (item: HistoryEntry) => {
    setUploadedImage(item.originalImage);
    setPrompt(item.prompt);
    setAspectRatio(item.aspectRatio);
    handleAspectRatioChange(item.aspectRatio);
    setGeneratedImage(item.generatedImage);
    setSelectedHistoryItem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const resultAspectRatio = aspectRatio;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333333] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <main className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6 bg-white p-6 rounded-lg border-2 border-[#333333] shadow-lg">
              <h2 className="text-xl font-bold text-gray-800">1. Envie sua Imagem</h2>
              <UploadArea onImageUpload={handleImageUpload} isProcessing={isProcessingImage}/>
              
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold text-gray-800">2. Refine o Cenário (Opcional)</h2>
                 <p className="text-sm text-gray-600">Use um prompt pré-definido para resultados incríveis ou escreva o seu.</p>
                 <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full flex items-center justify-center gap-3 text-lg font-bold bg-white text-[#4A148C] px-6 py-3 rounded-lg border-2 border-[#4A148C] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 transition-transform duration-150"
                 >
                    <LibraryIcon />
                    Biblioteca de Estilos
                 </button>
              </div>

              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: um fundo de mármore claro com iluminação suave e uma planta desfocada..."
                  className="w-full h-24 p-3 border-2 border-[#333333] rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:outline-none transition"
                  rows={3}
                  maxLength={1500}
                />
                <div className="text-right text-sm text-gray-500 pr-1">
                  {prompt.length} / 1500
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 pt-4">3. Escolha a Proporção</h2>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => handleAspectRatioChange(ratio)}
                    className={`font-bold px-4 py-2 rounded-lg border-2 border-[#333333] shadow-md hover:shadow-lg hover:-translate-y-px active:shadow-sm active:translate-y-0 transition-all duration-150 ${
                      aspectRatio === ratio
                        ? 'bg-[#4A148C] text-white'
                        : 'bg-white text-[#333333]'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-white p-6 rounded-lg border-2 border-[#333333] shadow-lg">
              <h2 className="text-xl font-bold text-gray-800">4. Gere seu Cenário Mágico!</h2>
              <p className="text-gray-600">
                Clique no botão abaixo para que nossa IA crie um fundo incrível para o seu produto.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <button
                  onClick={handleGenerate}
                  disabled={!uploadedImage || isLoading || isProcessingImage}
                  className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 text-lg font-bold bg-[#FFD700] text-[#333333] px-6 py-3 rounded-lg border-2 border-[#333333] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 transition-transform duration-150 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <GenerateIcon />
                  {isLoading ? 'Gerando...' : 'Gerar Cenário'}
                </button>
                <button
                  onClick={handleClear}
                  disabled={isLoading || isProcessingImage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-lg font-bold bg-white text-[#333333] px-6 py-3 rounded-lg border-2 border-[#333333] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 transition-transform duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <ClearIcon />
                  Limpar
                </button>
              </div>
            </div>
          </div>
          
          <div ref={resultRef} className="mt-12">
            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-8" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
                {error !== 'Por favor, envie uma imagem primeiro.' && !isLoading && (
                  <button
                    onClick={handleGenerate}
                    className="mt-2 block sm:inline-block sm:ml-4 px-3 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors text-sm font-bold"
                  >
                    Tentar Novamente
                  </button>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageCard title="Original" imageUrl={uploadedImage?.dataUrl} isLoading={isProcessingImage} />
              <ImageCard 
                title="Resultado" 
                imageUrl={generatedImage} 
                isLoading={isLoading}
                onDownload={handleDownload}
                aspectRatio={resultAspectRatio}
              />
            </div>
          </div>

          <HistorySection
            history={history}
            onPreview={setSelectedHistoryItem}
            onReuse={handleReuseHistory}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
          />
        </main>

        <footer className="text-center mt-12 py-4 text-gray-500">
          <p>Criado com <span className="text-[#4A148C]">♥</span> e a magia de <span className="font-bold">NanoBanana</span>.</p>
        </footer>
      </div>

      <PromptDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        prompts={PREDEFINED_PROMPTS}
        onSelectPrompt={handlePromptSelect}
      />

      {selectedHistoryItem && (
        <HistoryModal 
          item={selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          onReuse={handleReuseHistory}
        />
      )}
    </div>
  );
};

export default App;
