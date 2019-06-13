var table;
var refresh = document.querySelector('.refresh')
var close = document.querySelector('#close')
var searchbox = document.querySelector('#number')
var search = document.querySelector('#search')

function del(Id){
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		table.ajax.reload(null, false);
	}
	req.open('GET',`/deletetag/${Id}`)
	req.send()
}

$(document).ready(function(){
	table = $('#myTable').DataTable({
		"lengthMenu": [5, 10, 25, 50],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/tags/tagslist',
	        type: 'POST',
	     },
	     "columns": [
	     	{ title : "Id", "data": "Id", 'sClass':'tagName', 'visible': false},
            { title : "Tag Name", "data": "name", 'sClass':'tagName'},
            { title : "Created By", "data": "CreatedBy", 'sClass':'createdBy'},
            { title : "Created Date", "data": "CreationDate", 'sClass':'CreationDate'},
            { title : "Action","data": null, 'orderable' : false, 'sClass':'action'}
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        	$('td:eq(3)', nRow).html( `<div style="min-width: 100px;"><i onclick="del('${aData.Id}')" class="fa fa-trash-o icon"></i></div>` );
        }
	});
	$('.refresh').on('click', function () {
	    table.ajax.reload(null, false);
	});
})