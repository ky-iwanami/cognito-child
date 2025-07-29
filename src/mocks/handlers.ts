import { http, HttpResponse } from 'msw';
import mockTodos from './data/todos.json';

export const handlers = [
  // GET /todos エンドポイントのモック
  http.get('*/todos', () => {
    return HttpResponse.json({
      todos: mockTodos
    }, {
      status: 200,
    });
  }),

  // その他必要なエンドポイントがあれば追加
]; 