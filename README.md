# ai-dancer

**Status: one-off experiment, not finished, not runnable as-is.**

This repo is an early exploration into comparing/matching human dance movement between two video clips using pose-estimation keypoints. It is not a working tool or trained model — it's a couple of scratch Jupyter notebooks kept from a single exploration session.

## What's actually here

- `data/*.txt` — PoseNet-style keypoint dumps extracted from two short video clips (`2019-10-04_12-03-39.mp4-57.mp4` and `...-78.mp4`), one line per frame, space-separated floats (17 body keypoints x/y per frame).
- `distance.ipynb` — Loads both keypoint sequences, normalizes them relative to the nose position on frame 1, and implements a hand-rolled sequence-alignment "distance" function (roughly nearest-neighbor + round-trip check between the two pose sequences) to score how similar two movement sequences are. It runs and produces one output number (`103`) on the sample data — a working proof of concept for the metric, nothing more.
- `test1.ipynb` — Loads one of the same keypoint files, builds a small bidirectional-LSTM Keras model (`model.summary()` output is captured), and then just prints random NumPy arrays as a shape sanity-check. The model is never trained or connected to real input/output — this notebook stops at "does the model compile."
- `posenet/` — A small Node.js scratch script (`stream-test.js`, `test.js`) for grabbing a single video frame via `ffmpeg` and piping it into a PoseNet JS run; `out.png`/`test.jpg` are leftover sample outputs, not documentation.
- Original README was one line: instructions to `docker pull tensorflow/tensorflow` and run the GPU Jupyter image — i.e. just how the author launched Jupyter for this experiment, not a project description.

## Recommendation context

This was a short, exploratory dance-comparison/motion-analysis experiment (PoseNet keypoints → a custom distance metric, plus an untrained LSTM sketch). It never reached a finished pipeline (no training loop, no real "AI dancer" output, no video generation). Treat it as a reference/scratchpad for the idea, not a usable tool.

## Running (if you want to poke at it)

```
docker pull tensorflow/tensorflow
docker run -it -p 8888:8888 tensorflow/tensorflow:latest-gpu-jupyter
```
Then open `distance.ipynb` or `test1.ipynb` in Jupyter; both notebooks read directly from `data/*.txt` and need no other setup, but they don't do anything beyond what's shown in the saved outputs.
