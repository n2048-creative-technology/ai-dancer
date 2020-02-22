important: 

export TF_CPP_MIN_LOG_LEVEL=2


node test.js

// Take 1 frame:
ffmpeg -i ../../chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -f image2pipe -  | node stream-test.js



// export TF_CPP_MIN_LOG_LEVEL=2
// ffmpeg -i ../../chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - > out.png
// ffmpeg -i .././chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:-1 -f image2pipe - | node stream-test.js

// ffmpeg -i ../../chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -vf scale=320:180 -f image2pipe - | node stream-test.js  
