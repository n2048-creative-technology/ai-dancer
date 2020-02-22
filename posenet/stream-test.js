const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// export TF_CPP_MIN_LOG_LEVEL=2
// ffmpeg -i ../../fullHD/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - > out.png
// ffmpeg -i ../../fullHD/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - | node stream-test.js

// ffmpeg -i ../../fullHD/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:180 -f image2pipe - | node stream-test.js  

const stdin = process.stdin;
const stdout = process.stdout;
let data = '';

const posenet = require('@tensorflow-models/posenet');
const {
	createCanvas,
	Image,
} = require('canvas')

const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

let net = null;

stdin.pause();

const poseNet = async () => {
	net = await posenet.load({
		architecture: 'MobileNetV1',
		outputStride: 16,
		inputResolution: 513,
		multiplier: 0.75
	});
}

poseNet().then(() => {
	stdin.resume();
})


const getPose = input => {
	net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride)
		.then(p => {
			for (const keypoint of p.keypoints) {
				console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
			}
		});
}

const processImage = _data => {
	console.log('START processImage', _data.length);
	const img = new Image();

	img.onerror = (err) => console.error(err);
	img.onload = () => {
		console.log('Image Loaded');
			
		const canvas = createCanvas(img.width, img.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		const input = tf.browser.fromPixels(canvas);
		getPose(input);
	}

	img.src = 'data:image/png;base64, '+_data;

	console.log('END processImage');
}

stdin.on('data', (chunk) => {
	stdin.pause();
	data += chunk;
	console.log(chunk.length, data.length);
	stdin.resume();
});

stdin.on('end', () => {
	processImage(data);
	console.log('END');
});


// setInterval(()=>{},100);



