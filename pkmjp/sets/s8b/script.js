let sites = ['fullcomp', 'cardrush','bigweb','yuyu-tei','clabo'];
let spacerColumnsForSummary = [1,5,9,13,17];
let quantityColumns = [1,2,5,6,9,10,13,14,17,18];

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
        hideQuantity()
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
  } else {
    return $('<th>'+ data +'</th>')
  }
}

function hideQuantity() {
  let quantityItems = Array.from(document.getElementsByClassName('quantityItem'))
  let columnGroup = Array.from(document.getElementsByClassName('column-group'))
  let columnHeaderGroup = Array.from(document.getElementsByClassName('column-header-group'))
  
  quantityItems.forEach(item=>item.classList.add('hidingColumn'))
  columnGroup.forEach(item=>item.setAttribute('span','2'))
  columnHeaderGroup.forEach(item=>item.setAttribute('colspan','2'))
}

function showQuantity() {
  let quantityItems = Array.from(document.getElementsByClassName('quantityItem'))
  let columnGroup = Array.from(document.getElementsByClassName('column-group'))
  let columnHeaderGroup = Array.from(document.getElementsByClassName('column-header-group'))
  
  quantityItems.forEach(item=>item.classList.remove('hidingColumn'))
  columnGroup.forEach(item=>item.setAttribute('span','4'))
  columnHeaderGroup.forEach(item=>item.setAttribute('colspan','4'))
}