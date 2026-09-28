import { useCallback, useEffect, useState } from 'react';

// Runs `fn` on mount (and whenever `deps` change). `reload` re-runs it; when data is
// already on screen it refreshes in the background instead of showing the loading state.
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fn, deps);

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: s.data === null, error: null }));
    try {
      setState({ data: await load(), loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    load()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [load]);

  return { ...state, reload };
}
