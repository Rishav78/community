
var refresh = document.querySelector('.refresh')
var userType = document.querySelector('.CommunityRule')
var cross = document.querySelector('.cross')
var close = document.querySelector('.cls')
var edit = document.querySelector('.edit')
var s = document.querySelector('.editcover')

var about = `

`

function popup(data){
document.querySelector('.parent').innerHTML = data;
document.querySelector('.edit').onclick = (event)=>{
	 event.cancelBubble = true;
}
document.querySelector('.cls').onclick = ()=>{
	document.querySelector('.edit').classList.add('animatereverse')
}
document.querySelector('.editcover').onclick = ()=>{
	document.querySelector('.edit').classList.add('animatereverse')
}
	document.querySelector('.edit').classList.add('Manimate')
	document.querySelector('.edit').addEventListener('animationend',(event)=>{
		console.log(event.animationName)
		if(event.animationName == 'down_top'){
			document.querySelector('.editcover').removeChild(document.querySelector('.edit'))
			document.querySelector('.parent').removeChild(document.querySelector('.editcover'))
		}
	})
}

function popup2(data){
document.querySelector('.parent').innerHTML = data;
document.querySelector('.about').onclick = (event)=>{
	 event.cancelBubble = true;
}
document.querySelector('.close > button').onclick = ()=>{
	document.querySelector('.about').classList.add('animatereverse')
}
document.querySelector('.editcover').onclick = ()=>{
	document.querySelector('.about').classList.add('animatereverse')
}
	document.querySelector('.about').classList.add('Manimate')
	document.querySelector('.about').addEventListener('animationend',(event)=>{
		console.log(event.animationName)
		if(event.animationName == 'down_top'){
			document.querySelector('.editcover').removeChild(document.querySelector('.about'))
			document.querySelector('.parent').removeChild(document.querySelector('.editcover'))
		}
	})
}

function editCommunity(event){
	var edit = `
	<div class="editcover">
		<div class="edit">
			<div class="heading">
				<h1>Update first community<button class="cross">×</button></h1>
				<h6>Created by superadmin ,23-Apr-2019</h6>
			</div>
			<div class="data">
				<div class="row">
					<div class="name">
						Commuity Name:
					</div>
					<div class="value">
						<input type="text" name="" class="EtextBox">
					</div>
				</div>
				<div class="row">
					<div class="name">
						Commuity Status:
					</div>
					<div class="value">
						<input type="text" name="" class="EtextBox">
					</div>
				</div>
				<div class="row">
					<div class="name">
					&nbsp;
					</div>
					<div class="value">
						<button class="update">Update</button>
					</div>
				</div>
			</div>
			<div class="close">
				<button class="cls">Close</button>
			</div>
		</div>
	</div>`
	popup(edit);
}

function Discription(event) {
	var data = `
	<div class="editcover">
		<div class="about">
			<div class="picAndName">
				<div class="communityImg">
					<img src="source.gif">
				</div>
				<div class="communityName">
					community first community
				</div>
				<span class="cross">×</span>
			</div>
			<div class="discription">
				<div>
					community description
				</div>
				<div class="data">
					hii
				</div>
			</div>
			<div class="close">
				<button>Close</button>
			</div>
		</div>
	</div>
	`
	popup2(data)
}

$(document).ready(function(){
	var table = $('#myTable').DataTable({
		"lengthMenu": [[10, 25, 50], [ 10, 25, 50]],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/community/communityList',
	        type: 'POST',
	        // "dataSrc": "",
	        // "data": function ( d ) {
	        //   d.roleFilter   = $('.Role').val();
	        //   d.statusFilter = $('.Status').val();
	        // },
	     },
	     "columns": [
            { title : "Community Name", "data": "CommunityName", 'sClass':'Cname'},
            { title : "Membership Rule", "data": "MembershipRule", 'sClass':'Mrule'},
            { title : "Community Location", "data": "CommunityLocation", 'sClass':'Clocation'},
            { title : "Community Owner", "data": "CommunityOwner", 'sClass':'Cowner'},
            { title : "Create Date", "data": "CreateDate", 'sClass':'Cdate'},
            { title : "Action", "data": null, 'sClass':'Action'},
            { title : "Community Pic", "data": null, 'sClass':'pic'},
            // { title : "Community Pic","data": null, 'orderable' : false, 'sClass':'action'}
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        	$('td:eq(6)', nRow).html(`<img src="/static/${aData.CommunityPic}">`)
        	$('td:eq(5)', nRow).html(`<div class="actions"><i class="fa fa-edit icon" onclick="editCommunity(event)"></i><i class="fa fa-info icon" onclick="Discription(event)"></i><div>`)
        }
	});
	// $('.Status').on('change', function () {
	//     table.ajax.reload(null, false);
	// });
	// $('.Role').on('change', function () {
	//     table.ajax.reload(null, false);
	// });
	// $('.refresh').on('click', function () {
	//     table.ajax.reload(null, false);
	// });
})

