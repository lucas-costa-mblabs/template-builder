import {
  Post,
  RemoteTemplateProvider,
  useRemoteFeed,
  type PostType,
} from "@directo/template-builder/react";
import "./App.css";

const config = {
  accountId: "b3e196b8-046e-4092-bc42-aa8425a168d2",
  apiKey: "e8a6f853-d162-44a0-85ec-4479d447e22a",
  customerId: "mock-customer-123",
  baseUrl: "https://api.dev-directoai.com.br",
};

function FeedContent() {
  const { posts, isLoading, error, reload } = useRemoteFeed();

  if (isLoading) {
    return <div style={{ textAlign: "center" }}>Carregando posts...</div>;
  }

  if (error) {
    return (
      <div
        style={{
          margin: "0 auto",
          width: "400px",
          maxWidth: "100%",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#b42318" }}>
          Nao foi possivel carregar os posts agora.
        </p>
        <button type="button" onClick={reload}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
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
      {posts.map((post: PostType, index: number) => (
        <div key={post.id || post.contentId || index}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f7",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <RemoteTemplateProvider
        config={config}
        loadingFallback={
          <div style={{ textAlign: "center" }}>Carregando tema...</div>
        }
      >
        <FeedContent />
      </RemoteTemplateProvider>
    </div>
  );
}

export default App;
