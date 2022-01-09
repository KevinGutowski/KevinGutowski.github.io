let sites = ['fullcomp', 'cardrush','bigweb','yuyu-tei','clabo'];
let spacerColumnsForSummary = [5,9,13,17];
let quantityColumns = [1,2,5,6,9,10,13,14,17,18];
let priceColumns = [3,4,7,8,11,12,15,16,19,20];
let quantityCheckboxState = true
let priceCheckboxState = true

function parseSummaryTable(tableData) {
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
    `)
    table.append(tableHead)
    $(tableData).each(function (i, rowData) {
//      return early due to some issue with csv table?
        if (i == 6) { return }
        if (i == 0) {
          var row = $('<tr></tr>');
        } else {
          var row = $('<tr class="table-content"></tr>');
        }
        console.log(i)
        $(rowData).each(function (j, cellData) {
            if (spacerColumnsForSummary.includes(j)) {
                row.append($('<td class="spacer" />'));
            }
            if (cellData == 'card_rarity') {
              cellData = 'rarity';
              row.append($('<th>'+cellData+'</th>'));
            } else if (cellData.startsWith(sites[0])) {
              row.append(prepCellData(cellData,j,sites[0]))              
            } else if (cellData.startsWith(sites[1])) {
              row.append(prepCellData(cellData,j,sites[1]))              
            } else if (cellData.startsWith(sites[2])) {
              row.append(prepCellData(cellData,j,sites[2]))              
            } else if (cellData.startsWith(sites[3])) {
              row.append(prepCellData(cellData,j,sites[3]))              
            } else if (cellData.startsWith(sites[4])) {
              row.append(prepCellData(cellData,j,sites[4]))              
            } else {
                if (quantityColumns.includes(j)) {
                  row.append($('<td class="quantityItem">'+numberWithCommas(cellData)+'</td>'));    
                } else if (priceColumns.includes(j)) {
                  row.append($('<td class="priceItem">'+numberWithCommas(cellData)+'</td>'));    
                } else {
                  row.append($('<td>'+numberWithCommas(cellData)+'</td>'));  
                }
                
            }
        });
        table.append(row);
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
        <td class="quantityItem quantityValue">Quantity</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Quantity</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Quantity</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Quantity</td>
        <td class="quantityItem">Diff</td>
        <td class="priceItem priceValue">Price</td>
        <td class="priceItem">Diff</td>
        <td class='spacer'></td>
        <td class="quantityItem quantityValue">Quantity</td>
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
      <td class='spacer'></td>
      <td class='quantityItem quantityValue fullcomp'>${row.fullcomp_quantity_trend}${numberWithCommas(row.fullcomp_latest_quantity)}</td>
      <td class='quantityItem quantityDiff fullcomp'>${numberWithCommas(row.fullcomp_quantity_diff)}</td>
      <td class='priceItem priceValue fullcomp'><a target="_blank" href="${row.fullcomp_url}">${row.fullcomp_price_trend}${numberWithCommas(row.fullcomp_latest_price)}</a></td>
      <td class='priceItem priceDiff fullcomp'>${numberWithCommas(row.fullcomp_price_diff)}</td>
      <td class='spacer'></td>
      <td class='quantityItem quantityValue cardrush'>${row.cardrush_quantity_trend}${numberWithCommas(row.cardrush_latest_quantity)}</td>
      <td class='quantityItem quantityDiff cardrush'>${numberWithCommas(row.cardrush_quantity_diff)}</td>
      <td class='priceItem priceValue cardrush'><a target="_blank" href="${row.cardrush_url}">${row.cardrush_price_trend}${numberWithCommas(row.cardrush_latest_price)}</a></td>
      <td class='priceItem priceDiff cardrush'>${numberWithCommas(row.cardrush_price_diff)}</td>
      <td class='spacer'></td>
      <td class='quantityItem quantityValue bigweb'>${row.bigweb_quantity_trend}${numberWithCommas(row.bigweb_latest_quantity)}</td>
      <td class='quantityItem quantityDiff bigweb'>${numberWithCommas(row.bigweb_quantity_diff)}</td>
      <td class='priceItem priceValue bigweb'><a target="_blank" href="${row.bigweb_url}">${row.bigweb_price_trend}${numberWithCommas(row.bigweb_latest_price)}</a></td>
      <td class='priceItem priceDiff bigweb'>${numberWithCommas(row.bigweb_price_diff)}</td>
      <td class='spacer'></td>
      <td class='quantityItem quantityValue yuyu-tei'>${row['yuyu-tei_quantity_trend']}${numberWithCommas(row['yuyu-tei_latest_quantity'])}</td>
      <td class='quantityItem quantityDiff yuyu-tei'>${numberWithCommas(row['yuyu-tei_quantity_diff'])}</td>
      <td class='priceItem priceValue yuyu-tei'><a target="_blank" href="${row['yuyu-tei_url']}">${row['yuyu-tei_price_trend']}${numberWithCommas(row['yuyu-tei_latest_price'])}</a></td>
      <td class='priceItem priceDiff yuyu-tei'>${numberWithCommas(row['yuyu-tei_price_diff'])}</td>
      <td class='spacer'></td>
      <td class='quantityItem quantityValue clabo'>${row.clabo_quantity_trend}${numberWithCommas(row.clabo_latest_quantity)}</td>
      <td class='quantityItem quantityDiff clabo'>${numberWithCommas(row.clabo_quantity_diff)}</td>
      <td class='priceItem priceValue clabo'><a target="_blank" href="${row.clabo_url}">${row.clabo_price_trend}${numberWithCommas(row.clabo_latest_price)}</a></td>
      <td class='priceItem priceDiff clabo'>${numberWithCommas(row.clabo_price_diff)}</td>
    </tr>
    `
    table.append($(rowString))
  })
  return table
}


$.ajax({
    type: "GET",
    url: "./data/summary.csv",
    success: function (data) {
        $('#summary-table').append(parseSummaryTable(Papa.parse(data).data));
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