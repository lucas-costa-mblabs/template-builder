import { useContext, useEffect, useMemo, useState } from "react";
import { TemplateContext } from "../context.js";
import { clearRemoteFeedCache, loadRemoteFeed } from "../remoteFeed.js";
const MISSING_CONFIG_ERROR = "useRemoteFeed must receive a config or be used within a <TemplateProvider>";
export function useRemoteFeed({ config: providedConfig, initialPosts, enabled = true, } = {}) {
    const templateContext = useContext(TemplateContext);
    const activeConfig = providedConfig || templateContext?.config;
    const initialData = useMemo(() => initialPosts ?? null, [initialPosts]);
    const [posts, setPosts] = useState(() => initialData ?? []);
    const [isLoading, setIsLoading] = useState(enabled && !initialData);
    const [error, setError] = useState(null);
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
                setError(caughtError instanceof Error
                    ? caughtError
                    : new Error(String(caughtError)));
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
//# sourceMappingURL=useRemoteFeed.js.map