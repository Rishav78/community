
var refresh = document.querySelector('.refresh')
var userType = document.querySelector('.CommunityRule')
var cross = document.querySelector('.cross')
var close = document.querySelector('.cls')
var edit = document.querySelector('.edit')
var s = document.querySelector('.editcover')

var table

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

function popup2(data,event){
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
	var Id = event.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var data = JSON.parse(req.responseText)
		var edit = `
		<div class="editcover">
			<div class="edit">
				<div class="heading">
					<h1>Update ${data.CommunityName}<button class="cross">×</button></h1>
					<h6>Created by ${data.Name} ,${data.CreateDate}</h6>
				</div>
				<div class="data">
					<div class="row">
						<div class="name">
							Commuity Name:
						</div>
						<div class="value">
							<input type="text" class="EtextBox" id="Name" value="${data.CommunityName}">
						</div>
					</div>
					<div class="row">
						<div class="name">
							Commuity Status:
						</div>
						<div class="value">
							<select class="EtextBox" id="Status">
								<option>Deactivate</option>
								<option>Activate</option>
							</select>
						</div>
					</div>
					<div class="row">
						<div class="name">
						&nbsp;
						</div>
						<div class="value">
							<button class="update" onclick="updateInfo(event,'${Id}')">Update</button>
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
	req.open('POST','/community/getCommunity')
	req.send(Id)
}

function updateInfo(event,Id){
	var data = {
		CommunityName: document.querySelector('#Name').value,
		Status: document.querySelector('#Status').value
	}

	var req = new XMLHttpRequest()
	req.onload = ()=>{
		document.querySelector('.edit').classList.add('animatereverse')
		table.ajax.reload(null, false);
	}
	req.open('POST',`/community/updateCommunity/${Id}`)
	req.send(JSON.stringify(data))
}

function Discription(event) {
	var Id = event.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		var data = JSON.parse(req.responseText)
		var data = `
		<div class="editcover">
			<div class="about">
				<div class="picAndName">
					<div class="communityImg">
						<img src="/static/${data.CommunityPic}">
					</div>
					<div class="communityName">
						${data.CommunityName}
					</div>
					<span class="cross">×</span>
				</div>
				<div class="discription">
					<div>
						community description
					</div>
					<div class="data">
						${data.Discription}
					</div>
				</div>
				<div class="close">
					<button>Close</button>
				</div>
			</div>
		</div>
		`
		popup2(data,event)
	}
	req.open('POST','/community/getCommunity')
	req.send(Id)
}

$(document).ready(function(){
	table = $('#myTable').DataTable({
		"lengthMenu": [5, 10, 25, 50],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/community/communityList',
	        type: 'POST',
	        "data": function ( d ) {
	          d.MembershipRule   = $('.Role').val();
	        },
	     },
	     "columns": [
	     	{ title : "Community Id", "data": "Id", 'sClass':'CId'},
            { title : "Community Name", "data": "CommunityName", 'sClass':'Cname'},
            { title : "Membership Rule", "data": "MembershipRule", 'sClass':'Mrule'},
            { title : "Community Location", "data": "CommunityLocation", 'sClass':'Clocation'},
            { title : "Community Owner", "data": "Name", 'sClass':'Cowner'},
            { title : "Create Date", "data": "CreateDate", 'sClass':'Cdate'},
            { title : "Action", "data": null, 'orderable' : false, 'sClass':'Action'},
            { title : "Community Pic", "data": null, 'orderable' : false, 'sClass':'pic'},
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        	if(aData.Status == 'Activate'){
	        	$('td:eq(7)', nRow).html(`<img src="/static/${aData.CommunityPic}" style="border: 5px solid green">`)
	        }else{
	        	$('td:eq(7)', nRow).html(`<img src="/static/${aData.CommunityPic}" style="border: 5px solid red">`)
	        }
        	$('td:eq(6)', nRow).html(`<div class="actions"><i class="fa fa-edit icon" onclick="editCommunity(event)"></i><i class="fa fa-info icon" onclick="Discription(event)"></i><div>`)
        }
	});
	$('.Role').on('change', function () {
	    table.ajax.reload(null, false);
	});
	$('.refresh').on('click', function () {
	    table.ajax.reload(null, false);
	});
})

