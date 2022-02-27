let sites = ['fullcomp', 'cardrush','bigweb','yuyu-tei','clabo'];
let quantityCheckboxState = true
let priceCheckboxState = true

function parseSummaryTable(tableData) {
    tableData.pop() // remove last empty object
    var table = $('<table></table>');
    var tableHead = $(`
      <colgroup>
        <col>
        <col span=4 class='column-group'>
        <col>
        <col span=4 class='column-group'>
        <col>
        <col span=4 class='column-group'>
        <col>
        <col span=4 class='column-group'>
        <col>
        <col span=4 class='column-group'>
      </colgroup>
      <tr>
          <th></th>
          <th colspan='4' class='column-header-group'>Fullcomp</th>
          <th class="spacer" />
          <th colspan='4' class='column-header-group'>Cardrush</th>
          <th class="spacer" />
          <th colspan='4' class='column-header-group'>Bigweb</th>
          <th class="spacer" />
          <th colspan='4' class='column-header-group'>Yuyu-tei</th>
          <th class="spacer" />
          <th colspan='4' class='column-header-group'>C-labo</th>
      </tr>
      <tr>
        <th>Rarity</th>
        <!-- Fullcomp -->
        <th class='quantityItem quantityValue'>Stock</th>
        <th class='quantityItem'>Diff</th>
        <th class='priceItem priceValue'>Price</th>
        <th class='priceItem'>Diff</th>
        <th class="spacer" />
        <!-- Cardrush -->
        <th class='quantityItem quantityValue'>Stock</th>
        <th class='quantityItem'>Diff</th>
        <th class='priceItem priceValue'>Price</th>
        <th class='priceItem'>Diff</th>
        <th class="spacer" />
        <!-- Bigweb -->
        <th class='quantityItem quantityValue'>Stock</th>
        <th class='quantityItem'>Diff</th>
        <th class='priceItem priceValue'>Price</th>
        <th class='priceItem'>Diff</th>
        <th class="spacer" />
        <!-- Yuyu-tei -->
        <th class='quantityItem quantityValue'>Stock</th>
        <th class='quantityItem'>Diff</th>
        <th class='priceItem priceValue'>Price</th>
        <th class='priceItem'>Diff</th>
        <th class="spacer" />
        <!-- C-labo -->
        <th class='quantityItem quantityValue'>Stock</th>
        <th class='quantityItem'>Diff</th>
        <th class='priceItem priceValue'>Price</th>
        <th class='priceItem'>Diff</th>
      </tr>
    `)
    table.append(tableHead)
    $(tableData).each(function (i, rowData) {
      let rowString = `
          <tr class="table-content">
          <td>${rowData.card_rarity}</td>
      `
      sites.forEach((site,index)=>{
        let quantityDiffValue = rowData[`${site}_stock_diff`]
        let priceDiffValue = rowData[`${site}_price_diff`]
        let columnGroupString = `
          <td class='quantityItem quantityValue'>${rowData[`${site}_stock_trend`]}${numberWithCommas(rowData[`${site}_latest_stock`])}</td>
          <td class='quantityItem ${getColorClass(quantityDiffValue)}'>${formatDiff(quantityDiffValue)}</td>
          <td class='priceItem priceValue'>${rowData[`${site}_price_trend`]}${numberWithCommas(rowData[`${site}_latest_price`])}</td>
          <td class='priceItem ${getColorClass(priceDiffValue)}'>${formatDiff(priceDiffValue)}</td>
        `
        if (sites.length - 1 != index) {
          columnGroupString = columnGroupString + '<td class="spacer" />'
        }

        rowString = rowString + columnGroupString
      })
      rowString = rowString + '</tr>'
      table.append(rowString);
    });
    return table;
}

function parseMainTable(data) {
  var table = $('<table></table>');
  var tableHead = $(`
    <colgroup>
      <col class='col-group-number'>
      <col class='col-group-name'>
      <col class='col-group-spacer'>
      <col span=4 class='column-group column-group-fullcomp'>
      <col class='col-group-spacer'>
      <col span=4 class='column-group column-group-cardrush'>
      <col class='col-group-spacer'>
      <col span=4 class='column-group column-group-bigweb'>
      <col class='col-group-spacer'>
      <col span=4 class='column-group column-group-yuyu'>
      <col class='col-group-spacer'>
      <col span=4 class='column-group column-group-clabo'>
    </colgroup>
    <tr>
        <th></th>
        <th></th>
        <th class="spacer" />
        <th colspan='4' class='column-header-group'>Fullcomp</th>
        <th class="spacer" />
        <th colspan='4' class='column-header-group'>Cardrush</th>
        <th class="spacer" />
        <th colspan='4' class='column-header-group'>Bigweb</th>
        <th class="spacer" />
        <th colspan='4' class='column-header-group'>Yuyu-tei</th>
        <th class="spacer" />
        <th colspan='4' class='column-header-group'>C-labo</th>
    </tr>
    <tr class='second-header'>
        <td>#</td>
        <td class='header-name'>Name</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Stock</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Stock</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Stock</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Stock</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Stock</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
    </tr>
  `)
  table.append(tableHead)
  data.forEach(row=>{
    let nameClasses = 'card-name high-density'
    let namestyling = `background-image: linear-gradient(to right, rgba(0,0,0,0.9) 25%, transparent),url(./data/cards/${row.card_number}.jpg);`
    let rowString = `
      <tr class='table-content'>
      <td class='card-number'>${row.card_number}</td>
      <td class='${nameClasses}' style="${namestyling}">${row.card_name}</td>
    `

    sites.forEach((site,index)=> {
      let quantityDiffValue = row[`${site}_quantity_diff`]
      let priceDiffValue = row[`${site}_price_diff`]
      let columnString = `
        <td class='spacer'></td>
        <td class='quantityItem quantityValue ${site}'>${row[`${site}_quantity_trend`]}${numberWithCommas(row[`${site}_latest_quantity`])}</td>
        <td class='quantityItem quantityDiff ${site} ${getColorClass(quantityDiffValue)}'>${formatDiff(quantityDiffValue)}</td>
        <td class='priceItem priceValue ${site}'><a target="_blank" href="${row[`${site}_url`]}">${row[`${site}_price_trend`]}${numberWithCommas(row[`${site}_latest_price`])}</a></td>
        <td class='priceItem priceDiff ${site} ${getColorClass(priceDiffValue)}'>${formatDiff(priceDiffValue)}</td>
      `
      rowString = rowString + columnString
    })
    rowString = rowString + "</tr>"
    table.append($(rowString))
  })
  return table
}


$.ajax({
    type: "GET",
    url: "./data/summary.csv",
    success: function (data) {
        $('#summary-table').append(parseSummaryTable(Papa.parse(data,{header:true}).data));
    }
});

$.ajax({
  type: "GET",
  url: './data/main.csv',
  success: function(data) {
    let dataArray = Papa.parse(data,{header: true}).data
    dataArray.pop()

    let urs = dataArray.filter(row=>row.card_rarity == 'UR')
    $('#ur-table').append(parseMainTable(urs))
    
    let hrs = dataArray.filter(row=>row.card_rarity == 'HR')
    $('#hr-table').append(parseMainTable(hrs))

    let srs = dataArray.filter(row=>row.card_rarity == 'SR')
    $('#sr-table').append(parseMainTable(srs))

    let csrs = dataArray.filter(row=>row.card_rarity == 'CSR')
    $('#csr-table').append(parseMainTable(csrs))

    let chrs = dataArray.filter(row=>row.card_rarity == 'CHR')
    $('#chr-table').append(parseMainTable(chrs))
  }
});

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