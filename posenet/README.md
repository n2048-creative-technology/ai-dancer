important: 

export TF_CPP_MIN_LOG_LEVEL=2


node test.js


ffmpeg -i ../../fullHD/chunks/2019-10-12_11-34-22.mp4-342.mp4 -vframes 1 -c:v png -f image2pipe -  | node stream-test.js
