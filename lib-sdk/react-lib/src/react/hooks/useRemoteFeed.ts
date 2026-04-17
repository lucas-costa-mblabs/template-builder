import { useContext, useEffect, useMemo, useState } from "react";

import type { DirectoAiConfig, Post as PostType } from "../../core/types.js";
import { TemplateContext } from "../context.js";
import { clearRemoteFeedCache, loadRemoteFeed } from "../remoteFeed.js";

const MISSING_CONFIG_ERROR =
  "useRemoteFeed must receive a config or be used within a <TemplateProvider>";

export interface UseRemoteFeedOptions {
  config?: DirectoAiConfig;
  initialPosts?: PostType[];
  enabled?: boolean;
}

export interface UseRemoteFeedResult {
  posts: PostType[];
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}

export function useRemoteFeed({
  config: providedConfig,
  initialPosts,
  enabled = true,
}: UseRemoteFeedOptions = {}): UseRemoteFeedResult {
  const templateContext = useContext(TemplateContext);
  const activeConfig = providedConfig || templateContext?.config;
  const initialData = useMemo(() => initialPosts ?? null, [initialPosts]);
  const [posts, setPosts] = useState<PostType[]>(() => initialData ?? []);
  const [isLoading, setIsLoading] = useState(enabled && !initialData);
  const [error, setError] = useState<Error | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    if (!activeConfig) {
      setPosts(initialData ?? []);
      setError(new Error(MISSING_CONFIG_ERROR));
      setIsLoading(false);
      return;
    }

    if (initialData && requestVersion === 0) {
      setPosts(initialData);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    loadRemoteFeed(activeConfig)
      .then((nextPosts) => {
        if (!cancelled) {
          setPosts(nextPosts);
          setIsLoading(false);
        }
      })
      .catch((caughtError) => {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error(String(caughtError)),
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeConfig, enabled, initialData, requestVersion]);

  const reload = () => {
    if (activeConfig) {
      clearRemoteFeedCache(activeConfig);
    }
    setError(null);
    setRequestVersion((current) => current + 1);
  };

  return {
    posts,
    isLoading,
    error,
    reload,
  };
}
