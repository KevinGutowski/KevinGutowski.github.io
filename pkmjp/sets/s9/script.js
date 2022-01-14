let sites = ['fullcomp', 'cardrush','bigweb','yuyu-tei','clabo'];
let quantityCheckboxState = true
let priceCheckboxState = true

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function prepCellData(cellData, column,site) {
  splits = cellData.split(site)[1].split('_');
  data = splits[splits.length - 1];
  if (quantityColumns.includes(column)) {
    return $('<th class="quantityItem">'+ data +'</th>')
  } else if (priceColumns.includes(column)) {
    return $('<th class="priceItem">'+ data +'</th>')
  } else {
    return $('<th>'+ data +'</th>')
  }
}

function showOnlyPricing() {
  let quantityItems = Array.from(document.getElementsByClassName('quantityItem'))
  let priceItems = Array.from(document.getElementsByClassName('priceItem'))
  let columnGroup = Array.from(document.getElementsByClassName('column-group'))
  let columnHeaderGroup = Array.from(document.getElementsByClassName('column-header-group'))
  
  quantityItems.forEach(item=>item.classList.add('hidingColumn'))
  priceItems.forEach(item=>item.classList.remove('hidingColumn'))
  columnGroup.forEach(item=>item.setAttribute('span','2'))
  columnHeaderGroup.forEach(item=>item.setAttribute('colspan','2'))
  
  let checkmarkgroups = Array.from(document.getElementsByClassName('table-controls'))
  checkmarkgroups.forEach(group=>{
    let inputs = Array.from(group.getElementsByTagName('input'))
    inputs[0].checked = false
    inputs[1].checked = true
  })
}

function showQuantityAndPricing() {
  let quantityItems = Array.from(document.getElementsByClassName('quantityItem'))
  let priceItems = Array.from(document.getElementsByClassName('priceItem'))
  let columnGroup = Array.from(document.getElementsByClassName('column-group'))
  let columnHeaderGroup = Array.from(document.getElementsByClassName('column-header-group'))
  
  quantityItems.forEach(item=>item.classList.remove('hidingColumn'))
  priceItems.forEach(item=>item.classList.remove('hidingColumn'))
  columnGroup.forEach(item=>item.setAttribute('span','4'))
  columnHeaderGroup.forEach(item=>item.setAttribute('colspan','4'))

  let checkmarkgroups = Array.from(document.getElementsByClassName('table-controls'))
  checkmarkgroups.forEach(group=>{
    let inputs = Array.from(group.getElementsByTagName('input'))
    inputs[0].checked = true
    inputs[1].checked = true
  })
}

function showOnlyQuantity() {
  let quantityItems = Array.from(document.getElementsByClassName('quantityItem'))
  let columnGroup = Array.from(document.getElementsByClassName('column-group'))
  let priceItems = Array.from(document.getElementsByClassName('priceItem'))
  let columnHeaderGroup = Array.from(document.getElementsByClassName('column-header-group'))
  
  quantityItems.forEach(item=>item.classList.remove('hidingColumn'))
  priceItems.forEach(item=>item.classList.add('hidingColumn'))
  columnGroup.forEach(item=>item.setAttribute('span','2'))
  columnHeaderGroup.forEach(item=>item.setAttribute('colspan','2'))

  let checkmarkgroups = Array.from(document.getElementsByClassName('table-controls'))
  checkmarkgroups.forEach(group=>{
    let inputs = Array.from(group.getElementsByTagName('input'))
    inputs[0].checked = true
    inputs[1].checked = false
  })
}

function updateTable(button) {
  let clickedPricing = (button.name == "pricing" ? true : false)
  let inputs = Array.from(button.parentNode.parentNode.getElementsByTagName('input'))
  let currentStates = inputs.map(input=>input.checked)
  if ((currentStates[0] && currentStates[1]) == false) {
    // toggle other button
    if (clickedPricing) {
      inputs[0].checked = true
    } else {
      inputs[1].checked = true
    }
  }
  
  currentStates = inputs.map(input=>input.checked)
  if (currentStates[0] && currentStates[1]) {
    showQuantityAndPricing()
  } else if (currentStates[0]) {
    showOnlyQuantity()
  } else {
    showOnlyPricing()
  }
}

function getColorClass(number) {
  if (number > 0) {
    return 'positive'
  } else if (number == 0) {
    return 'neutral'
  } else {
    return 'negative'
  }
}

function formatDiff(number) {
    let numberStringWithCommas = numberWithCommas(number)
    if (number > 0) {
      return numberStringWithCommas = '+' + numberStringWithCommas
    } else {
      return numberStringWithCommas
    }
}