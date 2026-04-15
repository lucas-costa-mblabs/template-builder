import { RemoteTemplateProvider, Post } from "@directo/template-builder/react";
import "./App.css";

import feedResponse from "../response/feed.response.json";

// ─── App ───

function App() {
  const posts = (feedResponse.data?.feeds || []) as any[];

  return (
    <div
      style={{
        backgroundColor: "#f5f5f7",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <RemoteTemplateProvider
        config={{
          accountId: "0b455c19-e389-4a7f-b83c-ef0cf7286ecb",
          apiKey: "57cbcfd2-fe10-41db-abf3-84bdb569cdae",
          customerId: "mock-customer-123",
          baseUrl: "https://api.dev-directoai.com.br",
        }}
        loadingFallback={<div style={{ textAlign: "center" }}>Carregando feed...</div>}
      >
        <div
          style={{
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "400px",
            maxWidth: "100%",
          }}
        >
          {posts.map((post: any, index: number) => (
            <Post key={post?.id || post?.contentId || index} post={post} />
          ))}
        </div>
      </RemoteTemplateProvider>
    </div>
  );
}

export default App;
