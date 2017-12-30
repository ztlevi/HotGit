export default function makeCancelable(promise) {
  let hasCanceled_ = false;
  const wrapperPromise = new Promise((resolve, reject) => {
    promise.then(val => {
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val);
    });
    promise.catch(error => {
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(error);
    });
  });
  return {
    promise: wrapperPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
}
