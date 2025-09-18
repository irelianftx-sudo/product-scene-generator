import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { UploadedImage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash-image-preview';

const retryableApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  attempt: number = 1
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error) {
    if (attempt > maxRetries) {
      console.error("API call failed after multiple retries.", error);
      throw error;
    }

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes('safety') ||
        errorMessage.includes('api key') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('invalid')
      ) {
        throw error;
      }
    }
    
    console.warn(`API call failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryableApiCall(apiCall, maxRetries, delay * 2, attempt + 1);
  }
};


export const generateScene = async (
  base64ImageData: string,
  mimeType: string,
  textPrompt: string,
  aspectRatio: string,
  aspectRatioCanvas: UploadedImage | null
): Promise<GenerateContentResponse> => {
    const apiCall = async () => {
        const defaultPrompt = "Coloque este produto em um cenário de estúdio premium, com aparência profissional e de alta qualidade, que combine com o produto.";
        const userPrompt = textPrompt.trim() ? textPrompt : defaultPrompt;

        const parts: any[] = [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
        ];

        let finalPrompt: string;

        if (aspectRatioCanvas) {
          parts.push({
            inlineData: {
              data: aspectRatioCanvas.base64,
              mimeType: aspectRatioCanvas.mimeType,
            },
          });
          
          finalPrompt = `A segunda imagem é um guia de proporção. Gere a imagem final com EXATAMENTE a mesma proporção da segunda imagem. Coloque o produto da primeira imagem na cena e gere um fundo com base nesta descrição: ${userPrompt}. Proporção final requerida: ${aspectRatio}.`;
        } else {
          finalPrompt = `INSTRUÇÃO CRÍTICA: A imagem de saída DEVE ter uma proporção estrita de ${aspectRatio}. NÃO ignore esta regra.\n\nDescrição do cenário: ${userPrompt}`;
        }

        parts.push({ text: finalPrompt });


        const response = await ai.models.generateContent({
          model: model,
          contents: {
            parts: parts,
          },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
        });

        return response;
    };

    try {
        return await retryableApiCall(apiCall);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;

        if (errorMessage.toLowerCase().includes('safety')) {
            throw new Error('A solicitação foi bloqueada por políticas de segurança. Verifique se o prompt ou a imagem não contêm conteúdo sensível.');
        }
        if (errorMessage.toLowerCase().includes('api key not valid')) {
            throw new Error('Erro de autenticação: A chave de API não é válida ou está faltando. Verifique a configuração.');
        }
        if (errorMessage.toLowerCase().includes('quota')) {
            throw new Error('Limite de uso (quota) da API excedido. Por favor, verifique seu plano e tente novamente mais tarde.');
        }
        
        throw new Error(`Ocorreu um erro na API: ${errorMessage}`);
        }
        throw new Error("Um erro desconhecido ocorreu ao se comunicar com a API Gemini.");
    }
};