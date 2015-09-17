// viewer
import append from '../utils/dom/append.js';
import query from '../utils/dom/query.js';
import param from '../utils/string/param.js';
import on from '../utils/events/on.js';

const viewerCSSText =  param({
	position: 'fixed',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	'z-index': 1,
	'background-color': 'rgba(0,0,0,0.8)'
}, ';', ':');

const viewerContentCSSText = param({
	position: 'absolute',
	left: '5%',
	right: '5%',
	top: '5%',
	bottom: '5%',
	'text-align': 'center'
}, ';', ':');

const viewerImgCSSText = param({
	'max-width': '100%',
	'max-height': '100%'
}, ';', ':');

export default (url) => {

	var elm = query('.viewer');
	var content = query('.viewer-content');

	if (!elm) {
		elm = append('div', {'class': 'viewer', style: viewerCSSText});
		var controls = append('div', {'class': 'viewer-controls'}, elm);

		// Create close button
		var close_btn = append('button', {
			'class': 'viewer-close',
			'onclick': () => {
				elm.hidden = true;
			}
		}, controls);
		close_btn.appendChild(document.createTextNode('X'));

		content = append('div', {'class': 'viewer-content', style: viewerContentCSSText}, elm);

		on(document, 'keypress', (e) => {
			if (!elm.hidden && e.keyCode === 32) {
				elm.hidden = true;
				e.preventDefault();
				e.stopPropagation();
			}
		});
	}
	else if(elm.hidden) {
		elm.hidden = false;
	}

	content.innerHTML = '';

	// Create an image there
	var img = append('img', {src: url, style: viewerImgCSSText}, content);
};
