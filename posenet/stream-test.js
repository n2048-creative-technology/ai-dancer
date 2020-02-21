const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

// export TF_CPP_MIN_LOG_LEVEL=2
// ffmpeg -i ../../fullHD/chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - > out.png
// ffmpeg -i ../../fullHD/chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - | node stream-test.js

// ffmpeg -i ../../fullHD/chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:180 -f image2pipe - | node stream-test.js  

const stdin = process.stdin;
const stdout = process.stdout;
let data = '';

const posenet = require('@tensorflow-models/posenet');
const {
    createCanvas, 
    Image,
} = require('canvas')

const canvas = createCanvas(320,180);
const ctx = canvas.getContext('2d');


// var Image = require('image');

const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

let net = null;

stdin.pause();

const poseNet = async() => {
	net = await posenet.load({
	    architecture: 'MobileNetV1',
		outputStride: 16,
		inputResolution: 513,
		multiplier: 0.75
	});
}

poseNet().then(()=>{	
	stdin.resume();

	// stdin.on('data', (chunk) => {
	// 	console.log(chunk.length);

	// 	try{
	// 	    const img = new Image();
	// 	    img.src = chunk;
	// 	    const canvas = createCanvas(1920,1080);
	// 	    const ctx = canvas.getContext('2d');
	// 	    ctx.drawImage(img, 0, 0);
	// 		const input = tf.browser.fromPixels(canvas);
	// 		const pose = 
	// 		net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride)
	// 		.then((p)=>{
	// 			for(const keypoint of p.keypoints) {
	// 		        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
	// 		    }
	// 		});
	// 	}
	// 	catch(err){
	// 		console.error(err)
	// 	}
	// });
	// stdin.on('end', ()=>{
	// 	console.log('END');
	// })
})

const getInput = img => {
	ctx.drawImage(img, 0, 0);
   	const input = tf.browser.fromPixels(canvas);

   	return input;
};

const getPose = input => {
	 net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride)
	.then(p=>{
		for(const keypoint of p.keypoints) {
	        console.log(`${keypoint.part}: (${keypoint.position.x},${keypoint.position.y})`);
	    }
	});	
}

const processImage = _data =>  {
	console.log('START processImage', _data.length);
	const img = new Image();
 	
 	img.onload = () => {
		const input = getInput(img);
		getPose(input); 
 	}

    img.onerror = (err) => console.error(err);
	
	fs.writeFile('/tmp/img.png', _data, function (err) {
	  if (err) throw err;
	  img.src = '/tmp/img.png';
	});


	console.log('END processImage');
}

stdin.on('data', (chunk) => {
	data += chunk;
	console.log(chunk.length, data.length);
	
});

stdin.on('end', ()=>{
	processImage(data);
	console.log('END');
});


// setInterval(()=>{},100);



