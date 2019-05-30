
var refresh = document.querySelector('.refresh')
var popup = document.querySelector('.edit')
var close = document.querySelector('#close')
var update = document.querySelector('#editsubmit')
var PCuser = document.querySelector('.status')
var userType = document.querySelector('.Role')
var alert = document.querySelectorAll('.a')

var child;

function sendMail(event){
	console.log('rishav')
	var data = {
		to: document.querySelector('.to').value,
		subject: document.querySelector('.subject').value,
		msg: document.querySelector('.body')
	}
	console.log(data)
	var req = new XMLHttpRequest
	req.onload = ()=>{
		console.log('Mail Send')
		document.querySelector('.mailContainer').classList.add('animatereverse')
	}
	req.open('POST','/sendMail')
	req.send(JSON.stringify(data))
}

function showUpdateBox(event){
	child = event.target.parentNode.parentNode.parentNode.parentNode.childNodes
	document.querySelector('#eheading').innerHTML = `Update ${child[1].textContent.trim()}`
	for(var i=0;i<child.length-1;i++){
		if(child[i].nodeType == 1){
			console.log(document.querySelector('#' + child[i].classList[0]))
			document.querySelector('#' + child[i].classList[0]).value = child[i].textContent.trim()
		}
	}
}

function switchRole(e,msg){
	$.confirm({
	  title: msg,
	  content: "Do you really want switch state...",
	  boxWidth: '350px',
	  useBootstrap: false,
	  buttons: {
	      'Yes': {
	          btnClass: 'btn-success',
	          action: function () {
	            changeActivationState(e)
	          }
	      },
	      'No': {btnClass: 'btn-danger',}
	  }
	});
}

function changeActivationState(e){
	var target = e.target
	var user = target.parentNode.parentNode.parentNode.firstElementChild.textContent.trim()
	var state = target.classList.contains('fa-check-circle') ? "True" : "False"
	console.log(user)
	var data = {
		user : user,
		state : state
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		console.log(target.classList)
		if(target.classList.contains('fa-check-circle')){
			console.log('rishav')
			target.classList.remove('fa-check-circle')
			target.classList.add('fa-times-circle')
			target.setAttribute('onclick','switchRole(event,"Deactivate User")')
			document.querySelector('.added').innerHTML = `User ${user} Activated`
			document.querySelector('.added').classList.add('animate')
		}else{
			console.log('garg')
			target.classList.remove('fa-times-circle')
			target.classList.add('fa-check-circle')
			target.setAttribute('onclick','switchRole(event,"Activate User")')
			document.querySelector('.exist').innerHTML =`User ${user} Deactivated`
			document.querySelector('.exist').classList.add('animate')
		}
	}
	req.open('POST','/Activation')
	req.send(JSON.stringify(data))
}

alert.forEach((value)=>{
	value.addEventListener('animationend',()=>{
		document.querySelector('.animate').classList.remove('animate')
	})
})

update.onclick = ()=>{
	var data = {
		Email : document.querySelector('#username').value,
		Phone : document.querySelector('#phone').value,
		City : document.querySelector('#city').value,
		Status : document.querySelector('#status').value,
		Role : document.querySelector('#role').value,
	}
	for(var i=0;i<child.length-1;i++){
		if(child[i].nodeType == 1){
			child[i].textContent = document.querySelector('#' + child[i].classList[0]).value
		}
	}
	var req = new XMLHttpRequest()
	req.onload = ()=>{
		console.log('updated')
	}
	req.open('POST','/update')
	req.send(JSON.stringify(data))
}


$(document).ready(function(){
	var table = $('#myTable').DataTable({
		"lengthMenu": [5, 10, 25, 50],
		"serverSide": true,
        "processing": true,
		"ajax": {
	        url: '/admin/user',
	        type: 'POST',
	        "data": function ( d ) {
	          d.roleFilter   = $('.Role').val();
	          d.statusFilter = $('.Status').val();
	        },
	     },
	     "columns": [
            { title : "Usename/Email", "data": "Email", 'sClass':'username'},
            { title : "Phone", "data": "Phno", 'sClass':'phone'},
            { title : "City", "data": "City", 'sClass':'city'},
            { title : "Status", "data": "Status", 'sClass':'status'},
            { title : "Role", "data": "Role", 'sClass':'role'},
            { title : "Active", "data": "ActivationState", 'sClass':'active',visible: false },
            { title : "Actions","data": null, 'orderable' : false, 'sClass':'action'}
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
        	if(aData.Role === 'Superadmin'){
        		console.log(aData.Role)
        		$('td:eq(5)', nRow).html( '<div style="min-width: 100px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i></div>' );
        	}else{
        		if(aData.ActivationState == 'True'){
	        		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox(event)" class="fa fa-edit icon"></i></a><i onclick="switchRole(event,'Deactivate User?')" class="fa fa-times-circle icon"></i></div>` );
	        	}else{
	        		$('td:eq(5)', nRow).html( `<div style="min-width: 150px;"><i onclick="nodeMailer(event)" class="fa fa-envelope-o icon"></i><a data-toggle="modal" data-target="#editModal"><i onclick="showUpdateBox(event)" class="fa fa-edit icon"></i></a><i onclick="switchRole(event,'Activate User?')" class="fa fa-check-circle icon"></i></div>`);
	        	}
        	}
        }
	});
	$('.Status').on('change', function () {
	    table.ajax.reload(null, false);
	});
	$('.Role').on('change', function () {
	    table.ajax.reload(null, false);
	});
	$('.refresh').on('click', function () {
	    table.ajax.reload(null, false);
	});
})