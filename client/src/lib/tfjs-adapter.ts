/* Lightweight TF.js adapter to optionally train/predict a model locally.

This module uses dynamic import so it won't break if @tensorflow/tfjs is not installed.
It exposes trainModelLocal and predictWithLocalModel and persists the TF.js model to IndexedDB.

Model design (simple): inputs = [n_prev, avg_prev_interval, last_interval, time_since_prev], output = predicted retention probability in [0,1].
*/

const MODEL_DB_NAME = "studycycle-tfjs";
const MODEL_STORE_NAME = "recall-model-v1";

export type TfFeatures = {
  n_prev: number;
  avg_prev_interval: number;
  last_interval: number;
  time_since_prev: number;
};

export async function loadTf() {
  try {
    // dynamic import
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tf = await import("@tensorflow/tfjs");
    return tf as typeof import("@tensorflow/tfjs");
  } catch (e) {
    console.warn("TF.js not available", e);
    return null;
  }
}

export async function trainModelLocal(
  samples: { x: TfFeatures[]; y: number[] },
  epochs = 40,
  batchSize = 16
) {
  const tf = await loadTf();
  if (!tf) throw new Error("tfjs not available");

  const xs = tf.tensor2d(
    samples.x.map((r) => [
      r.n_prev,
      r.avg_prev_interval,
      r.last_interval,
      r.time_since_prev,
    ])
  );
  const ys = tf.tensor2d(samples.y.map((v) => [v]));

  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 32, activation: "relu", inputShape: [4] })
  );
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(xs, ys, { epochs, batchSize, shuffle: true });

  // persist model to indexeddb
  await model.save(`indexeddb://${MODEL_STORE_NAME}`);
  xs.dispose();
  ys.dispose();
  return true;
}

export async function predictWithLocalModel(feature: TfFeatures) {
  const tf = await loadTf();
  if (!tf) throw new Error("tfjs not available");
  try {
    const model = await tf.loadLayersModel(`indexeddb://${MODEL_STORE_NAME}`);
    const x = tf.tensor2d([
      [
        feature.n_prev,
        feature.avg_prev_interval,
        feature.last_interval,
        feature.time_since_prev,
      ],
    ]);
    const y = model.predict(x) as any;
    const arr = await y.data();
    x.dispose();
    if (Array.isArray(arr) || arr instanceof Float32Array) return arr[0];
    return Number(arr);
  } catch (e) {
    console.warn("No local model saved or failed to load", e);
    return null;
  }
}

export default { loadTf, trainModelLocal, predictWithLocalModel };
