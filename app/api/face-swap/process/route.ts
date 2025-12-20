import { NextResponse } from 'next/server';
import { performFaceSwap } from '@/utils/third-party/face-swap';

/**
 * Face Swap Process API
 *
 * 使用 face-api.js + canvas 進行人臉替換
 * 參考 parker-nuxt-lab 的實作方式
 *
 * 功能：
 * - 接收 Base64 編碼的圖片
 * - 使用 face-api.js 偵測人臉
 * - 使用 canvas 進行人臉區域替換
 * - 返回處理後的圖片
 */

interface ProcessRequest {
  sourceImage: string; // Base64 encoded source face image
  targetImage: string; // Base64 encoded target face image
}

interface ProcessResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
  message?: string;
  processingTime?: number;
}

export async function POST(
  request: Request
): Promise<NextResponse<ProcessResponse>> {
  const startTime = Date.now();

  try {
    const body: ProcessRequest = await request.json();
    const { sourceImage, targetImage } = body;

    // Validate inputs
    if (!sourceImage) {
      return NextResponse.json(
        { success: false, error: '缺少來源圖片 (sourceImage)' },
        { status: 400 }
      );
    }

    if (!targetImage) {
      return NextResponse.json(
        { success: false, error: '缺少目標圖片 (targetImage)' },
        { status: 400 }
      );
    }

    // Perform face swap using face-api.js
    const resultImage = await performFaceSwap(sourceImage, targetImage);

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      resultImage,
      processingTime
    });
  } catch (error) {
    console.error('Face swap error:', error);

    const processingTime = Date.now() - startTime;

    // Handle known errors (face detection failures)
    if (
      error instanceof Error &&
      (error.message.includes('無法在') ||
        error.message.includes('Cannot detect'))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          processingTime
        },
        { status: 400 }
      );
    }

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: '請求格式錯誤', processingTime },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '人臉替換處理失敗',
        processingTime
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for API documentation
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'Face Swap Process API',
    version: '3.0.0',
    description: '換臉處理 API (face-api.js + canvas 實作)',
    status: 'functional',
    note: '後端使用 face-api.js 進行人臉偵測和 canvas 進行圖片處理',
    features: [
      '✅ 使用 face-api.js 自動偵測人臉',
      '✅ 使用 canvas 進行圖片處理',
      '✅ 橢圓形遮罩平滑融合',
      '✅ 自動調整人臉大小和位置',
      '✅ 完整的錯誤處理'
    ],
    models: [
      'ssdMobilenetv1 - 人臉偵測',
      'faceLandmark68Net - 人臉特徵點',
      'faceRecognitionNet - 人臉識別'
    ],
    limitations: [
      '需要在圖片中偵測到清晰的人臉',
      '每張圖片只處理一張人臉',
      'Serverless 環境有執行時間限制'
    ],
    endpoints: {
      POST: {
        description: '處理換臉請求',
        body: {
          sourceImage: 'Base64 encoded 來源臉圖片 (必填)',
          targetImage: 'Base64 encoded 目標臉圖片 (必填)'
        },
        response: {
          success: 'boolean',
          resultImage: 'Base64 encoded 結果圖片 (當成功時)',
          error: '錯誤訊息 (當失敗時)',
          processingTime: '處理時間 (毫秒)'
        },
        validation: {
          imageFormat: 'PNG, JPEG, JPG, WebP (Base64 encoded)',
          faceDetection: '自動偵測，無需提供座標'
        }
      },
      GET: {
        description: '取得 API 文件'
      }
    }
  });
}
