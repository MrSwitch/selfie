import on from './utils/events/on.js';
import ready from './utils/events/ready.js';
import getUserMedia from './utils/support/getUserMedia.js';
import requestAnimationFrame from './utils/support/requestAnimationFrame.js';
import append from './utils/dom/append.js';
import prepend from './utils/dom/prepend.js';
import query from './utils/dom/query.js';
import param from './utils/string/param.js';
import objectFit from './utils/dom/objectfit.js';
import './utils/support/canvasToBlob.js';

import viewer from './lib/viewer.js';

const canvasCSSText = param({
	position: 'absolute',
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
	'background-color': '#ccc'
}, ';', ':');

const videoCSSText = param({
	display: 'none',
}, ';', ':');

const photosCSSText = param({
	position: 'absolute',
	'white-space': 'nowrap',
	'overflow': 'auto',
	height: '10%',
	bottom: 0,
	left: 0,
	right: 0
}, ';', ':');

const imgCSSText = param({
	display: 'inline-block',
	border: '1vh solid white'
}, ';', ':');


var container;
var video, source, stream;


ready(() => {

	// define the container for selfie
	container = query('.selfie');

	// Get
	source = getCanvasContext();

	on(source.canvas, 'click, touchstart', record);

	// Trigger the getUserMedia
	cameraPower();

	// Bind listeners
	on(window, 'resize', getCanvasContext);

	// Bind listeners
	on(document, 'keypress', keypress);
});

function keypress(e) {
	if (e.charCode === 32) {
		record(e);
	}
}

function record(e) {
	// Get the image data from the source
	if (stream && stream.active) {
		source.canvas.toBlob(handleBlob);
	}
	else{
		cameraPower();
	}

	if (e) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function handleBlob(blob) {
	// Create an image in photos
	var photos = getPhotos();

	// URL
	var url = URL.createObjectURL(blob);

	// Create a new image
	prepend('img', {
		src: url,
		height: '100%',
		style: imgCSSText,
		onclick: () => {
			viewer(url);
		}
	}, photos);

	// Ensure its in focus
	photos.scrollLeft = 0;
}

function cameraPower() {
	getUserMedia({video: true, audio: true}, cameraOn, cameraOff);
}

function cameraOn(_stream) {

	stream = _stream;

	// turn the stream into a Object and apply it to a video tag.
	video = getVideo(_stream);

	// Get the canvas we're going to draw
	source = getCanvasContext();

	// Start drawing the video to the canvas
	draw();
}

function draw() {
	// draw the image so that the content puts it into the
	let [x,y,w,h] = objectFit(video.videoWidth, video.videoHeight, source.canvas.width, source.canvas.height);

	// Draw to the source
	source.drawImage(video, x, y, w, h);

	// Do this repeatedly
	requestAnimationFrame(draw);
}

function cameraOff(e) {
	// Process an error event
	console.log(e);
}


function getVideo(stream) {

	var elm = query('#source', container);

	if (!elm) {
		elm = append('video', {id: 'source', style: videoCSSText, hidden:true}, container);
	}

	// Apply the document object reference
	elm.src = window.URL.createObjectURL(stream);

	// Ensure this is muted, we dont want to hear ourselves
	elm.muted = true;

	// Play content, not sure both are required, but hey
	elm.autoplay = true;
	elm.play();

	// Attach the stream to the UI
	elm.onerror = function(event) {
		stream.stop();
	};

	return elm;
}


function getCanvasContext() {

	var elm = query('canvas', container);

	if (!elm) {
		elm = append('canvas', {style: canvasCSSText}, container);
	}
	// Ensure the canvas object fills the screen
	elm.width = elm.clientWidth;
	elm.height = elm.clientHeight;


	// Get Canvas Context
	return elm.getContext('2d');
}


function getPhotos() {

	var elm = query('div.photos');

	if (!elm) {
		elm = append('div', {'class': 'photos', style: photosCSSText}, container);
	}

	return elm;
}
