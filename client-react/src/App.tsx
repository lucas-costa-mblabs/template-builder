import { TemplateProvider, Post } from "@directo/template-builder/react";
import "./App.css";

// ─── Mock: simulando dados vindos de endpoints ───
import themeResponse from "../response/theme.response.json";
import templateResponse from "../response/template.response.json";
import feedResponse from "../response/feed.response.json";

// ─── App ───

function App() {
  const templates = (templateResponse.data || []) as any[];
  const posts = ((feedResponse.data?.feeds || []) as any[]).map((post) => {
    const hasStructuredTemplate = templates.some(
      (template) => template.templateId === post.templateId,
    );

    // No cenário novo com contextos separados, preferimos o template JSON
    // vindo de `template.response.json` quando houver correspondência.
    if (hasStructuredTemplate) {
      const { template, ...rest } = post;
      return rest;
    }

    return post;
  });

  return (
    <div
      style={{
        backgroundColor: "#f5f5f7",
        minHeight: "100vh",
        padding: "20px 0",
      }}
    >
      <TemplateProvider
        theme={themeResponse.data as any}
        templates={templates as any}
        config={{
          accountId: "0b455c19-e389-4a7f-b83c-ef0cf7286ecb",
          apiKey: "mock-api-key",
          customerId: "mock-customer-123",
          baseUrl: "https://api.dev-directoai.com.br",
        }}
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
      </TemplateProvider>
    </div>
  );
}

export default App;
