const useProps = <T extends object, U extends object>(_props: T & U, keys: (keyof T)[]): { props: { [K in keyof T]?: T[K] }, rest: { [K in keyof U]?: U[K] } } => {
  const props: Partial<T> = {} as Partial<T>;
  const rest: Partial<U> = {} as Partial<U>;
  for (const key of Object.keys(_props)) {
    if (keys.includes(key as keyof T)) {
      props[key as keyof T] = _props[key as keyof T];
    } else {
      rest[key as keyof U] = _props[key as keyof U];
    }
  }
  return { props, rest } as { props: T, rest: U };
};

export default useProps;