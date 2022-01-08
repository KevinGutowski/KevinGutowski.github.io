let sites = ['fullcomp', 'cardrush','bigweb','yuyu-tei','clabo'];
let spacerColumnsForSummary = [1,5,9,13,17];
let quantityColumns = [1,2,5,6,9,10,13,14,17,18];
let priceColumns = [3,4,7,8,11,12,15,16,19,20];
let quantityCheckboxState = true
let priceCheckboxState = true

function parseSummaryTable(tableData) {
    var table = $('<table></table>');
    var tableHead = $(`
      <colgroup>
        <col>
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
    `)
    table.append(tableHead)
    $(tableData).each(function (i, rowData) {
//      return early due to some issue with csv table?
        if (i == 6) { return }
        var row = $('<tr></tr>');
        $(rowData).each(function (j, cellData) {
            if (spacerColumnsForSummary.includes(j)) {
              if (i == 0) {
                row.append($('<th class="spacer" />'));    
              } else {
                row.append($('<td class="spacer" />'));  
              }
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

$.ajax({
    type: "GET",
    url: "./data/summary.csv",
    success: function (data) {
        $('#summary').append(parseSummaryTable(Papa.parse(data).data));
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