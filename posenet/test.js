const tf = require('@tensorflow/tfjs-node');
// export TF_CPP_MIN_LOG_LEVEL=2

const posenet = require('@tensorflow-models/posenet');
const {
    createCanvas, Image
} = require('canvas')
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const tryModel = async() => {
    console.log('start');
//    const net = await posenet.load(0.75);

const net = await posenet.load({
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: 513,
  multiplier: 0.75
});


    const img = new Image();
    img.src = './test.jpg';
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const input = tf.browser.fromPixels(canvas);
    const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);
    console.log(pose);
   for(const keypoint of pose.keypoints) {
        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
   }
    console.log('end');
}



tryModel();

