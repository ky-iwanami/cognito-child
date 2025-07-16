import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { get } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import {
  AuthUser,
  fetchAuthSession,
  getCurrentUser,
  signInWithRedirect,
  signOut,
} from "aws-amplify/auth";
import { parseAmplifyConfig } from "aws-amplify/utils";
import packageJson from "../package.json";

const origin = `${window.location.origin}/`;
outputs.auth.oauth = {
  ...outputs.auth.oauth,
  redirect_sign_in_uri: [origin],
  redirect_sign_out_uri: [origin],
};

// 外部APIの設定を環境変数から取得
const EXTERNAL_API_NAME = import.meta.env.VITE_EXTERNAL_API_NAME;
const EXTERNAL_API_ENDPOINT = import.meta.env.VITE_EXTERNAL_API_ENDPOINT;
const EXTERNAL_API_REGION = import.meta.env.VITE_EXTERNAL_API_REGION;

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [externalData, setExternalData] = useState<any[]>([]);
  const [user, setUser] = useState<AuthUser | undefined>(undefined);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);

        const amplifyConfig = parseAmplifyConfig(outputs);

        // 外部APIの設定を追加
        Amplify.configure(
          {
            ...amplifyConfig,
            API: {
              ...amplifyConfig.API,
              REST: {
                ...amplifyConfig.API?.REST,
                [EXTERNAL_API_NAME]: {
                  endpoint: EXTERNAL_API_ENDPOINT,
                  region: EXTERNAL_API_REGION,
                },
              },
            },
          },
          {
            API: {
              REST: {
                headers: async () => {
                  const session = await fetchAuthSession();
                  const idToken = session.tokens?.idToken?.toString();
                  return {
                    Authorization: `Bearer ${idToken}`,
                    "X-App-Name": packageJson.name,
                  };
                },
              },
            },
          }
        );
      } catch (error) {
        await signInWithRedirect({ options: { lang: "ja" } });
      }
    };
    init();
  }, []);

  // 外部APIからデータを取得する関数を修正
  const fetchExternalData = async () => {
    if (!user) return;

    setApiLoading(true);
    setApiError(null);

    try {

      // 外部APIを呼び出す
      const restOperation = get({
        apiName: EXTERNAL_API_NAME,
        path: "/todos",
      });

      const { body } = await restOperation.response;
      const result = await body.json();

      // 型を安全に扱うために型アサーションとオプショナルチェーンを使用
      const responseData = result as Record<string, any>;

      if (
        responseData &&
        typeof responseData === "object" &&
        "todos" in responseData &&
        Array.isArray(responseData.todos)
      ) {
        setExternalData(responseData.todos);
      } else {
        setExternalData(
          Array.isArray(responseData) ? responseData : [responseData]
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      setApiError("外部APIからのデータ取得に失敗しました");
    } finally {
      setApiLoading(false);
    }
  };

  // ユーザーがログインしたら外部APIを呼び出す
  useEffect(() => {
    if (user) {
      fetchExternalData();
    }
  }, [user]);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <div>
        <p>子アプリです</p>
        <p>User: {user?.username || "No user"}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>

      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>

      <h1>外部APIのTodos</h1>
      <button onClick={fetchExternalData} disabled={apiLoading}>
        {apiLoading ? "読み込み中..." : "再取得"}
      </button>

      {apiError && (
        <div style={{ color: "red", margin: "10px 0" }}>エラー: {apiError}</div>
      )}

      {apiLoading ? (
        <p>データを取得中...</p>
      ) : (
        <ul>
          {externalData.length > 0 ? (
            externalData.map((todo) => (
              <li key={todo.id}>
                {todo.content}
                <span
                  style={{
                    fontSize: "0.8em",
                    color: "#888",
                    marginLeft: "10px",
                  }}
                >
                  ({new Date(todo.createdAt).toLocaleString()})
                </span>
              </li>
            ))
          ) : (
            <li>外部APIのTodoがありません</li>
          )}
        </ul>
      )}

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
