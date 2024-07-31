// -------------------------------------------------------------------------- //
//-                                   UTILS                                  -//
// -------------------------------------------------------------------------- //

type PromiseResolversOptions = {
  timeout?: number;
};
export function PromiseResolvers<T>(options?: PromiseResolversOptions) {
  let resolve: (value: T | PromiseLike<T>) => void = () => {};
  let reject: (reason?: any) => void = () => {};

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;

    if (!!options?.timeout) {
      setTimeout(() => {
        reject(new Error('Promise timed out'));
      }, options.timeout);
    }
  });

  return { resolve, reject, promise };
}
