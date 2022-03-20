fetch("./cards.json").then(response => {
   return response.json();
}).then(data => render(data.cards));

let pkm = "https://www.pokemon-card.com"
let local = './cardImgs'

function fixURL(url) {
	let split = url.split('/')
	let test =  local + "/" + split[split.length-1]
	return test
}

function render(data) {
	let cardsByIllustrator_set = Array.from(d3.group(data, d=>d.illustrator, d=>d.set.id)).sort((a,b)=>{
		if (a[0].toLowerCase() < b[0].toLowerCase()) { return -1 }
		if (a[0].toLowerCase() > b[0].toLowerCase()) { return 1 }
		return 0
	}).filter(i=>{
		if (i[0].length > 0) {
			return i
		}
	})
	
	let sortedIllustrators = cardsByIllustrator_set.map(el=>el[0])
	let sets = Array.from(d3.group(data,d=>d.set.id)).map(el=>el[0]).sort()
	
	let headings = ['Illustrator'].concat(sets)
	
	let heading = d3.select('#tableHeading')
		.selectAll('.heading')
		.data(headings)
		.enter()
		.append('td')
		.attr('class','heading')
		.text(d=>d)
	
	let row = d3.select('#tableBody')
		.selectAll('tr')
		.data(cardsByIllustrator_set)
		.join('tr')
	
	row.append('td').text(d=>d[0])
	
	let setForArtist = row.selectAll()
    .data((d) => {
			return sets.map(i => d[1].get(i))
		})
    .join("td")
		.append('div')
		.attr('class','setForArtist')
	
let cardContainer = setForArtist
	.selectAll('.cardContainer')
	.data(d=>{
		if (d == undefined) {
			return ""
		} else {
			return d
		}
	})
	.join('div')
	.attr('class','cardContainer')

cardContainer
	.append('div')
	.attr('class','imgContainer')
	.append('img')
	.attr('src',d=>d['img_url'])
	.style('top',d=>{
		if (d['class']['kind'] == 'Trainer') {
			return '-11px'
		} else {
			return '-7px'
		}
	})	
	cardContainer.append('div')
		.attr('class','tooltipContainer')
		.append('img')
		.attr('src',d=>d['img_url'])
		.attr('loading','lazy')
	
	attachTooltips()
}

function attachTooltips() {
	let cardContainers = Array.from(document.querySelectorAll('.cardContainer'))
	
	cardContainers.forEach(card=>{
		let img = card.querySelector('.imgContainer')
		let tooltip = card.querySelector('.tooltipContainer')
		
		const popperInstance = Popper.createPopper(img, tooltip, {
			modifiers: [{
				name: 'offset',
				options: { offset: [0, 12] },
			}],
		})
		
		function show() {
			tooltip.setAttribute('data-show', '');
			// We need to tell Popper to update the tooltip position
			// after we show the tooltip, otherwise it will be incorrect
			popperInstance.update();
		}

		function hide() {
			tooltip.removeAttribute('data-show');
			tooltip.querySelector('img').classList.remove('show')
		}

		const showEvents = ['mouseenter', 'focus'];
		const hideEvents = ['mouseleave', 'blur'];

		showEvents.forEach((event) => {
			img.addEventListener(event, show);
		});

		hideEvents.forEach((event) => {
			img.addEventListener(event, hide);
		});
	})
}

// mobile
function hide() {
	let visibleTooltip = document.querySelector("[data-show='']")
	visibleTooltip.removeAttribute('data-show')
	visibleTooltip.querySelector('img').classList.remove('show')
}

document.getElementsByTagName('body').addEventListener('touchstart',hide)