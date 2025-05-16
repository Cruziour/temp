import { useCallback, useEffect, useRef, useState } from 'react';

const useStateWithCallBack = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef();

  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;

    setState((prev) => {
      return typeof newState === 'function' ? newState(prev) : newState;
    });
  }, []);

  useEffect(() => {
    cbRef.current(state);
    cbRef.current = null;
  }, [state]);

  return [state, updateState];
};

export default useStateWithCallBack;
