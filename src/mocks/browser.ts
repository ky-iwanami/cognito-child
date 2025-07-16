import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Service Workerを設定
export const worker = setupWorker(...handlers);

export const setupMSW = async () => {
    return worker.start({
      onUnhandledRequest: 'bypass', // 未処理のリクエストはバイパス
    }).catch((error) => {
      console.error('MSWの初期化に失敗しました:', error);
    });
};